import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "./sideNav";
import Navbar from "../components/common/navbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden fixed top-4 left-4 z-30 bg-white rounded-full p-2 shadow mt-4"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6 text-[#54B9EC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Navbar />
        
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
