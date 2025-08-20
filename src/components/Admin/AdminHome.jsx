// Components/Admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
const AdminHome = () => {
  const { auth } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("https://localhost:7033/api/issues", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [auth.token]);

  const handleAction = async (issueId, action) => {
    try {
      if (action === "assign") {
        // Example: assign to employee ID 2
        await axios.post(
          `https://localhost:7033/api/issues/assign`,
          { IssueId: issueId, EmployeeId: 2 },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
      } else if (action === "approve") {
        await axios.post(
          `https://localhost:7033/api/issues/approve`,
          { IssueId: issueId, ApprovedById: 1 }, // Admin ID
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
      }
      // Reload issues
      const res = await axios.get("https://localhost:7033/api/issues", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setIssues(res.data);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  if (loading) return <p>Loading issues...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Priority</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.issue_Id}>
              <td className="px-4 py-2 border">{issue.title}</td>
              <td className="px-4 py-2 border">{issue.status}</td>
              <td className="px-4 py-2 border">{issue.priority}</td>
              <td className="px-4 py-2 border">{issue.department}</td>
              <td className="px-4 py-2 border flex gap-2">
                {issue.status === "Pending" && (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAction(issue.issue_Id, "assign")}
                  >
                    Assign
                  </button>
                )}
                {issue.status === "Resolved" && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAction(issue.issue_Id, "approve")}
                  >
                    Approve
                  </button>
                )}
                {/* Add more buttons like Reject if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;
