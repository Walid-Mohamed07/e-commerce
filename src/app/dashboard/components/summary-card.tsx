import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, percentage, isPositive }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
      <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {percentage}
      </div>
    </div>
  );
};

export default SummaryCard;
