import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BusMarker from "./BusMarker";
import ETADisplay from "./ETADisplay";
import RouteButton from "./RouteButton";
import { getAllBuses } from "../services/liveMapService";

const LiveMap = ({ user }) => {
  const [buses, setBuses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  /* =======================
     1️⃣ موقع المستخدم (GPS فقط)
     ======================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("GPS error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  /* =======================
     2️⃣ تحديث الباصات
     ======================= */
  useEffect(() => {
    const fetchBuses = async () => {
      const data = await getAllBuses();
      setBuses(data);
    };

    fetchBuses();
    const interval = setInterval(fetchBuses, 5000);
    return () => clearInterval(interval);
  }, []);

  const userBus = buses.find((b) => b.bus_id === user.bus_id);

  const center =
    userLocation
      ? [userLocation.lat, userLocation.lng]
      : userBus
      ? [userBus.current_lat, userBus.current_lng]
      : [18.0735, -15.9582];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer center={center} zoom={15} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {buses.map((bus) => (
          <BusMarker
            key={bus.bus_id}
            bus={bus}
            userBusId={user.bus_id}
          />
        ))}

        {/* ✅ الخط دائماً يظهر */}
        {userBus && userLocation && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [userBus.current_lat, userBus.current_lng],
            ]}
            color="red"
            weight={4}
          />
        )}
      </MapContainer>

      {/* ✅ ETA يعمل */}
      {userBus && userLocation && (
        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#003cff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <ETADisplay bus={userBus} userLocation={userLocation} />
<RouteButton bus={userBus} userLocation={userLocation} />        </div>
      )}
    </div>
  );
};

export default LiveMap;