"use client";

import React, { useEffect } from "react";
import { 
  MapContainer, 
  TileLayer, 
  useMap, 
  Marker, 
  Popup,
  CircleMarker
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useFirestoreListener } from "@/hooks/useFirestoreListener";
import { RegionPriorityScore, PriorityLevel } from "@/types/regionPriorityScore";

// Fix for default marker icons in Leaflet + Next.js
if (typeof window !== "undefined") {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

interface HeatmapLayerProps {
  points: [number, number, number][];
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // @ts-ignore - leaflet.heat adds 'heatLayer' to L
    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

const getPriorityColor = (level: PriorityLevel) => {
  switch (level) {
    case PriorityLevel.LOW: return "#10b981"; // green
    case PriorityLevel.MEDIUM: return "#f59e0b"; // orange
    case PriorityLevel.HIGH: return "#ef4444"; // red
    case PriorityLevel.CRITICAL: return "#991b1b"; // dark red
    default: return "#6b7280";
  }
};

export const PriorityHeatmap = () => {
  const { data: regions, loading } = useFirestoreListener<RegionPriorityScore>("region_priority_scores");

  // Format data for heatmap: [lat, lng, intensity]
  const heatmapPoints: [number, number, number][] = regions.map((region) => [
    region.latitude,
    region.longitude,
    region.averageUrgencyScore / 10, // Normalize to 0-1
  ]);

  if (loading) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Initializing Map Layers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-xl">
      <MapContainer 
        center={[22.9734, 78.6569]} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Heatmap Layer */}
        <HeatmapLayer points={heatmapPoints} />

        {/* Marker Fallbacks & Tooltips */}
        {regions.map((region) => (
          <CircleMarker
            key={region.id}
            center={[region.latitude, region.longitude]}
            radius={8}
            pathOptions={{
              fillColor: getPriorityColor(region.priorityLevel),
              fillOpacity: 0.8,
              color: "white",
              weight: 2
            }}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h3 className="font-bold text-lg mb-1">{region.regionName}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority:</span>
                    <span className="font-semibold uppercase tracking-wider" style={{ color: getPriorityColor(region.priorityLevel) }}>
                      {region.priorityLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Needs:</span>
                    <span className="font-semibold">{region.totalNeeds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Avg Urgency:</span>
                    <span className="font-semibold">{region.averageUrgencyScore.toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};
