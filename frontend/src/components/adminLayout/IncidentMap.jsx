import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const IncidentMap = ({ alerts = [] }) => {

  return (
    <div
      style={{
        flex: 1,
        height: "350px",
        borderRadius: "12px",
        overflow: "hidden"
      }}
    >

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {alerts.length > 0 &&
          alerts.map((alert) => {

            if (!alert.latitude || !alert.longitude) return null;

            return (
              <Marker
                key={alert._id}
                position={[alert.latitude, alert.longitude]}
              />
            );

          })}

      </MapContainer>

    </div>
  );
};

export default IncidentMap;