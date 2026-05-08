import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin } from 'lucide-react';
import '../styles/PropertyCard.css';
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const PropertyCard = ({ property, isHighlighted, onMouseEnter, onMouseLeave }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API}/auth/saved-properties`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const alreadySaved = data.properties.some((p) => p._id === property._id);
          setIsFavorite(alreadySaved);
        }
      })
      .catch(() => {});
  }, [property._id]);

  const navigate = useNavigate();

  const images = property.images && property.images.length > 0 ? property.images : [];
  const imageUrl = images.length > 0 
    ? `http://localhost:8000${images[currentImageIndex]}`
    : "https://via.placeholder.com/400x250?text=No+Image";

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    const res = await fetch(`${API}/auth/save-property/${property._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setIsFavorite(data.saved);
  };

  const formatPrice = (price) => {
    if (property.purpose === 'rent') {
      if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L/mo`;
      }
      return `₹${price.toLocaleString()}/mo`;
    }
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getPurposeBadge = () => {
    const badges = {
      rent: { text: 'FOR RENT', color: '#0066ff' },
      sell: { text: 'FOR SALE', color: '#10b981' },
      buy: { text: 'SOLD', color: '#ef4444' }
    };
    return badges[property.purpose] || badges.rent;
  };

  const badge = getPurposeBadge();

  return (
    <div 
      className={`zillow-card ${isHighlighted ? 'zillow-card-highlighted' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => navigate(`/property/${property._id}`)}
    >
      {/* Image Section */}
      <div className="zillow-image-container">
        <img 
          src={imageUrl} 
          alt={property.title}
          className="zillow-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
          }}
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button 
              className="zillow-nav-btn zillow-nav-prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="zillow-nav-btn zillow-nav-next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Favorite Button */}
        <button 
          className={`zillow-favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          aria-label="Save to favorites"
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Purpose Badge */}
        <div className="zillow-badge" style={{ backgroundColor: badge.color }}>
          {badge.text}
        </div>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="zillow-dots">
            {images.map((_, i) => (
              <div
                key={i}
                className={`zillow-dot ${i === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="zillow-content">
        {/* Price */}
        <div className="zillow-price-row">
          <span className="zillow-price">{formatPrice(property.price)}</span>
          {property.purpose === 'rent' && (
            <span className="zillow-fees">Fees may apply</span>
          )}
        </div>

        {/* Property Details */}
        <div className="zillow-details">
          {property.bedrooms && (
            <>
              <span className="zillow-detail">{property.bedrooms} bd</span>
              <span className="zillow-separator">|</span>
            </>
          )}
          {property.bathrooms && (
            <>
              <span className="zillow-detail">{property.bathrooms} ba</span>
              <span className="zillow-separator">|</span>
            </>
          )}
          {property.area && (
            <>
              <span className="zillow-detail">{property.area.toLocaleString()} sqft</span>
              <span className="zillow-separator">-</span>
            </>
          )}
          <span className="zillow-detail">{property.propertyType}</span>
        </div>

        {/* Address */}
        <div className="zillow-address">
          {property.title}
        </div>

        {/* Listing Info */}
        {property.createdAt && (
          <div className="zillow-listing-info">
            <span className="zillow-days-ago">
              {getDaysAgo(property.createdAt)} days ago
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate days ago
const getDaysAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diff;
};

export default PropertyCard;