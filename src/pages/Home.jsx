import { useEffect, useRef, useState } from "react";
import MapView from "../components/MapView";
import PropertyCard from "../components/Property_Card";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, Home as HomeIcon, Search } from "lucide-react";
import "../styles/Home.css";

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

  const formatPrice = (price) => {
    if (price >= 10000000) return (price / 10000000).toFixed(1) + "Cr";
    if (price >= 100000) return (price / 100000).toFixed(1) + "L";
    return "₹" + price.toLocaleString();
  };

  return (
    <div className="home-container">
      {/* LEFT PANEL - PROPERTIES & FILTERS */}
      <div className="left-panel">
        {/* Header */}
        <div className="property-header">
          <div className="header-title">
            <HomeIcon size={28} className="header-icon" />
            <div>
              <h2>Discover Properties</h2>
              <p className="result-count">{filteredProperties.length} properties found</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label className="filter-label">
              <Search size={18} />
              <span>Search Mode</span>
            </label>
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Properties</option>
              <option value="nearby">Nearby Properties</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <HomeIcon size={18} />
              <span>Property Type</span>
            </label>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="rent">For Rent</option>
              <option value="sell">For Sale</option>
              <option value="buy">For Buy</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <DollarSign size={18} />
              <span>Max Price</span>
            </label>
            <div className="price-display">
              {formatPrice(maxPrice)}
            </div>
            <input
              type="range"
              min="10000"
              max="150000000"
              step="50000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>₹10K</span>
              <span>₹15Cr</span>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="properties-list">
          {filteredProperties.length === 0 ? (
            <div className="no-results">
              <HomeIcon size={48} />
              <p>No properties match your filters</p>
              <small>Try adjusting your search criteria</small>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isActive={property._id.toString() === activePropertyId}
                onHover={setActivePropertyId}
                ref={(el) => (cardRefs.current[property._id] = el)}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL - MAP */}
      <div className="map-panel">
        <MapView
          properties={filteredProperties}
          activePropertyId={activePropertyId}
          onMarkerClick={(id) => {
            setActivePropertyId(id);
            cardRefs.current[id]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
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