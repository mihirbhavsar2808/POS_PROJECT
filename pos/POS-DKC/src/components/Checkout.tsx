import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { RootState } from "../app/store";
import { clearOrderItems } from "../auth/orderSlice";
import Cart from "./Cart";
import useFetchProducts from "../hooks/useFetchProducts";

const Checkout = () => {
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector(
    (state: RootState) => state.order
  );
  const [orderNo, setOrderNo] = useState<number>(1);
  const { products } = useFetchProducts();
  // const cartItems = orderData?.items || [];
  // const userData = JSON.parse(localStorage.getItem("User") || "{}");
  // const user = userData.name || "Unknown";

  // const handleRemoveItem = (id: number) => {
  //   if (!selectedOrder || !orderData) return;
  //   dispatch(removeItemFromOrder(id));

  //   const updatedOrder = {
  //     ...orderData,
  //     items: orderData.items.filter((item) => item.id !== id),
  //   };
  //   localStorage.setItem(
  //     `order-${user}-${selectedOrder}`,
  //     JSON.stringify(updatedOrder)
  //   );

  //   dispatch(setOrderData(updatedOrder));
  // };

  const handleHoldOrder = () => {
    const customerDet = JSON.parse(localStorage.getItem("customer") || "{}");
    const holdOrder = {
      orderNo,
      customer: customerDet,
      items: products,
      timestamp: new Date().toISOString(),
      status: "held",
    };

    const heldOrders = JSON.parse(localStorage.getItem("heldOrders") || "[]");

    if (heldOrders.length >= 4) {
      alert("Maximum of 4 orders can be held at a time.");
      return;
    }

    heldOrders.push(holdOrder);
    localStorage.setItem("heldOrders", JSON.stringify(heldOrders));

    dispatch(clearOrderItems());
    localStorage.removeItem("customer");

    const nextOrderNo = orderNo + 1;
    setOrderNo(nextOrderNo);
    localStorage.setItem("orderNo", nextOrderNo.toString());
  };

  useEffect(() => {
    const storedOrderNo = localStorage.getItem("orderNo");
    if (storedOrderNo) {
      setOrderNo(parseInt(storedOrderNo));
    }
  }, []);
 
  const handleClearCart = () => {
    // setCartItems([]);
    localStorage.removeItem("cart");
  };
  return (
    <div className="w-full h-full  bg-[var(--secondary)] flex flex-col justify-between gap-2">
      <div className="flex flex-col sm:flex-row justify-center gap-3 ">
        <button className="bg-white text-black w-full py-2 px-4 rounded-md"
        onClick={handleClearCart}>
          Clear cart
        </button>
        <button
          onClick={handleHoldOrder}
          className="bg-[var(--main)] text-white w-full py-2 px-4 rounded-md"
        >
          Hold this order
        </button>
      </div>
      <hr className="mb-2 opacity-20" />
      <div className="flex-1 overflow-y-auto h-fit flex flex-col gap-3 scrollbar-hide">
        {products.length === 0 ? (
          <div className="flex-grow h-full flex items-center justify-center border-[var(--main)]">
            <div className="text-gray-500 text-center text-sm px-2">
              {selectedOrder
                ? "This order has no products."
                : "Select an order from the left side to preview"}
            </div>
          </div>
        ) : (
          <div className="max-h-full">

            <Cart/>
          </div>
        )}
      </div>
      <hr className="my-2 opacity-20" />
      <div>
        <Link
          to="/bill"
          className="bg-[var(--main)] text-white font-semibold py-2 rounded-md block text-center"
        >
          CHECKOUT &gt;
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
