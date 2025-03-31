import React, { useState, useEffect } from "react";
import { db } from "../essentials/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import DonorSidebar from "./DonorSidebar";
import '../styles/schedule.css';

const ScheduleDelivery = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState("");
  const [recipient, setRecipient] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "food_inventory"));
        const items = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.status === "available" && item.quantity > 0);
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleSchedule = async () => {
    if (!selectedFood || !recipient || !deliveryTime) {
      alert("Please fill all fields");
      return;
    }

    const foodItem = inventory.find((item) => item.id === selectedFood);
    if (quantity > foodItem.quantity) {
      alert("Not enough stock available!");
      return;
    }

    try {
      await addDoc(collection(db, "deliveries"), {
        food_id: selectedFood,
        food_name: foodItem.food_name,
        recipient,
        quantity,
        delivery_time: new Date(deliveryTime),
        status: "scheduled",
        createdAt: new Date(),
      });

      const foodRef = doc(db, "food_inventory", selectedFood);
      await updateDoc(foodRef, {
        quantity: foodItem.quantity - quantity,
        status: foodItem.quantity - quantity === 0 ? "unavailable" : "available",
        updatedAt: new Date(),
      });

      alert("Delivery scheduled successfully!");
      setSelectedFood("");
      setRecipient("");
      setQuantity(1);
      setDeliveryTime("");
    } catch (error) {
      console.error("Error scheduling delivery:", error);
      alert("Failed to schedule delivery.");
    }
  };

  return (
    <div className="delivery-schedule-page">
      <DonorSidebar />
      <div className="delivery-schedule-content">
        <h2 className="delivery-schedule-title">Schedule a Delivery</h2>
        {loading ? (
          <p className="loading-text">Loading available food...</p>
        ) : (
          <div className="schedule-form">
            <div className="form-group">
              <label htmlFor="foodItem" className="form-label">Food Item:</label>
              <select id="foodItem" className="form-select" value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
                <option value="">Select Food</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.food_name} (Qty: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipient" className="form-label">Recipient:</label>
              <input type="text" id="recipient" className="form-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">Quantity:</label>
              <input type="number" id="quantity" className="form-input" value={quantity} min="1" max={inventory.find(item => item.id === selectedFood)?.quantity || 1} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryTime" className="form-label">Delivery Time:</label>
              <input type="datetime-local" id="deliveryTime" className="form-input" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
            </div>

            <button className="schedule-button" onClick={handleSchedule}>Schedule Delivery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDelivery;