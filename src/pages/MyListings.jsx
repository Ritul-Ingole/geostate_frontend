import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Bed, Bath, Maximize, Eye, Pencil, Trash2, CheckCircle, Building2 } from "lucide-react";
import "../styles/MyListings.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

function formatPrice(price) {
  if (!price) return "—";
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString()}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function MyListings() {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");

  const [listings,      setListings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState("all");
  const [confirmId,     setConfirmId]     = useState(null);
  const [deletingId,    setDeletingId]    = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/properties/my-listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setListings(data.data || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res  = await fetch(`${API}/properties/${id}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.filter((p) => p._id !== id));
        setConfirmId(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id, status) {
    setStatusLoading(id);
    try {
      const res  = await fetch(`${API}/properties/${id}/status`, {
        method:  "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p))
        );
      }
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setStatusLoading(null);
    }
  }

  const filtered = listings.filter((p) => {
    if (filter === "all")    return true;
    if (filter === "active") return !p.status || p.status === "active";
    if (filter === "sold")   return p.status === "sold";
    return true;
  });

  const counts = {
    all:    listings.length,
    active: listings.filter((p) => !p.status || p.status === "active").length,
    sold:   listings.filter((p) => p.status === "sold").length,
  };

  if (loading) {
    return <div className="ml-loading">Loading your listings...</div>;
  }

  return (
    <div className="ml-page">
      <div className="ml-container">

        {/* ── Navbar ── */}
        <nav className="mort-nav">
          <div className="mort-nav-inner">
            <div className="mort-logo" onClick={() => navigate('/landing')}>
              <Building2 size={22} />
              <span>GeoState</span>
            </div>
            <button className="mort-back" onClick={() => navigate('/landing')}>← Back</button>
          </div>
        </nav>

        <br></br>

        {/* Header */}
        <div className="ml-header">
          <div className="ml-header-left">
            <h1>My Listings</h1>
            <p>Manage and track all your posted properties</p>
          </div>
          <button className="ml-add-btn" onClick={() => navigate("/sell")}>
            <Plus size={16} />
            Add New Listing
          </button>
        </div>

        {/* Controls */}
        <div className="ml-controls">
          <div className="ml-tabs">
            {["all", "active", "sold"].map((f) => (
              <button
                key={f}
                className={`ml-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ))}
          </div>
          <p className="ml-count">
            <span>{filtered.length}</span>{" "}
            {filtered.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Empty state */}
        {listings.length === 0 ? (
          <div className="ml-empty">
            <div className="ml-empty-icon">⌂</div>
            <h3>No listings yet</h3>
            <p>You haven't posted any properties. Add your first one.</p>
            <button className="ml-empty-btn" onClick={() => navigate("/sell")}>
              Add your first property
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ml-empty">
            <div className="ml-empty-icon">⊘</div>
            <h3>No {filter} listings</h3>
            <p>You don't have any {filter} properties right now.</p>
            <button className="ml-empty-btn" onClick={() => setFilter("all")}>
              View all listings
            </button>
          </div>
        ) : (
          <div className="ml-list">
            {filtered.map((property) => {
              const status    = property.status || "active";
              const isConfirm = confirmId === property._id;

              return (
                <div
                  key={property._id}
                  className={`ml-card ${isConfirm ? "confirming" : ""}`}
                >
                  {/* Image */}
                  <div className="ml-card-image">
                    {property.images && property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="ml-card-image-placeholder">⌂</div>
                    )}
                    <span className={`ml-status-badge ${status}`}>
                      {status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="ml-card-body">
                    <div className="ml-card-top">
                      <p className="ml-card-title">{property.title}</p>
                      <p className="ml-card-location">
                        <MapPin size={11} />
                        {[property.locality, property.city].filter(Boolean).join(", ") || property.city || "Location not set"}
                      </p>
                      <div className="ml-card-meta">
                        {property.bedrooms  && <span><Bed size={11} /> {property.bedrooms} bed</span>}
                        {property.bathrooms && <span><Bath size={11} /> {property.bathrooms} bath</span>}
                        {property.area      && <span><Maximize size={11} /> {property.area.toLocaleString()} sqft</span>}
                        {property.purpose   && <span style={{ textTransform: "capitalize" }}>{property.purpose}</span>}
                      </div>
                    </div>
                    <div className="ml-card-bottom">
                      <span className="ml-card-price">{formatPrice(property.price)}</span>
                      <span className="ml-card-date">Listed {formatDate(property.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-card-actions">
                    <button
                      className="ml-action-btn view"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      <Eye size={13} /> View
                    </button>

                    <button
                      className="ml-action-btn edit"
                      onClick={() => navigate(`/sell?edit=${property._id}`)}
                    >
                      <Pencil size={13} /> Edit
                    </button>

                    {status !== "sold" && (
                      <button
                        className="ml-action-btn sold"
                        onClick={() => handleStatusChange(property._id, "sold")}
                        disabled={statusLoading === property._id}
                      >
                        <CheckCircle size={13} />
                        {statusLoading === property._id ? "..." : "Mark Sold"}
                      </button>
                    )}

                    {status === "sold" && (
                      <button
                        className="ml-action-btn"
                        onClick={() => handleStatusChange(property._id, "active")}
                        disabled={statusLoading === property._id}
                      >
                        <CheckCircle size={13} />
                        {statusLoading === property._id ? "..." : "Relist"}
                      </button>
                    )}

                    <button
                      className="ml-action-btn delete"
                      onClick={() => setConfirmId(property._id)}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                  {/* Inline delete confirmation */}
                  {isConfirm && (
                    <div className="ml-confirm-bar">
                      <span>Delete this listing permanently?</span>
                      <div className="ml-confirm-bar-actions">
                        <button
                          className="ml-confirm-no"
                          onClick={() => setConfirmId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className="ml-confirm-yes"
                          onClick={() => handleDelete(property._id)}
                          disabled={deletingId === property._id}
                        >
                          {deletingId === property._id ? "Deleting..." : "Yes, delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}