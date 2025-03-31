import React, { useState, useEffect } from "react";
import { db } from "../essentials/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import '../styles/agent.css'
const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "deliveries"));
        const deliveryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeliveries(deliveryData);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, []);

  const markAsCompleted = async (deliveryId) => {
    try {
      const deliveryRef = doc(db, "deliveries", deliveryId);
      await updateDoc(deliveryRef, { status: "completed", updatedAt: new Date() });
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === deliveryId ? { ...delivery, status: "completed" } : delivery
        )
      );
      alert("Delivery marked as completed!");
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  return (
    <div>
      <h2>Scheduled Deliveries</h2>
      {deliveries.length === 0 ? <p>Loading deliveries...</p> : (
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              {delivery.food_name} - {delivery.quantity} (Recipient: {delivery.recipient}) - Status: {delivery.status}
              {delivery.status !== "completed" && (
                <button onClick={() => markAsCompleted(delivery.id)}>Mark as Completed</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeliveryList;
