// import { useEffect, useState } from "react";
// import { FaBackspace, FaAngleRight } from "react-icons/fa";
// // import Header from "./Header";
// import {useNavigate } from "react-router-dom"; 
// // import { useAuth } from "../auth/AuthContext";
// import type { AppDispatch } from "../app/store";
// import { useDispatch } from "react-redux";
// import { logout } from "../auth/authSlice";
// import TitleBanner from "./TitleBanner";

// const Lock = () => {
//   const navigate = useNavigate();
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [pin, setPin] = useState("");
//   const [error, setError] = useState("");
// const Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
// // const { logout } = useAuth();
// const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       const key = e.key;

//       if (/^[0-9]$/.test(key) && pin.length < 4) {
//         setPin((prev) => prev + key);
//       }

//       if (key === "Backspace" && pin.length > 0) {
//         setPin((prev) => prev.slice(0, -1));
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [pin]);

//   const handleClick = (num: number) => {
//     if (pin.length < 4) {
//       setPin(pin + num);
//     }
//   };

//   // const handleLogout = () => {
//   //   navigate("/login");
//   //   dispatch(logout())
//   //   // logout();
//   // };

//   const handleLogout = () => {
//   // 🔥 REMOVE TOKEN FIRST
//   localStorage.removeItem("POS-token");
//   localStorage.removeItem("POS-role");

//   // 🔥 CLEAR REDUX
//   dispatch(logout());

//   // 🔥 NAVIGATE WITH REPLACE
//   navigate("/login", { replace: true });
// };
//   useEffect(() => {
//     if (pin.length === 4) {
//       if (pin === CORRECT_PIN) {
//         setError("");
//         navigate("/");
//       } else {
//         setError("Incorrect PIN. Enter correct PIN.");
//         setTimeout(() => setPin(""), 1000);
//       }
//     }
//   }, [pin]);

//   const formattedTime = currentTime.toLocaleTimeString();
//   const formattedDate = (date: Date) => {
//     const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
//     const month = date.toLocaleDateString("en-US", { month: "long" });
//     const day = date.getDate();
//     const year = date.getFullYear();
//     return `${dayOfWeek} | ${month} ${day}, ${year}`;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center sm:justify-start">
//           <TitleBanner />
//       <div className="flex flex-col h-[calc(100%-6rem)] gap-4 items-center justify-center text-center py-6">
//         <div>
//           <h2 className="font-bold text-[30px] text-(--main)">
//             {formattedTime}
//           </h2>
//           <p className="font-bold text-[14px] text-(--main)">
//             {formattedDate(currentTime)}
//           </p>
//         </div>
//         <div className="font-bold">
//           <div className="text-[16px] text-(--eye-icon)">Welcome back</div>
//           <div className="text-[22px] text-(--main)">User</div>
//         </div>

//         <input
//           type="password"
//           value={pin}
//           readOnly
//           className="border-2 border-(--main)/50 rounded-xl py-2 px-15 text-center text-2xl w-2xs"
//         />
//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <div className="grid grid-cols-3 gap-5 text-2xl">
//           {Numbers.map((num, index) => (
//             <button
//               key={index}
//               onClick={() => handleClick(num)}
//               className="w-15 h-16 rounded-full bg-(--bgorder) text-xl font-medium shadow"
//             >
//               {num}
//             </button>
//           ))}
//           <FaBackspace
//             onClick={() => setPin(pin.slice(0, -1))}
//             className="w-15 h-16 p-5 rounded-full bg-(--bgorder) font-medium shadow cursor-pointer"
//           />
//         </div>
//       </div>
//       <div className="fixed bottom-4 left-0 right-0 px-4">
//         <button
//           onClick={handleLogout}
//           className="flex items-center text-xl cursor-pointer "
//         >
//           Log Out <FaAngleRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Lock;


















// import { useEffect, useState } from "react";
// import { FaBackspace, FaAngleRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../auth/authSlice";
// import type { AppDispatch } from "../app/store";
// import TitleBanner from "./TitleBanner";

// const Lock = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const [pin, setPin] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [time, setTime] = useState(new Date());

//   const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

//   // ✅ VERIFY PIN FROM BACKEND
//   const verifyPin = async (enteredPin: string) => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/auth/verify-pin", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: localStorage.getItem("POS-userId"),
//           pin: enteredPin,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message);
//         setPin("");
//         return;
//       }

//       // ✅ SUCCESS
//       navigate("/");
//     } catch (err) {
//       setError("Server error");
//       setPin("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ AUTO VERIFY
//   useEffect(() => {
//     if (pin.length === 4) {
//       verifyPin(pin);
//     }
//   }, [pin]);

//   // ✅ TIME
//   useEffect(() => {
//     const interval = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ INPUT
//   const handleClick = (num: number) => {
//     if (pin.length < 4) setPin((prev) => prev + String(num));
//   };

//   // ✅ LOGOUT
//   const handleLogout = () => {
//     localStorage.clear();
//     dispatch(logout());
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <TitleBanner />

//       <div className="flex flex-col items-center gap-4 mt-10">

//         <h1 className="text-3xl font-bold text-blue-600">
//           {time.toLocaleTimeString()}
//         </h1>

//         <p className="text-gray-600">
//           {time.toDateString()}
//         </p>

//         <h2 className="text-xl font-semibold mt-4">Enter PIN</h2>

//         {/* PIN DISPLAY */}
//         <input
//           type="password"
//           value={pin}
//           readOnly
//           className="border-2 border-blue-400 rounded-xl py-2 px-6 text-center text-2xl tracking-[10px]"
//         />

//         {/* ERROR */}
//         {error && <p className="text-red-500">{error}</p>}
//         {loading && <p className="text-gray-500">Verifying...</p>}

//         {/* KEYPAD */}
//         <div className="grid grid-cols-3 gap-4 mt-4">
//           {numbers.map((num) => (
//             <button
//               key={num}
//               onClick={() => handleClick(num)}
//               className="w-16 h-16 bg-white shadow rounded-full text-lg font-bold active:scale-95"
//             >
//               {num}
//             </button>
//           ))}

//           <FaBackspace
//             onClick={() => setPin(pin.slice(0, -1))}
//             className="w-16 h-16 p-5 bg-white rounded-full shadow cursor-pointer"
//           />
//         </div>

//         {/* LOGOUT */}
//         <button
//           onClick={handleLogout}
//           className="mt-6 flex items-center gap-2 text-lg"
//         >
//           Logout <FaAngleRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Lock;





import { useEffect, useState } from "react";
import { FaBackspace, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TitleBanner from "./TitleBanner";
import { getCurrentUser } from "../api/apiServices";
const Lock = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  // ✅ VERIFY PIN (MongoDB)
  const verifyPin = async (enteredPin: string) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("POS-userId");
      const res = await fetch("http://localhost:5000/api/auth/verify-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          pin: enteredPin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect PIN");
        setTimeout(() => setPin(""), 1000);
        return;
      }

      // ✅ SUCCESS
      setError("");
      localStorage.setItem("isLocked", "false");

      navigate("/", { replace: true });

    } catch (err) {
      setError("Server error");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("POS-role");

    if (role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, []);
  // ✅ AUTO VERIFY WHEN 4 DIGITS
  useEffect(() => {
    if (pin.length === 4) {
      verifyPin(pin);
    }
  }, [pin]);

  // ✅ TIME
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ KEYBOARD INPUT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (/^[0-9]$/.test(key) && pin.length < 4) {
        setPin((prev) => prev + key);
      }

      if (key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user.name);
      } catch (err) {
        console.log(err);
      }
    };

    loadUser();
  }, []);

  // ✅ BUTTON INPUT
  const handleClick = (num: number) => {
    if (pin.length < 4) {
      setPin((prev) => prev + String(num));
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    navigate("/logout");
  };

  // ✅ FORMAT DATE
  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayOfWeek} | ${month} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center sm:justify-start">
      <TitleBanner />

      <div className="flex flex-col h-[calc(100%-6rem)] gap-4 items-center justify-center text-center py-6">

        {/* TIME */}
        <div>
          <h2 className="font-bold text-[30px] text-(--main)">
            {formattedTime}
          </h2>
          <p className="font-bold text-[14px] text-(--main)">
            {formattedDate(currentTime)}
          </p>
        </div>

        {/* USER */}
        <div className="font-bold">
          <div className="text-[16px] text-(--eye-icon)">Welcome back</div>
          <div className="text-[22px] text-(--main)">
            {userName || "User"}
          </div>
        </div>

        {/* PIN INPUT */}
        <input
          type="password"
          value={pin}
          readOnly
          className="border-2 border-(--main)/50 rounded-xl py-2 px-15 text-center text-2xl w-2xs tracking-[10px]"
        />

        {/* ERROR */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {loading && <p className="text-gray-400 text-sm">Checking...</p>}

        {/* KEYPAD */}
        <div className="grid grid-cols-3 gap-5 text-2xl">
          {Numbers.map((num, index) => (
            <button
              key={index}
              onClick={() => handleClick(num)}
              className="w-15 h-16 rounded-full bg-(--bgorder) text-xl font-medium shadow active:scale-95"
            >
              {num}
            </button>
          ))}

          <FaBackspace
            onClick={() => setPin((prev) => prev.slice(0, -1))}
            className="w-15 h-16 p-5 rounded-full bg-(--bgorder) shadow cursor-pointer"
          />
        </div>
      </div>

      {/* LOGOUT */}
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center text-xl cursor-pointer"
        >
          Log Out <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default Lock;