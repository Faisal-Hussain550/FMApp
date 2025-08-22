import React from "react";
import AdminHome from "./AdminHome";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not Admin
  React.useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== "Admin") {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className="flex h-screen">
   
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <AdminHome />
              <Outlet />
      </main>
        
    </div>
  );
};

export default AdminDashboard;
