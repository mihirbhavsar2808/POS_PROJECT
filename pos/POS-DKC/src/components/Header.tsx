import { useState, useEffect, useRef } from "react";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../api/apiServices";

const Header = () => {
  const [menuopen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || parsed.username || "Shop Owner");
        return;
      } catch (error) {
        console.error("Error parsing stored User:", error);
      }
    }

    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user.name || user.email || "Shop Owner");
      } catch {
        const role = localStorage.getItem("POS-role");
        setUserName(role === "admin" ? "Shop Owner" : "Admin");
      }
    };

    loadUser();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header className="bg-(--main) w-full p-8 py-3 font-semibold text-2xl flex justify-between">
        <Link to="/">
          <div className="text-white">DKC</div>
        </Link>

        <div className="text-white">
          <div className="flex items-center text-xl text-white relative">

            {/* REF ADDED HERE */}
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 px-0 py-2 rounded-xl transition"
                onClick={() => setMenuOpen(!menuopen)}
              >
                <FaUser />
                <span className="max-w-[8rem] truncate text-sm font-medium">
                  {userName || "Admin"}
                </span>
                <FaAngleDown className={`transition-transform ${menuopen ? "rotate-180" : ""}`} />
              </button>

              {menuopen && (
                <div className="absolute lg:right-0 -right-6 w-56 rounded-xl border shadow-xl overflow-hidden z-50 bg-(--primary) transition-all duration-300">
                  <div className="bg-(--primary)">
                    {/* <Link to="/profile" className="block px-4 py-3 text-lg text-black border-b border-gray-400 hover:bg-gray-100">
                      Profile
                    </Link> */}

                    <div>
                      <Link to="/order" className="block px-4 py-3 text-lg text-(--main) border-b border-gray-400">
                        Orders
                      </Link>
                      {/* <Link to="/activities" className="block px-4 py-3 text-lg text-(--main) border-b border-gray-400">
                        Activities
                      </Link> */}
                      {/* <Link to="/request" className="block px-4 py-3 text-lg text-(--main) border-b border-gray-400">
                        Request Inventory
                      </Link> */}
                      {/* <Link to="/setting" className="block px-4 py-3 text-lg text-(--main) border-b border-gray-400">
                        Settings
                      </Link> */}
                      <Link to="/lock" className="block px-4 py-3 text-lg border-b text-(--main) border-gray-400">
                        Close shop
                      </Link>
                      <Link to="/hold-order" className="block w-full text-left px-4 py-3 text-lg text-(--main) border-b border-gray-400">
                        Hold Order
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.clear(); 
                          window.location.href = "/";  
                        }}
                        className="block w-full text-left px-4 py-3 text-lg text-(--main) border-b border-gray-400 cursor-pointer"
                      >
                        Logout
                      </button>

                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
