import React from "react";
import DashboardHeader from "../../../components/DashboardHeader";

const Reports = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Reports & Analytics" 
        subtitle="View your performance reports and collection stats" 
      />
      <div className="p-6">
        <p className="text-gray-500">Your performance reports will appear here.</p>
      </div>
    </div>
  );
};

export default Reports;
