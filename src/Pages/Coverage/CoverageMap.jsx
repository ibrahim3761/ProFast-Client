import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker paths for build environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FlyToDistrict = ({ serviceCenters, searchQuery }) => {
  const map = useMap();

  useEffect(() => {
    if (!searchQuery) return;

    const matched = serviceCenters.find((center) =>
      center.district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched) {
      map.flyTo([matched.latitude, matched.longitude], 10, {
        duration: 1.5,
      });
    }
  }, [searchQuery, serviceCenters, map]);

  return null;
};

const CoverageMap = ({ serviceCenters, searchQuery }) => {
  const position = [23.8103, 90.4125]; // Dhaka

  return (
    <div className="w-full h-[580px] rounded-xl overflow-hidden shadow">
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Zoom on search */}
        <FlyToDistrict
          serviceCenters={serviceCenters}
          searchQuery={searchQuery}
        />

        {/* Render markers */}
        {Array.isArray(serviceCenters) &&
          serviceCenters.map((center, index) => (
            <Marker
              key={index}
              position={[center.latitude, center.longitude]}
              icon={L.icon({
                iconUrl: markerIcon,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -41],
              })}
            >
              <Popup>
                <strong>{center.district}</strong>
                <br />
                Region: {center.region}
                <br />
                City: {center.city}
                <br />
                Areas: {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
