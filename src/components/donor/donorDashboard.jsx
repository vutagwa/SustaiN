import DonorSidebar from '../../components/donor/DonorSidebar';
import '../styles/donor.css';
import { FaBell } from 'react-icons/fa';

const DonorDashboard = () => {
  const handleNotificationClick = () => {
    window.location.href = '/notifications';
  };

  return (
    <div className="donor-dashboard">
      <DonorSidebar />
      <div className="main-content">
        <div className="top-nav">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="top-right-section">
            <FaBell className="notification-bell" onClick={handleNotificationClick} />
            <div className="profile-picture">
              <img src="/images/profile.jpg" alt="Profile" />
            </div>
          </div>
        </div>
        <div className="content">
          <h1>Welcome to Donor Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
