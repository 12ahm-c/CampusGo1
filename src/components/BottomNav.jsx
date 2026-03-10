import React from 'react';
import './BottomNav.css';

// SVG Icons matching the design
const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 4L21 9.5" />
        <path d="M5 10V19C5 19.5523 5.44772 20 6 20H9V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V20H18C18.5523 20 19 19.5523 19 19V10" />
    </svg>
);

const MapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6L8 4L16 7L21 5V18L16 20L8 17L3 19V6Z" />
        <path d="M8 4V17" />
        <path d="M16 7V20" />
    </svg>
);

const ScheduleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9H21" />
        <path d="M8 2V5" />
        <path d="M16 2V5" />
        <rect x="7" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="11" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="15" y="12" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="7" y="15" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
        <rect x="11" y="15" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
);

const AlertsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C8.68629 3 6 5.68629 6 9V14L4 17H20L18 14V9C18 5.68629 15.3137 3 12 3Z" />
        <path d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20" />
    </svg>
);

const ProfileIcon = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" fill={active ? "currentColor" : "none"} />
        <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" fill={active ? "currentColor" : "none"} />
    </svg>
);

const BottomNav = ({ activeTab = 'Profile' }) => {
    const navItems = [
        { id: 'Home', label: 'Home', Icon: HomeIcon },
        { id: 'Map', label: 'Map', Icon: MapIcon },
        { id: 'Schedule', label: 'Schedule', Icon: ScheduleIcon },
        { id: 'Alerts', label: 'Alerts', Icon: AlertsIcon },
        { id: 'Profile', label: 'Profile', Icon: ProfileIcon },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className={`nav-icon ${item.id === 'Profile' && isActive ? 'profile-active' : ''}`}>
                                <item.Icon active={isActive} />
                            </span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
