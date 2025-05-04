import React from "react";
// import { useNavigate } from "zmp-sdk";
import { Box, Button, Input, Text } from "zmp-ui";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleRegister = () => {
    console.log("Đăng ký với:", { email, password });
    navigate("/home");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 30,
          }}
        >
          Đăng Ký
        </Text>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 15,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            marginBottom: 15,
            fontSize: 16,
          }}
        />
        <Input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 15,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            marginBottom: 15,
            fontSize: 16,
          }}
        />
        <Button
          style={{
            width: "100%",
            padding: 15,
            backgroundColor: "#FFD700",
            borderRadius: 10,
            color: "#000",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 15,
          }}
          onClick={handleRegister}
        >
          ĐĂNG KÝ
        </Button>
        <Button
          variant="secondary"
          style={{
            color: "#F5B100",
            fontSize: 16,
            backgroundColor: "transparent",
          }}
          onClick={() => navigate("/home")}
        >
          Bỏ qua
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;
