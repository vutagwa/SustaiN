import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Bar, Line } from "react-chartjs-2";

const AdminAnalytics = () => {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const donationsSnapshot = await getDocs(collection(db, "donations"));
      const requestsSnapshot = await getDocs(collection(db, "food_requests"));

      setDonations(donationsSnapshot.docs.map(doc => doc.data()));
      setRequests(requestsSnapshot.docs.map(doc => doc.data()));
    };

    fetchData();
  }, []);

  const donationData = {
    labels: donations.map((d, i) => `Donation ${i + 1}`),
    datasets: [{ label: "Donations", data: donations.map((d) => d.quantity), backgroundColor: "green" }],
  };

  const requestData = {
    labels: requests.map((r, i) => `Request ${i + 1}`),
    datasets: [{ label: "Food Requests", data: requests.map((r) => r.quantity), backgroundColor: "red" }],
  };

  return (
    <div>
      <h2>Admin Analytics</h2>
      <Bar data={donationData} />
      <Line data={requestData} />
    </div>
  );
};

export default AdminAnalytics;
