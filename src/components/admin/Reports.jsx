import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";

const Reports = () => {
  const [data, setData] = useState({ totalDonations: 0, totalRequests: 0, popularFood: [] });

  useEffect(() => {
    const fetchData = async () => {
      const donations = await getDocs(collection(db, "donations"));
      const requests = await getDocs(collection(db, "requests"));

      let foodCount = {};
      requests.forEach((doc) => {
        const foodType = doc.data().foodType;
        foodCount[foodType] = (foodCount[foodType] || 0) + 1;
      });

      const sortedFood = Object.entries(foodCount).sort((a, b) => b[1] - a[1]).map(([key]) => key);

      setData({ totalDonations: donations.size, totalRequests: requests.size, popularFood: sortedFood });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Reports</h2>
      <p>Total Donations: {data.totalDonations}</p>
      <p>Total Requests: {data.totalRequests}</p>
      <p>Most Requested Food: {data.popularFood.join(", ")}</p>
    </div>
  );
};

export default Reports;
