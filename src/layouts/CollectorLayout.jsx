import { Outlet } from "react-router-dom";
import CollectorSidebar from "../components/CollectorSidebar/Sidebar";

const CollectorLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <CollectorSidebar />

      <main className="flex-1 h-screen overflow-y-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CollectorLayout;
