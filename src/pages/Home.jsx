import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import PropertyCard from "../components/Property_Card";
import { Search, SlidersHorizontal, Home as HomeIcon } from "lucide-react";
import axios from "axios";
import "../styles/Home.css";

function Home() {

  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState("rent"); // Default to 'rent'
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [searchText, setSearchText] = useState("");

  const cardRefs = useRef({});

  // Handle URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const purposeQuery = searchParams.get('purpose');
    
    if (searchQuery) {
      setSearchText(searchQuery);
    }
    
    if (purposeQuery) {
      setPurposeFilter(purposeQuery);
    }
  }, [location.search]);

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/properties');
        setProperties(response.data.data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Purpose filter
    if (purposeFilter !== 'all') {
      filtered = filtered.filter(p => p.purpose === purposeFilter);
    }

    // Property type filter
    if (propertyTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.propertyType === propertyTypeFilter);
    }

    // Price filter
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Search text filter (case-insensitive)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProperties(filtered);
  }, [properties, purposeFilter, propertyTypeFilter, maxPrice, searchText]);

  const handleMarkerClick = (id) => {
    setActivePropertyId(id);
    const element = cardRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleMapMove = (center) => {
    // Optional: Can be used for future features like "search this area"
    // For now, we just accept the parameter to prevent errors
    console.log('Map moved to:', center);
  };

  return (
    <>
      <Navbar />
      
      <div className="home-wrapper">
        {/* Top Filter Bar */}
        <div className="top-filter-bar">
          <div className="filter-bar-content">
            {/* Search Bar */}
            <div className="search-bar-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search properties by name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
              {searchText && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchText('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-dropdowns">
              {/* Purpose Filter - FIRST */}
              <div className="filter-dropdown">
                <label>Purpose</label>
                <select
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="all">All</option>
                  <option value="rent">For Rent</option>
                  <option value="sell">For Sale</option>
                  <option value="buy">Sold</option>
                </select>
              </div>

              {/* Price Filter - SECOND */}
              <div className="filter-dropdown">
                <label>Price</label>
                <select 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="dropdown-select"
                >
                  <option value="100000000">Any Price</option>
                  <option value="5000000">Up to ₹50L</option>
                  <option value="10000000">Up to ₹1Cr</option>
                  <option value="50000000">Up to ₹5Cr</option>
                  <option value="100000000">Up to ₹10Cr</option>
                </select>
              </div>

              {/* Property Type Filter - THIRD */}
              <div className="filter-dropdown">
                <label>Property Type</label>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="all">All Types</option>
                  <option value="studio">Studio</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <button className="more-filters-btn">
                <SlidersHorizontal size={18} />
                More
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="home-container">
          {/* LEFT SIDE - Property Cards */}
          <div className="properties-panel">
            <div className="properties-header">
              <h2 className="properties-title">
                {filteredProperties.length} Properties Found
              </h2>
              <div className="sort-dropdown">
                <select className="sort-select">
                  <option>Homes for You</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="properties-grid">
              {filteredProperties.length === 0 ? (
                <div className="no-results">
                  <HomeIcon size={64} />
                  <h3>No properties found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    ref={(el) => (cardRefs.current[property._id] = el)}
                  >
                    <PropertyCard
                      property={property}
                      isHighlighted={activePropertyId === property._id.toString()}
                      onMouseEnter={() => setActivePropertyId(property._id.toString())}
                      onMouseLeave={() => setActivePropertyId(null)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDE - Map */}
          <div className="map-panel">
            <MapView
              properties={filteredProperties}
              activePropertyId={activePropertyId}
              onMarkerClick={handleMarkerClick}
              onMapMove={handleMapMove}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;