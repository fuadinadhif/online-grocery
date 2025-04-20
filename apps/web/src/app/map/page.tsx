// "use client";

// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Fix for default marker icon
// // delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// function LocationMarker() {
//   const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
//   const [zoom, setZoom] = useState(13);

//   const map = useMapEvents({
//     click(e) {
//       // Update marker position to the clicked location
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, zoom);
//     },
//     zoomend() {
//       // Update zoom level when map is zoomed
//       setZoom(map.getZoom());
//     },
//   });

//   if (typeof window === "undefined") return null;

//   return (
//     <Marker position={position}>
//       <Popup>
//         Latitude: {position.lat.toFixed(4)}
//         <br />
//         Longitude: {position.lng.toFixed(4)}
//         <br />
//         Zoom Level: {zoom}
//       </Popup>
//     </Marker>
//   );
// }

// export default function MapPage() {
//   if (typeof window === "undefined") return null;

//   return (
//     <div className="h-[500px] w-full">
//       <MapContainer
//         center={{ lat: 51.505, lng: -0.09 }}
//         zoom={13}
//         scrollWheelZoom={true}
//         className="h-full w-full"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LocationMarker />
//       </MapContainer>
//     </div>
//   );
// }

export default function MapPage() {
  return <main>Map Page</main>;
}
