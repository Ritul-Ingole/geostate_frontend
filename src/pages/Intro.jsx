import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import HomeAnimation from "../assets/Home.json";
import "../styles/Intro.css";

const Intro = () => {
  const lottieRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle → animating → zooming → done
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay then play animation
    const startTimer = setTimeout(() => {
      setPhase("animating");
      lottieRef.current?.goToAndPlay(0, true);
    }, 300);

    // After animation (~2s), start zoom-in transition
    const zoomTimer = setTimeout(() => {
      setPhase("zooming");
    }, 2400);

    // After zoom completes, navigate to landing
    const navTimer = setTimeout(() => {
      navigate("/landing");
    }, 3200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(zoomTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className={`intro-screen phase-${phase}`}>
      {/* White fill that expands to cover screen on zoom */}
      <div className="intro-zoom-fill" />

      <div className="intro-content">
        {/* Lottie Animation */}
        <div className="intro-lottie-wrapper">
          <Lottie
            lottieRef={lottieRef}
            animationData={HomeAnimation}
            autoplay={false}
            loop={false}
            className="intro-lottie"
          />
        </div>

        {/* Brand text fades in after animation starts */}
        <div className="intro-brand">
          <h1 className="intro-title">GeoState</h1>
          <p className="intro-tagline">Find your perfect home</p>
        </div>
      </div>
    </div>
  );
};

export default Intro;