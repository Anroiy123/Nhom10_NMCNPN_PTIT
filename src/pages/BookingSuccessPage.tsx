import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";

// Interface cho dịch vụ
interface Service {
  id?: string;
  name: string;
  price: string;
  priceValue: number;
  duration: string;
  image: string;
  quantity: number;
}

// Interface cho cửa hàng
interface BarberShop {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  price?: number;
  services?: string[];
}

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ navigation state
  const totalAmount = location.state?.totalAmount || 0;
  const selectedPaymentMethod = location.state?.selectedPaymentMethod || "cash";
  const date = location.state?.date || "";
  const time = location.state?.time || "";
  const shop = location.state?.shop || null;
  const services = location.state?.services || [];

  // Hiệu ứng đếm ngược chuyển về trang Booking
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Cập nhật: Chuyển đến BookingPage với dữ liệu đặt lịch thay vì HomePage
      navigate("/booking", {
        state: {
          bookingData: {
            date,
            time,
            shop,
            services,
            totalAmount,
            selectedPaymentMethod,
          },
        },
        replace: true,
      });
    }
  }, [
    countdown,
    navigate,
    date,
    time,
    shop,
    services,
    totalAmount,
    selectedPaymentMethod,
  ]);

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <div className="px-4 pt-6 pb-4 flex justify-between items-center">
        <div className="w-6"></div>
        <h1 className="text-lg font-bold">ĐẶT LỊCH THÀNH CÔNG</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Icon thành công */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check size={40} className="text-green-600" />
        </div>

        <h2 className="text-xl font-bold mb-2">Đặt lịch thành công!</h2>
        <p className="text-center text-gray-600 mb-10">
          Bạn đã đặt lịch thành công tại {shop?.name || "4RAU Barbershop"}
        </p>

        {/* Thông tin đặt lịch */}
        <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-3">Chi tiết đặt lịch</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Ngày và giờ:</p>
              <p className="font-medium">
                {date}, {time}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-600">Địa chỉ:</p>
              <p className="font-medium text-right">
                {shop?.address || "Vinhomes Grand Park, Q9"}
              </p>
            </div>

            {/* Dịch vụ */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-gray-600 mb-1">Dịch vụ:</p>
              {services.map((service: Service, index: number) => (
                <div key={index} className="flex justify-between mb-1">
                  <p>
                    {service.name}{" "}
                    {service.quantity > 1 ? `x${service.quantity}` : ""}
                  </p>
                  <p className="font-medium">
                    {(
                      parseInt(service.price.replace(/[^\d]/g, "")) *
                      service.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <p className="font-bold">Tổng cộng:</p>
                <p className="font-bold text-[#F5B100]">
                  {totalAmount.toLocaleString()} VND
                </p>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-gray-600 mb-1">Thanh toán:</p>
              <p>
                {selectedPaymentMethod === "bank"
                  ? "Thanh toán qua ngân hàng"
                  : selectedPaymentMethod === "zalopay"
                  ? "Thanh toán qua ZaloPay"
                  : selectedPaymentMethod === "momo"
                  ? "Thanh toán qua MoMo"
                  : "Thanh toán bằng tiền mặt"}
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo */}
        <p className="text-center text-sm text-gray-500 mb-4">
          Xác nhận đã được gửi về email và số điện thoại của bạn
        </p>

        {/* Đếm ngược */}
        <p className="text-center text-sm text-gray-500">
          Tự động chuyển đến lịch hẹn sau {countdown} giây
        </p>

        {/* Nút về trang lịch hẹn */}
        <button
          onClick={() =>
            navigate("/booking", {
              state: {
                bookingData: {
                  date,
                  time,
                  shop,
                  services,
                  totalAmount,
                  selectedPaymentMethod,
                },
              },
            })
          }
          className="w-full bg-[#F5B100] text-white py-3 rounded-xl mt-6"
        >
          XEM LỊCH HẸN
        </button>
      </div>
    </div>
  );
}
