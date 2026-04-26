import React from "react";
import {
  FaTrash,
  FaMapMarkerAlt,
  FaRoute,
  FaChartBar,
  FaHeadphones,
  FaBullhorn,
} from "react-icons/fa";

const services = [
  {
    icon: <FaTrash />,
    title: "Smart Waste Monitoring",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Intelligent Collection Management",
  },
  {
    icon: <FaRoute />,
    title: "Route Optimization",
  },
  {
    icon: <FaChartBar />,
    title: "Dashboard & Reporting",
  },
  {
    icon: <FaHeadphones />,
    title: "Awareness & Engagement",
  },
  {
    icon: <FaBullhorn />,
    title: "Integration & Support",
  },
];

const Services = () => {
  return (
    <section className="bg-gray-100 py-16 px-10">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">Our <span className="text-green-500">Services</span></h2>

        <p className="text-gray-600 mb-12">Smart solution for cleaner cities</p>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center hover:scale-105 transition duration-300"
            >
              <div className="text-green-600 text-4xl mb-4">{service.icon}</div>

              <h3 className="text-gray-800 font-medium text-center">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
