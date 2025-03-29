import React, { useState } from "react";
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  setDoc, 
  doc, 
  updateProfile 
} from "../essentials/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/registration.css";

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('donor');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Register with Email & Password
  const handleRegisterWithEmail = async (e) => {
    const donorId = user.uid; // Get Firebase Auth UID

  const donorData = {
    full_name: "John Doe", // Change to actual user input
    email: user.email,
    phone_number: "+254712345678", // Change to actual user input
    role: "donor", 
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'donors', donorId), donorData); // ✅ Save donor info in Firestore
    console.log("Donor profile created ✅");
  } catch (error) {
    console.error("Error saving donor profile:", error);
  }
    
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update User Profile with Full Name
      await updateProfile(user, { displayName: fullName });

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        phoneNumber,
        role,
        uid: user.uid,
        createdAt: new Date()
      });

      // Store Role in Local Storage for Role-Based Access Control
      localStorage.setItem("userRole", role);

      // Redirect Based on Role
      redirectBasedOnRole(role);

    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message);
    }
  };

  // ✅ Register with Google
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await userRef.get();

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          fullName: user.displayName,
          email: user.email,
          role: role, 
          uid: user.uid,
          createdAt: new Date()
        });
      }

      // Store Role in Local Storage
      localStorage.setItem("userRole", role);

      redirectBasedOnRole(role);

    } catch (error) {
      console.error("Error with Google Signup:", error);
    }
  };

  // ✅ Register with Phone Number
  const handlePhoneSignup = async () => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      const code = prompt("Enter the OTP sent to your phone:");
      const result = await confirmationResult.confirm(code);

      const user = result.user;

      // Store in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        phoneNumber,
        role,
        uid: user.uid,
        createdAt: new Date()
      });

      localStorage.setItem("userRole", role);

      redirectBasedOnRole(role);

    } catch (error) {
      console.error("Error with Phone Number Signup:", error);
    }
  };

  // ✅ Role-Based Navigation
  const redirectBasedOnRole = (userRole) => {
    switch (userRole) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "donor":
        navigate("/donor-dashboard");
        break;
      case "recipient":
        navigate("/recipient-dashboard");
        break;
      case "agent":
        navigate("/agent-dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleRegisterWithEmail}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" onChange={(e) => setPhoneNumber(e.target.value)} required />
        
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
          <option value="agent">Delivery Agent</option>
        </select>

        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />

        <button type="submit" disabled={loading}>
          Register with Email
        </button>
      </form>

      <button className="google-btn" onClick={handleGoogleSignup}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 9.5c3.89 0 7.02 1.43 9.42 3.73l6.99-6.99C35.92 2.39 30.23 0 24 0 14.58 0 6.73 5.44 2.73 13.44l7.74 6c1.65-4.92 6.33-8.44 13.53-8.44z"/>
          <path fill="#34A853" d="M46.09 24.5c0-1.32-.11-2.63-.32-3.89H24v7.38h12.6c-.79 3.9-3.18 7.2-6.65 9.2l7.74 6c4.53-4.18 7.4-10.34 7.4-17.69z"/>
          <path fill="#FBBC05" d="M10.47 28.06C9.39 25.74 8.75 23.19 8.75 20.5s.64-5.24 1.72-7.56l-7.74-6C.64 11.26 0 15.74 0 20.5c0 4.76.64 9.24 2.73 13.56l7.74-6z"/>
          <path fill="#EA4335" d="M24 48c6.23 0 11.92-2.39 16.41-6.24l-7.74-6c-2.01 1.3-4.51 2.06-8.67 2.06-7.2 0-11.88-3.52-13.53-8.44l-7.74 6C6.73 42.56 14.58 48 24 48z"/>
        </svg>
        Sign up with Google
      </button>

      <div id="recaptcha-container"></div>
      <button className="phone-btn" onClick={handlePhoneSignup}>
      📞Sign up with Phone Number
      </button>

      <p>
        <Link to="/">Already have an account? </Link>
      </p>
    </div>
  );
};

export default Register;
