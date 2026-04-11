import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map({ lat, lng }) {

  if (!lat || !lng) return <p>No location</p>;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "250px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]}>
        <Popup>🚚 Delivery Partner</Popup>
      </Marker>
    </MapContainer>
  );
}
