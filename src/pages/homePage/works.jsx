import React from "react";
import { FaSatelliteDish, FaCamera, FaBell, FaTruck } from "react-icons/fa";

const Works = () => {
  return (
    <section className="bg-gray-100 py-16 px-6">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">
          How System <span className="text-green-500">Works</span>
        </h2>

        <p className="text-gray-600 mt-3 max-w-xl mx-auto">
          A smart and automated workflow that keeps your city clean faster and
          more efficiently.
        </p>
      </div>

      {/* Steps */}
      <div className="  flex flex-col gap-5  w-[80%] mx-auto">
        {/* Step 1 */}
        <div className="flex items-center gap-4 p-6 border-2 border-green-500 rounded-xl bg-[#E7FFF0]  max-w-[600px]">
          <div className="text-green-500">
            <FaSatelliteDish size={40} />
          </div>

          <div>
            <h3 className="font-bold mb-2">1. Detect</h3>
            <p className="text-gray-600 text-sm">
              Our IoT ultrasonic sensors continuously measure how full each bin
              is (0–90% level). As soon as the bin approaches its threshold, the
              system automatically prepares to take action.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-4 p-6 border-2 border-green-500 rounded-xl bg-[#E7FFF0] max-w-[600px] ml-auto">
          <div className="text-green-500">
            <FaCamera size={40} />
          </div>

          <div>
            <h3 className="font-bold mb-2">2. Verify</h3>
            <p className="text-gray-600 text-sm">
              An integrated ESP32-CAM captures a real-time snapshot of the bin.
              This image helps the admin confirm if the bin truly needs
              collection, reducing false alerts.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-4 p-6 border-2 border-green-500 rounded-xl bg-[#E7FFF0] max-w-[600px]">
          <div className="text-green-500">
            <FaBell size={40} />
          </div>

          <div>
            <h3 className="font-bold mb-2">3. Notify</h3>
            <p className="text-gray-600 text-sm">
              The system instantly sends a smart alert to the Admin Dashboard.
              All necessary details like bin location, fill level, and snapshot
              are shown in real time.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-center gap-4 p-6 border-2 border-green-500 rounded-xl bg-[#E7FFF0] max-w-[600px] ml-auto">
          <div className="text-green-500">
            <FaTruck size={40} />
          </div>

          <div>
            <h3 className="font-bold mb-2">4. Dispatch</h3>
            <p className="text-gray-600 text-sm">
              The administrator assigns the nearest available collector. The
              collector receives the task, reaches the bin, and updates pickup
              status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Works;
