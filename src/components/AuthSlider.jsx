// import { useState } from "react";
// import "../styles/auth-slider.css";
// import { Mail, Lock, User, ArrowRight } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useRef } from "react";
// import { Building2 } from 'lucide-react';

// const AuthSlider = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [signin, setSignin] = useState({ email: "", password: "" });
//   const [signup, setSignup] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const lottieRef = useRef(null);

//   const from = location.state?.from?.pathname || "/home";
//   const search = location.state?.from?.search || "";

//   return (
//     <div className="auth-slider">
//       <div className="forms">
//         {/* SIGN IN */}
//         <div className={`signin-form sign-in ${isSignUp ? "hide-left" : ""}`}>
//           <div className="building-icon-container-container">
//             <div className="building-icon-container">
//               <Building2 size={40} strokeWidth={1.25} className="w-8 h-8 text-white" />
//             </div>
//           </div>
          
          
//           <h2>Welcome Back</h2>
//           <p>Sign in to continue your journey</p>
          
//           <div className="signin-field-container">
//             <p>Email Address</p>
//               <div className="signin-field">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                     placeholder="you@example.com"
//                     value={signin.email}
//                     onChange={(e) => setSignin({ ...signin, email: e.target.value })}
//                     />
//               </div>
//               <p>Password</p>
//               <div className="signin-field">
                
//                 <Lock />
//                 <input
//                     type="password"
//                     placeholder="Enter your password"
//                     value={signin.password}
//                     onChange={(e) => setSignin({ ...signin, password: e.target.value })}
//                     />
//               </div>
//           </div>
          
//           <div className="signin-primary-btn-container">
//             <button
//               className="signin-primary-btn"
//               disabled={loading}
//               onClick={async () => {
//                   setLoading(true);

//                   const res = await fetch("http://localhost:8000/api/auth/login", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(signin),
//                   });

//                   const data = await res.json();
//                   setLoading(false);

//                   if (!res.ok) return alert(data.error);

//                   login(data.token, data.user);
//                   navigate(from + search);
//               }}
//               >
//               {loading ? "Signing In..." : <>Sign In  <ArrowRight size={16} strokeWidth={3} /></>}
//             </button>
//           </div>
          

//           <p className="mobile-switch">
//             Don’t have an account?{" "}
//             <span onClick={() => setIsSignUp(true)}>Sign Up</span>
//           </p>
//         </div>

//         {/* SIGN UP */}
//         <div className={`signup-form sign-up ${isSignUp ? "show-right" : ""}`}>
//           <h2>Create Account</h2>
//           <p>Join us and start your adventure</p>

//           <div className="signup-field">
//             <User />
//             <input
//                 placeholder="Full Name"
//                 value={signup.name}
//                 onChange={(e) => setSignup({ ...signup, name: e.target.value })}
//             />
//           </div>

//           <div className="signup-field">
//             <Mail />
//             <input
//                 placeholder="Email"
//                 value={signup.email}
//                 onChange={(e) => setSignup({ ...signup, email: e.target.value })}
//             />
//           </div>

//           <div className="signup-field">
//             <Lock />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={signup.password}
//                 onChange={(e) => setSignup({ ...signup, password: e.target.value })}
//             />
//           </div>

//           <button
//             className="signup-primary-btn"
//             disabled={loading}
//             onClick={async () => {
//                 setLoading(true);

//                 const res = await fetch("http://localhost:8000/api/auth/register", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(signup),
//                 });

//                 const data = await res.json();
//                 setLoading(false);

//                 if (!res.ok) return alert(data.error);

//                 login(data.token, data.user);
//                 navigate(from + search);
//             }}
//             >
//             {loading ? "Creating..." : <>Create Account <ArrowRight size={16} strokeWidth={3} /></>}
//           </button>

//           <p className="mobile-switch">
//             Already have an account?{" "}
//             <span onClick={() => setIsSignUp(false)}>Sign In</span>
//           </p>
//         </div>
//       </div>

//       {/* SLIDER PANEL */}
//       <div className={`overlay ${isSignUp ? "left" : "right"}`}>
//         <div className="overlay-content">

//           {!isSignUp ? (
//             <div id="signin-overlay-content">
//               <h3>New Here?</h3> 
//               <p>Sign up and discover new opportunities</p>
//               <button onClick={() => {
//                 lottieRef.current?.goToAndPlay(0, true);
//                 setIsSignUp(true);
//               }}>Sign Up</button>
//             </div>
//           ) : (
//             <>
//               <h3>Welcome Back!</h3>
//               <p>Login with your personal info</p>
//               <button onClick={() => {
//                 lottieRef.current?.goToAndPlay(0, true);
//                 setIsSignUp(false);
//               }}>Sign In</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthSlider;

import { useState } from "react";
import "../styles/auth-slider.css";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Home as HomeIcon } from 'lucide-react';

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