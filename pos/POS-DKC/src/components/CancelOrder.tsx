// import Header from "./Header";
// import { FaUser } from "react-icons/fa6";
// import { RiCashLine } from "react-icons/ri";
// import { CiCreditCard1 } from "react-icons/ci";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import CustomerDropdown from "../components/CustomerDropdown";

// export interface Customer {
//   id: string; // NEW
//   name: string;
//   phone: string;
//   email: string;
//   address1: string;
//   address2: string;
//   country: string;
//   state: string;
//   city: string;
//   zip: string;
// }


// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   quantity: number;
// }

// interface HoldOrder {
//   id: string;
//   cartItems: Product[];
//   totalAmount: string;
//   customer?: Customer;
// }
// const EMPTY_CUSTOMER: Customer = {
//   id: "",
//   name: "",
//   phone: "",
//   email: "",
//   address1: "",
//   address2: "",
//   country: "",
//   state: "",
//   city: "",
//   zip: "",
// };

// const CancelOrder: React.FC = () => {

//   const [isvalidate, setIsValidate] = useState(false);
//   const [user, setUser] = useState<string | null>(null);
//   const [orderNo, setOrderNo] = useState<number>(1);
//   // const orderNumbers = ["001", "002", "003", "004"];
//   const [selectedOrder, setSelectedOrder] = useState("001");


//   useEffect(() => {
//     const stored = localStorage.getItem("selectedOrder");
//     if (stored) {
//       setSelectedOrder(stored);
//       setNewCustomer(EMPTY_CUSTOMER);
//     }
//   }, []);
//   const [totalAmount, setTotalAmount] = useState("0");
//   const [customerData, setCustomerData] = useState<Customer[]>([]);
//   const [cartItems, setCartItems] = useState<Product[]>([]);
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(null);
//   const navigate = useNavigate();
//   const [newCustomer, setNewCustomer] = useState<Customer>({
//     id: "",
//     name: "",
//     phone: "",
//     email: "",
//     address1: "",
//     address2: "",
//     country: "",
//     state: "",
//     city: "",
//     zip: "",
//   });


//   useEffect(() => {
//     const storedOrderNo = localStorage.getItem("orderNo");
//     if (storedOrderNo) {
//       setOrderNo(parseInt(storedOrderNo));
//     }

//     const storedTotal = localStorage.getItem("totalAmount");
//     if (storedTotal) {
//       setTotalAmount(storedTotal);
//     }

//     const StoredData = localStorage.getItem("customerData");
//     if (StoredData) {
//       setCustomerData(JSON.parse(StoredData));
//     }

//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }

//     const userData = localStorage.getItem("User");
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser.name);
//     }
//   }, []);

//   useEffect(() => {
//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     const holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//     const activeOrder = holdOrders.find(o => o.id === selectedOrder);

//     if (activeOrder) {
//       setCartItems(activeOrder.cartItems);
//       setTotalAmount(activeOrder.totalAmount);
//       setNewCustomer(activeOrder?.customer || EMPTY_CUSTOMER);

//     } else {
//       setCartItems([]);
//       setTotalAmount("0.00");

//       // NO activeOrder here
//       setNewCustomer({
//         id: "",
//         name: "",
//         phone: "",
//         email: "",
//         address1: "",
//         address2: "",
//         country: "",
//         state: "",
//         city: "",
//         zip: "",
//       });
//     }
//   }, [selectedOrder]);


//   const handleCancelCart = () => {
//     const existingOrdersRaw = localStorage.getItem("orders");
//     let existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];

//     const ongoingIndex = existingOrders.findIndex(
//       (order: any) =>
//         order.name === newCustomer.name && order.status === "Ongoing"
//     );

//     if (ongoingIndex !== -1) {
//       existingOrders[ongoingIndex].status = "Failed";
//       localStorage.setItem("orders", JSON.stringify(existingOrders));
//     }
//     setCartItems([]);
//     setTotalAmount("0.00");
//     setNewCustomer({
//       id: "",
//       name: "",
//       phone: "",
//       email: "",
//       address1: "",
//       address2: "",
//       country: "",
//       state: "",
//       city: "",
//       zip: "",
//     });
//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     let holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//     holdOrders = holdOrders.filter(order => order.id !== selectedOrder);
//     localStorage.setItem("holdOrders", JSON.stringify(holdOrders));
//     localStorage.removeItem("customer");
//   };


//   const handleProduct = () => {
//     console.log("USER:", user);
//     console.log("CART:", cartItems.length);
//     console.log("PAYMENT:", paymentMethod);

//     if (cartItems.length === 0 || !paymentMethod) {
//       alert("Add product & select payment");
//       return;
//     }

//     const safeUser = user || "Guest";

//     const customerDet = JSON.parse(localStorage.getItem("customer") || "{}");

//     const orderDetails = {
//       orderNo,
//       customer: customerDet,
//       items: cartItems,
//       method: paymentMethod,
//       totalAmount,
//       timestamp: new Date().toISOString(),
//     };

//     /* ---------- SAVE ORDER ---------- */

//     const orderKey = `order-${safeUser}-${orderNo}`;
//     localStorage.setItem(orderKey, JSON.stringify(orderDetails));

//     // ⭐ IMPORTANT – invoice will read this
//     localStorage.setItem("lastOrderKey", orderKey);
//     localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
//     /* ---------- UPDATE ORDERS LIST ---------- */

//     const now = new Date();
//     const date = now.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//     });
//     const time = now.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const existingOrdersRaw = localStorage.getItem("orders");
//     let existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];

//     const existingIndex = existingOrders.findIndex(
//       (o: any) => o.name === newCustomer.name && o.status === "Ongoing"
//     );

//     if (existingIndex !== -1) {
//       existingOrders[existingIndex].status = "Paid";
//     } else {
//       existingOrders.push({
//         id: String(existingOrders.length + 1).padStart(2, "0"),
//         name: newCustomer.name || "Guest",
//         date,
//         time,
//         status: "Ongoing",
//       });
//     }

//     localStorage.setItem("orders", JSON.stringify(existingOrders));

//     /* ---------- REMOVE HOLD ORDER ---------- */

//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     let holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];
//     holdOrders = holdOrders.filter((o) => o.id !== selectedOrder);
//     localStorage.setItem("holdOrders", JSON.stringify(holdOrders));

//     /* ---------- NEXT ORDER NO ---------- */

//     const nextOrderNo = orderNo + 1;
//     setOrderNo(nextOrderNo);
//     localStorage.setItem("orderNo", nextOrderNo.toString());

//     setIsValidate(prev => !prev);

//     /* ---------- NAVIGATION WITH STATE ---------- */

//     if (paymentMethod === "cash") {
//       navigate("/invoice", { state: orderDetails });
//     } else {
//       navigate("/payment", { state: orderDetails });
//     }
//   };



//   const handleAddCustomer = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {

//       // prevent duplicate email
//       if (customerData.some(c => c.email === newCustomer.email)) {
//         alert("Customer already exists");
//         return;
//       }

//       const customerWithId = {
//         ...newCustomer,
//         id: Date.now().toString(), // UNIQUE ID
//       };

//       const updatedCustomers = [...customerData, customerWithId];
//       setCustomerData(updatedCustomers);
//       localStorage.setItem("customerData", JSON.stringify(updatedCustomers));

//       setNewCustomer({
//         id: "",
//         name: "",
//         phone: "",
//         email: "",
//         address1: "",
//         address2: "",
//         country: "",
//         state: "",
//         city: "",
//         zip: "",
//       });
//     }
//   };


//   return (
//     <div className="h-screen">
//       <Header />
//       <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">
//         <div className="w-full lg:w-[75%] flex flex-col justify-between bg-white rounded-md">
//           <div className="flex flex-col h-[80%] justify-between p-3">
//             <div className="bg-(--pin-button) flex flex-col gap-3 p-2 rounded-2xl">
//               <div className="text-2xl font-semibold">${totalAmount}</div>
//               <div className="border-2 rounded-2xl border-(--main)/50 w-[100%] p-2">
//                 <h2 className="font-semibold text-(--eye-icon) flex gap-2 text-1.5xl items-center py-0.5">
//                   <FaUser className="text-(--eye-icon)/70" />
//                   Customer
//                 </h2>
//                 <div className="flex flex-col border border-(--primary) rounded px-2 py-1">
//                   <label className="text-xs text-gray-600">
//                     Select Customer
//                   </label>
//                   <CustomerDropdown
//                     customers={customerData}
//                     selectedCustomer={newCustomer.name ? newCustomer : null}

//                     onSelect={(customer) => {
//                       setNewCustomer(customer);
//                       localStorage.setItem("customer", JSON.stringify(customer));

//                       const holdOrdersRaw = localStorage.getItem("holdOrders");
//                       const holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//                       const updatedOrders = holdOrders.map(order =>
//                         order.id === selectedOrder ? { ...order, customer } : order
//                       );
//                       localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));
//                       const now = new Date();
//                       const date = now.toLocaleDateString("en-US", {
//                         year: "numeric", month: "short", day: "2-digit",
//                       });
//                       const time = now.toLocaleTimeString("en-US", {
//                         hour: "2-digit", minute: "2-digit",
//                       });

//                       const existingOrdersRaw = localStorage.getItem("orders");
//                       const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
//                       const existing = existingOrders.find((o: any) => o.id === selectedOrder);
//                       if (!existing) {
//                         const newOrder = {
//                           id: String(existingOrders.length + 1).padStart(2, "0"),
//                           name: customer.name || "Guest",
//                           date,
//                           time,
//                           status: "Ongoing",
//                         };
//                         const updatedOrderList = [...existingOrders, newOrder];
//                         localStorage.setItem("orders", JSON.stringify(updatedOrderList));
//                       }
//                     }}
//                   />
//                 </div>

//                 <div className="flex items-center">
//                   <div className="border w-full text-(--main)/50"></div>
//                   <p className="p-2">or</p>
//                   <div className="border w-full h-0 text-(--main)/50"></div>
//                 </div>
//                 <div className="flex justify-center text-black-400 text-sm 3"></div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="flex flex-col border border-(--primary) rounded px-2">
//                     <label className="text-xs text-(--for)">Full name*</label>
//                     <input
//                       className="text-lg font-semibold text-(--main) outline-none"
//                       placeholder="Name"
//                       onChange={(e) =>
//                         setNewCustomer({ ...newCustomer, name: e.target.value })
//                       }
//                       onKeyDown={handleAddCustomer}
//                       value={newCustomer.name ?? ""}
//                     />

//                   </div>

//                   <div className="flex flex-col border border-(--primary) rounded px-2">
//                     <label className="text-xs text-(--form) ">Phone no*</label>
//                     <input
//                       className="text-lg font-semibold text-(--main) outline-none"
//                       placeholder="Phone no"
//                       onChange={(e) =>
//                         setNewCustomer({ ...newCustomer, phone: e.target.value })
//                       }
//                       onKeyDown={handleAddCustomer}
//                       value={newCustomer.phone ?? ""}
//                     />

//                   </div>
//                   <div className="flex flex-col border border-(--primary) rounded px-2">
//                     <label className="text-xs text-(--form)">Email*</label>
//                     <input
//                       className="text-lg font-semibold text-(--main) outline-none"
//                       placeholder="Email"
//                       onChange={(e) =>
//                         setNewCustomer({ ...newCustomer, email: e.target.value })
//                       }
//                       onKeyDown={handleAddCustomer}
//                       value={newCustomer.email ?? ""}
//                     />

//                   </div>
//                   <div className="flex flex-col border border-(--primary) rounded px-2">
//                     <label className="text-xs text-(--form) 1 -2">
//                       Address
//                     </label>
//                     <input
//                       className="text-lg font-semibold text-(--main) outline-none"
//                       placeholder="Address"
//                       onChange={(e) =>
//                         setNewCustomer({ ...newCustomer, address1: e.target.value })
//                       }
//                       onKeyDown={handleAddCustomer}
//                       value={newCustomer.address1 ?? ""}
//                     />

//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 px-5">
//               <p className="font-medium">Payment</p>
//               <p className="text-sm text-gray-500 ">
//                 All transactions are secure and encrypted.
//               </p>
//               <div className="bg-(--v) rounded p-2 flex gap-2">
//                 <input
//                   type="radio"
//                   name="payment"
//                   checked={paymentMethod === "cash"}
//                   onChange={() => {
//                     setPaymentMethod("cash");

//                     const existingCustomer = JSON.parse(
//                       localStorage.getItem("customer") || "{}"
//                     );
//                     const updatedCustomer = {
//                       ...existingCustomer,
//                       paymentMethod: "cash",
//                     };
//                     localStorage.setItem(
//                       "customer",
//                       JSON.stringify(updatedCustomer)
//                     );
//                   }}
//                 />

//                 <span className="flex items-center justify-between w-full">
//                   Cash <RiCashLine className="text-2xl" />
//                 </span>
//               </div>
//               <div className="bg-(--bgorder) rounded p-2 flex gap-2">
//                 <input
//                   type="radio"
//                   name="payment"
//                   checked={paymentMethod === "card"}
//                   onChange={() => {
//                     setPaymentMethod("card");

//                     const existingCustomer = JSON.parse(
//                       localStorage.getItem("customer") || "{}"
//                     );
//                     const updatedCustomer = {
//                       ...existingCustomer,
//                       paymentMethod: "card",
//                     };
//                     localStorage.setItem(
//                       "customer",
//                       JSON.stringify(updatedCustomer)
//                     );
//                   }}
//                 />

//                 <span className="flex items-center justify-between w-full">
//                   Card <CiCreditCard1 className="text-2xl" />
//                 </span>

//               </div>
//             </div>
//           </div>
//           {/* <div className="flex gap-3 items-center p-3 bg-(--secondary)">

//               <span className="text-sm font-semibold text-(--eye-icon)">
//                 Order:
//               </span>
//               {orderNumbers.map((order) => (
//                 <button
//                   key={order}
//                   onClick={() => setSelectedOrder(order)}
//                   className={`w-12 h-10 rounded-md text-sm font-semibold transition-all border ${selectedOrder === order
//                     ? "bg-(--main) text-white"
//                     : "bg-(--main)/50 text-white"
//                     }`}
//                 >
//                   {order}
//                 </button>
//               ))}
//             </div> */}
//         </div>
//         <div className="w-full lg:w-[32%] p-6 bg-(--secondary) flex flex-col justify-between">
//           <div className="font-serif">
//             <button
//               onClick={handleCancelCart}
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
//                       ${item.price.toFixed(2)} * {item.quantity} = {""}
//                       <span>
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {cartItems.length === 0 ? (
//               <div className="h-screen mt-8"></div>
//             ) : null}
//           </div>
//           {/* console.log(cartItems); */}
//           <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mt-10">
//             <Link to="/inventory" className="w-full">
//               <button className="w-full py-3 px-4 rounded bg-white text-black text-base font-medium border-gray-300 hover:bg-gray-50 transition">
//                 Back
//               </button>
//             </Link>
//             <button
//               disabled={
//                 cartItems.length === 0 || !newCustomer.name || paymentMethod === null
//               }
//               onClick={handleProduct}
//               className={`w-full py-2 bg-(--main)/40 text-white rounded px-4 text-sm sm:text-base disabled:bg-(--main)/40 hover:cursor-pointer ${!isvalidate ? "bg-(--main)/100" : "bg-(--main)/40"
//                 } `}
//             >
//               Validate &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancelOrder;


// import Header from "./Header";
// import { FaUser } from "react-icons/fa6";
// import { RiCashLine } from "react-icons/ri";
// import { CiCreditCard1 } from "react-icons/ci";
// import React, { useEffect, useState } from "react";
// import {
//   Link,
//   useNavigate,
//   useParams,
//   useLocation,
// } from "react-router-dom";
// import CustomerDropdown from "../components/CustomerDropdown";
// import {
//   getOrderCustomers,
//   createOrderCustomer,
//   createOrder,
//   getSingleOrder,
//   updateOrderStatus,
// } from "../api/apiServices";
// import type { Customer } from "../api/apiServices";

// const CancelOrder: React.FC = () => {
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔥 If coming from inventory
//   const stateData: any = location.state || {};

//   const [orderData, setOrderData] = useState<any>(null);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [selectedCustomer, setSelectedCustomer] =
//     useState<Customer | null>(null);

//   const [newCustomer, setNewCustomer] = useState<Customer>({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     zip: undefined,
//   });

//   const [paymentMethod, setPaymentMethod] =
//     useState<"cash" | "card" | null>(null);

//   /* ================= LOAD ORDER ================= */
//   useEffect(() => {
//     const loadOrder = async () => {
//       if (id) {
//         // ✅ Fetch existing order
//         const data = await getSingleOrder(id);
//         setOrderData(data);

//         if (data.customer) {
//           setSelectedCustomer(data.customer);
//         }
//       } else if (stateData.cartItems) {
//         // ✅ Coming from inventory
//         setOrderData({
//           cartItems: stateData.cartItems,
//           totalAmount: stateData.totalAmount,
//         });
//       }
//     };

//     loadOrder();
//   }, [id]);

//   /* ================= LOAD CUSTOMERS ================= */
//   useEffect(() => {
//     const loadOrderCustomers = async () => {
//       try {
//         const data = await getOrderCustomers();
//         setCustomers(data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     loadOrderCustomers();
//   }, []);

//   /* ================= ADD CUSTOMER ================= */
//   const handleAddCustomer = async (
//   e: React.KeyboardEvent<HTMLInputElement>
// ) => {

//   if (e.key !== "Enter") return;

//   e.preventDefault();

//   if (!newCustomer.name || !newCustomer.phone) {
//     alert("Name & Phone required");
//     return;
//   }

//   try {

//     const savedCustomer = await createOrderCustomer(newCustomer);

//     setCustomers(prev => [...prev, savedCustomer]);

//     setSelectedCustomer(savedCustomer);

//     setNewCustomer({
//       name: "",
//       phone: "",
//       email: "",
//       address: "",
//       country: "",
//       state: "",
//       city: "",
//       zip: undefined,
//     });

//   } catch (err) {
//     console.log(err);
//   }

// };
//   /* ================= VALIDATE PAYMENT ================= */
//   const handleProduct = async () => {
//     if (!orderData || !selectedCustomer || !paymentMethod) {
//       alert("Select customer & payment method");
//       return;
//     }

//     try {
//       let currentOrder = orderData;

//       // 🔥 If order not yet created → create now
//       if (!id) {
//         const created = await createOrder({
//           customer: selectedCustomer,
//           cartItems: orderData.cartItems,
//           totalAmount: orderData.totalAmount,
//           paymentMethod,
//           status: "Paid",
//         });

//         currentOrder = created;
//       } else {
//         await updateOrderStatus(id, "Paid");
//       }

//       if (paymentMethod === "cash") {
//         navigate(`/invoice`);
//       } else {
//         navigate(`/payment`);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleCancelCart = () => {
//     navigate("/inventory");
//   };

//   return (
//     <div className="h-screen">
//       <Header />

//       <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">
//         {/* LEFT SIDE */}
//         <div className="w-full lg:w-[75%] flex flex-col justify-between bg-white rounded-md">
//           <div className="flex flex-col h-[80%] justify-between p-3">
//             <div className="bg-(--pin-button) flex flex-col gap-3 p-2 rounded-2xl">
//               <div className="text-2xl font-semibold">
//                 $
//                 {orderData
//                   ? Number(orderData.totalAmount).toFixed(2)
//                   : "0.00"}
//               </div>

//               <div className="border-2 rounded-2xl border-(--main)/50 w-[100%] p-2">
//                 <h2 className="font-semibold flex gap-2 items-center py-1">
//                   <FaUser /> Customer
//                 </h2>

//                 <div className="flex flex-col border rounded px-2 py-1">
//                   <label className="text-xs text-gray-600">
//                     Select Customer
//                   </label>

//                   <CustomerDropdown
//                     customers={customers}
//                     selectedCustomer={selectedCustomer}
//                     onSelect={(customer: Customer) => {
//                       setSelectedCustomer(customer);

//                       // Fill input fields immediately
//                       setNewCustomer({
//                         name: customer.name || "",
//                         phone: customer.phone || "",
//                         email: customer.email || "",
//                         address: customer.address || "",
//                         country: customer.country || "",
//                         state: customer.state || "",
//                         city: customer.city || "",
//                         zip: customer.zip,
//                       });
//                     }}
//                   />
//                 </div>

//                 <div className="flex items-center my-2">
//                   <div className="border w-full"></div>
//                   <p className="px-2 text-sm">or</p>
//                   <div className="border w-full"></div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     placeholder="Full Name"
//                     value={newCustomer.name}
//                     onChange={(e) =>
//                       setNewCustomer({
//                         ...newCustomer,
//                         name: e.target.value,
//                       })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     className="border p-2 rounded"
//                   />

//                   <input
//                     placeholder="Phone"
//                     value={newCustomer.phone}
//                     onChange={(e) =>
//                       setNewCustomer({
//                         ...newCustomer,
//                         phone: e.target.value,
//                       })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     className="border p-2 rounded"
//                   />

//                   <input
//                     placeholder="Email"
//                     value={newCustomer.email}
//                     onChange={(e) =>
//                       setNewCustomer({
//                         ...newCustomer,
//                         email: e.target.value,
//                       })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     className="border p-2 rounded"
//                   />

//                   <input
//                     placeholder="Address"
//                     value={newCustomer.address}
//                     onChange={(e) =>
//                       setNewCustomer({
//                         ...newCustomer,
//                         address: e.target.value,
//                       })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     className="border p-2 rounded"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* PAYMENT */}
//             <div className="flex flex-col gap-2 px-5">
//               <p className="font-medium">Payment</p>

//               <div
//                 className="bg-(--v) rounded p-2 flex gap-2 cursor-pointer"
//                 onClick={() => setPaymentMethod("cash")}
//               >
//                 Cash <RiCashLine className="text-2xl ml-auto" />
//               </div>

//               <div
//                 className="bg-(--bgorder) rounded p-2 flex gap-2 cursor-pointer"
//                 onClick={() => setPaymentMethod("card")}
//               >
//                 Card <CiCreditCard1 className="text-2xl ml-auto" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full lg:w-[32%] p-6 bg-(--secondary) flex flex-col justify-between">
//           <div className="font-serif">
//             <button
//               onClick={handleCancelCart}
//               className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md"
//             >
//               Cancel order
//             </button>
//             <hr className="mt-3" />
//           </div>

//           <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[60vh] scrollbar-hide">
//             {orderData?.cartItems?.map((item: any, index: number) => (
//               <div
//                 key={index}
//                 className="flex justify-between bg-white p-3 rounded-lg"
//               >
//                 <div>
//                   <h4 className="font-medium text-sm">
//                     {item.title || item.product?.title}
//                   </h4>
//                   <p className="text-xs text-gray-500">
//                     ${item.price} × {item.quantity}
//                   </p>
//                 </div>
//                 <div>
//                   ${(item.price * item.quantity).toFixed(2)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-3">
//             <Link to="/inventory" className="w-full">
//               <button className="w-full py-3 bg-white rounded">
//                 Back
//               </button>
//             </Link>

//             <button
//               disabled={!orderData || !selectedCustomer || !paymentMethod}
//               onClick={handleProduct}
//               className="w-full py-3 bg-(--main) text-white rounded"
//             >
//               Validate &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CancelOrder;




























import Header from "./Header";
import { FaUser } from "react-icons/fa6";
import { RiCashLine } from "react-icons/ri";
import { CiCreditCard1 } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import CustomerDropdown from "../components/CustomerDropdown";

import {
  getOrderCustomers,
  createOrderCustomer,
  getSingleOrder,
  updateOrder,
  updateOrderStatus,
} from "../api/apiServices";
import type { Customer } from "../api/apiServices";

const CancelOrder: React.FC = () => {

  const [creatingOrder, setCreatingOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const orderDataFromState: any = location.state;
  const orderId = orderDataFromState?._id;

  const [orderData, setOrderData] = useState<any>(orderDataFromState);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: undefined,
  });

  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "card" | null>(null);


    const formatPrice = (value: number | string) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /* ================= LOAD ORDER ================= */

  useEffect(() => {

    if (!orderId) return;

    const loadOrder = async () => {
      try {
        const data = await getSingleOrder(orderId);
        setOrderData(data);

        if (data.customer) {
          setSelectedCustomer(data.customer);
        }
      } catch (err) {
        console.log(err);
      }


    };

    loadOrder();

  }, [orderId]);


  /* ================= LOAD ORDER CUSTOMERS ================= */

  useEffect(() => {

    const loadOrderCustomers = async () => {

      try {

        const data = await getOrderCustomers();

        setCustomers(data);

      } catch (err) {
        console.log(err);
      }

    };

    loadOrderCustomers();

  }, []);

  /* ================= ADD CUSTOMER ================= */

  const handleAddCustomer = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (e.key !== "Enter") return;

    e.preventDefault();

    if (!newCustomer.name || !newCustomer.phone) {
      alert("Name & Phone required");
      return;
    }

    try {

      const savedCustomer = await createOrderCustomer(newCustomer);

      setCustomers((prev) => [...prev, savedCustomer]);

      setSelectedCustomer(savedCustomer);

      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zip: undefined,
      });

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= VALIDATE PAYMENT ================= */

  const handleProduct = async () => {

    if (creatingOrder) return;

    if (!paymentMethod) {
      alert("Select payment method");
      return;
    }

    if (!selectedCustomer?._id) {
      alert("Please select a customer");
      return;
    }

    try {

      setCreatingOrder(true);

      await updateOrder(orderId, {
        customer: selectedCustomer._id,
        paymentMethod,
        status: "Unpaid"
      });

      if (paymentMethod === "cash") {

        navigate("/invoice", {
          state: {
            ...orderData,
            customer: selectedCustomer,
            _id: orderId
          }
        });

      } else {

        navigate("/card-payment", {
          state: {
            ...orderData,
            customer: selectedCustomer,
            _id: orderId
          }
        });

      }

    } catch (err) {
      console.log(err);
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleCancelCart = async () => {

    try {

      if (orderId) {
        await updateOrderStatus(orderId, "Failed");
      }

      navigate("/inventory");

    } catch (err) {
      console.log(err);
    }
    console.log("selectedCustomer:", selectedCustomer);
    console.log("orderId:", orderId);
  };
  return (

    <div className="h-screen">

      <Header />

      <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">

        {/* LEFT SIDE */}

        <div className="w-full lg:w-[75%] flex flex-col justify-between bg-white rounded-md">

          <div className="flex flex-col h-[80%] justify-between p-3">

            <div className="bg-(--pin-button) flex flex-col gap-3 p-2 rounded-2xl">

              <div className="text-2xl font-semibold">
                ₹{formatPrice(orderData?.totalAmount || 0)}
              </div>

              {/* CUSTOMER SECTION */}

              <div className="border-2 rounded-2xl border-(--main)/50 w-full p-2">

                <h2 className="font-semibold text-(--eye-icon) flex gap-2 items-center py-0.5">
                  <FaUser className="text-(--eye-icon)/70" />
                  Customer
                </h2>

                <div className="flex flex-col border border-(--primary) rounded px-2 py-1">

                  <label className="text-xs text-gray-600">
                    Select Customer
                  </label>

                  <CustomerDropdown
                    customers={customers}
                    selectedCustomer={selectedCustomer}
                    onSelect={(customer: Customer) => {

                      setSelectedCustomer(customer);

                      setNewCustomer({
                        name: customer.name || "",
                        phone: customer.phone || "",
                        email: customer.email || "",
                        address: customer.address || "",
                        country: customer.country || "",
                        state: customer.state || "",
                        city: customer.city || "",
                        zip: customer.zip,
                      });

                    }}
                  />

                </div>

                <div className="flex items-center">
                  <div className="border w-full text-(--main)/50"></div>
                  <p className="p-2">or</p>
                  <div className="border w-full text-(--main)/50"></div>
                </div>

                {/* INPUTS */}

                <div className="grid grid-cols-2 gap-2">

                  <div className="flex flex-col border border-(--primary) rounded px-2">
                    <label className="text-xs text-(--form)">
                      Full name*
                    </label>
                    <input
                      className="text-lg font-semibold text-(--main) outline-none"
                      placeholder="Name"
                      value={newCustomer.name}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          name: e.target.value,
                        })
                      }
                      onKeyDown={handleAddCustomer}
                    />
                  </div>

                  <div className="flex flex-col border border-(--primary) rounded px-2">
                    <label className="text-xs text-(--form)">
                      Phone no*
                    </label>
                    <input
                      className="text-lg font-semibold text-(--main) outline-none"
                      placeholder="Phone"
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: e.target.value,
                        })
                      }
                      onKeyDown={handleAddCustomer}
                    />
                  </div>

                  <div className="flex flex-col border border-(--primary) rounded px-2">
                    <label className="text-xs text-(--form)">
                      Email
                    </label>
                    <input
                      className="text-lg font-semibold text-(--main) outline-none"
                      placeholder="Email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                      onKeyDown={handleAddCustomer}
                    />
                  </div>

                  <div className="flex flex-col border border-(--primary) rounded px-2">
                    <label className="text-xs text-(--form)">
                      Address
                    </label>
                    <input
                      className="text-lg font-semibold text-(--main) outline-none"
                      placeholder="Address"
                      value={newCustomer.address}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          address: e.target.value,
                        })
                      }
                      onKeyDown={handleAddCustomer}
                    />
                  </div>

                </div>

              </div>

            </div>

            {/* PAYMENT */}

            <div className="flex flex-col gap-2 px-5">

              <p className="font-medium">Payment</p>

              <p className="text-sm text-gray-500">
                All transactions are secure and encrypted.
              </p>

              <div className="bg-(--v) rounded p-2 flex gap-2">

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />

                <span className="flex items-center justify-between w-full">
                  Cash <RiCashLine className="text-2xl" />
                </span>

              </div>

              <div className="bg-(--bgorder) rounded p-2 flex gap-2">

                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />

                <span className="flex items-center justify-between w-full">
                  Card <CiCreditCard1 className="text-2xl" />
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full lg:w-[32%] p-6 bg-(--secondary) flex flex-col justify-between">

          <div className="font-serif">

            <button
              onClick={handleCancelCart}
              className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md"
            >
              Cancel order
            </button>

            <hr className="mt-3" />

          </div>

          {/* CART ITEMS */}

          {/* <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[60vh] scrollbar-hide">

            {orderData?.cartItems?.map((item: any, index: number) => (

              <div
                key={index}
                className="flex justify-between bg-white p-3 rounded-lg"
              >

                <div>

                  <h4 className="font-medium text-sm">
                    {item.title || item.product?.title}
                  </h4>

                  <p className="text-xs text-gray-500">
                    ${item.price} × {item.quantity}
                  </p>

                </div>

                <div>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

              </div>

            ))}

          </div> */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[60vh] scrollbar-hide">

            {orderData?.cartItems?.map((item: any, index: number) => {

              const image =
                item.thumbnail ||
                item.product?.thumbnail ||
                item.product?.image ||
                "";

              const title =
                item.title ||
                item.product?.title ||
                "Product";

              return (

                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
                >

                  <div className="flex gap-3 items-center">

                    {image && (
                      <img
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={title}
                        className="w-12 h-12 rounded-sm "
                      />
                    )}

                    <div>
                      <h4 className="font-medium text-sm">
                        {title}
                      </h4>

                      <p className="text-xs text-gray-500">
                       ₹{formatPrice(item.price)}
                      </p>
                    </div>

                  </div>

                  <div>
                   ₹{formatPrice(item.price * item.quantity)}
                  </div>

                </div>

              );
            })}

          </div>
          {/* BUTTONS */}

          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/inventory", {
                  state: { cartItems: orderData.cartItems }
                })
              }
              className="w-full py-3 px-4 rounded bg-white text-black"
            >
              Back
            </button>

            <button
              disabled={
                creatingOrder ||
                !orderData?.cartItems?.length ||
                !selectedCustomer ||
                !paymentMethod
              }
              onClick={handleProduct}
              className={`w-full py-2 text-white rounded px-4 text-sm sm:text-base ${orderData?.cartItems?.length && selectedCustomer && paymentMethod
                ? "bg-(--main)"
                : "bg-(--main)/40 cursor-not-allowed"
                }`}
            >
              Validate &gt;
            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default CancelOrder;