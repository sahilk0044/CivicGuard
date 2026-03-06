import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

/* Component to move map to user location */

function MapUpdater({ position }) {

  const map = useMap();

  useEffect(() => {

    map.setView(position, 13);

  }, [position, map]);

  return null;
}

const EmergencyMap = () => {

  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    getLocation();
    fetchAlerts();

  }, []);

  /* Get GPS */

  const getLocation = () => {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        setLocation([
          pos.coords.latitude,
          pos.coords.longitude
        ]);

      },

      (err) => {
        console.log(err);
      },

      { enableHighAccuracy: true }

    );

  };

  /* Fetch alerts */

  const fetchAlerts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get("/alerts/my-alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlerts(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  /* Don't render map until GPS is available */

  if (!location) {

    return <p>Fetching your location...</p>;

  }

  return (

    <MapContainer
      center={location}
      zoom={13}
      className="leaflet-container"
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Update map center */}

      <MapUpdater position={location} />

      {/* User marker */}

      <Marker position={location}>

        <Popup>📍 You are here</Popup>

      </Marker>

      {/* Blue highlight */}

      <CircleMarker
        center={location}
        radius={18}
        pathOptions={{ color: "blue", fillOpacity: 0.3 }}
      />

      {/* Alert markers */}

      {alerts.map(alert => (

        <Marker
          key={alert._id}
          position={[alert.latitude, alert.longitude]}
        >

          <Popup>

            🚨 Alert<br/>

            Status: {alert.status}

          </Popup>

        </Marker>

      ))}

    </MapContainer>

  );

};

export default EmergencyMap;