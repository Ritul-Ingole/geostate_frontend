import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f6f3",
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem 1.5rem",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "1.75rem",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#999",
    margin: "4px 0 0",
  },
  filterBar: {
    display: "flex",
    gap: 10,
    marginBottom: "1.75rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterBtn: {
    padding: "8px 18px",
    borderRadius: 30,
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: "#555",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterBtnActive: {
    background: "#1a1a2e",
    color: "#e8c97e",
    border: "1px solid #1a1a2e",
  },
  priceSelect: {
    padding: "8px 14px",
    borderRadius: 30,
    border: "1px solid #e0e0e0",
    background: "#fff",
    fontSize: 13,
    color: "#555",
    cursor: "pointer",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #ececec",
    overflow: "hidden",
    transition: "transform 0.15s, box-shadow 0.15s",
    cursor: "pointer",
  },
  imageWrap: {
    position: "relative",
    height: 200,
    background: "#f0ede8",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imgPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0ede8",
    color: "#ccc",
    fontSize: 40,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: "#1a1a2e",
    color: "#e8c97e",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "none",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
    transition: "transform 0.15s",
  },
  cardBody: {
    padding: "1rem 1.1rem 1.1rem",
  },
  price: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 4px",
  },
  location: {
    fontSize: 13,
    color: "#888",
    margin: "0 0 12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  metaRow: {
    display: "flex",
    gap: 12,
    fontSize: 12,
    color: "#aaa",
    marginBottom: 14,
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  cardActions: {
    display: "flex",
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    padding: "9px 0",
    borderRadius: 10,
    border: "1px solid #1a1a2e",
    background: "#1a1a2e",
    color: "#e8c97e",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  removeBtn: {
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid #fde8e8",
    background: "#fff9f9",
    color: "#c0392b",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "5rem 2rem",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: "1rem",
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 8px",
  },
  emptyText: {
    fontSize: 14,
    color: "#aaa",
    margin: "0 0 1.5rem",
  },
  emptyBtn: {
    padding: "11px 28px",
    borderRadius: 10,
    border: "none",
    background: "#1a1a2e",
    color: "#e8c97e",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  loadingText: {
    fontSize: 15,
    color: "#aaa",
  },
  count: {
    fontSize: 13,
    color: "#999",
    fontWeight: 500,
  },
};

function formatPrice(price) {
  if (!price) return "Price on request";
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString()}`;
}

const PRICE_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under ₹50L", min: 0, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹3Cr", min: 10000000, max: 30000000 },
  { label: "Above ₹3Cr", min: 30000000, max: Infinity },
];

export default function SavedProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState(0);
  const [removing, setRemoving] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchSaved();
  }, []);

  async function fetchSaved() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/saved-properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties || []);
    } catch (err) {
      console.error("Failed to load saved properties:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(e, propertyId) {
    e.stopPropagation();
    setRemoving(propertyId);
    try {
      const res = await fetch(`${API}/auth/save-property/${propertyId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      console.error("Failed to remove:", err);
    } finally {
      setRemoving(null);
    }
  }

  const range = PRICE_RANGES[priceRange];
  const filtered = properties.filter((p) => {
    const typeMatch =
      typeFilter === "all" ||
      (p.listingType || "").toLowerCase() === typeFilter;
    const priceMatch = p.price >= range.min && p.price <= range.max;
    return typeMatch && priceMatch;
  });

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <p style={styles.loadingText}>Loading saved properties...</p>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div style={styles.page}>
        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>
            <div>
              <p style={styles.pageTitle}>Saved Properties</p>
              <p style={styles.pageSubtitle}>Properties you've marked as favourite</p>
            </div>
            <span style={styles.count}>
              {filtered.length} {filtered.length === 1 ? "property" : "properties"}
            </span>
          </div>

          {/* Filters — only show if there are properties */}
          {properties.length > 0 && (
            <div style={styles.filterBar}>
              {["all", "buy", "rent"].map((t) => (
                <button
                  key={t}
                  style={{
                    ...styles.filterBtn,
                    ...(typeFilter === t ? styles.filterBtnActive : {}),
                  }}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === "all" ? "All" : t === "buy" ? "Buy" : "Rent"}
                </button>
              ))}

              <select
                style={styles.priceSelect}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              >
                {PRICE_RANGES.map((r, i) => (
                  <option key={i} value={i}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Empty state */}
          {properties.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>♡</div>
              <p style={styles.emptyTitle}>No saved properties yet</p>
              <p style={styles.emptyText}>
                You haven't saved any properties yet. Browse and tap the heart to save one.
              </p>
              <button style={styles.emptyBtn} onClick={() => navigate("/home")}>
                Browse Properties
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>⊘</div>
              <p style={styles.emptyTitle}>No matches</p>
              <p style={styles.emptyText}>No saved properties match your current filters.</p>
              <button
                style={styles.emptyBtn}
                onClick={() => { setTypeFilter("all"); setPriceRange(0); }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Property grid */
            <div style={styles.grid}>
              {filtered.map((property) => (
                <div
                  key={property._id}
                  style={styles.card}
                  onClick={() => navigate(`/property/${property._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Image */}
                  <div style={styles.imageWrap}>
                    {property.images && property.images[0] ? (
                      <img
                        src={`http://localhost:8000${property.images[0]}`}
                        alt={property.title}
                        style={styles.img}
                      />
                    ) : (
                      <div style={styles.imgPlaceholder}>⌂</div>
                    )}
                    {property.listingType && (
                      <span style={styles.badge}>{property.listingType}</span>
                    )}
                    <button
                      style={styles.heartBtn}
                      onClick={(e) => handleRemove(e, property._id)}
                      title="Remove from saved"
                    >
                      {removing === property._id ? "..." : "♥"}
                    </button>
                  </div>

                  {/* Body */}
                  <div style={styles.cardBody}>
                    <p style={styles.price}>{formatPrice(property.price)}</p>
                    <p style={styles.location}>
                      {[property.locality, property.city].filter(Boolean).join(", ") || "Location not specified"}
                    </p>

                    <div style={styles.metaRow}>
                      {property.bedrooms && (
                        <span style={styles.metaItem}>{property.bedrooms} bed</span>
                      )}
                      {property.bathrooms && (
                        <span style={styles.metaItem}>{property.bathrooms} bath</span>
                      )}
                      {property.area && (
                        <span style={styles.metaItem}>{property.area} sq.ft</span>
                      )}
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        style={styles.viewBtn}
                        onClick={(e) => { e.stopPropagation(); navigate(`/property/${property._id}`); }}
                      >
                        View Details
                      </button>
                      <button
                        style={styles.removeBtn}
                        onClick={(e) => handleRemove(e, property._id)}
                        disabled={removing === property._id}
                      >
                        {removing === property._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}