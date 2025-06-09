import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  const getColorClasses = (color: string): { bg: string; text: string; iconBg: string } => {
    switch (color) {
      case 'primary':
        return { bg: 'bg-primary-50', text: 'text-primary-600', iconBg: 'bg-primary-500' };
      case 'secondary':
        return { bg: 'bg-secondary-50', text: 'text-secondary-600', iconBg: 'bg-secondary-500' };
      case 'accent':
        return { bg: 'bg-accent-50', text: 'text-accent-600', iconBg: 'bg-accent-500' };
      case 'success':
        return { bg: 'bg-success-500/10', text: 'text-success-500', iconBg: 'bg-success-500' };
      case 'warning':
        return { bg: 'bg-warning-500/10', text: 'text-warning-500', iconBg: 'bg-warning-500' };
      case 'error':
        return { bg: 'bg-error-500/10', text: 'text-error-500', iconBg: 'bg-error-500' };
      default:
        return { bg: 'bg-primary-50', text: 'text-primary-600', iconBg: 'bg-primary-500' };
    }
  };

  const colors = getColorClasses(color);

  // Format currency values
  const formatValue = (value: string | number) => {
    if (typeof value === 'number' && title.toLowerCase().includes('valor')) {
      return `S/ ${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <div className="card flex flex-col p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <p className="text-2xl font-semibold mt-2">{formatValue(value)}</p>
          
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <span className={trend.positive ? 'text-success-500' : 'text-error-500'}>
                {trend.positive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-neutral-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        
        <div className={`${colors.iconBg} p-3 rounded-full text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;