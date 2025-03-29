import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";

const DonationMatching = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const donationsSnapshot = await getDocs(collection(db, "donations"));
      const requestsSnapshot = await getDocs(collection(db, "food_requests"));

      const donations = donationsSnapshot.docs.map(doc => doc.data());
      const requests = requestsSnapshot.docs.map(doc => doc.data());

      const matchScores = [];

      donations.forEach((donation) => {
        requests.forEach((request) => {
          const score =
            (donation.foodType === request.foodType ? 1 : 0) +
            (donation.quantity >= request.quantity ? 1 : 0) +
            (request.urgency === "high" ? 1 : 0);

          if (score > 1) {
            matchScores.push({ donor: donation.donorId, recipient: request.recipientId, score });
          }
        });
      });

      setMatches(matchScores);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>AI-Based Donation Matching</h2>
      {matches.map((match, index) => (
        <p key={index}>Donor {match.donor} matched with Recipient {match.recipient} (Score: {match.score})</p>
      ))}
    </div>
  );
};

export default DonationMatching;
