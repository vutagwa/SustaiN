import React from "react";
import "../styles/sidebar.css";

const Sidebar = ({ setSelectedSection }) => {
  return (
    <nav className="sidebar">
      <h3>sustaiN!</h3>
      <ul>
        <li onClick={() => setSelectedSection("delivery-list")}>📦 Delivery List</li>
        <li onClick={() => setSelectedSection("proof-of-delivery")}>📷 Proof of Delivery</li>
        <li onClick={() => setSelectedSection("pickup-schedule")}>📅 Pickup Schedule</li>
        <li onClick={() => setSelectedSection("faq")}>❓ FAQ</li>
        <li onClick={() => setSelectedSection("notifications")}>🔔 Notifications</li>
        <li onClick={() => setSelectedSection("settings")}>⚙️ Settings</li>
        <li className="logout" onClick={() => alert("Logging out...")}>🚪 Logout</li>
      </ul>
    </nav>
  );
};

export default Sidebar;
