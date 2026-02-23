import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ImageCarousel from "../components/ImageCarousal";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Home as HomeIcon,
  Calendar,
  Tag,
  Heart,
  Share2,
  Phone,
  Mail
} from "lucide-react";
import "../styles/PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/properties/${id}`, {
      cache: "no-store"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Property fetched:", data.data);
      setProperty(data.data);
    })
    .catch((error) => {
      console.error("Error fetching property:", error);
    });
  }, [id]);

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(2)} K`;
    return `₹${price.toLocaleString()}`;
  };

  const getPurposeBadgeClass = (purpose) => {
    const badges = {
      rent: 'badge-rent',
      sell: 'badge-sell',
      buy: 'badge-buy'
    };
    return badges[purpose] || 'badge-rent';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.propertyType} for ${property.purpose}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!property) {
    return (
      <div className="loading-property">
        <div className="spinner-large"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="property-details-page">
      {/* Header with Back Button */}
      <div className="property-header-bar">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
          <span>Back to Properties</span>
        </button>
        
        <div className="header-actions">
          <button className="action-btn" onClick={handleShare}>
            <Share2 size={20} />
            <span>Share</span>
          </button>
          <button 
            className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="property-images-section">
        <ImageCarousel images={property.images} />
      </div>

      {/* Main Content */}
      <div className="property-content">
        {/* Left Column - Details */}
        <div className="property-main-column">
          {/* Title & Price Section */}
          <div className="property-title-section">
            <div className="property-purpose-badge">
              <span className={`purpose-badge ${getPurposeBadgeClass(property.purpose)}`}>
                FOR {property.purpose.toUpperCase()}
              </span>
            </div>
            
            <h1 className="property-title">{property.title}</h1>
            
            <div className="property-location">
              <MapPin size={18} />
              <span>{property.title}</span>
            </div>
            
            <div className="property-price-row">
              <span className="property-price">{formatPrice(property.price)}</span>
              {property.purpose === 'rent' && <span className="price-period">/month</span>}
            </div>
          </div>

          {/* Key Stats */}
          <div className="property-stats">
            {property.bedrooms && (
              <div className="stat-item">
                <Bed size={24} />
                <div>
                  <span className="stat-value">{property.bedrooms}</span>
                  <span className="stat-label">Bedrooms</span>
                </div>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="stat-item">
                <Bath size={24} />
                <div>
                  <span className="stat-value">{property.bathrooms}</span>
                  <span className="stat-label">Bathrooms</span>
                </div>
              </div>
            )}
            
            {property.area && (
              <div className="stat-item">
                <Maximize size={24} />
                <div>
                  <span className="stat-value">{property.area.toLocaleString()}</span>
                  <span className="stat-label">sqft</span>
                </div>
              </div>
            )}
            
            <div className="stat-item">
              <HomeIcon size={24} />
              <div>
                <span className="stat-value capitalize">{property.propertyType}</span>
                <span className="stat-label">Property Type</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="property-section">
              <h2 className="section-title">Description</h2>
              <p className="property-description">{property.description}</p>
            </div>
          )}

          {/* Property Details Grid */}
          <div className="property-section">
            <h2 className="section-title">Property Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <Tag size={18} />
                <div>
                  <span className="detail-label">Property Type</span>
                  <span className="detail-value capitalize">{property.propertyType}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <HomeIcon size={18} />
                <div>
                  <span className="detail-label">Purpose</span>
                  <span className="detail-value capitalize">{property.purpose}</span>
                </div>
              </div>
              
              {property.bedrooms && (
                <div className="detail-item">
                  <Bed size={18} />
                  <div>
                    <span className="detail-label">Bedrooms</span>
                    <span className="detail-value">{property.bedrooms}</span>
                  </div>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="detail-item">
                  <Bath size={18} />
                  <div>
                    <span className="detail-label">Bathrooms</span>
                    <span className="detail-value">{property.bathrooms}</span>
                  </div>
                </div>
              )}
              
              {property.area && (
                <div className="detail-item">
                  <Maximize size={18} />
                  <div>
                    <span className="detail-label">Area</span>
                    <span className="detail-value">{property.area.toLocaleString()} sqft</span>
                  </div>
                </div>
              )}
              
              {property.createdAt && (
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <span className="detail-label">Listed</span>
                    <span className="detail-value">
                      {new Date(property.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Section */}
          {property.location && (
            <div className="property-section">
              <h2 className="section-title">Location</h2>
              <div className="location-info">
                <MapPin size={20} />
                <div>
                  <p className="location-address">{property.title}</p>
                  {property.location.coordinates && (
                    <p className="location-coords">
                      {property.location.coordinates[1].toFixed(6)}, {property.location.coordinates[0].toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="property-sidebar">
          

          {/* Price Summary Card */}
          <div className="price-summary-card">
            <h4>Price Summary</h4>
            <div className="summary-row">
              <span>Property Price</span>
              <span className="summary-price">{formatPrice(property.price)}</span>
            </div>
            {property.purpose === 'rent' && (
              <>
                <div className="summary-row">
                  <span>Security Deposit</span>
                  <span>{formatPrice(property.price * 2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total (First Month)</span>
                  <span>{formatPrice(property.price * 3)}</span>
                </div>
              </>
            )}
          </div>

          {/* Contact Card */}
          <div className="contact-card">
            <h3 className="contact-title">Interested in this property?</h3>
            <p className="contact-subtitle">Get in touch with us</p>
            
            <div className="contact-actions">
              <button className="contact-btn primary">
                <Phone size={18} />
                <span>Call Now</span>
              </button>
              
              <button className="contact-btn secondary">
                <Mail size={18} />
                <span>Send Email</span>
              </button>
            </div>

            <div className="contact-info">
              <div className="info-row">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="info-row">
                <Mail size={16} />
                <span>contact@geostate.com</span>
              </div>
            </div>

            <div className="schedule-visit">
              <h4>Schedule a Visit</h4>
              <input type="date" className="date-input" />
              <button className="schedule-btn">Schedule Tour</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;