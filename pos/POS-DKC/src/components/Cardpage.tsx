// import React, { useState, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { CiCreditCard1 } from "react-icons/ci";
// import { FaLock, FaCheckCircle } from "react-icons/fa";
// import { updateOrder, updateOrderStatus } from "../api/apiServices";
// import Header from "./Header";

// /* ─── helpers ─── */
// const formatCardNumber = (v: string) =>
//   v
//     .replace(/\D/g, "")
//     .slice(0, 16)
//     .replace(/(.{4})/g, "$1 ")
//     .trim();

// const formatExpiry = (v: string) => {
//   const digits = v.replace(/\D/g, "").slice(0, 4);
//   return digits.length >= 3
//     ? `${digits.slice(0, 2)}/${digits.slice(2)}`
//     : digits;
// };

// const getCardType = (number: string): "visa" | "mastercard" | "amex" | "unknown" => {
//   const n = number.replace(/\s/g, "");
//   if (/^4/.test(n)) return "visa";
//   if (/^5[1-5]/.test(n)) return "mastercard";
//   if (/^3[47]/.test(n)) return "amex";
//   return "unknown";
// };

// /* ─── card brand logos (inline SVG) ─── */
// const VisaLogo = () => (
//   <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="none">
//     <text x="0" y="14" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#1A1F71">VISA</text>
//   </svg>
// );

// const MastercardLogo = () => (
//   <svg viewBox="0 0 38 24" className="h-5 w-auto">
//     <circle cx="14" cy="12" r="12" fill="#EB001B" />
//     <circle cx="24" cy="12" r="12" fill="#F79E1B" />
//     <path d="M19 5.5a12 12 0 0 1 0 13A12 12 0 0 1 19 5.5z" fill="#FF5F00" />
//   </svg>
// );

// /* ─── animated card preview ─── */
// const CardPreview: React.FC<{
//   number: string;
//   name: string;
//   expiry: string;
//   flipped: boolean;
//   cvv: string;
// }> = ({ number, name, expiry, flipped, cvv }) => {
//   const cardType = getCardType(number);
//   const displayNumber = (number || "•••• •••• •••• ••••")
//     .padEnd(19, "•")
//     .replace(/X/g, "•");

//   return (
//     <div
//       className="w-full max-w-sm mx-auto"
//       style={{ perspective: "1000px", height: "200px" }}
//     >
//       <div
//         className="relative w-full h-full transition-all duration-700"
//         style={{
//           transformStyle: "preserve-3d",
//           transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
//         }}
//       >
//         {/* FRONT */}
//         <div
//           className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
//           style={{
//             backfaceVisibility: "hidden",
//             background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a2d4a 100%)",
//           }}
//         >
//           {/* shimmer overlay */}
//           <div
//             className="absolute inset-0 opacity-20 rounded-2xl"
//             style={{
//               background:
//                 "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)",
//             }}
//           />
//           <div className="relative flex justify-between items-start">
//             <div className="flex flex-col">
//               <span className="text-white/60 text-xs tracking-widest uppercase">
//                 Credit Card
//               </span>
//               {cardType !== "unknown" && (
//                 <div className="mt-1">
//                   {cardType === "visa" ? <VisaLogo /> : <MastercardLogo />}
//                 </div>
//               )}
//             </div>
//             <FaLock className="text-white/40 text-lg" />
//           </div>

//           {/* chip */}
//           <div
//             className="relative w-10 h-7 rounded-md"
//             style={{
//               background: "linear-gradient(135deg, #d4a843, #f0c84a)",
//             }}
//           >
//             <div className="absolute inset-1 grid grid-cols-2 gap-0.5 opacity-60">
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//             </div>
//           </div>

//           <div className="relative">
//             <p className="text-white font-mono tracking-[0.2em] text-lg">
//               {displayNumber.slice(0, 19)}
//             </p>
//             <div className="flex justify-between mt-3">
//               <div>
//                 <p className="text-white/50 text-xs uppercase tracking-widest">
//                   Card Holder
//                 </p>
//                 <p className="text-white font-medium text-sm truncate max-w-[150px]">
//                   {name || "YOUR NAME"}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-white/50 text-xs uppercase tracking-widest">
//                   Expires
//                 </p>
//                 <p className="text-white font-medium text-sm">
//                   {expiry || "MM/YY"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BACK */}
//         <div
//           className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center"
//           style={{
//             backfaceVisibility: "hidden",
//             transform: "rotateY(180deg)",
//             background: "linear-gradient(135deg, #1a2d4a 0%, #2d6a9f 100%)",
//           }}
//         >
//           <div className="h-12 bg-black/60 w-full mb-4" />
//           <div className="px-6 flex items-center gap-4">
//             <div className="flex-1 h-10 bg-white/10 rounded" />
//             <div className="bg-white rounded px-3 py-2 min-w-[56px] text-center">
//               <p className="text-xs text-gray-400 mb-0.5">CVV</p>
//               <p className="font-mono font-bold text-gray-800 tracking-widest">
//                 {cvv || "•••"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── main component ─── */
// const PaymentPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const orderData: any = location.state;

//   const [cardNumber, setCardNumber] = useState("");
//   const [cardName, setCardName] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cvvFocused, setCvvFocused] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const cvvRef = useRef<HTMLInputElement>(null);

//   /* ─── validation ─── */
//   const validate = () => {
//     const e: Record<string, string> = {};
//     const rawNum = cardNumber.replace(/\s/g, "");
//     if (rawNum.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
//     if (!cardName.trim()) e.cardName = "Cardholder name is required";
//     const [mm, yy] = expiry.split("/");
//     if (!mm || !yy || parseInt(mm) > 12 || parseInt(mm) < 1)
//       e.expiry = "Enter a valid expiry (MM/YY)";
//     if (cvv.length < 3) e.cvv = "CVV must be 3-4 digits";
//     return e;
//   };

//   /* ─── submit ─── */
//   const handlePayment = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }
//     setErrors({});
//     setProcessing(true);

//     try {
//       // Simulate card processing delay
//       await new Promise((r) => setTimeout(r, 2000));

//       if (orderData?._id) {
//         await updateOrder(orderData._id, { status: "Paid" });
//       }

//       setSuccess(true);

//       setTimeout(() => {
//         navigate("/invoice", { state: orderData });
//       }, 1800);
//     } catch (err) {
//       console.error(err);
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       if (orderData?._id) {
//         await updateOrderStatus(orderData._id, "Failed");
//       }
//     } catch (_) {}
//     navigate("/inventory");
//   };

//   /* ─── success overlay ─── */
//   if (success) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
//         <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
//         <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
//         <p className="text-gray-500">Redirecting to invoice…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen overflow-y-auto bg-gray-50">
//       <Header />

//       <div className="max-w-4xl mx-auto px-4 py-8">

//         {/* heading */}
//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2 bg-blue-600 rounded-lg">
//             <CiCreditCard1 className="text-white text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Card Payment</h1>
//             <p className="text-sm text-gray-500 flex items-center gap-1">
//               <FaLock className="text-green-500 text-xs" />
//               Secure &amp; encrypted transaction
//             </p>
//           </div>
//           <div className="ml-auto text-right">
//             <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
//             <p className="text-2xl font-bold text-blue-600">
//               ${Number(orderData?.totalAmount || 0).toFixed(2)}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* LEFT – card preview */}
//           <div className="flex flex-col gap-6">
//             <CardPreview
//               number={cardNumber}
//               name={cardName}
//               expiry={expiry}
//               flipped={cvvFocused}
//               cvv={cvv}
//             />

//             {/* order summary */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//               <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
//                 Order Summary
//               </p>
//               <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
//                 {orderData?.cartItems?.map((item: any, i: number) => (
//                   <div
//                     key={i}
//                     className="flex justify-between text-sm text-gray-700"
//                   >
//                     <span className="truncate max-w-[180px]">
//                       {item.title || item.product?.title}{" "}
//                       <span className="text-gray-400">×{item.quantity}</span>
//                     </span>
//                     <span className="font-medium ml-2">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t mt-3 pt-3 flex justify-between font-bold">
//                 <span>Total</span>
//                 <span className="text-blue-600">
//                   ${Number(orderData?.totalAmount || 0).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT – form */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">

//             {/* card number */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Card Number
//               </label>
//               <div
//                 className={`flex items-center border rounded-xl px-3 py-2 gap-2 transition-all ${
//                   errors.cardNumber
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
//                 }`}
//               >
//                 <CiCreditCard1 className="text-gray-400 text-xl shrink-0" />
//                 <input
//                   className="flex-1 outline-none font-mono text-base bg-transparent"
//                   placeholder="0000 0000 0000 0000"
//                   value={cardNumber}
//                   maxLength={19}
//                   onChange={(e) => {
//                     setCardNumber(formatCardNumber(e.target.value));
//                     setErrors((p) => ({ ...p, cardNumber: "" }));
//                   }}
//                 />
//                 {getCardType(cardNumber) === "visa" && <VisaLogo />}
//                 {getCardType(cardNumber) === "mastercard" && <MastercardLogo />}
//               </div>
//               {errors.cardNumber && (
//                 <p className="text-red-500 text-xs">{errors.cardNumber}</p>
//               )}
//             </div>

//             {/* cardholder */}
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Cardholder Name
//               </label>
//               <input
//                 className={`border rounded-xl px-3 py-2 outline-none text-base transition-all ${
//                   errors.cardName
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 }`}
//                 placeholder="Name on card"
//                 value={cardName}
//                 onChange={(e) => {
//                   setCardName(e.target.value.toUpperCase());
//                   setErrors((p) => ({ ...p, cardName: "" }));
//                 }}
//               />
//               {errors.cardName && (
//                 <p className="text-red-500 text-xs">{errors.cardName}</p>
//               )}
//             </div>

//             {/* expiry + cvv */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   Expiry Date
//                 </label>
//                 <input
//                   className={`border rounded-xl px-3 py-2 outline-none text-base font-mono transition-all ${
//                     errors.expiry
//                       ? "border-red-400 bg-red-50"
//                       : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   }`}
//                   placeholder="MM/YY"
//                   value={expiry}
//                   maxLength={5}
//                   onChange={(e) => {
//                     setExpiry(formatExpiry(e.target.value));
//                     setErrors((p) => ({ ...p, expiry: "" }));
//                   }}
//                 />
//                 {errors.expiry && (
//                   <p className="text-red-500 text-xs">{errors.expiry}</p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   CVV
//                 </label>
//                 <input
//                   ref={cvvRef}
//                   className={`border rounded-xl px-3 py-2 outline-none text-base font-mono transition-all ${
//                     errors.cvv
//                       ? "border-red-400 bg-red-50"
//                       : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   }`}
//                   placeholder="•••"
//                   type="password"
//                   maxLength={4}
//                   value={cvv}
//                   onFocus={() => setCvvFocused(true)}
//                   onBlur={() => setCvvFocused(false)}
//                   onChange={(e) => {
//                     setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
//                     setErrors((p) => ({ ...p, cvv: "" }));
//                   }}
//                 />
//                 {errors.cvv && (
//                   <p className="text-red-500 text-xs">{errors.cvv}</p>
//                 )}
//               </div>
//             </div>

//             {/* accepted cards */}
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-400">Accepted:</span>
//               <VisaLogo />
//               <MastercardLogo />
//             </div>

//             {/* actions */}
//             <div className="flex flex-col gap-3 mt-auto pt-2">
//               <button
//                 disabled={processing}
//                 onClick={handlePayment}
//                 className="w-full py-3 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2 transition-all"
//                 style={{
//                   background: processing
//                     ? "#93c5fd"
//                     : "linear-gradient(90deg, #1e40af, #2563eb)",
//                 }}
//               >
//                 {processing ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8z"
//                       />
//                     </svg>
//                     Processing…
//                   </>
//                 ) : (
//                   <>
//                     <FaLock className="text-sm" />
//                     Pay ${Number(orderData?.totalAmount || 0).toFixed(2)}
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={handleCancel}
//                 disabled={processing}
//                 className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;











// import React, { useState, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { CiCreditCard1 } from "react-icons/ci";
// import { FaLock, FaCheckCircle } from "react-icons/fa";
// import { updateOrder, updateOrderStatus } from "../api/apiServices";
// import Header from "./Header";

// /* ─── helpers ─── */
// const formatCardNumber = (v: string) =>
//   v
//     .replace(/\D/g, "")
//     .slice(0, 16)
//     .replace(/(.{4})/g, "$1 ")
//     .trim();

// const formatExpiry = (v: string) => {
//   const digits = v.replace(/\D/g, "").slice(0, 4);
//   return digits.length >= 3
//     ? `${digits.slice(0, 2)}/${digits.slice(2)}`
//     : digits;
// };

// const getCardType = (number: string): "visa" | "mastercard" | "amex" | "unknown" => {
//   const n = number.replace(/\s/g, "");
//   if (/^4/.test(n)) return "visa";
//   if (/^5[1-5]/.test(n)) return "mastercard";
//   if (/^3[47]/.test(n)) return "amex";
//   return "unknown";
// };

// /* ─── card brand logos (inline SVG) ─── */
// const VisaLogo = () => (
//   <svg viewBox="0 0 48 16" className="h-5 w-auto" fill="none">
//     <text x="0" y="14" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#1A1F71">VISA</text>
//   </svg>
// );

// const MastercardLogo = () => (
//   <svg viewBox="0 0 38 24" className="h-5 w-auto">
//     <circle cx="14" cy="12" r="12" fill="#EB001B" />
//     <circle cx="24" cy="12" r="12" fill="#F79E1B" />
//     <path d="M19 5.5a12 12 0 0 1 0 13A12 12 0 0 1 19 5.5z" fill="#FF5F00" />
//   </svg>
// );

// /* ─── animated card preview ─── */
// const CardPreview: React.FC<{
//   number: string;
//   name: string;
//   expiry: string;
//   flipped: boolean;
//   cvv: string;
// }> = ({ number, name, expiry, flipped, cvv }) => {
//   const cardType = getCardType(number);
//   const displayNumber = (number || "•••• •••• •••• ••••")
//     .padEnd(19, "•")
//     .replace(/X/g, "•");

//   return (
//     <div
//       className="w-full max-w-sm mx-auto"
//       style={{ perspective: "1000px", height: "200px" }}
//     >
//       <div
//         className="relative w-full h-full transition-all duration-700"
//         style={{
//           transformStyle: "preserve-3d",
//           transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
//         }}
//       >
//         {/* FRONT */}
//         <div
//           className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
//           style={{
//             backfaceVisibility: "hidden",
//             background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a2d4a 100%)",
//           }}
//         >
//           <div
//             className="absolute inset-0 opacity-20 rounded-2xl"
//             style={{
//               background:
//                 "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)",
//             }}
//           />
//           <div className="relative flex justify-between items-start">
//             <div className="flex flex-col">
//               <span className="text-white/60 text-xs tracking-widest uppercase">
//                 Credit Card
//               </span>
//               {cardType !== "unknown" && (
//                 <div className="mt-1">
//                   {cardType === "visa" ? <VisaLogo /> : <MastercardLogo />}
//                 </div>
//               )}
//             </div>
//             <FaLock className="text-white/40 text-lg" />
//           </div>

//           <div
//             className="relative w-10 h-7 rounded-md"
//             style={{
//               background: "linear-gradient(135deg, #d4a843, #f0c84a)",
//             }}
//           >
//             <div className="absolute inset-1 grid grid-cols-2 gap-0.5 opacity-60">
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//               <div className="rounded-sm bg-yellow-800/40" />
//             </div>
//           </div>

//           <div className="relative">
//             <p className="text-white font-mono tracking-[0.2em] text-lg">
//               {displayNumber.slice(0, 19)}
//             </p>
//             <div className="flex justify-between mt-3">
//               <div>
//                 <p className="text-white/50 text-xs uppercase tracking-widest">
//                   Card Holder
//                 </p>
//                 <p className="text-white font-medium text-sm truncate max-w-[150px]">
//                   {name || "YOUR NAME"}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-white/50 text-xs uppercase tracking-widest">
//                   Expires
//                 </p>
//                 <p className="text-white font-medium text-sm">
//                   {expiry || "MM/YY"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BACK */}
//         <div
//           className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center"
//           style={{
//             backfaceVisibility: "hidden",
//             transform: "rotateY(180deg)",
//             background: "linear-gradient(135deg, #1a2d4a 0%, #2d6a9f 100%)",
//           }}
//         >
//           <div className="h-12 bg-black/60 w-full mb-4" />
//           <div className="px-6 flex items-center gap-4">
//             <div className="flex-1 h-10 bg-white/10 rounded" />
//             <div className="bg-white rounded px-3 py-2 min-w-[56px] text-center">
//               <p className="text-xs text-gray-400 mb-0.5">CVV</p>
//               <p className="font-mono font-bold text-gray-800 tracking-widest">
//                 {cvv || "•••"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─── main component ─── */
// const CardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* ✅ SAFE DATA FETCH */
//   const orderData: any = location.state || {};

//   const [cardNumber, setCardNumber] = useState("");
//   const [cardName, setCardName] = useState(
//     orderData?.customer?.name || ""
//   );
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cvvFocused, setCvvFocused] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const cvvRef = useRef<HTMLInputElement>(null);

//   /* ─── validation ─── */
//   const validate = () => {
//     const e: Record<string, string> = {};
//     const rawNum = cardNumber.replace(/\s/g, "");
//     if (rawNum.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
//     if (!cardName.trim()) e.cardName = "Cardholder name is required";
//     const [mm, yy] = expiry.split("/");
//     if (!mm || !yy || parseInt(mm) > 12 || parseInt(mm) < 1)
//       e.expiry = "Enter a valid expiry (MM/YY)";
//     if (cvv.length < 3) e.cvv = "CVV must be 3-4 digits";
//     return e;
//   };

//   /* ─── submit ─── */
//   const handlePayment = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }
//     setErrors({});
//     setProcessing(true);

//     try {
//       await new Promise((r) => setTimeout(r, 2000));

//       /* ✅ FIXED MONGODB UPDATE */
//       if (orderData?._id) {
//         await updateOrder(orderData._id, {
//           status: "Paid",
//           paymentMethod: "card",
//           customer: orderData?.customer?._id,
//         });
//       }

//       setSuccess(true);

//       setTimeout(() => {
//         navigate("/invoice", { state: orderData });
//       }, 1800);
//     } catch (err) {
//       console.error(err);
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       if (orderData?._id) {
//         await updateOrderStatus(orderData._id, "Failed");
//       }
//     } catch (_) {}
//     navigate("/inventory");
//   };

//   /* ─── success overlay ─── */
//   if (success) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
//         <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
//         <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
//         <p className="text-gray-500">Redirecting to invoice…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen overflow-y-auto bg-gray-50">
//       <Header />

//       <div className="max-w-4xl mx-auto px-4 py-8">

//         {/* UI SAME BELOW — NO CHANGE */}

//         <div className="flex items-center gap-3 mb-8">
//           <div className="p-2 bg-blue-600 rounded-lg">
//             <CiCreditCard1 className="text-white text-2xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Card Payment</h1>
//             <p className="text-sm text-gray-500 flex items-center gap-1">
//               <FaLock className="text-green-500 text-xs" />
//               Secure &amp; encrypted transaction
//             </p>
//           </div>
//           <div className="ml-auto text-right">
//             <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
//             <p className="text-2xl font-bold text-blue-600">
//               ${Number(orderData?.totalAmount || 0).toFixed(2)}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           <div className="flex flex-col gap-6">
//             <CardPreview
//               number={cardNumber}
//               name={cardName}
//               expiry={expiry}
//               flipped={cvvFocused}
//               cvv={cvv}
//             />

//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//               <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
//                 Order Summary
//               </p>
//               <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
//                 {orderData?.cartItems?.map((item: any, i: number) => (
//                   <div
//                     key={i}
//                     className="flex justify-between text-sm text-gray-700"
//                   >
//                     <span className="truncate max-w-[180px]">
//                       {item.title || item.product?.title}{" "}
//                       <span className="text-gray-400">×{item.quantity}</span>
//                     </span>
//                     <span className="font-medium ml-2">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t mt-3 pt-3 flex justify-between font-bold">
//                 <span>Total</span>
//                 <span className="text-blue-600">
//                   ${Number(orderData?.totalAmount || 0).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE UNCHANGED */}
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">

//             {/* KEEP EVERYTHING SAME */}

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Card Number
//               </label>
//               <div className={`flex items-center border rounded-xl px-3 py-2 gap-2 transition-all`}>
//                 <CiCreditCard1 className="text-gray-400 text-xl shrink-0" />
//                 <input
//                   className="flex-1 outline-none font-mono text-base bg-transparent"
//                   placeholder="0000 0000 0000 0000"
//                   value={cardNumber}
//                   maxLength={19}
//                   onChange={(e) => {
//                     setCardNumber(formatCardNumber(e.target.value));
//                   }}
//                 />
//                 {getCardType(cardNumber) === "visa" && <VisaLogo />}
//                 {getCardType(cardNumber) === "mastercard" && <MastercardLogo />}
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Cardholder Name
//               </label>
//               <input
//                 className="border rounded-xl px-3 py-2 outline-none text-base"
//                 value={cardName}
//                 onChange={(e) => setCardName(e.target.value.toUpperCase())}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 placeholder="MM/YY"
//                 value={expiry}
//                 onChange={(e) => setExpiry(formatExpiry(e.target.value))}
//                 className="border p-2 rounded"
//               />
//               <input
//                 placeholder="CVV"
//                 value={cvv}
//                 onChange={(e) => setCvv(e.target.value)}
//                 className="border p-2 rounded"
//               />
//             </div>

//             <button
//               disabled={processing}
//               onClick={handlePayment}
//               className="w-full py-3 rounded-xl text-white"
//               style={{
//                 background: processing
//                   ? "#93c5fd"
//                   : "linear-gradient(90deg, #1e40af, #2563eb)",
//               }}
//             >
//               Pay ${Number(orderData?.totalAmount || 0).toFixed(2)}
//             </button>

//             <button onClick={handleCancel} className="border py-2 rounded">
//               Cancel
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardPage;







// import React, { useRef, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { CiCreditCard1 } from "react-icons/ci";
// import { FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
// import { updateOrder, updateOrderStatus } from "../api/apiServices";
// import Header from "./Header";

// /* ─────────────────── HELPERS ─────────────────── */
// const fmt4 = (v: string) =>
//   v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

// const fmtExp = (v: string) => {
//   const d = v.replace(/\D/g, "").slice(0, 4);
//   return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
// };

// const cardBrand = (n: string): "visa" | "mastercard" | "amex" | null => {
//   const raw = n.replace(/\s/g, "");
//   if (/^4/.test(raw)) return "visa";
//   if (/^5[1-5]/.test(raw)) return "mastercard";
//   if (/^3[47]/.test(raw)) return "amex";
//   return null;
// };

// /* ─────────────────── BRAND BADGES ─────────────────── */
// const VisaBadge = ({ dim = false }: { dim?: boolean }) => (
//   <div
//     style={{
//       padding: "2px 10px",
//       borderRadius: 6,
//       fontSize: 10,
//       fontWeight: 900,
//       letterSpacing: "0.2em",
//       border: dim ? "1.5px solid #e5e7eb" : "1.5px solid var(--main)",
//       color: dim ? "#d1d5db" : "var(--main)",
//       background: dim ? "transparent" : "rgba(30,58,95,0.07)",
//       transition: "all 0.3s",
//       fontFamily: "serif",
//     }}
//   >
//     VISA
//   </div>
// );

// const McBadge = ({ dim = false }: { dim?: boolean }) => (
//   <div style={{ display: "flex", alignItems: "center", opacity: dim ? 0.2 : 1, transition: "all 0.3s" }}>
//     <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#ef4444" }} />
//     <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#facc15", marginLeft: -8 }} />
//   </div>
// );

// /* ─────────────────── ANIMATED CARD ─────────────────── */
// const CardPreview: React.FC<{
//   number: string; name: string; expiry: string; cvv: string; flipped: boolean;
// }> = ({ number, name, expiry, cvv, flipped }) => {
//   const brand = cardBrand(number);
//   const groups = (number || "").replace(/\s/g, "").padEnd(16, "·");
//   const parts = [groups.slice(0, 4), groups.slice(4, 8), groups.slice(8, 12), groups.slice(12, 16)];

//   return (
//     <div style={{ perspective: 1000, width: "100%", maxWidth: 380, margin: "0 auto" }}>
//       <div
//         style={{
//           transformStyle: "preserve-3d",
//           transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
//           transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
//           height: 200,
//           position: "relative",
//         }}
//       >
//         {/* FRONT — card face uses --main color so it matches site theme */}
//         <div
//           style={{
//             position: "absolute", inset: 0, backfaceVisibility: "hidden",
//             borderRadius: 20, overflow: "hidden",
//             background: "linear-gradient(135deg, var(--main) 0%, #1e5a9c 55%, var(--main) 100%)",
//             boxShadow: "0 20px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
//             padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between",
//           }}
//         >
//           <div style={{ position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none", background: "radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
//           <div style={{ position: "absolute", bottom: -20, right: -20, width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
//           <div style={{ position: "absolute", bottom: -40, right: -40, width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)" }} />

//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
//             <div style={{
//               width: 38, height: 28, borderRadius: 5,
//               background: "linear-gradient(135deg, #c9973a, #f0d070, #c9973a)",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//               display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2, padding: 4,
//             }}>
//               {[0, 1, 2, 3].map(i => (
//                 <div key={i} style={{ borderRadius: 2, background: "rgba(100,60,0,0.45)" }} />
//               ))}
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               {brand === "visa" && (
//                 <div style={{ padding: "2px 10px", borderRadius: 6, fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", border: "1.5px solid rgba(255,255,255,0.8)", color: "#fff", fontFamily: "serif" }}>VISA</div>
//               )}
//               {brand === "mastercard" && <McBadge />}
//               {!brand && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", fontFamily: "monospace" }}>● ● ●</div>}
//             </div>
//           </div>

//           <div style={{ position: "relative", zIndex: 1 }}>
//             <div style={{ display: "flex", gap: 12, marginBottom: 14, fontFamily: "'Courier New', monospace", letterSpacing: "0.18em", fontSize: 17, color: "#fff", fontWeight: 600 }}>
//               {parts.map((p, i) => <span key={i} style={{ opacity: i < 3 ? 0.85 : 1 }}>{p}</span>)}
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
//               <div>
//                 <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>Card Holder</div>
//                 <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, letterSpacing: "0.08em", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "YOUR NAME"}</div>
//               </div>
//               <div style={{ textAlign: "right" }}>
//                 <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>Expires</div>
//                 <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "monospace" }}>{expiry || "MM/YY"}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BACK */}
//         <div style={{
//           position: "absolute", inset: 0, backfaceVisibility: "hidden",
//           transform: "rotateY(180deg)", borderRadius: 20, overflow: "hidden",
//           background: "linear-gradient(135deg, var(--main), #1e5a9c)",
//           boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
//         }}>
//           <div style={{ height: 44, background: "rgba(0,0,0,0.7)", marginTop: 32 }} />
//           <div style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ flex: 1, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.08)" }} />
//             <div style={{ background: "#fff", borderRadius: 8, padding: "6px 14px", minWidth: 62, textAlign: "center" }}>
//               <div style={{ fontSize: 8, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 2 }}>CVV</div>
//               <div style={{ fontFamily: "monospace", fontWeight: 700, color: "#111", fontSize: 15, letterSpacing: "0.2em" }}>
//                 {cvv ? "•".repeat(cvv.length) : "•••"}
//               </div>
//             </div>
//           </div>
//           <div style={{ padding: "0 22px" }}>
//             <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>
//               This card is property of Issuing Bank. Misuse is criminal offense.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────── FIELD WRAPPER ─────────────────── */
// const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
//   <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//     <label style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em" }}>
//       {label}
//     </label>
//     {children}
//     {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 2 }}>{error}</p>}
//   </div>
// );

// /* ─────────────────── MAIN PAGE ─────────────────── */
// const CardPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const orderData: any = location.state;

//   const [cardNumber, setCardNumber] = useState("");
//   const [cardName, setCardName] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [cvvFocused, setCvvFocused] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [focusedField, setFocusedField] = useState<string | null>(null);

//   const cvvRef = useRef<HTMLInputElement>(null);

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number";
//     if (!cardName.trim()) e.cardName = "Cardholder name is required";
//     const [mm, yy] = expiry.split("/");
//     if (!mm || !yy || +mm < 1 || +mm > 12) e.expiry = "Enter valid expiry MM/YY";
//     if (cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
//     return e;
//   };

//   const handlePay = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setErrors({});
//     setProcessing(true);
//     try {
//       await new Promise((r) => setTimeout(r, 2000));
//       if (orderData?._id) await updateOrder(orderData._id, { status: "Paid" });
//       setSuccess(true);
//       setTimeout(() => navigate("/invoice", { state: orderData }), 1800);
//     } catch (err) {
//       console.error(err);
//       setProcessing(false);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       if (orderData?._id) await updateOrderStatus(orderData._id, "Failed");
//     } catch (_) {}
//     navigate("/inventory");
//   };

//   /* ── success screen ── */
//   if (success) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-(--pin-button) gap-4">
//         <div style={{ background: "#fff", borderRadius: "50%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
//           <FaCheckCircle style={{ color: "#22c55e", fontSize: 52 }} />
//         </div>
//         <h2 className="text-2xl font-bold text-(--main)">Payment Successful!</h2>
//         <p className="text-gray-500 text-sm">Redirecting to invoice…</p>
//         <style>{`@keyframes pop { from { transform: scale(0.5); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>
//       </div>
//     );
//   }

//   const brand = cardBrand(cardNumber);
//   const totalAmount = Number(orderData?.totalAmount || 0).toFixed(2);

//   return (
//     <div className="h-screen overflow-hidden bg-(--pin-button)">
//       <Header />

//       <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">

//         {/* ══════════════ LEFT PANEL ══════════════ */}
//         <div className="w-full lg:w-[68%] bg-white flex flex-col overflow-hidden">

//           {/* Top header bar — bg-(--pin-button) like CancelOrder */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-(--pin-button)">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-(--main)">
//                 <CiCreditCard1 className="text-white text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-(--main)">Card Payment</h1>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <FaLock className="text-green-500 text-[10px]" />
//                   Secure &amp; encrypted
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-400 uppercase tracking-wider">Total Due</p>
//               <p className="text-2xl font-extrabold text-(--main)">${totalAmount}</p>
//             </div>
//           </div>

//           {/* Customer info bar */}
//           {orderData?.customer && (
//             <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 border-b border-blue-100">
//               <FaUser className="text-(--eye-icon) text-sm" />
//               <span className="text-sm font-semibold text-(--main)">{orderData.customer.name}</span>
//               {orderData.customer.phone && <span className="text-xs text-gray-400">· {orderData.customer.phone}</span>}
//               {orderData.customer.email && <span className="text-xs text-gray-400">· {orderData.customer.email}</span>}
//             </div>
//           )}

//           {/* Scrollable form area */}
//           <div className="flex-1 overflow-y-auto p-6">

//             {/* Card preview */}
//             <div className="mb-6">
//               <CardPreview number={cardNumber} name={cardName} expiry={expiry} cvv={cvv} flipped={cvvFocused} />
//             </div>

//             {/* Accepted brands
//             <div className="flex items-center gap-3 mb-5">
//               <span className="text-xs text-gray-400 uppercase tracking-wider">Accepted</span>
//               <VisaBadge dim={brand !== null && brand !== "visa"} />
//               <McBadge dim={brand !== null && brand !== "mastercard"} />
//             </div> */}

//             {/* Form — bg-(--pin-button) wrapper, input borders use --primary like CancelOrder inputs */}
//             <div className="bg-(--pin-button) rounded-2xl p-4 flex flex-col gap-4">

//               {/* Card Number */}
//               <Field label="Card Number" error={errors.cardNumber}>
//                 <div
//                   style={{
//                     display: "flex", alignItems: "center",
//                     border: errors.cardNumber
//                       ? "1px solid #f87171"
//                       : focusedField === "number"
//                         ? "1px solid var(--primary)"
//                         : "1px solid var(--primary)",
//                     borderRadius: 6, padding: "0 10px", gap: 8, background: "#fff",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   <CiCreditCard1 style={{ color: "#9ca3af", fontSize: 20, flexShrink: 0 }} />
//                   <input
//                     style={{
//                       flex: 1, padding: "9px 0", border: "none", outline: "none",
//                       fontSize: 14, fontFamily: "monospace", background: "transparent",
//                       letterSpacing: "0.08em", color: "var(--main)",
//                     }}
//                     placeholder="0000  0000  0000  0000"
//                     value={cardNumber}
//                     maxLength={19}
//                     onFocus={() => setFocusedField("number")}
//                     onBlur={() => setFocusedField(null)}
//                     onChange={(e) => {
//                       setCardNumber(fmt4(e.target.value));
//                       setErrors((p) => ({ ...p, cardNumber: "" }));
//                     }}
//                   />
//                   {brand === "visa" && <VisaBadge />}
//                   {brand === "mastercard" && <McBadge />}
//                 </div>
//               </Field>

//               {/* Cardholder Name */}
//               <Field label="Cardholder Name" error={errors.cardName}>
//                 <div
//                   className="flex flex-col border rounded px-2"
//                   style={{ borderColor: errors.cardName ? "#f87171" : "var(--primary)", background: "#fff" }}
//                 >
//                   <input
//                     className="outline-none py-2 text-base font-semibold text-(--main)"
//                     placeholder="Name on card"
//                     value={cardName}
//                     onFocus={() => setFocusedField("name")}
//                     onBlur={() => setFocusedField(null)}
//                     onChange={(e) => {
//                       setCardName(e.target.value.toUpperCase());
//                       setErrors((p) => ({ ...p, cardName: "" }));
//                     }}
//                   />
//                 </div>
//               </Field>

//               {/* Expiry + CVV */}
//               <div className="grid grid-cols-2 gap-4">
//                 <Field label="Expiry Date" error={errors.expiry}>
//                   <div
//                     className="flex flex-col border rounded px-2"
//                     style={{ borderColor: errors.expiry ? "#f87171" : "var(--primary)", background: "#fff" }}
//                   >
//                     <input
//                       className="outline-none py-2 text-base font-semibold text-(--main)"
//                       style={{ fontFamily: "monospace", letterSpacing: "0.1em" }}
//                       placeholder="MM/YY"
//                       value={expiry}
//                       maxLength={5}
//                       onFocus={() => setFocusedField("expiry")}
//                       onBlur={() => setFocusedField(null)}
//                       onChange={(e) => {
//                         setExpiry(fmtExp(e.target.value));
//                         setErrors((p) => ({ ...p, expiry: "" }));
//                       }}
//                     />
//                   </div>
//                 </Field>

//                 <Field label="CVV" error={errors.cvv}>
//                   <div
//                     className="flex flex-col border rounded px-2"
//                     style={{ borderColor: errors.cvv ? "#f87171" : "var(--primary)", background: "#fff" }}
//                   >
//                     <input
//                       ref={cvvRef}
//                       type="password"
//                       className="outline-none py-2 text-base font-semibold text-(--main)"
//                       style={{ fontFamily: "monospace", letterSpacing: "0.2em" }}
//                       placeholder="•••"
//                       maxLength={4}
//                       value={cvv}
//                       onFocus={() => { setCvvFocused(true); setFocusedField("cvv"); }}
//                       onBlur={() => { setCvvFocused(false); setFocusedField(null); }}
//                       onChange={(e) => {
//                         setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
//                         setErrors((p) => ({ ...p, cvv: "" }));
//                       }}
//                     />
//                   </div>
//                 </Field>
//               </div>

//               {/* Security note */}
//               {/* <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
//                 <RiShieldCheckLine className="text-green-500 text-lg shrink-0" />
//                 <p className="text-xs text-green-700">
//                   Your card details are encrypted with 256-bit SSL and never stored.
//                 </p>
//               </div> */}

//             </div>
//           </div>
//         </div>

//         {/* ══════════════ RIGHT PANEL — identical to CancelOrder: bg-(--secondary) ══════════════ */}
//         <div className="w-full lg:w-[32%] p-6 bg-(--secondary) flex flex-col justify-between">

//           {/* Cancel button — pixel-perfect match to CancelOrder */}
//           <div className="font-serif">
//             <button
//               onClick={handleCancel}
//               disabled={processing}
//               className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors"
//             >
//               Cancel order
//             </button>
//             <hr className="mt-3" />
//           </div>

//           {/* Cart items — same card style as CancelOrder */}
//           <div className="flex-1 overflow-y-auto space-y-3 py-3 max-h-[45vh] scrollbar-hide">
//             {orderData?.cartItems?.map((item: any, i: number) => {
//               const image = item.thumbnail || item.product?.thumbnail || item.product?.image || "";
//               const title = item.title || item.product?.title || "Product";
//               return (
//                 <div
//                   key={i}
//                   className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
//                 >
//                   <div className="flex gap-3 items-center">
//                     {image && (
//                       <img
//                         src={`http://localhost:5000/uploads/${image}`}
//                         alt={title}
//                         className="w-12 h-12 rounded-sm object-cover"
//                       />
//                     )}
//                     <div>
//                       <h4 className="font-medium text-sm">{title}</h4>
//                       <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
//                     </div>
//                   </div>
//                   <div className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Totals + buttons */}
//           <div className="flex flex-col gap-3">
//             <div className="flex justify-between text-black text-bold border-t border-white/10 pt-3">
//               <span>Subtotal</span>
//               <span>${totalAmount}</span>
//             </div>
//             <div className="flex justify-between text-black font-bold text-sm">
//               <span>Total</span>
//               <span>${totalAmount}</span>
//             </div>

//             {/* Pay — matches CancelOrder's Validate button: bg-(--main) text-white */}
//             <button
//               disabled={processing}
//               onClick={handlePay}
//               className={`w-full py-2 text-white rounded px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
//                 processing ? "bg-(--main)/40 cursor-not-allowed" : "bg-(--main)"
//               }`}
//             >
//               {processing ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                   </svg>
//                   Processing…
//                 </>
//               ) : (
//                 <>
//                   <FaLock className="text-xs" />
//                   Pay ${totalAmount}
//                 </>
//               )}
//             </button>

//             {/* Back — matches CancelOrder's Back button: bg-white text-black */}
//             <button
//               onClick={() => navigate(-1)}
//               disabled={processing}
//               className="w-full py-3 px-4 rounded bg-white text-black text-sm font-medium hover:bg-gray-50 transition-all"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>

//       </div>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
//       `}</style>
//     </div>
//   );
// };

// export default CardPage;







import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiCreditCard1 } from "react-icons/ci";
import { FaLock, FaUser, FaCheckCircle } from "react-icons/fa";
import { updateOrder, updateOrderStatus } from "../api/apiServices";
import Header from "./Header";

/* ─────────────────── HELPERS ─────────────────── */
const fmt4 = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const cardBrand = (n: string): "visa" | "mastercard" | "amex" | null => {
  const raw = n.replace(/\s/g, "");
  if (/^4/.test(raw)) return "visa";
  if (/^5[1-5]/.test(raw)) return "mastercard";
  if (/^3[47]/.test(raw)) return "amex";
  return null;
};
const formatPrice = (value: number | string) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ─────────────────── BRAND BADGES ─────────────────── */
const VisaBadge = ({ dim = false }: { dim?: boolean }) => (
  <div
    className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-[0.2em] border transition-all font-serif ${dim
        ? "border-gray-200 text-gray-300 bg-transparent"
        : "border-(--main) text-(--main) bg-[rgba(30,58,95,0.07)]"
      }`}
  >
    VISA
  </div>
);

const McBadge = ({ dim = false }: { dim?: boolean }) => (
  <div className={`flex items-center transition-all ${dim ? "opacity-20" : "opacity-100"}`}>
    <div className="w-[18px] h-[18px] rounded-full bg-red-500" />
    <div className="w-[18px] h-[18px] rounded-full bg-yellow-400 -ml-2" />
  </div>
);

/* ─────────────────── ANIMATED CARD ─────────────────── */
const CardPreview: React.FC<{
  number: string; name: string; expiry: string; cvv: string; flipped: boolean;
}> = ({ number, name, expiry, cvv, flipped }) => {
  const brand = cardBrand(number);
  const groups = (number || "").replace(/\s/g, "").padEnd(16, "·");
  const parts = [groups.slice(0, 4), groups.slice(4, 8), groups.slice(8, 12), groups.slice(12, 16)];

  return (
    <div className="w-full max-w-[380px] mx-auto" style={{ perspective: 1000 }}>
      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
          height: 200,
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden flex flex-col justify-between p-[22px_24px]"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, var(--main) 0%, #1e5a9c 55%, var(--main) 100%)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* shimmer */}
          <div
            className="absolute inset-0 rounded-[20px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
          />
          {/* deco circles */}
          <div className="absolute -bottom-5 -right-5 w-40 h-40 rounded-full border border-white/[0.06]" />
          <div className="absolute -bottom-10 -right-10 w-[220px] h-[220px] rounded-full border border-white/[0.04]" />

          {/* top row */}
          <div className="relative z-10 flex justify-between items-start">
            {/* EMV chip */}
            <div
              className="w-[38px] h-7 rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-1"
              style={{
                background: "linear-gradient(135deg, #c9973a, #f0d070, #c9973a)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              }}
            >
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="rounded-sm bg-[rgba(100,60,0,0.45)]" />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {brand === "visa" && (
                <div className="px-2.5 py-0.5 rounded text-[10px] font-black tracking-[0.2em] border border-white/80 text-white font-serif">
                  VISA
                </div>
              )}
              {brand === "mastercard" && <McBadge />}
              {!brand && (
                <div className="text-[9px] text-white/35 tracking-[0.12em] font-mono">● ● ●</div>
              )}
            </div>
          </div>

          {/* card number + info */}
          <div className="relative z-10">
            <div className="flex gap-3 mb-3.5 font-mono tracking-[0.18em] text-[17px] text-white font-semibold">
              {parts.map((p, i) => (
                <span key={i} className={i < 3 ? "opacity-85" : "opacity-100"}>{p}</span>
              ))}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[8px] text-white/45 uppercase tracking-[0.15em] mb-[3px]">Card Holder</div>
                <div className="text-[13px] text-white font-semibold tracking-[0.08em] max-w-[160px] truncate">
                  {name || "YOUR NAME"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-white/45 uppercase tracking-[0.15em] mb-[3px]">Expires</div>
                <div className="text-[13px] text-white font-semibold font-mono">{expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, var(--main), #1e5a9c)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
          }}
        >
          <div className="h-11 bg-black/70 mt-8 w-full" />
          <div className="flex items-center gap-3 px-[22px] pt-4">
            <div className="flex-1 h-9 rounded-md bg-white/[0.08]" />
            <div className="bg-white rounded-lg px-3.5 py-1.5 min-w-[62px] text-center">
              <div className="text-[8px] text-gray-400 font-semibold tracking-[0.1em] mb-0.5">CVV</div>
              <div className="font-mono font-bold text-gray-800 text-[15px] tracking-[0.2em]">
                {cvv ? "•".repeat(cvv.length) : "•••"}
              </div>
            </div>
          </div>
          <div className="px-[22px] pt-2">
            <div className="text-[9px] text-white/25 tracking-[0.06em]">
              This card is property of Issuing Bank. Misuse is criminal offense.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── FIELD WRAPPER ─────────────────── */
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.12em]">
      {label}
    </label>
    {children}
    {error && <p className="text-red-400 text-[11px] mt-0.5">{error}</p>}
  </div>
);

/* ─────────────────── MAIN PAGE ─────────────────── */
const CardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData: any = location.state || {};
  useEffect(() => {
    if (!orderData?._id) {
      navigate("/inventory");
    }
  }, []);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cvvFocused, setCvvFocused] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const cvvRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid 16-digit card number";
    if (!cardName.trim()) e.cardName = "Cardholder name is required";
    const [mm, yy] = expiry.split("/");
    if (!mm || !yy || +mm < 1 || +mm > 12) e.expiry = "Enter valid expiry MM/YY";
    if (cvv.length < 3) e.cvv = "CVV must be 3–4 digits";
    return e;
  };

  const handlePay = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));
      if (orderData?._id) await updateOrder(orderData._id, { status: "Paid" });
      setSuccess(true);
      setTimeout(() => navigate("/payment", { state: orderData }), 1800);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (orderData?._id) await updateOrderStatus(orderData._id, "Failed");
    } catch (_) { }
    navigate("/inventory");
  };

  /* ── success screen ── */
  if (success) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-(--pin-button) gap-4">
        <div
          className="bg-white rounded-full p-7 shadow-2xl"
          style={{ animation: "pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>
        <h2 className="text-2xl font-bold text-(--main)">Payment Successful!</h2>
        <p className="text-gray-500 text-sm">Thanks For Card Payment</p>
        <style>{`@keyframes pop { from { transform: scale(0.5); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>
      </div>
    );
  }

  const brand = cardBrand(cardNumber);
  const totalAmount = formatPrice(orderData?.totalAmount || 0);

  return (
    <div className="h-screen overflow-hidden bg-(--pin-button)">
      <Header />

      <div className="flex flex-col lg:flex-row h-[calc(100%-4rem)]">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="w-full lg:w-[68%] bg-white flex flex-col overflow-hidden">

          {/* Top header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-(--pin-button)">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-(--main)">
                <CiCreditCard1 className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-(--main)">Card Payment</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FaLock className="text-green-500 text-[10px]" />
                  Secure &amp; encrypted
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Due</p>
              <p className="text-2xl font-extrabold text-(--main)">₹{totalAmount}</p>
            </div>
          </div>

          {/* Customer info bar */}
          {orderData?.customer && (
            <div className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 border-b border-blue-100">
              <FaUser className="text-(--eye-icon) text-sm" />
              <span className="text-sm font-semibold text-(--main)">{orderData.customer.name}</span>
              {orderData.customer.phone && (
                <span className="text-xs text-gray-400">· {orderData.customer.phone}</span>
              )}
              {orderData.customer.email && (
                <span className="text-xs text-gray-400">· {orderData.customer.email}</span>
              )}
            </div>
          )}

          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* Card preview */}
            <div className="mb-6">
              <CardPreview
                number={cardNumber}
                name={cardName}
                expiry={expiry}
                cvv={cvv}
                flipped={cvvFocused}
              />
            </div>

            {/* Form wrapper */}
            <div className="bg-(--pin-button) rounded-2xl p-4 flex flex-col gap-4">

              {/* Card Number */}
              <Field label="Card Number" error={errors.cardNumber}>
                <div
                  className={`flex items-center rounded border px-2.5 gap-2 bg-white transition-all ${errors.cardNumber
                      ? "border-red-400"
                      : focusedField === "number"
                        ? "border-(--primary)"
                        : "border-(--primary)"
                    }`}
                >
                  <CiCreditCard1 className="text-gray-400 text-xl shrink-0" />
                  <input
                    className="flex-1 py-2.5 border-none outline-none text-sm font-mono bg-transparent tracking-[0.08em] text-(--main)"
                    placeholder="0000  0000  0000  0000"
                    value={cardNumber}
                    maxLength={19}
                    onFocus={() => setFocusedField("number")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setCardNumber(fmt4(e.target.value));
                      setErrors((p) => ({ ...p, cardNumber: "" }));
                    }}
                  />
                  {brand === "visa" && <VisaBadge />}
                  {brand === "mastercard" && <McBadge />}
                </div>
              </Field>

              {/* Cardholder Name */}
              <Field label="Cardholder Name" error={errors.cardName}>
                <div
                  className={`flex flex-col border rounded px-2 bg-white ${errors.cardName ? "border-red-400" : "border-(--primary)"
                    }`}
                >
                  <input
                    className="outline-none py-2 text-base font-semibold text-(--main) bg-transparent"
                    placeholder="Name on card"
                    value={cardName}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => {
                      setCardName(e.target.value.toUpperCase());
                      setErrors((p) => ({ ...p, cardName: "" }));
                    }}
                  />
                </div>
              </Field>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry Date" error={errors.expiry}>
                  <div
                    className={`flex flex-col border rounded px-2 bg-white ${errors.expiry ? "border-red-400" : "border-(--primary)"
                      }`}
                  >
                    <input
                      className="outline-none py-2 text-base font-semibold text-(--main) font-mono tracking-[0.1em] bg-transparent"
                      placeholder="MM/YY"
                      value={expiry}
                      maxLength={5}
                      onFocus={() => setFocusedField("expiry")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        setExpiry(fmtExp(e.target.value));
                        setErrors((p) => ({ ...p, expiry: "" }));
                      }}
                    />
                  </div>
                </Field>

                <Field label="CVV" error={errors.cvv}>
                  <div
                    className={`flex flex-col border rounded px-2 bg-white ${errors.cvv ? "border-red-400" : "border-(--primary)"
                      }`}
                  >
                    <input
                      ref={cvvRef}
                      type="password"
                      className="outline-none py-2 text-base font-semibold text-(--main) font-mono tracking-[0.2em] bg-transparent"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onFocus={() => { setCvvFocused(true); setFocusedField("cvv"); }}
                      onBlur={() => { setCvvFocused(false); setFocusedField(null); }}
                      onChange={(e) => {
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                        setErrors((p) => ({ ...p, cvv: "" }));
                      }}
                    />
                  </div>
                </Field>
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="w-full lg:w-[32%] p-6 bg-(--secondary) flex flex-col justify-between">

          {/* Cancel button */}
          <div className="font-serif">
            <button
              onClick={handleCancel}
              disabled={processing}
              className="bg-white w-full text-black font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel order
            </button>
            <hr className="mt-3" />
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 max-h-[60vh] scrollbar-hide">
            {orderData?.cartItems?.map((item: any, i: number) => {
              const image = item.thumbnail || item.product?.thumbnail || item.product?.image || "";
              const title = item.title || item.product?.title || "Product";
              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded-lg gap-2"
                >
                  <div className="flex gap-3 items-center">
                    {image && (
                      <img
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={title}
                        className="w-12 h-12 rounded-sm object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-sm">{title}</h4>
                      <p className="text-xs text-gray-500">₹{formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    ₹{formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate("/cancel-order", {
                  state: orderData
                })
              }
              disabled={processing}
              className="w-full py-3 px-4 rounded bg-white text-black text-sm font-medium hover:bg-gray-50 transition-all"
            >
              ← Back
            </button>

            <button
              disabled={processing}
              onClick={handlePay}
              className={`w-full py-2 text-white rounded px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${processing ? "bg-(--main)/40 cursor-not-allowed" : "bg-(--main)"
                }`}
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <FaLock className="text-xs" />
                  Pay ₹{totalAmount}
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pop { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default CardPage;