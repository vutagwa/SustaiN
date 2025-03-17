import { useEffect, useState } from "react";
import { db, collection, addDoc, getDocs, serverTimestamp } from "../essentials/firebase";
import '../styles/notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const notificationsRef = collection(db, "notifications");

  // Fetch notifications
  const fetchNotifications = async () => {
    const data = await getDocs(notificationsRef);
    setNotifications(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Add a new notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (title && message) {
      await addDoc(notificationsRef, {
        title,
        message,
        timestamp: serverTimestamp(),
      });
      setTitle('');
      setMessage('');
      fetchNotifications(); // Fetch updated notifications
    }
  };

  // Fetch notifications when the page loads
  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>📢 Notifications Page</h2>
      
      <form onSubmit={handleSendNotification}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send Notification</button>
      </form>

      <h3>🔔 All Notifications:</h3>
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id}>
            <strong>{notif.title}</strong>: {notif.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
