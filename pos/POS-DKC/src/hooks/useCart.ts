import { useEffect, useState, useMemo } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

export interface CartItem extends Product {
    quantity: number;
    category: string;
}

function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];   
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...product, quantity: 1}];
    });
  };

  const inc = (id: number) => setItems(prev => prev.map(i => i.id === id ? {...i, quantity: i.quantity +1} : i));
  const dec = (id: number) => setItems(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(i.quantity -1, 1)} : i));
  const remove = (id: number) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  return { items,setItems, add, inc, dec, remove, clear, subtotal };
}

export default useCart;
