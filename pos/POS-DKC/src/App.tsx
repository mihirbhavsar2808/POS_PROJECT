import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/protectedRoute";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./components/HomePage";
import Settingpage from "./components/Settingpage";
import RequestInventory from "./components/RequestInventory";
import LoginPage from "./components/LoginPage";
import CancelOrder from "./components/CancelOrder";
import Lock from "./components/Lock";
import DiscountPage from "./components/DiscountPage";
import MostProduct from "./components/Products/MostProduct";
import Customers from "./components/Customers";
import Activities from "./components/Activities";
import Invoice from "./components/Invoice";
import Payment from "./components/Payment";
import { OrderProvider } from "./auth/OrderContext";
import InventoryPage from "./components/Inventory/InventoryPage";
import AddProductForm from "./components/admin/AddProductFrom";
import HoldOrders from "./components/HoldOrders";
import AdminProductsPage from "./components/admin/AdminProductsPage";
import OrdersPage from "./components/OrdersPage";
import PaymentPage from "./components/Cardpage";
import AdminRegister from "./components/AdminRegister";
import CreateUser from "./components/admin/CreateUser";
import Logout from "./components/Logout";
import StockPage from "./components/admin/StockPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminOrders from "./components/admin/Adminorders";
import AdminReport from "./components/admin/AdminReport";

function App() {
  const AppRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("POS-token");
      const role = localStorage.getItem("POS-role");
      const isLocked = localStorage.getItem("isLocked");
      const path = window.location.pathname;

      if (!token) return;

      // 🔥 Prevent redirect loop
      if (path !== "/login") return;

      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        if (isLocked === "true") {
          navigate("/lock", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }
    }, []);

    return null;
  };
  return (
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
          <AppRedirect />
          <Routes>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin-register" element={<AdminRegister />} />

            <Route
              path="/lock"
              element={
                <ProtectedRoute>
                  <Lock />
                </ProtectedRoute>
              }
            />
            <Route path="/activities" element={<Activities />} />
            <Route
              path="/inventory/:id?"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />
            <Route path="/customer" element={<Customers />} />
            <Route path="/discount" element={<DiscountPage />} />
            <Route path="/request" element={<RequestInventory />}></Route>
            <Route path="/setting" element={<Settingpage />} />
            <Route path="/bill" element={<CancelOrder />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/hold-order" element={<HoldOrders />} />
            <Route path="/order" element={<OrdersPage />} />
            <Route
              path="/most-product"
              element={
                <ProtectedRoute>
                  <MostProduct />
                </ProtectedRoute>
              }
            />
            <Route path="/addproduct" element={<AddProductForm />} />
            <Route path="/stock-check" element={<StockPage />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-products"
              element={
                <ProtectedRoute>
                  <AdminProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-orders"
              element={
                <ProtectedRoute>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-reports"
              element={
                <ProtectedRoute>
                  <AdminReport />
                </ProtectedRoute>
              }
            />
            <Route path="/card-payment" element={<PaymentPage />} />
            <Route
              path="/create-user"
              element={
                <AdminRoute>
                  <CreateUser />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}
export default App;
