import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Charts = ({ priorityData, departmentData }) => {
  return (
    <div className="charts">
      <div className="chart-box">
        <h4>Issues by Priority</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={priorityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h4>Issues by Department</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={departmentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
