import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DonationHistory from "./components/donor/DonationHistory";
import DonorDashboard from "./components/donor/DonorDashboard";
import InventoryManagement from "./components/donor/InventoryManagement";
import ScheduleDelivery from "./components/donor/SchedulePickup";
import FAQ from "./components/general/FAQ";
import Login from "./components/general/Login";
import Notifications from "./components/general/Notifications";
import Register from "./components/general/Register";
import Settings from "./components/general/Settings";
import RecipientDashboard from "./components/recipient/RecipientDashboard";
import PickupSchedule from "./components/recipient/PickupSchedule";
import TrackFood from "./components/recipient/TrackFood";
import Feedback from "./components/recipient/Feedback";
import { requestNotificationPermission } from "./components/essentials/firebase";
import Navbar from "./components/general/Navbar";
import AutoSchedule from "./components/recipient/AutoSchedule";
import AdminDashboard from "./components/admin/AdminDashboard";
import Reports from "./components/admin/Reports";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import DonationMatching from "./components/admin/DonationMatching";
import FoodForecast from "./components/admin/FoodForecast";
import DeliveryDashboard from "./components/delivery agent/agentDashboard";

const App = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);


  return (
    <>
        <Navbar />
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

          {/* Donor Routes */}
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/inventory" element={<InventoryManagement />} />
          <Route path="/donor/schedule" element={<ScheduleDelivery />} />
          <Route path="/donor/history" element={<DonationHistory />} />

          {/* Recipient Routes */}
          <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
          <Route path="/recipient/pickups" element={<PickupSchedule />} />
          <Route path="/recipient/track" element={<TrackFood />} />
          <Route path="/recipient/feedback" element={<Feedback />} />
          <Route path="/recipient/auto-schedule" element={<AutoSchedule />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/matching" element={<DonationMatching />} />
          <Route path="/admin/forecast" element={<FoodForecast />} />

          {/* Delivery Agent Routes */}
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        </Routes>
    </>
  );
};

export default App;
