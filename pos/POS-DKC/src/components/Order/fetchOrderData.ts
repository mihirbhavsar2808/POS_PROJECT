import type { AppThunk } from '../../app/store';
import { setOrderCount, setOrderData, setSelectedOrder } from '../../auth/orderSlice';

export const loadOrderCount = (): AppThunk => (dispatch) => {
  const count = parseInt(localStorage.getItem('orderNo') || '0');
  dispatch(setOrderCount(count));
};

export const fetchOrderData = (user: string, orderNo: number): AppThunk => (dispatch) => {
  const key = `order-${user}-${orderNo}`;
  const raw = localStorage.getItem(key);

  if (raw) {
    try {
      const data = JSON.parse(raw);
      dispatch(setOrderData(data));
      dispatch(setSelectedOrder(orderNo));
      localStorage.setItem("cart",JSON.stringify(data.items))
    } catch (error) {
      console.error('Invalid JSON:', error);
      dispatch(setOrderData(null));
    }
  } else {
    dispatch(setOrderData(null));
  }
};
