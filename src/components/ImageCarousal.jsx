import { useState } from "react";

const ImageCarousel = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      <img
        src={`http://localhost:8000${images[index]}`}
        alt="property"
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      {/* Prev */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: "12px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
        }}
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
        }}
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
          gap: "6px",
        }}
      >
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: i === index ? "#333" : "#ccc",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;