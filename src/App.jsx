// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Login
import Login from "./components/Login";

// Layouts
import AdminLayout from "./components/Admin/AdminLayout";

// Dashboards (page content)
import AdminDashboard from "./components/Admin/Dashboard";
import ManagerDashboard from "./components/Manager/Dashboard";
import SupervisorDashboard from "./components/Supervisor/Dashboard";
import EmployeeDashboard from "./components/Employee/Dashboard";

// Admin Pages
import AdminIssues from "./components/Common/Issues";
import AdminReportIssue from "./components/Common/ReportIssue";
import AdminSettings from "./components/Admin/Settings";
import AdminUsers from "./components/Common/Users";
import AdminRecentIssues from "./components/Common/RecentIssues";

// Context Provider
import { NotificationProvider } from "./components/Context/NotificationContext";

const App = () => {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="issues" element={<AdminIssues />} />
            <Route path="report-issue" element={<AdminReportIssue />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="Recent Issues" element={<AdminRecentIssues />} />
          </Route>

          {/* ================= MANAGER ================= */}
          <Route path="/manager" element={<ManagerDashboard />} />

          {/* ================= SUPERVISOR ================= */}
          <Route
            path="/supervisor/dashboard/*"
            element={<SupervisorDashboard />}
          />

          {/* ================= EMPLOYEE ================= */}
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
};

export default App;
