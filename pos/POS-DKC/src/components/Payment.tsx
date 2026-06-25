// import { useEffect, useState } from "react";
// import Header from "./Header";
// import { Link, useNavigate } from "react-router-dom";
// import { FaCheck, FaChevronDown } from "react-icons/fa";
// import { VscSend } from "react-icons/vsc";
// import { IoMdPrint } from "react-icons/io";
// import PaymentDropdown from "./PaymentDropdown";
// import ReceiptPrint from "./ReciptPage";

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   category: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// const Payment = () => {
//   const [totalAmount, setTotalAmount] = useState("0");
//   const [email, setEmail] = useState("");
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleEmailClick = () => {
//   if (!email || !email.includes("@")) {
//     alert("Please enter a valid email address.");
//     return;
//   }

//   window.location.href = `mailto:${email}`;
// };


//   const handleNewOrder = () => {
//     localStorage.removeItem("cart");
//     localStorage.removeItem("customer");
//     localStorage.removeItem("discountReason");
//     localStorage.removeItem("selectedDiscount");
//     localStorage.removeItem("totalAmount");
//     navigate("/");
//   };

//  useEffect(() => {
//   const lastOrderRaw = localStorage.getItem("lastOrder");
//   if (lastOrderRaw) {
//     const lastOrder = JSON.parse(lastOrderRaw);

//     setCartItems(lastOrder.items || []);
//     setTotalAmount(lastOrder.totalAmount || "0");
//   }
// }, []);

//   return (
//     <>
//       <ReceiptPrint />
//       <div className="h-screen flex flex-col print:hidden">
//         <Header />
//         <div className={`flex flex-col items-center w-full flex-1 h-[calc(100% - 4rem)] ${dropdownOpen ? "" : "justify-between"}`}>
//           <div className="flex flex-col justify-between gap-5 p-10 w-3xl">
//             <div className="flex flex-col items-center gap-3 bg-green-100 p-6 rounded-3xl shadow">
//               <button className="bg-green-600 text-3xl rounded-full p-3">
//                 <FaCheck size={20} color="white" />
//               </button>
//               <h2 className="text-3xl font-semibold text-green-800">
//                 Payment Successful
//               </h2>
//               <p className="text-gray-700 text-xl font-medium">
//                 <b>${totalAmount}</b>
//               </p>
//             </div>

//             <div className="relative">
//               {!dropdownOpen && (
//                 <div className="w-full flex justify-between items-center bg-(--secondary) rounded-xl px-4 py-2 text-gray-800 outline-0">
//                   More payment details
//                   <FaChevronDown
//                     className={`${!dropdownOpen ? null : "rotate-180"
//                       } right-0 transition-all`}
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                   />
//                 </div>
//               )}
//               {dropdownOpen && (
//                 <PaymentDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
//               )}
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => window.print()}
//                 className="flex items-center gap-2 text-(--eye-icon) font-bold px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
//               >
//                 <IoMdPrint /> Print receipt
//               </button>
//               <div className="flex flex-1 border border-gray-500 rounded overflow-hidden">
//                 <input
//                   type="email"
//                   placeholder="abcd@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="flex-1 px-4 py-2 outline-none font-bold text-(--eye-icon) placeholder:text-(--eye-icon) "
//                 />
//                 <button
//                   className="px-4"
//                   onClick={handleEmailClick}
//                 >
//                   <VscSend className="text-(--main)" />
//                 </button>
//               </div>
//             </div>
//           </div>
//           <Link to="/" className={`${dropdownOpen ? "-mt-8" : "pb-2"}`}>
//             <button
//               className="mt-10 px-20 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
//               onClick={handleNewOrder}
//             >
//               New Order &gt;
//             </button>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Payment;



// import { useEffect, useState } from "react";
// import Header from "./Header";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { FaCheck, FaChevronDown } from "react-icons/fa";
// import { VscSend } from "react-icons/vsc";
// import { IoMdPrint } from "react-icons/io";
// import PaymentDropdown from "./PaymentDropdown";
// import ReceiptPrint from "./ReciptPage";

// interface Product {
//   id?: number;
//   title: string;
//   price: number;
//   thumbnail: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// const Payment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const orderData: any = location.state;

//   const [totalAmount, setTotalAmount] = useState("0");
//   const [email, setEmail] = useState("");
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     if (!orderData) return;

//     setCartItems(orderData.cartItems || []);
//     setTotalAmount(orderData.totalAmount || "0");
//   }, [orderData]);

//   const handleEmailClick = () => {
//     if (!email || !email.includes("@")) {
//       alert("Please enter a valid email address.");
//       return;
//     }
//     window.location.href = `mailto:${email}`;
//   };

//   const handleNewOrder = () => {
//     navigate("/");
//   };

//   return (
//     <>
//       <ReceiptPrint orderData={orderData} />

//       <div className="h-screen flex flex-col print:hidden">
//         <Header />

//         <div className={`flex flex-col items-center w-full flex-1 h-[calc(100% - 4rem)] ${dropdownOpen ? "" : "justify-between"}`}>
//           <div className="flex flex-col justify-between gap-5 p-10 w-3xl">

//             <div className="flex flex-col items-center gap-3 bg-green-100 p-6 rounded-3xl shadow">
//               <button className="bg-green-600 text-3xl rounded-full p-3">
//                 <FaCheck size={20} color="white" />
//               </button>

//               <h2 className="text-3xl font-semibold text-green-800">
//                 Payment Successful
//               </h2>

//               <p className="text-gray-700 text-xl font-medium">
//                 <b>${Number(totalAmount).toFixed(2)}</b>
//               </p>
//             </div>

//             <div className="relative">
//               {!dropdownOpen && (
//                 <div className="w-full flex justify-between items-center bg-(--secondary) rounded-xl px-4 py-2">
//                   More payment details
//                   <FaChevronDown
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                   />
//                 </div>
//               )}

//               {dropdownOpen && (
//                 <PaymentDropdown
//                   dropdownOpen={dropdownOpen}
//                   setDropdownOpen={setDropdownOpen}
//                   cartItems={cartItems}
//                   orderData={orderData}
//                 />
//               )}
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => window.print()}
//                 className="flex items-center gap-2 border px-4 py-2 rounded"
//               >
//                 <IoMdPrint /> Print receipt
//               </button>

//               <div className="flex flex-1 border rounded overflow-hidden">
//                 <input
//                   type="email"
//                   placeholder="abcd@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="flex-1 px-4 py-2 outline-none"
//                 />

//                 <button className="px-4" onClick={handleEmailClick}>
//                   <VscSend />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <Link to="/">
//             <button
//               className="mt-4 px-20 bg-gray-900 text-white py-2 rounded"
//               onClick={handleNewOrder}
//             >
//               New Order &gt;
//             </button>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Payment;












// import { useEffect, useState } from "react";
// import Header from "./Header";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { FaCheck, FaChevronDown } from "react-icons/fa";
// import { VscSend } from "react-icons/vsc";
// import { IoMdPrint } from "react-icons/io";
// import PaymentDropdown from "./PaymentDropdown";
// import ReceiptPrint from "./ReciptPage";
// import { updateOrderStatus } from "../api/apiServices";
// import { useCart } from "../auth/cartContext";


// interface Product {
//   id?: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   category?: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// const Payment = () => {
//   const [totalAmount, setTotalAmount] = useState("0");
//   const [email, setEmail] = useState("");
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [statusUpdated, setStatusUpdated] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { setCart } = useCart();

//   const orderData: any = location.state;

//   useEffect(() => {

//     if (!orderData) return;

//     setCartItems(orderData.cartItems || []);
//     setTotalAmount(orderData.totalAmount || "0");

//     if (orderData._id) {
//       updateOrderStatus(orderData._id, "Paid")
//         .then(() => setStatusUpdated(true))
//         .catch(console.error);
//     }

//   }, []);

//   const handleNewOrder = () => {
//     setCart([]);
//     navigate("/");
//   };

//   const handleEmailClick = () => {
//     if (!email || !email.includes("@")) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     window.location.href = `mailto:${email}`;


//   };


//   return (
//     <>
//       <ReceiptPrint orderData={orderData} />

//       <div className="h-screen flex flex-col print:hidden">
//         <Header />

//         <div
//           className={`flex flex-col items-center w-full flex-1 h-[calc(100% - 4rem)] ${dropdownOpen ? "" : "justify-between"
//             }`}
//         >
//           <div className="flex flex-col justify-between gap-5 p-10 w-3xl">

//             <div className="flex flex-col items-center gap-3 bg-green-100 p-6 rounded-3xl shadow">
//               <button className="bg-green-600 text-3xl rounded-full p-3">
//                 <FaCheck size={20} color="white" />
//               </button>

//               <h2 className="text-3xl font-semibold text-green-800">
//                 Payment Successful
//               </h2>

//               <p className="text-gray-700 text-xl font-medium">
//                 <b>₹{Number(totalAmount).toLocaleString("en-IN", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}</b>
//               </p>
//             </div>

//             <div className="relative">
//               {!dropdownOpen && (
//                 <div className="w-full flex justify-between items-center bg-(--secondary) rounded-xl px-4 py-2 text-gray-800 outline-0">
//                   More payment details
//                   <FaChevronDown
//                     className={`${!dropdownOpen ? null : "rotate-180"} right-0 transition-all`}
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                   />
//                 </div>
//               )}

//               {dropdownOpen && (
//                 <PaymentDropdown
//                   dropdownOpen={dropdownOpen}
//                   setDropdownOpen={setDropdownOpen}
//                   cartItems={cartItems}
//                   orderData={orderData}
//                 />
//               )}
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => window.print()}
//                 className="flex items-center gap-2 text-(--eye-icon) font-bold px-4 py-2 border border-gray-500 rounded hover:bg-gray-100"
//               >
//                 <IoMdPrint /> Print receipt
//               </button>

//               <div className="flex flex-1 border border-gray-500 rounded overflow-hidden">
//                 <input
//                   type="email"
//                   placeholder="abcd@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="flex-1 px-4 py-2 outline-none font-bold text-(--eye-icon) placeholder:text-(--eye-icon)"
//                 />

//                 <button
//                   className="px-4"
//                   onClick={handleEmailClick}
//                 >
//                   <VscSend className="text-(--main)" />
//                 </button>
//               </div>
//             </div>

//           </div>

//           <Link to="/" className={`${dropdownOpen ? "-mt-8" : "pb-2"}`}>
//             <button
//               className="mt-10 px-20 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition"
//               onClick={handleNewOrder}
//             >
//               New Order &gt;
//             </button>
//           </Link>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Payment;






import { useEffect, useState, useRef } from "react"; // ✅ add useRef
import Header from "./Header";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { IoMdPrint } from "react-icons/io";
import PaymentDropdown from "./PaymentDropdown";
import ReceiptPrint from "./ReciptPage";
import { updateOrderStatus } from "../api/apiServices";
import { useCart } from "../auth/cartContext";

interface Product {
  id?: number;
  title: string;
  price: number;
  thumbnail: string;
  category?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Payment = () => {
  const [totalAmount, setTotalAmount] = useState("0");
  const [email, setEmail] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setCart } = useCart();

  const orderData: any = location.state;

  // 🔥 IMPORTANT FIX
  const hasUpdated = useRef(false);

  useEffect(() => {
    if (!orderData) return;

    setCartItems(orderData.cartItems || []);
    setTotalAmount(orderData.totalAmount || "0");

    // ✅ PREVENT DOUBLE API CALL
    if (orderData._id && !hasUpdated.current) {
      hasUpdated.current = true; // 🔒 lock

      updateOrderStatus(orderData._id, "Paid")
        .then(() => setStatusUpdated(true))
        .catch(console.error);
    }

  }, []);

  const handleNewOrder = () => {
    setCart([]);
    navigate("/");
  };

  const handleEmailClick = async () => {
    if (!email || !email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          orderData, 
        }),
      });

      alert("✅ Receipt sent with PDF!");
      setEmail("");

    } catch (error) {
      alert("❌ Failed");
    }
  };

  return (
    <>
      <ReceiptPrint orderData={orderData} />

      <div className="h-screen flex flex-col print:hidden">
        <Header />

        <div className="flex flex-col items-center w-full flex-1 justify-between">
          <div className="flex flex-col justify-between gap-5 p-10 w-3xl">

            <div className="flex flex-col items-center gap-3 bg-green-100 p-6 rounded-3xl shadow">
              <button className="bg-green-600 text-3xl rounded-full p-3">
                <FaCheck size={20} color="white" />
              </button>

              <h2 className="text-3xl font-semibold text-green-800">
                Payment Successful
              </h2>

              <p className="text-gray-700 text-xl font-medium">
                <b>₹{Number(totalAmount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</b>
              </p>
            </div>

            <div className="relative">
              {!dropdownOpen && (
                <div className="w-full flex justify-between items-center bg-(--secondary) rounded-xl px-4 py-2 text-gray-800">
                  More payment details
                  <FaChevronDown onClick={() => setDropdownOpen(!dropdownOpen)} />
                </div>
              )}

              {dropdownOpen && (
                <PaymentDropdown
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  cartItems={cartItems}
                  orderData={orderData}
                />
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border rounded"
              >
                <IoMdPrint /> Print receipt
              </button>

              <div className="flex flex-1 border border-gray-500 rounded overflow-hidden">
                <input
                  type="email"
                  placeholder="abcd@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 outline-none font-bold text-(--eye-icon) placeholder:text-(--eye-icon) "
                />
                <button
                  className="px-4"
                  onClick={handleEmailClick}
                >
                  <VscSend className="text-(--main)" />
                </button>
              </div>
            </div>

          </div>

          <Link to="/">
            <button
              className="mt-10 px-20 bg-gray-900 text-white py-2 rounded"
              onClick={handleNewOrder}
            >
              New Order &gt;
            </button>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Payment;