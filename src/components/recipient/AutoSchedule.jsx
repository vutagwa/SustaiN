import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../essentials/firebase";

const AutoSchedule = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const snapshot = await getDocs(collection(db, "pickup_requests"));
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchRequests();
  }, []);

  const assignTime = async (requestId) => {
    const assignedTime = new Date();
    assignedTime.setHours(assignedTime.getHours() + 2); // Assign 2 hours later

    await updateDoc(doc(db, "pickup_requests", requestId), { assignedTime, status: "scheduled" });
    alert("Pickup Scheduled!");
  };

  return (
    <div>
      <h2>Auto-Schedule Pickups</h2>
      {requests.map((req) => (
        <div key={req.id}>
          <p>Recipient: {req.recipientId}</p>
          <p>Preferred Time: {new Date(req.preferredTime?.seconds * 1000).toLocaleString()}</p>
          {req.status === "pending" && <button onClick={() => assignTime(req.id)}>Auto-Schedule</button>}
        </div>
      ))}
    </div>
  );
};

export default AutoSchedule;
