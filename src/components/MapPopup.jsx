import { Link } from "react-router-dom";

function MapPopup({ property }) {
  return (
    <div style={styles.container}>
      <h4 style={styles.title}>{property.title}</h4>

      <div style={styles.row}>
        <span style={styles.price}>₹ {property.price}</span>
      </div>

      <div style={styles.meta}>
        {property.purpose.toUpperCase()} · {property.propertyType}
      </div>

      <Link
        to={`/property/${property._id}`}
        style={styles.link}
      >
        View Details →
      </Link>
    </div>
  );
}

const styles = {
  container: {
    minWidth: "200px",
    padding: "4px",
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: "15px",
    fontWeight: 600,
  },
  row: {
    marginBottom: "4px",
  },
  price: {
    fontSize: "14px",
    fontWeight: 500,
  },
  meta: {
    fontSize: "12px",
    color: "#555",
  },
  link: {
  display: "inline-block",
  marginTop: "6px",
  fontSize: "12px",
  color: "#007bff",
  textDecoration: "none",
  fontWeight: 500,
  },
};

export default MapPopup;    