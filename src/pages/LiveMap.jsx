import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LiveMap.css";
import { ThemeContext } from "../context/ThemeContext"; // استيراد ThemeContext

// أيقونات الباص
const busBlueIcon = new L.Icon({
  iconUrl: "/bus-blue.png",
  iconSize: [30, 30],
});
const busRedIcon = new L.Icon({
  iconUrl: "/bus-red.png",
  iconSize: [30, 30],
});

export default function LiveMap() {
  const { darkMode } = useContext(ThemeContext); // Dark mode من context

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : { bus_id: "" };

  const [userLocation, setUserLocation] = useState(null);
  const [buses, setBuses] = useState([]);

const API_URL = import.meta.env.VITE_API_URL_BUSES;

// داخل useEffect
useEffect(() => {
  const fetchBuses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBuses();
  const interval = setInterval(fetchBuses, 5000);
  return () => clearInterval(interval);
}, [API_URL]);

 

  const userBus = buses.find((b) => b.bus_id === parsedUser.bus_id);

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : userBus
    ? [userBus.current_lat, userBus.current_lng]
    : [18.0735, -15.9582];

  // حساب ETA
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

  const eta =
    userBus && userLocation
      ? Math.ceil(
          getDistance(
            userBus.current_lat,
            userBus.current_lng,
            userLocation.latitude,
            userLocation.longitude
          ) / 600
        )
      : null;

  const openMaps = () => {
    if (!userBus || !userLocation) return;
    const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${userBus.current_lat},${userBus.current_lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className={`map-page ${darkMode ? "dark-mode" : ""}`}>
      <MapContainer center={center} zoom={15} style={{ height: "100vh", width: "100%" }}>
<TileLayer
  url={
    darkMode
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }
  attribution={
    darkMode
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
  subdomains={["a","b","c","d"]}
/>        {buses.map((bus) => (
          <Marker
            key={bus.bus_id}
            position={[bus.current_lat, bus.current_lng]}
            icon={bus.bus_id === parsedUser.bus_id ? busRedIcon : busBlueIcon}
          >
            <Popup>
              {bus.bus_id} - {bus.driver_name}
            </Popup>
          </Marker>
        ))}

        {userBus && userLocation && (
          <Polyline
            positions={[
              [userLocation.latitude, userLocation.longitude],
              [userBus.current_lat, userBus.current_lng],
            ]}
            color="red"
          />
        )}
      </MapContainer>

      {userBus && userLocation && (
        <div className="eta-container">
          <p className="eta-text">ETA: {eta} دقيقة</p>
          <button className="route-button" onClick={openMaps}>
            عرض المسار
          </button>
        </div>
      )}
    </div>
  );
}