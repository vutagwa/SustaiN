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
import googleIcon from "../../assets/Google.jpeg"; // Google logo
import phoneIcon from "../../assets/phone.jpeg"; // Phone login icon

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
    e.preventDefault();
    setLoading(true);
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }
  
    try {
      // 1️⃣ Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // 2️⃣ Update User Profile
      await updateProfile(user, { displayName: fullName });
  
      // 3️⃣ Store user details in Firestore under 'users' collection
      const userData = {
        fullName,
        username,
        email,
        phoneNumber,
        role,
        uid: user.uid,
        createdAt: new Date(),
      };
  
      await setDoc(doc(db, "users", user.uid), userData);
  
      // 4️⃣ Store in respective collections based on role
      if (role === "donor") {
        await setDoc(doc(db, "donors", user.uid), {
          fullName,
          email,
          phoneNumber,
          username,
          role,
          organization: "",  // Add organization name field if needed
          location: "",      // Add location field if needed
          donationCount: 0,  // Initialize donation count
          createdAt: new Date(),
        });
      } else if (role === "agent") {
        await setDoc(doc(db, "agents", user.uid), {
          fullName,
          email,
          phoneNumber,
          username,
          role,
          assignedPickups: [], // Initialize as an empty array
          completedDeliveries: 0,
          createdAt: new Date(),
        });
      }
  
      // 5️⃣ Store role in localStorage for Role-Based Access
      localStorage.setItem("userRole", role);
  
      // 6️⃣ Redirect based on role
      redirectBasedOnRole(role);
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message);
    }
    setLoading(false);
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
        navigate("/admin/dashboard");
        break;
      case "donor":
        navigate("/donor/dashboard");
        break;
      case "recipient":
        navigate("/recipient/dashboard");
        break;
      case "agent":
        navigate("/delivery/dashboard");
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

        <button class="email-reg" type="submit" disabled={loading}>
          Register with Email
        </button>
      </form>

      <div className="register-options">
      <button className="google-btn" onClick={handleGoogleSignup}>
            <img src={googleIcon} alt="Google Logo" />
      </button>

      <div id="recaptcha-container"></div>
      <button className="phone-btn" onClick={handlePhoneSignup}>
            <img src={phoneIcon} alt="Phone Icon" />
      </button>
      </div>

      <p>
        <Link to="/">Already have an account? </Link>
      </p>
    </div>
  );
};

export default Register;
