// src/components/Admin/Settings.jsx
import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Settings = () => {
  const { auth, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: auth.username || "",
    role: auth.role || "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Mock update - replace with API call
    setMessage("Settings updated successfully!");

    // Update localStorage (simulating auth update)
    login(formData.username, formData.role, auth.token);
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>

      {message && <p className="success-message">{message}</p>}

      <form className="settings-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </label>

        <label>
          New Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </label>

        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </label>

        <button type="submit">Update Settings</button>
      </form>

      <style jsx>{`
        .settings-page {
          padding: 24px;
          max-width: 600px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #111827;
        }

        .success-message {
          color: #10b981;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        label {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input {
          margin-top: 6px;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border 0.2s;
        }

        input:focus {
          border-color: #3b82f6;
        }

        button {
          padding: 10px 16px;
          background-color: #3b82f6;
          color: #fff;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default Settings;
