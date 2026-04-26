import React from "react";
import {
  FaTrash,
  FaBell,
  FaUser,
  FaChartBar,
  FaBroom,
  FaLock,
} from "react-icons/fa";

const features = [
  {
    icon: <FaTrash />,
    title: "Real-time Bin Monitoring",
    desc: "Sensors track fill levels instantly, ensuring bins never overflow.",
  },
  {
    icon: <FaBell />,
    title: "Smart Alerts System",
    desc: "Automatic notifications sent to admins when bins are nearly full.",
  },
  {
    icon: <FaUser />,
    title: "Collector Assignment",
    desc: "Admins can assign nearest collectors quickly for efficient pickups.",
  },
  {
    icon: <FaChartBar />,
    title: "Analytics & Reports",
    desc: "Monitor collection trends, bin usage, and efficiency over time.",
  },
  {
    icon: <FaBroom />,
    title: "Cleanliness Awareness",
    desc: "Users get tips and reminders to maintain community hygiene.",
  },
  {
    icon: <FaLock />,
    title: "Secure Admin Portal",
    desc: "Role-based access with secure login to manage all system features.",
  },
];

const Features = () => {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold  mb-3">Our <span className="text-green-500">Features</span></h2>

        <p className="text-gray-600 mb-12">
          Powerful smart technologies that enhance monitoring, collection, and
          reporting in real time.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white border-2 border-green-500 rounded-xl p-6 hover:shadow-lg hover:cursor-pointer hover:-translate-y-1 transition duration-300"
            >
              <div className="text-green-600 text-3xl mb-4 flex justify-center">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>

              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
