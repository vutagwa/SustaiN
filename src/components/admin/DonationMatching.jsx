import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../essentials/firebase";

const DonationMatching = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch food donations (available inventory)
        const donationsSnapshot = await getDocs(collection(db, "food_inventory"));
        const requestsSnapshot = await getDocs(collection(db, "food_requests"));

        const donations = donationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const requests = requestsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const matchScores = [];

        // ✅ Match Donations with Requests
        donations.forEach((donation) => {
          requests.forEach((request) => {
            const score =
              (donation.food_name === request.food_name ? 1 : 0) + // Food type match
              (donation.quantity >= request.quantity ? 1 : 0) + // Quantity match
              (request.urgency === "high" ? 1 : 0); // Urgency priority

            if (score > 1) {
              matchScores.push({
                donor: donation.donor_id,
                recipient: request.recipient_id,
                food_name: donation.food_name,
                quantity: request.quantity,
                score,
              });

              // ✅ Confirm the match in Firestore
              confirmMatch(donation.donor_id, request.recipient_id, donation.food_name, request.quantity);
            }
          });
        });

        setMatches(matchScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Save Match to Firestore
  const confirmMatch = async (donorId, recipientId, foodName, quantity) => {
    try {
      await addDoc(collection(db, "donations"), {
        donor_id: donorId,
        recipient_id: recipientId,
        food_name: foodName,
        quantity: quantity,
        status: "matched",
        timestamp: serverTimestamp(),
      });

      console.log(`Match confirmed: ${donorId} → ${recipientId}`);
    } catch (error) {
      console.error("Error confirming match:", error);
    }
  };

  return (
    <div>
      <h2>AI-Based Donation Matching</h2>
      {matches.map((match, index) => (
        <p key={index}>
          Donor {match.donor} matched with Recipient {match.recipient} (Score: {match.score})
        </p>
      ))}
    </div>
  );
};

export default DonationMatching;
