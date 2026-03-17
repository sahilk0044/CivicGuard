import React from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const AuthorityMap = () => {

  const location = useLocation();
  const { latitude, longitude, locationName } = location.state || {};

  return (

    <div style={{ height: "100vh", width: "100%" }}>

      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            {locationName || "Alert Location"}
          </Popup>
        </Marker>

      </MapContainer>

    </div>

  );

};

export default AuthorityMap;