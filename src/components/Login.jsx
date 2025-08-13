import React, { useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/AdsellsLogo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Show toast message
  const showToast = (text, type) => {
    const toast = document.getElementById("custom-toast");
    toast.innerText = text;
    toast.style.backgroundColor = type === "success" ? "#4CAF50" : "#f44336"; // green / red
    toast.style.color = "white"; 
    toast.style.fontWeight = "bold";
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  };

  // Validation function
  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9._]+$/;               // letters, numbers, underscore, dot
    const scriptTagRegex = /<script.*?>.*?<\/script>/i;     // script tag check

    if (!username.trim() && !password.trim()) {
      showToast("Please enter both username and password ❌", "error");
      return false;
    }

    if (!username.trim()) {
      showToast("Please enter username", "error");
      return false;
    }
    if (!usernameRegex.test(username)) {
      showToast("Username can only contain letters, numbers, underscores, and dots.", "error");
      return false;
    }
    if (scriptTagRegex.test(username)) {
      showToast("Script tags are not allowed in username.", "error");
      return false;
    }

    if (!password.trim()) {
      showToast("Please enter password", "error");
      return false;
    }
    if (scriptTagRegex.test(password)) {
      showToast("Script tags are not allowed in password.", "error");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("https://hrm.adsells.biz/FMAppApi/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      let data = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn("No valid JSON in response");
        data = {};
      }

      console.log("Login Response:", data);
      if (res.ok && (data.message==="Login successful")) {
         localStorage.setItem("username", username);
        showToast(`Welcome, ${username}! 🎉`, "success");
        navigate("/Home");
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
                  {password && (
                    showPassword ? (
                      <FaEyeSlash onClick={() => setShowPassword(false)} />
                    ) : (
                      <FaEye onClick={() => setShowPassword(true)} />
                    )
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
          bottom: "20px",
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
