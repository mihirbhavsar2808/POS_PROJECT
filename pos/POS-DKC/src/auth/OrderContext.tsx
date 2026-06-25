
import { createContext, useContext, useState,type ReactNode } from "react";

interface OrderContextType {
  selectedOrder: string;
  setSelectedOrder: (order: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOrder, setSelectedOrder] = useState(
    localStorage.getItem("selectedOrder") || "001"
  );

  return (
    <OrderContext.Provider value={{ selectedOrder, setSelectedOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrder must be used within OrderProvider");
  return context;
};
