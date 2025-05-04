import {
  Heart,
  CreditCard,
  MapPin,
  Bell,
  Briefcase,
  Info,
  LogOut,
  Scissors,
  Compass,
  Home,
  MessageCircle,
  User,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import avatar from "../assets/images/avatar.jpg";

// Interface for favorite salon
interface FavoriteSalon {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  addedAt: Date;
}

// UserProfile Component - Hiển thị thông tin người dùng
const UserProfile = ({ user, onEdit }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-200">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.name);
            }}
          />
        </div>
        <div>
          <h1 className="text-lg font-bold">{user.name}</h1>
          <p className="text-xs text-gray-500">
            {user.phone} • {user.email}
          </p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-[#F5B100] text-sm font-medium flex items-center"
      >
        <Settings size={16} className="mr-1" /> Sửa
      </button>
    </div>
  );
};

// MenuItem Component - Hiển thị từng mục trong menu
const MenuItem = ({
  icon,
  label,
  description,
  onClick,
  hasBadge = false,
  badgeCount = 0,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-700">
          {hasBadge ? (
            <div className="relative">
              {icon}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full px-1">
                {badgeCount}
              </span>
            </div>
          ) : (
            icon
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
};

// BottomNavigation Component - Thanh điều hướng dưới
const BottomNavigation = ({ currentPath, onNavigate }) => {
  const navItems = [
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
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between z-10">
      {navItems.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onNavigate(item.path)}
          className={`flex flex-col items-center cursor-pointer transition-colors ${
            item.value === "book"
              ? "bg-black text-white p-3 rounded-full transform hover:scale-105"
              : item.path === currentPath
              ? "text-[#F5B100] font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {item.icon}
          {item.label && <span className="text-xs mt-1">{item.label}</span>}
        </div>
      ))}
    </div>
  );
};

// EditProfileModal Component - Modal chỉnh sửa hồ sơ
const EditProfileModal = ({ user, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5 animate-fade-in">
        <h2 className="text-lg font-bold mb-4">Chỉnh sửa hồ sơ</h2>
        <div className="mb-4 flex justify-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#F5B100] mb-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Họ tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B100]"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B100]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#F5B100]"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave({ name, phone, email })}
            className="flex-1 py-2 bg-[#F5B100] text-white rounded-lg"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

// FavoriteSalonsModal Component - Hiển thị danh sách salon yêu thích
const FavoriteSalonsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [favoriteSalons, setFavoriteSalons] = useState<FavoriteSalon[]>([]);

  // Lấy danh sách yêu thích từ localStorage khi mở modal
  useEffect(() => {
    if (isOpen) {
      const favoritesJson = localStorage.getItem("barberShopFavorites");
      if (favoritesJson) {
        try {
          const favorites = JSON.parse(favoritesJson);
          // Sắp xếp theo thời gian thêm mới nhất
          favorites.sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
          setFavoriteSalons(favorites);
        } catch (e) {
          console.error("Error parsing favorites from localStorage", e);
          setFavoriteSalons([]);
        }
      } else {
        setFavoriteSalons([]);
      }
    }
  }, [isOpen]);

  // Xóa salon khỏi danh sách yêu thích
  const handleRemoveFavorite = (salonId: number) => {
    // Lấy danh sách yêu thích hiện tại
    const updatedFavorites = favoriteSalons.filter(
      (salon) => salon.id !== salonId
    );

    // Cập nhật state
    setFavoriteSalons(updatedFavorites);

    // Lưu lại vào localStorage
    localStorage.setItem(
      "barberShopFavorites",
      JSON.stringify(updatedFavorites)
    );
  };

  // Chuyển đến trang chi tiết của salon
  const handleViewSalon = (salon: FavoriteSalon) => {
    navigate(`/description/${salon.id}`, { state: { shopData: salon } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5 animate-fade-in max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Salon yêu thích</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {favoriteSalons.length > 0 ? (
          <div className="overflow-y-auto flex-1">
            <div className="space-y-3">
              {favoriteSalons.map((salon) => (
                <div
                  key={salon.id}
                  className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-200"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placeholder.pics/svg/80x80/DEDEDE/555555/Salon";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {salon.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1 truncate">
                      {salon.address}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="flex items-center text-yellow-500 text-xs whitespace-nowrap">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="yellow"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="mr-0.5"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {salon.rating}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        ({salon.reviews})
                      </span>
                      <span className="mx-1 text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {salon.distance}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewSalon(salon)}
                      className="p-2 bg-[#F5B100] text-white rounded-lg text-xs hover:bg-[#e5a700] transition-colors w-16 text-center"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(salon.id)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-100 transition-colors w-16 text-center"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">Chưa có salon yêu thích nào</p>
            <p className="text-xs text-gray-400 mt-1">
              Nhấn vào biểu tượng trái tim ở trang chi tiết salon để thêm vào
              danh sách yêu thích
            </p>
            <button
              onClick={() => {
                navigate("/discover");
                onClose();
              }}
              className="mt-4 px-4 py-2 bg-[#F5B100] text-white rounded-lg text-sm hover:bg-[#e5a700] transition-colors"
            >
              Khám phá các salon
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          .overflow-y-auto {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .overflow-y-auto::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
    </div>
  );
};

// HelpModal Component - Hiển thị thông tin trợ giúp
const HelpModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    {
      q: "Làm thế nào để đặt lịch cắt tóc?",
      a: "Bạn chọn salon, chọn dịch vụ, chọn thời gian và nhấn Đặt lịch ngay trên ứng dụng.",
    },
    {
      q: "Tôi có thể huỷ lịch đã đặt không?",
      a: "Bạn có thể huỷ lịch trong mục Lịch hẹn của tôi trước giờ hẹn.",
    },
    {
      q: "Làm sao để thêm salon vào danh sách yêu thích?",
      a: "Nhấn vào biểu tượng trái tim ở trang chi tiết salon để thêm vào danh sách yêu thích.",
    },
    {
      q: "Tôi có thể chỉnh sửa thông tin tài khoản không?",
      a: "Bạn có thể chỉnh sửa thông tin cá nhân trong mục Thông tin tài khoản.",
    },
    {
      q: "Tôi quên mật khẩu, phải làm sao?",
      a: "Bạn hãy sử dụng chức năng Quên mật khẩu trên màn hình đăng nhập để lấy lại mật khẩu.",
    },
  ];
  const filteredFaqs = faqs.filter((faq) =>
    faq.q.toLowerCase().includes(search.toLowerCase())
  );
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[95vh] flex flex-col animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
          <button onClick={onClose} className="p-2 -ml-2">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="flex-1 text-center font-bold text-lg">
            Trợ giúp & Hỗ trợ
          </div>
          <button onClick={onClose} className="p-2 -mr-2">
            <X size={24} />
          </button>
        </div>
        {/* Search bar */}
        <div className="px-4 pt-3 pb-1 bg-white">
          <input
            className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-[#F5B100] bg-gray-50 text-sm"
            placeholder="Tìm kiếm câu hỏi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* FAQ */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="font-semibold text-gray-800 text-base mt-2 mb-2">
            Câu hỏi thường gặp
          </div>
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100"
                >
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 text-left text-[15px] font-medium text-gray-900 focus:outline-none"
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${
                        openIdx === idx ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {openIdx === idx && (
                    <div className="px-4 pb-3 text-sm text-gray-600 border-t bg-gray-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-8">
                Không tìm thấy câu hỏi phù hợp.
              </div>
            )}
          </div>
          {/* Liên hệ hỗ trợ */}
          <div className="mt-7">
            <div className="font-semibold text-gray-800 mb-2">
              Liên hệ hỗ trợ
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#F5B100]">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <span className="font-medium">Hotline:</span>
                <a
                  href="tel:19001234"
                  className="text-[#F5B100] font-semibold ml-1"
                >
                  1900 1234
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#F5B100]">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span className="font-medium">Email:</span>
                <a
                  href="mailto:support@ptit-auto.com"
                  className="text-[#F5B100] font-semibold ml-1"
                >
                  support@ptit-auto.com
                </a>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFF3E0] text-[#F5B100] font-semibold text-base border border-[#FFE0B2] hover:bg-[#FFE0B2] transition">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#F5B100"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2 2 2h4a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
                Gửi tin nhắn hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProfileInfoModal Component - Hiển thị thông tin tài khoản
const ProfileInfoModal = ({ isOpen, onClose, user, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    address: user.address || "97 Man Thiện, Lê Văn Việt, TP.HCM",
    gender: user.gender || "Nam",
  });

  useEffect(() => {
    setForm({
      name: user.name,
      phone: user.phone,
      address: user.address || "97 Man Thiện, Lê Văn Việt, TP.HCM",
      gender: user.gender || "Nam",
    });
  }, [user, isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-5 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Thông tin tài khoản</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(form);
              setEditMode(false);
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F5B100]">
                <img
                  src={avatar}
                  alt={form.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <input
                  className="font-bold text-lg border-b border-gray-200 focus:border-[#F5B100] outline-none"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <select
                  className="text-sm text-gray-500 mt-1 border-b border-gray-200 focus:border-[#F5B100] outline-none"
                  value={form.gender}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value }))
                  }
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">
                Số điện thoại
              </div>
              <input
                className="text-base border-b border-gray-200 focus:border-[#F5B100] outline-none w-full"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">
                Địa chỉ
              </div>
              <input
                className="text-base border-b border-gray-200 focus:border-[#F5B100] outline-none w-full"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-[#F5B100] text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F5B100]">
                <img
                  src={avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {user.gender || "Nam"}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">
                Số điện thoại
              </div>
              <div className="text-base">{user.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 font-medium mb-1">
                Địa chỉ
              </div>
              <div className="text-base">
                {user.address || "97 Man Thiện, Lê Văn Việt, TP.HCM"}
              </div>
            </div>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 py-2 bg-[#F5B100] text-white rounded-lg w-full"
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component chính AccountPage
export default function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFavoriteSalons, setShowFavoriteSalons] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Khởi tạo user từ localStorage hoặc sử dụng dữ liệu mặc định
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("barberShopUser");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Trần Hùng",
          phone: "033351059",
          email: "HungDeptrai@gmail.com",
          avatar: avatar,
          address: "97 Man Thiện, Lê Văn Việt, TP.HCM",
          gender: "Nam",
        };
  });

  const menuItems = [
    {
      icon: <Heart size={20} />,
      label: "Salon yêu thích",
      description: "Đặt lại dịch vụ yêu thích chỉ với một cú nhấp chuột",
      path: "#favorite",
      hasBadge: false,
    },
    {
      icon: <User size={20} />,
      label: "Thông tin tài khoản",
      description: "Xem và chỉnh sửa thông tin cá nhân",
      path: "#profile-info",
      hasBadge: false,
    },
    {
      icon: <Bell size={20} />,
      label: "Thông báo",
      path: "/notification",
      hasBadge: true,
      badgeCount: 3,
    },
    {
      icon: <Info size={20} />,
      label: "Trợ giúp",
      description: "Câu hỏi thường gặp, liên hệ hỗ trợ",
      path: "#help",
      hasBadge: false,
    },
    {
      icon: <Briefcase size={20} />,
      label: "Đăng ký làm cộng tác",
      description: "Bạn muốn liệt kê dịch vụ của mình? Đăng ký với chúng tôi",
      path: "#partner",
      hasBadge: false,
    },
    {
      icon: <LogOut size={20} />,
      label: "Đăng xuất",
      path: "/",
      hasBadge: false,
    },
  ];

  // Lưu thông tin người dùng vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("barberShopUser", JSON.stringify(user));
  }, [user]);

  const handleMenuClick = (path: string) => {
    if (path === "#favorite") {
      // Hiển thị modal salon yêu thích
      setShowFavoriteSalons(true);
    } else if (path === "#profile-info") {
      setShowProfileInfo(true);
    } else if (path === "#help") {
      setShowHelp(true);
    } else if (path.startsWith("#")) {
      // Hiển thị thông báo nâng cấp cho các tính năng chưa triển khai
      alert(`Tính năng \"${path.substring(1)}\" sẽ sớm được cập nhật!`);
    } else {
      navigate(path);
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = (updatedUser) => {
    setUser({ ...user, ...updatedUser });
    setShowEditProfile(false);
  };

  return (
    <div className="bg-white min-h-screen font-sans relative">
      {/* Header (Cố định) */}
      <div className="fixed top-0 left-0 w-full bg-white px-4 pt-6 pb-4 z-10 shadow-sm">
        <UserProfile user={user} onEdit={handleEditProfile} />
      </div>

      {/* Nội dung (Danh sách tùy chọn, có thể cuộn) */}
      <div
        className="pt-[90px] pb-[70px] min-h-screen overflow-y-auto"
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

        {/* Danh sách tùy chọn */}
        <div className="px-4 mt-4 space-y-1">
          {menuItems.map((item, idx) => (
            <MenuItem
              key={idx}
              icon={item.icon}
              label={item.label}
              description={item.description}
              onClick={() => handleMenuClick(item.path)}
              hasBadge={item.hasBadge}
              badgeCount={item.badgeCount}
            />
          ))}
        </div>

        {/* Thông tin phần mềm */}
        <div className="mt-8 px-4 text-center">
          <p className="text-xs text-gray-400">Phiên bản 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">
            © 2025 Book Barber. Đã đăng ký Bản quyền.
          </p>
        </div>
      </div>

      {/* Thanh điều hướng dưới */}
      <BottomNavigation currentPath={location.pathname} onNavigate={navigate} />

      {/* Modal chỉnh sửa hồ sơ */}
      <EditProfileModal
        user={user}
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
      />

      {/* Modal danh sách salon yêu thích */}
      <FavoriteSalonsModal
        isOpen={showFavoriteSalons}
        onClose={() => setShowFavoriteSalons(false)}
      />

      {/* Modal thông tin tài khoản */}
      <ProfileInfoModal
        isOpen={showProfileInfo}
        onClose={() => setShowProfileInfo(false)}
        user={user}
        onSave={(updated) => setUser((u) => ({ ...u, ...updated }))}
      />

      {/* Modal trợ giúp */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Media Queries để cải thiện responsive */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          @media (max-width: 320px) {
            .px-4 {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            .text-lg {
              font-size: 0.875rem;
            }
            .text-sm {
              font-size: 0.75rem;
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
          }
        `}
      </style>
    </div>
  );
}
