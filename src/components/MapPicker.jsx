import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix marker icon (important)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function MapPicker({ setForm, setLocationConfirmed, lat, lng }) {

  const [position, setPosition] = useState(
    lat && lng ? [Number(lat), Number(lng)] : [26.8467, 80.9462]
  );

  function LocationMarker() {
useEffect(() => {
  if (lat && lng) {
    setPosition([Number(lat), Number(lng)]);
  }
}, [lat, lng]);
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setPosition([lat, lng]);

        // 🔥 Reverse geocoding (auto address fill)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then(res => res.json())
          .then(data => {

            const addr = data.address || {};

            setForm(prev => ({
              ...prev,
              house_no: addr.house_number || "",
              street: addr.road || "",
              locality: addr.suburb || addr.village || "",
              city: addr.city || addr.town || "",
              state: addr.state || "",
              pincode: addr.postcode || "",
              latitude: lat,
              longitude: lng
            }));

          })
          .catch(err => console.log(err));
      }
    });

    return <Marker position={position} />;
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
