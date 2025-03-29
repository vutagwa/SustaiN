import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../essentials/firebase";

const DeliveryDashboard = ({ agentId }) => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const snapshot = await getDocs(collection(db, "deliveries"));
      setDeliveries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchDeliveries();
  }, []);

  const updateStatus = async (deliveryId, newStatus) => {
    await updateDoc(doc(db, "deliveries", deliveryId), { status: newStatus });
    alert(`Delivery status updated to ${newStatus}`);
  };

  return (
    <div>
      <h2>Delivery Agent Dashboard</h2>
      {deliveries
        .filter((delivery) => delivery.agentId === agentId)
        .map((delivery) => (
          <div key={delivery.id}>
            <p>Pickup: {JSON.stringify(delivery.pickupLocation)}</p>
            <p>Drop-off: {JSON.stringify(delivery.dropoffLocation)}</p>
            <p>Status: {delivery.status}</p>
            {delivery.status !== "delivered" && (
              <button onClick={() => updateStatus(delivery.id, "in transit")}>Start Delivery</button>
            )}
            {delivery.status === "in transit" && (
              <button onClick={() => updateStatus(delivery.id, "delivered")}>Mark as Delivered</button>
            )}
          </div>
        ))}
    </div>
  );
};

export default DeliveryDashboard;
