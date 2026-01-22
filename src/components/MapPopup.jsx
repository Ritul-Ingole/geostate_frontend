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
};

export default MapPopup;    