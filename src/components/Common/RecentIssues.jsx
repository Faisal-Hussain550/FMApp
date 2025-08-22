import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { FaBuilding, FaClock, FaCheckCircle } from 'react-icons/fa';

const priorityColors = {
  Low:      { bg: '#ffffff', text: '#065f46', accent: '#10b981' },
  Medium:   { bg: '#ffffff', text: '#78350f', accent: '#f59e0b' },
  High:     { bg: '#fff0f0', text: '#991b1b', accent: '#ef4444' },   // light red
  Critical: { bg: '#ffe5e5', text: '#7f1d1d', accent: '#dc2626' }    // stronger red
};

const statusColors = {
  Pending:  { bg: '#e5e7eb', text: '#374151' },
  Assigned: { bg: '#dbeafe', text: '#1e3a8a' },
  Resolved: { bg: '#bbf7d0', text: '#065f46' }
};

// --- NEW: normalize helpers so we hit the right color buckets ---
const normalizePriority = (val) => {
  const v = (val ?? '').toString().trim().toLowerCase();
  // direct matches
  if (v === 'low' || v === 'medium' || v === 'high' || v === 'critical') {
    return v[0].toUpperCase() + v.slice(1);
  }
  // numeric or common aliases from APIs
  const map = {
    '1': 'Low',
    '2': 'Medium',
    '3': 'High',
    '4': 'Critical',
    'urgent': 'High',
    'highest': 'Critical',
    'normal': 'Medium'
  };
  return map[v] || 'Low';
};

const normalizeStatus = (val) => {
  const v = (val ?? '').toString().trim().toLowerCase();
  if (v === 'pending' || v === 'assigned' || v === 'resolved') {
    return v[0].toUpperCase() + v.slice(1);
  }
  // fallback
  return 'Pending';
};

const RecentIssues = ({ issues }) => {
  return (
    <div className="recent-issues">
      <h2 className="title">Recent Issues</h2>

      <div className="issue-list">
        {issues.map((issue, idx) => {
          const priorityKey = normalizePriority(issue.priority);
          const statusKey = normalizeStatus(issue.status);

          const pColor = priorityColors[priorityKey] || priorityColors.Low;
          const sColor = statusColors[statusKey] || statusColors.Pending;

          return (
            <article
              key={idx}
              className="issue-card"
              style={{
                backgroundColor: pColor.bg,
                borderLeft: `6px solid ${pColor.accent}`
              }}
            >
              <div className="issue-left">
                <div className="issue-header">
                  <h3 className="issue-title">{issue.title}</h3>
                  <span
                    className="priority-badge"
                    style={{
                      color: pColor.text,
                      borderColor: pColor.accent,
                      backgroundColor: `${pColor.accent}20` // semi-tint
                    }}
                  >
                    {issue.priority}
                  </span>
                </div>
                <p className="issue-description">{issue.description}</p>
              </div>

              <div className="issue-meta">
                <div className="meta-item">
                  <FaBuilding className="icon" />
                  <span>{issue.department}</span>
                </div>
                <div className="meta-item">
                  <FaCheckCircle className="icon" />
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: sColor.bg,
                      color: sColor.text
                    }}
                  >
                    {issue.status}
                  </span>
                </div>
                <div className="meta-item">
                  <FaClock className="icon" />
                  <span>{dayjs(issue.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style jsx>{`
        .recent-issues {
          padding: 32px;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 24px;
        }

        .issue-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .issue-card {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-radius: 12px;
          transition: all 0.25s ease;
          padding: 18px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .issue-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.12);
        }

        .issue-left {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .issue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .issue-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-right: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .priority-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid;
        }

        .issue-description {
          font-size: 13px;
          color: #374151;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .issue-meta {
          flex: 0 0 220px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          text-align: right;
        }

        .meta-item {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #374151;
        }

        .icon {
          color: #6b7280;
        }

        .status-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
        }

        @media (max-width: 768px) {
          .issue-card {
            flex-direction: column;
            min-height: auto;
          }

          .issue-meta {
            text-align: left;
            flex-direction: row;
            justify-content: flex-start;
            gap: 16px;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
};

RecentIssues.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      title:       PropTypes.string.isRequired,
      priority:    PropTypes.oneOfType([
                      PropTypes.oneOf(['Low', 'Medium', 'High', 'Critical']),
                      PropTypes.string,
                      PropTypes.number
                    ]).isRequired,
      status:      PropTypes.oneOfType([
                      PropTypes.oneOf(['Pending', 'Assigned', 'Resolved']),
                      PropTypes.string
                    ]).isRequired,
      description: PropTypes.string.isRequired,
      department:  PropTypes.string.isRequired,
      createdAt:   PropTypes.string.isRequired
    })
  ).isRequired
};

export default RecentIssues;
