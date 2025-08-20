import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatsCard from "./StatsCard";
import Charts from "./Charts";
import RecentIssues from "./RecentIssues";
import { FaExclamationTriangle, FaClock, FaChartLine, FaCheck } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Dashboard = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
    priority: [],
    department: [],
    recent: []
  });

  useEffect(() => {
    if (!auth?.token) {
      navigate("/"); // redirect if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        // 🔹 Call all APIs
        const [allRes, createRes, assignRes, approveRes] = await Promise.all([
          axios.get("https://localhost:7033/api/issues"),
          axios.get("https://localhost:7033/api/issues/create"),
          axios.get("https://localhost:7033/api/issues/assign"),
          axios.get("https://localhost:7033/api/issues/approve"),
        ]);

        const allIssues = allRes.data || [];
        const created = createRes.data || [];
        const assigned = assignRes.data || [];
        const approved = approveRes.data || [];

        // 🔹 Priority breakdown
        const priorityCount = allIssues.reduce((acc, issue) => {
          acc[issue.priority] = (acc[issue.priority] || 0) + 1;
          return acc;
        }, {});
        const priorityData = Object.entries(priorityCount).map(([name, value]) => ({
          name,
          value,
        }));

        // 🔹 Department breakdown
        const deptCount = allIssues.reduce((acc, issue) => {
          acc[issue.department] = (acc[issue.department] || 0) + 1;
          return acc;
        }, {});
        const departmentData = Object.entries(deptCount).map(([name, value]) => ({
          name,
          value,
        }));

        // 🔹 Final dashboard state
        setData({
          total: allIssues.length,
          pending: created.length,
          progress: assigned.length,
          resolved: approved.length,
          priority: priorityData,
          department: departmentData,
          recent: allIssues
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
            .slice(0, 5), // top 5 recent
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [auth, navigate]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="stats-cards">
          <StatsCard title="Total Issues" value={data.total} change="+12% from last month" icon={<FaExclamationTriangle />} color="#60a5fa" />
          <StatsCard title="Pending Issues" value={data.pending} change="-8% from last month" icon={<FaClock />} color="#fbbf24" />
          <StatsCard title="In Progress" value={data.progress} change="+15% from last month" icon={<FaChartLine />} color="#a78bfa" />
          <StatsCard title="Resolved" value={data.resolved} change="+23% from last month" icon={<FaCheck />} color="#34d399" />
        </div>

        {/* 🔹 Pass chart data */}
        <Charts priorityData={data.priority} departmentData={data.department} />

        {/* 🔹 Show recent issues */}
        <RecentIssues issues={data.recent} />
      </main>
    </div>
  );
};

export default Dashboard;
