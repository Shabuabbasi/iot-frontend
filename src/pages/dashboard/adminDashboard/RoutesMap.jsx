import React from 'react'
import DashboardHeader from "../../../components/DashboardHeader";

const RoutesMap = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Routes Map" 
        subtitle="Track collector movements and optimized routes" 
      />
      <p className="text-gray-600">This is the Routes Map page. Here you can view the routes of all collectors and track their movements.</p>
    </div>
  )
}

export default RoutesMap
