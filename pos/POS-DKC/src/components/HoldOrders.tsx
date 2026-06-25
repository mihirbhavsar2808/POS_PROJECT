// import SearchBar from "./SearchBar";
// import { IoIosArrowBack } from "react-icons/io";
// import { Link, useNavigate } from "react-router-dom";
// import Header from "./Header";
// import { FaTrash } from "react-icons/fa";
// import { useEffect, useState } from "react";

// interface Customer {
//   name: string;
//   phone?: string;
//   email?: string;
// }

// interface CartItem {
//   id: number;
//   title: string;
//   price: number;
//   quantity: number;
// }

// interface HoldOrder {
//   id: string;
//   cartItems: CartItem[];
//   totalAmount: string;
//   customer?: Customer;
// }

// const HoldOrders = () => {
//   const [orders, setOrders] = useState<HoldOrder[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const stored = localStorage.getItem("holdOrders");
//     if (stored) setOrders(JSON.parse(stored));
//   }, []);

//   const handleDelete = (idToDelete: string) => {
//     const filtered = orders.filter((o) => o.id !== idToDelete);
//     setOrders(filtered);
//     localStorage.setItem("holdOrders", JSON.stringify(filtered));
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const filteredOrders = orders.filter((order) =>
//     `${order.id} ${order.customer?.name || ""} ${order.totalAmount}`
//       .toLowerCase()
//       .includes(searchTerm)
//   );

//   return (
//     <div className="w-full">
//       <Header />
//       <div className="flex flex-col gap-4 p-4 overflow-hidden">
//         <div className="flex items-center gap-2">
//           <Link to="/" className="">
//             <IoIosArrowBack size={20} />
//           </Link>
//           <h1 className="text-xl capitalize font-bold">HOLD ORDERS</h1>
//         </div>

//         <SearchBar onSearch={handleSearch} />

//         <table className="w-full bg-[var(--main)] rounded-t-xl text-left">
//           <thead>
//             <tr>
//               <th className="p-3 text-white">Hold ID</th>
//               <th className="p-3 text-white">Customer Name</th>
//               <th className="p-3 text-white">Phone No</th>
//               <th className="p-3 text-white">Total Amount</th>
//               <th className="p-3 text-white">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr
//                 key={order.id}
//                 className="bg-[var(--bgorder)] border-b border-[var(--primary)] cursor-pointer"
//                 onClick={() => {
//                   localStorage.setItem("selectedOrder", JSON.stringify(order));
//                   navigate("/inventory");
//                 }}
//               >
//                 <td className="p-3">{order.id}</td>
//                 <td className="p-3">{order.customer?.name || "N/A"}</td>
//                 <td className="p-3">{order.customer?.phone|| "N/A"}</td>
//                 <td className="p-3">${order.totalAmount}</td>
//                 <td className="p-3">
//                   <FaTrash
//                     className="cursor-pointer"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(order.id);
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="text-center p-4 text-gray-500 bg-white">
//                   No hold orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HoldOrders;



// import SearchBar from "./SearchBar";
// import { IoIosArrowBack } from "react-icons/io";
// import { Link, useNavigate } from "react-router-dom";
// import Header from "./Header";
// import { FaTrash } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import {
//   getHoldOrders,
//   deleteHoldOrder,
//   HoldOrder
// } from "../api/apiServices";

// interface Customer {
//   name: string;
//   phone?: string;
//   email?: string;
// }

// interface CartItem {
//   id: number;
//   title: string;
//   price: number;
//   quantity: number;
// }

// const HoldOrders = () => {
//   const [orders, setOrders] = useState<HoldOrder[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   /* ===== Fetch Hold Orders from MongoDB ===== */
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await getHoldOrders();

//         const sorted = data.sort(
//           (a: any, b: any) => Number(a.orderId) - Number(b.orderId)
//         );

//         setOrders(sorted);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ===== Delete Hold Order ===== */
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteHoldOrder(id);

//       const updated = orders.filter((o) => o._id !== id);

//       // 🔥 Re-number orderId
//       const reNumbered = updated.map((order, index) => ({
//         ...order,
//         orderId: String(index + 1).padStart(3, "0"),
//       }));

//       setOrders(reNumbered);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleSearch = (term: string) => {
//     setSearchTerm(term.toLowerCase());
//   };

//   const filteredOrders = orders.filter((order) =>
//     `${order.orderId} ${order.customer?.name || ""} ${order.totalAmount}`
//       .toLowerCase()
//       .includes(searchTerm)
//   );

//   return (
//     <div className="w-full">
//       <Header />

//       <div className="flex flex-col gap-4 p-4 overflow-hidden">
//         <div className="flex items-center gap-2">
//           <Link to="/" className="">
//             <IoIosArrowBack size={20} />
//           </Link>
//           <h1 className="text-xl capitalize font-bold">HOLD ORDERS</h1>
//         </div>

//         <SearchBar onSearch={handleSearch} />

//         <table className="w-full bg-[var(--main)] rounded-t-xl text-left">
//           <thead>
//             <tr>
//               <th className="p-3 text-white">Hold ID</th>
//               <th className="p-3 text-white">Customer Name</th>
//               <th className="p-3 text-white">Phone No</th>
//               <th className="p-3 text-white">Total Amount</th>
//               <th className="p-3 text-white">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr
//                 key={order._id}
//                 className="bg-[var(--bgorder)] border-b border-[var(--primary)] cursor-pointer"
//                 onClick={() => navigate(`/inventory/${order._id}`)}
//               >
//                 <td className="p-3">{order.orderId}</td>
//                 <td className="p-3">{order.customer?.name || "N/A"}</td>
//                 <td className="p-3">{order.customer?.phone || "N/A"}</td>
//                 <td className="p-3">${order.totalAmount}</td>

//                 <td className="p-3">
//                   <FaTrash
//                     className="cursor-pointer"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(order._id);
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}

//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="text-center p-4 text-gray-500 bg-white"
//                 >
//                   No hold orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HoldOrders;










import SearchBar from "./SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getHoldOrders,
  deleteHoldOrder,
} from "../api/apiServices";
import type { HoldOrder } from "../api/apiServices";
const HoldOrders = () => {
  const [orders, setOrders] = useState<HoldOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const formatPrice = (value: number | string) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  /* ===== Fetch Hold Orders ===== */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getHoldOrders();

      // Sort by orderId number
      const sorted = [...data].sort(
        (a, b) => Number(a.orderId) - Number(b.orderId)
      );

      setOrders(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===== Delete Hold Order ===== */
  const handleDelete = async (id: string) => {
    try {
      await deleteHoldOrder(id);

      // Remove from state
      const updated = orders.filter((o) => o._id !== id);

      // Re-number locally
      const reNumbered = updated.map((order, index) => ({
        ...order,
        orderId: String(index + 1).padStart(3, "0"),
      }));

      setOrders(reNumbered);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredOrders = orders.filter((order) =>
    `${order.orderId} ${order.customer?.name || ""} ${order.totalAmount}`
      .toLowerCase()
      .includes(searchTerm)
  );
  const handleSelectOrder = async (order: HoldOrder) => {
    try {
      navigate(`/inventory/${order._id}`);

      await deleteHoldOrder(order._id);

      setOrders((prev) => prev.filter((o) => o._id !== order._id));

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full">
      <Header />

      <div className="flex flex-col gap-4 p-4 overflow-hidden">
        <div className="flex items-center gap-2">
          <Link to="/">
            <IoIosArrowBack size={20} />
          </Link>
          <h1 className="text-xl capitalize font-bold">HOLD ORDERS</h1>
        </div>

        <SearchBar onSearch={handleSearch} />

        <table className="w-full bg-[var(--main)] rounded-t-xl text-left">
          <thead>
            <tr>
              <th className="p-3 text-white">Hold ID</th>
              <th className="p-3 text-white">Customer Name</th>
              <th className="p-3 text-white">Phone No</th>
              <th className="p-3 text-white">Total Amount</th>
              <th className="p-3 text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="bg-[var(--bgorder)] border-b border-[var(--primary)] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOrder(order);
                }}
              >
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{order.customer?.name || "N/A"}</td>
                <td className="p-3">{order.customer?.phone || "N/A"}</td>
                <td className="p-3">₹{formatPrice(order.totalAmount)}</td>

                <td className="p-3">
                  <FaTrash
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(order._id);
                    }}
                  />
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500 bg-white">
                  No hold orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldOrders;