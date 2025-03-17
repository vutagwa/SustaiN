import React, { useState, useEffect } from "react";
import { db } from "../essentials/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import '../styles/history.css'
const DonationHistory = ({ userId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!userId) return;

      try {
        const q = query(collection(db, "inventory"), where("donor_id", "==", `/donors/${userId}`));
        const querySnapshot = await getDocs(q);
        const donationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(donationData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId]);

  return (
    <div>
      <h2>Your Donation History</h2>
      {loading ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => (
            <div key={donation.id} className="donation-card">
              <h3>{donation.food_name}</h3>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Pickup Date:</strong> {new Date(donation.pickup_schedule.toDate()).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {donation.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
