import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotificationPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: "Xác nhận đặt lịch",
      content: "Lịch hẹn của bạn vào 10:00 ngày 20/04 đã được xác nhận.",
      time: "1 giờ trước",
    },
    {
      id: 2,
      title: "Ưu đãi mới!",
      content: "Giảm 20% cho tất cả dịch vụ trong tuần này.",
      time: "Hôm qua",
    },
    {
      id: 3,
      title: "Lịch hẹn sắp tới",
      content: "Bạn có lịch với Barber Trung lúc 14:00 ngày 22/04.",
      time: "2 ngày trước",
    },
  ];

  return (
    <div className="bg-white min-h-screen px-4 pt-6 pb-20">
      {/* Header với nút quay lại */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/account")} className="text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Thông báo</h1>
      </div>

      {/* Danh sách thông báo */}
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="border-b pb-3">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-600 mt-1">{item.content}</p>
            <p className="text-xs text-gray-400 mt-1">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
