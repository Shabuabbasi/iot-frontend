import React from 'react'
import DashboardHeader from "../../../components/DashboardHeader";

const AdminReports = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Admin Reports" 
        subtitle="View system performance and activity logs" 
      />
      <p className="text-gray-600">This is the Admin Reports page. Here you can view various reports related to admin activities and system performance.</p>  
    </div>
  )
}

export default AdminReports
