// src/components/Manager/ManagerDashboard.jsx
import React from "react";
import { useNotification } from "../Context/NotificationContext";

const ManagerDashboard = () => {
  const { notifications } = useNotification();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <p className="font-medium">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.description}</p>
                <p className="text-xs text-gray-500">
                  Tagged by Admin: <span className="font-semibold">{notif.admin}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
