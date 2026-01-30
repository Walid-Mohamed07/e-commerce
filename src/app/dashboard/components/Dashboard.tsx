import React from "react";
import SummaryCard from "./summary-card";
import RecentSales from "./RecentSales";

const Dashboard: React.FC = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col gap-16 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SummaryCard
          title="Total Sales"
          value="$2,450"
          percentage="+12%"
          isPositive={true}
        />
        <SummaryCard
          title="Total Orders"
          value="1,250"
          percentage="-5%"
          isPositive={false}
        />
        <SummaryCard
          title="New Customers"
          value="50"
          percentage="+20%"
          isPositive={true}
        />
        <SummaryCard
          title="Pending Orders"
          value="15"
          percentage="+3%"
          isPositive={true}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <RecentSales />
      </div>
    </div>
  );
};

export default Dashboard;
