import { FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header">
      <h2>Dashboard</h2>
      <div className="header-right">
        <FaBell className="icon" />
        <div className="user-profile">
          <FaUserCircle size={30} />
          <div>
            <p><strong>Lisa Employee</strong></p>
            <small>Employee</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
