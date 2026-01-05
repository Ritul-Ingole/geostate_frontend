function PropertyCard({property}){
    return (
        <div style={{border: "1px solid #ccc", padding: "12px", marginBottom: "8px"}}>
            <h3>{property.title}</h3>
            <p>₹{property.price}</p>
            <p>{property.purpose}</p>
            <p>{property.purposeType}</p>
        </div>
    );
}

export default PropertyCard;