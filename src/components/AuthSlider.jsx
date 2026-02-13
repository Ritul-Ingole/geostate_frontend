import { useState } from "react";
import "../styles/auth-slider.css";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Lottie from "lottie-react";
import Home from "../assets/Home.json";
import { Building2 } from 'lucide-react';

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
          <div className="building-icon-container-container">
            <div className="building-icon-container">
              <Building2 size={40} strokeWidth={1.25} className="w-8 h-8 text-white" />
            </div>
          </div>
          
          
          <h2>Welcome Back</h2>
          <p>Sign in to continue your journey</p>
          
          <div className="signin-field-container">
            <p>Email Address</p>
              <div className="signin-field">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    placeholder="you@example.com"
                    value={signin.email}
                    onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                    />
              </div>
              <p>Password</p>
              <div className="signin-field">
                
                <Lock />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={signin.password}
                    onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                    />
              </div>
          </div>
          
          <div className="signin-primary-btn-container">
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
          </div>
          

          <p className="mobile-switch">
            Don’t have an account?{" "}
            <span onClick={() => setIsSignUp(true)}>Sign Up</span>
          </p>
          <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    <span className="text-sm font-medium text-gray-700">Google</span>
  </button>
  <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
    <span className="text-sm font-medium text-gray-700">Facebook</span>
  </button>
</div>

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