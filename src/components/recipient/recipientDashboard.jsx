import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection, doc, setDoc, Timestamp, query, where } from "firebase/firestore";
import { db, auth } from "../essentials/firebase";
import '../styles/recipient.css';
import ChatInterface from "../chat/ChatInterface";

const RecipientDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortBy, setSortBy] = useState("expiry_date");
    const [user, setUser] = useState(null); // State to hold the user object

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setUser(authUser); // Set the user object when auth state changes
        });

        return () => unsubscribe(); // Cleanup the listener
    }, []);

    useEffect(() => {
        const fetchFoodItems = async () => {
            let q = collection(db, "food_inventory");

            if (filter) {
                q = query(q, where("foodType", "==", filter));
            }

            const querySnapshot = await getDocs(q);
            let sortedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (sortBy === "expiry_date") {
                sortedItems = sortedItems.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
            }

            setFoodItems(sortedItems);
        };

        fetchFoodItems();
    }, [filter, sortBy]);

    useEffect(() => {
        const fetchDonations = async () => {
            const querySnapshot = await getDocs(collection(db, "food_inventory"));
            const foodData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(foodData);
            setFilteredDonations(foodData);
        };

        fetchDonations();
    }, []);

    useEffect(() => {
        const results = donations.filter(donation =>
            donation.food_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredDonations(results);
    }, [search, donations]);

    const requestFood = async (foodId) => {
        if (!user) {
            alert("You need to be logged in to request food.");
            return;
        }

        const requestRef = doc(db, "requests", `${foodId}_${user.uid}`);
        await setDoc(requestRef, {
            foodId: foodId,
            recipientId: user.uid,
            status: "Pending",
            requestDate: Timestamp.now(),
        });

        alert("Food request submitted successfully!");
    };
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Recipient Dashboard</h2>
        <ul>
  <li><Link to="/recipient/search">Search Donations</Link></li>
  <li><Link to="/recipient/requests">Manage Requests</Link></li>
  <li><Link to="/recipient/pickups">Pickup Schedule</Link></li>
  <li><Link to="/recipient/track">Track Received Food</Link></li>
  <li><Link to="/recipient/feedback">Provide Feedback</Link></li>
  <li><Link to="/chat">Chat</Link></li>
  <li><Link to="/recipient/notifications">Notifications</Link></li>
  <li><Link to="/general/settings">Settings</Link></li>
  <li><Link to="/faq">FAQ</Link></li>
  <li><Link to="/logout">Logout</Link></li>
</ul>

      </nav>

      <main className="content">
        <h3>Available Food Donations</h3>
        <input
          type="text"
          placeholder="Search for food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <div>
      <h2>Find Food Donations</h2>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Fruits">Fruits</option>
      </select>

      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="expiry_date">Sort by Expiry Date</option>
      </select>

      <div className="food-list">
        {foodItems.map((food) => (
          <div key={food.id} className="food-item">
            <p>{food.food_name} - {food.quantity}</p>
            <p>Expires on: {food.expiry_date}</p>
          </div>
        ))}
      </div>
    </div>
        <div className="donations-list">
          {filteredDonations.length > 0 ? (
            filteredDonations.map(donation => (
              <div key={donation.id} className="donation-card">
                <h4>{donation.food_name}</h4>
                <p>Quantity: {donation.quantity}</p>
                <p>Pickup: {donation.pickup_schedule}</p>
                <button onClick={() => requestFood(donation.id)}>Request Food</button>
                </div>
            ))
          ) : (
            <p>No matching donations found.</p>
          )}
        </div>
        {user && <ChatInterface recipientId={user.uid} donorId={"someDonorId"} />}
        {!user && <p>Please log in to access chat.</p>}      </main>
    </div>
  );
};

export default RecipientDashboard;
