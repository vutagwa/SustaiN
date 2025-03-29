import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../essentials/firebase";

const containerStyle = { width: "100%", height: "400px" };
const center = { lat: -1.286389, lng: 36.817223 }; // Nairobi default center

const PickupMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "pickup_requests"));
      setLocations(snapshot.docs.map(doc => doc.data().pickupLocation));
    };

    fetchLocations();
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {locations.map((loc, index) => (
          <Marker key={index} position={{ lat: loc.lat, lng: loc.lng }} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default PickupMap;
