import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/AdsellsLogo.png";

const Nav = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setMenuOpen(false);
    const route = tabName === "Dashboard" ? "/Home" : `/${tabName.toLowerCase()}`;
    navigate(route);
  };

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "240px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "20px",
        boxShadow: "2px 0 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          cursor: "pointer",
        }}
        onClick={() => handleNavClick("Dashboard")}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "40px",
            marginRight: "10px",
            borderRadius: "5px",
          }}
        />
        <span style={{ fontWeight: "bold", fontSize: "18px", color: "#3b82f6" }}>
          Adsells
        </span>
      </div>

      {/* Navigation Links */}
      <ul style={{ listStyle: "none", padding: "20px 0", margin: 0, flex: 1 }}>
        {["Dashboard", "Profile", "Reports", "Management"].map((tab) => (
          <li key={tab}>
            <div
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: activeTab === tab ? "600" : "500",
                fontSize: "16px",
                color: activeTab === tab ? "#3b82f6" : "#6b7280",
                backgroundColor:
                  activeTab === tab ? "rgba(59,130,246,0.1)" : "transparent",
                borderRadius: "6px",
                margin: "4px 12px",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => handleNavClick(tab)}
            >
              {tab}
            </div>
          </li>
        ))}
      </ul>

      {/* Profile & Logout */}
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "500",
              color: "#6b7280",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <span style={{ fontWeight: "500", color: "#6b7280" }}>
            {username || "User"}
          </span>
        </div>

        <button
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor: "#ef4444",
            border: "none",
            color: "#fff",
            fontWeight: "500",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && <DesktopSidebar />}

      {/* Mobile Top Bar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            zIndex: 1000,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo on the left */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleNavClick("Dashboard")}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "40px", borderRadius: "5px" }}
            />
            <span
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#3b82f6",
                marginLeft: "8px",
              }}
            >
              FMApp
            </span>
          </div>

          {/* Hamburger menu on the right */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>
      )}

      {/* Mobile Dropdown Menu (unchanged except username above logout) */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: "#fff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "16px",
            zIndex: 999,
          }}
        >
          {["Dashboard", "Profile", "Reports", "Management"].map((tab) => (
            <div
              key={tab}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #eee",
                color: activeTab === tab ? "#3b82f6" : "#6b7280",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => handleNavClick(tab)}
            >
              {tab}
            </div>
          ))}

          {/* Username + Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #eee",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                color: "#6b7280",
              }}
            >
              {username ? username.charAt(0).toUpperCase() : "U"}
            </div>
            <span style={{ fontWeight: "500", color: "#6b7280" }}>
              {username || "User"}
            </span>
          </div>

          {/* Logout */}
          <div
            style={{
              padding: "12px 0",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: "500",
            }}
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
