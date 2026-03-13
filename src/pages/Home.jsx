import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaMapMarkedAlt, FaClock, FaUserCircle } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import "./Home.css";

export default function Home() {
  const { darkMode } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [buses, setBuses] = useState([]);
  const [eta, setEta] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();
  const API_URL_BUSES = import.meta.env.VITE_API_URL_BUSES;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchBuses = async () => {
      try {
        const res = await fetch(API_URL_BUSES);
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBuses();
    const interval = setInterval(fetchBuses, 5000);
    return () => clearInterval(interval);
  }, [API_URL_BUSES]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.error(err)
    );
  }, []);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getBusETA = (bus) => {
    if (!userLocation || !bus.current_lat || !bus.current_lng) return null;
    return Math.ceil(getDistance(userLocation.latitude, userLocation.longitude, bus.current_lat, bus.current_lng) / 400);
  };

  useEffect(() => {
    if (!user || !userLocation || buses.length === 0) return;
    const userBus = buses.find((b) => b.bus_id === user.bus_id);
    if (!userBus) return;
    setEta(getBusETA(userBus));
  }, [user, userLocation, buses]);

  const formatFutureTime = (minutes) => {
    if (minutes === null) return "N/A";
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="home-layout-grid">
        <div className="main-column">
          <div className="arrival-card-hero">
            <div className="arrival-card-left">
              <span className="live-tracking-badge"><span className="dot-indicator"></span> LIVE TRACKING</span>
              <h1 className="arrival-title">Next Bus<br />Arrival</h1>
              <p className="arrival-subtitle">Route {user.bus_id ? user.bus_id.toUpperCase() : "A"} - North Campus<br />Express</p>
              <button className="view-map-btn" onClick={() => navigate("/dashboard/livemap")}>View Map</button>
            </div>
            <div className="arrival-card-right">
              <div className="time-display-box">
                <span className="time-label">ARRIVING IN</span>
                <h2 className="time-value">{eta !== null ? `${eta} min` : "--"}</h2>
                <span className="station-label">Station: Hub East</span>
              </div>
            </div>
          </div>

          <div className="upcoming-departures-section">
            <div className="section-header-flex">
              <h3>Upcoming Departures</h3>
              <button className="view-full-btn" onClick={() => navigate("/dashboard/schedule")}>View Full Schedule</button>
            </div>

            <div className="departures-table">
              <div className="table-header">
                <span>ROUTE</span>
                <span>DESTINATION</span>
                <span>STATUS</span>
                <span>ETA</span>
              </div>

              {buses.length > 0 ? buses.slice(0, 4).map((bus, idx) => {
                const routeLetter = bus.bus_id.replace('u0', '').toUpperCase() || bus.bus_id;
                const routeClass = `route-${['a', 'b', 'c', 'a'][idx % 4]}`;
                const etaNum = getBusETA(bus);
                return (
                  <div className="table-row" key={bus.bus_id}>
                    <div className="route-col">
                      <span className={`route-icon ${routeClass}`}>{routeLetter}</span> {bus.bus_id.toUpperCase()} Express
                    </div>
                    <div className="dest-col">Main Campus</div>
                    <div className="status-col">
                      <span className={`status-text ${bus.status === 'Active' ? 'on-time' : 'delayed'}`}>
                        {bus.status === 'Active' ? 'On Time' : 'Delayed'}
                      </span>
                    </div>
                    <div className="eta-col">
                      <strong>{formatFutureTime(etaNum)}</strong><br />
                      <span>{etaNum !== null ? `In ${etaNum} mins` : 'N/A'}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="table-row" style={{ justifyContent: 'center', padding: '20px', color: '#64748b' }}>
                  No buses currently active.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Active Routes</h3>
              <span className="icon-btn info-icon">i</span>
            </div>

            {buses.length > 0 ? buses.slice(0, 4).map((bus, idx) => {
              const routeLetter = bus.bus_id.replace('u0', '').toUpperCase() || bus.bus_id;
              const boxClass = `box-${['a', 'b', 'c', 'a'][idx % 4]}`;
              return (
                <div className="route-status-item" key={bus.bus_id}>
                  <div className={`route-icon-box ${boxClass}`}>{routeLetter}</div>
                  <span className="route-name">Route {bus.bus_id.toUpperCase()}</span>
                  <span className={`status-badge-small ${bus.status === 'Active' ? 'active-badge' : 'warning-badge'}`}>
                    {bus.status}
                  </span>
                </div>
              );
            }) : (
              <div style={{ color: '#64748b', fontSize: '13px' }}>No active routes found.</div>
            )}
          </div>

          <div className="info-card">
            <div className="info-card-header">
              <h3>Recent Alerts</h3>
              <span className="icon-btn alert-icon">!</span>
            </div>

            <div className="alert-item">
              <div className="alert-icon-wrapper">!</div>
              <div className="alert-content">
                <h4>System Status</h4>
                <p>All transits currently operating on regular schedules. Drive safe!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <button className="action-card" onClick={() => navigate("/dashboard/livemap")}>
          <div className="action-icon map-bg"><FaMapMarkedAlt /></div>
          <span>Live Map</span>
        </button>
        <button className="action-card" onClick={() => navigate("/dashboard/schedule")}>
          <div className="action-icon schedule-bg"><FaBus /></div>
          <span>Schedules</span>
        </button>
      </div>
    </div>
  );
}