import {
  Bell,
  MapPin,
  SlidersHorizontal,
  Scissors,
  Brush,
  ShowerHead,
  Waves,
  Compass,
  Home,
  MessageCircle,
  User,
  Star,
  ChevronDown, // Đã import
} from "lucide-react";
import { useState } from "react"; // Đã có useState
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Settings } from "react-slick";
import babershop from "../assets/images/barber-shop.jpg"; // Đảm bảo đường dẫn đúng

// --- Interfaces ---
interface Appointment {
  date: string;
  barberShop: string;
  address: string;
  services: string;
  image: string;
  remindMe: boolean;
}

interface Banner {
  discount: string;
  title: string;
  description: string;
  gradient: string;
}

interface NewsItem {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface PopularShop {
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image: string;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  shopName?: string;
  image: string;
}

// --- AppointmentCard Component ---
const AppointmentCard: React.FC<{
  appointment: Appointment;
  onCancel: () => void;
  onViewDetails: () => void;
  onToggleReminder: () => void;
}> = ({ appointment, onCancel, onViewDetails, onToggleReminder }) => {
  return (
    <div className="bg-[#F6F6F6] p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span className="font-medium">{appointment.date}</span>
        <div className="flex items-center gap-1">
          <span className="font-medium">Nhắc tôi</span>
          <input
            type="checkbox"
            checked={appointment.remindMe}
            onChange={onToggleReminder}
            className="accent-yellow-400"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <img
          src={appointment.image}
          alt="barber"
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-200"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{appointment.barberShop}</p>
          <p className="text-xs text-gray-500 truncate">
            {appointment.address}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            DỊCH VỤ: {appointment.services}
          </p>
        </div>
      </div>
      <div className="flex mt-4 gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-[#F5B100] text-[#F5B100] rounded-xl text-sm font-semibold hover:bg-[#FFF7E6] transition-colors"
        >
          HUỶ HẸN
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 py-2 bg-[#F5B100] text-white rounded-xl text-sm font-semibold hover:bg-yellow-500 transition-colors"
        >
          MÔ TẢ
        </button>
      </div>
    </div>
  );
};

// --- PopularShopCard Component ---
const PopularShopCard: React.FC<{ shop: PopularShop }> = ({ shop }) => {
  const navigate = useNavigate();
  return (
    <div
      // Điều hướng đến trang chi tiết với ID (hoặc state)
      onClick={() =>
        navigate(`/description/${shop.id}`, { state: { shopData: shop } })
      }
      className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <img
        src={shop.image}
        alt={shop.name}
        className="w-full h-24 object-cover"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
      />
      <div className="p-3">
        <p className="text-sm font-semibold truncate">{shop.name}</p>
        <p className="text-xs text-gray-500 mt-1 truncate">{shop.address}</p>
        <div className="flex items-center gap-1 mt-1 text-xs">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-gray-700 font-semibold">{shop.rating}</span>
          <span className="text-gray-400">• {shop.distance}</span>
        </div>
      </div>
    </div>
  );
};

// --- OfferCard Component ---
const OfferCard: React.FC<{ offer: Offer }> = ({ offer }) => {
  const navigate = useNavigate();
  return (
    <div
      // Điều hướng đến trang chi tiết ưu đãi (hoặc trang shop nếu có)
      onClick={() => navigate(`/offers/${offer.id}`)} // Cần tạo route /offers/:id
      className="flex-shrink-0 w-60 bg-gradient-to-r from-yellow-100 via-yellow-50 to-orange-100 border border-yellow-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow p-3 flex gap-3 items-center"
    >
      <img
        src={offer.image}
        alt={offer.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-yellow-900 truncate">
          {offer.title}
        </p>
        <p className="text-xs text-yellow-700 mt-1 line-clamp-2">
          {offer.description}
        </p>
        {offer.shopName && (
          <p className="text-xs text-yellow-600 mt-1 truncate">
            Tại: {offer.shopName}
          </p>
        )}
      </div>
    </div>
  );
};

// --- HomePage Component ---
export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  // State cho khu vực đã chọn
  const [selectedLocation, setSelectedLocation] = useState("TP. Hồ Chí Minh");
  // State để hiển thị dropdown khu vực
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Danh sách khu vực
  const locations = ["TP. Hồ Chí Minh", "Đà Nẵng", "Hà Nội"];

  // State cho lịch hẹn (có thể fetch từ API)
  const [appointment, setAppointment] = useState<Appointment | null>({
    // Cho phép null nếu không có lịch
    date: "Mar 20, 2025",
    barberShop: "4Rau Barbershop",
    address: "Vinhomes Grand Park Quận 9",
    services: "Cắt mẫu undercut, Cạo mặt, Xả tóc",
    image: babershop,
    remindMe: true,
  });

  // --- Dữ liệu (banners, newsItems, popularShops, bestOffers - Giữ nguyên) ---
  const banners: Banner[] = [
    {
      discount: "50% OFF",
      title: "Today's Special 50%",
      description: "Please! Hurry up",
      gradient: "from-[#FFD399] to-[#FFA928]",
    },
    {
      discount: "30% OFF",
      title: "Weekend Deal 30%",
      description: "Book Now, Save More!",
      gradient: "from-[#FF8A65] to-[#FF5722]",
    },
    {
      discount: "20% OFF",
      title: "First Time Special 20%",
      description: "New Customers Only!",
      gradient: "from-[#FFAB91] to-[#FF6D40]",
    },
    {
      discount: "40% OFF",
      title: "Holiday Special 40%",
      description: "Limited Time Offer!",
      gradient: "from-[#FFCA28] to-[#FFB300]",
    },
  ];

  const newsItems: NewsItem[] = [
    {
      title: "Mở rộng chi nhánh mới tại Quận 7",
      description:
        "4Rau Barbershop vừa khai trương chi nhánh mới tại Quận 7 với nhiều ưu đãi hấp dẫn cho khách hàng.",
      date: "Apr 15, 2025",
      image: babershop,
    },
    {
      title: "Xu hướng tóc nam 2025",
      description:
        "Khám phá những kiểu tóc nam hot nhất năm 2025, từ undercut đến textured crop.",
      date: "Apr 10, 2025",
      image: babershop,
    },
    {
      title: "Chương trình tri ân khách hàng",
      description:
        "Giảm giá 20% cho tất cả dịch vụ trong tuần lễ tri ân từ 20/4 đến 27/4.",
      date: "Apr 5, 2025",
      image: babershop,
    },
  ];

  const popularShops: PopularShop[] = [
    {
      id: 1,
      name: "4Rau Barbershop",
      address: "Quận 9, TP.HCM",
      rating: 4.8,
      distance: "1.5 km",
      image: babershop,
    },
    {
      id: 2,
      name: "Liêm Barbershop",
      address: "Quận 1, TP.HCM",
      rating: 4.9,
      distance: "3.2 km",
      image: babershop,
    },
    {
      id: 3,
      name: "Vũ Trí Barbershop",
      address: "Thủ Đức, TP.HCM",
      rating: 4.7,
      distance: "2.0 km",
      image: babershop,
    },
    {
      id: 4,
      name: "Tony Barber House",
      address: "Quận 7, TP.HCM",
      rating: 4.6,
      distance: "5.1 km",
      image: babershop,
    },
    {
      id: 5,
      name: "Augustus Barbershop",
      address: "Quận 3, TP.HCM",
      rating: 4.8,
      distance: "4.5 km",
      image: babershop,
    },
  ];

  const bestOffers: Offer[] = [
    {
      id: 1,
      title: "Giảm 30% Cắt + Gội",
      description: "Áp dụng cuối tuần tại chi nhánh mới.",
      shopName: "4Rau Barbershop",
      image: babershop,
    },
    {
      id: 2,
      title: "Combo Uốn + Nhuộm chỉ 500K",
      description: "Tặng kèm hấp dầu phục hồi Keratin.",
      shopName: "Liêm Barbershop",
      image: babershop,
    },
    {
      id: 3,
      title: "Đi 2 Tính Tiền 1",
      description: "Áp dụng cho dịch vụ cắt tóc vào Thứ 3 hàng tuần.",
      shopName: "Vũ Trí Barbershop",
      image: babershop,
    },
    {
      id: 4,
      title: "Giảm giá học sinh/sinh viên",
      description: "Giảm 15% khi xuất trình thẻ HS/SV.",
      shopName: "Tony Barber House",
      image: babershop,
    },
    {
      id: 5,
      title: "Tích điểm đổi quà",
      description: "Mỗi 100K nhận 1 điểm, đổi quà hấp dẫn.",
      shopName: "Augustus Barbershop",
      image: babershop,
    },
  ];

  // --- Slider Settings ---
  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand" as const,
  };

  // --- Handlers ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Chuyển sang trang Discover với query và location
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    }
    params.set("location", selectedLocation);
    navigate(`/discover?${params.toString()}`);
  };

  // Handler chọn khu vực
  const handleSelectLocation = () => {
    setShowLocationDropdown((prev) => !prev);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    // TODO: Fetch lại dữ liệu (popularShops, bestOffers,...) theo khu vực mới nếu cần
    console.log("Khu vực mới:", location);
  };

  const handleCancelAppointment = () => {
    const confirmCancel = window.confirm("Bạn có chắc muốn huỷ lịch hẹn?");
    if (confirmCancel) {
      alert("Đã huỷ lịch hẹn!");
      setAppointment(null); // Ẩn card sau khi hủy
      // TODO: Gọi API để hủy lịch hẹn
    }
  };

  const handleViewDetails = () => {
    // Nên truyền ID hoặc dữ liệu lịch hẹn sang trang chi tiết
    navigate("/description"); // Cần sửa để truyền ID/data
  };

  const handleToggleReminder = () => {
    if (appointment) {
      setAppointment((prev) =>
        prev ? { ...prev, remindMe: !prev.remindMe } : null
      );
      // TODO: Gọi API để lưu trạng thái nhắc nhở
    }
  };

  const handleNavigateNotification = () => {
    navigate("/notification");
  };

  // --- JSX ---
  return (
    <div className="bg-white min-h-screen font-sans relative flex flex-col">
      {" "}
      {/* Thêm flex-col */}
      {/* Header & Search (Gradient - Sticky) */}
      <div className="sticky top-0 left-0 w-full bg-gradient-to-r from-yellow-400 to-[#F5B100] text-black px-4 pt-6 pb-4 z-10 shadow-md">
        <div className="flex justify-between items-center">
          {/* Phần chọn khu vực và lời chào */}
          <div className="relative flex items-center gap-4">
            {/* Nút chọn khu vực */}
            <button
              onClick={handleSelectLocation}
              className="flex items-center gap-1 text-sm text-gray-800 hover:text-black cursor-pointer flex-shrink-0 opacity-90"
            >
              <MapPin size={16} className="text-gray-700" />
              <span className="font-medium truncate max-w-[150px]">
                {selectedLocation}
              </span>
              <ChevronDown size={16} className="text-gray-600" />
            </button>
            {/* Dropdown khu vực */}
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nút thông báo */}
          <button
            onClick={handleNavigateNotification}
            className="text-gray-800 hover:text-black"
          >
            <Bell size={20} />
          </button>
        </div>
        {/* Thanh tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="mt-4 flex items-center bg-white/90 px-3 py-2 rounded-xl border border-white/50 shadow-sm"
        >
          <input
            className="flex-1 bg-transparent text-gray-800 text-sm placeholder-gray-500 outline-none"
            placeholder="Tìm kiếm tiệm cắt tóc, dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <SlidersHorizontal size={18} className="text-gray-600" />
          </button>
        </form>
      </div>
      {/* Nội dung chính (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[70px]">
        {/* Style ẩn scrollbar */}
        <style>
          {`
            .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            .no-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
            .horizontal-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .horizontal-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          `}
        </style>
        {/* Banner Slider */}
        <div className="px-4 mt-6">
          <Slider {...sliderSettings}>
            {banners.map((banner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`bg-gradient-to-r ${banner.gradient} p-4 rounded-xl text-black shadow-md outline-none focus:outline-none`}
              >
                <p className="text-xs font-semibold">{banner.discount}</p>
                <h2 className="text-lg font-bold mt-1">{banner.title}</h2>
                <p className="text-sm mt-1">{banner.description}</p>
              </motion.div>
            ))}
          </Slider>
        </div>
        {/* Phần "Bạn muốn làm gì hôm nay?" */}
        <div className="mt-8 px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Bạn muốn làm gì hôm nay?
          </h2>
        </div>
        {/* Dịch vụ */}
        <div className="px-4 grid grid-cols-4 gap-4">
          {[
            { icon: <Scissors size={24} />, label: "Cắt" },
            { icon: <Brush size={24} />, label: "Nhuộm" },
            { icon: <ShowerHead size={24} />, label: "Gội đầu" },
            { icon: <Waves size={24} />, label: "Uốn" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 cursor-pointer group"
              // onClick={() => navigate(`/services/${item.label.toLowerCase()}`)} // Điều hướng đến trang dịch vụ
            >
              <div className="bg-[#FFF2D8] text-[#F5B100] p-4 rounded-full shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                {item.icon}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-[#F5B100] transition-colors font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        {/* Lịch hẹn sắp tới */}
        <div className="px-4 mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-gray-800">
              Lịch hẹn sắp tới
            </h3>
            <button
              onClick={() => navigate("/booking")}
              className="text-sm text-[#F5B100] font-semibold hover:underline"
            >
              Tất cả
            </button>
          </div>
          {appointment ? ( // Kiểm tra appointment có tồn tại không
            <AppointmentCard
              appointment={appointment}
              onCancel={handleCancelAppointment}
              onViewDetails={handleViewDetails}
              onToggleReminder={handleToggleReminder}
            />
          ) : (
            <p className="text-center text-gray-500 text-sm py-4 font-medium">
              Bạn chưa có lịch hẹn nào sắp tới.
            </p>
          )}
        </div>
        {/* --- Phần Đang Phổ biến gần vị trí của bạn --- */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 px-4">
            <h3 className="font-bold text-lg text-gray-800">
              Đang phổ biến gần bạn
            </h3>
            <button
              onClick={() => navigate("/discover")}
              className="text-sm text-[#F5B100] font-semibold hover:underline"
            >
              Xem thêm
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 px-4 horizontal-scroll">
            {popularShops.map((shop) => (
              <PopularShopCard key={shop.id} shop={shop} />
            ))}
            {/* Thêm Skeleton Loader khi đang fetch dữ liệu */}
          </div>
        </div>
        {/* --- Phần Best Offers --- */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 px-4">
            <h3 className="font-bold text-lg text-gray-800">Ưu đãi tốt nhất</h3>
            <button
              onClick={() => navigate("/offers")} // Cần tạo trang /offers
              className="text-sm text-[#F5B100] font-semibold hover:underline"
            >
              Xem thêm
            </button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 px-4 horizontal-scroll">
            {bestOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
            {/* Thêm Skeleton Loader khi đang fetch dữ liệu */}
          </div>
        </div>
        {/* Tin tức */}
        <div className="px-4 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Tin tức</h3>
            <button
              onClick={() => navigate("/news")} // Cần tạo trang /news
              className="text-sm text-[#F5B100] font-semibold hover:underline"
            >
              Xem thêm
            </button>
          </div>
          <div className="space-y-4">
            {newsItems.map((news, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm items-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/news/${idx}`)} // Cần tạo trang chi tiết /news/:id
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-200"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm line-clamp-2 text-gray-800">
                    {news.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {news.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{news.date}</p>
                </div>
              </div>
            ))}
            {/* Thêm Skeleton Loader khi đang fetch dữ liệu */}
          </div>
        </div>
        {/* Khoảng trống dưới cùng để không bị che bởi BottomNav */}
        {/* <div className="h-5"></div> */}{" "}
        {/* Không cần nữa vì đã có pb-[70px] */}
      </div>
      {/* Bottom Navigation (Giữ nguyên style gốc) */}
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
        ].map((item) => (
          <div
            key={item.value}
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
            {item.label && (
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </div>
      {/* Responsive tweaks & Slick dots */}
      <style>
        {`
          /* CSS cho slick dots */
          .slick-dots { bottom: 10px; }
          .slick-dots li button:before { font-size: 8px; color: #D1D5DB; opacity: 1; }
          .slick-dots li.slick-active button:before { color: #F5B100; opacity: 1; }

          /* Responsive cơ bản */
          @media (max-width: 320px) {
            .px-4 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .text-lg { font-size: 1rem; }
            .text-sm { font-size: 0.8rem; }
            .text-xs { font-size: 0.7rem; }
            .w-16, .h-16 { width: 3.5rem; height: 3.5rem; }
            .w-20, .h-20 { width: 4rem; height: 4rem; }
            .w-48 { width: 11rem; }
            .w-60 { width: 13rem; }
            .max-w-[150px] { max-width: 100px; } /* Giảm max-width cho màn hình nhỏ */
          }

          @media (min-width: 640px) {
            .px-4 { padding-left: 2rem; padding-right: 2rem; }
            .text-lg { font-size: 1.25rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .w-48 { width: 14rem; }
            .w-60 { width: 16rem; }
          }
        `}
      </style>
    </div>
  );
}
