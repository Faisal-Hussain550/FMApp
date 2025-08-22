import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ title, value, change, icon, color }) => {
  return (
    <div className="stats-card">
      <div className="card-info">
        <h4 className="card-title">{title}</h4>
        <h2 className="card-value">{value}</h2>
        <p
          className="card-change"
          style={{ color: change.includes("-") ? "#dc2626" : "#16a34a" }}
        >
          {change}
        </p>
      </div>
      <div
        className="card-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <style jsx>{`
        .stats-card {
          background: #ffffff;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .card-change {
          font-size: 14px;
          font-weight: 500;
        }

        .card-icon {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          color: #ffffff;
          font-size: 24px;
        }

        @media (max-width: 768px) {
          .stats-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .card-icon {
            width: 100%;
            font-size: 28px;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired
};

export default StatsCard;
