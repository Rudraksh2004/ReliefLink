import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Dynamically import Leaflet components to prevent SSR errors
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });

export default function ReliefHeatmap() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    // Fetch aggregated region data for the heatmap
    const unsub = onSnapshot(collection(db, "analytics_cache"), (snapshot) => {
      const heatmapData = snapshot.docs
        .filter(doc => doc.id.startsWith("region_"))
        .map(doc => {
          const data = doc.data();
          // [lat, lng, intensity]
          // Intensity is calculated as sum of urgency / 100
          return [data.lat, data.lng, (data.totalUrgency || 0) / 100];
        });
      setPoints(heatmapData);
    });

    return () => unsub();
  }, []);

  return (
    <div className="heatmap-wrapper">
      <MapContainer center={[22.57, 88.36]} zoom={11} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {/* Heatmap Layer Implementation */}
        <HeatLayer points={points} />
      </MapContainer>

      <style jsx>{`
        .heatmap-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}

// Internal component to handle Leaflet.heat logic
function HeatLayer({ points }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Direct Leaflet.heat integration
    // Note: In production, you'd install 'leaflet.heat' as a dependency
    const L = require("leaflet");
    require("leaflet.heat");

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);

    return () => map.removeLayer(heatLayer);
  }, [map, points]);

  return null;
}
