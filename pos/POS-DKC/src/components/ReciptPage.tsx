// import { useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";

// const SHOP_UPI = "yourupi@bank";

// const ReceiptPrint = ({ orderData }: any) => {
//   const [cartItems, setCartItems] = useState<any[]>([]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [total, setTotal] = useState(0);
//   const [discountValue, setDiscountValue] = useState("0%");
//   const [discountReason, setDiscountReason] = useState("");
//   const [customer, setCustomer] = useState<any>({});

//   useEffect(() => {
//     if (!orderData) return;

//     const items = orderData.cartItems || [];

//     const sub = orderData.subtotal ?? 0;
//     const discountAmt = orderData.discountAmount ?? 0;
//     const taxAmt = orderData.tax ?? 0;
//     const totalAmt = orderData.totalAmount ?? 0;

//     setCartItems(items);
//     setSubtotal(sub);
//     setDiscount(discountAmt);
//     setTax(taxAmt);
//     setTotal(totalAmt);

//     setCustomer(orderData.customer || {});
//     setDiscountValue(`${orderData.discountPercent ?? 18}%`);
//     setDiscountReason(orderData.discountReason || "");
//   }, [orderData]);

//   const upiLink = `upi://pay?pa=${SHOP_UPI}&pn=DKC Pvt Ltd&am=${total.toFixed(
//     2
//   )}&cu=INR`;

//   return (
//     <div className="hidden print:flex print:justify-center print:bg-white">
//       <div className="print:w-[210mm] print:min-h-100px bg-white border border-gray-300 rounded-xl shadow-lg print:border-none print:shadow-none text-[14px]">

//         {/* HEADER */}
//         <div className="text-center bg-slate-800 text-white rounded-lg p-6 mb-6">
//           <h1 className="text-3xl font-bold tracking-wide uppercase">
//             DKC Pvt. Ltd.
//           </h1>
//           <p className="opacity-90">123 Market St, NY</p>
//           <p className="opacity-90">+1 555-123-4567</p>
//           <p className="text-sm mt-2 opacity-70">
//             {new Date().toLocaleString()}
//           </p>
//         </div>

//         {/* CUSTOMER */}
//         <div className="bg-gray-50 border rounded-md p-4 mb-6 text-sm">
//           <p><b>Customer:</b> {customer?.name || "N/A"}</p>
//           <p><b>Phone:</b> {customer?.phone || "N/A"}</p>
//         </div>

//         {/* ITEMS */}
//         <table className="w-full text-sm mb-6">
//           <thead className="border-b-2">
//             <tr>
//               <th className="text-left pb-2">Item</th>
//               <th className="text-right pb-2">Qty</th>
//               <th className="text-right pb-2">Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {cartItems.map((item, i) => (
//               <tr key={i} className="border-b">
//                 <td className="py-2">{item.title}</td>
//                 <td className="text-right">{item.quantity}</td>
//                 <td className="text-right font-medium">
//                   ${(item.price * item.quantity).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* TOTALS */}
//         <div className="border-t pt-4 text-sm space-y-2">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>${subtotal.toFixed(2)}</span>
//           </div>

//           <div className="flex justify-between text-green-600">
//             <span>Discount ({discountValue})</span>
//             <span>- ${discount.toFixed(2)}</span>
//           </div>

//           {discountReason && (
//             <div>
//               {discountReason} 🎉
//             </div>
//           )}

//           <div className="flex justify-between">
//             <span>Tax (8%)</span>
//             <span>${tax.toFixed(2)}</span>
//           </div>

//           <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
//             <span>Total</span>
//             <span>${total.toFixed(2)}</span>
//           </div>
//         </div>

//         {/* QR */}
//         <div className="mt-12 flex justify-center">
//           <div className="flex flex-col items-center">
//             <div className="bg-white p-5 rounded-xl shadow-lg">
//               <QRCodeCanvas value={upiLink} size={220} />
//             </div>
//             <p className="mt-3 font-semibold text-base text-center">
//               Scan & Pay • UPI / GPay / PhonePe
//             </p>
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="text-center bg-slate-800 text-white rounded-lg p-6 pb-11 mb-6 mt-8">
//           <p className="font-bold text-white text-lg">Thank You!</p>
//           <p>Visit Again</p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ReceiptPrint;












import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const SHOP_UPI = "yourupi@bank";

const ReceiptPrint = ({ orderData }: any) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountValue, setDiscountValue] = useState("0%");
  const [discountReason, setDiscountReason] = useState("");
  const [customer, setCustomer] = useState<any>({});
  const formatPrice = (value: number | string) =>
  Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  useEffect(() => {
    if (!orderData) return;

    const items = orderData.cartItems || [];

    /* ✅ USE BACKEND DATA */
    const sub = orderData.subtotal ?? 0;
    const discountAmt = orderData.discountAmount ?? 0;
    const taxAmt = orderData.tax ?? 0;
    const totalAmt = orderData.totalAmount ?? 0;

    setCartItems(items);
    setSubtotal(sub);
    setDiscount(discountAmt);
    setTax(taxAmt);
    setTotal(totalAmt);

    setCustomer(orderData.customer || {});
    setDiscountValue(`${orderData.discountPercent ?? 0}%`);
    setDiscountReason(orderData.discountReason || "");
  }, [orderData]);

  const upiLink = `upi://pay?pa=${SHOP_UPI}&pn=DKC Pvt Ltd&am=${Number(total).toFixed(2)}&cu=INR`;

  return (
    <div className="hidden print:flex print:justify-center print:bg-white">
      <div className="print:w-[210mm] print:min-h-100px bg-white border border-gray-300 rounded-xl shadow-lg print:border-none print:shadow-none text-[14px]">

        {/* HEADER */}
        <div className="text-center bg-slate-800 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold tracking-wide uppercase">
            DKC Pvt. Ltd.
          </h1>
          <p className="opacity-90">123 Market St, NY</p>
          <p className="opacity-90">+1 555-123-4567</p>
          <p className="text-sm mt-2 opacity-70">
            {new Date().toLocaleString()}
          </p>
        </div>

        {/* CUSTOMER */}
        <div className="bg-gray-50 border rounded-md p-4 mb-6 text-sm">
          <p><b>Customer:</b> {customer?.name || "N/A"}</p>
          <p><b>Phone:</b> {customer?.phone || "N/A"}</p>
        </div>

        {/* ITEMS */}
        <table className="w-full text-sm mb-6">
          <thead className="border-b-2">
            <tr>
              <th className="text-left pb-2">Item</th>
              <th className="text-right pb-2">Qty</th>
              <th className="text-right pb-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{item.title}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right font-medium">
                  ₹{formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="border-t pt-4 text-sm space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount ({discountValue})</span>
            <span>- ₹{formatPrice(discount)}</span>
          </div>

          {discountReason && (
            <div className="text-green-600 text-xs">
              {discountReason}
            </div>
          )}

          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>- ₹{formatPrice(tax)}</span>
          </div>

          <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{formatPrice(total)}</span>
          </div>

        </div>

        {/* QR */}
        <div className="mt-12 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="bg-white p-5 rounded-xl shadow-lg">
              <QRCodeCanvas value={upiLink} size={220} />
            </div>
            <p className="mt-3 font-semibold text-base text-center">
              Scan & Pay • UPI / GPay / PhonePe
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center bg-slate-800 text-white rounded-lg p-6 pb-11 mb-6 mt-8">
          <p className="font-bold text-white text-lg">Thank You!</p>
          <p>Visit Again</p>
        </div>

      </div>
    </div>
  );
};

export default ReceiptPrint;