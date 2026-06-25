// import React, { useEffect, useState } from "react";
// import { FaChevronDown } from "react-icons/fa";

// interface Product {
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   category: string;
// }

// interface PaymentDropdownProps {
//   dropdownOpen: boolean;
//   setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// interface cartItems extends Product {
//   quantity: number;
// }

// const PaymentDropdown: React.FC<PaymentDropdownProps> = ({ dropdownOpen, setDropdownOpen }) => {
//   const [cartItems, setCartItems] = useState<cartItems[]>([]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [discountValue, setDiscountValue] = useState("0%");
//   const [discountReason, setDiscountReason] = useState("");
//   const [customer, setCustomer] = useState<any>({});


//   useEffect(() => {
//   const lastOrderRaw = localStorage.getItem("lastOrder");
//   const discountPercent = localStorage.getItem("selectedDiscount") || "0%";
//   const reason = localStorage.getItem("discountReason") || "";

//   if (lastOrderRaw) {
//     const lastOrder = JSON.parse(lastOrderRaw);

//     const items = lastOrder.items || [];   // FIX
//     setCartItems(items);

//     const sub = items.reduce(
//       (acc: number, item: any) => acc + item.price * item.quantity,
//       0
//     );

//     const discountPerc = parseFloat(discountPercent.replace("%", ""));
//     const discountAmt = sub * (discountPerc / 100);
//     const taxAmt = (sub - discountAmt) * 0.08;
//     const totalAmt = sub - discountAmt + taxAmt;

//     setSubtotal(sub);
//     setDiscount(discountAmt);
//     setTax(taxAmt);
//     setTotal(totalAmt);

//     setCustomer(lastOrder.customer || {});
//   }

//   setDiscountValue(discountPercent);
//   setDiscountReason(reason);
// }, []);

//   return (
//     <div className="cursor-pointer w-full scrollbar-hide max-h-64 overflow-auto max-w-3xl flex flex-col gap-2 justify-between items-center bg-(--secondary) rounded-xl px-4 py-2 text-gray-800 outline-0">
//       <div className="flex justify-between w-full border-b"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >

//         <p>More payment details</p>
//         <FaChevronDown
//           className={`${!dropdownOpen ? null : "rotate-180 translate-y-1"
//             } right-0 transition-all`}
//         />
//       </div>
//       {/* <hr /> */}
//       <div className="w-full flex flex-col gap-2">
//         <div className="flex justify-between">
//           <span>Subtotal • {cartItems.length} items</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-gray-500">
//           <div className="flex flex-col ">
//             <span>Discount (-{discountValue})</span>
//             <span className="text-xs text-gray-400">{discountReason}</span>
//           </div>
//           <span>${discount.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between text-gray-500">
//           <span>Tax (+8%)</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between font-bold text-base">
//           <span>Total</span>
//           <span>${total.toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentDropdown;



// import React, { useEffect, useState } from "react";
// import { FaChevronDown } from "react-icons/fa";

// interface Product {
//   id?: number;
//   title: string;
//   price: number;
//   thumbnail: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// interface PaymentDropdownProps {
//   dropdownOpen: boolean;
//   setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   cartItems: CartItem[];
//   orderData: any;
// }

// const PaymentDropdown: React.FC<PaymentDropdownProps> = ({
//   dropdownOpen,
//   setDropdownOpen,
//   cartItems,
//   orderData,
// }) => {

//   const [subtotal, setSubtotal] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [total, setTotal] = useState(0);

//   const discountPercent = orderData?.discountPercent ?? 18;
//   const discountReason = orderData?.discountReason ?? "Default Discount";

//   useEffect(() => {

//     const sub = cartItems.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );

//     const discountAmt = sub * (discountPercent / 100);
//     const taxAmt = (sub - discountAmt) * 0.08;
//     const totalAmt = sub - discountAmt + taxAmt;

//     setSubtotal(sub);
//     setDiscount(discountAmt);
//     setTax(taxAmt);
//     setTotal(totalAmt);

//   }, [cartItems, discountPercent]);

//   return (
//     <div className="cursor-pointer w-full max-h-64 overflow-auto flex flex-col gap-2 bg-(--secondary) rounded-xl px-4 py-2">

//       <div
//         className="flex justify-between w-full border-b"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <p>More payment details</p>
//         <FaChevronDown
//           className={`${!dropdownOpen ? null : "rotate-180 translate-y-1"}`}
//         />
//       </div>

//       <div className="w-full flex flex-col gap-2">

//         <div className="flex justify-between">
//           <span>Subtotal • {cartItems.length} items</span>
//           <span>${subtotal.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between text-gray-500">
//           <div className="flex flex-col">
//             <span>Discount (-{discountPercent}%)</span>
//             <span className="text-xs text-gray-400">{discountReason}</span>
//           </div>
//           <span>${discount.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between text-gray-500">
//           <span>Tax (+8%)</span>
//           <span>${tax.toFixed(2)}</span>
//         </div>

//         <div className="flex justify-between font-bold text-base">
//           <span>Total</span>
//           <span>${total.toFixed(2)}</span>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PaymentDropdown;





import React from "react";
import { FaChevronDown } from "react-icons/fa";

interface Product {
  id?: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface PaymentDropdownProps {
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
  orderData: any;
}

const PaymentDropdown: React.FC<PaymentDropdownProps> = ({
  dropdownOpen,
  setDropdownOpen,
  cartItems,
  orderData,
}) => {

  /* ✅ USE ONLY BACKEND DATA */
  const subtotal = orderData?.subtotal ?? 0;
  const discount = orderData?.discountAmount ?? 0;
  const tax = orderData?.tax ?? 0;
  const total = orderData?.totalAmount ?? 0;

  const discountPercent = orderData?.discountPercent ?? 0;
  const discountReason = orderData?.discountReason ?? "";

  const formatPrice = (value: number | string) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <div className="cursor-pointer w-full max-h-64 overflow-auto flex flex-col gap-2 bg-(--secondary) rounded-xl px-4 py-2">

      <div
        className="flex justify-between w-full border-b"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <p>More payment details</p>
        <FaChevronDown
          className={`${!dropdownOpen ? null : "rotate-180 translate-y-1"}`}
        />
      </div>

      <div className="w-full flex flex-col gap-2">

        <div className="flex justify-between">
          <span>Subtotal • {cartItems.length} items</span>
          <span>₹{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <div className="flex flex-col">
            <span>Discount (-{discountPercent}%)</span>
            <span className="text-xs text-gray-400">
              {discountReason}
            </span>
          </div>
          <span>-₹{formatPrice(discount)}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>Tax (+8%)</span>
          <span>₹{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>₹{formatPrice(total)}</span>
        </div>

      </div>
    </div>
  );
};

export default PaymentDropdown;