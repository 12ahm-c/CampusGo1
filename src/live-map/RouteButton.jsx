import React from "react";

const RouteButton = ({ bus, userLocation }) => {
  const handleClick = () => {
    if (!bus || !userLocation) return;

    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${bus.current_lat},${bus.current_lng}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        marginTop: "8px",
        padding: "6px 14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      عرض المسار
    </button>
  );
};

export default RouteButton;