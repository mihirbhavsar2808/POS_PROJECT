const BASE_URL = "http://localhost:5000/api";

/* =====================================================
   TYPES
===================================================== */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "admin" | "user";
  name: string;
  userId: string;
}

export interface CartItem {
  _id: string;
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  quantity: number;
}

export interface HoldOrder {
  _id: string;
  orderId: string;
  cartItems: CartItem[];
  subtotal: number;
  discountPercent: number;
  discountReason: string;
  discountAmount: number;
  tax: number;
  totalAmount: number;
  customer?: {
    name: string;
    phone: string;
  };
}

export interface Customer {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: number;
}

export interface Order {
  _id: string
  customer?: Customer | null
  cartItems: CartItem[]
  totalAmount: number
  paymentMethod: "cash" | "card"
  status: "Paid" | "Failed" | "Ongoing" | "Unpaid"
  createdAt: string
}
/* =====================================================
   HELPER
===================================================== */

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* =====================================================
   AUTH APIs
===================================================== */

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("token", data.token);
  return data;
};

/* =====================================================
   HOLD ORDER APIs
===================================================== */

export const createHoldOrder = async (data: {
  cartItems: CartItem[];
  subtotal: number;
  discountPercent: number;
  discountReason: string;
  discountAmount: number;
  tax: number;
  totalAmount: number;
  customer: { name: string; phone: string };
  status?: "Ongoing" | "Unpaid" | "Paid" | "Failed";
}) => {
  const response = await fetch(`${BASE_URL}/hold-orders`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result;
};
export const getHoldOrders = async (): Promise<HoldOrder[]> => {
  const response = await fetch(`${BASE_URL}/hold-orders`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const getSingleHoldOrder = async (
  id: string
): Promise<HoldOrder> => {
  const response = await fetch(`${BASE_URL}/hold-orders/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const deleteHoldOrder = async (id: string) => {
  const response = await fetch(`${BASE_URL}/hold-orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

/* =====================================================
   COUPON APIs
===================================================== */

export const getCoupons = async () => {
  const res = await fetch(`${BASE_URL}/coupons`);
  return res.json();
};

export const createCoupon = async (data: any) => {
  const res = await fetch(`${BASE_URL}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteCoupon = async (id: string) => {
  await fetch(`${BASE_URL}/coupons/${id}`, { method: "DELETE" });
};

/* =====================================================
   ORDER APIs
===================================================== */

export const createOrder = async (data: any): Promise<Order> => {

  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Create order failed");
  }

  return result;
};

export const getOrders = async (): Promise<Order[]> => {

  const response = await fetch(`${BASE_URL}/orders`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Fetch orders failed");
  }

  return data;
};

export const updateOrderStatus = async (
  id: string,
  status: "Paid" | "Failed" | "Ongoing" | "Unpaid"
): Promise<Order> => {

  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Update order failed");
  }

  return data;
};

/* =====================================================
   CUSTOMER APIs
===================================================== */

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await fetch(`${BASE_URL}/customers`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const createCustomer = async (data: Customer) => {

  const res = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || result.error || "Create customer failed");
  }

  return result;
};


export const getSingleOrder = async (id: string): Promise<Order> => {

  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    headers: getAuthHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Fetch order failed");
  }

  return data;
};


export const deleteCustomer = async (id: string) => {
  const res = await fetch(`${BASE_URL}/customers/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Delete customer failed");
  }

  return data;
};
// export const deleteOrderCustomer = async (id: string) => {
//   const res = await fetch(`${BASE_URL}/orders/${id}`, {
//     method: "DELETE",
//     headers: getAuthHeader(),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Delete order failed");
//   }

//   return data;
// };
// export const getOrderCustomers = async () => {
//   const res = await fetch(`${BASE_URL}/ordercustomers`);
//   return res.json();
// };

export const getOrderCustomers = async () => {
  const res = await fetch(`${BASE_URL}/ordercustomers`, {
    headers: getAuthHeader(), // 🔥 ADD THIS
  });
  return res.json();
};
export const createOrderCustomer = async (data: Customer) => {

  const res = await fetch(`${BASE_URL}/ordercustomers`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Create order customer failed");
  }

  return result;
};
export const deleteOrderCustomer = async (id: string) => {

  const res = await fetch(`${BASE_URL}/ordercustomers/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Delete order customer failed");
  }

  return result;
};
export const updateOrder = async (id: string, data: any) => {

  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

if (!response.ok) {
  console.error("Update order error:", result);
  throw new Error(result.message || "Update order failed");
}
  return result;
};

export const deleteOrder = async (id: string) => {

  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Delete order failed");
  }

  return data;
};


export const registerAdmin = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/admin-register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

export const createUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/auth/users`, {
    headers: getAuthHeader(),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("API ERROR RESPONSE:", text);
    throw new Error("Invalid JSON (API issue)");
  }
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const verifyAdmin = async (password: string) => {
  const res = await fetch(`${BASE_URL}/auth/verify-admin`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({ password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/admin-dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("❌ NOT JSON:", text);
    throw new Error("Backend not returning JSON");
  }
};
export const updateUserPin = async (id: string, pin: string, adminPassword: string) => {
  const res = await fetch(`${BASE_URL}/auth/update-user/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pin, adminPassword })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};