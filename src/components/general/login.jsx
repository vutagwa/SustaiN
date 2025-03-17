import React, { useState, useEffect } from "react";
import { auth, db } from "../essentials/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import '../styles/login.css'

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
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userRole", userData.role);
        navigateDashboard(userData.role);
      } else {
        alert("User not found!");
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
      alert(error.message);
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
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
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
      alert(error.message);
    }
    setLoading(false);
  };

  const navigateDashboard = (role) => {
    switch (role) {
      case "donor":
        navigate("/donor-dashboard");
        break;
      case "recipient":
        navigate("/recipient-dashboard");
        break;
      case "delivery_agent":
        navigate("/agent-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      <button onClick={handleGoogleLogin} disabled={loading}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.89 0 7.02 1.43 9.42 3.73l6.99-6.99C35.92 2.39 30.23 0 24 0 14.58 0 6.73 5.44 2.73 13.44l7.74 6c1.65-4.92 6.33-8.44 13.53-8.44z"/>
          <path fill="#34A853" d="M46.09 24.5c0-1.32-.11-2.63-.32-3.89H24v7.38h12.6c-.79 3.9-3.18 7.2-6.65 9.2l7.74 6c4.53-4.18 7.4-10.34 7.4-17.69z"/>
          <path fill="#FBBC05" d="M10.47 28.06C9.39 25.74 8.75 23.19 8.75 20.5s.64-5.24 1.72-7.56l-7.74-6C.64 11.26 0 15.74 0 20.5c0 4.76.64 9.24 2.73 13.56l7.74-6z"/>
          <path fill="#EA4335" d="M24 48c6.23 0 11.92-2.39 16.41-6.24l-7.74-6c-2.01 1.3-4.51 2.06-8.67 2.06-7.2 0-11.88-3.52-13.53-8.44l-7.74 6C6.73 42.56 14.58 48 24 48z"/>
        </svg>Login with Google</button>
      <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handlePhoneLogin} disabled={loading}>Send OTP</button>
      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerifyOtp} disabled={loading}>Verify OTP</button>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
