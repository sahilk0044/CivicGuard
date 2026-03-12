import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* BLINKING ALERT ICON */

const alertIcon = new L.DivIcon({
  html: `
    <div style="
      width:18px;
      height:18px;
      background:red;
      border-radius:50%;
      border:3px solid white;
      animation: blink 1s infinite;
    "></div>
  `,
  className: ""
});

const IncidentMap = ({ alerts = [] }) => {

  return (
    <div
      style={{
        width: "100%",
        minWidth: "0",
        height: "350px",
        borderRadius: "12px",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >

      {/* BLINK ANIMATION STYLE */}
      <style>
        {`
        @keyframes blink {
          0% { transform: scale(1); opacity:1 }
          50% { transform: scale(1.4); opacity:0.6 }
          100% { transform: scale(1); opacity:1 }
        }
        `}
      </style>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
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
                icon={alertIcon}
              >

                <Popup>

                  <strong>🚨 Emergency Alert</strong>

                  <p>
                    <b>Type:</b> {alert.type}
                  </p>

                  <p>
                    <b>Location:</b> {alert.locationName || "Unknown"}
                  </p>

                  <p>
                    <b>Status:</b> {alert.status}
                  </p>

                  <p style={{fontSize:"12px",opacity:"0.7"}}>
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>

                </Popup>

              </Marker>
            );

          })}

      </MapContainer>

    </div>
  );
};

export default IncidentMap;