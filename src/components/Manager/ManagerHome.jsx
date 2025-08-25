import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Bell, CheckCircle, Clock, Trash2, UserCheck } from "lucide-react";
import "./ManagerHome.css"; // ✅ import CSS file

const ManagerHome = () => {
  const { auth } = useAuth();
  const [myNotifications, setMyNotifications] = useState([]);
  const [employees] = useState([
    { id: 1, name: "Ali Khan" },
    { id: 2, name: "Sara Ahmed" },
    { id: 3, name: "Bilal Raza" },
  ]);

  useEffect(() => {
    setMyNotifications([
      {
        id: 1,
        title: "Server Down",
        description: "The main server is currently offline.",
        admin: "Admin User",
        createdAt: new Date().toISOString(),
        isRead: false,
        assignedTo: null,
      },
      {
        id: 2,
        title: "New Issue Reported",
        description: "A new bug has been reported in the billing system.",
        admin: "System Admin",
        createdAt: new Date().toISOString(),
        isRead: true,
        assignedTo: "Sara Ahmed",
      },
      {
        id: 3,
        title: "Maintenance Scheduled",
        description: "Database maintenance scheduled for tonight at 11 PM.",
        admin: "Support Team",
        createdAt: new Date().toISOString(),
        isRead: false,
        assignedTo: null,
      },
    ]);
  }, []);

  const handleAssign = (notificationId, employeeName) => {
    setMyNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, assignedTo: employeeName } : n
      )
    );
  };

  return (
    <div className="manager-container">
      <h1 className="dashboard-title">Manager Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <Bell className="icon blue" size={36} />
          <div>
            <h2>Total</h2>
            <p>{myNotifications.length} Issues</p>
          </div>
        </div>

        <div className="summary-card">
          <Clock className="icon yellow" size={36} />
          <div>
            <h2>Unread</h2>
            <p>{myNotifications.filter((n) => !n.isRead).length} Issues</p>
          </div>
        </div>

        <div className="summary-card">
          <CheckCircle className="icon green" size={36} />
          <div>
            <h2>Read</h2>
            <p>{myNotifications.filter((n) => n.isRead).length} Issues</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-wrapper">
        <div className="notifications-header">
          <h2>
            <Bell className="icon blue small" size={24} /> Notifications
          </h2>
          {myNotifications.length > 0 && (
            <button
              onClick={() => setMyNotifications([])}
              className="clear-btn"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>

        {myNotifications.length === 0 ? (
          <p className="empty-state">🎉 No new notifications</p>
        ) : (
          <div className="notifications-grid">
            {myNotifications.map((n) => (
              <div
                key={n.id}
                className={`notification-card ${
                  n.isRead ? "read" : "unread"
                }`}
              >
                <h3>{n.title}</h3>
                <p className="desc">{n.description}</p>
                <p className="meta">
                  Reported by <span>{n.admin}</span> •{" "}
                  {new Date(n.createdAt).toLocaleString()}
                </p>

                {n.assignedTo ? (
                  <p className="assigned">
                    <UserCheck size={18} /> Assigned to {n.assignedTo}
                  </p>
                ) : (
                  <select
                    className="assign-select"
                    onChange={(e) => handleAssign(n.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Assign to Employee
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                )}

                {!n.isRead && (
                  <button
                    onClick={() =>
                      setMyNotifications((prev) =>
                        prev.map((x) =>
                          x.id === n.id ? { ...x, isRead: true } : x
                        )
                      )
                    }
                    className="mark-read-btn"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerHome;
