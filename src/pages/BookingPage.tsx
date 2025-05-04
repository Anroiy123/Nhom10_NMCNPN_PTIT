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
  price: string;
  priceValue: number;
  duration: string;
  image: string;
  quantity: number;
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
  appointment: Appointment;
  onCancel: () => void;
  onViewDetails: () => void;
  onToggleReminder: () => void;
}> = ({ appointment, onCancel, onViewDetails, onToggleReminder }) => {
  return (
    <div className="bg-[#F6F6F6] p-4 rounded-xl shadow-sm mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>{appointment.date}</span>
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

// Component AppointmentCard cho tab "Hoàn thành"
// Sửa CompletedAppointmentCard để nhận prop onShowInvoice
const CompletedAppointmentCard: React.FC<{
  appointment: Appointment;
  onReview: (appointment: Appointment) => void;
  onShowInvoice: () => void;
}> = ({ appointment, onReview, onShowInvoice }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>{appointment.date}</span>
        <span className="text-green-500">Hoàn thành</span>
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
          onClick={onShowInvoice}
          className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm"
        >
          Hoá đơn điện tử
        </button>
        <button
          onClick={() => onReview(appointment)}
          className="flex-1 py-2 bg-[#F5B100] text-white rounded-xl text-sm"
        >
          Viết nhận xét
        </button>
      </div>
    </div>
  );
};

// Component AppointmentCard cho tab "Huỷ"
const CanceledAppointmentCard: React.FC<{
  appointment: Appointment;
  onRebook: () => void;
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
  onClose: () => void;
}> = ({ appointment, onClose }) => {
  if (!appointment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-center mb-4">HÓA ĐƠN ĐIỆN TỬ</h2>
        <div className="mb-3 flex gap-3 items-center">
          <AppointmentImage src={appointment.image} />
          <div>
            <p className="font-semibold">{appointment.barberShop}</p>
            <p className="text-xs text-gray-500">{appointment.address}</p>
          </div>
        </div>
        <div className="mb-2 text-sm text-gray-700">
          <div>
            Ngày:{" "}
            <span className="font-medium">
              {appointment.date}
              {appointment.time ? `, ${appointment.time}` : ""}
            </span>
          </div>
          <div>
            Dịch vụ: <span className="font-medium">{appointment.services}</span>
          </div>
          {appointment.totalAmount && (
            <div>
              Tổng tiền:{" "}
              <span className="font-bold text-[#F5B100]">
                {appointment.totalAmount.toLocaleString()} VND
              </span>
            </div>
          )}
          {appointment.paymentMethod && (
            <div>
              Thanh toán:{" "}
              <span className="font-medium">
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
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F5B100] text-white rounded-xl text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Component chính BookingPage
export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "canceled"
  >("upcoming");
  const [showNewBooking, setShowNewBooking] = useState<boolean>(false);
  const [newBookingData, setNewBookingData] = useState<Appointment | null>(
    null
  );
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceAppointment, setInvoiceAppointment] =
    useState<Appointment | null>(null);

  // Load appointments từ localStorage khi component được mount
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem("barberShopAppointments");
    if (savedAppointments) {
      try {
        return JSON.parse(savedAppointments);
      } catch (e) {
        console.error("Error parsing saved appointments", e);
        return getDefaultAppointments();
      }
    }
    return getDefaultAppointments();
  });

  function getDefaultAppointments(): Appointment[] {
    return [
      {
        id: "1",
        date: "Mar 20, 2025",
        barberShop: "4Rau Barbershop",
        address: "Vinhomes Grand Park Quận 9 - Tòa S503.2P HCM",
        services: "Cắt mẫu undercut, Cạo mặt, Xả tóc",
        image: babershop,
        remindMe: true,
        status: "upcoming",
        createdAt: new Date(),
      },
      {
        id: "2",
        date: "Dec 22, 2024",
        barberShop: "The Gentlemen's Den",
        address: "634 Điện Biên Phủ, Phường 11, Quận 10",
        services: "Undercut Haircut, Regular Shaving, Natural Hair Wash",
        image: babershop,
        remindMe: false,
        status: "completed",
        createdAt: new Date(2024, 11, 22),
      },
    ];
  }

  // Kiểm tra xem có dữ liệu mới được chuyển từ BookingSuccessPage không
  useEffect(() => {
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
      const updatedAppointments = [newAppointment, ...appointments];
      setAppointments(updatedAppointments);
      setNewBookingData(newAppointment);
      setShowNewBooking(true);

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

  const handleCancelAppointment = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = "canceled";
    setAppointments(updatedAppointments);
    setActiveTab("canceled");
  };

  const handleRebook = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = "upcoming";
    setAppointments(updatedAppointments);
    setActiveTab("upcoming");
  };

  const handleViewDetails = (appointment: Appointment) => {
    // Chuẩn bị dữ liệu để chuyển đến trang PaymentPage
    const cartItems =
      appointment.servicesDetail ||
      // Nếu không có chi tiết dịch vụ, tạo mảng dịch vụ từ chuỗi
      appointment.services.split(", ").map((serviceName) => ({
        name: serviceName,
        price: "Giá không xác định",
        priceValue: 0,
        duration: "30 phút",
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

  const handleToggleReminder = (index: number) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].remindMe = !updatedAppointments[index].remindMe;
    setAppointments(updatedAppointments);
  };

  const handleCloseNewBookingNotification = () => {
    setShowNewBooking(false);
  };

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
              ) : activeTab === "completed" ? (
                <CompletedAppointmentCard
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
}
