import React from "react";
import hero from "../../assets/homePage/homePage.png"; // your top image

const HeroSection = () => {
  return (
    <section className="bg-green-200 min-h-screen flex flex-col items-center justify-center px-6 py-10">
      {/* Image Container */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl w-full flex justify-center">
        <img
          src={hero}
          alt="smart waste monitoring"
          className="w-full max-w-4xl object-contain"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mt-8 leading-snug">
        Smart Waste Monitoring for{" "}
        <span className="text-green-500">Cleaner</span> and{" "}
        <span className="text-green-500">Smarter</span> Cities
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-2xl mt-4">
        Automated bin-level detection, real-time camera snapshots, and
        intelligent collector dispatch powered by IoT & modern web technologies.
      </p>

      {/* Button */}
      <button className="mt-8 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2 transition">
        Get Started →
      </button>
    </section>
  );
};

export default HeroSection;
