import React from "react";
import { Play, PenTool, BarChart3 } from "lucide-react";

const cards = [
  {
    title: "Videos",
    icon: <Play size={24} />,
    image:
      "https://images.unsplash.com/photo-1593697820826-8f0b8e4b7d7c?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Blogs & Articles",
    icon: <PenTool size={24} />,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Infographics",
    icon: <BarChart3 size={24} />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60",
  },
];

export default function AwarenessCommunity() {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold">
          Awareness <span className="text-green-500">& Community</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Building Clean and Green Communities
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden border-2 border-green-500 group cursor-pointer"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                <div className="bg-green-500 p-3 rounded-lg mb-2">
                  {card.icon}
                </div>
                <p className="font-semibold">{card.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
