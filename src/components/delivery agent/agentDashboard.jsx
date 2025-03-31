import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore"; // Import query and where
import { db, auth } from "../essentials/firebase"; // import auth
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/agent.css";

const containerStyle = { width: "100%", height: "300px" };

const DeliveryDashboard = () => { // remove agentId from props
  const [deliveries, setDeliveries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: -1.286389, lng: 36.817223 }); // Default to Nairobi
  const [selectedSection, setSelectedSection] = useState("delivery-list");
  const user = auth.currentUser; // get current user

  useEffect(() => {
    const fetchDeliveries = async () => {
      if(user){
        const q = query(collection(db, "deliveries"), where("agentId", "==", user.uid)); // query firestore
        const snapshot = await getDocs(q);
        const deliveryList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setDeliveries(deliveryList);
        if (deliveryList.length > 0 && deliveryList[0].pickupLocation) {
          setMapCenter(deliveryList[0].pickupLocation);
        }
      }
    };

    fetchDeliveries();
  }, [user]);

  const updateStatus = async (deliveryId, newStatus) => {
    await updateDoc(doc(db, "deliveries", deliveryId), { status: newStatus });
    alert(`Delivery marked as ${newStatus}`);
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
      )
    );
  };

  return (
    <div className="agent-dashboard">
      {/* Sidebar */}
      <nav className="sidebar">
        <h3>sustaiN!</h3>
        <ul>
          <li onClick={() => setSelectedSection("delivery-list")}>📦 Delivery List</li>
          <li onClick={() => setSelectedSection("proof-of-delivery")}>📷 Proof of Delivery</li>
          <li onClick={() => setSelectedSection("faq")}>❓ FAQ</li>
          <li onClick={() => setSelectedSection("notifications")}>🔔 Notifications</li>
          <li onClick={() => setSelectedSection("settings")}>⚙️ Settings</li>
          <li className="logout" onClick={() => alert("Logging out...")}>🚪 Logout</li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {selectedSection === "delivery-list" && (
          <div className="delivery-dashboard">
            <h2>🚚 Delivery List</h2>
            
            {/* Google Maps Live Tracking */}
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
                {deliveries.map((delivery) => (
                  <Marker key={delivery.id} position={delivery.pickupLocation} />
                ))}
              </GoogleMap>
            </LoadScript>

            {/* Delivery List */}
            <div className="delivery-list">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="delivery-card">
                  <p><strong>Pickup:</strong> {JSON.stringify(delivery.pickupLocation)}</p>
                  <p><strong>Drop-off:</strong> {JSON.stringify(delivery.dropoffLocation)}</p>
                  <p><strong>Status:</strong> {delivery.status}</p>

                  {delivery.status === "scheduled" && (
                    <button className="start-btn" onClick={() => updateStatus(delivery.id, "in transit")}>
                      Start Delivery
                    </button>
                  )}
                  {delivery.status === "in transit" && (
                    <button className="complete-btn" onClick={() => updateStatus(delivery.id, "delivered")}>
                      Mark as Delivered
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSection === "proof-of-delivery" && (
          <div className="proof-of-delivery">
            <h2>📷 Proof of Delivery</h2>
            <p>Feature to upload proof (photo/signature) coming soon!</p>
          </div>
        )}

        {selectedSection === "faq" && (
          <div className="faq-section">
            <h2>❓ FAQ</h2>
            <p>Frequently Asked Questions will be displayed here.</p>
          </div>
        )}

        {selectedSection === "notifications" && (
          <div className="notifications">
            <h2>🔔 Notifications</h2>
            <p>You will receive notifications about new deliveries here.</p>
          </div>
        )}

        {selectedSection === "settings" && (
          <div className="settings">
            <h2>⚙️ Settings</h2>
            <p>Settings panel coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
