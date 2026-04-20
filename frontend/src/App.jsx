import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import PageSkeleton from "./skeleton/PageSkeleton.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

/* ================= LAZY ROUTES ================= */
const Contact = lazy(() => import("./components/Contact.jsx"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails.jsx"));
const Appointment = lazy(() => import("./components/Appointment.jsx"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute.jsx"));
const Home = lazy(() => import("./components/Home.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const Shop = lazy(() => import("./components/Shop.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const SignIn = lazy(() => import("./pages/SignIn.jsx"));
const SignUpAdmin = lazy(() => import("./pages/SignUpAdmin.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.jsx"));
const NewPassword = lazy(() => import("./pages/NewPassword.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const RecetPassword = lazy(() => import("./pages/RecetPassword.jsx"));
const SuccessPasswordRecet = lazy(() => import("./pages/SuccessPasswordRecet.jsx"));
const FailPasswordRecet = lazy(() => import("./pages/FailPasswordRecet.jsx"));
const Profile = lazy(() => import("./components/Profile.jsx"));
import UserManagement from "./pages/UserManagementPage.jsx";
import Appointments from "./pages/Appointments.jsx";
import Products from "./pages/Products.jsx";
import whatsapp from "./assets/home/whatsapp.png";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import Cart from "./pages/Cart.jsx";
import AddressPage from "./pages/checkout/AddressPage.jsx";
import CheckoutLayout from "./pages/checkout/CheckoutLayout.jsx";
import { CheckoutProvider } from "./context/CheckoutContext.jsx";
import OrderSummaryPage from "./pages/checkout/OrderSummaryPage.jsx";
import Voucher from "./pages/Voucher.jsx";
import ShopDetails from "./pages/ShopDetails.jsx";

/* ================= ROUTE WRAPPER ================= */
const RouteLoader = ({ children }) => {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <CheckoutProvider>
        <Routes>

          {/* AUTH / ADMIN ROUTES */}
          <Route path="/sign-up-admin" element={
            <RouteLoader><SignUpAdmin /></RouteLoader>
          } />

          <Route path="/verify-email" element={
            <RouteLoader><VerifyEmail /></RouteLoader>
          } />

          <Route path="/sign-up" element={
            <RouteLoader><Signup /></RouteLoader>
          } />

          <Route path="/sign-in" element={
            <RouteLoader><SignIn /></RouteLoader>
          } />

          <Route path="/forget-password" element={
            <RouteLoader><ForgotPassword /></RouteLoader>
          } />

          <Route path="/forgot-password-reset" element={
            <RouteLoader><NewPassword /></RouteLoader>
          } />

          <Route path="/recet-password" element={
            <RouteLoader><RecetPassword /></RouteLoader>
          } />

          <Route path="/success-recet" element={
            <RouteLoader><SuccessPasswordRecet /></RouteLoader>
          } />

          <Route path="/recet-failed" element={
            <RouteLoader><FailPasswordRecet /></RouteLoader>
          } />

          {/* MAIN PAGES */}
          <Route path="/" element={
            <RouteLoader><Home /></RouteLoader>
          } />

          <Route path="/about" element={
            <RouteLoader><About /></RouteLoader>
          } />

          <Route path="/shop" element={
            <RouteLoader><Shop /></RouteLoader>
          } />

          <Route path="/product/:id" element={
            <RouteLoader><ProductDetailPage /></RouteLoader>
          } />

          <Route path="/contact" element={
            <RouteLoader><Contact /></RouteLoader>
          } />

          <Route path="/services/:serviceName" element={
            <RouteLoader><ServiceDetails /></RouteLoader>
          } />

          {/* PROTECTED ROUTES */}
          <Route path="/book-appointment" element={
            <RouteLoader>
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            </RouteLoader>
          } />

          <Route path="/profile" element={
            <RouteLoader>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </RouteLoader>
          } />

          {/* CART */}
          <Route path="/cart" element={
            <RouteLoader>
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            </RouteLoader>
          } />

          {/* CHECKOUT */}
          <Route path="/checkout" element={
            <RouteLoader>
              <ProtectedRoute>
                <CheckoutLayout />
              </ProtectedRoute>
            </RouteLoader>
          }>

            <Route index element={<AddressPage />} />
            <Route path="summary" element={<OrderSummaryPage />} />

          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminProfile />} />
            <Route path="dashboard" element={<AdminProfile />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="products" element={<Products />} />
            <Route path="vouchers" element={<Voucher/>}/>
            <Route path="shop-details" element={<ShopDetails/>}/>
          </Route>

        </Routes>
      </CheckoutProvider>

    </BrowserRouter>
  );
}

export default App;