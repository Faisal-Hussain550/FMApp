// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Dashboard/Home";
import AdminDashboard from "./components/Admin/Dashboard";
import ManagerDashboard from "./components/Manager/Dashboard";
import SupervisorDashboard from "./components/Supervisor/Dashboard";
import EmployeeDashboard from "./components/Employee/Dashboard"; // Note: "Emplpoyee" typo

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
