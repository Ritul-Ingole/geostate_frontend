import { forwardRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/PropertyCard.css";

const PropertyCard = forwardRef(({ property, isActive, onHover }, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [];

  const imageUrl =
    images.length > 0
      ? `http://localhost:8000${images[currentImageIndex]}`
      : "https://via.placeholder.com/400x250?text=No+Image";

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setCurrentImageIndex((prev) =>
      (prev + 1) % images.length
    );
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return (price / 10000000).toFixed(1) + "Cr";
    if (price >= 100000) return (price / 100000).toFixed(1) + "L";
    return "₹" + price.toLocaleString();
  };

  const getPurposeTag = () => {
    const purposeMap = {
      rent: { label: "For Rent", color: "#3b82f6" },
      sell: { label: "For Sale", color: "#ef4444" },
      buy: { label: "For Buy", color: "#10b981" },
    };

    return (
      purposeMap[property.purpose] || {
        label: property.purpose,
        color: "#667eea",
      }
    );
  };

  const purposeTag = getPurposeTag();

  return (
    <div
      ref={ref}
      className={`property-card ${isActive ? "active" : ""}`}
      onMouseEnter={() => onHover(property._id.toString())}
      onMouseLeave={() => onHover(null)}
    >
      <div className="card-carousel-container">
        <img
          src={imageUrl}
          alt={property.title}
          className="card-carousel-image"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x250?text=No+Image";
          }}
        />

        {images.length > 1 && (
          <>
            <button
              className="carousel-btn carousel-prev"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="carousel-btn carousel-next"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>

            <div className="carousel-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${
                    i === currentImageIndex ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(i);
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div
          className="purpose-tag"
          style={{ backgroundColor: purposeTag.color }}
        >
          {purposeTag.label}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{property.title}</h3>
        <p className="card-price">{formatPrice(property.price)}</p>
        <p className="card-property-type">
          {property.propertyType || "Property"}
        </p>
      </div>
    </div>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;












// import { forwardRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import "../styles/PropertyCard.css";

// const PropertyCard = forwardRef(({ property, isActive, onHover }, ref) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const images = property.images && property.images.length > 0 ? property.images : [];
//   const imageUrl = images.length > 0 
//     ? `http://localhost:8000${images[currentImageIndex]}`
//     : "https://via.placeholder.com/400x250?text=No+Image";

//   const handlePrevImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNextImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const formatPrice = (price) => {
//     if (price >= 10000000) return (price / 10000000).toFixed(1) + "Cr";
//     if (price >= 100000) return (price / 100000).toFixed(1) + "L";
//     return "₹" + price.toLocaleString();
//   };

//   const getPurposeTag = () => {
//     const purposeMap = {
//       rent: { label: "For Rent", color: "#3b82f6" },
//       sell: { label: "For Sale", color: "#ef4444" },
//       buy: { label: "For Buy", color: "#10b981" }
//     };
//     return purposeMap[property.purpose] || { label: property.purpose, color: "#667eea" };
//   };

//   const purposeTag = getPurposeTag();

//   return (
//     <div
//       ref={ref}
//       className={`property-card ${isActive ? "active" : ""}`}
//       onMouseEnter={() => onHover(property._id.toString())}
//       onMouseLeave={() => onHover(null)}
//     >
//       {/* Image Carousel Section */}
//       <div className="card-carousel-container">
//         <img 
//           src={imageUrl} 
//           alt={property.title}
//           className="card-carousel-image"
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
//           }}
//         />

//         {/* Navigation Buttons */}
//         {images.length > 1 && (
//           <>
//             <button 
//               className="carousel-btn carousel-prev"
//               onClick={handlePrevImage}
//               aria-label="Previous image"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button 
//               className="carousel-btn carousel-next"
//               onClick={handleNextImage}
//               aria-label="Next image"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}

//         {/* Image Counter */}
//         {images.length > 1 && (
//           <div className="image-counter">
//             {currentImageIndex + 1} / {images.length}
//           </div>
//         )}

//         {/* Dot Indicators */}
//         {images.length > 1 && (
//           <div className="carousel-dots">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 className={`dot ${i === currentImageIndex ? "active" : ""}`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrentImageIndex(i);
//                 }}
//                 aria-label={`Go to image ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Purpose Tag */}
//         <div className="purpose-tag" style={{ backgroundColor: purposeTag.color }}>
//           {purposeTag.label}
//         </div>
//       </div>

//       {/* Card Content Section */}
//       <div className="card-content">
//         {/* Property Name */}
//         <h3 className="card-title">{property.title}</h3>

//         {/* Price */}
//         <p className="card-price">{formatPrice(property.price)}</p>

//         {/* Property Type */}
//         <p className="card-property-type">{property.purposeType || "Property"}</p>
//       </div>
//     </div>
//   );
// });

// PropertyCard.displayName = "PropertyCard";
// export default PropertyCard;

//   const handlePrevImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNextImage = (e) => {
//     e.stopPropagation();
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const formatPrice = (price) => {
//     if (price >= 10000000) return (price / 10000000).toFixed(1) + "Cr";
//     if (price >= 100000) return (price / 100000).toFixed(1) + "L";
//     return "₹" + price.toLocaleString();
//   };

//   const getPurposeTag = () => {
//     const purposeMap = {
//       rent: { label: "For Rent", color: "#3b82f6" },
//       sell: { label: "For Sale", color: "#ef4444" },
//       buy: { label: "For Buy", color: "#10b981" }
//     };
//     return purposeMap[property.purpose] || { label: property.purpose, color: "#667eea" };
//   };

//   const purposeTag = getPurposeTag();

//   return (
//     <div
//       ref={ref}
//       className={`property-card ${isActive ? "active" : ""}`}
//       onMouseEnter={() => onHover(property._id.toString())}
//       onMouseLeave={() => onHover(null)}
//     >
//       {/* Image Carousel Section */}
//       <div className="card-carousel-container">
//         <img 
//           src={imageUrl} 
//           alt={property.title}
//           className="card-carousel-image"
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
//           }}
//         />

//         {/* Navigation Buttons */}
//         {images.length > 1 && (
//           <>
//             <button 
//               className="carousel-btn carousel-prev"
//               onClick={handlePrevImage}
//               aria-label="Previous image"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button 
//               className="carousel-btn carousel-next"
//               onClick={handleNextImage}
//               aria-label="Next image"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}

//         {/* Image Counter */}
//         {images.length > 1 && (
//           <div className="image-counter">
//             {currentImageIndex + 1} / {images.length}
//           </div>
//         )}

//         {/* Dot Indicators */}
//         {images.length > 1 && (
//           <div className="carousel-dots">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 className={`dot ${i === currentImageIndex ? "active" : ""}`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrentImageIndex(i);
//                 }}
//                 aria-label={`Go to image ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Purpose Tag */}
//         <div className="purpose-tag" style={{ backgroundColor: purposeTag.color }}>
//           {purposeTag.label}
//         </div>
//       </div>

//       {/* Card Content Section */}
//       <div className="card-content">
//         {/* Property Name */}
//         <h3 className="card-title">{property.title}</h3>

//         {/* Price */}
//         <p className="card-price">{formatPrice(property.price)}</p>

//         {/* Property Type */}
//         <p className="card-property-type">{property.purposeType || "Property"}</p>
//       </div>
//     </div>
//   );
// });

// PropertyCard.displayName = "PropertyCard";
// export default PropertyCard;