import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../essentials/firebase";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css"; // Import Styles

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  const approveRecipient = async (userId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { approved: true });
    alert("Recipient approved!");
  };

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
          <li><Link to="/admin/analytics">Analytics</Link></li>
          <li><Link to="/admin/matching">Donation Matching</Link></li>
          <li><Link to="/admin/forecast">Food Forecast</Link></li>
          <li><Link to="/admin/faq">FAQ</Link></li>
          <li><Link to="/admin/settings">Settings</Link></li>
          <li className="logout"><Link to="/logout">Logout</Link></li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className="admin-content">
        <h2>Admin Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Approval</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "recipient" && !user.approved ? (
                    <button onClick={() => approveRecipient(user.id)} className="approve-btn">
                      Approve
                    </button>
                  ) : (
                    <span className="approved-text">Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
