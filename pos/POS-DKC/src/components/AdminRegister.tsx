// // components/AdminRegister.tsx
// import { useState } from "react";
// import { registerAdmin } from "../api/apiServices";
// import { useNavigate } from "react-router-dom";

// const AdminRegister = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const navigate = useNavigate();

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (form.password !== form.confirmPassword) {
//       return alert("Passwords not match");
//     }

//     try {
//       await registerAdmin(form);
//       alert("Admin Registered");
//       navigate("/login");
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl shadow w-[350px] space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center">Admin Register</h2>

//         <input placeholder="Name" className="input" onChange={(e)=>setForm({...form,name:e.target.value})}/>
//         <input placeholder="Email" className="input" onChange={(e)=>setForm({...form,email:e.target.value})}/>
//         <input placeholder="Phone" className="input" onChange={(e)=>setForm({...form,phone:e.target.value})}/>
//         <input type="password" placeholder="Password" className="input" onChange={(e)=>setForm({...form,password:e.target.value})}/>
//         <input type="password" placeholder="Confirm Password" className="input" onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}/>

//         <button className="btn">Register</button>
//       </form>
//     </div>
//   );
// };

// export default AdminRegister;






import { useState } from "react";
import { registerAdmin } from "../api/apiServices";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await registerAdmin(form);
      alert("Admin Registered Successfully");
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 space-y-5"
      >
        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Admin Register
          </h2>
          <p className="text-sm text-white/80 mt-1">
            Create your admin account
          </p>
        </div>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          className="input-modern"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          className="input-modern"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PHONE */}
        <input
          type="text"
          placeholder="Phone Number"
          className="input-modern"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-modern pr-10"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="input-modern pr-10"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            {showConfirm ? <IoEyeOff size={20} /> : <IoEye size={20} />}
          </button>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-white text-blue-600 font-semibold py-2 rounded-xl hover:bg-blue-100 transition duration-200"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-white/80 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer hover:text-white"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;