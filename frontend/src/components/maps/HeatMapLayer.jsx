import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet.heat";

const HeatMapLayer = ({ alerts }) => {

  const map = useMap();

  useEffect(() => {

    const heatPoints = alerts.map(a => [
      a.latitude,
      a.longitude,
      0.5
    ]);

    const heat = window.L.heatLayer(heatPoints, {
      radius: 30
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };

  }, [alerts, map]);

  return null;

};

export default HeatMapLayer;