import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdAttachMoney,
  MdReceipt,
  MdDateRange,
  MdPlaylistAddCheck,
  MdWork,
  MdRssFeed,
  MdEventNote,
  MdExitToApp,
  MdPerson,
  MdCreate,
  MdListAlt,
  MdFolderOpen // Imported MdFolderOpen icon
} from "react-icons/md"; // Importing icons from react-icons

const MenuItem = ({ to, children, icon: Icon, hasSubMenu, expanded, onToggle }) => {
  const activeClass = "bg-blue-50 text-blue-600";
  const defaultClass = "text-gray-700 hover:bg-gray-50";
  const baseClass = "flex items-center px-3 py-2 rounded-md transition-colors duration-200 ease-in-out text-sm";

  if (hasSubMenu) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={`${baseClass} w-full justify-between ${expanded ? activeClass : defaultClass}`}
        >
          <span className="flex items-center">
            {Icon && <Icon className="mr-3 text-lg" />}
            {children}
          </span>
          <svg
            className={`w-4 h-4 transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : defaultClass}`
      }
    >
      {Icon && <Icon className="mr-3 text-lg" />}
      {children}
    </NavLink>
  );
};

export default function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <aside className="w-1/6 bg-white border-r min-h-screen px-4 py-6">
      <h2 className="text-xl font-bold mb-8 text-center text-blue-800">Nebs-IT</h2>

      <nav className="space-y-2">
        <MenuItem to="/dashboard" icon={MdDashboard}>Dashboard</MenuItem>

        {/* Employee Tab */}
        <MenuItem
          hasSubMenu
          icon={MdPeople}
          onToggle={() => toggleMenu("employee")}
          expanded={expandedMenus.employee}
        >
          Employee Tab
        </MenuItem>
        {expandedMenus.employee && (
          <div className="ml-6 mt-1 space-y-1">
            <NavLink
              to="/employee/database"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Employee Database
            </NavLink>
            <NavLink
              to="/employee/add-new"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Add New Employee
            </NavLink>
            <NavLink
              to="/employee/performance-report"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Performance Report
            </NavLink>
            <NavLink
              to="/employee/performance-history"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Performance History
            </NavLink>
          </div>
        )}

        <MenuItem to="/payroll" icon={MdAttachMoney}>Payroll</MenuItem>
        <MenuItem to="/payslip" icon={MdReceipt}>Pay Slip</MenuItem>
        <MenuItem to="/attendance" icon={MdDateRange}>Attendance</MenuItem>
        <MenuItem to="/request-center" icon={MdPlaylistAddCheck}>Request Center</MenuItem>

        {/* Career Database */}
        <MenuItem
          hasSubMenu
          icon={MdWork}
          onToggle={() => toggleMenu("career")}
          expanded={expandedMenus.career}
        >
          Career Database
        </MenuItem>
        {expandedMenus.career && (
          <div className="ml-6 mt-1 space-y-1">
            <NavLink
              to="/career/jobs"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Jobs
            </NavLink>
            <NavLink
              to="/career/applicants"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-xs ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`
              }
            >
              Applicants
            </NavLink>
          </div>
        )}
        
        {/* Document Manager */}
        <MenuItem to="/document-manager" icon={MdFolderOpen}>Document Manager</MenuItem>

        <MenuItem to="/notice-board" icon={MdRssFeed}>Notice Board</MenuItem>
        <MenuItem to="/activity-log" icon={MdEventNote}>Activity Log</MenuItem>
        <MenuItem to="/exit-interview" icon={MdExitToApp}>Exit Interview</MenuItem>
        <MenuItem to="/profile" icon={MdPerson}>Profile</MenuItem>

        {/* <hr className="my-4" /> */}
        {/* <MenuItem to="/create-notice" icon={MdCreate}>Create Notice</MenuItem> */}
        {/* <MenuItem to="/notice-list" icon={MdListAlt}>Notice List</MenuItem> */}
      </nav>
    </aside>
  );
}

