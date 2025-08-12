import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/AdsellsLogo.png";

const Nav = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Watch window size to update mobile/desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false); // close menu if switching to desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setMenuOpen(false);
    navigate(`/${tabName}`);
  };

  return (
    <nav
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 16px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "40px",
            marginRight: "10px",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              gap: "32px",
              alignItems: "center",
            }}
          >
            {["Dashboard", "Profile", "Reports", "Management"].map((tab) => (
              <li key={tab}>
                <span
                  style={{
                    color: activeTab === tab ? "#3b82f6" : "#6b7280",
                    fontWeight: "500",
                    fontSize: "14px",
                    padding: "8px 0",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #3b82f6"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => handleNavClick(tab)}
                >
                  {tab}
                </span>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginLeft: "24px",
              paddingLeft: "24px",
              borderLeft: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                U
              </span>
            </div>

            <button
              style={{
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                padding: "6px 12px",
                borderRadius: "6px",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
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
      )}

      {/* Mobile Dropdown Menu */}
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
    </nav>
  );
};

export default Nav;
