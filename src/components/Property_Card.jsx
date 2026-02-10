import { forwardRef } from "react";
//import "../styles/Property_Card.css";

const PropertyCard = forwardRef(({ property, onHover }, ref) => {
  return (
    <div className="property-cards-container">
      <div
      className="property-cards"
      ref={ref}
      onMouseEnter={() => onHover(property._id.toString())}
      onMouseLeave={() => onHover(null)}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "8px",
        cursor: "pointer"
      }}
    >
      <h3>{property.title}</h3>
      <p>₹ {property.price}</p>
      <p>{property.purpose}</p>
      <p>{property.purposeType}</p>
    </div>
    </div>
    
  );
});

export default PropertyCard;