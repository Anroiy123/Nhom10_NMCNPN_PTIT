import {
  Search,
  Filter,
  Scissors,
  Compass,
  Home,
  MessageCircle,
  User,
  Star,
  MapPin, // Import MapPin icon
  ChevronDown, // Import ChevronDown icon
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import babershop from "../assets/images/barber-shop.jpg"; // Giữ lại ảnh mẫu

// --- Interfaces ---
interface BarberShop {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  // area?: string; // Có thể thêm để lọc theo khu vực
}

// --- BarberShopCard Component (Tách riêng) ---
interface BarberShopCardProps {
  shop: BarberShop;
}

const BarberShopCard: React.FC<BarberShopCardProps> = ({ shop }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Truyền dữ liệu shop qua state khi điều hướng
    navigate(`/description/${shop.id}`, { state: { shopData: shop } });
  };

  return (
    <div
      onClick={handleViewDetails}
      className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-100 shadow-sm"
    >
      <img
        src={shop.image}
        alt={shop.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-200"
        loading="lazy"
        onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{shop.name}</p>
        <p className="text-xs text-gray-500 truncate">{shop.address}</p>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
          <span className="flex items-center text-yellow-500">
            <Star size={14} className="fill-yellow-500 mr-0.5" />
            {shop.rating}
          </span>
          <span>({shop.reviews} đánh giá)</span>
          <span>• {shop.distance}</span>
        </div>
      </div>
    </div>
  );
};

// --- DiscoverPage Component ---
export default function DiscoverPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<"distance" | "rating" | "">("");
  const [barberShops, setBarberShops] = useState<BarberShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("TP. Hồ Chí Minh");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Danh sách khu vực
  const locations = ["TP. Hồ Chí Minh", "Đà Nẵng", "Hà Nội"];

  // --- Dữ liệu mẫu ---
  const initialBarberShops: BarberShop[] = [
    // TP. Hồ Chí Minh
    {
      id: 1,
      name: "Classic Cuts Barber Shop",
      address: "Vinhomes Grand Park Quận 9 - Tòa S503",
      rating: 4.8,
      reviews: 3279,
      distance: "5 km",
      image: babershop,
    },
    {
      id: 2,
      name: "4Rau Barbershop",
      address: "Vinhomes Grand Park Quận 9 - Tòa S503.2P HCM",
      rating: 4.5,
      reviews: 1500,
      distance: "3 km",
      image: babershop,
    },
    {
      id: 3,
      name: "The Gentlemen's Den",
      address: "634 Điện Biên Phủ, Quận 10, HCM",
      rating: 4.2,
      reviews: 800,
      distance: "7 km",
      image: babershop,
    },
    {
      id: 4,
      name: "Urban Trim Studio",
      address: "123 Nguyễn Huệ, Quận 1, HCM",
      rating: 4.7,
      reviews: 2100,
      distance: "2 km",
      image: babershop,
    },
    {
      id: 5,
      name: "Sharp Edge Salon",
      address: "45 Lê Lợi, Quận 3, HCM",
      rating: 4.3,
      reviews: 950,
      distance: "4 km",
      image: babershop,
    },
    {
      id: 6,
      name: "Modern Man Barbershop",
      address: "78 Phạm Văn Đồng, Thủ Đức, HCM",
      rating: 4.6,
      reviews: 1800,
      distance: "6 km",
      image: babershop,
    },
    {
      id: 7,
      name: "Elite Cuts",
      address: "12 Nguyễn Trãi, Quận 5, HCM",
      rating: 4.4,
      reviews: 1200,
      distance: "8 km",
      image: babershop,
    },
    {
      id: 8,
      name: "tralale tralala",
      address: "90 Cách Mạng Tháng Tám, Quận Tân Bình, HCM",
      rating: 4.9,
      reviews: 3500,
      distance: "9 km",
      image: babershop,
    },
    {
      id: 9,
      name: "bombadilo crocodilo",
      address: "90 Cách Mạng Tháng Tám, Quận Tân Bình, HCM",
      rating: 5.0,
      reviews: 3500,
      distance: "9.5 km",
      image: babershop,
    },
    {
      id: 10,
      name: "Tung tung tung sahur",
      address: "90 Cách Mạng Tháng Tám, Quận Tân Bình, HCM",
      rating: 4.7,
      reviews: 3500,
      distance: "12 km",
      image: babershop,
    },
    // Đà Nẵng
    {
      id: 101,
      name: "Danang Barber House",
      address: "12 Bạch Đằng, Hải Châu, Đà Nẵng",
      rating: 4.6,
      reviews: 900,
      distance: "1.2 km",
      image: babershop,
    },
    {
      id: 102,
      name: "Chic Cuts Đà Nẵng",
      address: "45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng",
      rating: 4.8,
      reviews: 1200,
      distance: "2.5 km",
      image: babershop,
    },
    {
      id: 103,
      name: "Men's Style DN",
      address: "88 Lê Duẩn, Hải Châu, Đà Nẵng",
      rating: 4.7,
      reviews: 1100,
      distance: "3.1 km",
      image: babershop,
    },
    // Hà Nội
    {
      id: 201,
      name: "Hanoi Gentlemen's Club",
      address: "10 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
      rating: 4.9,
      reviews: 2000,
      distance: "1.5 km",
      image: babershop,
    },
    {
      id: 202,
      name: "Old Quarter Barbershop",
      address: "22 Hàng Bông, Hoàn Kiếm, Hà Nội",
      rating: 4.8,
      reviews: 1800,
      distance: "2.0 km",
      image: babershop,
    },
    {
      id: 203,
      name: "Capital Cuts",
      address: "55 Kim Mã, Ba Đình, Hà Nội",
      rating: 4.7,
      reviews: 1500,
      distance: "3.2 km",
      image: babershop,
    },
    {
      id: 204,
      name: "Westlake Barber",
      address: "99 Xuân Diệu, Tây Hồ, Hà Nội",
      rating: 4.6,
      reviews: 1300,
      distance: "4.5 km",
      image: babershop,
    },
    {
      id: 205,
      name: "Trendy Hair HN",
      address: "77 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      rating: 4.8,
      reviews: 1700,
      distance: "5.0 km",
      image: babershop,
    },
  ];

  // --- Data Fetching Simulation ---
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Lọc dữ liệu mẫu theo khu vực
        let filteredByLocation: BarberShop[] = [];
        if (selectedLocation === "TP. Hồ Chí Minh") {
          filteredByLocation = initialBarberShops.filter(
            (shop) => shop.id >= 1 && shop.id <= 10
          );
        } else if (selectedLocation === "Đà Nẵng") {
          filteredByLocation = initialBarberShops.filter(
            (shop) => shop.id >= 101 && shop.id <= 103
          );
        } else if (selectedLocation === "Hà Nội") {
          filteredByLocation = initialBarberShops.filter(
            (shop) => shop.id >= 201 && shop.id <= 205
          );
        }
        setBarberShops(filteredByLocation);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setBarberShops([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShops();
  }, [selectedLocation]); // Fetch lại khi khu vực thay đổi

  // --- Debounce Search Input ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // --- Filtering and Sorting ---
  const filteredAndSortedShops = useMemo(() => {
    const parseDistance = (distanceStr: string): number => {
      const num = parseFloat(distanceStr.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? Infinity : num;
    };

    return barberShops
      .filter(
        (shop) =>
          shop.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          shop.address.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (filter === "distance") {
          return parseDistance(a.distance) - parseDistance(b.distance);
        } else if (filter === "rating") {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.reviews - a.reviews;
        }
        return 0;
      });
  }, [barberShops, debouncedQuery, filter]); // Không cần selectedLocation ở đây vì đã lọc ở fetch

  // --- Handlers ---
  const handleFilter = (type: "distance" | "rating") => {
    setFilter((currentFilter) => (currentFilter === type ? "" : type));
  };

  const handleAdvancedFilterClick = () => {
    alert("Chức năng lọc nâng cao đang được phát triển!");
  };

  const handleSelectLocation = () => {
    setShowLocationDropdown((prev) => !prev);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    setFilter("");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  // --- JSX ---
  return (
    <div className="bg-white min-h-screen font-sans relative flex flex-col">
      {/* Header (Sticky) */}
      <div className="sticky top-0 left-0 w-full bg-white px-4 pt-6 pb-4 z-10 border-b border-gray-100">
        {/* Dòng Chọn khu vực và Tiêu đề */}
        <div className="flex items-center gap-4 mb-4 relative">
          {/* Phần chọn khu vực (Bên trái) */}
          <button
            onClick={handleSelectLocation}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer flex-shrink-0"
          >
            <MapPin size={16} className="text-gray-500" />
            <span className="font-medium truncate max-w-[120px]">
              {selectedLocation}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          {showLocationDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`block px-4 py-2 text-sm text-left w-full hover:bg-gray-100 ${
                    location === selectedLocation ? "font-semibold" : ""
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <Search size={20} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm tiệm cắt tóc, địa chỉ..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleFilter("distance")}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors duration-150 ${
              filter === "distance"
                ? "bg-[#F5B100] text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Gần nhất
          </button>
          <button
            onClick={() => handleFilter("rating")}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors duration-150 ${
              filter === "rating"
                ? "bg-[#F5B100] text-white font-semibold"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đánh giá cao
          </button>
          <button
            onClick={handleAdvancedFilterClick}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
          >
            <Filter size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[70px]">
        <style>
          {`
            .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
            .no-scrollbar::-webkit-scrollbar { display: none; width: 0; height: 0; }
          `}
        </style>
        <div className="px-4 pt-4">
          {/* Loading State */}
          {isLoading && (
            <p className="mt-6 text-sm text-gray-500 text-center">
              Đang tải danh sách tiệm tại {selectedLocation}...
            </p>
          )}
          {/* Error State */}
          {!isLoading && error && (
            <p className="mt-6 text-sm text-red-500 text-center">
              Lỗi: {error}. Vui lòng thử lại sau.
            </p>
          )}
          {/* Content */}
          {!isLoading && !error && (
            <>
              <h2 className="text-base font-semibold text-gray-800 mb-3">
                {debouncedQuery
                  ? `Kết quả cho "${debouncedQuery}" tại ${selectedLocation}`
                  : `Danh sách tiệm tại ${selectedLocation}`}{" "}
                ({filteredAndSortedShops.length})
              </h2>
              {filteredAndSortedShops.length > 0 ? (
                <div className="space-y-3">
                  {filteredAndSortedShops.map((shop) => (
                    <BarberShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500 text-center">
                  Không tìm thấy tiệm nào phù hợp tại khu vực này với tìm kiếm
                  và bộ lọc của bạn.
                </p>
              )}
            </>
          )}
        </div>
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

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 320px) {
            .px-4 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .text-lg { font-size: 1rem; }
            .text-base { font-size: 0.9rem; }
            .text-sm { font-size: 0.8rem; }
            .text-xs { font-size: 0.7rem; }
            .w-16, .h-16 { width: 3.5rem; height: 3.5rem; }
            .max-w-[120px] { max-width: 80px; } /* Giảm max-width cho màn hình nhỏ */
          }

          @media (min-width: 640px) {
            .px-4 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .text-lg { font-size: 1.25rem; }
            .text-base { font-size: 1.1rem; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
          }
        `}
      </style>
    </div>
  );
}
