import { useEffect, useRef, useState } from "react";
import PropertyCard from "./components/Property_Card";
import MapView from "./components/MapView";
import { Routes, Route } from "react-router-dom";
import PropertyDetails from "./pages/PropertyDetails";


function App() {

  const [properties, setProperties] = useState([]);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [searchMode, setSearchMode] = useState("all");     // "all" | "nearby"
  const cardRefs = useRef({});
  const fetchNearby = (lat, lng) => {
    fetch(
      `http://localhost:8000/api/properties/nearby?lng=${lng}&lat=${lat}&radius=5000000`
    )
      .then((res) => res.json())
      .then(setProperties);
  };

  const fetchAllProperties = () => {
    fetch("http://localhost:8000/api/properties")
      .then((res) => res.json())
      .then(setProperties);
  };
  useEffect(() => {
  if (searchMode === "all") {
    fetchAllProperties();
  } else {
    fetchNearby(18.5204, 73.8567);
  }
}, [searchMode]);




const filteredProperties = properties.filter((property) => {
  const matchesPurpose =
    purposeFilter === "all" || property.purpose === purposeFilter;

  const matchesPrice = property.price <= maxPrice;

  return matchesPurpose && matchesPrice;
});


  return (
  <Routes>
    <Route
      path="/"
      element={
        <div style={{ display: "flex" }}>
          <div style={{ marginBottom: "16px" }}>
            <label>
              Search Mode:{" "}
              <select
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
              >
                <option value="all">All Properties</option>
                <option value="nearby">Nearby (Map-based)</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>
              Purpose:{" "}
              <select
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="rent">Rent</option>
                <option value="sell">Sell</option>
              </select>
            </label>
          </div>
          {/* LEFT: property list */}
          <div style={{ width: "40%", padding: "16px", overflowY: "auto" }}>
            <h2>Properties</h2>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onHover={setActivePropertyId}
                ref={(el) => (cardRefs.current[property._id] = el)}
              />
            ))}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label>
              Max Price: ₹{maxPrice}
              <br />
              <input
                type="range"
                min="10000"
                max="50000000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </label>
          </div>
          {/* RIGHT: map */}
          <div style={{ width: "60%" }}>
            <MapView
              properties={filteredProperties}
              activePropertyId={activePropertyId}
              onMarkerClick={(id) => {
                setActivePropertyId(id);
                cardRefs.current[id]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              onMapMove={(center) => {
                if (searchMode === "nearby") {
                  fetchNearby(center.lat, center.lng);
                }
              }}
            /> 
          </div>
        </div>
      }
    />
    <Route path="/property/:id" element={<PropertyDetails />} />
  </Routes>
);
}


export default App;