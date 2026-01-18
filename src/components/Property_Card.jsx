function PropertyCard({property, onHover}){
    return (
        <div onMouseEnter={() => onHover(property._id)}
            onMouseLeave={() => onHover(null)}
            style={{border: "1px solid #ccc", padding: "12px", marginBottom: "8px", cursor: "pointer"}}
        >
            <h3>{property.title}</h3>
            <p>₹ {property.price}</p>
            <p>{property.purpose}</p>
            <p>{property.purposeType}</p>
        </div>
    );
}

export default PropertyCard;