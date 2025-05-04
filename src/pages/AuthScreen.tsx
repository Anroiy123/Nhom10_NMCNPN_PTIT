import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import twitterIcon from "../assets/icons/twitter.png";
import googleIcon from "../assets/icons/google.png";
import facebookIcon from "../assets/icons/facebook.png";

const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "login") {
      setIsLoginMode(true);
    } else {
      setIsLoginMode(false);
    }
  }, [location]);

  const toggleMode = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isLoginMode) {
      // Logic đăng nhập
      if (!email || !password) {
        setError("Vui lòng nhập Email và Mật khẩu.");
        return;
      }
      console.log("Đăng nhập với:", { email, password });
      // Giả lập đăng nhập thành công (thay bằng gọi API thực tế)
      navigate("/home"); // Chuyển đến HomePage sau khi đăng nhập
    } else {
      // Logic đăng ký
      if (!name || !email || !password) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }
      console.log("Đăng ký với:", { name, email, password });
      // Giả lập đăng ký thành công (thay bằng gọi API thực tế)
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      setIsLoginMode(true); // Chuyển sang chế độ đăng nhập
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook" | "twitter") => {
    console.log(`Đăng nhập bằng ${provider}`);
    // Giả lập đăng nhập thành công (thay bằng logic thực tế, ví dụ: Firebase Auth)
    navigate("/home");
  };

  const handleForgotPassword = () => {
    console.log("Xử lý quên mật khẩu cho:", email);
    alert("Chức năng quên mật khẩu đang được phát triển!");
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="auth-screen">
      <motion.div
        className={`auth-card ${isLoginMode ? "login-mode" : "register-mode"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.form
            key={isLoginMode ? "login" : "register"}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit}
            className="auth-form"
          >
            <h2 className="auth-title">
              {isLoginMode ? "Chào mừng trở lại!" : "Đăng Ký"}
            </h2>

            <p className="toggle-link">
              {isLoginMode
                ? "Bạn vẫn chưa có tài khoản ư? "
                : "Bạn đã có tài khoản rồi ư? "}
              <span onClick={toggleMode}>
                {isLoginMode ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}
              </span>
            </p>

            {!isLoginMode && (
              <motion.div
                className="input-group"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="name">Tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên của bạn"
                  required={!isLoginMode}
                />
              </motion.div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder={
                  isLoginMode
                    ? "Nhập mật khẩu"
                    : "Tạo mật khẩu (ít nhất 6 ký tự)"
                }
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            {isLoginMode && (
              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPassword}
              >
                Quên mật khẩu?
              </button>
            )}

            <motion.button
              type="submit"
              className="auth-button"
              whileTap={{ scale: 0.95 }}
            >
              {isLoginMode ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </motion.button>

            <div className="social-divider">
              <span>Hoặc {isLoginMode ? "đăng nhập" : "đăng ký"} bằng</span>
            </div>

            <div className="social-buttons">
              <motion.button
                type="button"
                className="social-button twitter"
                onClick={() => handleSocialLogin("twitter")}
                whileTap={{ scale: 0.9 }}
              >
                <img src={twitterIcon} alt="Twitter" />
              </motion.button>
              <motion.button
                type="button"
                className="social-button google"
                onClick={() => handleSocialLogin("google")}
                whileTap={{ scale: 0.9 }}
              >
                <img src={googleIcon} alt="Google" />
              </motion.button>
              <motion.button
                type="button"
                className="social-button facebook"
                onClick={() => handleSocialLogin("facebook")}
                whileTap={{ scale: 0.9 }}
              >
                <img src={facebookIcon} alt="Facebook" />
              </motion.button>
            </div>
          </motion.form>
        </AnimatePresence>
      </motion.div>

      <style>
        {`
          .auth-screen {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f4f4f4;
            padding: 20px;
            font-family: sans-serif;
          }
          .auth-card {
            background-color: #ffffff;
            padding: 30px 40px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 420px;
            text-align: center;
            position: relative;
            overflow: hidden;
            transition: background-color 0.5s ease;
          }
          .auth-card.register-mode {
            /* background-color: #FFF8DC; */
          }
          .auth-form {
            display: flex;
            flex-direction: column;
          }
          .auth-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          .toggle-link {
            margin-bottom: 25px;
            font-size: 14px;
            color: #555;
          }
          .toggle-link span {
            color: #FFB800;
            font-weight: bold;
            cursor: pointer;
            text-decoration: underline;
          }
          .input-group {
            margin-bottom: 20px;
            text-align: left;
            overflow: hidden;
          }
          .input-group label {
            display: block;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .auth-input,
          .input-group input {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.3s ease;
          }
          .auth-input:focus,
          .input-group input:focus {
            border-color: #FFB800;
            outline: none;
          }
          .error-message {
            color: #e74c3c;
            font-size: 13px;
            text-align: left;
            margin-top: -10px;
            margin-bottom: 15px;
          }
          .forgot-link {
            background: none;
            border: none;
            color: #FFB800;
            font-size: 13px;
            text-align: right;
            margin-bottom: 20px;
            cursor: pointer;
            padding: 0;
          }
          .auth-button {
            background-color: #FFD700;
            color: #000000;
            border: none;
            padding: 16px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
            margin-top: 10px;
          }
          .auth-button:hover {
            background-color: #FFC400;
          }
          .auth-button:active {
            transform: scale(0.98);
          }
          .social-divider {
            margin: 30px 0 20px;
            display: flex;
            align-items: center;
            text-align: center;
            color: #aaa;
            font-size: 13px;
          }
          .social-divider::before,
          .social-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #eee;
          }
          .social-divider span {
            padding: 0 15px;
          }
          .social-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
          }
          .social-button {
            background-color: #fff;
            border: 1px solid #eee;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: box-shadow 0.3s ease, transform 0.1s ease;
            padding: 0;
          }
          .social-button:hover {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .social-button:active {
            transform: scale(0.95);
          }
          .social-button img {
            width: 24px;
            height: 24px;
          }
          @media (max-width: 320px) {
            .auth-card {
              padding: 20px;
            }
            .auth-title {
              font-size: 24px;
            }
            .toggle-link {
              font-size: 12px;
            }
            .input-group input {
              padding: 12px 14px;
              font-size: 14px;
            }
            .auth-button {
              font-size: 14px;
              padding: 12px;
            }
          }
          @media (min-width: 640px) {
            .auth-title {
              font-size: 32px;
            }
            .toggle-link {
              font-size: 16px;
            }
            .input-group input {
              padding: 16px 18px;
              font-size: 18px;
            }
            .auth-button {
              font-size: 18px;
              padding: 18px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AuthScreen;
