
import { useEffect, useState } from "react";
import PropertyCard from "./components/Property_Card";
import MapView from "./components/MapView";

function App() {
  const [properties, setProperties] = useState([]);
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch("http://localhost:8000/api/properties")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch properties");
        }
        return res.json();
      })
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);



  if (loading) return <h2>Loading properties...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ display: "flex" }}>
      {/* LEFT: property list */}
      <div style={{ width: "40%", padding: "16px", overflowY: "auto" }}>
        <h2>Properties</h2>
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onHover={setActivePropertyId}
          />
      ))}
      </div>

      {/* RIGHT: map */}
      <div style={{ width: "60%" }}>
        <MapView properties={properties} activePropertyId={activePropertyId} />
      </div>
    </div>
  );
}


export default App;