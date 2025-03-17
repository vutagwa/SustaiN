import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaCalendarAlt, FaHistory, FaStar, FaChartBar, FaComments, FaQuestionCircle, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import '../styles/donor.css';

const DonorSidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">sustaiN!</h2>

      <ul>
        <li><Link to="/donor-dashboard"><FaHome /> Dashboard</Link></li>
        <li><Link to="/donor-profile"><FaUser /> Business Profile</Link></li>
        <li><Link to="/inventory-management"><FaBox /> Inventory Management</Link></li>
        <li><Link to="/schedule-pickup"><FaCalendarAlt /> Schedule Pickup</Link></li>
        <li><Link to="/donation-history"><FaHistory /> Donation History</Link></li>
        <li><Link to="/feedback"><FaStar /> Delivery Agent Feedback</Link></li>
        <li><Link to="/analytics"><FaChartBar /> Analytics & Reports</Link></li>
        <li><Link to="/messages"><FaComments /> Messages & Communication</Link></li>
        <li><Link to="/support"><FaQuestionCircle /> Support & Resources</Link></li>
        <li><Link to="/settings"><FaCog /> Settings</Link></li>
        <li className="logout"><Link to="/login"><FaSignOutAlt /> Logout</Link></li>
      </ul>
    </div>
  );
};

export default DonorSidebar;
