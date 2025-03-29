import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from  "../essentials/firebase";

const Feedback = () => {
  const [donorId, setDonorId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitFeedback = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to submit feedback.");
      return;
    }

    await addDoc(collection(db, "feedback"), {
      donorId,
      recipientId: user.uid,
      rating,
      comment,
      timestamp: Timestamp.now(),
    });

    alert("Feedback submitted successfully!");
    setDonorId("");
    setRating(5);
    setComment("");
  };

  return (
    <div className="feedback-container">
      <h2>Provide Feedback</h2>
      <input
        type="text"
        placeholder="Enter Donor ID"
        value={donorId}
        onChange={(e) => setDonorId(e.target.value)}
      />
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num} Stars</option>
        ))}
      </select>
      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={submitFeedback}>Submit Feedback</button>
    </div>
  );
};

export default Feedback;
