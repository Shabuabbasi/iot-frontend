import React from "react";
import {
  FaTrash,
  FaClock,
  FaVirus,
  FaSearch,
  FaWifi,
  FaCamera,
  FaBell,
  FaUserCheck,
  FaChartBar,
} from "react-icons/fa";

const problems = [
  { icon: <FaTrash />, text: "Over flowing waste bins" },
  { icon: <FaClock />, text: "No real-time monitoring" },
  { icon: <FaVirus />, text: "Health risks & diseases" },
  { icon: <FaSearch />, text: "Delayed waste collection" },
  { icon: <FaSearch />, text: "Lack of evidence & transparency" },
];

const solutions = [
  { icon: <FaWifi />, text: "IoT Sensor-Based Monitoring" },
  { icon: <FaCamera />, text: "Real-Time Camera Verification" },
  { icon: <FaBell />, text: "Instant Alerts & Notifications" },
  { icon: <FaUserCheck />, text: "Automated Collector Assignment" },
  { icon: <FaChartBar />, text: "Dashboard Analytics" },
];

const ProblemsSolutions = () => {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-3">
          <span className="text-green-500">Problems</span> Vs <span className="text-green-500">Solutions</span>
        </h2>

        <p className="text-gray-600 mb-12">
          A smarter and faster way to manage city waste through real-time
          insights and automated collection.
        </p>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10 ">
          {/* Problems */}
          <div className="bg-[#E7FFF0] border-2 border-green-500 rounded-xl p-8  shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Common Problems
            </h3>

            <ul className="space-y-4">
              {problems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <span className="text-red-500 text-lg">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-[#E7FFF0] border-2 border-green-500 rounded-xl p-8 text-left shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Our Smart Solution
            </h3>

            <ul className="space-y-4">
              {solutions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <span className="text-green-600 text-lg">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSolutions;
