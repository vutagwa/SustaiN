import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../essentials/firebase";

const TrackFood = () => {
  const [receivedFood, setReceivedFood] = useState([]);

  useEffect(() => {
    const fetchReceivedFood = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "requests"));
      const foodData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(request => request.recipientId === user.uid && request.status === "Completed");
      setReceivedFood(foodData);
    };

    fetchReceivedFood();
  }, []);

  return (
    <div className="track-container">
      <h2>Received Food</h2>
      {receivedFood.length > 0 ? (
        receivedFood.map((food) => (
          <div key={food.id} className="food-card">
            <p>Food ID: {food.foodId}</p>
            <p>Received On: {new Date(food.requestDate.seconds * 1000).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No food received yet.</p>
      )}
    </div>
  );
};

export default TrackFood;
