import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Star, Send, ArrowLeft, Image } from "lucide-react";
import babershop from "../assets/images/barber-shop.jpg";
import avatar from "../assets/images/avatar.jpg";
import baberBackground from "../assets/images/barber-background.png";

// Interface cho đánh giá
interface ReviewData {
  rating: number;
  comment: string;
  photos: string[];
}

// Interface cho cửa hàng
interface Shop {
  id: number;
  name: string;
  address: string;
  image: string;
  rating?: number;
  reviews?: number;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // State cho dữ liệu cửa hàng
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // State cho form đánh giá
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Lấy thông tin cửa hàng từ state hoặc ID
  useEffect(() => {
    setLoading(true);

    if (location.state && location.state.shopData) {
      setShop(location.state.shopData);
      setLoading(false);
      return;
    }

    if (id) {
      // Trong ứng dụng thực tế, đây sẽ là API call
      // Ví dụ: fetchShopById(id).then(data => setShop(data))

      // Dữ liệu mẫu
      setTimeout(() => {
        setShop({
          id: parseInt(id),
          name: "Classic Cuts Barber Shop",
          address: "Vinhomes Grand Park Quận 9",
          image: baberBackground,
        });
        setLoading(false);
      }, 500);
    } else {
      // Trường hợp không có ID, quay lại trang trước
      navigate(-1);
    }
  }, [id, location.state, navigate]);

  // Xử lý khi hover lên sao
  const handleStarHover = (hoveredValue: number) => {
    setHoveredRating(hoveredValue);
  };

  // Xử lý khi rời chuột khỏi sao
  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  // Xử lý khi nhấp vào sao để đánh giá
  const handleStarClick = (clickedValue: number) => {
    setRating(clickedValue);
  };

  // Xử lý khi thêm ảnh
  const handleAddPhoto = () => {
    // Trong ứng dụng thực tế, đây sẽ là input file hoặc camera API
    // Tạm thời thêm ảnh mẫu
    if (photos.length < 3) {
      setPhotos([...photos, avatar]);
    }
  };

  // Xử lý khi xóa ảnh
  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  // Xử lý khi gửi đánh giá
  const handleSubmitReview = () => {
    if (rating === 0) {
      alert("Vui lòng đánh giá số sao!");
      return;
    }

    setIsSubmitting(true);

    // Dữ liệu đánh giá để gửi lên server
    const reviewData: ReviewData = {
      rating,
      comment,
      photos,
    };

    console.log("Gửi đánh giá:", reviewData);

    // Giả lập gọi API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Sau khi hiển thị thông báo thành công, chuyển về trang chi tiết
      setTimeout(() => {
        navigate(`/description/${id}`);
      }, 1500);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F5B100] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-500">Không thể tìm thấy thông tin cửa hàng!</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#F5B100] text-white px-4 py-2 rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Cảm ơn bạn đã đánh giá!
          </h2>
          <p className="mt-2 text-gray-600">
            Đánh giá của bạn đã được gửi thành công.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Đánh giá cửa hàng</h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Thông tin cửa hàng */}
        <div className="flex items-center mb-6">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = babershop;
            }}
          />
          <div className="ml-3">
            <h2 className="font-semibold">{shop.name}</h2>
            <p className="text-sm text-gray-500">{shop.address}</p>
          </div>
        </div>

        {/* Đánh giá sao */}
        <div className="mb-6">
          <p className="text-lg font-medium mb-2">
            Đánh giá trải nghiệm của bạn
          </p>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="p-1 focus:outline-none transition-transform transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    (hoveredRating ? star <= hoveredRating : star <= rating)
                      ? "fill-yellow-400 stroke-yellow-500"
                      : "stroke-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm mt-1 text-gray-500">
            {rating > 0
              ? `Bạn đã đánh giá ${rating} sao`
              : "Nhấn vào sao để đánh giá"}
          </p>
        </div>

        {/* Nhập ý kiến */}
        <div className="mb-6">
          <label htmlFor="comment" className="block text-lg font-medium mb-2">
            Chia sẻ trải nghiệm của bạn
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#F5B100]"
            placeholder="Chia sẻ cảm nhận và đánh giá của bạn về tiệm..."
          />
        </div>

        {/* Thêm ảnh */}
        <div className="mb-8">
          <p className="text-lg font-medium mb-2">Thêm hình ảnh (tùy chọn)</p>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddPhoto}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-[#F5B100] hover:border-[#F5B100]"
            >
              <Image size={20} />
              <span className="text-xs mt-1">Thêm ảnh</span>
            </button>

            {photos.map((photo, index) => (
              <div key={index} className="w-20 h-20 rounded-lg relative">
                <img
                  src={photo}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                >
                  <span className="text-xs text-gray-700">×</span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Tối đa 3 ảnh</p>
        </div>
      </div>

      {/* Footer Button */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button
          onClick={handleSubmitReview}
          disabled={isSubmitting || rating === 0}
          className={`w-full py-3 rounded-xl flex items-center justify-center ${
            isSubmitting || rating === 0
              ? "bg-gray-300 text-gray-500"
              : "bg-[#F5B100] text-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Gửi đánh giá
            </>
          )}
        </button>
      </div>
    </div>
  );
}
