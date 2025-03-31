import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../essentials/firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "../styles/profile.css";
import DonorSidebar from "./DonorSidebar"

const DonorProfile = ({ userId }) => {
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    phone: "",
    organization: "",
    location: "",
    profilePhoto: "",
  });

  const [uploading, setUploading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const profileRef = doc(db, "donors", userId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        setProfile(profileSnap.data());
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      const phoneRegex = /^07\d{2}-\d{3}-\d{3}$/;
      setPhoneError(phoneRegex.test(value) ? "" : "Format: 0712-123-123");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `donor_profiles/${uuidv4()}_${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfile((prev) => ({ ...prev, profilePhoto: downloadURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePhoto = async () => {
    if (profile.profilePhoto) {
      const fileRef = ref(storage, profile.profilePhoto);
      try {
        await deleteObject(fileRef);
        setProfile((prev) => ({ ...prev, profilePhoto: "" }));
      } catch (error) {
        console.error("Error removing profile photo:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      alert("Fix phone number format");
      return;
    }

    const donorRef = doc(db, "donors", userId);
    await setDoc(donorRef, {
      ...profile,
      role: "donor",
      donationCount: profile.donationCount || 0,
      createdAt: profile.createdAt || serverTimestamp(),
    });

    alert("Profile updated successfully!");
  };

  return (
    <div className="donor-profile">
            <DonorSidebar />

      <h2>👤 Donor Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Photo Upload */}
        <div className="profile-photo">
          {profile.profilePhoto ? (
            <div className="photo-container">
              <img src={profile.profilePhoto} alt="Profile" className="photo-preview" />
              <button type="button" className="remove-photo-btn" onClick={removeProfilePhoto}>
                ❌ Remove
              </button>
            </div>
          ) : (
            <div className="upload-box">
              <p>Upload a Profile Photo</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          )}
          {uploading && <p>Uploading...</p>}
        </div>

        {/* Full Name */}
        <label>Full Name</label>
        <input type="text" name="fullname" value={profile.fullname} onChange={handleChange} required />

        {/* Email (Readonly) */}
        <label>Email</label>
        <input type="email" name="email" value={profile.email} readOnly />

        {/* Phone */}
        <label>Phone <span className="error">{phoneError}</span></label>
        <input type="text" name="phone" value={profile.phone} onChange={handleChange} required />

        {/* Organization */}
        <label>Organization</label>
        <input type="text" name="organization" value={profile.organization} onChange={handleChange} required />

        {/* Location */}
        <label>Location</label>
        <input type="text" name="location" value={profile.location} onChange={handleChange} required />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default DonorProfile;
