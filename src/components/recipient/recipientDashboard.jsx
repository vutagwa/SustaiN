import React, { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc, Timestamp, query, where } from "firebase/firestore";
import { db, auth } from "../essentials/firebase";
import "../styles/recipient.css";
import Sidebar from "./Sidebar";
import ChatInterface from "../chat/ChatInterface";
import chatIcon from "../../assets/chat.jpeg";

const RecipientDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("expiry_date");
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        const foodRef = collection(db, "food_inventory");
        const q = filter ? query(foodRef, where("foodType", "==", filter)) : foodRef;
        const querySnapshot = await getDocs(q);

        let sortedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (sortBy === "expiry_date") {
          sortedItems = sortedItems.sort((a, b) =>
            (a.expiry_date?.seconds || 0) - (b.expiry_date?.seconds || 0)
          );
        }

        setFoodItems(sortedItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
      setLoading(false);
    };

    fetchFoodItems();
  }, [filter, sortBy]);

  const requestFood = async (foodId, donorId, foodName) => {
    if (!user) {
      alert("You need to be logged in to request food.");
      return;
    }

    try {
      const requestRef = doc(db, "requests", `${foodId}_${user.uid}`);
      await setDoc(requestRef, {
        foodId,
        recipientId: user.uid,
        donorId,
        foodName,
        requestDate: Timestamp.now(),
        status: "Pending",
      });

      alert("Food request submitted successfully!");
    } catch (error) {
      console.error("Error requesting food:", error);
      alert("Failed to submit food request.");
    }
  };

  const claimFood = async (foodId, donorId, foodName, quantity) => {
    if (!user) {
      alert("You need to be logged in to claim food.");
      return;
    }

    try {
      const claimRef = doc(db, "claims", `${foodId}_${user.uid}`);
      await setDoc(claimRef, {
        foodId,
        recipientId: user.uid,
        donorId,
        foodName,
        quantity,
        status: "Claimed",
        claimDate: Timestamp.now(),
      });

      alert("Food claimed successfully!");
    } catch (error) {
      console.error("Error claiming food:", error);
      alert("Failed to claim food.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="content">
        <h2 className="dashboard-title">Available Food Donations</h2>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          <div className="filter-sort-container">
            <select onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Bakery">Bakery</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Other">Other</option>
            </select>
            <select onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="expiry_date">Sort by Expiry Date</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-message">Loading food items...</p>
        ) : (
          <div className="food-list">
            {foodItems
              .filter((food) => food.food_name.toLowerCase().includes(search.toLowerCase()))
              .map((food) => (
                <div key={food.id} className="food-item">
                  <div className="food-details">
                    <p className="food-name">{food.food_name}</p>
                    <p className="food-quantity">Quantity: {food.quantity}</p>
                    <p className="food-expiry">
                      Expires on:{" "}
                      {food.expiry_date?.seconds
                        ? new Date(food.expiry_date.seconds * 1000).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>
                  <div className="food-actions">
                    <button className="claim-button" onClick={() => claimFood(food.id, food.donor_id, food.food_name, food.quantity)}>
                      Claim
                    </button>
                    <button className="request-button" onClick={() => requestFood(food.id, food.donor_id, food.food_name)}>
                      Request
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <div className="chat-button" onClick={() => setShowChat(!showChat)}>
        <img src={chatIcon} alt="Chat Icon" />
      </div>

      {showChat && user && selectedDonorId && (
        <ChatInterface recipientId={user.uid} donorId={selectedDonorId} />
      )}
      {!user && showChat && <p className="login-message">Please log in to access chat.</p>}
    </div>
  );
};

export default RecipientDashboard;