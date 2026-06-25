import SearchBar from "./SearchBar";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
// import { useCart } from "../auth/cartContext";
import Checkout from "./Checkout";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
} from "../api/apiServices";

const DiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [percent, setPercent] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();
  // const { cart } = useCart(); // ✅ get cart from context

  /* ================= FETCH COUPONS FROM MONGODB ================= */
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setDiscounts(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      fetchCoupons();
      return;
    }

    const filtered = discounts.filter(
      (item) =>
        item.reason.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase())
    );

    setDiscounts(filtered);
  };

  /* ================= ADD COUPON ================= */
  const handleAddCoupon = async () => {
    if (!percent || !reason) return;

    try {
      await createCoupon({
        code: `#TP-${Date.now()}`,
        percent: Number(percent),
        reason,
      });

      setPercent("");
      setReason("");
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE COUPON ================= */
  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="w-full lg:w-[70%] overflow-y-auto p-4 flex flex-col gap-4">

          <SearchBar onSearch={handleSearch} />

          <div className="px-2 sm:px-6 flex justify-between items-center">
            <h2 className="flex items-center text-xl font-semibold text-[var(--main)] gap-2">
              <Link to="/" className="text-[var(--main)]">
                <IoIosArrowBack />
              </Link>
              DISCOUNT
            </h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[var(--main)] text-white px-4 py-2 rounded-lg"
            >
              Add Coupon
            </button>
          </div>

          {/* ================= FORM ================= */}
          {showForm && (
            <div className="px-2 sm:px-6">
              <div className="bg-[var(--primary)]/20 border border-[var(--primary)] p-4 rounded-xl flex flex-col gap-3 items-center text-center relative">

                <IoClose
                  className="absolute top-2 right-2 text-xl cursor-pointer text-[var(--main)] hover:scale-110"
                  onClick={() => setShowForm(false)}
                />

                <h3 className="font-semibold text-[var(--main)]">
                  Create Coupon
                </h3>

                <input
                  type="number"
                  placeholder="Percentage"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="p-2 border rounded-lg w-2/3"
                />

                <input
                  type="text"
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="p-2 border rounded-lg w-2/3"
                />

                <button
                  onClick={handleAddCoupon}
                  className="bg-[var(--main)] text-white py-2 px-6 rounded-lg"
                >
                  Generate Coupon
                </button>
              </div>
            </div>
          )}

          {/* ================= TABLE ================= */}
          <div className="px-2 sm:px-6">
            <div className="overflow-auto shadow-md rounded-xl">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-[var(--main)] text-white">
                  <tr>
                    <th className="p-3 text-left">Coupon Code</th>
                    <th className="p-3 text-center">Percentage</th>
                    <th className="p-3 text-right">Reason</th>
                    <th className="p-3 text-center">Delete</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {discounts.map((d) => (
                    <tr
                      key={d._id}
                      className="bg-[var(--primary)]/20 border-b border-[var(--primary)] cursor-pointer hover:opacity-80"
                      onClick={() =>
                        navigate("/inventory", {
                          state: {
                            discountPercent: d.percent,
                            discountReason: d.reason,
                          },
                        })
                      }
                    >
                      <td className="p-3">{d.code}</td>
                      <td className="p-3 text-center">{d.percent}%</td>
                      <td className="p-3 text-right">{d.reason}</td>

                      <td className="p-3">
                        <div className="flex justify-center items-center">
                          <FaTrash
                            className="text-red-500 cursor-pointer hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(d._id);
                            }}
                          />
                        </div>
                      </td>
                    </tr>   
                  ))}

                  {discounts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4">
                        No coupons found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE (CART) ================= */}
        {/* <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between p-4 border-l">

          <h3 className="font-semibold mb-4">Selected Products</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500">No products selected</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>{item.title}</span>
                <span>
                  {item.quantity} × ${item.price}
                </span>
              </div>
            ))
          )}

        </div> */}
        <div className="w-full lg:w-[30%] bg-(--secondary) hidden lg:flex flex-col justify-between max-h-full p-4 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
          <Checkout />
        </div>
      </div>
    </div>
  );
};

export default DiscountPage;