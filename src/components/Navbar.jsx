import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  ChevronDown, 
  User, 
  Heart, 
  ListChecks, 
  Settings, 
  LogOut,
  LogIn
} from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/landing');
  };

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand" onClick={() => navigate('/landing')}>
          <Home className="navbar-logo-icon" />
          <span className="navbar-logo">GeoState</span>
        </div>

        {/* Right side */}
        <div className="navbar-user">
          {isAuthenticated ? (
            <div className="nav-dropdown-wrap" ref={dropdownRef}>
              {/* Trigger */}
              <button
                className={`nav-user-trigger ${open ? 'active' : ''}`}
                onClick={() => setOpen(o => !o)}
              >
                <div className="nav-avatar">{initials}</div>
                <span className="nav-user-name">{user?.name}</span>
                <ChevronDown
                  size={15}
                  className={`nav-chevron ${open ? 'rotated' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="dropdown-avatar">{initials}</div>
                    <div>
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                  </div>

                  <div className="nav-dropdown-divider" />

                  <button className="nav-dropdown-item" onClick={() => go('/profile')}>
                    <User size={15} />
                    My Profile
                  </button>
                  <button className="nav-dropdown-item" onClick={() => go('/saved-properties')}>
                    <Heart size={15} />
                    Favourite Properties
                  </button>
                  <button className="nav-dropdown-item" onClick={() => go('/my-listings')}>
                    <ListChecks size={15} />
                    My Listings
                  </button>
                  <button className="nav-dropdown-item" onClick={() => go('/settings')}>
                    <Settings size={15} />
                    Settings
                  </button>

                  <div className="nav-dropdown-divider" />

                  <button className="nav-dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-login-btn" onClick={() => navigate('/login')}>
              <LogIn size={16} />
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;