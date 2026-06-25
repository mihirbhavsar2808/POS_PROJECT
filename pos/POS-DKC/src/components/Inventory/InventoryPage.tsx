import { useEffect, useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../Header";
import SearchBar from "../SearchBar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import useFetchProducts from "../../hooks/useFetchProducts";
import Cart from "../Cart";
import ProductCard from "../Products/ProductCard";
import { useCart } from "../../auth/cartContext";
import {
  createHoldOrder,
  getSingleHoldOrder,
  // deleteHoldOrder,
} from "../../api/apiServices";
import { createOrder } from "../../api/apiServices";

const ItemType = "PRODUCT";

interface Product {
  _id: string;
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  quantity: number;      // ✅ add this
  initialStock?: number; // ✅ optional (used in UI)
}

const DraggableWrapper: React.FC<{
  product: Product;
  children: React.ReactNode;
}> = ({ product, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: product,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) drag(node);
      }}
      style={{ opacity: isDragging ? 0.85 : 1, cursor: "grab" }}
    >
      {children}
    </div>
  );
};

const CartDropWrapper: React.FC<{
  onDrop: (item: Product) => void;
  children: React.ReactNode;
}> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: Product) => {
      if (!item) return;
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      className="flex-1 overflow-y-auto space-y-3 rounded-lg scrollbar-hide"
      style={{ backgroundColor: isOver ? "#f3f4f6" : "transparent" }}
    >
      {children}
    </div>
  );
};

const InventoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();

  const { cart, setCart, addToCart } = useCart();
  const { products, setProducts, allProducts } = useFetchProducts();

  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCustomerInput, setShowCustomerInput] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerphone, setCustomerPhone] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  /* 🔥 Only added for coupon */
  const [discountPercent, setDiscountPercent] = useState<number>(18);
  const [discountReason, setDiscountReason] = useState<string>("Default Discount");
  const isProcessing = useRef(false);

  /* Apply coupon when coming from Discount page */
  useEffect(() => {
    const state: any = location.state;

    if (state?.discountPercent) {
      setDiscountPercent(Number(state.discountPercent));
      setDiscountReason(state.discountReason || "Coupon Applied");

      // Clear state so it doesn't reapply repeatedly
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  useEffect(() => {

    const state: any = location.state;

    if (state?.cartItems) {
      setCart(
        state.cartItems.map((item: any) => ({
          ...item,
          stock: item.stock ?? item.quantity, // fallback
        }))
      );
    }

  }, [location.state]);

  /* ===== Resume Hold Order ===== */
  useEffect(() => {
    if (!id) return; // ✅ do nothing for normal order

    const loadOrder = async () => {
      try {
        const data = await getSingleHoldOrder(id);
        setCart(
          data.cartItems.map((item: any) => ({
            ...item,
            stock: item.stock ?? item.quantity, // ✅ fallback
          }))
        );
        setCustomerName(data.customer?.name || "");
        setCustomerPhone(data.customer?.phone || "");
        setDiscountPercent(data.discountPercent || 18);
        setDiscountReason(data.discountReason || "Default Discount");
      } catch (err) {
        console.log(err);
      }
    };

    loadOrder();
  }, [id]);

  /* ===== Cart ===== */
  const handleAddToCart = (product: Product) => {
    addToCart({
      ...product,
      stock: product.quantity,
    });
  };
  const handleDropToCart = (product: Product) =>
    addToCart({
      ...product,
      stock: product.quantity,
    });
  const handleClearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = subtotal * (discountPercent / 100);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

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

  /* ===== Hold Order ===== */
  const handleHoldOrder = () => {
    setShowCustomerInput(true);
  };

  const saveToHoldOrder = async (name: string, phone: string) => {
    try {

      await createHoldOrder({
        cartItems: cart,
        subtotal,
        discountPercent,
        discountReason,
        discountAmount: discount,
        tax,
        totalAmount: total,
        customer: { name, phone },
        status: "Ongoing"
      });

      setCart([]);
      setShowCustomerInput(false);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerphone.trim()) return;
    saveToHoldOrder(customerName.trim(), customerphone.trim());
  };

  /* ===== Checkout ===== */
  // const handleCheckout = () => {
  //   if (cart.length === 0) return;

  //   navigate("/bill", {
  //     state: {
  //       cartItems: cart,
  //       totalAmount: total,
  //       discountPercent,
  //       discountReason,
  //     },
  //   });
  // };


  // const handleCheckout = async () => {

  //   if (creatingOrder || cart.length === 0) return;

  //   setCreatingOrder(true);

  //   try {

  //     const order = await createOrder({
  //       customer: null,
  //       cartItems: cart,

  //       subtotal,
  //       discountPercent,
  //       discountReason,
  //       discountAmount: discount,
  //       tax,

  //       totalAmount: total,
  //       paymentMethod: null,
  //       status: "Ongoing"
  //     });

  //     setCart([]);   // clear cart immediately

  //     navigate("/bill", { state: order });

  //   } catch (err) {
  //     console.log(err);
  //   }

  // };

  const handleCheckout = async () => {
    if (isProcessing.current || cart.length === 0) return;

    isProcessing.current = true; // 🔒 LOCK

    try {
      const order = await createOrder({
        customer: null,
        cartItems: cart,
        subtotal,
        discountPercent,
        discountReason,
        discountAmount: discount,
        tax,
        totalAmount: total,
        paymentMethod: null,
        status: "Ongoing",
      });

      setCart([]);
      navigate("/bill", { state: order });

    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.current = false; // 🔓 UNLOCK
    }
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex flex-col justify-between lg:flex-row flex-1 overflow-hidden">
          <div className="flex flex-col w-full lg:w-[70%] overflow-auto p-4 gap-2">
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

            <div className="hidden md:block w-full px-4 sm:px-6 mt-4">
              <div className="w-full overflow-x-auto scrollbar-hide">

                <div className="flex items-center gap-3 min-h-[48px] py-2">

                  {/* ALL BUTTON */}
                  <div
                    className={`px-5 py-2 rounded-lg cursor-pointer text-sm font-medium shrink-0 ${selectedCategory === "All"
                        ? "bg-(--main) text-white"
                        : "bg-[var(--primary)]"
                      }`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All
                  </div>

                  {/* CATEGORY LIST */}
                  {[...new Set(products.map((item) => item.category))].map((category) => (
                    <div
                      key={category}
                      className={`px-5 py-2 rounded-lg cursor-pointer text-sm font-medium shrink-0 ${selectedCategory === category
                          ? "bg-(--main) text-white"
                          : "bg-[var(--primary)]"
                        }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </div>
                  ))}

                </div>
              </div>
            </div>
            {showMobileCategories && (
              <div className="md:hidden flex flex-col gap-2 px-4 sm:px-6 mt-3">
                {[...new Set(products.map((item) => item.category))].map(
                  (category) => (
                    <div
                      key={category}
                      className="py-2 px-4 bg-[var(--primary)] rounded-lg cursor-pointer text-sm font-medium"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </div>
                  )
                )}
              </div>
            )}

            <div className="overflow-y-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 scrollbar-hide rounded-md pb-4">
              {filteredProducts.map((product: any) => {
                return (
                  <DraggableWrapper key={product._id} product={product}>

                    <div className="relative">

                      {/* PRODUCT CARD */}
                      <ProductCard
                        product={product}
                        onAdd={() =>
                          handleAddToCart({
                            ...product,
                            stock: product.quantity,
                          })
                        }
                      />
                    </div>
                  </DraggableWrapper>
                );
              })}
            </div>

            {/* <Link
              to="/request"
              className="flex items-center gap-1 font-medium text-black px-8 pb-4"
            >
              <span>Request Inventory</span>
              <IoIosArrowForward size={20} />
            </Link> */}
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
                    className="border p-2 rounded mb-2 w-full"
                  />

                  <input
                    type="text"
                    placeholder="Enter Customer Number"
                    value={customerphone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-[var(--main)] text-white px-4 py-2 rounded-md w-full"
                  >
                    Submit
                  </button>
                </form>
              )}

              <hr className="mb-2 opacity-20" />

              <CartDropWrapper onDrop={handleDropToCart}>
                <Cart />
              </CartDropWrapper>

            </div>

            {cart.length !== 0 && (
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
                  <span>Subtotal • {cart.length} items</span>
                  <span>₹{Number(subtotal).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount (-{discountPercent}%)</span>
                  <span>-₹{Number(discount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                <div className="text-xs text-gray-400">{discountReason}</div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (+8%)</span>
                  <span>₹{Number(tax).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{Number(total).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}</span>
                </div>
                {/* <button
                  onClick={handleCheckout}
                  className="bg-(--main) w-full text-white font-semibold py-2 rounded-md block cursor-pointer text-center"
                >
                  CHECKOUT &gt;
                </button> */}
                <button
                  disabled={isProcessing.current || cart.length === 0}
                  onClick={handleCheckout}
                  className="bg-(--main) w-full text-white font-semibold py-2 rounded-md"
                >
                  {creatingOrder ? "Processing..." : "CHECKOUT >"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default InventoryPage;