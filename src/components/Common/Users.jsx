// src/components/Admin/Users.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

// ConfirmDelete modal component
const ConfirmDelete = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px 30px",
      borderRadius: "10px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      zIndex: 9999,
      minWidth: "300px",
      textAlign: "center"
    }}>
      <p style={{ marginBottom: "20px", fontWeight: "600" }}>{message}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={onConfirm}
          style={{ backgroundColor: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          style={{ backgroundColor: "#6b7280", color: "#fff", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "employee", department: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:7033/api/Users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or update user
  const handleAddOrEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        // Edit user
        await axios.put(`https://localhost:7033/api/Users/${editingUser.id}`, newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("User updated successfully!");
      } else {
        // Add user
        const res = await axios.post("https://localhost:7033/api/Users", newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers([...users, res.data]);
        toast.success("User added successfully!");
      }
      setShowAddForm(false);
      setEditingUser(null);
      setNewUser({ username: "", password: "", role: "employee", department: "" });
      fetchUsers();
    } catch (error) {
      toast.error("Failed to save user!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare user data for editing
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      password: "", // leave blank for security
      role: user.role,
      department: user.department || "",
    });
    setShowAddForm(true);
  };

  // Prepare delete modal
  const handleDeleteClick = (id) => setDeleteUserId(id);

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://localhost:7033/api/Users/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter(u => u.id !== deleteUserId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user!");
      console.error(error);
    } finally {
      setDeleteUserId(null);
    }
  };

  const handleCancelDelete = () => setDeleteUserId(null);

  return (
    <div className="users-page">
      <Toaster />
      <div className="header">
        <h1 className="page-title">Users</h1>
        <button className="add-user" onClick={() => { setShowAddForm(!showAddForm); setEditingUser(null); }}>
          <FaUserPlus style={{ marginRight: "6px" }} />
          Add User
        </button>
      </div>

      {showAddForm && (
        <form className="add-user-form" onSubmit={handleAddOrEditUser}>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required={!editingUser} // required only for new user
          />
          <input
            type="text"
            placeholder="Department"
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
          />
           <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? (editingUser ? "Updating..." : "Adding...") : (editingUser ? "Update User" : "Add User")}
          </button>
        </form>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td className="actions">
                <button className="edit" onClick={() => handleEdit(user)}><FaEdit /></button>
                <button className="delete" onClick={() => handleDeleteClick(user.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteUserId && (
        <ConfirmDelete
          message="Are you sure you want to delete this user?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <style jsx>{`
        .users-page { padding: 24px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .page-title { font-size: 28px; font-weight: 700; color: #111827; }
        .add-user { background-color: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; display: flex; align-items: center; cursor: pointer; }
        .add-user:hover { background-color: #2563eb; }
        .add-user-form { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .add-user-form input, .add-user-form select { padding: 8px 12px; border-radius: 6px; border: 1px solid #d1d5db; }
        .add-user-form button { background-color: #16a34a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
        .add-user-form button:hover { background-color: #15803d; }
        .users-table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
        th { background-color: #f3f4f6; font-weight: 600; }
        .actions { display: flex; gap: 8px; }
        button.edit { background-color: #3b82f6; color: white; border-radius: 6px; padding: 6px 10px; }
        button.edit:hover { background-color: #2563eb; }
        button.delete { background-color: #ef4444; color: white; border-radius: 6px; padding: 6px 10px; }
        button.delete:hover { background-color: #b91c1c; }
      `}</style>
    </div>
  );
};

export default Users;
