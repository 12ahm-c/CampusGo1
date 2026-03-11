import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LiveMap.css";
import { ThemeContext } from "../context/ThemeContext"; // Dark mode

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
  const { darkMode } = useContext(ThemeContext);

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : { bus_id: "" };

  const [userLocation, setUserLocation] = useState(null);
  const [buses, setBuses] = useState([]);
  
  // نأخذ ETA مباشرة من localStorage
  const [eta, setEta] = useState(() => {
    const storedETA = localStorage.getItem("current_eta");
    return storedETA ? parseInt(storedETA) : null;
  });

  const API_URL = import.meta.env.VITE_API_URL_BUSES;

  // تحديث الباصات من السيرفر
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

  // تحديث موقع المستخدم كل ثانيتين
  useEffect(() => {
    const updateUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    };

    updateUserLocation();
    const interval = setInterval(updateUserLocation, 2000);
    return () => clearInterval(interval);
  }, []);

  const userBus = buses.find((b) => b.bus_id === parsedUser.bus_id);

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : userBus
    ? [userBus.current_lat, userBus.current_lng]
    : [18.0735, -15.9582];

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
              ? "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution={
            darkMode
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
          subdomains={["a","b","c","d"]}
        />
        {buses.map((bus) => (
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

      {userBus && userLocation && eta !== null && (
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