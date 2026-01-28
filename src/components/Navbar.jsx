import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  setTimeout(() => {
    navigate("/login");
  }, 0);
};

  return (
    <div
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", fontWeight: 600 }}>
        GeoState
      </Link>

      <div>
        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: "12px" }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: "12px" }}>
              {user.name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;  