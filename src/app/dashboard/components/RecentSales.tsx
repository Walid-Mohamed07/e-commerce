import React from 'react';

const RecentSales: React.FC = () => {
  const sales = [
    { name: 'John Doe', amount: '$350' },
    { name: 'Jane Smith', amount: '$150' },
    { name: 'Sam Brown', amount: '$450' },
    { name: 'Linda White', amount: '$250' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="font-bold mb-4">Recent Sales</h2>
      <ul>
        {sales.map((sale, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{sale.name}</span>
            <span>{sale.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSales;
