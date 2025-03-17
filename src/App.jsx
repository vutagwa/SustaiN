import DonationHistory from "./components/donor/DonationHistory";
import DonorDashboard from "./components/donor/donorDashboard";
import InventoryManagement from "./components/donor/InventoryManagement";
import ScheduleDelivery from "./components/donor/SchedulePickup";
import FAQ from "./components/general/FAQ";
import Login from "./components/general/login";
import Notifications from "./components/general/notifications";
import Register from "./components/general/register";
import Settings from "./components/general/settings";

function App() {
  return (
    <div>
      <DonationHistory />
    </div>
  );
}

export default App;
