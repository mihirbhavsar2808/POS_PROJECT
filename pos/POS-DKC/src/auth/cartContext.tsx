// import {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   type Dispatch,
//   type ReactNode,
//   type SetStateAction,
// } from "react";

// export interface CartItem {
//   _id: string;
//   id: number;
//   title: string;
//   price: number;
//   thumbnail: string;
//   category: string;
//   quantity: number;
// }

// interface CartContextType {
//   cart: CartItem[];
//   setCart: Dispatch<SetStateAction<CartItem[]>>;
//   subtotal : number;
//   addToCart: (item: Omit<CartItem, "quantity">) => void;
//   removeFromCart: (_id: string) => void;
//   increaseQty: (_id: string) => void;
//   decreaseQty: (_id: string) => void;  
// }

// const CartContext = createContext<CartContextType | null>(null);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used inside CartProvider");
//   return context;
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>(() => {
//     const stored = localStorage.getItem("cart");
//     try {
//     const parsed = JSON.parse(stored || "[]");
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
//   });

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // const addToCart = (product: Omit<CartItem, "quantity">) => {
//   //   const exists = cart.find((item) => item._id === product._id);
//   //   if (exists) {
//   //     setCart(
//   //       cart.map((item) =>
//   //         item._id === product._id
//   //           ? { ...item, quantity: item.quantity + 1 }
//   //           : item
//   //       )
//   //     );
//   //   } else {
//   //     setCart([...cart, { ...product, quantity: 1 }]);
//   //   }
//   // };
// const addToCart = (product: Omit<CartItem, "quantity">) => {
//   setCart((prevCart) => {
//     const exists = prevCart.find(
//       (item) => item._id === product._id
//     );

//     if (exists) {
//       return prevCart.map((item) =>
//         item._id === product._id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     }

//     return [...prevCart, { ...product, quantity: 1 }];
//   });
// };

//   const subtotal = useMemo(
//     () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
//     [cart]
//   );

//   const removeFromCart = (_id: string) => {
//     setCart(cart.filter((item) => item._id !== _id));
//   };

//   const increaseQty = (_id: string) => {
//     setCart(
//       cart.map((item) =>
//         item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (_id:string) => {
//     setCart(
//       cart.map((item) =>
//         item._id === _id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         setCart,
//         subtotal,
//         addToCart,
//         removeFromCart,
//         increaseQty,
//         decreaseQty,
//         // getQuantity,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };



import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useRef,
} from "react";

export interface CartItem {
  _id: string;
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  quantity: number; // cart quantity
  stock: number;    // ✅ actual available stock
}

interface CartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "quantity"> & { stock: number }) => void;
  removeFromCart: (_id: string) => void;
  increaseQty: (_id: string) => void;
  decreaseQty: (_id: string) => void;
  clearCart: () => void; // ✅ MUST EXIST
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addLock = useRef(false);

  const addToCart = (product: Omit<CartItem, "quantity"> & { stock: number }) => {
    if (addLock.current) return;

    addLock.current = true;

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);

      // 🛑 OUT OF STOCK
      if (product.stock === 0) {
        alert("Out of stock!");
        return prev;
      }

      // 🛑 ALREADY IN CART
      if (exists) {
        if (exists.quantity >= product.stock) {
          alert("Stock limit reached!");
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ✅ ADD NEW
      return [...prev, { ...product, quantity: 1 }];
    });

    setTimeout(() => {
      addLock.current = false;
    }, 200);
  };

  const removeFromCart = (_id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== _id));
  };

  const increaseQty = (_id: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === _id) {
          if (item.quantity >= item.stock) {
            alert("Stock limit reached!");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQty = (_id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === _id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        subtotal,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart, // ✅ MUST BE RETURNED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};