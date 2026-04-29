import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, MapPin, Star, Home, Phone, MessageCircle,
  Search, SlidersHorizontal, X, Award, Clock, Languages
} from 'lucide-react';
//import '../styles/Agents.css';

/* ── Hardcoded agent data ── */
const AGENTS = [
  {
    id: 1,
    name: 'Priya Sharma',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    city: 'Mumbai',
    specialty: "Buyer's Agent",
    rating: 4.9,
    reviews: 128,
    listings: 34,
    experience: 9,
    languages: ['Hindi', 'English', 'Marathi'],
    bio: 'Specialises in luxury apartments in South Mumbai and Bandra. Known for transparent dealings and fast closures.',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    city: 'Pune',
    specialty: "Seller's Agent",
    rating: 4.7,
    reviews: 95,
    listings: 21,
    experience: 6,
    languages: ['Hindi', 'English', 'Marathi'],
    bio: 'Expert in Kothrud and Wakad residential market. Consistently achieves above-asking prices for clients.',
  },
  {
    id: 3,
    name: 'Neha Rao',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    city: 'Bengaluru',
    specialty: 'Rental Agent',
    rating: 4.8,
    reviews: 212,
    listings: 58,
    experience: 11,
    languages: ['Kannada', 'English', 'Hindi'],
    bio: 'Go-to agent for tech professionals relocating to Whitefield and Koramangala. Zero brokerage surprises.',
  },
  {
    id: 4,
    name: 'Ravi Krishnan',
    photo: 'https://randomuser.me/api/portraits/men/71.jpg',
    city: 'Hyderabad',
    specialty: "Buyer's Agent",
    rating: 4.6,
    reviews: 74,
    listings: 19,
    experience: 5,
    languages: ['Telugu', 'Hindi', 'English'],
    bio: 'Deep knowledge of Gachibowli and HITEC City corridors. Helps IT professionals find homes near their workplace.',
  },
  {
    id: 5,
    name: 'Sunita Desai',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    city: 'Mumbai',
    specialty: 'Rental Agent',
    rating: 4.5,
    reviews: 166,
    listings: 47,
    experience: 8,
    languages: ['Hindi', 'Gujarati', 'English'],
    bio: 'Handles furnished and semi-furnished rentals across Andheri and Powai. Quick turnaround guaranteed.',
  },
  {
    id: 6,
    name: 'Vikram Nair',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    city: 'Bengaluru',
    specialty: "Seller's Agent",
    rating: 4.9,
    reviews: 88,
    listings: 26,
    experience: 13,
    languages: ['Malayalam', 'English', 'Kannada'],
    bio: 'Premium villa and independent house sales in HSR Layout and Sarjapur Road. 13 years of trust.',
  },
  {
    id: 7,
    name: 'Pooja Verma',
    photo: 'https://randomuser.me/api/portraits/women/29.jpg',
    city: 'Pune',
    specialty: "Buyer's Agent",
    rating: 4.8,
    reviews: 143,
    listings: 38,
    experience: 7,
    languages: ['Hindi', 'English'],
    bio: 'Helps first-time homebuyers navigate Hinjewadi and Baner with ease. Patient, thorough, reliable.',
  },
  {
    id: 8,
    name: 'Deepak Shetty',
    photo: 'https://randomuser.me/api/portraits/men/18.jpg',
    city: 'Mumbai',
    specialty: "Buyer's Agent",
    rating: 4.7,
    reviews: 61,
    listings: 15,
    experience: 4,
    languages: ['Konkani', 'Hindi', 'English'],
    bio: 'Young, sharp agent focused on new launches in Thane and Navi Mumbai. Strong negotiator.',
  },
  {
    id: 9,
    name: 'Lakshmi Iyer',
    photo: 'https://randomuser.me/api/portraits/women/55.jpg',
    city: 'Hyderabad',
    specialty: 'Rental Agent',
    rating: 4.6,
    reviews: 109,
    listings: 33,
    experience: 6,
    languages: ['Tamil', 'Telugu', 'English'],
    bio: 'Focused on expat and NRI rental needs in Jubilee Hills and Banjara Hills. Handles documentation end to end.',
  },
  {
    id: 10,
    name: 'Suresh Pillai',
    photo: 'https://randomuser.me/api/portraits/men/46.jpg',
    city: 'Bengaluru',
    specialty: "Buyer's Agent",
    rating: 4.5,
    reviews: 57,
    listings: 22,
    experience: 5,
    languages: ['Malayalam', 'Kannada', 'English'],
    bio: 'Focuses on budget homes in Electronic City and BTM Layout. Great for young families.',
  },
  {
    id: 11,
    name: 'Anjali Kapoor',
    photo: 'https://randomuser.me/api/portraits/women/82.jpg',
    city: 'Pune',
    specialty: "Seller's Agent",
    rating: 4.9,
    reviews: 178,
    listings: 44,
    experience: 10,
    languages: ['Hindi', 'English', 'Punjabi'],
    bio: 'Top-rated seller agent in Aundh and Pashan. Gets your listing maximum eyeballs in minimum time.',
  },
  {
    id: 12,
    name: 'Mohammed Rafi',
    photo: 'https://randomuser.me/api/portraits/men/62.jpg',
    city: 'Hyderabad',
    specialty: "Seller's Agent",
    rating: 4.7,
    reviews: 83,
    listings: 28,
    experience: 8,
    languages: ['Urdu', 'Telugu', 'Hindi', 'English'],
    bio: 'Specialist in Old City and Secunderabad heritage properties. Unique market knowledge, unmatched network.',
  },
];

const CITIES      = ['All Cities', 'Mumbai', 'Pune', 'Bengaluru', 'Hyderabad'];
const SPECIALTIES = ['All Specialties', "Buyer's Agent", "Seller's Agent", 'Rental Agent'];
const RATINGS     = [
  { label: 'Any Rating', value: 0 },
  { label: '4.5 & above', value: 4.5 },
  { label: '4.8 & above', value: 4.8 },
];

const SPECIALTY_COLORS = {
  "Buyer's Agent":  { bg: '#e8f4ec', text: '#1b5e3b' },
  "Seller's Agent": { bg: '#fdf0eb', text: '#b85c38' },
  'Rental Agent':   { bg: '#f0edf8', text: '#5b3fa0' },
};

/* ── Star renderer ── */
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <div className="agent-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < full ? '#f5a623' : (i === full && half ? '#f5a623' : 'none')}
          stroke={i < full || (i === full && half) ? '#f5a623' : '#d1c9bc'}
          strokeWidth={1.5}
          style={{ opacity: i === full && half ? 0.6 : 1 }}
        />
      ))}
    </div>
  );
};

/* ── Agent Card ── */
const AgentCard = ({ agent }) => {
  const sc = SPECIALTY_COLORS[agent.specialty];
  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <img src={agent.photo} alt={agent.name} className="agent-photo" />
        <div className="agent-header-info">
          <h3 className="agent-name">{agent.name}</h3>
          <div className="agent-location">
            <MapPin size={13} />
            <span>{agent.city}</span>
          </div>
          <span
            className="agent-specialty-badge"
            style={{ background: sc.bg, color: sc.text }}
          >
            {agent.specialty}
          </span>
        </div>
      </div>

      <p className="agent-bio">{agent.bio}</p>

      <div className="agent-stats-row">
        <div className="agent-stat-item">
          <Star size={14} fill="#f5a623" stroke="#f5a623" />
          <span className="agent-stat-value">{agent.rating}</span>
          <span className="agent-stat-label">({agent.reviews} reviews)</span>
        </div>
        <div className="agent-stat-item">
          <Home size={14} stroke="#7a6a58" />
          <span className="agent-stat-value">{agent.listings}</span>
          <span className="agent-stat-label">listings</span>
        </div>
        <div className="agent-stat-item">
          <Clock size={14} stroke="#7a6a58" />
          <span className="agent-stat-value">{agent.experience} yrs</span>
        </div>
      </div>

      <div className="agent-languages">
        <Languages size={13} className="lang-icon" />
        <span>{agent.languages.join(' · ')}</span>
      </div>

      <div className="agent-card-actions">
        <button className="agent-btn-secondary">
          <MessageCircle size={15} />
          Message
        </button>
        <button className="agent-btn-primary">
          <Phone size={15} />
          Contact
        </button>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Agents = () => {
  const navigate = useNavigate();

  /* Auth guard */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: { pathname: '/agents' } } });
    }
  }, [navigate]);

  const [scrolled,    setScrolled]    = useState(false);
  const [search,      setSearch]      = useState('');
  const [city,        setCity]        = useState('All Cities');
  const [specialty,   setSpecialty]   = useState('All Specialties');
  const [minRating,   setMinRating]   = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = AGENTS.filter((a) => {
    const matchSearch    = a.name.toLowerCase().includes(search.toLowerCase());
    const matchCity      = city === 'All Cities'          || a.city === city;
    const matchSpecialty = specialty === 'All Specialties' || a.specialty === specialty;
    const matchRating    = a.rating >= minRating;
    return matchSearch && matchCity && matchSpecialty && matchRating;
  });

  const activeFiltersCount = [
    city !== 'All Cities',
    specialty !== 'All Specialties',
    minRating > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCity('All Cities');
    setSpecialty('All Specialties');
    setMinRating(0);
    setSearch('');
  };

  return (
    <div className="agents-page">

      {/* ── Navbar ── */}
      <nav className={`landing-navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="landing-navbar-content">
          <div className="landing-logo" onClick={() => navigate('/landing')} style={{ cursor: 'pointer' }}>
            <Building2 size={28} className="logo-icon" />
            <span className="logo-text">GeoState</span>
          </div>
          <div className="landing-nav-links">
            <Link to="/home?purpose=buy"  className="nav-link">Buy</Link>
            <Link to="/home?purpose=rent" className="nav-link">Rent</Link>
            <span
              className="nav-link"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) navigate('/sell');
                else navigate('/login', { state: { from: { pathname: '/sell' } } });
              }}
            >
              Sell
            </span>
            <Link to="/mortgage" className="nav-link">Mortgage</Link>
            <Link to="/agents"   className="nav-link nav-link-active">Find an agent</Link>
          </div>
          <div className="landing-nav-actions">
            <a href="#" className="nav-action">Advertise</a>
            <a href="#" className="nav-action">Help</a>
            <button className="signin-button" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>
      </nav>

      {/* ── Page Header ── */}
      <div className="agents-hero">
        <div className="agents-hero-content">
          <div className="section-eyebrow">Our Network</div>
          <h1 className="agents-hero-title">Find the right agent for you</h1>
          <p className="agents-hero-sub">
            Browse verified agents across India's top cities — filter by city, specialty, and rating.
          </p>

          {/* Search bar */}
          <div className="agents-search-bar">
            <Search size={17} className="agents-search-icon" />
            <input
              type="text"
              placeholder="Search by agent name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="agents-search-input"
            />
            {search && (
              <button className="agents-search-clear" onClick={() => setSearch('')}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="agents-filter-bar">
        <div className="agents-filter-inner">

          {/* City */}
          <select
            className="agents-filter-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Specialty */}
          <select
            className="agents-filter-select"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* Rating */}
          <select
            className="agents-filter-select"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {RATINGS.map((r) => (
              <option key={r.label} value={r.value}>{r.label}</option>
            ))}
          </select>

          {/* Clear */}
          {activeFiltersCount > 0 && (
            <button className="agents-clear-btn" onClick={clearFilters}>
              <X size={14} />
              Clear filters
              <span className="filter-count-badge">{activeFiltersCount}</span>
            </button>
          )}

          <div className="agents-results-count">
            {filtered.length} agent{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* ── Agent Grid ── */}
      <div className="agents-grid-section">
        {filtered.length > 0 ? (
          <div className="agents-grid">
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="agents-empty">
            <Award size={48} className="agents-empty-icon" />
            <h3>No agents match your filters</h3>
            <p>Try adjusting your search or clearing some filters.</p>
            <button className="agents-clear-btn-lg" onClick={clearFilters}>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;