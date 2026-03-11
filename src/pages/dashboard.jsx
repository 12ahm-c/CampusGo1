import { useState, useContext } from "react";
import { NavLink, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { MdHome, MdMap, MdSchedule, MdPerson, MdMenu, MdClose, MdLogout } from "react-icons/md";
import "./Dashboard.css";
import busLogo from "../assets/logo.png"; // المسار حسب مكان الملف

import Home from "./Home";
import LiveMap from "./LiveMap";
import Schedule from "./Schedule";
import Profile from "./Profile";
import { ThemeContext } from "../context/ThemeContext";

const navItems = [
  { to: "/dashboard/Home", label: "Overview", icon: MdHome },
  { to: "/dashboard/livemap", label: "Live Tracking", icon: MdMap },
  { to: "/dashboard/schedule", label: "Bus Schedule", icon: MdSchedule },
  { to: "/dashboard/profile", label: "My Profile", icon: MdPerson },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const currentPageTitle = navItems.find(item => location.pathname === item.to)?.label || "Dashboard";

  return (
    <div className={`dashboard-layout ${darkMode ? "dark-mode" : ""}`}>
      
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-section">
<div className="logo-box">
  <img 
    src={busLogo} 
    alt="Bus Logo" 
    style={{ width: "40px", height: "40px" }} 
  />
</div>
           <h1 className="logo-text">Campus<span>Go</span></h1>
          </div>
        </div>

        <nav className="nav-menu">
          <p className="menu-label">Main Menu</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user"); // مسح بيانات المستخدم
              navigate("/login");               // توجيه إلى صفحة Login
            }}
          >
            <MdLogout className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="top-navbar">
          <button className="menu-trigger" onClick={toggleSidebar}>
            <MdMenu />
          </button>
          <h2 className="page-title">{currentPageTitle}</h2>
          <div className="user-pill">
            <div className="status-dot"></div>
            <span>Online</span>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route index element={<Navigate to="/dashboard/Home" replace />} />
            <Route path="Home" element={<Home />} />
            <Route path="livemap" element={<LiveMap />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </div>
  );
}