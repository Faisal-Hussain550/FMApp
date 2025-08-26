import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { CheckCircle } from "lucide-react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const { auth } = useAuth();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [files, setFiles] = useState({});
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    // Dummy issues for testing
    const dummyIssues = [
      {
        id: 1,
        title: "Server Down",
        description: "The main server is currently offline.",
        admin: "Admin User",
        createdAt: new Date().toISOString(),
        assignedTo: "Ali Khan",
        status: "In Progress",
      },
      {
        id: 2,
        title: "Billing Error",
        description: "Invoice calculation issue in billing system.",
        admin: "System Admin",
        createdAt: new Date().toISOString(),
        assignedTo: "Ali Khan",
        status: "In Progress",
      },
      {
        id: 3,
        title: "Database Maintenance",
        description: "Scheduled maintenance tonight at 11 PM.",
        admin: "Support Team",
        createdAt: new Date().toISOString(),
        assignedTo: "Ali Khan",
        status: "Completed",
        remark: "Resolved by restarting server",
        file: { name: "maintenance-log.png" },
      },
    ];

    // For testing, show all issues regardless of auth
    setAssignedIssues(dummyIssues);

    // For real auth filtering, uncomment below:
    // const userIssues = dummyIssues.filter(
    //   (issue) => issue.assignedTo === auth?.userName
    // );
    // setAssignedIssues(userIssues);
  }, [auth]);

  const handleFileChange = (issueId, e) => {
    setFiles((prev) => ({ ...prev, [issueId]: e.target.files[0] }));
  };

  const handleRemarkChange = (issueId, e) => {
    setRemarks((prev) => ({ ...prev, [issueId]: e.target.value }));
  };

  const markCompleted = (issueId) => {
    setAssignedIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              status: "Completed",
              remark: remarks[issueId] || "",
              file: files[issueId] ? { name: files[issueId].name } : null,
            }
          : issue
      )
    );
    setFiles((prev) => ({ ...prev, [issueId]: null }));
    setRemarks((prev) => ({ ...prev, [issueId]: "" }));
  };

  return (
    <div className="employee-dashboard">
      <h1 className="dashboard-title">Employee Dashboard</h1>

      {assignedIssues.length === 0 ? (
        <p className="empty-text">🎉 No assigned issues</p>
      ) : (
        <div className="issues-grid">
          {assignedIssues.map((issue) => (
            <div
              key={issue.id}
              className={`issue-card ${
                issue.status === "Completed" ? "completed" : "in-progress"
              }`}
            >
              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-desc">{issue.description}</p>
              <p className="issue-meta">
                Reported by: <span>{issue.admin}</span> •{" "}
                {new Date(issue.createdAt).toLocaleString()}
              </p>
              <p
                className={`issue-status ${
                  issue.status === "Completed"
                    ? "status-completed"
                    : "status-progress"
                }`}
              >
                Status: {issue.status}
              </p>

              {issue.status !== "Completed" ? (
                <>
                  <textarea
                    className="remark-input"
                    placeholder="Add remark after resolution"
                    value={remarks[issue.id] || ""}
                    onChange={(e) => handleRemarkChange(issue.id, e)}
                  />
                  <input
                    type="file"
                    className="file-input"
                    onChange={(e) => handleFileChange(issue.id, e)}
                  />
                  <button
                    className="complete-btn"
                    onClick={() => markCompleted(issue.id)}
                  >
                    <CheckCircle size={18} /> Mark as Completed
                  </button>
                </>
              ) : (
                <div className="completed-info">
                  <p>Remark: {issue.remark}</p>
                  {issue.file && <p>Uploaded File: {issue.file.name}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
