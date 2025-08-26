import { 
  FaTachometerAlt, 
  FaTasks, 
  FaPlus, 
  FaCog, 
  FaSignOutAlt, 
  FaUsers, 
  FaChartLine 
} from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Add path for routing
  const menuItems = [
  { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admin" },
  { icon: <FaTasks />, label: "Issues", path: "/admin/issues" },
  { icon: <FaPlus />, label: "Report Issue", path: "/admin/report-issue" },
  { icon: <FaUsers />, label: "Users", path: "/admin/users" },
  { icon: <FaChartLine />, label: "Analytics", path: "/admin/analytics" },
  { icon: <FaCog />, label: "Settings", path: "/admin/settings" },
];

<ul className="menu">
  {menuItems.map((item, idx) => (
    <li key={idx} onClick={() => navigate(item.path)}>
      {item.icon}
      <span>{item.label}</span>
    </li>
  ))}
</ul>


  return (
    <div className="sidebar">
      <h2 className="logo">Facility Manager</h2>

      <ul className="menu">
        {menuItems.map((item, idx) => (
          <li key={idx} onClick={() => navigate(item.path)}>
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="quick-stats">
        <h4>Quick Stats</h4>
        <p><strong>Role:</strong> {auth?.role || "Employee"}</p>
        <p><strong>Department:</strong> {auth?.department || "N/A"}</p>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "6px" }} /> Logout
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 240px;
          background: #f9fafb;
          padding: 20px;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .logo {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #111827;
        }

        .menu {
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .menu li {
          list-style: none;
          margin: 10px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }

        .menu li:hover {
          background: #e5e7eb;
          color: #111827;
        }

        .menu li span {
          flex: 1;
        }

        .quick-stats {
          margin-top: auto;
          background: #f3f4f6;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quick-stats h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .quick-stats p {
          margin: 4px 0;
        }

        .quick-stats strong {
          color: #111827;
        }

        .logout-btn {
          margin-top: 6px;
          padding: 6px 10px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          background: #ef4444;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: #b91c1c;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
