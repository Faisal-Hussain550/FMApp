import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/AdsellsLogo.png"; // adjust if path differs

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#fff",
        borderTop: "1px solid #e5e7eb",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          padding: isMobile ? "16px 12px" : "32px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(200px, 1fr))",
            gap: isMobile ? "20px" : "32px",
            alignItems: "start",
          }}
        >
          {/* Logo + Company Info */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <img
                src={logo}
                alt="Adsells Logo"
                style={{
                  width: isMobile ? "32px" : "40px",
                  height: isMobile ? "32px" : "40px",
                  objectFit: "contain",
                }}
              />
              <h3
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0,
                }}
              >
                FMAPP 
              </h3>
            </div>
            {!isMobile && (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  maxWidth: "250px",
                }}
              >
                Streamlining business operations with innovative solutions.
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: isMobile ? "8px" : "12px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Quick Links
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: isMobile ? "flex" : "block",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: isMobile ? "12px" : "0",
              }}
            >
              <li>
                <Link
                  to="/Home"
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "12px" : "13px",
                    textDecoration: "none",
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "12px" : "13px",
                    textDecoration: "none",
                  }}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "12px" : "13px",
                    textDecoration: "none",
                  }}
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/management"
                  style={{
                    color: "#6b7280",
                    fontSize: isMobile ? "12px" : "13px",
                    textDecoration: "none",
                  }}
                >
                  Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: isMobile ? "8px" : "12px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Contact
            </h4>
            <div
              style={{
                color: "#6b7280",
                fontSize: isMobile ? "12px" : "13px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <a
                href="mailto:support@adsellsapp.com"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                support@adsellsapp.com
              </a>
              {!isMobile && (
                <div>
                  <a
                    href="tel:+1234567890"
                    style={{ color: "#3b82f6", textDecoration: "none" }}
                  >
                    04200000
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          padding: isMobile ? "8px 12px" : "12px 24px",
          textAlign: "center",
          fontSize: isMobile ? "11px" : "12px",
          color: "#6b7280",
        }}
      >
        © {currentYear} AdsellsApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
