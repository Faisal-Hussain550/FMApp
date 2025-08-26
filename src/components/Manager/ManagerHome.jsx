import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManagerHome.css";
import { useAuth } from "../Context/AuthContext";
import { FiRefreshCw } from "react-icons/fi";
import { FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerHome = () => {
  const { auth } = useAuth();
  const [issues, setIssues] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const fetchIssues = async () => {
    if (!auth?.token) return;
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:7033/api/issues/manager", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setIssues(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching issues:", err);
      toast.error("Failed to fetch issues!");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!auth?.token) return;
    try {
      const res = await axios.get("https://localhost:7033/api/Users", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setEmployees(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      toast.error("Failed to fetch employees!");
    }
  };

  const assignIssue = async (issueId) => {
    const employeeId = selectedEmployees[issueId];
    if (!employeeId) {
      toast.warning("⚠️ Please select an employee first!");
      return;
    }

    setAssigning((prev) => ({ ...prev, [issueId]: true }));

    try {
      const res = await axios.post(
        "https://localhost:7033/api/issues/assign",
        { issueId: parseInt(issueId), employeeId: parseInt(employeeId) },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      toast.success(res.data.message || "✅ Issue assigned successfully!");
      fetchIssues();
    } catch (err) {
      console.error("❌ Error assigning issue:", err.response || err);
      toast.error(err.response?.data?.title || "❌ Failed to assign issue");
    } finally {
      setAssigning((prev) => ({ ...prev, [issueId]: false }));
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchEmployees();
  }, [auth?.token]);

  const total = issues.length;
  const pending = issues.filter(
    (i) => i.status === "Pending" || i.status === "Open"
  ).length;
  const assigned = issues.filter(
    (i) => i.assignDeptEmp && i.assignDeptEmp !== -1
  ).length;

  return (
    <div className="manager-dashboard">
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "auto",
          minWidth: "300px",
        }}
      />

      <h1 className="dashboard-title">Manager Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <FaClipboardList size={32} color="#2563eb" />
          <div>
            <h2 className="card-value">{total}</h2>
            <p className="card-label">Total Issues</p>
          </div>
        </div>
        <div className="card">
          <FaClock size={32} color="#f59e0b" />
          <div>
            <h2 className="card-value">{pending}</h2>
            <p className="card-label">Pending</p>
          </div>
        </div>
        <div className="card">
          <FaCheckCircle size={32} color="#22c55e" />
          <div>
            <h2 className="card-value">{assigned}</h2>
            <p className="card-label">Assigned</p>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      <div className="issues-section">
        <div className="issues-header">
          <h2>Assigned Issues</h2>
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="refresh-btn"
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {issues.length === 0 ? (
          <div className="no-issues">✅ No issues assigned yet</div>
        ) : (
          <div className="issues-grid">
            {issues.map((issue) => (
              <div key={issue.issue_Id} className="issue-card">
                <div className="issue-details">
                  <p className="issue-id">
                    <strong>Issue ID:</strong> {issue.issue_Id}
                  </p>
                  <h3 className="issue-title">{issue.title}</h3>
                  <p className="issue-description">{issue.description}</p>
                  <p className="issue-info">
                    <strong>Priority:</strong> {issue.priority}
                  </p>
                  <p className="issue-info">
                    <strong>Department:</strong> {issue.department}
                  </p>
                  <p
                    className={`issue-status ${
                      issue.status === "Resolved"
                        ? "resolved"
                        : issue.status === "Pending"
                        ? "pending"
                        : "in-progress"
                    }`}
                  >
                    Status: {issue.status}
                  </p>

                  <div className="assign-section">
                    {issue.assignDeptEmp && issue.assignDeptEmp !== -1 ? (
                      <div className="assigned-message">
                        ✅ Assigned to{" "}
                        {employees.find(
                          (emp) => emp.id === issue.assignDeptEmp
                        )?.username || "Employee"}
                      </div>
                    ) : (
                      <>
                        <select
                          className="assign-select"
                          value={selectedEmployees[issue.issue_Id] || ""}
                          onChange={(e) =>
                            setSelectedEmployees((prev) => ({
                              ...prev,
                              [issue.issue_Id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">-- Select Employee --</option>
                          {employees
                            .filter(
                              (emp) => emp.role?.toLowerCase() === "employee"
                            )
                            .map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                {emp.username}
                              </option>
                            ))}
                        </select>

                        <button
                          className="assign-btn"
                          disabled={assigning[issue.issue_Id]}
                          onClick={() => assignIssue(issue.issue_Id)}
                        >
                          {assigning[issue.issue_Id] ? "Assigning..." : "Assign"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Side Images */}
                {issue.images?.length > 0 && (
                  <div className="issue-images-right">
                    {issue.images.map((img) => (
                      <img
                        key={img.issueImage_Id}
                        src={`https://localhost:7033${img.filePath}`}
                        alt="Issue"
                        className="issue-image"
                        onClick={() => setPreviewImage(`https://localhost:7033${img.filePath}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ManagerHome;
