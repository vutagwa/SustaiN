import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../essentials/firebase";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id) => {
    const notifRef = doc(db, "notifications", id);
    await updateDoc(notifRef, { read: true });
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification-item ${notif.read ? "read" : "unread"}`}>
          <p>{notif.message}</p>
          {!notif.read && <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
