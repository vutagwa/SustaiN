import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../essentials/firebase";

const DonationMatcher = ({ recipientPreferences }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const findMatches = async () => {
      const q = query(collection(db, "food_inventory"), where("foodType", "in", recipientPreferences));
      const snapshot = await getDocs(q);
      const matchedFood = snapshot.docs.map(doc => doc.data());
      setMatches(matchedFood);
    };

    findMatches();
  }, [recipientPreferences]);

  return (
    <div>
      <h2>Recommended Donations</h2>
      {matches.length > 0 ? (
        matches.map((food, index) => (
          <div key={index}>
            <p>{food.food_name} - {food.quantity}</p>
            <p>Expires: {food.expiry_date}</p>
          </div>
        ))
      ) : (
        <p>No matching donations found.</p>
      )}
    </div>
  );
};

export default DonationMatcher;
