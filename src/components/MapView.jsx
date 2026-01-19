import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MarkerClusterGroup from "react-leaflet-cluster";

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


function MapView({ properties, activePropertyId, onMarkerClick }) {
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
      <MarkerClusterGroup
        chunkedLoading
      >
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
            />
          );
        })}
      </MarkerClusterGroup>
    </MapContainer> 
  );
}

export default MapView;