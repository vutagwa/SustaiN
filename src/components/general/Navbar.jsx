import { Link } from "react-router-dom";
import "../styles/navbar.css"; // Add styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/donor/dashboard">Donor Dashboard</Link></li>
        <li><Link to="/recipient/dashboard">Recipient Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
