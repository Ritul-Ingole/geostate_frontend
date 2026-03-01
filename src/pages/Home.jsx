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











// import { useEffect, useRef, useState } from "react";
// import Navbar from "../components/Navbar";
// import MapView from "../components/MapView";
// import PropertyCard from "../components/Property_Card";
// import { Search, SlidersHorizontal, Home as HomeIcon } from "lucide-react";
// import axios from "axios";
// import "../styles/Home.css";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [activePropertyId, setActivePropertyId] = useState(null);
//   const [purposeFilter, setPurposeFilter] = useState("rent"); // Default to 'rent'
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
//   const [maxPrice, setMaxPrice] = useState(100000000);
//   const [searchText, setSearchText] = useState("");

//   const cardRefs = useRef({});

//   // 🔒 Protect route
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   // Fetch all properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/properties');
//         setProperties(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching properties:', error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...properties];

//     // Purpose filter
//     if (purposeFilter !== 'all') {
//       filtered = filtered.filter(p => p.purpose === purposeFilter);
//     }

//     // Property type filter
//     if (propertyTypeFilter !== 'all') {
//       filtered = filtered.filter(p => p.propertyType === propertyTypeFilter);
//     }

//     // Price filter
//     filtered = filtered.filter(p => p.price <= maxPrice);

//     // Search text filter (case-insensitive)
//     if (searchText.trim()) {
//       const searchLower = searchText.toLowerCase();
//       filtered = filtered.filter(p => 
//         p.title.toLowerCase().includes(searchLower)
//       );
//     }

//     setFilteredProperties(filtered);
//   }, [properties, purposeFilter, propertyTypeFilter, maxPrice, searchText]);

//   const handleMarkerClick = (id) => {
//     setActivePropertyId(id);
//     const element = cardRefs.current[id];
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   };

//   const handleMapMove = (center) => {
//     // Optional: Can be used for future features like "search this area"
//     // For now, we just accept the parameter to prevent errors
//     console.log('Map moved to:', center);
//   };

//   return (
//     <>
//       <Navbar />
      
//       <div className="home-wrapper">
//         {/* Top Filter Bar */}
//         <div className="top-filter-bar">
//           <div className="filter-bar-content">
//             {/* Search Bar */}
//             <div className="search-bar-container">
//               <Search className="search-icon" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search properties by name..."
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="search-input"
//               />
//               {searchText && (
//                 <button 
//                   className="clear-search"
//                   onClick={() => setSearchText('')}
//                   aria-label="Clear search"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             {/* Filter Dropdowns */}
//             <div className="filter-dropdowns">
//               {/* Purpose Filter - FIRST */}
//               <div className="filter-dropdown">
//                 <label>Purpose</label>
//                 <select
//                   value={purposeFilter}
//                   onChange={(e) => setPurposeFilter(e.target.value)}
//                   className="dropdown-select"
//                 >
//                   <option value="all">All</option>
//                   <option value="rent">For Rent</option>
//                   <option value="sell">For Sale</option>
//                   <option value="buy">For Buy</option>
//                 </select>
//               </div>

//               {/* Property Type Filter - SECOND */}
//               <div className="filter-dropdown">
//                 <label>Property Type</label>
//                 <select
//                   value={propertyTypeFilter}
//                   onChange={(e) => setPropertyTypeFilter(e.target.value)}
//                   className="dropdown-select"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="studio">Studio</option>
//                   <option value="apartment">Apartment</option>
//                   <option value="villa">Villa</option>
//                 </select>
//               </div>

//               {/* Price Filter - THIRD */}
//               <div className="filter-dropdown">
//                 <label>Price</label>
//                 <select 
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(Number(e.target.value))}
//                   className="dropdown-select"
//                 >
//                   <option value="100000000">Any Price</option>
//                   <option value="5000000">Up to ₹50L</option>
//                   <option value="10000000">Up to ₹1Cr</option>
//                   <option value="50000000">Up to ₹5Cr</option>
//                   <option value="100000000">Up to ₹10Cr</option>
//                 </select>
//               </div>

              

//               <button className="more-filters-btn">
//                 <SlidersHorizontal size={18} />
//                 More
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="home-container">
//           {/* LEFT SIDE - Property Cards */}
//           <div className="properties-panel">
//             <div className="properties-header">
//               <h2 className="properties-title">
//                 {filteredProperties.length} Properties Found
//               </h2>
//               <div className="sort-dropdown">
//                 <select className="sort-select">
//                   <option>Price: Low to High</option>
//                   <option>Price: High to Low</option>
//                   <option>Newest</option>
//                 </select>
//               </div>
//             </div>

//             <div className="properties-grid">
//               {filteredProperties.length === 0 ? (
//                 <div className="no-results">
//                   <HomeIcon size={64} />
//                   <h3>No properties found</h3>
//                   <p>Try adjusting your filters or search terms</p>
//                 </div>
//               ) : (
//                 filteredProperties.map((property) => (
//                   <div
//                     key={property._id}
//                     ref={(el) => (cardRefs.current[property._id] = el)}
//                   >
//                     <PropertyCard
//                       property={property}
//                       isHighlighted={activePropertyId === property._id}
//                       onMouseEnter={() => setActivePropertyId(property._id)}
//                       onMouseLeave={() => setActivePropertyId(null)}
//                     />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* RIGHT SIDE - Map */}
//           <div className="map-panel">
//             <MapView
//               properties={filteredProperties}
//               highlightedProperty={activePropertyId}
//               onMarkerClick={handleMarkerClick}
//               onMapMove={handleMapMove}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Home;













// import { useEffect, useRef, useState } from "react";
// import Navbar from "../components/Navbar";
// import MapView from "../components/MapView";
// import PropertyCard from "../components/Property_Card";
// import { MapPin, DollarSign, Home as HomeIcon, Search, SlidersHorizontal } from "lucide-react";
// import axios from "axios";
// import "../styles/Home.css";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [filteredProperties, setFilteredProperties] = useState([]);
//   const [activePropertyId, setActivePropertyId] = useState(null);
//   const [purposeFilter, setPurposeFilter] = useState("all");
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
//   const [maxPrice, setMaxPrice] = useState(100000000);
//   const [searchMode, setSearchMode] = useState("all");
//   const [mapCenter, setMapCenter] = useState(null);

//   const cardRefs = useRef({});

//   // 🔒 Protect route
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   // Fetch all properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/properties');
//         setProperties(response.data.data || []);
//       } catch (error) {
//         console.error('Error fetching properties:', error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...properties];

//     // Search mode filter
//     if (searchMode === 'nearby' && mapCenter) {
//       filtered = filtered.filter(property => {
//         const distance = calculateDistance(
//           mapCenter.lat,
//           mapCenter.lng,
//           property.location.coordinates[1],
//           property.location.coordinates[0]
//         );
//         return distance <= 50; // 50km radius
//       });
//     }

//     // Purpose filter
//     if (purposeFilter !== 'all') {
//       filtered = filtered.filter(p => p.purpose === purposeFilter);
//     }

//     // Property type filter
//     if (propertyTypeFilter !== 'all') {
//       filtered = filtered.filter(p => p.propertyType === propertyTypeFilter);
//     }

//     // Price filter
//     filtered = filtered.filter(p => p.price <= maxPrice);

//     setFilteredProperties(filtered);
//   }, [properties, searchMode, purposeFilter, propertyTypeFilter, maxPrice, mapCenter]);

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of Earth in km
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const formatPrice = (price) => {
//     if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
//     if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
//     return `₹${price.toLocaleString()}`;
//   };

//   const handleMarkerClick = (id) => {
//     setActivePropertyId(id);
//     const element = cardRefs.current[id];
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   };

//   return (
//     <>
//       <Navbar />
      
//       <div className="home-wrapper">
//         {/* Top Filter Bar - Zillow Style */}
//         <div className="top-filter-bar">
//           <div className="filter-bar-content">
//             <div className="filter-buttons">
//               <button 
//                 className={`filter-btn ${purposeFilter === 'rent' ? 'active' : ''}`}
//                 onClick={() => setPurposeFilter('rent')}
//               >
//                 For Rent
//               </button>
//               <button 
//                 className={`filter-btn ${purposeFilter === 'sell' ? 'active' : ''}`}
//                 onClick={() => setPurposeFilter('sell')}
//               >
//                 For Sale
//               </button>
//               <button 
//                 className={`filter-btn ${purposeFilter === 'buy' ? 'active' : ''}`}
//                 onClick={() => setPurposeFilter('buy')}
//               >
//                 For Buy
//               </button>
//             </div>

//             <div className="filter-dropdowns">
//               <div className="filter-dropdown">
//                 <label>Price</label>
//                 <select 
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(Number(e.target.value))}
//                   className="dropdown-select"
//                 >
//                   <option value="100000000">Any Price</option>
//                   <option value="5000000">Up to ₹50L</option>
//                   <option value="10000000">Up to ₹1Cr</option>
//                   <option value="50000000">Up to ₹5Cr</option>
//                   <option value="100000000">Up to ₹10Cr</option>
//                 </select>
//               </div>

//               <div className="filter-dropdown">
//                 <label>Property Type</label>
//                 <select
//                   value={propertyTypeFilter}
//                   onChange={(e) => setPropertyTypeFilter(e.target.value)}
//                   className="dropdown-select"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="studio">Studio</option>
//                   <option value="apartment">Apartment</option>
//                   <option value="villa">Villa</option>
//                 </select>
//               </div>

//               <div className="filter-dropdown">
//                 <label>Search Mode</label>
//                 <select
//                   value={searchMode}
//                   onChange={(e) => setSearchMode(e.target.value)}
//                   className="dropdown-select"
//                 >
//                   <option value="all">All Properties</option>
//                   <option value="nearby">Nearby</option>
//                 </select>
//               </div>

//               <button className="more-filters-btn">
//                 <SlidersHorizontal size={18} />
//                 More
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="home-container">
//           {/* LEFT SIDE - Property Cards */}
//           <div className="properties-panel">
//             <div className="properties-header">
//               <h2 className="properties-title">
//                 {filteredProperties.length} Properties Found
//               </h2>
//               <div className="sort-dropdown">
//                 <select className="sort-select">
//                   <option>Price: Low to High</option>
//                   <option>Price: High to Low</option>
//                   <option>Newest</option>
//                 </select>
//               </div>
//             </div>

//             <div className="properties-grid">
//               {filteredProperties.length === 0 ? (
//                 <div className="no-results">
//                   <HomeIcon size={64} />
//                   <h3>No properties found</h3>
//                   <p>Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 filteredProperties.map((property) => (
//                   <div
//                     key={property._id}
//                     ref={(el) => (cardRefs.current[property._id] = el)}
//                   >
//                     <PropertyCard
//                       property={property}
//                       isHighlighted={activePropertyId === property._id}
//                       onMouseEnter={() => setActivePropertyId(property._id)}
//                       onMouseLeave={() => setActivePropertyId(null)}
//                     />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* RIGHT SIDE - Map */}
//           <div className="map-panel">
//             <MapView
//               properties={filteredProperties}
//               highlightedProperty={activePropertyId}
//               onMarkerClick={handleMarkerClick}
//               onMapMove={setMapCenter}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Home;
















// import { useEffect, useRef, useState } from "react";
// import MapView from "../components/MapView";
// import PropertyCard from "../components/Property_Card";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { MapPin, DollarSign, Home as HomeIcon, Search } from "lucide-react";
// import "../styles/Home.css";

// function Home() {
//   const { token } = useAuth();
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [activePropertyId, setActivePropertyId] = useState(null);
//   const [purposeFilter, setPurposeFilter] = useState("all");
//   const [maxPrice, setMaxPrice] = useState(100000000);
//   const [searchMode, setSearchMode] = useState("all"); // all | nearby

//   const cardRefs = useRef({});

//   // 🔒 Protect route
//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   // Fetch all properties
//   const fetchAllProperties = () => {
//     fetch("http://localhost:8000/api/properties")
//       .then((res) => res.json())
//       .then((data) => setProperties(data.data || []));
//   };

//   // Fetch nearby properties
//   const fetchNearbyProperties = (lat, lng) => {
//     fetch(
//       `http://localhost:8000/api/properties/nearby?lat=${lat}&lng=${lng}&radius=50000`
//     )
//       .then((res) => res.json())
//       .then((data) => setProperties(data.data || []));
//   };

//   useEffect(() => {
//     if (searchMode === "all") {
//       fetchAllProperties();
//     } else {
//       // default Pune coords
//       fetchNearbyProperties(18.5204, 73.8567);
//     }
//   }, [searchMode]);

//   if (!Array.isArray(properties)) return null;
  
//   // Filters
//   const filteredProperties = properties.filter((property) => {
//     const matchesPurpose =
//       purposeFilter === "all" || property.purpose === purposeFilter;
//     const matchesPrice = property.price <= maxPrice;
//     return matchesPurpose && matchesPrice;
//   });

//   const formatPrice = (price) => {
//     if (price >= 10000000) return (price / 10000000).toFixed(1) + "Cr";
//     if (price >= 100000) return (price / 100000).toFixed(1) + "L";
//     return "₹" + price.toLocaleString();
//   };

//   return (
//     <div className="home-container">
//       {/* LEFT PANEL - PROPERTIES & FILTERS */}
//       <div className="left-panel">
//         {/* Header */}
//         <div className="property-header">
//           <div className="header-title">
//             <HomeIcon size={28} className="header-icon" />
//             <div>
//               <h2>Discover Properties</h2>
//               <p className="result-count">{filteredProperties.length} properties found</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="filters-section">
//           <div className="filter-group">
//             <label className="filter-label">
//               <Search size={18} />
//               <span>Search Mode</span>
//             </label>
//             <select
//               value={searchMode}
//               onChange={(e) => setSearchMode(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Properties</option>
//               <option value="nearby">Nearby Properties</option>
//             </select>
//           </div>

//           <div className="filter-group">
//             <label className="filter-label">
//               <HomeIcon size={18} />
//               <span>Property Type</span>
//             </label>
//             <select
//               value={purposeFilter}
//               onChange={(e) => setPurposeFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="all">All Types</option>
//               <option value="rent">For Rent</option>
//               <option value="sell">For Sale</option>
//               <option value="buy">For Buy</option>
//             </select>
//           </div>

//           <div className="filter-group">
//             <label className="filter-label">
//               <DollarSign size={18} />
//               <span>Max Price</span>
//             </label>
//             <div className="price-display">
//               {formatPrice(maxPrice)}
//             </div>
//             <input
//               type="range"
//               min="10000"
//               max="150000000"
//               step="50000"
//               value={maxPrice}
//               onChange={(e) => setMaxPrice(Number(e.target.value))}
//               className="price-slider"
//             />
//             <div className="price-range-labels">
//               <span>₹10K</span>
//               <span>₹15Cr</span>
//             </div>
//           </div>
//         </div>

//         {/* Properties List */}
//         <div className="properties-list">
//           {filteredProperties.length === 0 ? (
//             <div className="no-results">
//               <HomeIcon size={48} />
//               <p>No properties match your filters</p>
//               <small>Try adjusting your search criteria</small>
//             </div>
//           ) : (
//             filteredProperties.map((property) => (
//               <PropertyCard
//                 key={property._id}
//                 property={property}
//                 isActive={property._id.toString() === activePropertyId}
//                 onHover={setActivePropertyId}
//                 ref={(el) => (cardRefs.current[property._id] = el)}
//               />
//             ))
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL - MAP */}
//       <div className="map-panel">
//         <MapView
//           properties={filteredProperties}
//           activePropertyId={activePropertyId}
//           onMarkerClick={(id) => {
//             setActivePropertyId(id);
//             cardRefs.current[id]?.scrollIntoView({
//               behavior: "smooth",
//               block: "nearest",
//             });
//           }}
//           onMapMove={(center) => {
//             if (searchMode === "nearby") {
//               fetchNearbyProperties(center.lat, center.lng);
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default Home;