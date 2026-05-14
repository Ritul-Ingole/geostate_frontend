import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Key, TrendingUp, MapPin, Building2, Ruler, FileText, Compass, IndianRupee } from 'lucide-react';
import "../styles/MyProfile.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";


/* ─────────────────────────────────────────
   Floating Background Icons
   Used in: Recommendations + Services sections
───────────────────────────────────────── */
const FLOAT_ICONS = [
  // [Icon, size, top%, left%, animDuration, animDelay, animation]
  { Icon: Home,       size: 78, top: '12%',  left: '2%',   dur: '7s',   delay: '0s',    anim: 'geoFloat' },
  { Icon: MapPin,     size: 66, top: '65%',  left: '18%', dur: '9s',   delay: '0s',  anim: 'geoPulse' },
  { Icon: Key,        size: 70, top: '35%',  left: '94%',  dur: '8s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Building2,  size: 72, top: '72%',  left: '75%',  dur: '10s',  delay: '0s',    anim: 'geoPulse' },
  { Icon: TrendingUp, size: 64, top: '8%',   left: '55%',  dur: '6.5s', delay: '0s',  anim: 'geoFloat' },
  { Icon: Ruler,      size: 68, top: '50%',  left: '40%',  dur: '7.5s', delay: '0s',  anim: 'geoPulse' },
  { Icon: FileText,   size: 62, top: '80%',  left: '30%',   dur: '8.5s', delay: '0s',    anim: 'geoFloat' },
  { Icon: Compass,    size: 62, top: '25%',  left: '65%', dur: '11s',  delay: '0s',  anim: 'geoPulse' },
  { Icon: IndianRupee, size: 60, top: '90%',  left: '85%',  dur: '7s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Home,       size: 68, top: '55%',  left: '50%',  dur: '9.5s', delay: '0s',  anim: 'geoPulse' },
];

const floatAnimStyles = `
  @keyframes geoFloat {
    0%   { transform: translateY(0px);    opacity: 0.13; }
    50%  { transform: translateY(-18px);  opacity: 0.22; }
    100% { transform: translateY(0px);    opacity: 0.13; }
  }
  @keyframes geoPulse {
    0%   { transform: scale(1);    opacity: 0.10; }
    50%  { transform: scale(1.12); opacity: 0.20; }
    100% { transform: scale(1);    opacity: 0.10; }
  }
`;

const FloatingIcons = () => (
  <>
    <style>{floatAnimStyles}</style>
    {FLOAT_ICONS.map(({ Icon, size, top, left, dur, delay, anim }, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top,
          left,
          zIndex: 0,
          pointerEvents: 'none',
          animation: `${anim} ${dur} ease-in-out ${delay} infinite`,
          color: 'rgba(101, 78, 52, 0.55)',   /* warm brown to match cream bg */
        }}
      >
        <Icon size={size} strokeWidth={1.2} />
      </div>
    ))}
  </>
);


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
    zIndex: 10,  // Ensure content is above floating icons
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #ececec",
    padding: "1.75rem",
    position: "relative",
    zIndex: 50,  // Ensure cards are above floating icons
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#1b5e3b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    fontWeight: 600,
    color: "#ffffff",
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
    zIndex: 10,  // Ensure stats are above floating icons
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 14,
    border: "1px solid #ececec",
    padding: "1.25rem 1rem",
    textAlign: "center",
    zIndex: 10,  // Ensure stat cards are above floating icons
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
    zIndex: 10,  // Ensure buttons are above floating icons
  },
  actionBtnPrimary: {
    background: "#1b5e3b",
    color: "#ffffff",
    border: "1px solid #1b5e3b",
    zIndex: 10,  // Ensure primary button is above floating icons
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
  const [savedCount, setSavedCount] = useState(0);

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
        setListings(listingsData.data || []);
      }

      const savedRes = await fetch(`${API}/auth/saved-properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedData = await savedRes.json();
      // Store the count — add a state variable:
      // const [savedCount, setSavedCount] = useState(0);
      if (savedData.success) setSavedCount(savedData.properties?.length || 0);

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
              <button className="my-profile-back" onClick={() => navigate(-1)}>← Back</button>
            </div>
          </nav>


          {/* Floating icons — behind all content */}
          <FloatingIcons /> 

          <div style={{ padding: "1.5rem 1.5rem ", maxWidth: 1000, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: 0, letterSpacing: "-0.02em" }}>
              My Profile
            </p>
          </div>

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
                style={{
                  ...styles.actionBtn,
                  color: "#c0392b",
                  borderColor: "#fde8e8",
                  background: "#fff9f9",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#c0392b";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#c0392b";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#fff9f9";
                  e.currentTarget.style.color = "#c0392b";
                  e.currentTarget.style.borderColor = "#fde8e8";
                }}
              >
                Log out
              </button>
            </div>

            {/* Right: Stats + Quick Actions */}
            <div>
              {/* Stats */}
              <div style={styles.statGrid}>
                <div style={styles.statCard}>
                  <p style={styles.statNum}>{savedCount}</p>
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