// import { useEffect, useState } from "react";
// import Header from "./Header";
// import { Link } from "react-router-dom";
// import { FaRegSquare } from "react-icons/fa";
// import { FaUser } from "react-icons/fa6";

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   quantity: number;
// }

// // const Invoice = () => {
// //   const [totalAmount, setTotalAmount] = useState("0");
// //   const [customer, setCustomer] = useState<{ name?: string; phone?: string }>(
// //     {}
// //   );
// //   const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
// //   const [manualAmount, setManualAmount] = useState("");
// //   const [cartItems, setCartItems] = useState<Product[]>([]);
// //   const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
// //   const [selectedOrder, setSelectedOrder] = useState<string>("");

// //   useEffect(() => {
// //     const holdOrdersRaw = localStorage.getItem("holdOrders");
// //     const holdOrders: { id: string; cartItems: Product[]; totalAmount: string; customer?: any }[] = holdOrdersRaw
// //       ? JSON.parse(holdOrdersRaw)
// //       : [];

// //     const orderIds = holdOrders.map((order) => order.id);
// //     setOrderNumbers(orderIds);

// //     const selected = localStorage.getItem("selectedOrder") || orderIds[0];
// //     setSelectedOrder(selected);

// //     const selectedOrderData = holdOrders.find((order) => order.id === selected);
// //     if (selectedOrderData) {
// //       setCartItems(selectedOrderData.cartItems);
// //       setTotalAmount(selectedOrderData.totalAmount || "0.00");
// //       setCustomer(selectedOrderData.customer || { name: "", phone: "" });
// //     }
// //   }, []);


// //   useEffect(() => {
// //     const storedUser = JSON.parse(localStorage.getItem("User") || "{}");
// //     const userName = storedUser.name || "User";
// //     const orderNo = localStorage.getItem("orderNo");
// //     const lastOrderNo = orderNo ? parseInt(orderNo) - 1 : 1;

// //     const orderKey = `order-${userName}-${lastOrderNo}`;
// //     const orderDataRaw = localStorage.getItem(orderKey);

// //     if (orderDataRaw) {
// //       const orderData = JSON.parse(orderDataRaw);
// //       const items = orderData.items || [];
// //       setCartItems(items);
// //       if (orderData.totalAmount) {
// //         setTotalAmount(orderData.totalAmount);
// //       } else {
// //         const total = items.reduce((acc: number, item: Product) => {
// //           return acc + item.price * item.quantity;
// //         }, 0);
// //         setTotalAmount(total.toFixed(2));
// //       }
// //       if (orderData.customer && orderData.customer.name) {
// //         setCustomer(orderData.customer);
// //       } else {
// //         setCustomer({ name: "", phone: "" });
// //       }
// //     }
// //   }, []);

// //   const handleManualChange = (value: number | string) => {
// //     const inputValue = typeof value === "number" ? value.toString() : value;
// //     setManualAmount(inputValue);

// //     const input = parseFloat(inputValue);
// //     const total = parseFloat(totalAmount);

// //     if (!isNaN(input)) {
// //       const remaining = input - total;
// //       setRemainingAmount(remaining);
// //     } else {
// //       setRemainingAmount(null);
// //     }
// //   };

// //   const handleOrderClick = (order: string) => {
// //     setSelectedOrder(order);
// //     localStorage.setItem("selectedOrder", order);

// //     const holdOrdersRaw = localStorage.getItem("holdOrders");
// //     const holdOrders = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

// //     const selectedOrderData = holdOrders.find((o: any) => o.id === order);
// //     if (selectedOrderData) {
// //       setCartItems(selectedOrderData.cartItems);
// //       setTotalAmount(selectedOrderData.totalAmount || "0.00");
// //       setCustomer(selectedOrderData.customer || { name: "", phone: "" });
// //     } else {
// //       setCartItems([]);
// //       setTotalAmount("0.00");
// //       setCustomer({ name: "", phone: "" });
// //     }
// //   };


// //   return (

// const Invoice = () => {
//   const [totalAmount, setTotalAmount] = useState("0");
//   const [customer, setCustomer] = useState<{ name?: string; phone?: string }>({});
//   const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
//   const [manualAmount, setManualAmount] = useState("");
//   const [cartItems, setCartItems] = useState<Product[]>([]);
//   const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<string>("");

//   useEffect(() => {
//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     const holdOrders = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//     const orderIds = holdOrders.map((order: any) => order.id);
//     setOrderNumbers(orderIds);

//     const selected = localStorage.getItem("selectedOrder") || orderIds[0];
//     setSelectedOrder(selected);

//     const selectedOrderData = holdOrders.find((order: any) => order.id === selected);
//     if (selectedOrderData) {
//       setCartItems(selectedOrderData.cartItems);
//       setTotalAmount(selectedOrderData.totalAmount || "0.00");
//       setCustomer(selectedOrderData.customer || { name: "", phone: "" });
//     }
//   }, []);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("User") || "{}");
//     const userName = storedUser.name || "User";
//     const orderNo = localStorage.getItem("orderNo");
//     const lastOrderNo = orderNo ? parseInt(orderNo) - 1 : 1;

//     const orderKey = `order-${userName}-${lastOrderNo}`;
//     const orderDataRaw = localStorage.getItem(orderKey);

//     if (orderDataRaw) {
//       const orderData = JSON.parse(orderDataRaw);
//       const items = orderData.items || [];
//       setCartItems(items);

//       if (orderData.totalAmount) {
//         setTotalAmount(orderData.totalAmount);
//       } else {
//         const total = items.reduce((acc: number, item: Product) => {
//           return acc + item.price * item.quantity;
//         }, 0);
//         setTotalAmount(total.toFixed(2));
//       }

//       setCustomer(orderData.customer || { name: "", phone: "" });
//     }
//   }, []);

//   const handleManualChange = (value: number | string) => {
//     const inputValue = typeof value === "number" ? value.toString() : value;
//     setManualAmount(inputValue);

//     const input = parseFloat(inputValue);
//     const total = parseFloat(totalAmount);

//     if (!isNaN(input)) {
//       setRemainingAmount(input - total);
//     } else {
//       setRemainingAmount(null);
//     }
//   };

//   const handleOrderClick = (order: string) => {
//     setSelectedOrder(order);
//   };

//   // ⭐ THIS LINE FIXES ERROR – NO LOGIC CHANGE
//   console.log(orderNumbers, selectedOrder, handleOrderClick);

//   return (

//     <div className="h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden w-full">
//         <div className="w-full lg:w-[70%] flex flex-col justify-between bg-white rounded-md">

//           <div className="relative flex-1 overflow-y-auto p-8 flex flex-col items-center gap-4">
//             <div className="w-full flex flex-col gap-4 bg-(--bgorder) p-5 rounded-xl">
//               <div className="flex justify-between items-center text-2xl font-semibold">
//                 ${totalAmount}
//                 <p className="flex items-center gap-2 text-sm bg-(--buttonbg) p-1 rounded-md">
//                   <FaRegSquare size={10} />
//                   Invoice
//                 </p>
//               </div>
//               <div className="flex items-center gap-3 p-2 rounded-lg border-gray-500 border-2">
//                 <FaUser /> <span>{customer.name}</span> • <span>{customer.phone}</span>
//               </div>
//             </div>
//             <div className="w-full flex justify-between items-center gap-3">
//               {[900, 1000, 1500].map((amount) => (
//                 <button
//                   key={amount}
//                   onClick={() => handleManualChange(amount)}
//                   className="bg-[var(--secondary)] py-3 w-full text-center rounded-lg hover:bg-opacity-80 transition hover:bg-(--eye-icon)"
//                 >
//                   ${amount}
//                 </button>
//               ))}
//             </div>
//             <input
//               type="number"
//               placeholder="Add manually"
//               className="w-full rounded px-3 py-2 outline-0 bg-[var(--secondary)]"
//               value={manualAmount}
//               onChange={(e) => handleManualChange(e.target.value)}
//             />
//             <div className="w-full px-4 py-4 border rounded-lg flex flex-col gap-2">
//               <span className="font-semibold">Change</span>
//               <span>
//                 {remainingAmount !== null
//                   ? `$${remainingAmount.toFixed(2)}`
//                   : "—"}
//               </span>
//             </div>
//           </div>
//           {/* {orderNumbers.length > 0 && (
//             <div className="flex gap-3 items-center p-3 bg-(--secondary)">
//               <span className="text-sm font-semibold text-(--eye-icon)">
//                 Order:
//               </span>
//               {orderNumbers.map((order) => (
//                 <button
//                   key={order}
//                   onClick={() => handleOrderClick(order)}
//                   className={`w-12 h-10 rounded-md text-sm font-semibold transition-all border ${selectedOrder === order
//                     ? "bg-(--main) text-white"
//                     : "bg-(--main)/50 text-white"
//                     }`}
//                 >
//                   {order}
//                 </button>
//               ))}
//             </div>
//           )} */}
//         </div>

//         <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
//           <div className="font-serif">
//             <button
//               // onClick={handleCancelCart}
//               className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md "
//             >
//               Cancel order
//             </button>
//             <hr className="mt-3" />
//           </div>
//           <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[60vh] scrollbar-hide">
//             {cartItems.map((item, index) => (
//               <div
//                 key={`${item.id}-${index}`}
//                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
//               >
//                 <div className="flex gap-3 items-center">
//                   <img
//                     src={`http://localhost:5000/uploads/${item.thumbnail}`}
//                     alt={item.title}
//                     className="w-12 h-12 rounded-sm object-cover"
//                   />
//                   <div>
//                     <h4 className="font-medium text-sm">{item.title}</h4>
//                     <p className="text-xs text-gray-500">
//                       ${item.price.toFixed(2)} * {item.quantity} ={" "}
//                       <span>
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mt-10">
//             <Link to="/inventory" className="w-full sm:w-1/2">
//               <button className="w-full py-3 px-4 rounded bg-white text-black text-base font-medium border border-gray-300 hover:bg-gray-50 transition">
//                 Back
//               </button>
//             </Link>
//             <Link to="/payment" className="w-full sm:w-1/2">
//               <button className="w-full py-3 text-white rounded px-4 text-sm sm:text-base disabled:bg-(--main)/40 bg-(--main)">
//                 Validate &gt;
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;




















// import { useEffect, useState } from "react";
// import Header from "./Header";
// import { Link } from "react-router-dom";
// import { FaRegSquare } from "react-icons/fa";
// import { FaUser } from "react-icons/fa6";

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   quantity: number;
// }

// const Invoice = () => {
//   const [totalAmount, setTotalAmount] = useState("0");
//   const [customer, setCustomer] = useState<{ name?: string; phone?: string }>({});
//   const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
//   const [manualAmount, setManualAmount] = useState("");
//   const [cartItems, setCartItems] = useState<Product[]>([]);

//   /* ----------- LOAD LAST ORDER ----------- */
//   useEffect(() => {
//     const lastOrderKey = localStorage.getItem("lastOrderKey");

//     if (!lastOrderKey) return;

//     const orderRaw = localStorage.getItem(lastOrderKey);
//     if (!orderRaw) return;

//     const order = JSON.parse(orderRaw);

//     setCartItems(order.items || []);
//     setTotalAmount(order.totalAmount || "0.00");
//     setCustomer(order.customer || {});
//   }, []);

//   /* ----------- MANUAL CASH INPUT ----------- */
//   const handleManualChange = (value: number | string) => {
//     const inputValue = typeof value === "number" ? value.toString() : value;
//     setManualAmount(inputValue);

//     const input = parseFloat(inputValue);
//     const total = parseFloat(totalAmount);

//     if (!isNaN(input)) {
//       setRemainingAmount(input - total);
//     } else {
//       setRemainingAmount(null);
//     }
//   };
//   const handleValidate = () => {
//     const ordersRaw = localStorage.getItem("orders");
//     let orders = ordersRaw ? JSON.parse(ordersRaw) : [];

//     if (orders.length > 0) {
//       orders[orders.length - 1].status = "Paid";
//       localStorage.setItem("orders", JSON.stringify(orders));
//     }

//     window.location.href = "/payment";
//   };

//   const handleCancelOrder = () => {
//     const ordersRaw = localStorage.getItem("orders");
//     let orders = ordersRaw ? JSON.parse(ordersRaw) : [];

//     // update last order status to Failed
//     if (orders.length > 0) {
//       orders[orders.length - 1].status = "Failed";
//       localStorage.setItem("orders", JSON.stringify(orders));
//     }

//     // clear last order key
//     localStorage.removeItem("lastOrderKey");

//     // go back
//     window.location.href = "/inventory";
//   };

//   const handleBack = () => {
//     const ordersRaw = localStorage.getItem("orders");
//     let orders = ordersRaw ? JSON.parse(ordersRaw) : [];

//     if (orders.length > 0) {
//       orders[orders.length - 1].status = "Unpaid";
//       localStorage.setItem("orders", JSON.stringify(orders));
//     }

//     window.location.href = "/inventory";
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden w-full">

//         {/* LEFT SIDE */}
//         <div className="w-full lg:w-[70%] flex flex-col justify-between bg-white rounded-md">

//           <div className="relative flex-1 overflow-y-auto p-8 flex flex-col items-center gap-4">

//             <div className="w-full flex flex-col gap-4 bg-(--bgorder) p-5 rounded-xl">
//               <div className="flex justify-between items-center text-2xl font-semibold">
//                 ${totalAmount}
//                 <p className="flex items-center gap-2 text-sm bg-(--buttonbg) p-1 rounded-md">
//                   <FaRegSquare size={10} />
//                   Invoice
//                 </p>
//               </div>

//               <div className="flex items-center gap-3 p-2 rounded-lg border-gray-500 border-2">
//                 <FaUser />
//                 <span>{customer.name || "Guest"}</span> •
//                 <span>{customer.phone || "-"}</span>
//               </div>
//             </div>

//             <div className="w-full flex justify-between items-center gap-3">
//               {[900, 1000, 1500].map((amount) => (
//                 <button
//                   key={amount}
//                   onClick={() => handleManualChange(amount)}
//                   className="bg-[var(--secondary)] py-3 w-full text-center rounded-lg hover:bg-(--eye-icon)"
//                 >
//                   ${amount}
//                 </button>
//               ))}
//             </div>

//             <input
//               type="number"
//               placeholder="Add manually"
//               className="w-full rounded px-3 py-2 outline-0 bg-[var(--secondary)]"
//               value={manualAmount}
//               onChange={(e) => handleManualChange(e.target.value)}
//             />

//             <div className="w-full px-4 py-4 border rounded-lg flex flex-col gap-2">
//               <span className="font-semibold">Change</span>
//               <span>
//                 {remainingAmount !== null
//                   ? `$${remainingAmount.toFixed(2)}`
//                   : "—"}
//               </span>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
//           <div className="font-serif">
//             <button
//               onClick={handleCancelOrder}
//               className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md"
//             >
//               Cancel order
//             </button>

//             <hr className="mt-3" />
//           </div>
//           <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[60vh] scrollbar-hide">
//             {cartItems.map((item, index) => (
//               <div
//                 key={`${item.id}-${index}`}
//                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
//               >
//                 <div className="flex gap-3 items-center">
//                   <img
//                     src={`http://localhost:5000/uploads/${item.thumbnail}`}
//                     alt={item.title}
//                     className="w-12 h-12 rounded-sm object-cover"
//                   />
//                   <div>
//                     <h4 className="font-medium text-sm">{item.title}</h4>
//                     <p className="text-xs text-gray-500">
//                       ${item.price.toFixed(2)} * {item.quantity} ={" "}
//                       <span>
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mt-10">
//             <Link to="/inventory" className="w-full sm:w-1/2">
//               <button className="w-full py-3 px-4 rounded bg-white text-black text-base font-medium border border-gray-300 hover:bg-gray-50 transition" onClick={handleBack}>
//                 Back
//               </button>
//             </Link>
//             <Link to="/payment" className="w-full sm:w-1/2">
//               <button
//                 onClick={handleValidate}
//                 className="w-full py-3 text-white rounded px-4 text-sm sm:text-base bg-(--main)"
//               >
//                 Validate &gt;
//               </button>
//             </Link>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;








import { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegSquare } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

interface Product {
  id?: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

const Invoice = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const orderData: any = location.state;

  useEffect(() => {
    if (!orderData) return;

    setCartItems(orderData.cartItems || []);
    setTotalAmount(orderData.totalAmount || "0.00");
    setCustomer(orderData.customer || {});
  }, [orderData]);

  const [totalAmount, setTotalAmount] = useState("0");
  const [customer, setCustomer] = useState<{ name?: string; phone?: string }>({});
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [manualAmount, setManualAmount] = useState("");
  const [cartItems, setCartItems] = useState<Product[]>([]);

  /* -------- LOAD ORDER FROM CANCEL ORDER PAGE -------- */

  useEffect(() => {

    if (!orderData) return;

    setCartItems(orderData.cartItems || []);
    setTotalAmount(orderData.totalAmount || "0.00");
    setCustomer(orderData.customer || {});

  }, [orderData]);

  /* -------- MANUAL CASH INPUT -------- */

  const handleManualChange = (value: number | string) => {
    const inputValue = typeof value === "number" ? value.toString() : value;

    const rawValue = inputValue.replace(/,/g, "");

    if (/^\d*$/.test(rawValue)) {
      setManualAmount(rawValue);

      const input = parseFloat(rawValue);
      const total = parseFloat(totalAmount);

      if (!isNaN(input)) {
        setRemainingAmount(input - total);
      } else {
        setRemainingAmount(null);
      }
    }
  };

  // const handleValidate = () => {
  //   window.location.href = "/payment";
  // };

  const handleCancelOrder = () => {
    navigate("/inventory");
  };

  const handleBack = () => {
    navigate("/bill", {
      state: orderData
    });
  };

  return (
    <div className="h-screen flex flex-col">

      <Header />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden w-full">

        {/* LEFT SIDE */}

        <div className="w-full lg:w-[70%] flex flex-col justify-between bg-white rounded-md">

          <div className="relative flex-1 overflow-y-auto p-8 flex flex-col items-center gap-4">

            <div className="w-full flex flex-col gap-4 bg-(--bgorder) p-5 rounded-xl">

              <div className="flex justify-between items-center text-2xl font-semibold">
                ₹{Number(totalAmount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}

                <p className="flex items-center gap-2 text-sm bg-(--buttonbg) p-1 rounded-md">
                  <FaRegSquare size={10} />
                  Invoice
                </p>

              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg border-gray-500 border-2">
                <FaUser />
                <span>{customer?.name || "Guest"}</span> •
                <span>{customer?.phone || "-"}</span>
              </div>

            </div>

            <div className="w-full flex justify-between items-center gap-3">

              {[900, 1000, 1500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleManualChange(amount)}
                  className="bg-[var(--secondary)] py-3 w-full text-center rounded-lg hover:bg-(--eye-icon)"
                >
                  ₹{amount.toLocaleString("en-IN")}
                </button>
              ))}

            </div>

            <input
              type="text"
              placeholder="Add manually"
              className="w-full rounded px-3 py-2 outline-0 bg-[var(--secondary)]"
              value={
                manualAmount
                  ? Number(manualAmount).toLocaleString("en-IN")
                  : ""
              }
              onChange={(e) => handleManualChange(e.target.value)}
            />

            <div className="w-full px-4 py-4 border rounded-lg flex flex-col gap-2">
              <span className="font-semibold">Change</span>
              <span>
                {remainingAmount !== null
                  ? `₹${Number(remainingAmount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                  : "—"}
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">

          <div className="font-serif">

            <button
              onClick={handleCancelOrder}
              className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md"
            >
              Cancel order
            </button>

            <hr className="mt-3" />

          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[60vh] scrollbar-hide">

            {cartItems.map((item, index) => (

              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
              >

                <div className="flex gap-3 items-center">

                  <img
                    src={`http://localhost:5000/uploads/${item.thumbnail}`}
                    alt={item.title}
                    className="w-12 h-12 rounded-sm object-cover"
                  />

                  <div>

                    <h4 className="font-medium text-sm">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500">
                      ₹{Number(item.price).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })} * {item.quantity} =
                      <span>
                        ₹{Number(item.price * item.quantity).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mt-10">

            <button
              className="w-full py-3 px-4 sm:w-1/2 rounded bg-white text-black text-base font-medium border border-gray-300 hover:bg-gray-50 transition"
              onClick={handleBack}
            >
              Back
            </button>

            {/* <Link
              to="/payment"
              state={orderData}
              className="w-full sm:w-1/2"
            >
              <button
                onClick={handleValidate}
                className="w-full py-3 text-white rounded px-4 text-sm sm:text-base bg-(--main)"
              >
                Validate &gt;
              </button>
            </Link> */}
            <Link
              to="/payment"
              state={orderData}
              className="w-full sm:w-1/2"
            >
              <button
                className="w-full py-3 text-white rounded px-4 text-sm sm:text-base bg-(--main)"
              >
                Validate  &gt;
              </button>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Invoice;