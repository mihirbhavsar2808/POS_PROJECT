// import QRCode from "qrcode";

// export const generateReceiptHTML = async (orderData) => {
//   const format = (value) =>
//     Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   const itemsHTML = orderData.cartItems.map((item) => `
//     <tr class="border-b">
//       <td class="py-2">${item.title}</td>
//       <td class="text-right">${item.quantity}</td>
//       <td class="text-right font-medium">
//         ₹${format(item.price * item.quantity)}
//       </td>
//     </tr>
//   `).join("");

//   const upiLink = `upi://pay?pa=yourupi@bank&pn=DKC Pvt Ltd&am=${orderData.totalAmount}&cu=INR`;
//   const qrImage = await QRCode.toDataURL(upiLink);

//   return `
//   <html>
//   <head>
//     <script src="https://cdn.tailwindcss.com"></script>
//   </head>

//   <body class="bg-white flex justify-center p-6">

//     <div class="w-[210mm] bg-white border border-gray-300 rounded-xl shadow-lg text-[14px] p-6">

//       <!-- HEADER -->
//       <div class="text-center bg-slate-800 text-white rounded-lg p-6 mb-6">
//         <h1 class="text-3xl font-bold uppercase tracking-wide">
//           DKC Pvt. Ltd.
//         </h1>
//         <p class="opacity-90">123 Market St, NY</p>
//         <p class="opacity-90">+1 555-123-4567</p>
//         <p class="text-sm mt-2 opacity-70">
//           ${new Date().toLocaleString()}
//         </p>
//       </div>

//       <!-- CUSTOMER -->
//       <div class="bg-gray-50 border rounded-md p-4 mb-6 text-sm">
//         <p><b>Customer:</b> ${orderData.customer?.name || "N/A"}</p>
//         <p><b>Phone:</b> ${orderData.customer?.phone || "N/A"}</p>
//       </div>

//       <!-- ITEMS -->
//       <table class="w-full text-sm mb-6">
//         <thead class="border-b-2">
//           <tr>
//             <th class="text-left pb-2">Item</th>
//             <th class="text-right pb-2">Qty</th>
//             <th class="text-right pb-2">Total</th>
//           </tr>
//         </thead>

//         <tbody>
//           ${itemsHTML}
//         </tbody>
//       </table>

//       <!-- TOTALS -->
//       <div class="border-t pt-4 text-sm space-y-2">

//         <div class="flex justify-between">
//           <span>Subtotal</span>
//           <span>₹${format(orderData.subtotal)}</span>
//         </div>

//         <div class="flex justify-between text-green-600">
//           <span>Discount (${orderData.discountPercent || 0}%)</span>
//           <span>- ₹${format(orderData.discountAmount)}</span>
//         </div>

//         ${
//           orderData.discountReason
//             ? `<div class="text-green-600 text-xs">${orderData.discountReason}</div>`
//             : ""
//         }

//         <div class="flex justify-between">
//           <span>Tax</span>
//           <span>₹${format(orderData.tax)}</span>
//         </div>

//         <div class="flex justify-between font-bold text-xl border-t pt-3 mt-3">
//           <span>Total</span>
//           <span>₹${format(orderData.totalAmount)}</span>
//         </div>

//       </div>

//       <!-- QR -->
//       <div class="mt-12 flex justify-center">
//         <div class="flex flex-col items-center">
//           <div class="bg-white p-5 rounded-xl shadow-lg">
//             <img src="${qrImage}" width="220"/>
//           </div>
//           <p class="mt-3 font-semibold text-base text-center">
//             Scan & Pay • UPI / GPay / PhonePe
//           </p>
//         </div>
//       </div>

//       <!-- FOOTER -->
//       <div class="text-center bg-slate-800 text-white rounded-lg p-6 mt-8">
//         <p class="font-bold text-lg">Thank You!</p>
//         <p>Visit Again</p>
//       </div>

//     </div>

//   </body>
//   </html>
//   `;
// };









import QRCode from "qrcode";

export const generateReceiptHTML = async (orderData) => {
  const format = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const itemsHTML = orderData.cartItems.map((item) => `
    <tr class="border-b">
      <td class="py-2">${item.title}</td>
      <td class="text-right">${item.quantity}</td>
      <td class="text-right font-medium">
        ₹${format(item.price * item.quantity)}
      </td>
    </tr>
  `).join("");

  const upiLink = `upi://pay?pa=yourupi@bank&pn=DKC Pvt Ltd&am=${orderData.totalAmount}&cu=INR`;
  const qrImage = await QRCode.toDataURL(upiLink);

  return `
  <html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>

  <body class="bg-white flex justify-center p-6">

    <div class="w-[210mm] bg-white border border-gray-300 rounded-xl shadow-lg text-[14px] p-6">

      <!-- HEADER -->
      <div class="text-center bg-slate-800 text-white rounded-lg p-6 mb-6">
        <h1 class="text-3xl font-bold uppercase tracking-wide">
          DKC Pvt. Ltd.
        </h1>
        <p class="opacity-90">123 Market St, NY</p>
        <p class="opacity-90">+1 555-123-4567</p>
        <p class="text-sm mt-2 opacity-70">
          ${new Date().toLocaleString()}
        </p>
      </div>

      <!-- CUSTOMER -->
      <div class="bg-gray-50 border rounded-md p-4 mb-6 text-sm">
        <p><b>Customer:</b> ${orderData.customer?.name || "N/A"}</p>
        <p><b>Phone:</b> ${orderData.customer?.phone || "N/A"}</p>
      </div>

      <!-- ITEMS -->
      <table class="w-full text-sm mb-6">
        <thead class="border-b-2">
          <tr>
            <th class="text-left pb-2">Item</th>
            <th class="text-right pb-2">Qty</th>
            <th class="text-right pb-2">Total</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- TOTALS -->
      <div class="border-t pt-4 text-sm space-y-2">

        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>₹${format(orderData.subtotal)}</span>
        </div>

        <div class="flex justify-between text-green-600">
          <span>Discount (${orderData.discountPercent || 0}%)</span>
          <span>- ₹${format(orderData.discountAmount)}</span>
        </div>

        <!-- ✅ FIX: Discount reason show -->
        ${
          orderData.discountReason
            ? `<div class="text-green-600 text-xs">${orderData.discountReason}</div>`
            : ""
        }

        <div class="flex justify-between">
          <span>Tax</span>
          <span>₹${format(orderData.tax)}</span>
        </div>

        <!-- ❌ REMOVED border between tax & total -->
        <div class="flex justify-between font-bold text-xl pt-3 mt-3">
          <span>Total</span>
          <span>₹${format(orderData.totalAmount)}</span>
        </div>

      </div>

      <!-- QR -->
      <div class="mt-12 flex justify-center">
        <div class="flex flex-col items-center">
          <div class="bg-white p-5 rounded-xl shadow-lg">
            <img src="${qrImage}" width="220"/>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="text-center bg-slate-800 text-white rounded-lg p-6 mt-8">
        <p class="font-bold text-lg">Thank You!</p>
        <p>Visit Again</p>
      </div>

    </div>

  </body>
  </html>
  `;
};