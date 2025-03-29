import React, { useState } from "react";
import { storage, db } from "../essentials/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";

const ProofOfDelivery = ({ deliveryId }) => {
  const [image, setImage] = useState(null);
  
  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    
    const storageRef = ref(storage, `proof_of_delivery/${deliveryId}`);
    await uploadBytes(storageRef, image);
    
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "deliveries", deliveryId), { proofOfDelivery: downloadURL, status: "delivered" });

    alert("Delivery confirmed!");
  };

  return (
    <div>
      <h3>Proof of Delivery</h3>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Proof</button>
    </div>
  );
};

export default ProofOfDelivery;
