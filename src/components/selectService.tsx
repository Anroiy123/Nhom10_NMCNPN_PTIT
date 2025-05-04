import React, { useState } from "react";

// Interface cho Service
export interface Service {
  id?: string;
  name: string;
  price: string;
  priceValue: number;
  duration: string;
  image: string;
  quantity?: number;
}

interface SelectServiceProps {
  services: Service[];
  onSelect: (selected: Service[]) => void;
  initialSelected?: Service[];
}

const SelectService: React.FC<SelectServiceProps> = ({
  services,
  onSelect,
  initialSelected = [],
}) => {
  const [selected, setSelected] = useState<Service[]>(initialSelected);

  const handleAdd = (service: Service) => {
    const exist = selected.find((s) => s.name === service.name);
    if (exist) {
      setSelected(
        selected.map((s) =>
          s.name === service.name
            ? { ...s, quantity: (s.quantity || 1) + 1 }
            : s
        )
      );
    } else {
      setSelected([...selected, { ...service, quantity: 1 }]);
    }
  };

  const handleRemove = (service: Service) => {
    setSelected(selected.filter((s) => s.name !== service.name));
  };

  const handleChangeQuantity = (service: Service, qty: number) => {
    if (qty <= 0) {
      handleRemove(service);
    } else {
      setSelected(
        selected.map((s) =>
          s.name === service.name ? { ...s, quantity: qty } : s
        )
      );
    }
  };

  const isSelected = (service: Service) =>
    selected.some((s) => s.name === service.name);

  const total = selected.reduce(
    (sum, s) => sum + s.priceValue * (s.quantity || 1),
    0
  );

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">Chọn dịch vụ</h2>
      <div className="space-y-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-3 border rounded-lg"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-16 h-16 rounded object-cover bg-gray-100"
            />
            <div className="flex-1">
              <p className="font-semibold">{service.name}</p>
              <p className="text-sm text-gray-600">{service.price}</p>
              <p className="text-xs text-gray-400">{service.duration}</p>
            </div>
            {isSelected(service) ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleChangeQuantity(
                      service,
                      (selected.find((s) => s.name === service.name)
                        ?.quantity || 1) - 1
                    )
                  }
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                >
                  -
                </button>
                <span>
                  {selected.find((s) => s.name === service.name)?.quantity || 1}
                </span>
                <button
                  onClick={() =>
                    handleChangeQuantity(
                      service,
                      (selected.find((s) => s.name === service.name)
                        ?.quantity || 1) + 1
                    )
                  }
                  className="w-7 h-7 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(service)}
                  className="ml-2 text-red-500"
                >
                  Xoá
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAdd(service)}
                className="px-3 py-1 bg-yellow-400 text-white rounded"
              >
                Chọn
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div className="font-semibold">Tổng cộng:</div>
        <div className="text-lg font-bold text-yellow-600">
          {total.toLocaleString()} VND
        </div>
      </div>
      <button
        className="mt-4 w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold text-base"
        onClick={() => onSelect(selected)}
        disabled={selected.length === 0}
      >
        Xác nhận
      </button>
    </div>
  );
};

// Dịch vụ mẫu để test component SelectService
import barberShopImage from "../assets/images/barber-shop.jpg";
import avatarImage from "../assets/images/avatar.jpg";
import barberBackgroundImage from "../assets/images/barber-background.png";

export const sampleServices = [
  {
    name: "Cắt tóc nam",
    price: "80.000 VNĐ",
    priceValue: 80000,
    duration: "30 phút",
    image: barberShopImage,
  },
  {
    name: "Gội đầu thư giãn",
    price: "50.000 VNĐ",
    priceValue: 50000,
    duration: "20 phút",
    image: avatarImage,
  },
  {
    name: "Cạo râu tạo kiểu",
    price: "70.000 VNĐ",
    priceValue: 70000,
    duration: "15 phút",
    image: barberBackgroundImage,
  },
];

export default SelectService;
