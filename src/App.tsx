import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./pages/publicRoutes";
import ProtectedRoutes from "./pages/protextedRoutes";
import Layout from "./pages/layout";
import { Toaster } from "react-hot-toast";
import Signup from "./components/auth/sign-up";
import VerificationSuccess from "./components/auth/verification-success";
import ResetPassword from "./components/auth/reset-password";
import ForgotPassword from "./components/auth/forgot-password";
import PasswordResetEmailSent from "./components/auth/password-reset-email-sent";
import PasswordChangedSuccess from "./components/auth/password-changed-success";
import Login from "./components/auth";
import EmailVerificationSent from "./components/auth/email-verification-sent";
import EmailVerification from "./components/auth/email-verification";
import OverviewPage from "./pages/overview";
import PetsPage from "./pages/pets";
import ContactPage from "./pages/contact";
import PaymentPage from "./pages/payment";
import SettingsPage from "./pages/settings";
import LoyaltyPage from "./pages/loyalty";
import ReviewsPage from "./pages/reviews";
import Order from "./components/order/order";
import OrderSummary from "./components/order/orderSummary";
import ReplacementOrder from "./components/order/replacementOrder";
import EditPet from "./components/pets/edit-pet/edit-pet";
import ViewPet from "./components/pets/viewPet";
import QRVerificationPage from "./components/qrcode/qrVerificationPage";
import { LocalizationProvider } from "./context/LocalizationContext";

const clearExpiredTokenIfNeeded = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) {
      localStorage.removeItem("token");
      return true;
    }

    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload?.exp;
    if (typeof exp !== "number") {
      localStorage.removeItem("token");
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (exp <= nowInSeconds) {
      localStorage.removeItem("token");
      return true;
    }
  } catch {
    localStorage.removeItem("token");
    return true;
  }

  return false;
};

function App() {
  // Minimal app-load guard: clear stale JWT and force logout refresh.
  const tokenWasCleared = clearExpiredTokenIfNeeded();
  if (tokenWasCleared && window.location.pathname !== "/") {
    window.location.replace("/");
    return null;
  }

  return (
    <LocalizationProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset-email-sent" element={<PasswordResetEmailSent />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-changed" element={<PasswordChangedSuccess />} />

          <Route path="/verify-email-sent" element={<EmailVerificationSent />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
        </Route>

        {/* QR verification route - accessible to both logged-in and non-logged-in users */}
        <Route path="/qr/verify/:code" element={<QRVerificationPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/replacement-order/:petId" element={<ReplacementOrder />} />
            
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/edit-pet/:petId" element={<EditPet />} />
            <Route path="/view-pet/:id" element={<ViewPet />} />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
