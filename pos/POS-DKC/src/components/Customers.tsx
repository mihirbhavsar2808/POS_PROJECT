// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Header from "./Header";
// import SearchBar from "./SearchBar";
// import AddCustomerModal from "./AddCustomerModal";
// import Checkout from "./Checkout";
// import TableComp from "./TableComp/TableComp";
// import { IoIosArrowForward } from "react-icons/io";
// import { MdOutlineArrowBackIosNew } from "react-icons/md";
// import fetchCustomers, { type customers } from "../hooks/fetchCustomers";

// const Customers = () => {
//   const { customers } = fetchCustomers();
//   const [filteredCustomers, setFilteredCustomers] = useState<customers[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     setFilteredCustomers(customers);
//   }, [customers]);

//   const formattedData = filteredCustomers.map((c) => ({
//     ...c,
//     address: `${c.address} , ${c.city}, ${c.state}, ${c.country} ${c.zip}`,
//   }));
//   // console.log(filteredCustomers);
//   const handleSearch = (query: string) => {
//     if (!query.trim()) {
//       setFilteredCustomers(customers);
//       return;
//     }

//     const lowered = query.toLowerCase();
//     const filtered = customers.filter(
//       (item) =>
//         item.name.toLowerCase().includes(lowered) ||
//         item.phone.toLowerCase().includes(lowered)
//     );
//     setFilteredCustomers(filtered);
//   };

//   const handleAddCustomer = async (customerData: customers) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/customers", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(customerData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Customer added successfully");
//         setIsModalOpen(false);
//         const updatedCustomers = await fetch(`${BASE_URL}/customers`).then(res => res.json());
//   setFilteredCustomers(updatedCustomers);
//       } else {
//         alert(data.error || "Failed to add customer");
//       }
//     } catch (error) {
//       console.error("Add customer failed:", error);
//       alert("Something went wrong while adding customer.");
//     }
//   };

//   const columns = [
//     { Header: "Customer name", accessor: "name" },
//     { Header: "Phone no.", accessor: "phone" },
//     { Header: "Email", accessor: "email" },
//     { Header: "Address", accessor: "address" },
//   ];

//   return (
//     <div className="h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
//         <div className="relative flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">
//           <SearchBar onSearch={handleSearch} />
//           <div className="flex w-full justify-between items-center px-4">
//             <Link to="/" className="flex items-center">
//               <MdOutlineArrowBackIosNew />
//               <span className="text-xl font-bold ml-2">CUSTOMERS</span>
//             </Link>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-(--buttonbg) py-1 px-4 rounded-lg font-semibold flex items-center hover:cursor-pointer"
//             >
//               Add Customer
//               <span className="ml-2">
//                 <IoIosArrowForward />
//               </span>
//             </button>
//           </div>

//           <div className="overflow-x-auto w-[93%] max-h-[65vh] scrollbar-hide ml-0 shadow-md rounded-xl">
//             <TableComp columns={columns} data={formattedData} />
//           </div>
//         </div>

//         <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
//           <Checkout />
//         </div>
//       </div>

//       <AddCustomerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddCustomer}
//       />
//     </div>
//   );
// };

// export default Customers;



// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Header from "./Header";
// import SearchBar from "./SearchBar";
// import AddCustomerModal from "./AddCustomerModal";
// import Checkout from "./Checkout";
// import TableComp from "./TableComp/TableComp";
// import { IoIosArrowForward } from "react-icons/io";
// import { MdOutlineArrowBackIosNew } from "react-icons/md";
// import {
//   getOrders,
//   createCustomer,
//   getCustomers,
// } from "../api/apiServices";

// import type { Customer } from "../api/apiServices";

// const Customers = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [orderCustomers, setOrderCustomers] = useState<Customer[]>([]);
//   const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] =
//     useState<"customers" | "orders">("customers");

//   /* ================= LOAD DATA ================= */

//   useEffect(() => {
//     loadCustomers();
//     loadOrderCustomers();
//   }, []);

//   const loadCustomers = async () => {
//     const data = await getCustomers();
//     setCustomers(data);
//     setFilteredCustomers(data);
//   };

//   const loadOrderCustomers = async () => {
//   const orders: any[] = await getOrders();

//   const uniqueCustomers: Customer[] = [
//     ...new Map(
//       orders
//         .filter((o) => o.customer)
//         .map((o) => [o.customer._id, o.customer])
//     ).values(),
//   ];

//   setOrderCustomers(uniqueCustomers);
// };

//   /* ================= SEARCH ================= */

//   const handleSearch = (query: string) => {
//     const list = activeTab === "customers" ? customers : orderCustomers;

//     if (!query.trim()) {
//       setFilteredCustomers(list);
//       return;
//     }

//     const lowered = query.toLowerCase();
//     const filtered = list.filter(
//       (c) =>
//         c.name?.toLowerCase().includes(lowered) ||
//         c.phone?.toLowerCase().includes(lowered)
//     );

//     setFilteredCustomers(filtered);
//   };

//   /* ================= ADD MANUAL CUSTOMER ================= */

//   const handleAddCustomer = async (customerData: Customer) => {
//     await createCustomer(customerData);
//     loadCustomers();
//     setIsModalOpen(false);
//   };

//   /* ================= TABLE ================= */

//   const columns = [
//     { Header: "Customer name", accessor: "name" },
//     { Header: "Phone no.", accessor: "phone" },
//     { Header: "Email", accessor: "email" },
//     { Header: "Address", accessor: "address" },
//   ];

//   const formattedData = filteredCustomers.map((c) => ({
//     ...c,
//     address: `${c.address || ""}, ${c.city || ""}, ${
//       c.state || ""
//     }, ${c.country || ""} ${c.zip || ""}`,
//   }));

//   /* ================= UI ================= */

//   return (
//     <div className="h-screen flex flex-col">
//       <Header />

//       <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

//         {/* LEFT SIDE */}
//         <div className="relative flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">

//           <SearchBar onSearch={handleSearch} />

//           <div className="flex w-full justify-between items-center px-4">
//             <Link to="/" className="flex items-center">
//               <MdOutlineArrowBackIosNew />
//               <span className="text-xl font-bold ml-2">
//                 CUSTOMERS
//               </span>
//             </Link>

//             {activeTab === "customers" && (
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="bg-(--buttonbg) py-1 px-4 rounded-lg font-semibold flex items-center"
//               >
//                 Add Customer
//                 <span className="ml-2">
//                   <IoIosArrowForward />
//                 </span>
//               </button>
//             )}
//           </div>

//           {/* ====== TWO BUTTONS ====== */}
//           <div className="flex gap-4 w-full px-4">

//             <button
//               onClick={() => {
//                 setActiveTab("customers");
//                 setFilteredCustomers(customers);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "customers"
//                   ? "bg-(--main) text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               Customers
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab("orders");
//                 setFilteredCustomers(orderCustomers);
//               }}
//               className={`px-4 py-2 rounded ${
//                 activeTab === "orders"
//                   ? "bg-(--main) text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               Order Customers
//             </button>

//           </div>

//           <div className="overflow-x-auto w-[93%] max-h-[65vh] shadow-md rounded-xl">
//             <TableComp columns={columns} data={formattedData} />
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between p-4 border-l">
//           <Checkout />
//         </div>
//       </div>

//       <AddCustomerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddCustomer}
//       />
//     </div>
//   );
// };

// export default Customers;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import SearchBar from "./SearchBar";
import AddCustomerModal from "./AddCustomerModal";
import Checkout from "./Checkout";
import TableComp from "./TableComp/TableComp";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { getOrderCustomers } from "../api/apiServices";
import {
  createCustomer,
  getCustomers,
  deleteCustomer,
  deleteOrderCustomer,
} from "../api/apiServices";

import type { Customer } from "../api/apiServices";

const Customers = () => {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orderCustomers, setOrderCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] =
    useState<"customers" | "orders">("customers");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadCustomers();
    loadOrderCustomers();
  }, []);

  /* ================= LOAD CUSTOMERS ================= */

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);

      if (activeTab === "customers") {
        setFilteredCustomers(data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= LOAD ORDER CUSTOMERS ================= */

  const loadOrderCustomers = async () => {

  try {

    const data = await getOrderCustomers();

    setOrderCustomers(data);

    if (activeTab === "orders") {
      setFilteredCustomers(data);
    }

  } catch (err) {
    console.log(err);
  }

};

  /* ================= SEARCH ================= */

  const handleSearch = (query: string) => {

    const list =
      activeTab === "customers" ? customers : orderCustomers;

    if (!query.trim()) {
      setFilteredCustomers(list);
      return;
    }

    const lowered = query.toLowerCase();

    const filtered = list.filter(
      (c) =>
        c.name?.toLowerCase().includes(lowered) ||
        c.phone?.toLowerCase().includes(lowered)
    );

    setFilteredCustomers(filtered);
  };

  /* ================= ADD CUSTOMER ================= */

  const handleAddCustomer = async (customerData: Customer) => {

  try {

    const saved = await createCustomer(customerData);

    const updated = [...customers, saved];

    setCustomers(updated);
    setFilteredCustomers(updated);

    setIsModalOpen(false);

  } catch (err:any) {

    alert(err.message);

    console.log(err);

  }

};

  /* ================= DELETE CUSTOMER ================= */

  const handleDeleteCustomer = async (id?: string) => {

  if (!id) {
    alert("Customer ID missing");
    return;
  }

  if (!window.confirm("Delete this customer?")) return;

  try {

    await deleteCustomer(id);

    const updated = customers.filter((c) => c._id !== id);

    setCustomers(updated);
    setFilteredCustomers(updated);

  } catch (err) {
    console.log(err);
  }

};

  /* ================= DELETE ORDER CUSTOMER ================= */

  const handleDeleteOrderCustomer = async (customerId: string) => {

    if (!window.confirm("Delete this order customer?")) return;

    try {

      await deleteOrderCustomer(customerId);

      const updated = orderCustomers.filter(
        (c) => c._id !== customerId
      );

      setOrderCustomers(updated);
      setFilteredCustomers(updated);

    } catch (err) {
      console.log(err);
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    { Header: "Customer name", accessor: "name" },
    { Header: "Phone no.", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "Action", accessor: "action" },
  ];

  const formattedData = filteredCustomers.map((c) => ({

    ...c,

    address: `${c.address || ""}, ${c.city || ""}, ${
      c.state || ""
    }, ${c.country || ""} ${c.zip || ""}`,

    action: (
      <button
        onClick={() =>
          activeTab === "customers"
            ? handleDeleteCustomer(c._id!)
            : handleDeleteOrderCustomer(c._id!)
        }
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash />
      </button>
    ),

  }));

  /* ================= UI ================= */

  return (

    <div className="h-screen flex flex-col">

      <Header />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        <div className="relative flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">

          <SearchBar onSearch={handleSearch} />

          <div className="flex w-full justify-between items-center px-4">

            <Link to="/" className="flex items-center">
              <MdOutlineArrowBackIosNew />
              <span className="text-xl font-bold ml-2">
                CUSTOMERS
              </span>
            </Link>

            {activeTab === "customers" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-(--buttonbg) py-1 px-4 rounded-lg font-semibold flex items-center"
              >
                Add Customer
                <span className="ml-2">
                  <IoIosArrowForward />
                </span>
              </button>
            )}

          </div>

          {/* TABS */}

          <div className="flex gap-4 w-full px-4">

            <button
              onClick={() => {
                setActiveTab("customers");
                setFilteredCustomers(customers);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "customers"
                  ? "bg-(--main) text-white"
                  : "bg-gray-200"
              }`}
            >
              Customers
            </button>

            <button
              onClick={() => {
                setActiveTab("orders");
                setFilteredCustomers(orderCustomers);
              }}
              className={`px-4 py-2 rounded ${
                activeTab === "orders"
                  ? "bg-(--main) text-white"
                  : "bg-gray-200"
              }`}
            >
              Order Customers
            </button>

          </div>

          <div className="overflow-x-auto w-[93%] max-h-[65vh] shadow-md rounded-xl">
            <TableComp columns={columns} data={formattedData} />
          </div>

        </div>

        <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between p-4 border-l">
          <Checkout />
        </div>

      </div>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCustomer}
      />

    </div>
  );
};

export default Customers;