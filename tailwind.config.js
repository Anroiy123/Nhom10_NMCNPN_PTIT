/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Đặt 'Be Vietnam Pro' làm font sans-serif mặc định
        sans: ['"Be Vietnam Pro"', "sans-serif"],
      },
      // Bạn cũng có thể định nghĩa thêm màu sắc ở đây nếu cần
      colors: {
        primary: "#F5B100", // Ví dụ màu vàng chủ đạo
        // ... các màu khác
      },
    },
  },
  plugins: [],
};
