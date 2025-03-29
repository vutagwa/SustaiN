import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DonationHistory from "./components/donor/DonationHistory";
import DonorDashboard from "./components/donor/donorDashboard";
import InventoryManagement from "./components/donor/InventoryManagement";
import ScheduleDelivery from "./components/donor/SchedulePickup";
import FAQ from "./components/general/FAQ";
import Login from "./components/general/login";
import Notifications from "./components/general/notifications";
import Register from "./components/general/register";
import Settings from "./components/general/settings";
import RecipientDashboard from "./components/recipient/recipientDashboard";
import PickupSchedule from "./components/recipient/PickupSchedule";
import TrackFood from "./components/recipient/TrackFood";
import Feedback from "./components/recipient/Feedback";
import { requestNotificationPermission } from "./components/essentials/firebase";
import Navbar from "./components/general/Navbar"; // Add a navigation component
import AutoSchedule from "./components/recipient/AutoSchedule";

const App = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    /*<Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />

        
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/inventory" element={<InventoryManagement />} />
        <Route path="/donor/schedule" element={<ScheduleDelivery />} />
        <Route path="/donor/history" element={<DonationHistory />} />

        
        <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
        <Route path="/recipient/pickups" element={<PickupSchedule />} />
        <Route path="/recipient/track" element={<TrackFood />} />
        <Route path="/recipient/feedback" element={<Feedback />} />
      </Routes>
    </Router>*/
      <gene/>
  );
};

export default App;
