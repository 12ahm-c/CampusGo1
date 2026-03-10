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

  useEffect(() => {
    if (!user || !userLocation || buses.length === 0) return;
    const userBus = buses.find((b) => b.bus_id === user.bus_id);
    if (!userBus) return;

    const getDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    const distance = getDistance(userLocation.latitude, userLocation.longitude, userBus.current_lat, userBus.current_lng);
    setEta(Math.ceil(distance / 400));
  }, [user, userLocation, buses]);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <header className="home-header">
        <div className="user-welcome">
          <FaUserCircle className="user-icon" />
          <div>
            <p className="welcome-text">Welcome back,</p>
            <h2 className="user-name">{user.username}</h2>
          </div>
        </div>
        <div className="status-badge">Active</div>
      </header>

      <div className="eta-card">
        <div className="eta-info">
          <FaClock className="icon-pulse" />
          <span>Next Shuttle Arrival</span>
        </div>
        <h1 className="eta-time">{eta !== null ? `${eta} min` : "--"}</h1>
        <p className="eta-bus-id">Bus ID: {user.bus_id || "Not Assigned"}</p>
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