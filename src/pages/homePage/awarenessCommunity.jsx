import React, { useState } from "react";
import { BookOpen, Users, PenTool, Calendar, MapPin, X } from "lucide-react";
import toast from "react-hot-toast";
import campaignImg from "../../assets/homePage/campaign.png";

const blogs = [
  {
    id: 1,
    title: "The Impact of Smart Bins on Urban Cleanliness",
    summary: "Discover how IoT-enabled smart bins are transforming waste management in major cities around the world.",
    content: "Smart waste management uses IoT sensors in trash bins to monitor fill levels in real time. This data helps city planners optimize collection routes, reducing fuel consumption and emissions. By moving from a static schedule to a dynamic, needs-based approach, cities can save up to 30% on collection costs while ensuring that bins never overflow. Furthermore, this leads to cleaner streets, fewer pests, and an overall better quality of life for citizens.",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "10 Simple Ways to Reduce Household Waste",
    summary: "Small changes at home can lead to a massive reduction in the waste that ends up in landfills.",
    content: "Reducing waste at home doesn't have to be complicated. Start by composting food scraps, which can divert up to 30% of household waste from landfills. Ditch single-use plastics for reusable bags, water bottles, and containers. Buy items in bulk to reduce packaging waste. Upcycle old clothes and furniture instead of throwing them away. Finally, always check if an item can be repaired before discarding it. These simple habits create a significant positive environmental impact.",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "Understanding the Recycling Symbols",
    summary: "A comprehensive guide to what those numbers on your plastic containers actually mean.",
    content: "Ever wondered what the numbers inside the recycling triangle mean? They identify the type of plastic. For example, #1 (PET) is used in water bottles and is widely recycled. #2 (HDPE) is used for milk jugs and is also easily recyclable. However, #3 (PVC) and #6 (Polystyrene/Styrofoam) are rarely accepted in curbside bins. Understanding these symbols helps you sort your waste correctly and prevents contamination in recycling facilities.",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=60"
  }
];

const campaigns = [
  {
    id: 1,
    title: "Islamabad Zero Waste Drive",
    date: "July 15, 2026",
    location: "F-9 Park, Islamabad",
    participants: 124,
    image: campaignImg
  },
  {
    id: 2,
    title: "Community Beach Cleanup",
    date: "August 5, 2026",
    location: "Clifton Beach",
    participants: 89,
    image: campaignImg
  }
];

export default function AwarenessCommunity() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleJoinCampaign = (campaignTitle) => {
    toast.success(`You have successfully joined the ${campaignTitle}!`);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Awareness <span className="text-green-500">& Community</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
            Empowering citizens through education and active participation to build a cleaner, greener future.
          </p>
        </div>

        {/* Blogs & Educational Content */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="text-green-500" size={28} />
            <h3 className="text-2xl font-bold text-slate-800">Educational Resources</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                    {blog.readTime}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{blog.title}</h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">{blog.summary}</p>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="mt-auto text-green-600 font-bold text-sm flex items-center gap-2 hover:text-green-700 transition-colors"
                  >
                    Read Article <PenTool size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Campaigns */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Users className="text-green-500" size={28} />
            <h3 className="text-2xl font-bold text-slate-800">Active Campaigns</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-start gap-6">
                <img src={campaign.image} alt={campaign.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{campaign.title}</h4>
                  <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar size={14} className="text-green-500" /> {campaign.date}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <MapPin size={14} className="text-green-500" /> {campaign.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{campaign.participants} participating</span>
                    <button
                      onClick={() => handleJoinCampaign(campaign.title)}
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-100 transition-all active:scale-95"
                    >
                      Join Campaign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Reading Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="relative h-64 shrink-0">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-3 text-slate-400 font-bold text-sm uppercase tracking-widest mb-4">
                <span>{selectedBlog.readTime}</span>
                <span>•</span>
                <span className="text-green-500">Environment</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{selectedBlog.title}</h2>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                <p className="leading-relaxed">{selectedBlog.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
