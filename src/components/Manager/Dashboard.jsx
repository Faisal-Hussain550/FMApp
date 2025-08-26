import React from "react";
import ManagerHome from "./ManagerHome";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";



const ManagerDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not Manager
  React.useEffect(() => {
    if (!auth.isAuthenticated || auth.role !== "Manager") {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className="flex h-screen">
   
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <ManagerHome />
     
      </main>
        
    </div>
  );
};

export default ManagerDashboard;
