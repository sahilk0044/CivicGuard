import React from "react";
import { CircleMarker } from "react-leaflet";

const SOSMarker = ({ position }) => {

  return (
    <>
      {/* Core marker */}
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{ color: "red", fillColor: "red" }}
      />

      {/* Pulse circle */}
      <CircleMarker
        center={position}
        radius={25}
        pathOptions={{
          color: "red",
          fillColor: "red",
          fillOpacity: 0.2
        }}
      />
    </>
  );

};

export default SOSMarker;