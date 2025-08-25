import React, { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Load from localStorage so refreshes don't wipe temporary state (still frontend-only)
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("fm_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage (still not a DB)
  useEffect(() => {
    localStorage.setItem("fm_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // API: create one or many notifications
  const addNotification = (payload) => {
    // payload can be an object or array of objects
    const items = Array.isArray(payload) ? payload : [payload];
    const withIds = items.map((n) => ({
      id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, // unique id
      createdAt: Date.now(),
      isRead: false,
      ...n,
    }));
      console.log("🔔 Adding notification:", withIds);
    setNotifications((prev) => [...prev, ...withIds]);
  };

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const markAllAsReadForManager = (managerId) =>
    setNotifications((prev) =>
      prev.map((n) => (n.managerId === managerId ? { ...n, isRead: true } : n))
    );

  const clearForManager = (managerId) =>
    setNotifications((prev) => prev.filter((n) => n.managerId !== managerId));

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsReadForManager,
        clearForManager,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
