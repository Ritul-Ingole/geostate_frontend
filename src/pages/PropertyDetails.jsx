import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousal.jsx";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/properties/${id}`, {
  cache: "no-store"
})
      
      .then((res) => res.json())
      .then((data) => {
        console.log("Property fetched:", data.data);
        setProperty(data.data);
      });
  }, [id]);

  if (!property) return <h2>Loading property...</h2>;
  
  console.log("Images:", property.images);

  return (
  <div style={{ padding: "32px", maxWidth: "800px", margin: "0 auto" }}>

    <ImageCarousel images={property.images} />


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
// const styles = {
//   gallery: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
//     gap: "12px",
//     marginBottom: "24px",
//   },
//   image: {
//     width: "100%",
//     height: "200px",
//     objectFit: "cover",
//     borderRadius: "8px",
//   },
// };
export default PropertyDetails; 