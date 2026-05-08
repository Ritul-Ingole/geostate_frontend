import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Home, Key, TrendingUp, MapPin, ArrowRight, Building2, Ruler, FileText, Compass, IndianRupee, ChevronDown, User, Heart, ListChecks, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Landing.css';

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


const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled]       = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/landing');
  };

  const go = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Navbar becomes opaque on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/home');
    }
  };

  const heroWords = ['Rentals.', 'Homes.', 'Agents.'];

  return (
    <div className="landing-page">

      {/* ── Navbar ── */}
      <nav className={`landing-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="landing-navbar-content">
          <div className="landing-logo" onClick={() => navigate('/landing')}>
            <Building2 size={28} className="logo-icon" />
            <span className="logo-text">GeoState</span>
          </div>

          <div className="landing-nav-links">
            <Link to="/home?purpose=buy" className="nav-link">Buy</Link>
            <Link to="/home?purpose=rent" className="nav-link">Rent</Link>
            <span
              className="nav-link"
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  navigate('/sell');
                } else {
                  navigate('/login', { state: { from: { pathname: '/sell' } } });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Sell
            </span>
            <Link to="/mortgage" className="nav-link">Mortgage</Link>
            <span
              className="nav-link"
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) {
                  navigate('/agents');
                } else {
                  navigate('/login', { state: { from: { pathname: '/agents' } } });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              Find an Agent
            </span>
          </div>

          <div className="landing-nav-actions">
            <a href="/help" className="nav-action">Help</a>

            {isAuthenticated ? (
              <div className="landing-dropdown-wrap" ref={dropdownRef}>
                <button
                  className={`landing-user-trigger ${dropdownOpen ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(o => !o)}
                >
                  <div className="landing-avatar">{initials}</div>
                  <span className="landing-trigger-name">{user?.name}</span>
                  <ChevronDown size={14} className={`landing-chevron ${dropdownOpen ? 'rotated' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="landing-dropdown">
                    <div className="landing-dropdown-header">
                      <div className="landing-dropdown-avatar">{initials}</div>
                      <div>
                        <p className="landing-dropdown-name">{user?.name}</p>
                        <p className="landing-dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="landing-dropdown-divider" />
                    <button className="landing-dropdown-item" onClick={() => go('/my-profile')}>
                      <User size={14} /> My Profile
                    </button>
                    <button className="landing-dropdown-item" onClick={() => go('/favourites')}>
                      <Heart size={14} /> Favourite Properties
                    </button>
                    <button className="landing-dropdown-item" onClick={() => go('/my-listings')}>
                      <ListChecks size={14} /> My Listings
                    </button>
                    <button className="landing-dropdown-item" onClick={() => go('/settings')}>
                      <Settings size={14} /> Settings
                    </button>
                    <div className="landing-dropdown-divider" />
                    <button className="landing-dropdown-item landing-logout" onClick={handleLogout}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="signin-button" onClick={() => navigate('/login', { state: { from: { pathname: '/landing' } } })}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Real estate across India</div>
          <h1 className="hero-title">
            {heroWords.map((word, i) => (
              <span key={word} className="hero-word" style={{ '--i': i }}>
                {word}
              </span>
            ))}
          </h1>

          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="hero-search-container">
              <MapPin size={18} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Enter a city, locality, or pincode…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="hero-search-button">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
            <div className="hero-quick-links">
              <span>Popular:</span>
              {['Mumbai', 'Bengaluru', 'Pune', 'Hyderabad'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className="quick-link"
                  onClick={() => navigate(`/home?search=${city}`)}
                >
                  {city}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Stat strip */}
        <div className="hero-stats">
          {[
            { n: '12,000+', label: 'Active listings' },
            { n: '12',      label: 'Indian cities' },
            { n: '₹2,400Cr+', label: 'Transactions closed' },
            { n: '4.8★',    label: 'Avg. rating' },
          ].map(({ n, label }, i) => (
            <div key={label} className="hero-stat" style={{ '--i': i }}>
              <span className="stat-number">{n}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recommendations ── */}
      <section className="recommendations-section" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* Floating icons — behind all content */}
        <FloatingIcons />

        {/* Actual section content — above icons */}
        <div className="recommendations-content">
          <div className="recommendations-left">
            <div className="section-eyebrow">Personalised for you</div>
            <h2 className="recommendations-title">Get home<br />recommendations</h2>
            <p className="recommendations-subtitle">
              Sign in for a more personalised experience — we'll match properties
              to your budget, location preference, and lifestyle.
            </p>
            <button className="recommendations-signin-button" onClick={() => navigate('/login')}>
              Sign in <ArrowRight size={16} />
            </button>
          </div>

          <div className="recommendations-right">
            <div className="recommendation-card">
              <div className="recommendation-badge budget">
                <MapPin size={16} />
                <div>
                  <div className="badge-title">Based on your budget</div>
                  <div className="badge-subtitle">₹80L–₹1.2Cr range</div>
                </div>
              </div>

              <div className="recommendation-badge location">
                <MapPin size={16} />
                <div>
                  <div className="badge-title">Near your location</div>
                  <div className="badge-subtitle">Within 5 km radius</div>
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80"
                alt="Recommended home"
                className="recommendation-image"
              />

              <div className="recommendation-details">
                <div className="recommendation-price">₹69.5L</div>
                <div className="recommendation-info">4 bd · 3 ba · 3,102 sqft</div>
                <div className="recommendation-type">Villa for Sale · Pune</div>
              </div>
            </div>

            {/* Decorative second card */}
            <div className="recommendation-card-ghost" />
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services-section" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Floating icons — behind all content */}
        <FloatingIcons />

        {/* Actual section content — above icons */}
        <div className="services-header">
          <div className="section-eyebrow">What we offer</div>
          <h2 className="services-section-title">Everything in one place</h2>
        </div>

        <div className="services-grid">
          <div className="service-card" style={{ '--accent-color': '#1b5e3b' }}>
            <div className="service-icon-wrap">
              <Home size={32} />
            </div>
            <h3 className="service-title">Buy a home</h3>
            <p className="service-description">
              A real estate agent can provide you with a clear breakdown of costs
              so that you can avoid surprise expenses.
            </p>
            <button className="service-button" onClick={() => navigate('/home?purpose=sell')}>
              Find a local agent <ArrowRight size={14} />
            </button>
            <div className="service-card-fill" />
          </div>

          <div className="service-card service-card-featured" style={{ '--accent-color': '#b85c38' }}>
            <div className="service-icon-wrap">
              <Key size={32} />
            </div>
            <h3 className="service-title">Rent a home</h3>
            <p className="service-description">
              We're creating a seamless online experience — from browsing the largest
              rental network, to applying, to paying rent.
            </p>
            <button className="service-button" onClick={() => navigate('/home?purpose=rent')}>
              Browse rentals <ArrowRight size={14} />
            </button>
            <div className="service-card-fill" />
          </div>

          <div className="service-card" style={{ '--accent-color': '#4a3728' }}>
            <div className="service-icon-wrap">
              <TrendingUp size={32} />
            </div>
            <h3 className="service-title">Sell a home</h3>
            <p className="service-description">
              No matter what path you take to sell your home, we can help you
              navigate a successful sale at the best price.
            </p>
            <button className="service-button">
              See your options <ArrowRight size={14} />
            </button>
            <div className="service-card-fill" />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Floating icons — behind all content */}
        <FloatingIcons />
        
        {/* Actual footer content — above icons */}
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo-mark">
              <Building2 size={20} />
              <span>GeoState</span>
            </div>
            <p className="footer-text">
              Recommendations are based on your location and search activity —
              homes you've viewed, saved, and the filters you've used.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Real Estate</h4>
              <a href="#">Homes for sale</a>
              <a href="#">Foreclosures</a>
              <a href="#">For sale by owner</a>
            </div>
            <div className="footer-column">
              <h4>Rentals</h4>
              <a href="#">Apartments for rent</a>
              <a href="#">Houses for rent</a>
              <a href="#">Post a rental</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Help centre</a>
              <a href="#">Contact us</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <Building2 size={18} />
            <span>GeoState</span>
          </div>
          <p className="footer-copyright">© 2026 GeoState. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;