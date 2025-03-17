import React, { useState } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  signInWithPhoneNumber, 
  RecaptchaVerifier 
} from '../essentials/firebase';
import { getDoc, doc, db } from '../essentials/firebase';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const navigate = useNavigate();

  // ✅ Handle Email and Password Login
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userRole = userDoc.data().role;

      redirectBasedOnRole(userRole);

    } catch (error) {
      console.error('Login Error:', error);
      alert(error.message);
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        redirectBasedOnRole(userRole);
      } else {
        alert('User role not assigned during registration');
        navigate('/register');
      }

    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  // ✅ Handle Phone Number Login
  const handlePhoneLogin = async () => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
    } catch (error) {
      console.error('Phone Login Error:', error);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userRole = userDoc.data().role;

      redirectBasedOnRole(userRole);

    } catch (error) {
      console.error('OTP Verification Error:', error);
    }
  };

  // ✅ Redirect Based on Role
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'donor':
        navigate('/donor-dashboard');
        break;
      case 'recipient':
        navigate('/recipient-dashboard');
        break;
      case 'agent':
        navigate('/agent-dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>

      {/* Email and Password Login */}
      <form onSubmit={handleLoginWithEmail}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login with Email</button>
      </form>

      {/* Google Login */}
      <button className="google-btn" onClick={handleGoogleLogin}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.89 0 7.02 1.43 9.42 3.73l6.99-6.99C35.92 2.39 30.23 0 24 0 14.58 0 6.73 5.44 2.73 13.44l7.74 6c1.65-4.92 6.33-8.44 13.53-8.44z"/>
          <path fill="#34A853" d="M46.09 24.5c0-1.32-.11-2.63-.32-3.89H24v7.38h12.6c-.79 3.9-3.18 7.2-6.65 9.2l7.74 6c4.53-4.18 7.4-10.34 7.4-17.69z"/>
          <path fill="#FBBC05" d="M10.47 28.06C9.39 25.74 8.75 23.19 8.75 20.5s.64-5.24 1.72-7.56l-7.74-6C.64 11.26 0 15.74 0 20.5c0 4.76.64 9.24 2.73 13.56l7.74-6z"/>
          <path fill="#EA4335" d="M24 48c6.23 0 11.92-2.39 16.41-6.24l-7.74-6c-2.01 1.3-4.51 2.06-8.67 2.06-7.2 0-11.88-3.52-13.53-8.44l-7.74 6C6.73 42.56 14.58 48 24 48z"/>
        </svg>Login with Google</button>

      {/* Phone Number Login */}
      <input type="tel" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} />
      <button className="phone-btn" onClick={handlePhoneLogin}>Send OTP</button>

      {isOtpSent && (
        <>
          <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      <div id="recaptcha-container"></div>

      {/* Don't Have an Account? */}
      <p className="register-link">Don't have an account? <Link to="/register">Register Here</Link></p>
    </div>
  );
};

export default Login;
