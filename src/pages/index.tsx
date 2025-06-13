import React from "react";
import { useNavigate } from "react-router-dom"; //hook useNavigate dùng để điều hướng trang
import { motion } from "framer-motion"; // component motion dùng để tạo hiệu ứng
import barberBackground from "../assets/images/barber-background.png";
import bookbarberLogo from "../assets/images/bookbarber-logo.png";

const WelcomeScreen: React.FC = () => {
  // khai báo component với kiểu React.FC
  const navigate = useNavigate();

  const handleRegisterPress = () => {
    navigate("/auth"); // điều hướng đến AuthScreen
  };

  const handleStartPress = () => {
    navigate("/home"); // điều hướng dến HomePage
  };

  return (
    <div className="welcome-screen">
      <div className="overlay">
        <motion.div
          className="logo-container"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={bookbarberLogo}
            alt="BookBarber Logo"
            className="logo"
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "/path/to/fallback-image.jpg")
            }
          />
        </motion.div>

        <motion.div
          className="content-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2 className="headline">
            Lên lịch hẹn với các nhà tạo mẫu tóc tốt nhất gần vị trí của bạn
          </h2>
        </motion.div>

        <motion.div
          className="button-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button
            className="button register-button"
            onClick={handleRegisterPress}
          >
            ĐĂNG KÝ
          </button>
          <button className="button start-button" onClick={handleStartPress}>
            BẮT ĐẦU
          </button>
        </motion.div>
      </div>

      <style>
        {`
          .welcome-screen {
            position: relative;
            min-height: 100vh;
            background: url(${barberBackground}) no-repeat center center/cover;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: sans-serif;
            overflow: hidden;
          }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 40px 20px 30px;
          }
          .logo-container {
            text-align: center;
            margin-top: 20px;
          }
          .logo {
            width: 120px;
            height: 120px;
            margin-bottom: 10px;
          }
          .app-name {
            font-size: 24px;
            font-weight: bold;
            color: #FFFFFF;
          }
          .content-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 90%;
          }
          .headline {
            font-size: 26px;
            font-weight: bold;
            color: #FFD700;
            text-align: center;
            line-height: 36px;
          }
          .button-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 400px;
            gap: 16px;
          }
          .button {
            padding: 15px 0;
            border-radius: 25px;
            width: 40%;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
          }
          .button:hover {
            transform: scale(1.05);
          }
          .register-button {
            font-family: monospace;
            font-size: 20px;
            background: transparent;
            border: 1.5px solid #FFD700;
            color: #FFD700;
            font-weight: 800;
          }
          .start-button {
            font-family: monospace;
            font-size: 20px;
            background: #FFD700;
            color: #000000;
            border: none;
            font-weight: 800;
          }
          @media (max-width: 320px) {
            .headline {
              font-size: 20px;
              line-height: 28px;
            }
            .button {
              font-size: 12px;
              padding: 12px 0;
            }
            .logo {
              width: 100px;
              height: 100px;
            }
            .app-name {
              font-size: 20px;
            }
          }
          @media (min-width: 640px) {
            .headline {
              font-size: 30px;
              line-height: 40px;
            }
            .button {
              font-size: 16px;
              padding: 18px 0;
            }
            .logo {
              width: 150px;
              height: 150px;
            }
            .app-name {
              font-size: 28px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomeScreen;
