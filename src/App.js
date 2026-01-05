import { useEffect, useState } from "react";
import PropertyCard from "./components/Property_Card";

function App() {
  const [properties, setProperties] = useState([]);
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
    <div>
      <h1>GeoEstate Properties</h1>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))
      )}
    </div>
  );
}

export default App;