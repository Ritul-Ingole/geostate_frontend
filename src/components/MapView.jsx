import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useMapEvents } from "react-leaflet";

const normalIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const activeIcon = new L.Icon({
  iconUrl: markerIcon2x,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [35, 55],
  iconAnchor: [17, 55],
});

function MapEvents({ onMoveEnd }) {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      onMoveEnd(center);
    },
  });

  return null;
}

function MapView({
  properties,
  activePropertyId,
  onMarkerClick,
  onMapMove,
}) {
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
          <Marker
            key={property._id}
            position={[lat, lng]}
            icon={
              property._id.toString() === activePropertyId
                ? activeIcon
                : normalIcon
            }
            eventHandlers={{
              click: () => onMarkerClick(property._id.toString()),
            }}
          >
            <Popup>
              <div style={{ minWidth: "180px" }}>
                <h4 style={{ margin: "0 0 4px 0" }}>{property.title}</h4>
                <p style={{ margin: "0", fontSize: "14px" }}>
                  ₹ {property.price}
                </p>
                <p style={{ margin: "0", fontSize: "12px", color: "#555" }}>
                  {property.purpose.toUpperCase()} · {property.propertyType}
                </p>
              </div>
            </Popup>
          </Marker>
        );
})}
      <MapEvents onMoveEnd={onMapMove} />
    </MapContainer> 
  );
}

export default MapView;