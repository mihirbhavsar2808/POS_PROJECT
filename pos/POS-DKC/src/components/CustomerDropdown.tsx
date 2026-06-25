// import React, { useState } from "react";
// import { FaChevronDown } from "react-icons/fa6";

// interface Customer {
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

// interface CustomerDropdownProps {
//   customers: Customer[];
//   selectedCustomer: Customer | null;
//   onSelect: (customer: Customer) => void;
// }

// const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
//   customers,
//   selectedCustomer,
//   onSelect,
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleSelect = (customer: Customer) => {
//     setDropdownOpen(false);
//     onSelect(customer);
//   };

//   return (
//     <div className="relative w-full">
//       <button
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//         className="w-full px-1 text-left text-lg relative"
//       >
//         {selectedCustomer ? selectedCustomer.name : "Select customer"}
//         <FaChevronDown
//           className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all ${
//             dropdownOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {dropdownOpen && (
//         <div className="absolute cursor-pointer w-full max-h-64 overflow-auto bg-white shadow-lg z-50 scrollbar-hide rounded">
//           <table className="min-w-full text-left text-sm text-gray-700">
//             <thead className="bg-gray-800 sticky top-0 text-white">
//               <tr>
//                 <th className="px-6 py-4 font-medium">Customer name</th>
//                 <th className="px-6 py-4 font-medium">Phone no.</th>
//                 <th className="px-6 py-4 font-medium">Email</th>
//                 <th className="px-6 py-4 font-medium">Address</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//   {customers.map((customer) => (
//     <tr
//       key={customer.email}
//       onClick={() => handleSelect(customer)}
//       className="hover:bg-gray-100 cursor-pointer"
//     >

//                   <td className="px-6 py-4">{customer.name}</td>
//                   <td className="px-6 py-4">{customer.phone}</td>
//                   <td className="px-6 py-4">{customer.email}</td>
//                   <td className="px-6 py-4">
//                     {customer.address1}, {customer.address2}, {customer.city},{" "}
//                     {customer.state}, {customer.country} {customer.zip}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerDropdown;




// import React, { useState } from "react";
// import { FaChevronDown } from "react-icons/fa6";

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

// interface CustomerDropdownProps {
//   customers: Customer[];
//   selectedCustomer: Customer | null;
//   onSelect: (customer: Customer) => void;
// }

// const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
//   customers,
//   selectedCustomer,
//   onSelect,
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleSelect = (customer: Customer) => {
//     setDropdownOpen(false);
//     onSelect(customer);
//   };

//   return (
//     <div className="relative w-full">
//       <button
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//         className="w-full px-1 text-left text-lg relative"
//       >
//         {selectedCustomer ? selectedCustomer.name : "Select customer"}
//         <FaChevronDown
//           className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all ${dropdownOpen ? "rotate-180" : ""
//             }`}
//         />
//       </button>

//       {dropdownOpen && (
//         <div className="absolute cursor-pointer w-full max-h-64 overflow-auto bg-white shadow-lg z-50 scrollbar-hide rounded">
//           <table className="min-w-full text-left text-sm text-gray-700">
//             <thead className="bg-gray-800 sticky top-0 text-white">
//               <tr>
//                 <th className="px-6 py-4 font-medium">Customer name</th>
//                 <th className="px-6 py-4 font-medium">Phone no.</th>
//                 <th className="px-6 py-4 font-medium">Email</th>
//                 <th className="px-6 py-4 font-medium">Address</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {customers.map((customer) => (
//                 <tr
//                   key={`${customer.id}-${customer.email}-${customer.phone}`}
//                   onClick={() => handleSelect(customer)}
//                   className="hover:bg-gray-100 cursor-pointer"
//                 >
//                   <td className="px-6 py-4">{customer.name}</td>
//                   <td className="px-6 py-4">{customer.phone}</td>
//                   <td className="px-6 py-4">{customer.email}</td>
//                   <td className="px-6 py-4">
//                     {customer.address1}, {customer.address2},{" "}
//                     {customer.city}, {customer.state},{" "}
//                     {customer.country} {customer.zip}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>


//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerDropdown;



import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import type { Customer } from "../api/apiServices";

interface CustomerDropdownProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer) => void;
}

const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
  customers,
  selectedCustomer,
  onSelect,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (customer: Customer) => {
    setDropdownOpen(false);
    onSelect(customer);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full px-1 text-left text-lg relative"
      >
        {selectedCustomer ? selectedCustomer.name : "Select customer"}
        <FaChevronDown
          className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all ${dropdownOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute cursor-pointer w-full max-h-64 overflow-auto bg-white shadow-lg z-50 rounded">
          <table className="min-w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-800 sticky top-0 text-white">
              <tr>
                <th className="px-6 py-4">Customer name</th>
                <th className="px-6 py-4">Phone no.</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Address</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer._id || customer.phone || index}
                  onClick={() => handleSelect(customer)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-6 py-4">{customer.name}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">
                    {customer.address}, {customer.city}, {customer.state},{" "}
                    {customer.country} {customer.zip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerDropdown;


// import Header from "./Header";
// import { FaUser } from "react-icons/fa6";
// import { RiCashLine } from "react-icons/ri";
// import { CiCreditCard1 } from "react-icons/ci";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import CustomerDropdown from "../components/CustomerDropdown"; // updated import

// export interface Customer {
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

// const CancelOrder: React.FC = () => {
//   const [isvalidate, setIsValidate] = useState(false);
//   const [user, setUser] = useState<string | null>(null);
//   const [orderNo, setOrderNo] = useState<number>(1);
//   const orderNumbers = ["001", "002", "003", "004"];
//   const [selectedOrder, setSelectedOrder] = useState("001");

//   const [totalAmount, setTotalAmount] = useState("0");
//   const [customerData, setCustomerData] = useState<Customer[]>([]);
//   const [cartItems, setCartItems] = useState<Product[]>([]);
//   const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(
//     null
//   );
//   const navigate = useNavigate();
//   const storedUser = localStorage.getItem("customer");

//   const [newCustomer, setNewCustomer] = useState<Customer>({
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

//   // Load stored data
//   useEffect(() => {
//     const storedOrderNo = localStorage.getItem("orderNo");
//     if (storedOrderNo) setOrderNo(parseInt(storedOrderNo));

//     const storedTotal = localStorage.getItem("totalAmount");
//     if (storedTotal) setTotalAmount(storedTotal);

//     const storedCustomerData = localStorage.getItem("customerData");
//     if (storedCustomerData) setCustomerData(JSON.parse(storedCustomerData));

//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) setCartItems(JSON.parse(storedCart));

//     const userData = localStorage.getItem("User");
//     if (userData) setUser(JSON.parse(userData).name);

//     const storedSelectedOrder = localStorage.getItem("selectedOrder");
//     if (storedSelectedOrder) setSelectedOrder(storedSelectedOrder);
//   }, []);

//   // Load hold order data when selectedOrder changes
//   useEffect(() => {
//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     const holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//     const activeOrder = holdOrders.find((o) => o.id === selectedOrder);
//     if (activeOrder) {
//       setCartItems(activeOrder.cartItems);
//       setTotalAmount(activeOrder.totalAmount);
//       setNewCustomer(
//         activeOrder.customer ?? {
//           name: "",
//           phone: "",
//           email: "",
//           address1: "",
//           address2: "",
//           country: "",
//           state: "",
//           city: "",
//           zip: "",
//         }
//       );
//     } else {
//       setCartItems([]);
//       setTotalAmount("0.00");
//       setNewCustomer({
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
//     holdOrders = holdOrders.filter((order) => order.id !== selectedOrder);
//     localStorage.setItem("holdOrders", JSON.stringify(holdOrders));
//     localStorage.removeItem("customer");
//   };

//   const handleProduct = () => {
//     if (!user || cartItems.length === 0 || !paymentMethod) return;

//     const customerDet = JSON.parse(localStorage.getItem("customer") || "{}");

//     const orderDetails = {
//       orderNo: orderNo,
//       customer: customerDet,
//       items: cartItems,
//       method: paymentMethod,
//       totalAmount,
//       timestamp: new Date().toISOString(),
//     };

//     localStorage.setItem(`order-${user}-${orderNo}`, JSON.stringify(orderDetails));

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
//       (order: any) =>
//         order.name === newCustomer.name && order.status === "Ongoing"
//     );
//     if (existingIndex !== -1) {
//       existingOrders[existingIndex].status = "Paid";
//     } else {
//       const newOrder = {
//         id: String(existingOrders.length + 1).padStart(2, "0"),
//         name: newCustomer.name || "Guest",
//         date,
//         time,
//         status: "Paid",
//       };
//       existingOrders.push(newOrder);
//     }

//     localStorage.setItem("orders", JSON.stringify(existingOrders));

//     const holdOrdersRaw = localStorage.getItem("holdOrders");
//     let holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];
//     holdOrders = holdOrders.filter((order) => order.id !== selectedOrder);
//     localStorage.setItem("holdOrders", JSON.stringify(holdOrders));

//     const nextOrderNo = orderNo + 1;
//     setOrderNo(nextOrderNo);
//     localStorage.setItem("orderNo", nextOrderNo.toString());

//     setIsValidate((prev) => !prev);

//     if (paymentMethod === "cash") {
//       navigate("/invoice");
//     } else {
//       navigate("/payment");
//     }
//   };

//   const handleAddCustomer = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       const updatedCustomers = [...customerData, newCustomer];
//       setCustomerData(updatedCustomers);
//       localStorage.setItem("customerData", JSON.stringify(updatedCustomers));

//       setNewCustomer({
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

//       const holdOrdersRaw = localStorage.getItem("holdOrders");
//       const holdOrders: HoldOrder[] = holdOrdersRaw ? JSON.parse(holdOrdersRaw) : [];

//       const updatedOrders = holdOrders.map((order) =>
//         order.id === selectedOrder ? { ...order, customer: newCustomer } : order
//       );
//       localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));
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
//                       const updatedOrders = holdOrders.map((order) =>
//                         order.id === selectedOrder ? { ...order, customer } : order
//                       );
//                       localStorage.setItem("holdOrders", JSON.stringify(updatedOrders));

//                       const now = new Date();
//                       const date = now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
//                       const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

//                       const existingOrdersRaw = localStorage.getItem("orders");
//                       let existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
//                       const existingOrder = existingOrders.find((o: any) => o.id === selectedOrder);

//                       if (!existingOrder) {
//                         const newOrder = {
//                           id: selectedOrder,
//                           name: customer.name || "Guest",
//                           date,
//                           time,
//                           status: "Ongoing",
//                         };
//                         existingOrders.push(newOrder);
//                         localStorage.setItem("orders", JSON.stringify(existingOrders));
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//               {/* Customer input fields remain unchanged */}
//               <div className="grid grid-cols-2 gap-2 mt-2">
//                 <div className="flex flex-col border border-(--primary) rounded px-2">
//                   <label className="text-xs text-(--for)">Full name*</label>
//                   <input
//                     className="text-lg font-semibold text-(--main) outline-none"
//                     placeholder="Name"
//                     onChange={(e) =>
//                       setNewCustomer({ ...newCustomer, name: e.target.value })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     value={newCustomer.name}
//                   />
//                 </div>
//                 <div className="flex flex-col border border-(--primary) rounded px-2">
//                   <label className="text-xs text-(--form)">Phone no*</label>
//                   <input
//                     className="text-lg font-semibold text-(--main) outline-none"
//                     placeholder="Phone no"
//                     onChange={(e) =>
//                       setNewCustomer({ ...newCustomer, phone: e.target.value })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     value={newCustomer.phone}
//                   />
//                 </div>
//                 <div className="flex flex-col border border-(--primary) rounded px-2">
//                   <label className="text-xs text-(--form)">Email*</label>
//                   <input
//                     className="text-lg font-semibold text-(--main) outline-none"
//                     placeholder="Email"
//                     onChange={(e) =>
//                       setNewCustomer({ ...newCustomer, email: e.target.value })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     value={newCustomer.email}
//                   />
//                 </div>
//                 <div className="flex flex-col border border-(--primary) rounded px-2">
//                   <label className="text-xs text-(--form)">Address</label>
//                   <input
//                     className="text-lg font-semibold text-(--main) outline-none"
//                     placeholder="Address"
//                     onChange={(e) =>
//                       setNewCustomer({ ...newCustomer, address1: e.target.value })
//                     }
//                     onKeyDown={handleAddCustomer}
//                     value={newCustomer.address1}
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* Payment section remains unchanged */}
//             <div className="flex flex-col gap-2 px-5 mt-4">
//               <p className="font-medium">Payment</p>
//               <p className="text-sm text-gray-500 ">
//                 All transactions are secure and encrypted.
//               </p>
//               <div className="bg-(--v) rounded p-2 flex gap-2">
//                 <input
//                   type="radio"
//                   name="payment"
//                   checked={paymentMethod === "cash"}
//                   onChange={() => setPaymentMethod("cash")}
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
//                   onChange={() => setPaymentMethod("card")}
//                 />
//                 <span className="flex items-center justify-between w-full">
//                   Card <CiCreditCard1 className="text-2xl" />
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Order number buttons */}
//           <div className="flex gap-3 items-center p-3 bg-(--secondary)">
//             <span className="text-sm font-semibold text-(--eye-icon)">
//               Order:
//             </span>
//             {orderNumbers.map((order) => (
//               <button
//                 key={order}
//                 onClick={() => setSelectedOrder(order)}
//                 className={`w-12 h-10 rounded-md text-sm font-semibold transition-all border ${
//                   selectedOrder === order
//                     ? "bg-(--main) text-white"
//                     : "bg-(--main)/50 text-white"
//                 }`}
//               >
//                 {order}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Cart and buttons */}
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
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
//               >
//                 <div className="flex gap-3 items-center">
//                   <img
//                     src={item.thumbnail}
//                     alt={item.title}
//                     className="w-12 h-12 rounded-sm object-cover"
//                   />
//                   <div>
//                     <h4 className="font-medium text-sm">{item.title}</h4>
//                     <p className="text-xs text-gray-500">
//                       ${item.price.toFixed(2)} * {item.quantity} ={" "}
//                       <span>${(item.price * item.quantity).toFixed(2)}</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {cartItems.length === 0 && <div className="h-screen mt-8"></div>}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between gap-3 w-full mt-10">
//             <Link to="/inventory" className="w-full">
//               <button className="w-full py-3 px-4 rounded bg-white text-black text-base font-medium border-gray-300 hover:bg-gray-50 transition">
//                 Back
//               </button>
//             </Link>
//             <button
//               disabled={
//                 cartItems.length === 0 || !storedUser || paymentMethod === null
//               }
//               onClick={handleProduct}
//               className={`w-full py-2 text-white rounded px-4 text-sm sm:text-base ${
//                 !isvalidate ? "bg-(--main)/100" : "bg-(--main)/40"
//               }`}
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
