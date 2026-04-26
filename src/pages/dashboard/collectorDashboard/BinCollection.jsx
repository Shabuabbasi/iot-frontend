import React from 'react'
import DashboardHeader from "../../../components/DashboardHeader";

const BinCollection = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Bin Collections" 
        subtitle="Track your daily waste collection progress" 
      />
      <div className="p-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Today's Collections
          </h3>
          <p className="text-gray-500">No collections recorded yet for today.</p>
        </div>
      </div>
    </div>
  )
}

export default BinCollection
