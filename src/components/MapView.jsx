import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ properties }) {
  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.map((property) => {
        const [lng, lat] = property.location.coordinates;
        return (
          <Marker key={property._id} position={[lat, lng]}>
            <Popup>
              <strong>{property.title}</strong><br />
              ₹{property.price}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapView;