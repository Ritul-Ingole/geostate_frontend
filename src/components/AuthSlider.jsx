import { useState } from "react";
import "../styles/auth-slider.css";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Home as HomeIcon, MapPin, Key, TrendingUp, Ruler, FileText, Compass, IndianRupee, Home} from 'lucide-react';

/* ─────────────────────────────────────────
   Floating Background Icons
   Used in: Recommendations + Services sections
───────────────────────────────────────── */
const FLOAT_ICONS = [
  // [Icon, size, top%, left%, animDuration, animDelay, animation]
  { Icon: Home,       size: 78, top: '12%',  left: '2%',   dur: '7s',   delay: '0s',    anim: 'geoFloat' },
  { Icon: MapPin,     size: 66, top: '65%',  left: '18%', dur: '9s',   delay: '0s',  anim: 'geoPulse' },
  { Icon: Key,        size: 70, top: '35%',  left: '94%',  dur: '8s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Building2,  size: 72, top: '72%',  left: '75%',  dur: '10s',  delay: '0s',    anim: 'geoPulse' },
  { Icon: TrendingUp, size: 64, top: '8%',   left: '55%',  dur: '6.5s', delay: '0s',  anim: 'geoFloat' },
  { Icon: Ruler,      size: 68, top: '50%',  left: '40%',  dur: '7.5s', delay: '0s',  anim: 'geoPulse' },
  { Icon: FileText,   size: 62, top: '80%',  left: '30%',   dur: '8.5s', delay: '0s',    anim: 'geoFloat' },
  { Icon: Compass,    size: 62, top: '25%',  left: '65%', dur: '11s',  delay: '0s',  anim: 'geoPulse' },
  { Icon: IndianRupee, size: 60, top: '90%',  left: '85%',  dur: '7s',   delay: '0s',  anim: 'geoFloat' },
  { Icon: Home,       size: 68, top: '55%',  left: '50%',  dur: '9.5s', delay: '0s',  anim: 'geoPulse' },
];

const floatAnimStyles = `
  @keyframes geoFloat {
    0%   { transform: translateY(0px);    opacity: 0.13; }
    50%  { transform: translateY(-18px);  opacity: 0.22; }
    100% { transform: translateY(0px);    opacity: 0.13; }
  }
  @keyframes geoPulse {
    0%   { transform: scale(1);    opacity: 0.10; }
    50%  { transform: scale(1.12); opacity: 0.20; }
    100% { transform: scale(1);    opacity: 0.10; }
  }
`;

const FloatingIcons = () => (
  <>
    <style>{floatAnimStyles}</style>
    {FLOAT_ICONS.map(({ Icon, size, top, left, dur, delay, anim }, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top,
          left,
          zIndex: 0,
          pointerEvents: 'none',
          animation: `${anim} ${dur} ease-in-out ${delay} infinite`,
          color: 'rgba(101, 78, 52, 0.55)',   /* warm brown to match cream bg */
        }}
      >
        <Icon size={size} strokeWidth={1.2} />
      </div>
    ))}
  </>
);

const AuthSlider = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/home";
  const search = location.state?.from?.search || "";

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signin),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.error);

      login(data.token, data.user);
      navigate(from + search);
    } catch (error) {
      setLoading(false);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.error);

      login(data.token, data.user);
      navigate(from + search);
    } catch (error) {
      setLoading(false);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">

      {/* Floating icons — behind all content */}
        <FloatingIcons />

      <div className={`auth-wrapper ${isSignUp ? "sign-up-mode" : ""}`}>
        {/* Forms Container */}
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className={`sign-in-form ${isSignUp ? "form-hidden" : ""}`}>
              <div className="brand-header">
                <Building2 size={40} className="brand-icon" />
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">Sign in to find your perfect home</p>
              </div>

              <div className="input-field">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signin.email}
                  onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-field">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signin.password}
                  onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="social-text-mobile">
                Don't have an account?{" "}
                <span className="social-link" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </span>
              </p>
            </form>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className={`sign-up-form ${!isSignUp ? "form-hidden" : ""}`}>
              <div className="brand-header">
                <Building2 size={40} className="brand-icon" />
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Join us and discover your dream property</p>
              </div>

              <div className="input-field">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signup.name}
                  onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-field">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signup.email}
                  onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                  required
                />
              </div>

              <div className="input-field">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signup.password}
                  onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="social-text-mobile">
                Already have an account?{" "}
                <span className="social-link" onClick={() => setIsSignUp(false)}>
                  Sign In
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Panels Container */}
        <div className="panels-container">
          {/* Left Panel */}
          <div className="panel left-panel">
            <div className="panel-content">
              <div className="panel-icon-wrapper">
                <HomeIcon size={120} className="panel-icon" />
              </div>
              <h3 className="panel-title">New Here?</h3>
              <p className="panel-text">
                Sign up and start your journey to finding your perfect home
              </p>
              <button
                className="panel-btn"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="panel right-panel">
            <div className="panel-content">
              <div className="panel-icon-wrapper">
                <HomeIcon size={120} className="panel-icon" />
              </div>
              <h3 className="panel-title">Welcome Back!</h3>
              <p className="panel-text">
                Login with your personal info and continue your property search
              </p>
              <button
                className="panel-btn"
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;