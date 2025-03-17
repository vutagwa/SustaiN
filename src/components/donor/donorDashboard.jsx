import DonorSidebar from '../../components/donor/DonorSidebar';
import '../styles/donor.css'
const DonorDashboard = () => {
  return (
    <div className="donor-dashboard">
      <DonorSidebar />
      <div className="content">
        <h1>Welcome to Donor Dashboard</h1>
      </div>
    </div>
  );
};

export default DonorDashboard;
