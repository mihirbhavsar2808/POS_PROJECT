import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaAngleDown,
  FaUser,
  FaPlus,
  FaBoxes,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
};

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="relative z-40 bg-[#3D2314] w-full px-7 py-3.5 flex justify-between items-center border-b border-white/10 shadow">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-lg"
        >
          <FaBars />
        </button>

        <Link to="/admin-products">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8A882] to-[#8B6F5E] flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-[#FAF6F1] font-bold text-lg">DKC</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden md:flex items-center gap-1.5 bg-[#C8A882]/10 border border-[#C8A882]/20 rounded-full px-3 py-1">
          <span className="text-[#C8A882] text-xs">
            {new Date().toLocaleDateString("en-IN")}
          </span>
        </div>

        <div className="relative z-50" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-white"
          >
            <FaUser />
            <span>Admin</span>
            <FaAngleDown />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[110%] w-52 rounded-2xl border border-[#C8A882]/20 shadow-xl bg-[#2a1709] overflow-hidden z-50">

              <div className="px-4 py-3 bg-[#3D2314] border-b border-white/10">
                <p className="text-[#FAF6F1] text-xs font-bold">
                  Admin Account
                </p>
              </div>

              <div className="p-2">
                <Link
                  to="/addproduct"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#E9DCCF]/75 hover:bg-[#C8A882]/15"
                >
                  <FaPlus /> Add Product
                </Link>

                <Link
                  to="/stock-check"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#E9DCCF]/75 hover:bg-[#C8A882]/15"
                >
                  <FaBoxes /> Stock Check
                </Link>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;