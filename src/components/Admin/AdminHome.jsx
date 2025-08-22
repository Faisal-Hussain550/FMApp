import { useEffect, useState } from "react";
import axios from "axios";

import Header from "./Header";
import StatsCard from "../Common/StatsCard";
import Charts from "./Charts";
import RecentIssues from "../Common/RecentIssues";
import { FaExclamationTriangle, FaClock, FaChartLine, FaCheck } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
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
    recent: [],
  });

  useEffect(() => {
    if (!auth?.token) {
      navigate("/"); // redirect if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7033/api/issues/all",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const allIssues = res.data.data || [];

        // Priority breakdown
        const priorityCount = allIssues.reduce((acc, issue) => {
          const priority = issue.priority || issue.Priority;
          if (priority) acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        }, {});
        const priorityData = Object.entries(priorityCount).map(([name, value]) => ({ name, value }));

        // Department breakdown
        const deptCount = allIssues.reduce((acc, issue) => {
          const dept = issue.department || issue.Department;
          if (dept) acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});
        const departmentData = Object.entries(deptCount).map(([name, value]) => ({ name, value }));

        // Recent issues (latest 5)
        const recentIssues = [...allIssues]
          .sort((a, b) => new Date(b.createdAt || b.CreatedAt) - new Date(a.createdAt || a.CreatedAt))
          .slice(0, 5);

        // Status counts
        const pending = allIssues.filter(issue => (issue.status || issue.Status) === "Pending").length;
        const progress = allIssues.filter(issue => (issue.status || issue.Status) === "InProgress").length;
        const resolved = allIssues.filter(issue => (issue.status || issue.Status) === "Resolved").length;

        setData({
          total: allIssues.length,
          pending,
          progress,
          resolved,
          priority: priorityData,
          department: departmentData,
          recent: recentIssues,
        });
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [auth, navigate]);

  return (
    <div className="dashboard-container">
     
      <main className="main">
        <Header />
        <div className="stats-cards">
          <StatsCard
            title="Total Issues"
            value={data.total}
            change="+12% from last month"
            icon={<FaExclamationTriangle />}
            color="#60a5fa"
          />
          <StatsCard
            title="Pending Issues"
            value={data.pending}
            change="-8% from last month"
            icon={<FaClock />}
            color="#fbbf24"
          />
          <StatsCard
            title="In Progress"
            value={data.progress}
            change="+15% from last month"
            icon={<FaChartLine />}
            color="#a78bfa"
          />
          <StatsCard
            title="Resolved"
            value={data.resolved}
            change="+23% from last month"
            icon={<FaCheck />}
            color="#34d399"
          />
        </div>

        <Charts priorityData={data.priority} departmentData={data.department} />

        <RecentIssues issues={data.recent} />
      </main>
    </div>
  );
};

export default Dashboard;
