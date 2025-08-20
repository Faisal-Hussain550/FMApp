const StatsCard = ({ title, value, change, icon, color }) => {
  return (
    <div className="card">
      <div className="card-info">
        <h4>{title}</h4>
        <h2>{value}</h2>
        <p style={{ color: change.includes("-") ? "red" : "green" }}>{change}</p>
      </div>
      <div className="card-icon" style={{ background: color }}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
