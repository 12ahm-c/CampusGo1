import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const BusMarker = ({ bus, userBusId }) => {
  const isUserBus = bus.bus_id === userBusId;

  const icon = L.icon({
    iconUrl: isUserBus ? "/bus-red.png" : "/bus-blue.png", // احمر لمستخدم
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <Marker position={[bus.current_lat, bus.current_lng]} icon={icon}>
      <Popup>
        {bus.bus_id} - {bus.driver_name} <br />
        Status: {bus.status}
      </Popup>
    </Marker>
  );
};

export default BusMarker;