import React, { useState, useEffect } from "react";
import { db } from "../essentials/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/history.css";
import DonorSidebar from "./DonorSidebar";

const DonationHistory = ({ userId }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!userId) return;

      try {
        const q = query(collection(db, "donations"), where("donor_id", "==", userId));
        const querySnapshot = await getDocs(q);

        const donationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDonations(donationData);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId]);

  return (
    <div className="donation-history-page">
      <DonorSidebar />
      <div className="donation-history-content">
        <h2 className="donation-history-title">Your Donation History</h2>
        {loading ? (
          <p className="loading-text">Loading donations...</p>
        ) : donations.length === 0 ? (
          <p className="no-donations-text">No donations found.</p>
        ) : (
          <div className="donation-grid">
            {donations.map((donation) => (
              <div key={donation.id} className="donation-card">
                <h3 className="donation-food-name">{donation.food_name}</h3>
                <p className="donation-detail">
                  <strong>Quantity:</strong> {donation.quantity}
                </p>
                <p className="donation-detail">
                  <strong>Pickup Date:</strong>{" "}
                  {donation.pickup_schedule?.toDate()?.toLocaleDateString() ||
                    "Not Scheduled"}
                </p>
                <p className="donation-detail">
                  <strong>Status:</strong> {donation.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;