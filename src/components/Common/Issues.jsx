// src/components/Admin/Issues.jsx
import React, { useEffect, useState } from "react";
import RecentIssues from "./RecentIssues";
import StatsCard from "./StatsCard";
import { FaExclamationCircle, FaCheck, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../Context/AuthContext"; // ✅ Correct import

const AdminIssues = () => {
  const { auth } = useAuth(); // ✅ get auth (with token, role, username)
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState([
    { title: "Total Issues", value: 0, change: "+0", icon: <FaExclamationCircle />, color: "#3b82f6" },
    { title: "Resolved Issues", value: 0, change: "+0", icon: <FaCheck />, color: "#10b981" },
    { title: "Pending Issues", value: 0, change: "+0", icon: <FaSpinner />, color: "#f59e0b" },
  ]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(
          "https://localhost:7033/api/issues/all?page=1&pageSize=100",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`, // ✅ secure API call
            },
          }
        );

        const issuesData = res.data.data || [];
        setIssues(issuesData);

        // Stats
        const total = issuesData.length;
        const resolved = issuesData.filter((i) => i.status === "Resolved").length;
        const pending = issuesData.filter((i) => i.status === "Pending").length;

        setStats([
          { title: "Total Issues", value: total, change: "+0", icon: <FaExclamationCircle />, color: "#3b82f6" },
          { title: "Resolved Issues", value: resolved, change: "+0", icon: <FaCheck />, color: "#10b981" },
          { title: "Pending Issues", value: pending, change: "+0", icon: <FaSpinner />, color: "#f59e0b" },
        ]);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    if (auth.token) {
      fetchIssues();
    }
  }, [auth.token]);

  return (
    <div className="admin-issues-page">
      <h1 className="page-title">Admin Issues</h1>

      {/* Stats Section */}
      <div className="stats-cards">
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Issues */}
      <RecentIssues issues={issues} />
    </div>
  );
};

export default AdminIssues;
