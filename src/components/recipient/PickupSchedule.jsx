import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../essentials/firebase";
import { Link } from "react-router-dom";
import "../styles/PickupSchedule.css"; // Import CSS file

const containerStyle = { width: "100%", height: "300px" };
const center = { lat: -1.286389, lng: 36.817223 }; // Default: Nairobi

const PickupSchedule = () => {
  const [pickups, setPickups] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchPickups = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "pickup_schedules"));
      const pickupData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(pickup => pickup.recipientId === user.uid);
      setPickups(pickupData);
    };

    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "pickup_requests"));
      setLocations(snapshot.docs.map(doc => doc.data().pickupLocation));
    };

    fetchPickups();
    fetchLocations();
  }, []);

  return (
    <div className="pickup-page">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>sustaiN!</h2>
        <ul>
          <li><Link to="/recipient/pickups">Pickup Schedule</Link></li>
          <li><Link to="/recipient/track">Track Received Food</Link></li>
          <li><Link to="/recipient/feedback">Provide Feedback</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Pickup Schedule Section */}
        <div className="pickup-schedule">
          <h2>My Pickup Schedules</h2>
          {pickups.length > 0 ? (
            pickups.map((pickup) => (
              <div key={pickup.id} className="pickup-card">
                <p><strong>Food ID:</strong> {pickup.foodId}</p>
                <p><strong>Pickup Date:</strong> {new Date(pickup.pickupDate.seconds * 1000).toLocaleString()}</p>
                <p><strong>Status:</strong> {pickup.status}</p>
              </div>
            ))
          ) : (
            <p className="no-pickups">No scheduled pickups.</p>
          )}
        </div>

        {/* Pickup Map Section */}
        <div className="pickup-map">
          <h2>Pickup Locations</h2>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              {locations.map((loc, index) => (
                <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default PickupSchedule;
