import React from "react";
import { Search } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";

const TasksManagement = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Tasks Management" 
        subtitle="Manage and assign tasks to collectors" 
      />


      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Tasks", value: 128 },
          { title: "Assigned Tasks", value: 42 },
          { title: "Pending Tasks", value: 86 },
           { title: "Complete Tasks", value: 29 },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-xl font-bold">{item.value}</h2>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              ✓
            </div>
          </div>
        ))}
      </div>

<div className="bg-white p-6 rounded-xl">

  {/* TOP ROW */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* LEFT */}
    <div>
      <h1 className="text-xl font-bold text-gray-800">Tasks List</h1>
      <p className="text-xs text-gray-500 mt-1">32 active tasks found</p>
    </div>

    {/* RIGHT */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
      {/* Search */}
      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex-1 sm:w-64">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="ml-2 text-sm bg-transparent outline-none w-full"
        />
      </div>

      {/* Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all whitespace-nowrap">
        + Assign new task
      </button>
    </div>
  </div>

  {/* TABS */}
  <div className="flex gap-6 mt-5 border-b">

    <button className="pb-2 text-sm font-medium text-[#80A615] border-b-2 border-[#80A615]">
      Assigned
    </button>

    <button className="pb-2 text-sm text-gray-500 hover:text-black">
      On the way
    </button>

    <button className="pb-2 text-sm text-gray-500 hover:text-black">
      In Progress
    </button>

     <button className="pb-2 text-sm text-gray-500 hover:text-black">
      Complete
    </button>

  </div>

</div>
      </div>

  )
}

export default TasksManagement
