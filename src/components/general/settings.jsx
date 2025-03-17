import React, { useState } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../essentials/firebase'; 
import '../styles/settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, password);
      setSuccess('Password updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div>
        <h3>Profile Management</h3>
        <input 
          type="text" 
          placeholder="Update Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button onClick={handleUpdateProfile}>Update Profile</button>
      </div>

      <div>
        <h3>Change Password</h3>
        <input 
          type="password" 
          placeholder="New Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>

      <div>
        <h3>Notification Preferences</h3>
        <label>
          <input type="checkbox" /> Enable Email Notifications
        </label>
        <label>
          <input type="checkbox" /> Enable Push Notifications
        </label>
      </div>

      <div>
        <h3>Account Management</h3>
        <button>Delete Account</button>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Settings;
