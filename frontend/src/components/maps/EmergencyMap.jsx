import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

/* ================= FIX LEAFLET MARKER ICON ================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* ================= MAP AUTO CENTER ================= */

function MapUpdater({ position }) {

  const map = useMap();

  useEffect(() => {

    if (position) {
      map.setView(position, 13);
    }

  }, [position, map]);

  return null;
}

const EmergencyMap = ({ selectedAlert }) => {

  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    getUserLocation();
    fetchAlerts();

  }, []);

  /* ================= GET USER GPS LOCATION ================= */

  const getUserLocation = () => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLocation([
          position.coords.latitude,
          position.coords.longitude
        ]);

      },

      (error) => {

        console.log("Location error:", error);

      },

      { enableHighAccuracy: true }

    );

  };

  /* ================= FETCH ALERTS ================= */

  const fetchAlerts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/alerts/my-alerts",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAlerts(res.data);

    } catch (error) {

      console.log("Error fetching alerts:", error);

    }

  };

  /* ================= DETERMINE MAP CENTER ================= */

  const mapCenter = selectedAlert
    ? [selectedAlert.latitude, selectedAlert.longitude]
    : location;

  if (!mapCenter) {

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Fetching location...
      </div>
    );

  }

  return (

    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "10px"
      }}
    >

      {/* ================= OPENSTREETMAP TILE ================= */}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />

      <MapUpdater position={mapCenter} />

      {/* ================= USER LOCATION ================= */}

      {location && (

        <>
          <Marker position={location}>
            <Popup>📍 You are here</Popup>
          </Marker>

          <CircleMarker
            center={location}
            radius={18}
            pathOptions={{
              color: "blue",
              fillOpacity: 0.3
            }}
          />
        </>

      )}

      {/* ================= ALERT MARKERS ================= */}

      {alerts
        .filter(alert => alert.latitude && alert.longitude)
        .map(alert => (

          <Marker
            key={alert._id}
            position={[alert.latitude, alert.longitude]}
          >

            <Popup>

              🚨 Emergency Alert <br/>

              Status: {alert.status} <br/>

              {new Date(alert.createdAt).toLocaleString()} <br/><br/>

              <a
                href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>

            </Popup>

          </Marker>

        ))}

    </MapContainer>

  );

};

export default EmergencyMap;