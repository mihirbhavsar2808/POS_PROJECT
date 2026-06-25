import React, { useEffect, useState } from "react";
import Header from "../Header";
import SearchBar from "../SearchBar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useFetchProducts from "../../hooks/useFetchProducts";


interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  name?: string;
  phone?: string;
}

interface HoldOrder {
  id: string;
  cartItems: CartItem[];
  totalAmount: string;
  customer?: Customer;
}

const Inventory = () => {
  const navigate = useNavigate();
  const categories = ["All", "beauty", "fragrances", "furniture", "groceries"];
  const { products, setProducts, allProducts } = useFetchProducts();
  // const [orderNo, setOrderNo] = useState<number>(1);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const selectedOrderRaw = localStorage.getItem("selectedOrder");
    if (selectedOrderRaw) {
      try {
        const selectedOrder: HoldOrder = JSON.parse(selectedOrderRaw);
        setCartItems(selectedOrder.cartItems || []);
        localStorage.setItem("cart", JSON.stringify(selectedOrder.cartItems || []));
        localStorage.removeItem("selectedOrder");

      } catch (err) {
        console.log("Invalid selectedOrder in localstorage", err);
      }
    }
  }, []);
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increseQty = (id: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const decreseQty = (id: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const selectedDiscount = localStorage.getItem("selectedDiscount") || "18%";
  const discountReason =
    localStorage.getItem("discountReason") || "Default Discount";
  const discountPercent = parseFloat(selectedDiscount.replace("%", ""));
  const discount = subtotal * (discountPercent / 100);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const holdOrdersRaw = localStorage.getItem("holdOrders");
    const holdOrders: HoldOrder[] = holdOrdersRaw
      ? JSON.parse(holdOrdersRaw)
      : [];

    const possibleIDs = ["001", "002", "003", "004"];
    const usedIDs = holdOrders.map((o) => o.id);
    const availableID = possibleIDs.find((id) => !usedIDs.includes(id));

    if (availableID) {
      const newOrder: HoldOrder = {
        id: availableID,
        cartItems,
        totalAmount: total.toFixed(2),
        customer: { name: customerName || "Guest" },
      };

      const updatedOrders = [...holdOrders, newOrder];
      localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));
      localStorage.setItem("currentOrderID", availableID);
      localStorage.setItem("lastOrder", JSON.stringify(newOrder));
      localStorage.setItem("customer", JSON.stringify(newOrder.customer));
      setCartItems([]);
      localStorage.removeItem("cart");
    }

    localStorage.setItem("totalAmount", total.toFixed(2));
    navigate("/bill");
  };




  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    setProducts(filtered);
  };

  const saveToHoldOrder = (customer: string) => {
    const holdOrdersRaw = localStorage.getItem("holdOrders");
    const holdOrders: HoldOrder[] = holdOrdersRaw
      ? JSON.parse(holdOrdersRaw)
      : [];

    const possibleIDs = ["001", "002", "003", "004"];
    const usedIDs = holdOrders.map((o) => o.id);
    const availableID = possibleIDs.find((id) => !usedIDs.includes(id));

    if (!availableID) {
      return null;
    }

    const newOrder: HoldOrder = {
      id: Date.now().toString(),
      cartItems,
      totalAmount: total.toFixed(2),
      customer: { name: customer },
    };

    const updatedOrders = [...holdOrders, newOrder];
    localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));

    window.dispatchEvent(new Event("holdOrdersUpdated"));

    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const handleHoldOrder = () => {
    setShowCustomerInput(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    saveToHoldOrder(customerName.trim());
    setCustomerName("");
    setShowCustomerInput(false);
  }
  return (

    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-col justify-between lg:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col  w-full lg:w-[70%] overflow-auto p-4 gap-2">
          <SearchBar onSearch={handleSearch} />
          <div className="flex items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center">
              <IoIosArrowBack size={20} />
              <span className="text-xl font-bold ml-2">INVENTORY</span>
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
                  ${product.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/request"
            className="flex items-center gap-1 font-medium text-black px-8 pb-4"
          >
            <span>Request Inventory</span>
            <IoIosArrowForward size={20} />
          </Link>
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
              <button
                className="bg-(--main) w-full text-white px-4 rounded-md"
                onClick={handleHoldOrder}
              >
                Hold this order
              </button>
            </div>

            {showCustomerInput && (
              <form
                onSubmit={handleSaveCustomer}
                className="p-4 bg-white rounded-lg mb-3"

              >
                <input
                  type="text"
                  placeholder="Enter Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border p-2 rounderd w-full"
                />

                <button type="submit"
                  className="mt-2 bg-[var(--main)] text-white px-4 py-2 rounderd-md w-full"> Submit</button>
              </form>
            )}
            <hr className="mb-2 opacity-20" />
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[33vh] rounded-lg scrollbar-hide">
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
                        <p className=" text-gray-500">
                          ₹{item.price.toFixed(2)}
                        </p>
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => decreseQty(item.id)}
                        >
                          -
                        </button>
                        <span className="px-2 text-1">{item.quantity}</span>
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => increseQty(item.id)}
                        >
                          {" "}
                          +{" "}
                        </button>
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
            </div>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center bg-white rounded-xl px-4 py-2 mb-4">
              <input
                type="text"
                placeholder="Discount"
                className="bg-white text-sm text-black placeholder-black focus:outline-none w-full"
              />
              <Link
                to="/discount"
                className="bg-(--buttonbg) text-sm font-semibold px-4 py-1.5 rounded-md ml-2 flex items-center justify-center"
              >
                ADD
              </Link>

              {cartItems.length !== 0 && (
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-xl px-4 py-2 mb-4">
                    <input
                      type="text"
                      placeholder="Discount"
                      className="bg-white text-sm text-black placeholder-black focus:outline-none w-full"
                    />
                    <button className="bg-(--buttonbg) text-sm font-semibold px-4 py-1.5 rounded-md ml-2">
                      <Link to="/discount">ADD</Link>
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal • {cartItems.length} items</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Discount (-{discountPercent}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-400">{discountReason}</div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (+8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="bg-(--main) w-full text-white font-semibold py-2 rounded-md block cursor-pointer text-center"
                  >
                    CHECKOUT &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
};

export default Inventory;
