import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useEffect, useState } from "react";


interface Product {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  stock: number;

}

interface CartItems extends Product {
  quantity: number;
}

interface Column<T> {
  Header: string;
  accessor: keyof T;
}

interface CollectionListProps {
  columns: Column<Product>[];
  data: Product[];
  collectionCartItems: CartItems[];
  setCollectionCartItems: React.Dispatch<React.SetStateAction<CartItems[]>>;
}

const CollectionList: React.FC<CollectionListProps> = ({
  columns,
  data,
  collectionCartItems,
  setCollectionCartItems,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryQuantities, setCategoryQuantities] = useState<Record<string, number>>({});

  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Product[]>);

  useEffect(() => {
    const totals: Record<string, number> = {};
    for (const item of collectionCartItems) {
      totals[item.category] = (totals[item.category] || 0) + item.quantity;
    }
    setCategoryQuantities(totals);

  }, [collectionCartItems]);

  const toggleCategory = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const handleQuantity = (product: Product, value: string) => {
    const qty = parseInt(value);
    if (!isNaN(qty) && qty > 0) {
      const exists = collectionCartItems.find((p) => p.id === product.id);
      if (exists) {
        setCollectionCartItems((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, quantity: qty } : p
          )
        );
      } else {
        setCollectionCartItems((prev) => [...prev, { ...product, quantity: qty }]);
      }
    }
  };
  return (
    <div className="rounded-t-xl shadow-md overflow-hidden">
      <div className="h-[60vh] overflow-y-auto rounded-t-xl shadow-md scrollbar-hide">
        <table className="w-full table-fixed text-sm text-gray-700 text-left">
          <thead className="bg-[#2b2a28] sticky top-0 text-white">
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor)} className="p-5 border-b font-medium">
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-(#EBDFD1) divide-y">
            {Object.entries(groupedData).map(([category, products]) => {
              const totalQty = categoryQuantities[category] || 0;
              return (
                <React.Fragment key={category}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer "
                    onClick={() => toggleCategory(category)}
                  >
                    <td className="p-2 border-b border-(--primary) px-6">
                      <img
                        src={products[0].thumbnail}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-5 border-b border-(--primary) font-medium">{category}</td>
                    <td className="p-5 border-b border-(--primary) font-medium">{products.length}</td>
                    <td className="p-5 border-b border-(--primary) font-medium ">
                      <td className="flex items-center justify-end gap-2 ">

                        {totalQty > 0 && (
                          <span className="font-medium bg-(--secondary) px-3 py-2 text-xl text-black rounded-xl">
                            {totalQty}
                          </span>
                        )}
                        {expandedCategory === category ? <FaChevronUp /> : <FaChevronDown />}
                      
                      </td>
                    </td>
                  </tr>
                  {expandedCategory === category &&
                    products.map((product) => {
                      const item = collectionCartItems.find((p) => p.id === product.id);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="p-2 border-b border-(--primary) px-6">
                            <img
                              src={product.thumbnail}
                              className="h-12 w-12 object-cover rounded" />
                          </td>
                          <td className="p-5 border-b border-(--primary) font-medium">{product.title}</td>
                          <td className="p-5 border-b border-(--primary) font-medium">{product.stock}</td>
                          <td className="p-5 border-b border-(--primary) text-right font-medium">
                            {item ? (
                              <span className="bg-(--secondary) text-black px-3 py-3 rounded-xl text-sm">
                                {item.quantity}
                              </span>
                            ) : (
                              <input
                                type="number"
                                className="border px-2 py-1 rounded w-16"
                                placeholder="Qty"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleQuantity(product, (e.target as HTMLInputElement).value);
                                  }
                                }}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}

                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionList;