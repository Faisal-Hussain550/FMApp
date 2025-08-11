import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/AdsellsLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Show toast message
  const showToast = (text, type) => {
  const toast = document.getElementById("custom-toast");
  toast.innerText = text;
  toast.style.backgroundColor = type === "success" ? "green" : "red";
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
};


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://hrm.adsells.biz/FMAppApi/login ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok && data.success) {
          localStorage.setItem("user", JSON.stringify(data));
          showToast(`Welcome, ${username}! 🎉`, "success");
      } else {
          showToast(data.message || "Invalid username or password ❌", "error");
      }

    } catch (error) {
      console.error(error);
      showToast("Server error. Please try again later.", "error");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="login-main">
        <div className="login-left">
          <img src={Image} alt="" />
        </div>
        <div className="login-right">
          <div className="login-right-container">
            <div className="login-logo">
              <img src={Logo} alt="" />
            </div>
            <div className="login-center">
              <h2>Welcome back!</h2>
              <p>Please enter your details</p>

              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="pass-input-div">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                  ) : (
                    <FaEye onClick={() => setShowPassword(!showPassword)} />
                  )}
                </div>

                <div className="login-center-buttons">
                  <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast element */}
      <div
        id="custom-toast"
        style={{
          display: "none",
          position: "fixed",
          right: "20px",
          bottom:"20px",
          padding: "10px 20px",
          borderRadius: "5px",
          color: "white",
          fontWeight: "bold",
          zIndex: 9999,
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>
    </>
  );
};

export default Login;
