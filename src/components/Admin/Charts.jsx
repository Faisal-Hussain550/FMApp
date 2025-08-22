import React from 'react';

const Charts = ({ priorityData, departmentData }) => {
  // Calculate totals first
  const priorityTotal = priorityData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const departmentTotal = departmentData?.reduce((sum, item) => sum + item.value, 0) || 0;

  // Color palette configuration - updated to include more departments
  const colorPalette = {
    priority: {
      'Critical': { bg: '#ef4444', dot: '#dc2626' },
      'High': { bg: '#f97316', dot: '#ea580c' },
      'Medium': { bg: '#fbbf24', dot: '#f59e0b' },
      'Low': { bg: '#22c55e', dot: '#16a34a' }
    },
    department: {
      'Maintenance': { bg: '#3b82f6', dot: '#2563eb' },
      'Security': { bg: '#8b5cf6', dot: '#7c3aed' },
      'IT': { bg: '#ec4899', dot: '#db2777' },
      'Operations': { bg: '#60a5fa', dot: '#3b82f6' },
      'Account': { bg: '#10b981', dot: '#059669' },
      'Accounts': { bg: '#10b981', dot: '#059669' },
      'Finance': { bg: '#f59e0b', dot: '#d97706' },
      'HR': { bg: '#ef4444', dot: '#dc2626' },
      'Admin': { bg: '#6366f1', dot: '#4f46e5' },
      'Facilities': { bg: '#84cc16', dot: '#65a30d' }
    }
  };

  // Dynamic color generation function for unknown categories
  const getColorForItem = (item, type) => {
    if (colorPalette[type] && colorPalette[type][item]) {
      return colorPalette[type][item];
    }
    
    // Generate colors dynamically for unknown items
    const fallbackColors = {
      priority: [
        { bg: '#ef4444', dot: '#dc2626' }, // red
        { bg: '#f97316', dot: '#ea580c' }, // orange  
        { bg: '#fbbf24', dot: '#f59e0b' }, // yellow
        { bg: '#22c55e', dot: '#16a34a' }, // green
        { bg: '#3b82f6', dot: '#2563eb' }  // blue
      ],
      department: [
        { bg: '#3b82f6', dot: '#2563eb' }, // blue
        { bg: '#8b5cf6', dot: '#7c3aed' }, // purple
        { bg: '#ec4899', dot: '#db2777' }, // pink
        { bg: '#10b981', dot: '#059669' }, // emerald
        { bg: '#f59e0b', dot: '#d97706' }, // amber
        { bg: '#ef4444', dot: '#dc2626' }, // red
        { bg: '#6366f1', dot: '#4f46e5' }, // indigo
        { bg: '#84cc16', dot: '#65a30d' }  // lime
      ]
    };
    
    // Use hash of item name to consistently assign colors
    const hash = item.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = fallbackColors[type];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const ChartSection = ({ title, subtitle, data, colorType, total }) => (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      
      <div className="chart-content">
        {data?.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          const width = total > 0 ? Math.max((item.value / total) * 100, 0) : 0;
          const colors = getColorForItem(item.name, colorType);
          
          // Debug logging for priority issues
          if (colorType === 'priority') {
            console.log(`Priority Debug - Item:`, item, `ColorType: ${colorType}`, `Colors:`, colors);
          }
          
          return (
            <div key={`${colorType}-${item.name}-${index}`} className="chart-row">
              <div className="chart-label-section">
                <div 
                  className="chart-dot"
                  style={{ 
                    backgroundColor: colors.dot,
                    boxShadow: `0 0 0 2px ${colors.bg}20`
                  }}
                />
                <span className="chart-label">{item.name}</span>
              </div>
              
              <div className="chart-bar-container">
                <div className="chart-bar-background">
                  <div
                    className="chart-bar-fill"
                    style={{ 
                      backgroundColor: colors.bg,
                      width: `${width}%`,
                      boxShadow: width > 0 ? `0 0 4px ${colors.bg}40` : 'none',
                      background: colors.bg
                    }}
                  />
                </div>
              </div>
              
              <div className="chart-value">
                {item.value} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .chart-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 24px;
          transition: all 0.2s ease;
        }
        
        .chart-container:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .chart-header {
          margin-bottom: 24px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 16px;
        }
        
        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          line-height: 1.4;
          letter-spacing: -0.025em;
        }
        
        .chart-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
          font-weight: 400;
        }
        
        .chart-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .chart-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          transition: all 0.2s ease;
        }
        
        .chart-row:hover {
          transform: translateX(2px);
        }
        
        .chart-label-section {
          display: flex;
          align-items: center;
          min-width: 80px;
          flex-shrink: 0;
        }
        
        .chart-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .chart-row:hover .chart-dot {
          transform: scale(1.2);
        }
        
        .chart-label {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        
        .chart-row:hover .chart-label {
          color: #111827;
        }
        
        .chart-bar-container {
          flex: 1;
          margin: 0 20px;
          min-width: 100px;
        }
        
        .chart-bar-background {
          height: 8px;
          background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          border: 1px solid #e2e8f0;
        }
        
        .chart-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        .chart-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          border-radius: 3px;
        }
        
        .chart-value {
          font-size: 13px;
          color: #374151;
          font-weight: 600;
          text-align: right;
          min-width: 70px;
          flex-shrink: 0;
          font-variant-numeric: tabular-nums;
          transition: color 0.2s ease;
        }
        
        .chart-row:hover .chart-value {
          color: #111827;
        }
        
        @media (max-width: 768px) {
          .chart-container {
            padding: 16px;
          }
          
          .chart-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
          }
          
          .chart-title {
            font-size: 16px;
          }
          
          .chart-content {
            gap: 12px;
          }
          
          .chart-label-section {
            min-width: 70px;
          }
          
          .chart-bar-container {
            margin: 0 12px;
          }
          
          .chart-value {
            font-size: 12px;
            min-width: 60px;
          }
        }
        
        /* Animation keyframes */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .chart-row {
          animation: slideIn 0.5s ease forwards;
        }
        
        .chart-row:nth-child(1) { animation-delay: 0.1s; }
        .chart-row:nth-child(2) { animation-delay: 0.2s; }
        .chart-row:nth-child(3) { animation-delay: 0.3s; }
        .chart-row:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <ChartSection 
          title="Issues by Priority" 
          subtitle="Distribution of issue priorities"
          data={priorityData}
          colorType="priority"
          total={priorityTotal}
        />
        
        <ChartSection 
          title="Issues by Department" 
          subtitle="Distribution across departments"
          data={departmentData}
          colorType="department"
          total={departmentTotal}
        />
      </div>
    </>
  );
};

export default Charts;