import React, { useEffect, useState } from 'react';
import DonorSidebar from '../../components/donor/DonorSidebar';
import '../styles/donor.css';
import { FaBell } from 'react-icons/fa';
import { doc, updateDoc, addDoc, collection, Timestamp, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../essentials/firebase";

const DonorDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const user = auth.currentUser;

  // Fetch pending requests from Firestore
  const fetchPendingRequests = async () => {
    try {
      const q = query(collection(db, "requests"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  // Fetch donations from Firestore
  const fetchDonations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "donations"));
      const donationData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched donations:", donationData); // Check the data structure
      setDonations(donationData);
    } catch (error) {
      console.error("Error fetching donations: ", error);
    }
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (user) {
        try {
          const q = query(collection(db, "food_inventory"), where("donor_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPendingRequests(requests);
        } catch (error) {
          console.error("Error fetching requests: ", error);
        }
      }
    };

    const fetchDonations = async () => {
      if (user) {
        try {
          const q = query(collection(db, "food_inventory"), where("donor_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const donationsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setDonations(donationsData);
        } catch (error) {
          console.error("Error fetching donations: ", error);
        }
      }
    };

    fetchPendingRequests();
    fetchDonations();
  }, [user]);

  const handleNotificationClick = () => {
    window.location.href = '/notifications';
  };

  const approveRequest = async (requestId, recipientId) => {
    try {
      const requestRef = doc(db, "requests", requestId);
      await updateDoc(requestRef, { status: "approved" });

      await addDoc(collection(db, "notifications"), {
        userId: recipientId,
        message: "Your food request has been approved!",
        type: "request_approved",
        read: false,
        createdAt: Timestamp.now(),
      });

      alert("Request approved and recipient notified!");
      fetchPendingRequests(); // Refresh pending requests
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  // Placeholder data for testing
  const placeholderRequests = [
    { id: 'req1', recipientName: 'John Doe', status: 'pending', recipientId: 'recipient1' },
    { id: 'req2', recipientName: 'Jane Smith', status: 'pending', recipientId: 'recipient2' },
  ];

  const placeholderDonations = [
    { id: 'don1', foodtype: 'Fruits', quantity: 10, expierydate: '2024-12-31', status: 'available' },
    { id: 'don2', foodtype: 'Vegetables', quantity: 5, expierydate: '2024-12-25', status: 'available' },
  ];

  return (
    <div className="donor-dashboard-page">
      <DonorSidebar />
      <div className="main-content">
        <div className="top-nav">
          <div className="search-bar">
            <input type="text" placeholder="Search for donations or recipients..." />
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
          <h1 className="dashboard-title">Welcome to Donor Dashboard</h1>

          {/* Pending Requests Section */}
          <div className="donation-list">
            <h2 className="list-title">Pending Requests</h2>
            <div className="pending-requests">
              {pendingRequests.length === 0 ? (
                placeholderRequests.length === 0 ? (
                  <p className="no-data-message">No pending requests at the moment.</p>
                ) : (
                  placeholderRequests.map(request => (
                    <div key={request.id} className="request-card">
                      <h3 className="card-title">Food Request #{request.id}</h3>
                      <p className="card-detail">Recipient: {request.recipientName}</p>
                      <p className="card-detail">Status: {request.status}</p>
                      <button className="approve-btn" onClick={() => approveRequest(request.id, request.recipientId)}>
                        Approve Request
                      </button>
                    </div>
                  ))
                )
              ) : (
                pendingRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <h3 className="card-title">Food Request #{request.id}</h3>
                    <p className="card-detail">Recipient: {request.recipientName}</p>
                    <p className="card-detail">Status: {request.status}</p>
                    <button className="approve-btn" onClick={() => approveRequest(request.id, request.recipientId)}>
                      Approve Request
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Donations Section */}
          <div className="donation-list">
            <h2 className="list-title">Your Donations</h2>
            <div className="donations-cards">
              {donations.length === 0 ? (
                placeholderDonations.length === 0 ? (
                  <p className="no-data-message">No donations yet. Consider adding your surplus food.</p>
                ) : (
                  placeholderDonations.map(donation => (
                    <div key={donation.id} className="donation-card">
                      <h3 className="card-title">Food Donation #{donation.id}</h3>
                      <p className="card-detail">Food Type: {donation.foodtype}</p>
                      <p className="card-detail">Quantity: {donation.quantity}</p>
                      <p className="card-detail">Expiry Date: {donation.expierydate}</p>
                      <p className="card-detail">Status: {donation.status}</p>
                      <button className="edit-btn">Edit Donation</button>
                      <button className="cancel-btn">Cancel Donation</button>
                    </div>
                  ))
                )
              ) : (
                donations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    <h3 className="card-title">Food Donation #{donation.id}</h3>
                    <p className="card-detail">Food Type: {donation.foodtype}</p>
                    <p className="card-detail">Quantity: {donation.quantity}</p>
                    <p className="card-detail">Expiry Date: {donation.expierydate}</p>
                    <p className="card-detail">Status: {donation.status}</p>
                    <button className="edit-btn">Edit Donation</button>
                    <button className="cancel-btn">Cancel Donation</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;