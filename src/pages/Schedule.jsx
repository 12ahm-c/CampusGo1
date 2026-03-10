import React, { useEffect, useState, useContext } from "react";
import "./Schedule.css";
import { ThemeContext } from "../context/ThemeContext"; // استيراد ThemeContext

export default function Schedule() {
  const { darkMode } = useContext(ThemeContext); // Dark Mode من Context

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : { bus_id: "" };

  const [buses, setBuses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

const API_URL = import.meta.env.VITE_API_URL_SCHEDULE;

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => console.error(err)
    );
  }, []);

  // Fetch bus data every 5 seconds
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchedules();
    const interval = setInterval(fetchSchedules, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getETA = (bus) => {
    if (!userLocation || !bus.current_lat || !bus.current_lng) return null;
    return Math.ceil(getDistance(bus.current_lat, bus.current_lng, userLocation.latitude, userLocation.longitude) / 10 / 60);
  };

  const openMaps = (bus) => {
    if (!userLocation || !bus.current_lat || !bus.current_lng) return;
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${bus.current_lat},${bus.current_lng}`;
    window.open(url, "_blank");
  };

  const getStatusColor = (status) => {
    return status === "Active" ? "#27ae60" : "#e74c3c";
  };

  return (
    <div className={`schedule-container ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="schedule-title">Bus Tracker</h1>
      
      {buses.length === 0 ? (
        <p className="no-data">No buses available</p>
      ) : (
        <div className="buses-grid">
          {buses.map((bus) => (
            <div key={bus.bus_id} className="schedule-card">
              <p>🚌 {bus.bus_id}</p>
              <p>
                <span>Status:</span>
                <span 
                  className="status-tag" 
                  style={{ backgroundColor: getStatusColor(bus.status) }}
                >
                  {bus.status}
                </span>
              </p>
              <p>
                <span>ETA:</span>
                <span style={{ fontWeight: "bold" }}>
                  {getETA(bus) !== null ? `${getETA(bus)} min` : "N/A"}
                </span>
              </p>
              <button 
                className="route-button" 
                onClick={() => openMaps(bus)}
                disabled={!userLocation || !bus.current_lat}
              >
                View Route
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}