import useFetchProducts from "../../hooks/useFetchProducts";

type InventoryListProps = {
  searchQuery: string;
};

const InventoryList = ({ searchQuery }: InventoryListProps) => {
  const {products} =useFetchProducts()

const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery) ||
      product.price.toString().toLowerCase().includes(searchQuery)
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 overflow-y-auto space-y-3 max-h-[320px] px-5 scrollbar-hide">
      {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex h-24 justify-between items-center p-4 rounded-md bg-(--bgorder) border shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-16 h-16 rounded-sm object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-base">{product.title}</h3>
                    <p className="text-sm text-gray-500">Size - 3 UK</p>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  ₹{product.price}
                </div>
              </div>
            ))}
    </div>
  );
};

export default InventoryList;
