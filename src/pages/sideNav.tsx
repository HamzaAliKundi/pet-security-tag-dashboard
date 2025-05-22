import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiUser, FiMessageSquare, FiStar, FiCalendar, FiTool, FiSettings, FiLogOut } from "react-icons/fi";

const navItems = [
  { name: "My Profile", path: "/profile", icon: FiUser },
  { name: "Messages", path: "/messages", icon: FiMessageSquare },
  { name: "Review", path: "/review", icon: FiStar },
  { name: "Events", path: "/events", icon: FiCalendar },
  { name: "Helpful Tools", path: "/tools", icon: FiTool },
  { name: "Settings", path: "/settings", icon: FiSettings }
];

interface SideNavProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SideNav = ({ isSidebarOpen, toggleSidebar }: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-[280px] bg-white border-r border-gray-100 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-300 ease-in-out md:translate-x-0 md:relative`}
      >
        <nav className="h-full flex flex-col">
          <div className="flex-1 pt-28 md:pt-8 lg:pt-8">
            <ul className="space-y-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => {
                        const pathWithoutSlash = item.path.substring(1);
                        const isPathActive = location.pathname.includes(pathWithoutSlash.replace('s', ''));
                        return `flex items-center gap-3 px-4 py-3 text-[15px] rounded-lg ${
                          isActive || isPathActive 
                            ? "bg-blue-50 text-blue-600 font-medium" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        } transition-all duration-200`;
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {isSidebarOpen && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 ease-in-out">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-colors"
            >
              <IoMdClose size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Logout Confirmation
              </h2>
              <p className="text-gray-500">
                Are you sure you want to logout from your account?
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 h-12 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging Out...
                  </div>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNav;