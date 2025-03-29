import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../essentials/firebase";

const PickupSchedule = () => {
  const [pickups, setPickups] = useState([]);

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

    fetchPickups();
  }, []);

  return (
    <div className="pickup-container">
      <h2>My Pickup Schedules</h2>
      {pickups.length > 0 ? (
        pickups.map((pickup) => (
          <div key={pickup.id} className="pickup-card">
            <p>Food ID: {pickup.foodId}</p>
            <p>Pickup Date: {new Date(pickup.pickupDate.seconds * 1000).toLocaleString()}</p>
            <p>Status: {pickup.status}</p>
          </div>
        ))
      ) : (
        <p>No scheduled pickups.</p>
      )}
    </div>
  );
};

export default PickupSchedule;
