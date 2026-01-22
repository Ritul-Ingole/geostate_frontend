import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/properties/${id}`)
      .then((res) => res.json())
      .then(setProperty);
  }, [id]);

  if (!property) return <h2>Loading property...</h2>;

  return (
  <div style={{ padding: "32px", maxWidth: "800px", margin: "0 auto" }}>
    <Link
      to="/"
      style={{
        display: "inline-block",
        marginBottom: "16px",
        color: "#007bff",
        textDecoration: "none",
        fontSize: "14px",
      }}
    >
      ← Back to Map
    </Link>

    <h1 style={{ marginBottom: "8px" }}>{property.title}</h1>

    <p style={{ fontSize: "18px", fontWeight: 600 }}>
      ₹ {property.price}
    </p>

    <p style={{ color: "#555", marginBottom: "16px" }}>
      {property.purpose.toUpperCase()} · {property.propertyType}
    </p>

    {property.description && (
      <div>
        <h3>Description</h3>
        <p>{property.description}</p>
      </div>
    )}
  </div>
);
}

export default PropertyDetails; 