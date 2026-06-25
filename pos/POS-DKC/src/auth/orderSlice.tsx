import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OrderData {
  items: any[];
  customer: any;
  method: string;
  orderNo: number;
  timestamp: string;
}

interface OrderState {
  selectedOrder: number | null;
  orderData: OrderData | null;
  orderCount: number;
}

const initialState: OrderState = {
  selectedOrder: null,
  orderData: null,
  orderCount: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder(state, action: PayloadAction<number>) {
      state.selectedOrder = action.payload;
    },
    setOrderData(state, action: PayloadAction<OrderData | null>) {
      state.orderData = action.payload;
    },
    setOrderCount(state, action: PayloadAction<number>) {
      state.orderCount = action.payload;
    },
    removeItemFromOrder(state, action: PayloadAction<number>) {
      if (state.orderData) {
        state.orderData.items = state.orderData.items.filter(
          (item) => item.id !== action.payload
        );
      }
    },
    clearOrderItems(state) {
      if (state.orderData) {
        state.orderData.items = [];
      }
    },
  },
});

export const {
  setSelectedOrder,
  setOrderData,
  setOrderCount,
  removeItemFromOrder,
  clearOrderItems
} = orderSlice.actions;
export default orderSlice.reducer;
