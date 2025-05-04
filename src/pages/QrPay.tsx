import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import babershop from "../assets/images/barber-shop.jpg";

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

export default function QrPay() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ navigation state
  const totalAmount = location.state?.totalAmount || 0;
  const selectedPaymentMethod = location.state?.selectedPaymentMethod || "bank";
  const date = location.state?.date || "";
  const time = location.state?.time || "";
  const shop = location.state?.shop || null;
  const services = location.state?.services || [];

  // State cho việc đếm ngược
  const [countdown, setCountdown] = useState<number>(300); // 5 phút = 300 giây
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  // Thông tin chuyển khoản cố định
  const accountInfo = {
    name: "VU QUANG LONG",
    accountNumber: "0888618681",
    bank: "MB BANK - Chi nhánh Lê Văn Việt",
    content: `BookBarber - ${date} ${time}`,
  };

  // Đếm ngược 5 phút
  useEffect(() => {
    if (countdown > 0 && !paymentCompleted) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, paymentCompleted]);

  // Định dạng thời gian đếm ngược
  const formatCountdown = (): string => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Xử lý khi ấn nút "Tôi đã thanh toán"
  const handlePaymentConfirm = () => {
    setPaymentCompleted(true);
    // Chuyển đến trang xác nhận đặt lịch thành công
    navigate("/booking/success", {
      state: {
        totalAmount: totalAmount,
        selectedPaymentMethod: selectedPaymentMethod,
        date: date,
        time: time,
        shop: shop,
        services: services,
      },
    });
  };

  // Xử lý khi hủy thanh toán
  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col">
      <div className="px-4 pt-6 pb-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-black">
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-lg font-bold">THANH TOÁN</h1>
        <div className="w-6"></div>
      </div>

      <div className="px-4 flex-1 overflow-y-auto pb-24">
        {/* Thời gian đếm ngược */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <p className="text-sm text-gray-600">Giao dịch sẽ hết hạn sau</p>
          <div className="bg-amber-100 px-4 py-2 rounded-lg mt-2">
            <p className="text-xl font-bold text-amber-800">
              {formatCountdown()}
            </p>
          </div>
        </div>

        {/* Mã QR mẫu */}
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 border-2 border-gray-300 flex items-center justify-center rounded-lg">
            {/* Đây là vị trí để thêm mã QR thực tế */}
            <div className="w-56 h-56 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-600 text-center px-6">
                Mã QR thanh toán
                <br />
                (Ảnh mẫu)
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin chuyển khoản */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-bold mb-3">Thông tin chuyển khoản</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tên người nhận</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-medium">{accountInfo.name}</p>
                <button className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Sao chép
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Số tài khoản</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-medium">{accountInfo.accountNumber}</p>
                <button className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Sao chép
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Ngân hàng</p>
              <p className="font-medium mt-1">{accountInfo.bank}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Số tiền</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-medium text-[#F5B100]">
                  {totalAmount.toLocaleString()} VND
                </p>
                <button className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Sao chép
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Nội dung chuyển khoản</p>
              <div className="flex justify-between items-center mt-1">
                <p className="font-medium">{accountInfo.content}</p>
                <button className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Sao chép
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin đặt lịch */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-3">Chi tiết đặt lịch</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tiệm cắt tóc</p>
              <p className="font-medium mt-1">
                {shop?.name || "4RAU Barbershop"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Ngày & giờ</p>
              <p className="font-medium mt-1">
                {date}, {time}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <p className="text-sm text-gray-500">Các dịch vụ</p>
              <div className="mt-2 space-y-1.5">
                {services.map((service: Service, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <p className="text-sm">
                      {service.name}{" "}
                      <span className="text-gray-500">x{service.quantity}</span>
                    </p>
                    <p className="text-sm font-medium">
                      {(service.priceValue * service.quantity).toLocaleString()}{" "}
                      VND
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2">
              <p className="text-sm text-gray-500">Phương thức thanh toán</p>
              <p className="font-medium mt-1">
                {selectedPaymentMethod === "bank"
                  ? "Ngân hàng"
                  : selectedPaymentMethod === "zalopay"
                  ? "ZaloPay"
                  : selectedPaymentMethod === "momo"
                  ? "MoMo"
                  : "Không xác định"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nút "Tôi đã thanh toán" */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handlePaymentConfirm}
            className="flex-1 py-3 bg-[#F5B100] text-white rounded-xl font-medium"
          >
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
