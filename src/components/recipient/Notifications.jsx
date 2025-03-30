import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../essentials/firebase";
import Sidebar from "./Sidebar";
import "../styles/Rnotifications.css"; // Ensure you have styles for better UI

const Notify = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return (
    <div className="notifications-page">
      <Sidebar />
      <div className="notifications-content">
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={`notification-item ${notif.read ? "read" : "unread"}`}>
              <p>{notif.message}</p>
              {!notif.read && <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>}
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notify;
