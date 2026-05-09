import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, Key, TrendingUp, MapPin, ArrowRight, Building2, Ruler, FileText, Compass, IndianRupee, ChevronDown, User, Heart, ListChecks, Settings, LogOut } from 'lucide-react';
import "../styles/MyProfile.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f6f3",
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem 1.5rem",
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #ececec",
    padding: "1.75rem",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#1a1a2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 600,
    color: "#e8c97e",
    marginBottom: "1rem",
    letterSpacing: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 4px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#ccc",
    display: "inline-block",
  },
  divider: {
    borderTop: "1px solid #f0f0f0",
    margin: "1.25rem 0",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "0.75rem",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #ececec",
    padding: "1.25rem 1rem",
    textAlign: "center",
  },
  statNum: {
    fontSize: 28,
    fontWeight: 600,
    color: "#1a1a1a",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: 500,
  },
  actionBtn: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    marginBottom: 8,
    borderRadius: 10,
    border: "1px solid #e8e8e8",
    background: "#fafafa",
    fontSize: 13.5,
    fontWeight: 500,
    color: "#1a1a1a",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
  },
  actionBtnPrimary: {
    background: "#1a1a2e",
    color: "#e8c97e",
    border: "1px solid #1a1a2e",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f5f5f5",
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: 500,
  },
  infoValue: {
    fontSize: 13.5,
    color: "#1a1a1a",
    fontWeight: 500,
  },
  editCard: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #ececec",
    padding: "1.75rem",
    marginTop: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  inputLabel: {
    display: "block",
    fontSize: 12,
    color: "#888",
    fontWeight: 500,
    marginBottom: 6,
    letterSpacing: "0.03em",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e0e0e0",
    fontSize: 14,
    color: "#1a1a1a",
    background: "#fafafa",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  inputDisabled: {
    color: "#aaa",
    background: "#f5f5f5",
    cursor: "not-allowed",
  },
  saveBtn: {
    padding: "10px 24px",
    borderRadius: 10,
    border: "none",
    background: "#1a1a2e",
    color: "#e8c97e",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1px solid #e0e0e0",
    background: "transparent",
    color: "#666",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginLeft: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: "#eef9f2",
    color: "#2d7a52",
    marginTop: 6,
  },
  errorMsg: {
    fontSize: 13,
    color: "#c0392b",
    marginTop: 8,
  },
  successMsg: {
    fontSize: 13,
    color: "#2d7a52",
    marginTop: 8,
  },
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [userRes, listingsRes] = await Promise.all([
        fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/properties/my-listings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userData = await userRes.json();
      const listingsData = await listingsRes.json();

      if (userData.success) {
        setUser(userData.user);
        setForm({ name: userData.user.name, phone: userData.user.phone || "" });
      }
      if (listingsData.success) {
        setListings(listingsData.properties || []);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setMsg({ type: "success", text: "Profile updated successfully." });
        setShowEdit(false);
      } else {
        setMsg({ type: "error", text: data.error || "Update failed." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const activeListings = listings.filter((l) => l.status !== "sold").length;
  const totalListings = listings.length;

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#aaa", fontSize: 15 }}>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#c0392b", fontSize: 15 }}>Could not load profile. Please log in again.</p>
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

          {/* ── Navbar ── */}
          <nav className="my-profile-nav">
            <div className="my-profile-nav-inner">
              <div className="my-profile-logo" onClick={() => navigate('/landing')}>
                <Building2 size={22} />
                <span>GeoState</span>
              </div>
              <button className="my-profile-back" onClick={() => navigate('/landing')}>← Back</button>
            </div>
          </nav>

          <br></br>

          {/* Top grid — identity card + stats+actions */}
          <div style={styles.topGrid}>

            {/* Left: Identity card */}
            <div style={styles.card}>
              <div style={styles.avatar}>{getInitials(user.name)}</div>
              <p style={styles.name}>{user.name}</p>
              <div style={styles.metaRow}>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div style={styles.metaRow}>
                  <span>{user.phone}</span>
                </div>
              )}
              <span style={styles.badge}>Member since {formatDate(user.createdAt)}</span>

              <div style={styles.divider} />

              {/* Info rows */}
              <p style={styles.sectionLabel}>Account Info</p>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{user.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{user.email}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={{ ...styles.infoValue, color: user.phone ? "#1a1a1a" : "#bbb" }}>
                  {user.phone || "Not added"}
                </span>
              </div>

              <div style={styles.divider} />

              <button
                onClick={handleLogout}
                style={{ ...styles.actionBtn, color: "#c0392b", borderColor: "#fde8e8", background: "#fff9f9" }}
              >
                Log out
              </button>
            </div>

            {/* Right: Stats + Quick Actions */}
            <div>
              {/* Stats */}
              <div style={styles.statGrid}>
                <div style={styles.statCard}>
                  <p style={styles.statNum}>0</p>
                  <p style={styles.statLabel}>Saved Properties</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statNum}>{activeListings}</p>
                  <p style={styles.statLabel}>Active Listings</p>
                </div>
                <div style={styles.statCard}>
                  <p style={styles.statNum}>{totalListings}</p>
                  <p style={styles.statLabel}>Total Listed</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={styles.card}>
                <p style={styles.sectionLabel}>Quick Actions</p>
                <button
                  style={{ ...styles.actionBtn, ...styles.actionBtnPrimary }}
                  onClick={() => navigate("/saved-properties")}
                >
                  View Saved Properties
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => navigate("/my-listings")}
                >
                  Manage My Listings
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => setShowEdit((v) => !v)}
                >
                  {showEdit ? "Cancel Edit" : "Edit Profile"}
                </button>
              </div>

              {/* Recent Activity */}
              <div style={{ ...styles.card, marginTop: "1.5rem" }}>
                <p style={styles.sectionLabel}>Recent Activity</p>
                {listings.length > 0 ? (
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Last listing added</span>
                    <span style={styles.infoValue}>
                      {listings[0].title || "Untitled"} —{" "}
                      {formatDate(listings[0].createdAt)}
                    </span>
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>
                    No listings yet.{" "}
                    <span
                      style={{ color: "#1a1a2e", cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => navigate("/sell")}
                    >
                      Add your first property
                    </span>
                  </p>
                )}
                <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                  <span style={styles.infoLabel}>Saved properties</span>
                  <span style={{ ...styles.infoValue, color: "#bbb" }}>Coming soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Section */}
          {showEdit && (
            <div style={styles.editCard}>
              <p style={{ ...styles.sectionLabel, marginBottom: "1.25rem" }}>Edit Profile</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Name</label>
                  <input
                    style={styles.input}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Email (read-only)</label>
                  <input
                    style={{ ...styles.input, ...styles.inputDisabled }}
                    value={user.email}
                    disabled
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Phone</label>
                  <input
                    style={styles.input}
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button style={styles.cancelBtn} onClick={() => { setShowEdit(false); setMsg({ type: "", text: "" }); }}>
                  Cancel
                </button>
                {msg.text && (
                  <span style={msg.type === "success" ? styles.successMsg : styles.errorMsg}>
                    {msg.text}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}