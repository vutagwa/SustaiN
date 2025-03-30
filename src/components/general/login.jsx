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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
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
      // 1️⃣ Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // 2️⃣ Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // 3️⃣ Store role in localStorage for Role-Based Access
        localStorage.setItem("userRole", userData.role);
  
        // 4️⃣ Navigate to the correct dashboard
        navigateDashboard(userData.role);
      } else {
        alert("User not found in Firestore!");
      }
    } catch (error) {
      console.error("Login Error:", error);
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
      console.error("Phone login error:", error);
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
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Login</button>
      </form>

      <button onClick={handleGoogleLogin} disabled={loading}>Login with Google</button>

      <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handlePhoneLogin} disabled={loading}>Send OTP</button>
      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerifyOtp} disabled={loading}>Verify OTP</button>

      <div id="recaptcha-container"></div>

      <p><Link to="/register">Don't have an account?</Link></p>
    </div>
  );
};

export default Login;
