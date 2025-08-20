import { FaTachometerAlt, FaTasks, FaPlus, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Facility Manager</h2>
      <ul className="menu">
        <li><FaTachometerAlt /> Dashboard</li>
        <li><FaTasks /> Issues</li>
        <li><FaPlus /> Report Issue</li>
        <li><FaCog /> Settings</li>
      </ul>

      <div className="quick-stats">
        <h4>Quick Stats</h4>
        <p><strong>Role:</strong> Employee</p>
        <p><strong>Department:</strong> Security</p>
      </div>
    </div>
  );
};

export default Sidebar;
