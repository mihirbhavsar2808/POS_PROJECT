// import SearchBar from "./SearchBar";
// import { IoIosArrowBack } from "react-icons/io";
// import { Link } from "react-router-dom";
// import Header from "./Header";
// import { FaTrash } from "react-icons/fa";
// import { useEffect, useState } from "react";


// interface Order {
//     id: string;
//     name: string;
//     date: string;
//     time: string;
//     status: "Paid" | "Failed" | "Ongoing" | "Unpaid";
// }


// const statusStyles: Record<string, string> = {
//     Paid: "bg-green-100 text-green-800",
//     Failed: "bg-red-100 text-red-800",
//     Ongoing: "bg-yellow-100 text-yellow-800",
//     Unpaid: "bg-blue-100 text-blue-800",
// };

// const Order = () => {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [searchTerm, setSearchTerm] = useState("");

//     useEffect(() => {
//         const stored = localStorage.getItem("orders");
//         if (stored) {
//             setOrders(JSON.parse(stored));
//         }
//     }, []);

//     const handleDelete = (idToDelete: string) => {
//         const filtered = orders.filter(order => order.id !== idToDelete);
//         const reIndexed = filtered.map((order, index) => ({
//             ...order,
//             id: String(index + 1).padStart(2, "0"),
//         }));

//         setOrders(reIndexed);
//         localStorage.setItem("orders", JSON.stringify(reIndexed));
//     };

//     const handleSearch = (term: string) => {
//         setSearchTerm(term.toLowerCase());
//     };

//     const filteredOrders = orders.filter((order) => {
//         const combined = `${order.id} ${order.name} ${order.date} ${order.time} ${order.status}`.toLowerCase();
//         return combined.includes(searchTerm);
//     });


//     return (
//         <div className="w-full">
//             <Header />
//             <div className="flex flex-col gap-4 p-4 overflow-hidden">
//                 <div className="flex items-center gap-2">
//                     <Link to="/" className="">
//                         <IoIosArrowBack size={20} />
//                     </Link>
//                     <h1 className="text-xl capitalize font-bold">ORDER</h1>
//                 </div>
//                 <SearchBar onSearch={handleSearch} />
//                 <table className="bg-(--main) rounded-t-xl text-left">
//                     <thead>
//                         <tr>
//                             <th className="p-3 text-white">Order no.</th>
//                             <th className="p-3 text-white">Name</th>
//                             <th className="p-3 text-white">Date & Time.</th>
//                             <th className="p-3 text-white">Status.</th>
//                             <th className="p-3 text-white">Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredOrders.map((order) => (
//                             <tr key={order.id} className="bg-(--bgorder) border-b border-(--primary)">
//                                 <td className="p-3">{order.id}</td>
//                                 <td className="p-3">{order.name}</td>
//                                 <td className="p-3">{order.date}. {order.time}</td>
//                                 <td className="p-3 flex items-center gap-4">
//                                     <span
//                                         className={`text-sm px-3 py-1 rounded-full ${statusStyles[order.status]}`}
//                                     >
//                                         {order.status}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <FaTrash
//                                         className="cursor-pointer"
//                                         onClick={() => handleDelete(order.id)}
//                                     />
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Order;




import { useEffect, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { getOrders } from "../api/apiServices";
import type { Order } from "../api/apiServices";

const statusStyles: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Ongoing: "bg-yellow-100 text-yellow-800",
  Unpaid: "bg-blue-100 text-blue-800",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  

  /* ================= SEARCH ================= */
  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredOrders = orders.filter((order) => {
    const combined = `
      ${order.customer?.name || ""}
      ${order.status}
      ${new Date(order.createdAt).toLocaleDateString()}
    `.toLowerCase();

    return combined.includes(searchTerm);
  });

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      <div className="flex flex-col gap-4 p-4">

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <IoIosArrowBack size={20} />
          </Link>
          <h1 className="text-xl font-bold">ORDER</h1>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-(--main) rounded-t-xl text-left">

            <thead>
              <tr>
                <th className="p-3 text-white">Order no.</th>
                <th className="p-3 text-white">Name</th>
                <th className="p-3 text-white">Date & Time</th>
                <th className="p-3 text-white">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, index) => {
                const date = new Date(order.createdAt);

                return (
                  <tr
                    key={order._id}
                    className="bg-(--bgorder) border-b border-(--primary)"
                  >
                    {/* Order number 01, 02, 03 */}
                    <td className="p-3">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    {/* Customer */}
                    <td className="p-3">
                      {order.customer?.name || "Guest"}
                    </td>

                    {/* Date & Time */}
                    <td className="p-3">
                      {date.toLocaleDateString()} • {date.toLocaleTimeString()}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Delete */}
                    
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;