import {
  Send,
  Scissors,
  Compass,
  Home,
  MessageCircle,
  User,
  ChevronLeft,
  Mic,
  Image,
  Phone,
  Video,
  MoreVertical,
  Search,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import avatar from "../assets/images/avatar.jpg";

interface Message {
  text: string;
  time: string;
  isSentByUser: boolean;
  type: "text" | "voice" | "image";
  voiceDuration?: string;
  imageUrl?: string;
  status: "sent" | "delivered" | "read";
}

interface ChatGroup {
  id: number;
  name: string;
  avatar?: string;
  online: boolean;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  messages: Message[];
  isTyping?: boolean;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([
    {
      id: 1,
      name: "Classic Cuts Barber Shop",
      avatar: avatar,
      online: true,
      unreadCount: 0,
      lastMessage: "Cảm ơn bạn đã thông cảm nhé!",
      lastMessageTime: "16:47",
      messages: [
        {
          text: "Bạn ơi, mình đã đặt lịch hẹn vào hôm nay lúc 16:00. Bạn có thể đến sớm hơn không?",
          time: "16:40",
          isSentByUser: false,
          type: "text",
          status: "read",
        },
        {
          text: "Tất nhiên là được chứ ạ! Mình sẽ đến lúc 15:30.",
          time: "16:46",
          isSentByUser: true,
          type: "text",
          status: "read",
        },
        {
          text: "Cảm ơn bạn đã thông cảm nhé! Tôi sẽ áp dụng mã giảm giá cho bạn.",
          time: "16:47",
          isSentByUser: false,
          type: "text",
          status: "read",
        },
      ],
    },
    {
      id: 2,
      name: "Barber Bros",
      avatar: avatar,
      online: false,
      unreadCount: 2,
      lastMessage: "Bạn ơi, lịch tôi hẹn vào chiều thứ 7...",
      lastMessageTime: "11:30",
      messages: [
        {
          text: "Bạn ơi, lịch tôi hẹn vào chiều thứ 7 có thể hoãn lại không? Mình có việc bận.",
          time: "11:30",
          isSentByUser: true,
          type: "text",
          status: "delivered",
        },
        {
          text: "Xin lỗi vì đã trả lời muộn. Vâng, chúng tôi có thể sắp xếp lại lịch cho bạn.",
          time: "14:15",
          isSentByUser: false,
          type: "text",
          status: "delivered",
        },
        {
          text: "Bạn muốn chuyển sang thứ mấy ạ?",
          time: "14:16",
          isSentByUser: false,
          type: "text",
          status: "delivered",
        },
      ],
      isTyping: true,
    },
    {
      id: 3,
      name: "4Rau Barbershop",
      avatar: avatar,
      online: true,
      unreadCount: 0,
      lastMessage: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
      lastMessageTime: "Hôm qua",
      messages: [
        {
          text: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
          time: "10:30",
          isSentByUser: false,
          type: "text",
          status: "read",
        },
        {
          text: "Cửa hàng các bạn có dịch vụ nhuộm tóc không?",
          time: "10:35",
          isSentByUser: true,
          type: "text",
          status: "read",
        },
        {
          text: "Dạ có ạ. Bạn có thể đặt lịch trực tiếp trên app hoặc gọi cho chúng tôi nhé!",
          time: "10:40",
          isSentByUser: false,
          type: "text",
          status: "read",
        },
        {
          text: "Cảm ơn bạn nhiều!",
          time: "10:42",
          isSentByUser: true,
          type: "text",
          status: "read",
        },
        {
          text: "Ngoài ra, tôi gửi bạn một số mẫu tóc phổ biến tại cửa hàng chúng tôi:",
          time: "10:45",
          isSentByUser: false,
          type: "text",
          status: "read",
        },
        {
          imageUrl: "/src/assets/images/mullet.jpg",
          time: "10:46",
          isSentByUser: false,
          type: "image",
          text: "Kiểu tóc Mullet",
          status: "read",
        },
        {
          imageUrl: "/src/assets/images/SlickBack.jpg",
          time: "10:47",
          isSentByUser: false,
          type: "image",
          text: "Kiểu tóc Slick Back",
          status: "read",
        },
      ],
    },
  ]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (selectedChatId && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId, chatGroups]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && selectedChatId !== null) {
      const newMessage: Message = {
        text: inputMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSentByUser: true,
        type: "text",
        status: "sent",
      };

      setChatGroups((prev) =>
        prev.map((group) =>
          group.id === selectedChatId
            ? {
                ...group,
                messages: [...group.messages, newMessage],
                lastMessage: inputMessage,
                lastMessageTime: newMessage.time,
              }
            : group
        )
      );

      setInputMessage("");

      // Giả lập tin nhắn trả lời sau 1-3 giây
      if (Math.random() > 0.3) {
        setTimeout(() => {
          const responses = [
            "Vâng, tôi hiểu rồi!",
            "Cảm ơn bạn đã liên hệ!",
            "Chúng tôi sẽ xem xét yêu cầu của bạn.",
            "Bạn có thể đến cửa hàng vào giờ đã hẹn nhé!",
            "Chúng tôi rất vui được phục vụ bạn!",
          ];

          const autoReply: Message = {
            text: responses[Math.floor(Math.random() * responses.length)],
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isSentByUser: false,
            type: "text",
            status: "read",
          };

          setChatGroups((prev) =>
            prev.map((group) =>
              group.id === selectedChatId
                ? {
                    ...group,
                    messages: [...group.messages, autoReply],
                    lastMessage: autoReply.text,
                    lastMessageTime: autoReply.time,
                  }
                : group
            )
          );
        }, Math.random() * 2000 + 1000);
      }
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Giả lập ghi âm trong 3 giây
    setTimeout(() => {
      setIsRecording(false);
      if (selectedChatId !== null) {
        const voiceMessage: Message = {
          text: "",
          voiceDuration: "0:03",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSentByUser: true,
          type: "voice",
          status: "sent",
        };

        setChatGroups((prev) =>
          prev.map((group) =>
            group.id === selectedChatId
              ? {
                  ...group,
                  messages: [...group.messages, voiceMessage],
                  lastMessage: "Tin nhắn thoại (0:03)",
                  lastMessageTime: voiceMessage.time,
                }
              : group
          )
        );
      }
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleBack = () => {
    setSelectedChatId(null);
    setShowSearch(false);
  };

  const selectedChat = chatGroups.find((chat) => chat.id === selectedChatId);

  // Lọc chat theo từ khóa tìm kiếm
  const filteredChats = chatGroups.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Format message time
  const formatMessageTime = (time: string): string => {
    if (time.includes("Hôm qua") || time.includes("hôm qua")) {
      return time;
    }

    const today = new Date();
    const messageParts = time.split(":");
    if (messageParts.length === 2) {
      const messageHour = parseInt(messageParts[0]);
      const messageMin = parseInt(messageParts[1]);
      const messageDate = new Date(today);
      messageDate.setHours(messageHour);
      messageDate.setMinutes(messageMin);

      // Nếu tin nhắn trong vòng 24h qua
      if (today.getTime() - messageDate.getTime() < 86400000) {
        return time;
      } else if (today.getTime() - messageDate.getTime() < 172800000) {
        return "Hôm qua";
      }
    }

    return time;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <span className="text-xs text-gray-400">✓</span>;
      case "delivered":
        return <span className="text-xs text-gray-400">✓✓</span>;
      case "read":
        return <span className="text-xs text-blue-500">✓✓</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans relative">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white px-4 pt-6 pb-4 z-10 shadow-sm">
        {selectedChat ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="text-gray-800">
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={selectedChat.avatar || avatar}
                    alt={selectedChat.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedChat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold">{selectedChat.name}</h1>
                  {selectedChat.isTyping ? (
                    <p className="text-xs text-green-500">
                      Đang nhập tin nhắn...
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {selectedChat.online
                        ? "Đang hoạt động"
                        : "Hoạt động 30 phút trước"}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600">
                <Phone size={20} />
              </button>
              <button className="text-gray-600">
                <Video size={20} />
              </button>
              <button
                className="text-gray-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">Tin nhắn</h1>
            <div className="flex items-center gap-4">
              <button
                className="text-gray-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search size={20} />
              </button>
              <button className="text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Thanh tìm kiếm */}
        {showSearch && (
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search
              size={18}
              className="absolute right-3 top-2.5 text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Nội dung chính */}
      <div
        className={`${selectedChat ? "pt-[80px]" : "pt-[70px]"} ${
          showSearch ? "pt-[120px]" : ""
        } pb-[110px] min-h-screen overflow-y-auto`}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Hiển thị danh sách chat nếu chưa chọn */}
        {!selectedChat && (
          <div className="px-4 flex flex-col gap-3">
            {filteredChats.length === 0 && searchQuery !== "" ? (
              <div className="text-center py-10 text-gray-500">
                Không tìm thấy cuộc trò chuyện nào
              </div>
            ) : (
              filteredChats.map((group) => (
                <div
                  key={group.id}
                  onClick={() => {
                    setSelectedChatId(group.id);
                    // Đánh dấu đã đọc khi mở chat
                    setChatGroups((prev) =>
                      prev.map((chat) =>
                        chat.id === group.id
                          ? { ...chat, unreadCount: 0 }
                          : chat
                      )
                    );
                  }}
                  className="flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-lg transition-all"
                >
                  <div className="relative">
                    <img
                      src={group.avatar || avatar}
                      alt={group.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {group.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h2 className="font-semibold truncate">{group.name}</h2>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatMessageTime(group.lastMessageTime || "")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p
                        className={`text-sm truncate ${
                          group.unreadCount > 0
                            ? "font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {group.isTyping ? (
                          <span className="text-green-500">
                            Đang nhập tin nhắn...
                          </span>
                        ) : (
                          group.lastMessage
                        )}
                      </p>
                      {group.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {group.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Danh sách tin nhắn nếu đã chọn nhóm */}
        {selectedChat && (
          <div className="px-4 flex flex-col gap-3 pb-2">
            {/* Ngày nhóm tin nhắn */}
            <div className="text-center my-2">
              <span className="inline-block px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-600">
                Hôm nay
              </span>
            </div>

            {selectedChat.messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.isSentByUser ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isSentByUser &&
                  (idx === 0 ||
                    selectedChat.messages[idx - 1].isSentByUser) && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0">
                      <img
                        src={selectedChat.avatar || avatar}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}

                {!message.isSentByUser &&
                  idx > 0 &&
                  !selectedChat.messages[idx - 1].isSentByUser && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0 opacity-0">
                      <img
                        src={selectedChat.avatar || avatar}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}

                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.isSentByUser
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-black"
                  } ${message.type === "image" ? "p-1" : ""}`}
                >
                  {message.type === "text" ? (
                    <p>{message.text}</p>
                  ) : message.type === "voice" ? (
                    <div className="flex items-center gap-2 min-w-[160px]">
                      <button className="text-xl p-1 bg-white bg-opacity-20 rounded-full">
                        ▶
                      </button>
                      <div className="flex-1">
                        <div className="w-full h-1 bg-gray-300 bg-opacity-40 rounded-full">
                          <div className="w-1/3 h-full bg-white rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-sm">{message.voiceDuration}</span>
                    </div>
                  ) : (
                    message.type === "image" && (
                      <img
                        src={message.imageUrl || ""}
                        alt="Image message"
                        className="rounded-xl max-w-[200px]"
                      />
                    )
                  )}
                  <div className="flex justify-end items-center gap-1 mt-1">
                    <p
                      className={`text-xs ${
                        message.isSentByUser
                          ? "text-white text-opacity-80"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                    {message.isSentByUser && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Thanh nhập tin nhắn */}
      {selectedChat && (
        <div className="fixed bottom-[60px] left-0 w-full bg-white border-t border-gray-200 px-4 py-3 z-10">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <button type="button" className="text-gray-500">
              <Image size={20} />
            </button>

            {isRecording ? (
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                  <p className="text-sm text-gray-600">Đang ghi âm...</p>
                </div>
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="text-red-500 text-sm font-medium"
                >
                  HỦY
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none"
              />
            )}

            {inputMessage.trim() ? (
              <button type="submit" className="text-amber-500">
                <Send size={20} />
              </button>
            ) : (
              <button
                type="button"
                onTouchStart={handleStartRecording}
                onMouseDown={handleStartRecording}
                onTouchEnd={isRecording ? handleStopRecording : undefined}
                onMouseUp={isRecording ? handleStopRecording : undefined}
                className="text-amber-500"
              >
                <Mic size={20} />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Thanh điều hướng dưới cùng */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-2 flex justify-between z-10">
        {[
          {
            icon: <Home size={20} />,
            label: "Nhà",
            value: "home",
            path: "/",
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
