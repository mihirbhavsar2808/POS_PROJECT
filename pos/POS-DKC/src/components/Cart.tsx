
import { FaTrash } from "react-icons/fa";
import { useCart } from "../auth/cartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  return (
    <div className="max-w-xl">
      {cart.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 max-h-full rounded-lg scrollbar-hide">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-lg">
              <div className="flex gap-3 items-center">
                <img src={`http://localhost:5000/uploads/${item.thumbnail}`} className="w-16 h-16 rounded-sm object-cover" />
                <div className="">
                  <h4 className="font-medium text-sm truncate w-40">{item.title}</h4>
                  <div className="flex space-x-1 items-center">
                    <p className="text-gray-500 w-20">₹{Number(item.price).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}</p>
                    <div className="flex items-center gap-4 pl-2">
                      <button
                        className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => decreaseQty(item._id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => increaseQty(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <div onClick={() => removeFromCart(item._id)} className="text-gray-500 pr-2">
                <FaTrash />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
