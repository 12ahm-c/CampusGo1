import React, { useEffect, useState, useContext } from "react";
import "./Schedule.css";
import { ThemeContext } from "../context/ThemeContext";
import { FaSlidersH, FaSyncAlt, FaUserAlt, FaMapMarkerAlt, FaArrowRight, FaClock } from "react-icons/fa";

export default function Schedule() {
  const { darkMode } = useContext(ThemeContext);

  const [buses, setBuses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "active", "inactive"
  const [loading, setLoading] = useState(false);

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

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 500); // slight delay for visual feedback
    }
  };

  // Fetch bus data initially and periodically
  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 10000);
    return () => clearInterval(interval);
  }, [API_URL]);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getETA = (bus) => {
    if (bus.status !== "Active") return null;
    if (!userLocation || !bus.current_lat || !bus.current_lng) return null;
    return Math.ceil(getDistance(bus.current_lat, bus.current_lng, userLocation.latitude, userLocation.longitude) / 400);
  };

  const openMaps = (bus) => {
    if (!userLocation || !bus.current_lat || !bus.current_lng) return;
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${bus.current_lat},${bus.current_lng}`;
    window.open(url, "_blank");
  };

  const filteredBuses = buses.filter((bus) => {
    if (filter === "active") return bus.status === "Active";
    if (filter === "inactive") return bus.status !== "Active";
    return true;
  });

  const getRouteName = (busId) => {
    const names = {
      "u01": "CAMPUS LOOP",
      "u02": "NORTH EXPRESS",
      "u04": "NIGHT OWL",
      "u05": "WEST HOUSING",
      "u08": "SCI-TECH HUB",
      "u12": "SPORT COMPLEX"
    };
    return names[busId.toLowerCase()] || "UNIVERSITY ROUTE";
  };

  const getRouteLocation = (busId) => {
    const locs = {
      "u01": "Main Library",
      "u02": "Engineering Blk",
      "u04": "Central Hub",
      "u05": "South Gate",
      "u08": "Innovation Lab",
      "u12": "Stadium North"
    };
    return locs[busId.toLowerCase()] || "Campus Center";
  };

  const formatFutureTime = () => {
    const date = new Date();
    date.setHours(21, 0, 0); // Mocking 9:00 PM for off-duty resumes
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`schedule-container ${darkMode ? "dark-mode" : ""}`}>

      <div className="schedule-top-header">
        <div>
          <h1 className="schedule-main-title">Bus Schedule</h1>
          <p className="schedule-subtitle">Real-time tracking for university transit routes</p>
        </div>
        <div className="header-actions">
          <button className="action-btn outline-btn">
            <FaSlidersH /> Filters
          </button>
          <button className="action-btn primary-btn" onClick={fetchSchedules} disabled={loading}>
            <FaSyncAlt className={loading ? "spin" : ""} /> Refresh Data
          </button>
        </div>
      </div>

      <div className="filter-pills">
        <button
          className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Routes
        </button>
        <button
          className={`filter-pill ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Only
        </button>
        <button
          className={`filter-pill ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Inactive only
        </button>
      </div>

      {filteredBuses.length === 0 ? (
        <p className="no-data">No buses matching criteria</p>
      ) : (
        <div className="buses-grid">
          {filteredBuses.map((bus) => {
            const isActive = bus.status === "Active";
            const routeName = getRouteName(bus.bus_id);
            const routeLocation = getRouteLocation(bus.bus_id);
            const etaNum = getETA(bus);

            return (
              <div key={bus.bus_id} className={`schedule-card ${!isActive ? 'offline-card' : ''}`}>
                <div className="card-top-row">
                  <span className={`route-label ${isActive ? 'active-text' : 'inactive-text'}`}>
                    {routeName}
                  </span>
                  <span className="arrival-label">
                    {isActive ? "NEXT ARRIVAL" : "SERVICE RESUMES"}
                  </span>
                </div>

                <div className="card-middle-row">
                  <h2 className="route-id-title">Route {bus.bus_id.toUpperCase()}</h2>
                  <div className="eta-display">
                    {isActive ? (
                      <span className="eta-mins"><strong>{etaNum !== null ? etaNum : "--"}</strong> min</span>
                    ) : (
                      <span className="resume-time">{formatFutureTime()}</span>
                    )}
                  </div>
                </div>

                <div className="card-meta-row">
                  <div className="meta-item">
                    {isActive ? <FaUserAlt className="meta-icon" /> : <FaClock className="meta-icon" />}
                    <span>{isActive ? `Standard Bus` : "Off Duty"}</span>
                  </div>
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>{routeLocation}</span>
                  </div>
                </div>

                <button
                  className={`full-route-btn ${!isActive || etaNum === null ? 'disabled-btn' : ''}`}
                  onClick={() => openMaps(bus)}
                  disabled={!isActive || etaNum === null}
                >
                  {isActive ? (
                    <>View Full Route <FaArrowRight className="btn-arrow" /></>
                  ) : (
                    "Route Unavailable"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}