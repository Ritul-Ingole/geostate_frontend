import { useState } from "react";
import "../styles/auth-slider.css";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Lottie from "lottie-react";
import Home from "../assets/Home.json";

const AuthSlider = () => {
  const [isSignUp, setIsSignUp] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [signin, setSignin] = useState({ email: "", password: "" });
    const [signup, setSignup] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const lottieRef = useRef(null);
  return (
    <div className="auth-slider">
      <div className="forms">
        {/* SIGN IN */}
        <div className={`signin-form sign-in ${isSignUp ? "hide-left" : ""}`}>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>

          <div className="signin-field">
            <Mail />
            <input
                placeholder="Email"
                value={signin.email}
                onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                />
          </div>

          <div className="signin-field">
            <Lock />
            <input
                type="password"
                placeholder="Password"
                value={signin.password}
                onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                />
          </div>

          <button
            className="signin-primary-btn"
            disabled={loading}
            onClick={async () => {
                setLoading(true);

                const res = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signin),
                });

                const data = await res.json();
                setLoading(false);

                if (!res.ok) return alert(data.error);

                login(data.token, data.user);
                navigate("/");
            }}
            >
            {loading ? "Signing In..." : <>Sign In  <ArrowRight size={16} strokeWidth={3} /></>}
          </button>

          <p className="mobile-switch">
            Don’t have an account?{" "}
            <span onClick={() => setIsSignUp(true)}>Sign Up</span>
          </p>
        </div>

        {/* SIGN UP */}
        <div className={`signup-form sign-up ${isSignUp ? "show-right" : ""}`}>
          <h2>Create Account</h2>
          <p>Join us and start your adventure</p>

          <div className="signup-field">
            <User />
            <input
                placeholder="Full Name"
                value={signup.name}
                onChange={(e) => setSignup({ ...signup, name: e.target.value })}
            />
          </div>

          <div className="signup-field">
            <Mail />
            <input
                placeholder="Email"
                value={signup.email}
                onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            />
          </div>

          <div className="signup-field">
            <Lock />
            <input
                type="password"
                placeholder="Password"
                value={signup.password}
                onChange={(e) => setSignup({ ...signup, password: e.target.value })}
            />
          </div>

          <button
            className="signup-primary-btn"
            disabled={loading}
            onClick={async () => {
                setLoading(true);

                const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signup),
                });

                const data = await res.json();
                setLoading(false);

                if (!res.ok) return alert(data.error);

                setIsSignUp(false);
            }}
            >
            {loading ? "Creating..." : <>Create Account <ArrowRight size={16} strokeWidth={3} /></>}
          </button>

          <p className="mobile-switch">
            Already have an account?{" "}
            <span onClick={() => setIsSignUp(false)}>Sign In</span>
          </p>
        </div>
      </div>

      {/* SLIDER PANEL */}
      <div className={`overlay ${isSignUp ? "left" : "right"}`}>
        <div className="overlay-content">

          {/* LOTTIE */}
          <Lottie
            lottieRef={lottieRef}
            animationData={Home}
            autoplay={false}
            loop={false}
            className="auth-lottie"
          />
          {!isSignUp ? (
            <div id="signin-overlay-content">
              <h3>New Here?</h3> 
              <p>Sign up and discover new opportunities</p>
              <button onClick={() => {
                lottieRef.current?.goToAndPlay(0, true);
                setIsSignUp(true);
              }}>Sign Up</button>
            </div>
          ) : (
            <>
              <h3>Welcome Back!</h3>
              <p>Login with your personal info</p>
              <button onClick={() => {
                lottieRef.current?.goToAndPlay(0, true);
                setIsSignUp(false);
              }}>Sign In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;