'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../lib/firebase';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: (markerIcon as any).src || markerIcon,
  shadowUrl: (markerShadow as any).src || markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GeographicHeatmap: React.FC = () => {
  const [regions, setRegions] = useState<any[]>([]);
  const center: [number, number] = [19.0760, 72.8777]; // Mumbai center

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'region_priority_scores'), (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegions(data);
    });
    return () => unsubscribe();
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 80) return '#ef4444'; // Red
    if (intensity > 50) return '#f97316'; // Orange
    if (intensity > 20) return '#eab308'; // Yellow
    return '#3b82f6'; // Blue
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <h2 className="text-base font-bold text-gray-800">Priority Heatmap</h2>
        <div className="flex gap-2 text-[10px] font-semibold">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f97316]"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Low</span>
        </div>
      </div>

      <div className="flex-1 relative min-h-[300px]">
        <MapContainer 
          center={center} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {regions.map((region) => (
            <CircleMarker
              key={region.id}
              center={[region.lat, region.lng]}
              pathOptions={{
                fillColor: getIntensityColor(region.heat_intensity_value || 0),
                color: getIntensityColor(region.heat_intensity_value || 0),
                fillOpacity: 0.6,
                weight: 1
              }}
              radius={15 + (region.task_density || 0) * 2}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-bold">Region: {region.id}</div>
                  <div>Avg Urgency: {Math.round(region.average_urgency_score)}</div>
                  <div>Task Density: {region.task_density}</div>
                  <div>Heat Intensity: {Math.round(region.heat_intensity_value)}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GeographicHeatmap;
