import React, { useState, useEffect } from "react";
import { auth, db, googleProvider } from "../essentials/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import googleIcon from "../../assets/Google.jpeg"; // Google logo
import phoneIcon from "../../assets/phone.jpeg"; // Phone login icon

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false); // Toggle state
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA verified ✅"),
      });
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userRole", userData.role);
        navigateDashboard(userData.role);
      } else {
        alert("User not found in Firestore!");
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userRole", userData.role);
        navigateDashboard(userData.role);
      } else {
        alert("User not found!");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
    setLoading(false);
  };

  const handlePhoneLogin = async () => {
    setLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await auth.signInWithCredential(credential);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userRole", userData.role);
        navigateDashboard(userData.role);
      } else {
        alert("User not found!");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
    setLoading(false);
  };

  const navigateDashboard = (role) => {
    switch (role) {
      case "donor":
        navigate("/donor/dashboard");
        break;
      case "recipient":
        navigate("recipient/dashboard");
        break;
      case "delivery_agent":
        navigate("/delivery/dashboard");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleEmailLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="email-login" type="submit" disabled={loading}>Login</button>
        
        <div className="login-options">
          {/* Google Login */}
          <button className="google-login" onClick={handleGoogleLogin} disabled={loading}>
            <img src={googleIcon} alt="Google Logo" />
          </button>

          {/* Phone Login (toggle visibility) */}
          <button className="phone-login" onClick={() => setShowPhoneLogin(!showPhoneLogin)}>
            <img src={phoneIcon} alt="Phone Icon" />
          </button>
        </div>

        {showPhoneLogin && (
          <div className="phone-login-form">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="otp-login" onClick={handlePhoneLogin} disabled={loading}>
              Send OTP
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="otp-login" onClick={handleVerifyOtp} disabled={loading}>
              Verify OTP
            </button>
          </div>
        )}
        <div id="recaptcha-container"></div>

        <p><Link to="/register">Don't have an account?</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
