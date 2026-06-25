// interface ProductCardProps {
//   product: {
//     _id: string;
//     id: number;
//     title: string;
//     price: number;
//     thumbnail: string;
//     category: string;
//     quantity: number;
//   };
//   onAdd: () => void;
// }

// const ProductCard = ({ product, onAdd }: ProductCardProps) => {
//   return (
//     <div
//       className="flex h-24 justify-between items-center p-4 rounded-md bg-gray-100 shadow-sm hover:shadow-md"
//     >
//       <div onClick={(e) => {
//         e.stopPropagation();
//         onAdd();
//       }} className="flex items-center gap-4 cursor-pointer">
//         <img
//           src={`http://localhost:5000/uploads/${product.thumbnail}`}
//           alt={product.title}
//           className="w-16 h-16 rounded-sm object-cover"
//         />
//         <div>
//           <h3 className="font-semibold text-base">{product.title}</h3>
//           <p className="text-sm text-gray-500">Size - 0 UK</p>
//         </div>
//       </div>

//       <div className="text-sm font-semibold">
//         ₹{Number(product.price).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;






// interface ProductCardProps {
//   product: {
//     _id: string;
//     id: number;
//     title: string;
//     price: number;
//     thumbnail: string;
//     category: string;
//     quantity: number;
//     initialStock?: number;
//   };
//   onAdd: () => void;
// }

// const ProductCard = ({ product, onAdd }: ProductCardProps) => {
//   const isOutOfStock = product.quantity === 0;

//   const percent =
//     product.initialStock && product.initialStock > 0
//       ? (product.quantity / product.initialStock) * 100
//       : 100;

//   const isLowStock = !isOutOfStock && percent <= 10;

//   return (
//     <div
//       className={`relative flex items-stretch rounded-xl overflow-hidden border ${
//         isOutOfStock ? "border-gray-200 opacity-60" : "border-[var(--primary)]"
//       }`}
//       style={{ backgroundColor: "var(--secondary)" }}
//     >
//       {/* Left accent bar */}
//       <div
//         className="w-1 flex-shrink-0"
//         style={{
//           backgroundColor: isOutOfStock
//             ? "#d1d5db"
//             : isLowStock
//             ? "#f97316"
//             : "var(--main)",
//         }}
//       />

//       {/* Image */}
//       <div className="flex-shrink-0 p-2.5">
//         <div className="w-[62px] h-[62px] rounded-lg overflow-hidden border border-[var(--primary)]">
//           <img
//             src={`http://localhost:5000/uploads/${product.thumbnail}`}
//             alt={product.title}
//             className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : ""}`}
//           />
//         </div>
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0 py-2.5 pr-2">
//         {/* Category pill */}
//         <span
//           className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
//           style={{
//             backgroundColor: isOutOfStock ? "#f3f4f6" : "var(--primary)",
//             color: isOutOfStock ? "#9ca3af" : "#374151",
//           }}
//         >
//           {product.category}
//         </span>

//         {/* Title */}
//         <h3
//           className="font-bold text-[13px] leading-snug truncate text-gray-800"
//           style={{ color: isOutOfStock ? "#9ca3af" : undefined }}
//         >
//           {product.title}
//         </h3>

//         {/* Size + stock status */}
//         <div className="flex items-center gap-1.5 mt-1 flex-wrap">
//           <span className="text-[10px] text-gray-500 font-medium">UK 0</span>
//           <span className="text-gray-300 text-[10px]">|</span>

//           {isOutOfStock ? (
//             <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
//               Out of Stock
//             </span>
//           ) : isLowStock ? (
//             <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
//               Low Stock ({percent.toFixed(0)}%)
//             </span>
//           ) : (
//             <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
//               In Stock
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Right: price + button */}
//       <div className="flex flex-col items-end justify-between py-2.5 pr-3 flex-shrink-0">
//         {/* Price */}
//         <p
//           className="text-[14px] font-black tracking-tight"
//           style={{
//             color: isOutOfStock ? "#9ca3af" : "#1f2937",
//             textDecoration: isOutOfStock ? "line-through" : "none",
//           }}
//         >
//           ₹
//           {Number(product.price).toLocaleString("en-IN", {
//             minimumFractionDigits: 2,
//           })}
//         </p>

//         {/* Button */}
//         {isOutOfStock ? (
//           <div
//             className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border"
//             style={{
//               backgroundColor: "#f3f4f6",
//               color: "#9ca3af",
//               borderColor: "#e5e7eb",
//             }}
//           >
//             {/* Bell icon */}
//             <svg
//               className="w-3 h-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//               />
//             </svg>
//             Notify
//           </div>
//         ) : (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onAdd();
//             }}
//             className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-white px-2.5 py-1.5 rounded-lg"
//             style={{ backgroundColor: "var(--main)" }}
//           >
//             <svg
//               className="w-3 h-3"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2.5}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             Add
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;











interface ProductCardProps {
  product: {
    _id: string;
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    category: string;
    quantity: number;
    initialStock?: number;
  };
  onAdd: () => void;
}

// const ProductCard = ({ product, onAdd }: ProductCardProps) => {
//   const isOutOfStock = product.quantity === 0;

//   const percent =
//     product.initialStock && product.initialStock > 0
//       ? (product.quantity / product.initialStock) * 100
//       : 100;

//   const isLowStock = !isOutOfStock && percent <= 10;

//   return (
//     <div
//       onClick={() => {
//         if (!isOutOfStock) onAdd();
//       }}
//       className={`relative flex items-stretch rounded-xl overflow-hidden border ${isOutOfStock
//           ? "border-red-200 bg-red-50 cursor-not-allowed"
//           : "border-[var(--primary)] bg-[var(--secondary)] cursor-pointer"
//         }`}
//     >
//       {isOutOfStock && (
//         <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
//         </div>
//       )}

//       {isLowStock && !isOutOfStock && (
//         <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
//           LOW {percent.toFixed(0)}%
//         </div>
//       )}


//       <div className="p-3">
//         <div className="w-[65px] h-[65px] rounded-lg overflow-hidden border">
//           <img
//             src={`http://localhost:5000/uploads/${product.thumbnail}`}
//             alt={product.title}
//             className={`w-full h-full object-cover ${isOutOfStock ? "grayscale opacity-70" : ""
//               }`}
//           />
//         </div>
//       </div>

//       <div className="flex-1 py-3 pr-2">
//         <span
//           className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mb-1"
//           style={{
//             backgroundColor: isOutOfStock ? "#fee2e2" : "var(--primary)",
//             color: isOutOfStock ? "#b91c1c" : "#374151",
//           }}
//         >
//           {product.category}
//         </span>

//         <h3
//           className={`font-bold text-[13px] ${isOutOfStock ? "text-red-400" : "text-gray-800"
//             }`}
//         >
//           {product.title}
//         </h3>

//         <div className="mt-1 text-[10px] font-bold uppercase">
//           {isOutOfStock ? (
//             <span className="text-red-500">Unavailable</span>
//           ) : isLowStock ? (
//             <span className="text-orange-500">Low Stock</span>
//           ) : (
//             <span className="text-green-600">In Stock</span>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col items-end justify-between py-3 pr-3">
//         <p
//           className={`text-[14px] font-black ${isOutOfStock ? "text-red-400 line-through" : "text-gray-900"
//             }`}
//         >
//           ₹
//           {Number(product.price).toLocaleString("en-IN", {
//             minimumFractionDigits: 2,
//           })}
//         </p>

//         {isOutOfStock ? (
//           <div className="text-[10px] font-bold px-3 py-1 rounded-md bg-red-100 text-red-600">
//             Not Available
//           </div>
//         ) : (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onAdd();
//             }}
//             className="text-[11px] font-bold text-white px-3 py-1.5 rounded-lg"
//             style={{ backgroundColor: "var(--main)" }}
//           >
//             + Add
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const isOutOfStock = product.quantity === 0;

  const percent =
    product.initialStock && product.initialStock > 0
      ? (product.quantity / product.initialStock) * 100
      : 100;

  const isLowStock = !isOutOfStock && percent <= 10;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onAdd();
      }}
      className={`flex items-center gap-3 rounded-2xl p-2.5 pr-4 border ${
        isOutOfStock
          ? "bg-rose-50 border-rose-200 cursor-not-allowed"
          
          : "bg-white border-gray-100 cursor-pointer"
      }`}
    >
      {/* Image with ribbon */}
      <div className="relative w-[72px] h-[72px] min-w-[72px] rounded-[10px] overflow-hidden border border-gray-500 ">
        <img
          src={`http://localhost:5000/uploads/${product.thumbnail}`}
          alt={product.title}
          className={`w-full h-full object-cover ${
            isOutOfStock ? "grayscale opacity-60" : ""
          }`}
        />

        {/* ✅ LEFT-side diagonal ribbon */}
        {isOutOfStock && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[24px] left-[-20px] bg-rose-700 text-rose-50 text-[7.5px] font-bold uppercase tracking-wide px-[22px] py-[2.5px] -rotate-45 whitespace-nowrap">
              Out of stock
            </div>
          </div>
        )}

        {/* Low stock badge */}
        {isLowStock && (
          <div className="absolute top-0 left-0 bg-amber-400 text-amber-900 text-[8px] font-bold uppercase px-2 py-[2px] rounded-br-lg">
            Low {percent.toFixed(0)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-0.5">
        <span
          className={`text-[9px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full w-fit ${
            isOutOfStock
              ? "bg-rose-200 text-rose-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {product.category}
        </span>

        <h3
          className={`text-[13px] font-medium ${
            isOutOfStock ? "text-rose-700" : "text-gray-900"
          }`}
        >
          {product.title}
        </h3>

        <span
          className={`text-[10px] font-bold uppercase tracking-wide ${
            isOutOfStock
              ? "text-rose-600"
              : isLowStock
              ? "text-amber-600"
              : "text-emerald-600"
          }`}
        >
          {isOutOfStock ? "Unavailable" : isLowStock ? "Low Stock" : "In Stock"}
        </span>
      </div>

      {/* Price + Action */}
      <div className="flex flex-col items-end gap-1.5">
        <p
          className={`text-[15px] font-bold ${
            isOutOfStock
              ? "line-through text-rose-600 font-normal"
              : "text-gray-900"
          }`}
        >
          ₹
          {Number(product.price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </p>

        {isOutOfStock ? (
          <button className="text-[10px] font-bold text-rose-800 bg-rose-200 rounded-lg px-2.5 py-1.5 whitespace-nowrap">
            Notify me
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="text-[11px] font-bold text-white bg-gray-900 rounded-lg px-3 py-1.5"
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;