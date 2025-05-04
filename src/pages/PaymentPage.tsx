import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  Home,
  Compass,
  Scissors,
  MessageCircle,
  User,
  Clock,
} from "lucide-react";
import babershop from "../assets/images/barber-shop.jpg";
import SelectService, {
  Service,
  sampleServices,
} from "../components/selectService";

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
  openTime?: string;
  closeTime?: string;
  district?: string;
  isVIP?: boolean;
}

// Interface cho ngày
interface Day {
  dayOfWeek: string;
  date: number;
  month: string;
  fullDate: Date;
  isToday: boolean;
}

// Interface cho khung giờ
interface TimeSlot {
  time: string;
  isBooked?: boolean; // Thêm thuộc tính isBooked để đánh dấu khung giờ đã được đặt
  session?: string; // Buổi: Sáng, Trưa, Chiều
}

// Interface cho thợ cắt tóc
interface Barber {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  experience: string;
  specialties: string[];
  available: boolean;
}

// Component chính PaymentPage
export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem có đang ở chế độ chỉnh sửa lịch hẹn không
  const isEditing = location.state?.isEditing || false;
  const appointmentId = location.state?.appointmentId || null;

  // Lấy dữ liệu từ navigation state
  const cartItems: Service[] = location.state?.cartItems || [];
  const initialTotalPrice: number = location.state?.totalPrice || 0;
  const shopData: BarberShop = location.state?.shopData || null;

  // Lấy giá trị khởi tạo cho ngày giờ và phương thức thanh toán (nếu đang chỉnh sửa)
  const initialDate: string | null = location.state?.initialDate || null;
  const initialTime: string | null = location.state?.initialTime || null;
  const initialPaymentMethod: string | null =
    location.state?.initialPaymentMethod || null;

  // Trạng thái để quản lý việc hiển thị giao diện chọn ngày và giờ
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  // Trạng thái để quản lý việc hiển thị giao diện chọn mã giảm giá
  const [showDiscountPicker, setShowDiscountPicker] = useState(false);
  // Trạng thái để quản lý việc hiển thị giao diện chọn dịch vụ
  const [showServicePicker, setShowServicePicker] = useState(false);
  // Trạng thái để quản lý việc hiển thị giao diện chọn thợ cắt tóc
  const [showBarberPicker, setShowBarberPicker] = useState(false);

  // Trạng thái để lưu ngày và giờ đã chọn
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialTime);

  // Trạng thái để quản lý giỏ hàng
  const [cart, setCart] = useState<Service[]>(cartItems);
  const [totalPrice, setTotalPrice] = useState<number>(initialTotalPrice);

  // Cập nhật tổng tiền khi giỏ hàng thay đổi
  useEffect(() => {
    const newTotal = cart.reduce((total, item) => {
      return total + item.priceValue * (item.quantity || 1);
    }, 0);
    setTotalPrice(newTotal);
  }, [cart]);

  // Xử lý khi chọn dịch vụ từ component SelectService
  const handleServiceSelect = (selectedServices: Service[]) => {
    setCart(selectedServices);
    setShowServicePicker(false);
  };

  // Xử lý tăng số lượng dịch vụ
  const handleIncreaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    setCart(updatedCart);
  };

  // Xử lý giảm số lượng dịch vụ
  const handleDecreaseQuantity = (index: number) => {
    const updatedCart = [...cart];
    const currentQuantity = updatedCart[index].quantity || 1;

    if (currentQuantity > 1) {
      updatedCart[index].quantity = currentQuantity - 1;
      setCart(updatedCart);
    } else {
      // Nếu số lượng = 1, xóa dịch vụ khỏi giỏ hàng
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    }
  };

  // Tính tổng thời gian
  const getTotalDuration = (): string => {
    // Trích xuất thời gian từ chuỗi "XX phút" và tính tổng
    let totalMinutes = 0;
    cart.forEach((item) => {
      const durationMatch = item.duration.match(/(\d+)/);
      if (durationMatch) {
        totalMinutes += parseInt(durationMatch[0]) * (item.quantity || 1);
      }
    });

    // Chuyển đổi thành giờ và phút
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ""}`;
    } else {
      return `${minutes} phút`;
    }
  };

  // Tính tổng tiền sau khi áp dụng giảm giá
  const getFinalAmount = (): number => {
    const discount = discountApplied ? discountAmount : 0;
    return totalPrice - discount;
  };

  // Trạng thái cho mã giảm giá
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Danh sách các mã giảm giá có sẵn
  const availableDiscounts = [
    { code: "BARBER10", amount: 10000, description: "Giảm 10.000 VND" },
    { code: "WELCOME15", amount: 15000, description: "Giảm 15.000 VND" },
    {
      code: "VIP50",
      amount: 50000,
      description: "Giảm 50.000 VND cho đơn trên 500.000 VND",
      minAmount: 500000,
    },
  ];

  // Khởi tạo phương thức thanh toán từ giá trị ban đầu
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(initialPaymentMethod);

  // Tạo danh sách 7 ngày tiếp theo từ ngày hiện tại
  const generateNextSevenDays = (): Day[] => {
    const days: Day[] = [];
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      days.push({
        dayOfWeek: dayNames[date.getDay()],
        date: date.getDate(),
        month: monthNames[date.getMonth()],
        fullDate: new Date(date),
        isToday: i === 0,
      });
    }

    return days;
  };

  // Danh sách ngày
  const days: Day[] = generateNextSevenDays();

  // Trạng thái để lưu danh sách các khung thời gian đã hết lịch cho từng ngày
  const [bookedTimeSlots, setBookedTimeSlots] = useState<
    Record<string, TimeSlot[]>
  >({});

  // Danh sách khung giờ cơ bản
  const baseTimeSlots: TimeSlot[] = [
    { time: "07:00 AM", session: "Sáng" },
    { time: "07:30 AM", session: "Sáng" },
    { time: "08:00 AM", session: "Sáng" },
    { time: "08:30 AM", session: "Sáng" },
    { time: "09:00 AM", session: "Sáng" },
    { time: "09:30 AM", session: "Sáng" },
    { time: "10:00 AM", session: "Sáng" },
    { time: "10:30 AM", session: "Sáng" },
    { time: "11:00 AM", session: "Sáng" },
    { time: "11:30 AM", session: "Trưa" },
    { time: "12:00 PM", session: "Trưa" },
    { time: "12:30 PM", session: "Trưa" },
    { time: "01:00 PM", session: "Trưa" },
    { time: "01:30 PM", session: "Chiều" },
    { time: "02:00 PM", session: "Chiều" },
    { time: "02:30 PM", session: "Chiều" },
    { time: "03:00 PM", session: "Chiều" },
    { time: "03:30 PM", session: "Chiều" },
    { time: "04:00 PM", session: "Chiều" },
    { time: "04:30 PM", session: "Chiều" },
    { time: "05:00 PM", session: "Chiều" },
    { time: "05:30 PM", session: "Chiều" },
    { time: "06:00 PM", session: "Chiều" },
    { time: "06:30 PM", session: "Tối" },
    { time: "07:00 PM", session: "Tối" },
    { time: "07:30 PM", session: "Tối" },
    { time: "08:00 PM", session: "Tối" },
  ];

  // Khi ngày được chọn thay đổi, tạo danh sách khung giờ đã bị đặt ngẫu nhiên
  useEffect(() => {
    if (selectedDate && !bookedTimeSlots[selectedDate]) {
      // Tạo bản sao sâu của danh sách khung giờ cơ bản
      const randomBookedSlots = [...baseTimeSlots].map((slot) => ({ ...slot }));

      // Đánh dấu ngẫu nhiên 2-3 khung giờ là đã được đặt
      const numberOfBookedSlots = Math.floor(Math.random() * 2) + 2; // 2-3 khung giờ
      let count = 0;
      while (count < numberOfBookedSlots) {
        const randomIndex = Math.floor(
          Math.random() * randomBookedSlots.length
        );
        if (!randomBookedSlots[randomIndex].isBooked) {
          randomBookedSlots[randomIndex].isBooked = true;
          count++;
        }
      }

      // Lưu lại để không phải tạo lại mỗi khi render
      setBookedTimeSlots((prev) => ({
        ...prev,
        [selectedDate]: randomBookedSlots,
      }));
    }
  }, [selectedDate]);

  // Lấy danh sách khung thời gian dựa trên ngày đã chọn
  const timeSlots =
    selectedDate && bookedTimeSlots[selectedDate]
      ? bookedTimeSlots[selectedDate]
      : baseTimeSlots;

  // State để quản lý hiển thị popup cảnh báo
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Xử lý khi nhấn "Đặt lịch ngay"
  const handleBookNow = () => {
    // Kiểm tra giỏ hàng có trống không
    if (!cart || cart.length === 0) {
      setWarningMessage(
        "Vui lòng chọn ít nhất một dịch vụ trước khi đặt lịch!"
      );
      setShowWarningPopup(true);
      return;
    }

    // Kiểm tra ngày và giờ
    if (!selectedDate || !selectedTime) {
      setWarningMessage("Vui lòng chọn ngày và giờ trước khi đặt lịch!");
      setShowWarningPopup(true);
      return;
    }

    // Kiểm tra phương thức thanh toán
    if (!selectedPaymentMethod) {
      setWarningMessage("Vui lòng chọn phương thức thanh toán!");
      setShowWarningPopup(true);
      return;
    }

    // Kiểm tra thợ cắt tóc
    if (!selectedBarber) {
      setWarningMessage("Vui lòng chọn thợ cắt tóc!");
      setShowWarningPopup(true);
      return;
    }

    // Tính tổng tiền sau khi áp dụng giảm giá
    const finalAmount = getFinalAmount();

    // Nếu đang ở chế độ chỉnh sửa, cập nhật lịch hẹn hiện tại
    if (isEditing && appointmentId) {
      // Lấy danh sách lịch hẹn từ localStorage
      const savedAppointments = localStorage.getItem("barberShopAppointments");
      if (savedAppointments) {
        try {
          const appointments = JSON.parse(savedAppointments);

          // Tìm và cập nhật lịch hẹn
          const updatedAppointments = appointments.map((appointment) => {
            if (appointment.id === appointmentId) {
              // Tạo danh sách tên dịch vụ
              const serviceNames = cart
                .map(
                  (s) =>
                    `${s.name}${
                      (s.quantity || 1) > 1 ? ` x${s.quantity || 1}` : ""
                    }`
                )
                .join(", ");

              return {
                ...appointment,
                date: selectedDate,
                time: selectedTime,
                services: serviceNames,
                servicesDetail: cart,
                totalAmount: finalAmount,
                paymentMethod: selectedPaymentMethod,
                barber: selectedBarber, // Thêm thông tin thợ cắt tóc
              };
            }
            return appointment;
          });

          // Lưu danh sách đã cập nhật vào localStorage
          localStorage.setItem(
            "barberShopAppointments",
            JSON.stringify(updatedAppointments)
          );

          // Thông báo thành công và quay lại trang booking
          alert("Cập nhật lịch hẹn thành công!");
          navigate("/booking");
          return;
        } catch (e) {
          console.error("Error updating appointment", e);
        }
      }
    }

    // Nếu không phải chế độ chỉnh sửa hoặc gặp lỗi, xử lý như đặt lịch mới
    if (selectedPaymentMethod === "cash") {
      // Nếu thanh toán bằng tiền mặt, đến trang xác nhận đặt lịch thành công
      navigate("/booking/success", {
        state: {
          totalAmount: finalAmount,
          selectedPaymentMethod: selectedPaymentMethod,
          date: selectedDate,
          time: selectedTime,
          shop: shopData,
          services: cart,
          barber: selectedBarber, // Thêm thông tin thợ cắt tóc
        },
      });
    } else {
      // Nếu thanh toán bằng các phương thức khác, đến trang QR
      navigate("/qrpay", {
        state: {
          totalAmount: finalAmount,
          selectedPaymentMethod: selectedPaymentMethod,
          date: selectedDate,
          time: selectedTime,
          shop: shopData,
          services: cart,
          barber: selectedBarber, // Thêm thông tin thợ cắt tóc
        },
      });
    }
  };

  // Xử lý khi chọn ngày
  const handleSelectDate = (day: Day) => {
    setSelectedDate(`${day.dayOfWeek} ${day.date}, ${day.month}`);
  };

  // Xử lý khi chọn khung giờ
  const handleSelectTime = (time: string, isBooked?: boolean) => {
    // Không cho phép chọn khung giờ đã có khách chọn
    if (isBooked) return;

    setSelectedTime(time);
  };

  // Xử lý khi hoàn tất chọn ngày và giờ
  const handleConfirmDateTime = () => {
    if (selectedDate && selectedTime) {
      setShowDateTimePicker(false);
    } else {
      alert("Vui lòng chọn ngày và giờ!");
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode) {
      const discount = availableDiscounts.find(
        (d) =>
          d.code === discountCode && (!d.minAmount || totalPrice >= d.minAmount)
      );
      if (discount) {
        setDiscountApplied(true);
        setDiscountAmount(discount.amount);
        setDiscountError(null);
        alert(`Áp dụng mã giảm giá ${discountCode} thành công!`);
      } else {
        setDiscountError(
          "Mã giảm giá không hợp lệ hoặc không đủ điều kiện áp dụng!"
        );
      }
    }
  };

  // Trạng thái để lưu thợ cắt tóc đã chọn
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  // Danh sách thợ cắt tóc mẫu
  const barbers: Barber[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/src/assets/images/avatar.jpg",
      rating: 4.8,
      experience: "5 năm",
      specialties: ["Undercut", "Mohican", "Pompadour"],
      available: true,
    },
    {
      id: 2,
      name: "Trần Văn B",
      avatar: "/src/assets/images/avatar.jpg",
      rating: 4.9,
      experience: "7 năm",
      specialties: ["Mullet", "Crew cut", "Side part"],
      available: true,
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/src/assets/images/avatar.jpg",
      rating: 4.7,
      experience: "3 năm",
      specialties: ["Slick back", "Quiff", "Taper fade"],
      available: false,
    },
    {
      id: 4,
      name: "Phạm Văn D",
      avatar: "/src/assets/images/avatar.jpg",
      rating: 4.6,
      experience: "4 năm",
      specialties: ["French crop", "Buzz cut", "Modern pompadour"],
      available: true,
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans relative">
      {/* Popup cảnh báo */}
      {showWarningPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-5 mx-4 w-full max-w-sm">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-500 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Lưu ý</h3>
            <p className="text-center mb-6">{warningMessage}</p>
            <button
              onClick={() => setShowWarningPopup(false)}
              className="w-full py-3 bg-[#F5B100] text-white rounded-xl text-sm font-medium"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {showDateTimePicker ? (
        <div className="min-h-screen flex flex-col">
          <div className="px-4 pt-6 pb-4 flex justify-between items-center">
            <button
              onClick={() => setShowDateTimePicker(false)}
              className="text-black"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-lg font-bold">ĐẶT LỊCH</h1>
            <div className="w-6"></div>
          </div>

          <div
            className="px-4 flex-1 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <h2 className="text-lg font-bold">
              Chọn ngày và giờ cho cuộc hẹn với nhà tạo mẫu tóc của bạn
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Bạn muốn được phục vụ vào ngày nào ?
            </p>

            <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDate(day)}
                  className={`flex-none px-3 py-2 rounded-lg text-sm border ${
                    selectedDate ===
                    `${day.dayOfWeek} ${day.date}, ${day.month}`
                      ? "border-[#F5B100] bg-[#FFF7E6] text-[#F5B100]"
                      : day.isToday
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`${
                        day.isToday ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      {day.dayOfWeek}
                    </span>
                    <span className="text-base font-bold">{day.date}</span>
                    <span className="text-xs">{day.month}</span>
                    {day.isToday && (
                      <span className="text-xs text-blue-500 mt-1">Today</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold mt-6">Chọn khung giờ</h3>

            {/* Nhóm các khung giờ theo buổi */}
            {["Sáng", "Trưa", "Chiều", "Tối"].map((session) => {
              // Lọc các khung giờ thuộc buổi hiện tại
              const sessionSlots = timeSlots.filter(
                (slot) => slot.session === session
              );

              // Chỉ hiển thị nhóm nếu có khung giờ thuộc buổi này
              if (sessionSlots.length === 0) return null;

              return (
                <div key={session} className="mb-4">
                  <h4 className="text-md font-semibold mb-2 mt-4 text-gray-700 flex items-center">
                    {session === "Sáng" && <span className="mr-1">☀️</span>}
                    {session === "Trưa" && <span className="mr-1">🌞</span>}
                    {session === "Chiều" && <span className="mr-1">🌤️</span>}
                    {session === "Tối" && <span className="mr-1">🌙</span>}
                    Buổi {session}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {sessionSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleSelectTime(slot.time, slot.isBooked)
                        }
                        disabled={slot.isBooked}
                        className={`py-3 rounded-lg text-sm border ${
                          slot.isBooked
                            ? "border-red-300 bg-red-50 text-red-300 cursor-not-allowed"
                            : selectedTime === slot.time
                            ? "border-[#F5B100] bg-[#FFF7E6] text-[#F5B100]"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {slot.time}
                        {slot.isBooked && (
                          <span className="block text-xs mt-1 text-red-400">
                            Đã có khách chọn
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="h-20"></div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleConfirmDateTime}
              className="w-full py-3 bg-[#F5B100] text-white rounded-xl text-sm font-medium"
            >
              Xác nhận
            </button>
          </div>
        </div>
      ) : showDiscountPicker ? (
        <div className="min-h-screen flex flex-col">
          <div className="px-4 pt-6 pb-4 flex justify-between items-center">
            <button
              onClick={() => setShowDiscountPicker(false)}
              className="text-black"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-lg font-bold">MÃ GIẢM GIÁ</h1>
            <div className="w-6"></div>
          </div>

          <div
            className="px-4 flex-1 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <h2 className="text-lg font-bold">
              Chọn mã giảm giá phù hợp cho đơn hàng của bạn
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Giá trị đơn hàng: {totalPrice.toLocaleString()} VND
            </p>

            {/* Các mã giảm giá có sẵn */}
            <div className="flex flex-col gap-3 mt-6">
              {availableDiscounts.map((discount, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDiscountCode(discount.code);
                    // Kiểm tra điều kiện áp dụng
                    if (discount.minAmount && totalPrice < discount.minAmount) {
                      setDiscountError(
                        `Mã ${
                          discount.code
                        } chỉ áp dụng cho đơn hàng từ ${discount.minAmount.toLocaleString()} VND`
                      );
                    } else {
                      setDiscountApplied(true);
                      setDiscountAmount(discount.amount);
                      setDiscountError(null);
                    }
                  }}
                  className={`w-full p-4 rounded-lg text-left border ${
                    discountCode === discount.code &&
                    discountApplied &&
                    !discountError
                      ? "border-[#F5B100] bg-[#FFF7E6]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-full text-[#F5B100] font-bold">
                        %
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-800">
                          {discount.code}
                        </h3>
                        <p className="text-xs text-amber-700 mt-1">
                          {discount.description}
                        </p>
                        {discount.minAmount && (
                          <p className="text-xs text-amber-600 mt-1">
                            Đơn tối thiểu: {discount.minAmount.toLocaleString()}{" "}
                            VND
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        discountCode === discount.code &&
                        discountApplied &&
                        !discountError
                          ? "border-[#F5B100] bg-[#F5B100]"
                          : "border-gray-300"
                      } flex items-center justify-center`}
                    >
                      {discountCode === discount.code &&
                        discountApplied &&
                        !discountError && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                    </div>
                  </div>
                  {discountCode === discount.code && discountError && (
                    <p className="text-sm text-red-600 mt-2">{discountError}</p>
                  )}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-bold mt-8">Nhập mã giảm giá khác</h3>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    // Reset thông báo lỗi khi người dùng thay đổi mã
                    setDiscountError(null);
                    setDiscountApplied(false);
                  }}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 p-3 border border-gray-200 rounded-lg"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="bg-[#F5B100] text-white px-4 py-3 rounded-lg font-medium"
                >
                  Áp dụng
                </button>
              </div>
              {discountApplied && !discountError && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <span>✅</span> Áp dụng mã giảm giá thành công! Bạn được giảm{" "}
                  {discountAmount.toLocaleString()} VND
                </p>
              )}
              {discountError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <span>❌</span> {discountError}
                </p>
              )}
            </div>

            <div className="h-20"></div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => setShowDiscountPicker(false)}
              className="w-full py-3 bg-[#F5B100] text-white rounded-xl text-sm font-medium"
            >
              Xác nhận
            </button>
          </div>
        </div>
      ) : showServicePicker ? (
        <div className="min-h-screen flex flex-col">
          <div className="px-4 pt-6 pb-4 flex justify-between items-center">
            <button
              onClick={() => setShowServicePicker(false)}
              className="text-black"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-lg font-bold">CHỌN DỊCH VỤ</h1>
            <div className="w-6"></div>
          </div>

          <div
            className="flex-1 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <SelectService
              services={sampleServices}
              onSelect={handleServiceSelect}
              initialSelected={cart}
            />
          </div>
        </div>
      ) : showBarberPicker ? (
        <div className="min-h-screen flex flex-col">
          <div className="px-4 pt-6 pb-4 flex justify-between items-center">
            <button
              onClick={() => setShowBarberPicker(false)}
              className="text-black"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-lg font-bold">CHỌN THỢ CẮT TÓC</h1>
            <div className="w-6"></div>
          </div>

          <div
            className="px-4 flex-1 overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <h2 className="text-lg font-bold">
              Chọn thợ cắt tóc phù hợp cho kiểu tóc của bạn
            </h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">
              Mỗi thợ cắt tóc của chúng tôi có chuyên môn và phong cách riêng
            </p>

            <div className="space-y-4">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => {
                    if (barber.available) {
                      setSelectedBarber(barber);
                      setShowBarberPicker(false);
                    }
                  }}
                  className={`p-4 rounded-lg border ${
                    !barber.available
                      ? "border-gray-200 opacity-60 bg-gray-50"
                      : selectedBarber?.id === barber.id
                      ? "border-[#F5B100] bg-[#FFF7E6]"
                      : "border-gray-200"
                  } ${
                    barber.available ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800">
                          {barber.name}
                        </h3>
                        <div className="flex items-center text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{barber.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Kinh nghiệm: {barber.experience}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {barber.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      {!barber.available && (
                        <p className="mt-2 text-sm text-red-400">
                          Đã kín lịch hôm nay
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-20"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 pt-6 pb-4 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="text-black">
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-lg font-bold">ĐẶT LỊCH</h1>
            <div className="w-6"></div>
          </div>

          <div
            className="px-4 pb-[120px] min-h-[calc(100vh-64px)] overflow-y-auto"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            <h2 className="text-xl font-bold">
              {shopData?.name || "4RAU Barbershop"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {shopData?.address || "Vinhomes Grand Park, Quận 9"}
            </p>

            <div className="mt-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>📅</span> Chọn ngày và giờ
                </p>
                <button
                  onClick={() => setShowDateTimePicker(true)}
                  className="text-sm font-medium text-gray-600 flex items-center gap-1"
                >
                  {selectedDate && selectedTime
                    ? `${selectedDate}, ${selectedTime}`
                    : "Chọn ngày và giờ"}
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>💇‍♂️</span> Thợ cắt tóc
                </p>
                <button
                  onClick={() => setShowBarberPicker(true)}
                  className="text-sm font-medium text-gray-600 flex items-center gap-1"
                >
                  {selectedBarber ? selectedBarber.name : "Chọn thợ cắt tóc"}
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-4">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <p className="text-sm text-gray-600">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecreaseQuantity(idx)}
                        className="p-1"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="text-sm">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(idx)}
                        className="p-1"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                      <span className="text-sm font-medium ml-2">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h2 className="text-lg font-bold mt-6">Phương thức thanh toán</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => setSelectedPaymentMethod("bank")}
                className={`w-full p-4 rounded-lg border flex items-center justify-between ${
                  selectedPaymentMethod === "bank"
                    ? "border-[#F5B100] bg-[#FFF7E6]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                    🏦
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Ngân hàng</p>
                    <p className="text-xs text-gray-500">
                      Thanh toán qua thẻ ngân hàng
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedPaymentMethod === "bank"
                      ? "border-[#F5B100] bg-[#F5B100]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "bank" && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod("zalopay")}
                className={`w-full p-4 rounded-lg border flex items-center justify-between ${
                  selectedPaymentMethod === "zalopay"
                    ? "border-[#F5B100] bg-[#FFF7E6]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                    💳
                  </div>
                  <div className="text-left">
                    <p className="font-medium">ZaloPay</p>
                    <p className="text-xs text-gray-500">
                      Thanh toán qua ZaloPay
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedPaymentMethod === "zalopay"
                      ? "border-[#F5B100] bg-[#F5B100]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "zalopay" && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod("cash")}
                className={`w-full p-4 rounded-lg border flex items-center justify-between ${
                  selectedPaymentMethod === "cash"
                    ? "border-[#F5B100] bg-[#FFF7E6]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                    💵
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Tiền mặt</p>
                    <p className="text-xs text-gray-500">
                      Thanh toán trực tiếp tại cửa hàng
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedPaymentMethod === "cash"
                      ? "border-[#F5B100] bg-[#F5B100]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "cash" && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod("momo")}
                className={`w-full p-4 rounded-lg border flex items-center justify-between ${
                  selectedPaymentMethod === "momo"
                    ? "border-[#F5B100] bg-[#FFF7E6]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-pink-100 rounded-full">
                    📱
                  </div>
                  <div className="text-left">
                    <p className="font-medium">MoMo</p>
                    <p className="text-xs text-gray-500">
                      Thanh toán qua ví MoMo
                    </p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedPaymentMethod === "momo"
                      ? "border-[#F5B100] bg-[#F5B100]"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "momo" && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </button>
            </div>

            <h2 className="text-lg font-bold mt-6">Mã giảm giá</h2>
            <div className="mt-2">
              <div
                onClick={() => setShowDiscountPicker(true)}
                className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full text-[#F5B100] font-bold">
                    %
                  </div>
                  <div>
                    {discountApplied ? (
                      <div>
                        <p className="font-medium">{discountCode}</p>
                        <p className="text-xs text-green-600">
                          Giảm {discountAmount.toLocaleString()} VND
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Chọn hoặc nhập mã giảm giá
                      </p>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-600" />
              </div>
            </div>

            {/* Phần thống kê chi tiết thanh toán */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3">Chi tiết thanh toán</h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Tổng thời gian:</p>
                  <p className="font-medium">{getTotalDuration()}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Tạm tính:</p>
                  <p className="font-medium">
                    {totalPrice.toLocaleString()} VND
                  </p>
                </div>

                {discountApplied && (
                  <div className="flex justify-between items-center text-[#F5B100]">
                    <p>Giảm giá ({discountCode}):</p>
                    <p>-{discountAmount.toLocaleString()} VND</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <p>Thành tiền:</p>
                    <p>{getFinalAmount().toLocaleString()} VND</p>
                  </div>
                  {selectedPaymentMethod && (
                    <p className="text-xs text-gray-500 text-right mt-1">
                      Thanh toán qua{" "}
                      {selectedPaymentMethod === "bank"
                        ? "Ngân hàng"
                        : selectedPaymentMethod === "zalopay"
                        ? "ZaloPay"
                        : selectedPaymentMethod === "momo"
                        ? "MoMo"
                        : selectedPaymentMethod === "cash"
                        ? "Tiền mặt"
                        : "..."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-20"></div>
          </div>
        </>
      )}

      {/* Thanh điều hướng */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between z-10">
        {[
          { icon: <Home size={20} />, label: "Nhà", value: "home", path: "/" },
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

      {/* Nút "Đặt lịch ngay" */}
      {!showDateTimePicker && !showDiscountPicker && !showServicePicker && (
        <div className="fixed bottom-16 left-0 w-full px-4 z-20">
          <button
            onClick={handleBookNow}
            className="w-full py-3 bg-[#F5B100] text-white rounded-xl text-sm font-medium shadow-lg"
          >
            {isEditing ? "Cập nhật lịch hẹn" : "Đặt lịch ngay"}
          </button>
        </div>
      )}

      <style>
        {`
          @media (max-width: 320px) {
            .px-4 {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            .text-lg {
              font-size: 0.875rem;
            }
            .text-xl {
              font-size: 1rem;
            }
            .text-sm {
              font-size: 0.75rem;
            }
            .py-3 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }

          @media (min-width: 640px) {
            .px-4 {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            .text-lg {
              font-size: 1.25rem;
            }
            .text-xl {
              font-size: 1.5rem;
            }
            .text-sm {
              font-size: 0.875rem;
            }
          }
        `}
      </style>
    </div>
  );
}
