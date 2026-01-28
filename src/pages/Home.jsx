import { useEffect, useRef, useState } from "react";
import MapView from "../components/MapView";
import PropertyCard from "../components/Property_Card";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [searchMode, setSearchMode] = useState("all"); // all | nearby

  const cardRefs = useRef({});

  // 🔒 Protect route
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch all properties
  const fetchAllProperties = () => {
    fetch("http://localhost:8000/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data.data || []));
  };

  // Fetch nearby properties
  const fetchNearbyProperties = (lat, lng) => {
    fetch(
      `http://localhost:8000/api/properties/nearby?lat=${lat}&lng=${lng}&radius=50000`
    )
      .then((res) => res.json())
      .then((data) => setProperties(data.data || []));
  };

  useEffect(() => {
    if (searchMode === "all") {
      fetchAllProperties();
    } else {
      // default Pune coords
      fetchNearbyProperties(18.5204, 73.8567);
    }
  }, [searchMode]);

  if (!Array.isArray(properties)) return null;
  // Filters
  const filteredProperties = properties.filter((property) => {
    const matchesPurpose =
      purposeFilter === "all" || property.purpose === purposeFilter;
    const matchesPrice = property.price <= maxPrice;
    return matchesPurpose && matchesPrice;
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT PANEL */}
      <div
        style={{
          width: "40%",
          padding: "16px",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>Properties</h2>

        {/* Filters */}
        <div style={{ marginBottom: "12px" }}>
          <label>
            Search Mode:&nbsp;
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
            >
              <option value="all">All</option>
              <option value="nearby">Nearby</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            Purpose:&nbsp;
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sell">Sell</option>
              <option value="buy">Buy</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            Max Price: ₹{maxPrice}
            <br />
            <input
              type="range"
              min="10000"
              max="150000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Property Cards */}
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onHover={setActivePropertyId}
            ref={(el) => (cardRefs.current[property._id] = el)}
          />
        ))}
      </div>

      {/* RIGHT PANEL (MAP) */}
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
              fetchNearbyProperties(center.lat, center.lng);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Home;