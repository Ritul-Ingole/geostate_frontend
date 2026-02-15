// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//   logout();
//   setTimeout(() => {
//     navigate("/login");
//   }, 0);
// };

//   return (
//     <div
//       style={{
//         height: "56px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 16px",
//         borderBottom: "1px solid #ddd",
//         background: "#fff",
//       }}
//     >
//       <Link to="/" style={{ textDecoration: "none", fontWeight: 600 }}>
//         GeoState
//       </Link>

//       <div>
//         {!user ? (
//           <>
//             <Link to="/login" style={{ marginRight: "12px" }}>
//               Login
//             </Link>
//             <Link to="/register">Register</Link>
//           </>
//         ) : (
//           <>
//             <span style={{ marginRight: "12px" }}>
//               {user.name}
//             </span>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;  

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home} from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Home className="navbar-logo-icon" />
          <span className="navbar-logo">GeoState</span>
        </div>
        
        <div className="navbar-user">
          <div className="user-info">
            <User className="user-icon" />
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="logout-button" onClick={handleLogout} style={{borderRadius: "4px", padding: "6px 12px"}}>
            <LogOut size={20} style={{ color: "black" }}/>
            <span style={{ color: "black" }}>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;