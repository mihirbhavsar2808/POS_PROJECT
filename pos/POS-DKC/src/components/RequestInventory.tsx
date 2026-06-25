import Header from "./Header";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CollectionList from "./CollectionList";
import BagOrderInput from "./BagList";
import { IoIosArrowBack } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  stock: number;
}

interface CartItems extends Product {
  quantity: number;
}

const RequestInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [activeTab, setActiveTab] = useState<"Inventory" | "Collection" | "Bag">("Inventory");
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [collectionCartItems, setCollectionCartItems] = useState<CartItems[]>([]);
  const navigate = useNavigate();

  const handleInventory = () => {
    const loginTimestamp = Date.now();
    const normalItems = cartItems;
    const collectionItems = collectionCartItems;
    const categoryTotals: Record<string, { quantity: number; thumbnail?: string }> = {};
    collectionItems.forEach((item) => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = {
          quantity: item.quantity,
          thumbnail: item.thumbnail || "",
        };
      } else {
        categoryTotals[item.category].quantity += item.quantity;
      }
    });


    const formattedInventory = normalItems.map((item) => ({
      name: item.title,
      price: item.price,
      quantity: item.quantity,
      status: "Completed",
      thumbnail: item.thumbnail,
      type: "inventory",
      timestamp: loginTimestamp,
    }));


    const formattedCollections = Object.entries(categoryTotals)
      .filter(([category]) => category !== "Bag")
      .map(([category, item]) => ({
        name: category,
        quantity: item.quantity,
        status: "Completed",
        type: "collection",
        timestamp: loginTimestamp,
      }));

    const formattedBag = Object.entries(categoryTotals)
      .filter(([category]) => category === "Bag")
      .map(([category, item]) => ({
        name: category,
        quantity: item.quantity,
        status: "Completed",
        type: "bag",
        category: "bag",
        timestamp: loginTimestamp,
      }));


    const formattedItems = [
      ...formattedInventory,
      ...formattedCollections,
      ...formattedBag,
    ];


    const existingActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    const updatedActivities = [...existingActivities, ...formattedItems];
    localStorage.setItem("activities", JSON.stringify(updatedActivities));


    setCartItems([]);
    setCollectionCartItems([]);
    localStorage.removeItem("cart");


    navigate("/activity");
  };


  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setAllProducts(data.products);
      })
      .catch((err) => console.error("Error fetching products:", err));

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart: CartItems[] = JSON.parse(savedCart);
      setCartItems(parsedCart.filter(item => item.category !== "Bag" && item.category !== "Collection"));
      setCollectionCartItems(parsedCart.filter(item => item.category === "Bag" || item.category === "Collection"));
    }
  }, []);



  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify([...updatedCart, ...collectionCartItems]));
  };


  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify([...updatedCart, ...collectionCartItems]));
  };


  const handleClearCart = () => {
    setCartItems([]);
    setCollectionCartItems([]);
    localStorage.removeItem("cart");

  };

  const increseQty = (id: number) => {
    const updated = cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify([...updated, ...collectionCartItems]));

  }

  const decreseQty = (id: number) => {
    const updated = cartItems.map(item => item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item)
      .filter(item => item.quantity > 0)

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify([...updated, ...collectionCartItems]));

  }

  const getCategoryWiseQuantity = (items: CartItems[]) => {
    const result: Record<string, number> = {};
    items.forEach(item => {
      if (item.quantity > 0) {
        result[item.category] = (result[item.category] || 0) + item.quantity;
      }
    });
    return result;
  }
  const collectionColumns = [
    { Header: "Image", accessor: "thumbnail" },
    { Header: "Category", accessor: "category" },
    { Header: "No Of Products", accessor: "stock" },
    { Header: "", accessor: "category" }
  ] satisfies { Header: string; accessor: keyof Product }[];


  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-col justify-between lg:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 w-full lg:w-[70%] overflow-auto p-4">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center justify-between px-4 sm:px-6 mt-2">
            <Link to="/" className="flex items-center">
              <IoIosArrowBack size={20} />
              <h1 className="text-xl font-bold">REQUEST INVENTORY</h1>
            </Link>
            <button
              className="md:hidden p-2 bg-[#E9DCCF] rounded-lg"
              onClick={() => setShowMobileCategories(!showMobileCategories)}
            >
              <BsThreeDotsVertical size={20} />
            </button>
          </div>

          <div className="hidden md:flex gap-2 px-4 sm:px-10 mt-4">
            {["Inventory", "Collection", "Bag"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "Inventory" | "Collection" | "Bag")}
                className={`p-4 rounded-xl font-semibold w-[200px] flex justify-center text-lg transition-all duration-200 shadow-sm ${activeTab === tab
                  ? "bg-neutral-800 text-[#EEE2D9]"
                  : "bg-[#EEE2D9] text-neutral-800"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {showMobileCategories && (
            <div className="md:hidden flex flex-col gap-2 px-4 sm:px-6 mt-3">
              {["Inventory", "Collection", "Bag"].map((item) => (
                <div
                  key={item}
                  className="py-2 px-4 bg-[var(--primary)] rounded-lg cursor-pointer text-sm font-medium"
                  onClick={() => setActiveTab(item as "Inventory" | "Collection" | "Bag")}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
            {activeTab === "Inventory" ? (
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 scrollbar-hide rounded-md pb-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="flex h-24 justify-between items-center p-4 rounded-md bg-(--bgorder) shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-16 rounded-sm object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-base">{product.title}</h3>
                        <p className="text-sm text-gray-500">Size - 30 UK</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      ₹{product.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "Collection" ? (



              <CollectionList
                columns={collectionColumns}
                data={products}
                collectionCartItems={collectionCartItems}
                setCollectionCartItems={setCollectionCartItems}
              />

            ) : (
              <BagOrderInput
                onBagQuantitySubmit={(qty) => {
                  const withoutBag = collectionCartItems.filter(item => item.category !== "Bag");

                  const bagItem = {
                    id: -999,
                    title: "Bag",
                    price: 0,
                    thumbnail: "",
                    category: "Bag",
                    stock: 0,
                    quantity: qty,
                  };

                  const updated = [...withoutBag, bagItem];

                  setCollectionCartItems(updated);
                  localStorage.setItem("cart", JSON.stringify([...cartItems, ...updated]));
                }}

              />


            )}
          </div>
        </div>

        <div className="w-full lg:w-[30%] bg-(--secondary) flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="w-full h-full bg-[var(--secondary)] flex flex-col">
            <div className="flex justify-center gap-3 mb-2">
              <button
                onClick={handleClearCart}
                className="bg-white w-full text-black py-2 px-4 rounded-md"
              >
                Clear cart
              </button>
            </div>
            <hr className="mb-2 opacity-20" />
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[75vh] rounded-lg scrollbar-hide">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 rounded-lg"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-sm object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <div className="flex space-x-1">
                        <p className=" text-gray-500">${item.price.toFixed(2)}</p>
                        <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => decreseQty(item.id)}>
                          -
                        </button>
                        <span className="px-2 text-1">{item.quantity}</span>
                        <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => increseQty(item.id)}> + </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              {Object.entries(getCategoryWiseQuantity(collectionCartItems)).map(([category, quantity]) => (
                <div key={category} className="justify-between items-center  bg-white p-3 rounded-lg" >
                  <div className="flex justify-between">
                    <label htmlFor="font-medium">{category}</label>
                    <button
                      onClick={() =>
                        setCollectionCartItems(prev =>
                          prev.filter(item => item.category !== category)
                        )
                      }
                      className=""
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-full p-2  outline-none rounded-md bg-(--secondary)" />
                </div>
              ))}
            </div>
            <button
              className="bg-[var(--main)] text-white font-semibold py-2 rounded-md block text-center"
              onClick={handleInventory}
            >
              SEND &gt;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RequestInventory;