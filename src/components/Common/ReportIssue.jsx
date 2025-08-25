// src/components/Common/ReportIssue.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNotification } from "../Context/NotificationContext"; 

const ReportIssue = () => {
  const { auth } = useAuth();
  const { addNotification } = useNotification(); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    priority: "Medium",
  });
  const [selectedManager, setSelectedManager] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [managers, setManagers] = useState([]);

  // ✅ Fetch real managers from API
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get("https://localhost:7033/api/Users", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });

        const managersOnly = res.data.filter(
          (u) => u.role?.toLowerCase() === "manager"
        );

        setManagers(managersOnly);
      } catch (err) {
        console.error("Error fetching managers:", err);
      }
    };

    if (auth?.token) fetchManagers();
  }, [auth?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const payload = new FormData();
    payload.append("Title", formData.title);
    payload.append("Description", formData.description);
    payload.append("Department", formData.department);
    payload.append("Priority", formData.priority);
    payload.append("CreatedById", auth?.userId || 0);

    images.forEach((file) => payload.append("Images", file));

    const res = await axios.post(
      "https://localhost:7033/api/issues/create",
      payload,
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      setMessage("✅ Issue reported successfully!");

      // ✅ Send notification to selected manager
      if (selectedManager) {
        addNotification({
          managerId: Number(selectedManager), // who should receive it
          issueId: res.data?.id || null,      // backend issue id (if available)
          title: formData.title,
          description: formData.description,
          admin: auth?.username || "Unknown", // who created it
        });
      }

      // ✅ Reset form
      setFormData({
        title: "",
        description: "",
        department: "",
        priority: "Medium",
      });
      setSelectedManager("");
      setImages([]);
    }
  } catch (error) {
    console.error(error);
    setMessage("❌ Failed to report issue.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="report-page">
      {/* === STYLES (unchanged) === */}
      <style>{`
        .report-page { min-height: 100vh; background-color: #f9fafb; font-family: 'Inter', sans-serif; padding: 3rem 5%; color: #111827; }
        .report-title { font-size: 2.75rem; font-weight: 900; margin-bottom: 0.25rem; letter-spacing: -0.5px; }
        .report-subtitle { font-weight: 600; margin-bottom: 2.5rem; color: #4b5563; }
        .report-form .form-section { background: #ffffff; padding: 2.25rem; border-radius: 1rem; box-shadow: 0 8px 20px rgba(0,0,0,0.05); margin-bottom: 2rem; transition: all 0.3s ease; }
        .report-form .form-section:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { font-weight: 700; display: block; font-size: 1.25rem; margin-bottom: 0.5rem; color: #111827; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%; padding: 1rem 1.25rem; border-radius: 0.75rem; font-size: 1.15rem; border: 1px solid #d1d5db;
          font-weight: 500; background-color: #fefefe; outline: none; transition: all 0.3s ease;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); background-color: #ffffff; }
        textarea { resize: none; height: 8rem; }
        .form-row { display: flex; flex-wrap: wrap; gap: 1rem; }
        .flex-1 { flex: 1; }
        .file-upload { border: 2px dashed #d1d5db; border-radius: 0.75rem; padding: 1.75rem; text-align: center; cursor: pointer; background-color: #f3f4f6; font-weight: 600; transition: all 0.3s ease; }
        .file-upload:hover { border-color: #3b82f6; background-color: #eff6ff; }
        .file-upload input { display: none; }
        .file-label { color: #3b82f6; cursor: pointer; font-weight: 700; }
        .image-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
        .preview-box { width: 6rem; height: 6rem; border-radius: 0.5rem; overflow: hidden; border: 1px solid #d1d5db; box-shadow: 0 4px 10px rgba(0,0,0,0.04); transition: transform 0.3s ease; }
        .preview-box:hover { transform: scale(1.05); }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .notes { background-color: #fefce8; border-left: 5px solid #f59e0b; padding: 1rem 1.25rem; font-weight: 600; border-radius: 0.5rem; margin-bottom: 2rem; }
        .notes ul { margin-top: 0.5rem; list-style: disc inside; font-weight: 500; }
        .form-buttons { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .form-buttons button:first-child { padding: 0.5rem 1rem; font-size: 0.9rem; background-color: transparent; color: #6b7280; border: 1px solid #d1d5db; border-radius: 0.5rem; min-width: 100px; font-weight: 500; }
        .form-buttons button:first-child:hover { background-color: #f3f4f6; color: #374151; }
        .form-buttons button:last-child { padding: 1rem 2.5rem; font-size: 1.2rem; background: linear-gradient(90deg, #3b82f6, #2563eb); color: #ffffff; border: none; border-radius: 0.75rem; min-width: 300px; font-weight: 700; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: transform 0.2s ease; }
        .form-buttons button:last-child:hover { transform: scale(1.05); }
        .form-buttons button:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <h2 className="report-title">Report New Issue</h2>
      <p className="report-subtitle">Provide detailed information about the facility issue</p>

      <form onSubmit={handleSubmit} className="report-form">
        {/* === Title & Description === */}
        <div className="form-section">
          <div className="form-group">
            <label>Issue Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Detailed Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
        </div>

        {/* === Department, Priority & Manager === */}
        <div className="form-section">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Priority Level *</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* ✅ Real Managers from API */}
          <div className="form-group">
            <label>Tag Manager *</label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              required
            >
              <option value="">-- Select Manager --</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username} {m.department && `- ${m.department}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* === Upload === */}
        <div className="form-section">
          <div className="form-group">
            <label>Issue Photos</label>
            <div className="file-upload">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} id="fileUpload" />
              <label htmlFor="fileUpload" className="file-label">Add photos</label>
              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((img, idx) => (
                    <div key={idx} className="preview-box">
                      <img src={URL.createObjectURL(img)} alt="preview" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === Notes === */}
        <div className="notes">
          <strong>Important Notes:</strong>
          <ul>
            <li>For emergency issues, contact security immediately</li>
            <li>Include as much detail as possible</li>
            <li>You will receive notifications about your report</li>
          </ul>
        </div>

        {/* === Buttons === */}
        <div className="form-buttons">
          <button type="button" onClick={() => setFormData({ title: "", description: "", department: "", priority: "Medium" })}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Issue Report"}
          </button>
        </div>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ReportIssue;
