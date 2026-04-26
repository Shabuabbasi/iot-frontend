import DashboardHeader from "../../../components/DashboardHeader";

const RealTimeMonitoring = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader 
        title="Real-Time Monitoring" 
        subtitle="Monitor live bin status and verify collection through snapshots" 
      />
        {/* STATUS TAGS */}
      <div className="flex gap-3 mb-4 text-sm">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">Empty</span>
        <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">Half-Full</span>
        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">Full</span>
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Out of Order</span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

 {/* 🔹 LEFT: LIVE BIN STATUS */}
        <div className="bg-white p-5 rounded-2xl shadow-md">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Live Bin Status
            </h2>

            {/* Live Indicator */}
            <span className="flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>

          {/* Bins */}
          <div className="space-y-4">
            {bins.map((bin, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold">{bin.name}</h3>
                    <p className="text-xs text-gray-500">{bin.location}</p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                      bin.level
                    )}`}
                  >
                    {getStatusText(bin.level)}
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${getProgressColor(
                      bin.level
                    )} h-3 transition-all duration-500`}
                    style={{ width: `${bin.level}%` }}
                  ></div>
                </div>

                {/* Bottom */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{bin.level}% filled</span>
                  <span>{bin.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 RIGHT: SNAPSHOTS */}
        <div className="bg-white p-5 rounded-2xl shadow-md">

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Collector Snapshots (Verification)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {snapshots.map((snap, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={snap.image}
                  alt="snapshot"
                  className="w-full h-32 object-cover"
                />

                <div className="p-3">
                  <p className="text-sm font-medium">{snap.bin}</p>
                  <p className="text-xs text-gray-500">{snap.time}</p>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 bg-[#FFC437] text-black text-xs py-1 rounded hover:opacity-90">
                      Verify
                    </button>
                    <button className="flex-1 bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

/* ================= DATA ================= */

const bins = [
  { name: "BIN-1023", location: "Main Street", level: 92, time: "2 sec ago" },
  { name: "BIN-8821", location: "Park Road", level: 55, time: "10 sec ago" },
  { name: "BIN-4592", location: "City Center", level: 20, time: "30 sec ago" },
];

/* SNAPSHOTS */

const snapshots = [
  {
    bin: "BIN-1023",
    time: "2 mins ago",
    image: "https://via.placeholder.com/300x200",
  },
  {
    bin: "BIN-8821",
    time: "10 mins ago",
    image: "https://via.placeholder.com/300x200",
  },
];

const getStatusText = (level) => {
  if (level > 80) return "Full";
  if (level > 40) return "Half";
  return "Empty";
};

const getStatusBadge = (level) => {
  if (level > 80) return "bg-red-100 text-red-600";
  if (level > 40) return "bg-yellow-100 text-yellow-600";
  return "bg-green-100 text-green-600";
};

const getProgressColor = (level) => {
  if (level > 80) return "bg-red-500";
  if (level > 40) return "bg-yellow-500";
  return "bg-green-500";
};

export default RealTimeMonitoring;