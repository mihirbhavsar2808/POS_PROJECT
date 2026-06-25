import { IoIosArrowBack } from "react-icons/io";
import Checkout from "../Checkout";
import Header from "../Header";
import SearchBar from "../SearchBar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchProducts from "../../hooks/useFetchProducts";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

interface cartItems extends Product {
	quantity: number;
}

const MostProduct = () => {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [cartItems, setCartItems] = useState<cartItems[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const {products,allProducts,setProducts} = useFetchProducts();
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);
  const categories = [
    "Shirt",
    "T-shirt",
    "Top",
    "Pants",
    "Jeans",
    "Trousers",
    "Dress",
  ];

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
    const existingItem = cartItems.find(item => item.id === product.id)

		let updatedCart;
    if (existingItem) {
			updatedCart = cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
		} else {
			updatedCart = [...cartItems, { ...product, quantity: 1 }];
		}
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }, []);
    
  return (
    <div className="h-screen flex flex-col ">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col w-full lg:w-[70%] overflow-auto p-4">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center justify-between px-4 sm:px-6 mt-2">
            <Link to="/" className="flex items-center">
              <IoIosArrowBack size={20} />
              <span className="text-xl font-bold ml-2">Most purchase product</span>
            </Link>

            <button
              className="md:hidden p-2 bg-[#E9DCCF] rounded-lg"
              onClick={() => setShowMobileCategories(!showMobileCategories)}
            >
              <BsThreeDotsVertical size={20} />
            </button>
          </div>

          <div className="hidden md:flex gap-2 flex-wrap px-4 sm:px-6 mt-4">
            {categories.map((item) => (
              <div
                key={item}
                className="py-2 px-4 bg-[var(--primary)] rounded-lg cursor-pointer text-sm font-medium"
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {showMobileCategories && (
            <div className="md:hidden flex flex-col gap-2 px-4 sm:px-6 mt-3">
              {categories.map((item) => (
                <div
                  key={item}
                  className="py-2 px-4 bg-[var(--primary)] rounded-lg cursor-pointer text-sm font-medium"
                  onClick={() => setSelectedCategory(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 scrollbar-hide rounded-md pb-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleAddToCart(product)}
                className="flex h-24 justify-between items-center p-4 rounded-md bg-(--bgorder) shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                  src={`http://localhost:5000/uploads/${product.thumbnail}`}
                    alt={product.title}
                    className="w-16 h-16 rounded-sm object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-base">{product.title}</h3>
                    <p className="text-sm text-gray-500">Size - 30 UK</p>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
          <Checkout />
        </div>
      </div>
    </div>
  );
};

export default MostProduct;
