import { getSystemInfo } from "zmp-sdk";
import { App, SnackbarProvider, ZMPRouter } from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { Routes, Route } from "react-router-dom";

// Import trực tiếp các trang
import WelcomeScreen from "@/pages/index";
import AuthScreen from "@/pages/AuthScreen";
import HomePage from "@/pages/HomePage";
import DiscoverPage from "@/pages/DiscoverPage";
import AccountPage from "@/pages/AccountPage";
import BookingPage from "@/pages/BookingPage";
import PaymentPage from "@/pages/PaymentPage";
import DescriptionPage from "@/pages/DescriptionPage";
import MessagesPage from "@/pages/MessagesPage";
import NotificationPage from "@/pages/NotificationPage";
import QrPay from "@/pages/QrPay";
import ReviewPage from "@/pages/ReviewPage";
import BookingSuccessPage from "../pages/BookingSuccessPage";

const Layout = () => {
  const defaultTheme: AppProps["theme"] = "light";
  const zaloTheme = (() => {
    try {
      const systemInfo = getSystemInfo();
      return (systemInfo.zaloTheme as AppProps["theme"]) || defaultTheme;
    } catch (error) {
      console.error("Failed to get Zalo theme:", error);
      return defaultTheme;
    }
  })();

  return (
    <App theme={zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/description/:id" element={<DescriptionPage />} />
            <Route path="/description" element={<DescriptionPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/qrpay" element={<QrPay />} />
            <Route path="/qr-pay" element={<QrPay />} />
            <Route path="/booking/success" element={<BookingSuccessPage />} />
            <Route path="/review/:id" element={<ReviewPage />} />
          </Routes>
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};

export default Layout;
