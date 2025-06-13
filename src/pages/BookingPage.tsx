import {
  MoreVertical,
  Scissors,
  Compass,
  Home,
  MessageCircle,
  User,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import babershop from "../assets/images/barber-shop.jpg";

// Interface cho Service
interface Service {
  id?: string;
  name: string;
  price: string; // Giá dịch vụ
  priceValue: number; // Giá dịch vụ dưới dạng số
  duration: string; // Thời gian thực hiện dịch vụ
  image: string; // Hình ảnh dịch vụ
  quantity: number; // Số lượng dịch vụ
}

// Interface cho Appointment
interface Appointment {
  id: string; // Unique ID cho mỗi lịch hẹn
  date: string;
  time?: string; // Thêm trường time
  barberShop: string;
  address: string;
  services: string;
  servicesDetail?: Service[]; // Chi tiết dịch vụ
  image: string;
  remindMe: boolean;
  status: "upcoming" | "completed" | "canceled";
  totalAmount?: number; // Tổng tiền
  paymentMethod?: string; // Phương thức thanh toán
  createdAt: Date; // Thời gian tạo
}

// Component ảnh dùng chung
const AppointmentImage: React.FC<{ src: string }> = ({ src }) => {
  const fallback = "/fallback-image.jpg"; // Đặt 1 ảnh fallback trong public/
  return (
    <img
      src={src || fallback}
      alt="barber"
      className="w-16 h-16 rounded-lg object-cover bg-gray-200"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );
};

// Component AppointmentCard cho tab "Sắp tới"
const UpcomingAppointmentCard: React.FC<{
  appointment: Appointment; // Dữ liệu lịch hẹn
  onCancel: () => void; // Hàm hủy lịch hẹn
  onViewDetails: () => void; // Hàm xem chi tiết lịch hẹn
  onToggleReminder: () => void; // Hàm bật/tắt nhắc nhở
}> = ({ appointment, onCancel, onViewDetails, onToggleReminder }) => {
  return (
    <div className="bg-[#F6F6F6] p-4 rounded-xl shadow-sm mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <div>
          <span>{appointment.date}</span>
          {appointment.time && (
            <span className="ml-2 text-[#F5B100] font-medium">
              {appointment.time}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span>Nhắc tôi</span>
          <input
            type="checkbox"
            checked={appointment.remindMe}
            onChange={onToggleReminder}
            className="accent-yellow-400"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        <AppointmentImage src={appointment.image} />
        <div className="flex flex-col justify-between flex-1">
          <p className="font-semibold">{appointment.barberShop}</p>
          <p className="text-xs text-gray-500">{appointment.address}</p>
        </div>
      </div>

      {/* Chi tiết dịch vụ */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 font-medium mb-1">DỊCH VỤ:</p>
        {appointment.servicesDetail && appointment.servicesDetail.length > 0 ? (
          <div className="space-y-1">
            {appointment.servicesDetail.map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-700">
                  {service.name}
                  {service.quantity > 1 && (
                    <span className="text-gray-500"> x{service.quantity}</span>
                  )}
                </span>
                <span className="text-[#F5B100] font-medium">
                  {service.price}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-700">{appointment.services}</p>
        )}
      </div>

      {/* Thông tin thanh toán */}
      <div className="flex justify-between items-center mb-3 text-xs">
        {appointment.totalAmount && (
          <div>
            <span className="text-gray-600">Tổng cộng: </span>
            <span className="font-bold text-[#F5B100]">
              {appointment.totalAmount.toLocaleString()} VND
            </span>
          </div>
        )}
        {appointment.paymentMethod && (
          <div className="text-right">
            <span className="text-gray-600">Thanh toán: </span>
            <span className="font-medium text-gray-700">
              {appointment.paymentMethod === "bank"
                ? "Ngân hàng"
                : appointment.paymentMethod === "zalopay"
                ? "ZaloPay"
                : appointment.paymentMethod === "momo"
                ? "MoMo"
                : "Tiền mặt"}
            </span>
          </div>
        )}
      </div>

      <div className="flex mt-4 gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm"
        >
          HUỶ HẸN
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 py-2 bg-[#F5B100] text-white rounded-xl text-sm"
        >
          THAY ĐỔI LỊCH HẸN
        </button>
      </div>
    </div>
  );
};

// Component AppointmentCard cho tab "Hoàn thành" - Mẫu hoàn chỉnh với đầy đủ thông tin
const CompletedAppointmentCard: React.FC<{
  appointment: Appointment;
  onReview: (appointment: Appointment) => void; // Hàm viết nhận xét
  onShowInvoice: () => void; // Hàm hiển thị hóa đơn điện tử
}> = ({ appointment, onReview, onShowInvoice }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
      {/* Header với ngày và trạng thái */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{appointment.date}</span>
          {appointment.time && (
            <span className="text-sm text-[#F5B100] font-medium">
              {appointment.time}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500 font-medium">Hoàn thành</span>
        </div>
      </div>

      {/* Thông tin cơ bản của tiệm */}
      <div className="flex gap-3 mb-3">
        <AppointmentImage src={appointment.image} />
        <div className="flex flex-col justify-between flex-1">
          <p className="font-semibold text-gray-800">{appointment.barberShop}</p>
          <p className="text-xs text-gray-500">{appointment.address}</p>
        </div>
      </div>

      {/* Chi tiết dịch vụ đã hoàn thành */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 font-medium mb-2">DỊCH VỤ ĐÃ THỰC HIỆN:</p>
        {appointment.servicesDetail && appointment.servicesDetail.length > 0 ? (
          <div className="space-y-2">
            {appointment.servicesDetail.map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {service.name}
                      {service.quantity > 1 && (
                        <span className="text-gray-500 ml-1">x{service.quantity}</span>
                      )}
                    </span>
                    <span className="text-xs text-[#F5B100] font-bold">
                      {service.price}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Thời gian: {service.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="text-xs text-gray-700">{appointment.services}</p>
          </div>
        )}
      </div>

      {/* Thông tin thanh toán chi tiết */}
      <div className="bg-[#F6F6F6] p-3 rounded-lg mb-3">
        <p className="text-xs text-gray-600 font-medium mb-2">THÔNG TIN THANH TOÁN:</p>
        <div className="space-y-2">
          {appointment.totalAmount && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Tổng tiền:</span>
              <span className="text-sm font-bold text-[#F5B100]">
                {appointment.totalAmount.toLocaleString()} VND
              </span>
            </div>
          )}
          {appointment.paymentMethod && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Phương thức:</span>
              <span className="text-xs font-medium text-gray-700">
                {appointment.paymentMethod === "bank"
                  ? "Chuyển khoản ngân hàng"
                  : appointment.paymentMethod === "zalopay"
                  ? "ZaloPay"
                  : appointment.paymentMethod === "momo"
                  ? "MoMo"
                  : "Tiền mặt"}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Trạng thái:</span>
            <span className="text-xs font-medium text-green-600">Đã thanh toán</span>
          </div>
        </div>
      </div>

      {/* Thời gian hoàn thành */}
      <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
        <span>Hoàn thành lúc: {appointment.createdAt.toLocaleString()}</span>
        <span>ID: #{appointment.id.slice(-6).toUpperCase()}</span>
      </div>

      {/* Các nút hành động */}
      <div className="flex gap-2">
        <button
          onClick={onShowInvoice}
          className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm font-medium"
        >
          📄 Hoá đơn điện tử
        </button>        <button
          onClick={() => onReview(appointment)}
          className="flex-1 py-2 bg-[#F5B100] text-white rounded-xl text-sm font-medium"        >
          ⭐ Viết nhận xét
        </button>
      </div>
    </div>
  );
};

// Component AppointmentCard cho tab "Huỷ"
const CanceledAppointmentCard: React.FC<{
  appointment: Appointment;
  onRebook: () => void; // Hàm đặt lại lịch hẹn
}> = ({ appointment, onRebook }) => {
  return (
    <div className="bg-[#F6F6F6] p-4 rounded-xl shadow-sm mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>{appointment.date}</span>
        <span className="text-yellow-500">Đã huỷ</span>
      </div>
      <div className="flex gap-3">
        <AppointmentImage src={appointment.image} />
        <div className="flex flex-col justify-between">
          <p className="font-semibold">{appointment.barberShop}</p>
          <p className="text-xs text-gray-500">{appointment.address}</p>
          <p className="text-xs text-gray-500">
            DỊCH VỤ: {appointment.services}
          </p>
        </div>
      </div>
      <div className="flex mt-4 gap-2">
        <button
          onClick={onRebook}
          className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm"
        >
          ĐẶT HẸN LẠI
        </button>
      </div>
    </div>
  );
};

// Modal hiển thị hóa đơn điện tử
const InvoiceModal: React.FC<{
  appointment: Appointment | null;
  onClose: () => void; // Hàm đóng modal
}> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  // Tính tổng thời gian thực hiện
  const getTotalDuration = () => {
    if (appointment.servicesDetail && appointment.servicesDetail.length > 0) {
      const totalMinutes = appointment.servicesDetail.reduce(
        (total, service) => {
          const minutes = parseInt(service.duration.replace(/\D/g, "")) || 0;
          return total + minutes * service.quantity;
        },
        0
      );
      return `${totalMinutes} phút`;
    }
    return "Không xác định";
  };

  // Dữ liệu mẫu đầy đủ cho hóa đơn
  const invoiceData = {
    invoiceNumber: `HD${appointment.id.slice(-6).toUpperCase()}`,
    issueDate: new Date().toLocaleDateString('vi-VN'),
    dueDate: appointment.date,
    customerInfo: {
      name: "Nguyễn Văn A",
      phone: "0987654321", 
      email: "nguyenvana@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM"
    },
    businessInfo: {
      name: appointment.barberShop,
      address: appointment.address,
      phone: "0123456789",
      email: "contact@barbershop.com",
      taxCode: "0123456789",
      website: "www.barbershop.com"
    },
    paymentInfo: {
      method: appointment.paymentMethod,
      bankName: appointment.paymentMethod === "bank" ? "Ngân hàng BIDV" : null,
      accountNumber: appointment.paymentMethod === "bank" ? "12345678901" : null,
      transactionId: `TXN${Date.now().toString().slice(-8)}`
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="sticky top-0 right-0 float-right m-2 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl shadow-md"
        >
          ×
        </button>

        <div className="p-6 pt-2">
          {/* Header với logo */}
          <div className="text-center mb-6 border-b pb-4">
            <div className="w-16 h-16 bg-[#F5B100] rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-xl">BB</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">HÓA ĐƠN ĐIỆN TỬ</h2>
            <p className="text-sm text-gray-500">Mã HĐ: {invoiceData.invoiceNumber}</p>
            <p className="text-xs text-gray-400">Ngày xuất: {invoiceData.issueDate}</p>
          </div>

          {/* Thông tin doanh nghiệp */}
          <div className="mb-4 p-3 bg-gradient-to-r from-[#F5B100]/10 to-[#F5B100]/5 rounded-lg border-l-4 border-[#F5B100]">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">THÔNG TIN DOANH NGHIỆP</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-medium">{invoiceData.businessInfo.name}</span></p>
              <p className="text-gray-600">📍 {invoiceData.businessInfo.address}</p>
              <p className="text-gray-600">📞 {invoiceData.businessInfo.phone}</p>
              <p className="text-gray-600">✉️ {invoiceData.businessInfo.email}</p>
              <p className="text-gray-600">🌐 {invoiceData.businessInfo.website}</p>
              <p className="text-gray-600">MST: {invoiceData.businessInfo.taxCode}</p>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">THÔNG TIN KHÁCH HÀNG</h3>
            <div className="space-y-1 text-xs">
              <p><span className="font-medium">{invoiceData.customerInfo.name}</span></p>
              <p className="text-gray-600">📞 {invoiceData.customerInfo.phone}</p>
              <p className="text-gray-600">✉️ {invoiceData.customerInfo.email}</p>
              <p className="text-gray-600">📍 {invoiceData.customerInfo.address}</p>
            </div>
          </div>

          {/* Thông tin lịch hẹn */}
          <div className="mb-4 space-y-2 bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">THÔNG TIN LỊCH HẸN</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày hẹn:</span>
                <span className="font-medium">{appointment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giờ hẹn:</span>
                <span className="font-medium">{appointment.time || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian thực hiện:</span>
                <span className="font-medium">{getTotalDuration()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`font-medium px-1 py-0.5 rounded text-xs ${
                  appointment.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {appointment.status === "completed"
                    ? "Hoàn thành"
                    : appointment.status === "upcoming"
                    ? "Sắp tới"
                    : "Đã hủy"}
                </span>
              </div>
            </div>
          </div>

          {/* Chi tiết dịch vụ */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">CHI TIẾT DỊCH VỤ</h3>
            <div className="bg-white border rounded-lg">
              <div className="grid grid-cols-12 gap-2 p-2 bg-gray-100 rounded-t-lg text-xs font-medium text-gray-700">
                <div className="col-span-5">Dịch vụ</div>
                <div className="col-span-2 text-center">SL</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-3 text-right">Thành tiền</div>
              </div>
              
              {appointment.servicesDetail && appointment.servicesDetail.length > 0 ? (
                appointment.servicesDetail.map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 p-2 border-b border-gray-100 text-xs">
                    <div className="col-span-5">
                      <div className="font-medium text-gray-800">{service.name}</div>
                      <div className="text-gray-500 text-xs">⏱ {service.duration}</div>
                    </div>
                    <div className="col-span-2 text-center">{service.quantity}</div>
                    <div className="col-span-2 text-center">{service.price}</div>
                    <div className="col-span-3 text-right font-medium">
                      {(service.priceValue * service.quantity).toLocaleString()} VND
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  {appointment.services}
                </div>
              )}
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="mb-4 bg-[#F5B100]/10 border-2 border-[#F5B100]/20 rounded-lg p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{appointment.totalAmount ? `${appointment.totalAmount.toLocaleString()} VND` : "Chưa xác định"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giảm giá:</span>
                <span>0 VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thuế VAT (0%):</span>
                <span>0 VND</span>
              </div>
              <div className="border-t pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-800">TỔNG CỘNG:</span>
                <span className="text-lg font-bold text-[#F5B100]">
                  {appointment.totalAmount ? `${appointment.totalAmount.toLocaleString()} VND` : "Chưa xác định"}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">THÔNG TIN THANH TOÁN</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium">
                  {appointment.paymentMethod === "bank"
                    ? "Chuyển khoản ngân hàng"
                    : appointment.paymentMethod === "zalopay"
                    ? "Ví điện tử ZaloPay"
                    : appointment.paymentMethod === "momo"
                    ? "Ví điện tử MoMo"
                    : "Tiền mặt"}
                </span>
              </div>
              
              {invoiceData.paymentInfo.bankName && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">{invoiceData.paymentInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-medium">{invoiceData.paymentInfo.accountNumber}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-medium">{invoiceData.paymentInfo.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {appointment.status === "completed" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code và ghi chú */}
          <div className="mb-4 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-lg mb-3">
              <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                <div className="text-xs text-gray-500 text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div>QR Code</div>
                  <div>Tra cứu HĐ</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Quét mã QR để tra cứu hóa đơn trực tuyến
            </p>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">
              🙏 Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ!
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Hóa đơn được tạo tự động bởi hệ thống BookBarber
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm font-medium hover:bg-[#F5B100]/5 transition-colors"
              >
                🖨️ In hóa đơn
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-[#F5B100] text-white rounded-xl text-sm font-medium hover:bg-[#E5A000] transition-colors"
              >
                ✅ Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính BookingPage
export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "canceled"
  >("upcoming");
  // State quản lý các modal và thông báo
  const [showNewBooking, setShowNewBooking] = useState<boolean>(false);
  // State quản lý dữ liệu lịch hẹn mới
  const [newBookingData, setNewBookingData] = useState<Appointment | null>(
    null
  );
  // State quản lý modal hóa đơn điện tử
  const [showInvoice, setShowInvoice] = useState(false);
  // State quản lý lịch hẹn để hiển thị trong modal hóa đơn
  const [invoiceAppointment, setInvoiceAppointment] =
    useState<Appointment | null>(null);

  // State quản lý appointments và dữ liệu mặc định
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem("barberShopAppointments");
    if (savedAppointments) {
      // Nếu có dữ liệu đã lưu
      try {
        // Thử phân tích cú pháp JSON
        return JSON.parse(savedAppointments); // Chuyển đổi chuỗi JSON thành mảng Appointment
      } catch (e) {
        console.error("Error parsing saved appointments", e);
        return getDefaultAppointments();
      }
    }
    return getDefaultAppointments(); // Nếu không có dữ liệu, trả về lịch hẹn mẫu
  });

  // CÁC HÀM CHÍNH

  // hàm lấy dữ liệu lịch hẹn mẫu
  function getDefaultAppointments(): Appointment[] {
    return [
      {
        id: "1",
        date: "Mar 20, 2025",
        time: "10:30 AM",
        barberShop: "4Rau Barbershop",
        address: "Vinhomes Grand Park Quận 9 - Tòa S503.2P HCM",
        services: "Cắt mẫu undercut, Cạo mặt, Xả tóc",
        servicesDetail: [
          {
            name: "Cắt mẫu undercut",
            price: "150,000 VND",
            priceValue: 150000,
            duration: "45 phút",
            image: babershop,
            quantity: 1,
          },
          {
            name: "Cạo mặt",
            price: "50,000 VND",
            priceValue: 50000,
            duration: "20 phút",
            image: babershop,
            quantity: 1,
          },
          {
            name: "Xả tóc",
            price: "30,000 VND",
            priceValue: 30000,
            duration: "15 phút",
            image: babershop,
            quantity: 1,
          },
        ],
        image: babershop,
        remindMe: true,
        status: "upcoming",
        totalAmount: 230000,
        paymentMethod: "zalopay",
        createdAt: new Date(),
      },
      {
        id: "2",
        date: "Dec 22, 2024",
        time: "2:15 PM",
        barberShop: "The Gentlemen's Den",
        address: "634 Điện Biên Phủ, Phường 11, Quận 10",
        services: "Undercut Haircut, Regular Shaving, Natural Hair Wash",
        servicesDetail: [
          {
            name: "Undercut Haircut",
            price: "180,000 VND",
            priceValue: 180000,
            duration: "50 phút",
            image: babershop,
            quantity: 1,
          },
          {
            name: "Regular Shaving",
            price: "80,000 VND",
            priceValue: 80000,
            duration: "25 phút",
            image: babershop,
            quantity: 1,
          },
          {
            name: "Natural Hair Wash",
            price: "40,000 VND",
            priceValue: 40000,
            duration: "15 phút",
            image: babershop,
            quantity: 1,
          },
        ],
        image: babershop,
        remindMe: false,
        status: "completed",
        totalAmount: 300000,
        paymentMethod: "bank",
        createdAt: new Date(2024, 11, 22),
      },
    ];
  }

  // Kiểm tra xem có dữ liệu mới được chuyển từ BookingSuccessPage không
  useEffect(() => {
    // Lấy dữ liệu từ state của location
    const bookingData = location.state?.bookingData;
    if (bookingData) {
      const { date, time, shop, services, totalAmount, selectedPaymentMethod } =
        bookingData;

      // Tạo danh sách tên dịch vụ
      const serviceNames = services
        .map(
          (s: Service) => `${s.name}${s.quantity > 1 ? ` x${s.quantity}` : ""}`
        )
        .join(", ");

      // Tạo lịch hẹn mới
      const newAppointment: Appointment = {
        id: Date.now().toString(), // ID duy nhất dựa trên timestamp
        date: date,
        time: time,
        barberShop: shop?.name || "4Rau Barbershop",
        address: shop?.address || "Vinhomes Grand Park, Quận 9, HCM",
        services: serviceNames,
        servicesDetail: services,
        image: shop?.image || babershop,
        remindMe: true,
        status: "upcoming",
        totalAmount: totalAmount,
        paymentMethod: selectedPaymentMethod,
        createdAt: new Date(),
      };

      // Thêm lịch hẹn mới vào danh sách
      const updatedAppointments = [newAppointment, ...appointments]; // Thêm lịch hẹn mới vào đầu mảng
      setAppointments(updatedAppointments); // Cập nhật state appointments
      setNewBookingData(newAppointment); // Lưu lịch hẹn mới để hiển thị trong thông báo
      setShowNewBooking(true); // Hiển thị thông báo lịch hẹn mới

      // Lưu vào localStorage
      localStorage.setItem(
        "barberShopAppointments",
        JSON.stringify(updatedAppointments)
      );

      // Xóa state để tránh hiển thị nhiều lần khi reload
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  // Lưu appointments vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem(
      "barberShopAppointments",
      JSON.stringify(appointments)
    );
  }, [appointments]);

  // Hàm xử lý hủy lịch hẹn
  const handleCancelAppointment = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = "canceled";
    setAppointments(updatedAppointments);
    setActiveTab("canceled");
  };

  // Hàm xử lý đặt lại lịch hẹn
  const handleRebook = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = "upcoming";
    setAppointments(updatedAppointments);
    setActiveTab("upcoming");
  };

  // Hàm xử lý xem chi tiết lịch hẹn
  const handleViewDetails = (appointment: Appointment) => {
    // Chuẩn bị dữ liệu để chuyển đến trang PaymentPage
    const cartItems =
      appointment.servicesDetail ||
      // Nếu không có chi tiết dịch vụ, tạo mảng dịch vụ từ chuỗi
      appointment.services.split(", ").map((serviceName) => ({
        name: serviceName,
        price: "Giá chưa xác định",
        priceValue: 0,
        duration: "chưa xác định",
        image: appointment.image,
        quantity: 1,
      }));

    // Tạo đối tượng shop từ dữ liệu appointment
    const shopData = {
      id: appointment.barberShop === "4Rau Barbershop" ? 2 : 3, // Gán ID dựa trên tên cửa hàng
      name: appointment.barberShop,
      address: appointment.address,
      image: appointment.image,
      rating: 4.5,
      reviews: 1000,
      distance: "3 km",
    };

    // Tách ngày và giờ từ appointment
    const date = appointment.date;
    const time = appointment.time;

    // Chuyển hướng đến trang PaymentPage với dữ liệu hiện tại của lịch hẹn
    navigate("/payment", {
      state: {
        cartItems: cartItems,
        totalPrice: appointment.totalAmount || 0,
        shopData: shopData,
        initialDate: date,
        initialTime: time,
        initialPaymentMethod: appointment.paymentMethod || "cash",
        isEditing: true, // Đánh dấu là đang chỉnh sửa lịch hẹn
        appointmentId: appointment.id, // ID của lịch hẹn đang chỉnh sửa
      },
    });
  };

  // Hàm xử lý viết nhận xét
  const handleReview = (appointment: Appointment) => {
    // Tạo đối tượng shop từ dữ liệu appointment để truyền đến trang ReviewPage
    const shopData = {
      id: appointment.barberShop === "4Rau Barbershop" ? 2 : 3, // Gán ID dựa trên tên cửa hàng
      name: appointment.barberShop,
      address: appointment.address,
      image: appointment.image,
      rating: 0, // Rating sẽ được người dùng đánh giá
      reviews: 0, // Thông tin này không cần thiết cho việc đánh giá
      distance: "", // Thông tin này không cần thiết cho việc đánh giá
    };

    navigate(`/review/${shopData.id}`, { state: { shopData } });
  };

  // Hàm xử lý bật/tắt nhắc nhở
  const handleToggleReminder = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].remindMe = !updatedAppointments[index].remindMe;
    setAppointments(updatedAppointments);
  };

  // Hàm xử lý đóng thông báo lịch hẹn mới
  const handleCloseNewBookingNotification = () => {
    setShowNewBooking(false);
  };

  // Hàm xử lý đóng modal hóa đơn điện tử
  return (
    <div className="bg-white min-h-screen font-sans relative">
      {/* Modal hóa đơn điện tử */}
      {showInvoice && (
        <InvoiceModal
          appointment={invoiceAppointment}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Hiển thị thông báo lịch hẹn mới */}
      {showNewBooking && newBookingData && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-5 mx-4 w-full max-w-lg animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={30} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Lịch hẹn mới đã được thêm!
            </h3>
            <p className="text-center mb-3 text-gray-600">
              Bạn đã đặt lịch thành công tại {newBookingData.barberShop}
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex gap-3">
                <AppointmentImage src={newBookingData.image} />
                <div className="flex flex-col">
                  <p className="font-semibold">{newBookingData.barberShop}</p>
                  <p className="text-xs text-gray-500">
                    {newBookingData.address}
                  </p>
                  <p className="text-xs text-gray-600">
                    {newBookingData.date}
                    {newBookingData.time ? `, ${newBookingData.time}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Dịch vụ:
                </p>
                <p className="text-sm">{newBookingData.services}</p>

                {newBookingData.totalAmount && (
                  <div className="flex justify-between mt-2">
                    <p className="text-sm font-medium">Tổng cộng:</p>
                    <p className="text-sm font-bold text-[#F5B100]">
                      {newBookingData.totalAmount.toLocaleString()} VND
                    </p>
                  </div>
                )}

                {newBookingData.paymentMethod && (
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-600">Thanh toán qua:</p>
                    <p className="text-xs">
                      {newBookingData.paymentMethod === "bank"
                        ? "Ngân hàng"
                        : newBookingData.paymentMethod === "zalopay"
                        ? "ZaloPay"
                        : newBookingData.paymentMethod === "momo"
                        ? "MoMo"
                        : "Tiền mặt"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseNewBookingNotification}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleCloseNewBookingNotification();
                  handleViewDetails(newBookingData);
                }}
                className="flex-1 py-3 bg-[#F5B100] text-white rounded-xl text-sm font-medium"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header và Tabs */}
      <div className="fixed top-0 left-0 w-full bg-white px-4 pt-6 pb-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Lịch hẹn của tui</h1>
          <MoreVertical size={20} className="text-gray-600" />
        </div>
        <div className="flex gap-2 mt-4">
          {["upcoming", "completed", "canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-xl text-sm ${
                activeTab === tab
                  ? "bg-[#F5B100] text-white"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {
                {
                  upcoming: "Sắp tới",
                  completed: "Hoàn thành",
                  canceled: "Huỷ",
                }[tab]
              }
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung chính của trang */}
      <div className="pt-[110px] pb-[70px] px-4">
        {appointments.filter((appt) => appt.status === activeTab).length ===
        0 ? (
          <div className="flex flex-col items-center justify-center text-center h-[60vh]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Scissors size={30} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">
              {activeTab === "upcoming"
                ? "Bạn chưa có lịch hẹn nào sắp tới"
                : activeTab === "completed"
                ? "Không có lịch hẹn nào đã hoàn thành"
                : "Không có lịch hẹn nào đã huỷ"}
            </p>
            {activeTab === "upcoming" && (
              <button
                onClick={() => navigate("/discover")}
                className="mt-4 px-6 py-2 bg-[#F5B100] text-white rounded-xl text-sm"
              >
                Đặt lịch ngay
              </button>
            )}
          </div>
        ) : (
          appointments
            .filter((appt) => appt.status === activeTab)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((appointment, idx) =>
              activeTab === "upcoming" ? (
                <UpcomingAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={() => handleCancelAppointment(idx)}
                  onViewDetails={() => handleViewDetails(appointment)}
                  onToggleReminder={() => handleToggleReminder(idx)}
                />
              ) : activeTab === "completed" ? (                <CompletedAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onReview={handleReview}
                  onShowInvoice={() => {
                    setInvoiceAppointment(appointment);
                    setShowInvoice(true);
                  }}
                />
              ) : (
                <CanceledAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onRebook={() => handleRebook(idx)}
                />
              )
            )
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between z-10">
        {[
          {
            icon: <Home size={20} />,
            label: "Nhà",
            value: "home",
            path: "/home",
          },
          {
            icon: <Compass size={20} />,
            label: "Khám phá",
            value: "discover",
            path: "/discover",
          },
          {
            icon: <Scissors size={20} />,
            label: "",
            value: "book",
            path: "/booking",
          },
          {
            icon: <MessageCircle size={20} />,
            label: "Tin nhắn",
            value: "messages",
            path: "/messages",
          },
          {
            icon: <User size={20} />,
            label: "Tài khoản",
            value: "account",
            path: "/account",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center cursor-pointer ${
              item.value === "book"
                ? "bg-black text-white p-3 rounded-full"
                : item.path === location.pathname
                ? "text-[#F5B100]"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            {item.label && <span className="text-xs mt-1">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
} // kết thúc BookingPage
