import React from "react";
import { Link } from "react-router-dom";
import "../styles/Rsidebar.css"; // Separate CSS for Sidebar

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>sustaiN!</h2>
      <ul>
      <li><Link to="/recipient/dashboard">Home</Link></li>
        <li><Link to="/recipient/pickups">Pickup Schedule</Link></li>
        <li><Link to="/recipient/track">Track Received Food</Link></li>
        <li><Link to="/recipient/feedback">Recipient Feedback</Link></li>
        <li><Link to="/recipient/notifications">Notifications</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
