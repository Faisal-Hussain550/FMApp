// src/components/Admin/AdminLayout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* All child routes will render here */}
      </main>
    </div>
  );
};

export default AdminLayout;
