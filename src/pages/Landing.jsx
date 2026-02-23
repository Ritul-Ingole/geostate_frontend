import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Key, TrendingUp, MapPin } from 'lucide-react';
import '../styles/Landing.css';

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // Navigate to home page without search
      navigate('/home');
    }
  };

  // "Find rentals" button
  <button onClick={() => navigate('/home?purpose=rent')}>
    Find rentals
  </button>
  
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-content">
          <div className="landing-logo">
            <Home size={32} className="logo-icon" onClick={() => navigate('/landing')}/>
            <span className="logo-text">GeoState</span>
          </div>
          
          <div className="landing-nav-links">
            <a href="#" className="nav-link">Buy</a>
            <a href="#" className="nav-link">Rent</a>
            <a href="#" className="nav-link">Sell</a>
            <a href="#" className="nav-link">Get a mortgage</a>
            <a href="#" className="nav-link">Find an agent</a>
          </div>

          <div className="landing-nav-actions">
            <a href="#" className="nav-action">Manage rentals</a>
            <a href="#" className="nav-action">Advertise</a>
            <a href="#" className="nav-action">Get help</a>
            <button 
              className="signin-button"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Rentals. Homes.<br />
            Agents. Loans.
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="hero-search-container">
              <input
                type="text"
                placeholder="Enter an address, neighborhood, city, or ZIP code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="hero-search-button">
                <Search size={24} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <div className="recommendations-content">
          <div className="recommendations-left">
            <h2 className="recommendations-title">Get home recommendations</h2>
            <p className="recommendations-subtitle">
              Sign in for a more personalized experience.
            </p>
            <button 
              className="recommendations-signin-button"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </div>
          
          <div className="recommendations-right">
            <div className="recommendation-card">
              <div className="recommendation-badge budget">
                <MapPin size={20} />
                <div>
                  <div className="badge-title">Recommended homes</div>
                  <div className="badge-subtitle">based on your monthly budget</div>
                </div>
              </div>
              
              <div className="recommendation-badge location">
                <MapPin size={20} />
                <div>
                  <div className="badge-title">Recommended homes</div>
                  <div className="badge-subtitle">based on your preferred location</div>
                </div>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400" 
                alt="Recommended home"
                className="recommendation-image"
              />
              
              <div className="recommendation-details">
                <div className="recommendation-price">₹69.5L</div>
                <div className="recommendation-info">4 bd | 3 ba | 3,102 sqft</div>
                <div className="recommendation-type">House for Sale</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-grid">
          <div className="service-card">
            <div className="service-illustration">
              <div className="illustration-circle blue">
                <Home size={48} />
              </div>
            </div>
            <h3 className="service-title">Buy a home</h3>
            <p className="service-description">
              A real estate agent can provide you with a clear breakdown of costs 
              so that you can avoid surprise expenses.
            </p>
            <button className="service-button">Find a local agent</button>
          </div>

          <div className="service-card">
            <div className="service-illustration">
              <div className="illustration-circle green">
                <Key size={48} />
              </div>
            </div>
            <h3 className="service-title">Rent a home</h3>
            <p className="service-description">
              We're creating a seamless online experience – from shopping on the 
              largest rental network, to applying, to paying rent.
            </p>
            <button 
              className="service-button"
              onClick={() => navigate('/home?purpose=rent')}
            >
              Find rentals
            </button>
          </div>

          <div className="service-card">
            <div className="service-illustration">
              <div className="illustration-circle orange">
                <TrendingUp size={48} />
              </div>
            </div>
            <h3 className="service-title">Sell a home</h3>
            <p className="service-description">
              No matter what path you take to sell your home, we can help you 
              navigate a successful sale.
            </p>
            <button className="service-button">See your options</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p className="footer-text">
              Recommendations are based on your location and search activity, 
              such as the homes you've viewed and saved and the filters you've used.
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
              <a href="#">Help center</a>
              <a href="#">Contact us</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-logo">
            <Home size={24} />
            <span>GeoState</span>
          </div>
          <p className="footer-copyright">
            © 2026 GeoState. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;