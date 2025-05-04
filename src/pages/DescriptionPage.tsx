import {
  MessageCircle,
  Phone,
  MapPin,
  Share2,
  PlusCircle,
  Heart,
  Tag,
  Clock,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import babershop from "../assets/images/barber-shop.jpg";
import avatar from "../assets/images/avatar.jpg";
import baberBackground from "../assets/images/barber-background.png";

interface Specialist {
  name: string;
  role: string;
  image: string;
}

interface Service {
  id?: string;
  name: string;
  price: string;
  priceValue: number; // Giá trị số để tính toán
  duration: string;
  image: string;
  quantity?: number; // Số lượng dịch vụ đã chọn
}

interface CartItem extends Service {
  quantity: number;
}

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
  addedAt?: Date; // Track when shop was added to favorites
}

interface Discount {
  id: string;
  title: string;
  description: string;
  code?: string;
}

interface ServicePackage {
  category: string;
  services: Service[];
}

// Dữ liệu mẫu để hỗ trợ kịch bản mà state không được chuyển đúng
const sampleBarberShops: BarberShop[] = [
  {
    id: 1,
    name: "Classic Cuts Barber Shop",
    address: "Vinhomes Grand Park Quận 9 - Tòa S503",
    rating: 4.8,
    reviews: 3279,
    distance: "5 km",
    image: baberBackground,
    price: 150000,
    services: ["Cắt tóc", "Uốn", "Nhuộm", "Massage"],
    openTime: "07:30",
    closeTime: "21:00",
    district: "Quận 9",
    isVIP: true,
  },
  {
    id: 2,
    name: "4Rau Barbershop",
    address: "Vinhomes Grand Park Quận 9 - Tòa S503.2P HCM",
    rating: 4.5,
    reviews: 1500,
    distance: "3 km",
    image: baberBackground,
    price: 120000,
    services: ["Cắt tóc", "Uốn", "Râu"],
    district: "Quận 9",
  },
  {
    id: 3,
    name: "The Gentlemen's Den",
    address: "634 Điện Biên Phủ, Quận 10, HCM",
    rating: 4.2,
    reviews: 800,
    distance: "7 km",
    image: baberBackground,
    price: 180000,
    district: "Quận 10",
  },
  // Thêm thêm các mẫu tiệm khác nếu cần
];

export default function DescriptionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  console.log(
    "DescriptionPage rendered. ID:",
    id,
    "Location State:",
    location.state
  );

  const [barberShop, setBarberShop] = useState<BarberShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Recommended");

  // Giỏ hàng và popup
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Dữ liệu mẫu cho specialists
  const specialists: Specialist[] = [
    { name: "A. Walker", role: "Sr. Barber", image: avatar },
    { name: "N. Patel", role: "Hair Stylist", image: avatar },
    { name: "B. Cruz", role: "Jr. Barber", image: avatar },
  ];

  // Dữ liệu mẫu cho mã giảm giá
  const discounts: Discount[] = [
    {
      id: "d1",
      title: "Giảm 50%",
      description: "Sử dụng mã FREESHIP50",
      code: "FREESHIP50",
    },
    {
      id: "d2",
      title: "Giảm 60% qua Thẻ",
      description: "Thanh toán qua Momo",
    },
  ];

  // Dữ liệu mẫu cho các gói dịch vụ
  const servicePackages: ServicePackage[] = [
    {
      category: "Recommended",
      services: [
        {
          name: "Cắt tóc tạo kiểu",
          price: "100.000 VNĐ",
          priceValue: 100000,
          duration: "40 phút",
          image: babershop,
        },
        {
          name: "Massage cổ vai gáy",
          price: "150.000 VNĐ",
          priceValue: 150000,
          duration: "20 phút",
          image: avatar,
        },
        {
          name: "Làm sạch thải độc",
          price: "120.000 VNĐ",
          priceValue: 120000,
          duration: "15 phút",
          image: baberBackground,
        },
        {
          name: "Uốn con sâu",
          price: "300.000 VNĐ",
          priceValue: 300000,
          duration: "90 phút",
          image: babershop,
        },
      ],
    },
    {
      category: "Packages",
      services: [
        {
          name: "Gói Combo Cắt + Gội + Sấy",
          price: "180.000 VNĐ",
          priceValue: 180000,
          duration: "60 phút",
          image: babershop,
        },
        {
          name: "Gói VIP Chăm sóc toàn diện",
          price: "500.000 VNĐ",
          priceValue: 500000,
          duration: "120 phút",
          image: avatar,
        },
        {
          name: "Gói Cắt + Uốn/Nhuộm",
          price: "450.000 VNĐ",
          priceValue: 450000,
          duration: "150 phút",
          image: baberBackground,
        },
      ],
    },
    {
      category: "Face Care",
      services: [
        {
          name: "Chăm sóc da mặt cơ bản",
          price: "90.000 VNĐ",
          priceValue: 90000,
          duration: "30 phút",
          image: baberBackground,
        },
        {
          name: "Đắp mặt nạ dưỡng ẩm",
          price: "70.000 VNĐ",
          priceValue: 70000,
          duration: "20 phút",
          image: babershop,
        },
        {
          name: "Lấy mụn + Điện di tinh chất",
          price: "250.000 VNĐ",
          priceValue: 250000,
          duration: "60 phút",
          image: avatar,
        },
      ],
    },
    {
      category: "Hair Color",
      services: [
        {
          name: "Nhuộm màu thời trang",
          price: "350.000 VNĐ",
          priceValue: 350000,
          duration: "90 phút",
          image: avatar,
        },
        {
          name: "Nhuộm phủ bạc",
          price: "200.000 VNĐ",
          priceValue: 200000,
          duration: "60 phút",
          image: babershop,
        },
        {
          name: "Tẩy tóc + Nhuộm",
          price: "600.000 VNĐ",
          priceValue: 600000,
          duration: "180 phút",
          image: baberBackground,
        },
      ],
    },
    {
      category: "Other Services",
      services: [
        {
          name: "Gội đầu thư giãn",
          price: "50.000 VNĐ",
          priceValue: 50000,
          duration: "20 phút",
          image: babershop,
        },
        {
          name: "Cạo râu tạo kiểu",
          price: "80.000 VNĐ",
          priceValue: 80000,
          duration: "25 phút",
          image: avatar,
        },
      ],
    },
  ];

  useEffect(() => {
    console.log("useEffect triggered in DescriptionPage. ID:", id);
    setLoading(true);

    // Trường hợp 1: Dữ liệu từ state navigation (từ DiscoverPage)
    if (location.state && location.state.shopData) {
      console.log("Using data from navigation state:", location.state.shopData);
      setBarberShop(location.state.shopData);

      // Kiểm tra xem tiệm này đã được yêu thích chưa
      checkFavoriteStatus(location.state.shopData.id);

      setLoading(false);
      return;
    }

    // Trường hợp 2: Tìm theo ID
    if (id) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        // Tìm trong dữ liệu mẫu
        const shop = sampleBarberShops.find((s) => s.id === numericId);
        if (shop) {
          console.log("Found shop by ID:", shop);
          setBarberShop(shop);

          // Kiểm tra xem tiệm này đã được yêu thích chưa
          checkFavoriteStatus(numericId);

          setLoading(false);
          return;
        }
      }
    }

    // Trường hợp 3: Fallback - dùng dữ liệu mẫu đầu tiên nếu không có cả hai
    console.log("Using fallback shop data");
    setBarberShop(sampleBarberShops[0]);

    // Kiểm tra xem tiệm này đã được yêu thích chưa
    checkFavoriteStatus(sampleBarberShops[0].id);

    setLoading(false);
  }, [id, location.state]);

  // Kiểm tra xem tiệm này đã được yêu thích chưa
  const checkFavoriteStatus = (shopId: number) => {
    const favoritesJson = localStorage.getItem("barberShopFavorites");
    if (favoritesJson) {
      try {
        const favorites = JSON.parse(favoritesJson);
        const isAlreadyFavorite = favorites.some((shop) => shop.id === shopId);
        setIsFavorite(isAlreadyFavorite);
      } catch (e) {
        console.error("Error parsing favorites from localStorage", e);
        setIsFavorite(false);
      }
    } else {
      setIsFavorite(false);
    }
  };

  // Cập nhật tổng tiền khi giỏ hàng thay đổi
  useEffect(() => {
    const newTotal = cart.reduce((total, item) => {
      return total + item.priceValue * item.quantity;
    }, 0);
    setTotalPrice(newTotal);
  }, [cart]);

  const toggleFavorite = () => {
    if (!barberShop) return;

    // Lấy danh sách yêu thích từ localStorage
    const favoritesJson = localStorage.getItem("barberShopFavorites");
    let favorites: BarberShop[] = [];

    try {
      if (favoritesJson) {
        favorites = JSON.parse(favoritesJson) as BarberShop[];
      }

      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        favorites = favorites.filter((shop) => shop.id !== barberShop.id);
      } else {
        // Thêm vào danh sách yêu thích
        favorites.push({
          ...barberShop,
          addedAt: new Date(),
        });
      }

      // Lưu lại vào localStorage
      localStorage.setItem("barberShopFavorites", JSON.stringify(favorites));

      // Cập nhật trạng thái
      setIsFavorite(!isFavorite);

      // Hiển thị thông báo cho người dùng
      if (!isFavorite) {
        alert("Đã thêm tiệm vào danh sách yêu thích");
      } else {
        alert("Đã xóa tiệm khỏi danh sách yêu thích");
      }
    } catch (e) {
      console.error("Error updating favorites", e);
      alert("Có lỗi xảy ra khi cập nhật danh sách yêu thích");
    }
  };

  const handleBookNow = () => {
    // Chuyển đến trang thanh toán với dữ liệu giỏ hàng
    navigate("/payment", {
      state: {
        cartItems: cart,
        totalPrice: totalPrice,
        shopData: shop,
      },
    });
  };

  const handleProceedToCheckout = () => {
    // Đóng popup và chuyển đến trang thanh toán
    setShowCartPopup(false);
    handleBookNow();
  };

  const handleAddService = (service: Service) => {
    // Tạo bản sao của giỏ hàng hiện tại
    const updatedCart = [...cart];

    // Kiểm tra xem dịch vụ đã có trong giỏ hàng chưa
    const existingItemIndex = updatedCart.findIndex(
      (item) => item.name === service.name
    );

    if (existingItemIndex !== -1) {
      // Nếu đã có, tăng số lượng lên 1
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu chưa có, thêm mới với số lượng = 1
      updatedCart.push({
        ...service,
        quantity: 1,
      });
    }

    // Cập nhật giỏ hàng và hiển thị popup
    setCart(updatedCart);
    setShowCartPopup(true);
  };

  const handleRemoveService = (serviceName: string) => {
    const updatedCart = cart.filter((item) => item.name !== serviceName);
    setCart(updatedCart);

    // Đóng popup nếu không còn dịch vụ nào
    if (updatedCart.length === 0) {
      setShowCartPopup(false);
    }
  };

  const handleUpdateQuantity = (serviceName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Nếu số lượng <= 0, xóa dịch vụ khỏi giỏ hàng
      handleRemoveService(serviceName);
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item.name === serviceName) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F5B100] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin tiệm...</p>
        </div>
      </div>
    );
  }

  // Đảm bảo luôn có dữ liệu để hiển thị
  const shop = barberShop || sampleBarberShops[0];

  // Lấy danh sách dịch vụ theo tab đã chọn
  const currentServices =
    servicePackages.find((pkg) => pkg.category === selectedCategory)
      ?.services || [];

  return (
    <div className="bg-white min-h-screen w-full font-sans relative flex flex-col">
      {/* Phần ảnh header */}
      <div className="relative w-full h-[250px] md:h-[350px] flex-shrink-0">
        <img
          src={shop.image}
          alt={shop.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = baberBackground;
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Nút quay lại */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/80 rounded-full p-2 shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Thông tin tiệm trên ảnh */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <p className="text-xs font-semibold uppercase tracking-wider">
            Dành cho Nam
          </p>
          <h1 className="text-2xl font-bold mt-1">{shop.name}</h1>
          <div className="flex items-center text-sm mt-1 space-x-2">
            <span>{shop.address.split(",")[0]}</span>
            <span>•</span>
            <span>{shop.distance}</span>
            {shop.price && (
              <>
                <span>•</span>
                <span>
                  {shop.price < 150000
                    ? "$"
                    : shop.price < 300000
                    ? "$$"
                    : "$$$"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nút yêu thích */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-4 right-4 z-10 flex flex-col items-center text-white"
        >
          <Heart
            size={24}
            className={`${
              isFavorite
                ? "fill-red-500 stroke-red-500"
                : "fill-white/30 stroke-white"
            } transition-colors`}
          />
          <span className="text-xs mt-1">Yêu thích</span>
        </button>
      </div>

      {/* Phần nội dung có thể cuộn */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
        {/* Các nút hành động */}
        <div className="flex justify-between items-center mt-4 pb-4 border-b border-gray-100">
          <div className="flex space-x-6">
            <button className="flex flex-col items-center text-gray-700 hover:text-[#F5B100]">
              <Phone size={20} />
              <span className="text-xs mt-1">Gọi</span>
            </button>
            <button className="flex flex-col items-center text-gray-700 hover:text-[#F5B100]">
              <MapPin size={20} />
              <span className="text-xs mt-1">Địa chỉ</span>
            </button>
            <button className="flex flex-col items-center text-gray-700 hover:text-[#F5B100]">
              <Share2 size={20} />
              <span className="text-xs mt-1">Chia sẻ</span>
            </button>
          </div>

          {/* Đánh giá */}
          <button
            onClick={() =>
              navigate(`/review/${shop.id}`, { state: { shopData: shop } })
            }
            className="flex flex-col items-center border border-gray-300 rounded-lg px-3 py-1.5 text-center hover:bg-gray-50"
          >
            <span className="flex items-center font-semibold text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="yellow"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-400 mr-1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {shop.rating}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {shop.reviews}+ đánh giá
            </span>
          </button>
        </div>

        {/* Mã giảm giá */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2"
            >
              <Tag size={20} className="text-[#F5B100] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {discount.title}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {discount.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chuyên gia */}
        <div className="mt-6">
          <h2 className="text-lg font-bold">Các chuyên gia</h2>
          <div className="flex justify-between mt-4">
            {specialists.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-16 h-16 rounded-full object-cover"
                  loading="lazy"
                />
                <p className="text-sm font-medium mt-2">{s.name}</p>
                <p className="text-xs text-gray-500">{s.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs dịch vụ */}
        <div className="mt-6 sticky top-0 bg-white py-2 z-10 overflow-x-auto no-scrollbar border-b border-gray-100">
          <div className="flex space-x-3">
            {servicePackages.map((pkg) => (
              <button
                key={pkg.category}
                onClick={() => setSelectedCategory(pkg.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  selectedCategory === pkg.category
                    ? "bg-amber-100 text-[#F5B100]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {pkg.category}
              </button>
            ))}
            <button className="p-2 bg-gray-100 rounded-full ml-auto flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Danh sách dịch vụ */}
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-3">
            {selectedCategory} ({currentServices.length})
          </h2>
          <div className="space-y-4">
            {currentServices.map((service, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-200"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = babershop;
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{service.name}</p>
                  <p className="text-sm text-gray-700 mt-1">{service.price}</p>
                  {service.duration && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1" /> {service.duration}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAddService(service)}
                  className="border border-amber-300 text-[#F5B100] rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-amber-50 flex items-center"
                >
                  Chọn <PlusCircle size={16} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Khoảng trống dưới */}
        <div className="h-10" />
      </div>

      {/* Nút Đặt lịch cố định ở dưới */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3 border-t border-gray-200 z-20">
        <button
          onClick={handleBookNow}
          className={`w-full max-w-md mx-auto py-3 ${
            cart.length === 0
              ? "bg-gray-300 text-gray-600"
              : "bg-[#F5B100] text-white"
          } rounded-xl text-base font-semibold hover:bg-[#e5a700] transition-colors`}
          disabled={cart.length === 0}
        >
          {cart.length === 0 ? "Vui lòng chọn dịch vụ" : "Đặt lịch ngay"}
        </button>
      </div>

      {/* Popup giỏ hàng */}
      {showCartPopup && (
        <div className="fixed bottom-0 inset-x-0 z-30">
          {/* Overlay nền mờ */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowCartPopup(false)}
          ></div>

          {/* Nội dung popup */}
          <div className="bg-white rounded-t-2xl relative z-40 px-4 pb-8 pt-5 shadow-xl transform translate-y-0 transition-transform max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-xl font-bold">Giỏ hàng của bạn</h3>
              <button
                onClick={() => setShowCartPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Danh sách dịch vụ đã chọn */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 pb-3 border-b border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = babershop;
                    }}
                  />

                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-[#F5B100] text-sm">{item.price}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock size={10} className="mr-1" /> {item.duration}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Nút giảm số lượng */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.name, item.quantity - 1)
                      }
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500"
                    >
                      -
                    </button>

                    {/* Số lượng */}
                    <span className="w-5 text-center font-medium">
                      {item.quantity}
                    </span>

                    {/* Nút tăng số lượng */}
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.name, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded-full border border-[#F5B100] flex items-center justify-center text-[#F5B100]"
                    >
                      +
                    </button>
                  </div>

                  {/* Nút xóa */}
                  <button
                    onClick={() => handleRemoveService(item.name)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Tổng tiền và nút thanh toán */}
            <div className="bg-white pt-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền:</p>
                  <p className="text-xl font-bold">
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center bg-[#F5B100] rounded-full w-7 h-7 text-white text-sm mr-2">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-[#F5B100] text-white rounded-xl font-medium hover:bg-[#e5a700] transition-colors flex items-center justify-center"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS để ẩn thanh cuộn */}
      <style>
        {`
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
    </div>
  );
}
