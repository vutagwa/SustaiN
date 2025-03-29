import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../essentials/firebase";

const containerStyle = { width: "100%", height: "400px" };

const LiveTracking = ({ deliveryId }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "deliveries", deliveryId), (doc) => {
      setLocation(doc.data()?.currentLocation);
    });

    return () => unsubscribe();
  }, [deliveryId]);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={location || { lat: -1.286389, lng: 36.817223 }} zoom={12}>
        {location && <Marker position={{ lat: location.lat, lng: location.lng }} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;
