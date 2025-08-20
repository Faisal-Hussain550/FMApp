import React from "react";
import Nav from "../Dashboard/Nav";
import Footer from "../Dashboard/Footer";
import AdminHome from "./AdminHome"; 
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <Nav role={auth.role} onLogout={logout} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <AdminHome />
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
