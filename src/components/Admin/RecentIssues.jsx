const RecentIssues = ({ issues }) => {
  return (
    <div className="recent-issues">
      <h4>Recent Issues</h4>
      <ul>
        {issues.map((issue, i) => (
          <li key={i}>
            <strong>{issue.title}</strong> - {issue.priority} ({issue.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentIssues;
