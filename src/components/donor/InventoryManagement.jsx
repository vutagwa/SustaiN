import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../essentials/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/inventory.css';

const InventoryManagement = () => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [pickupSchedule, setPickupSchedule] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [donorId, setDonorId] = useState('');

  // ✅ Get Donor ID on Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setDonorId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch Donor's Inventory in Real-time
  const fetchFoodItems = async () => {
    const q = query(collection(db, 'food_inventory'), where('donor_id', '==', donorId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFoodItems(items);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (donorId) fetchFoodItems();
  }, [donorId]);

  // ✅ Handle Add or Edit Food Item
  const handleAddFood = async (e) => {
    e.preventDefault();

    let photoUrl = '';

    // ✅ Upload to Firebase Storage
    if (photo) {
      const storageRef = ref(storage, `food_photos/${donorId}/${photo.name}`);
      const snapshot = await uploadBytes(storageRef, photo);
      photoUrl = await getDownloadURL(snapshot.ref);
    }

    const foodData = {
      food_name: foodName,
      quantity: parseInt(quantity),
      expiry_date: new Date(expiryDate),
      photo_url: photoUrl,
      pickup_schedule: new Date(pickupSchedule),
      donor_id: donorId,
      status: 'available',  
      createdAt: serverTimestamp()
    };

    if (editingId) {
      const foodRef = doc(db, 'food_inventory', editingId);
      await updateDoc(foodRef, foodData);
      setEditingId(null);
    } else {
      // ✅ Add to Firestore
      await addDoc(collection(db, 'food_inventory'), foodData);

      // ✅ Trigger Notification to Recipients
      await addDoc(collection(db, 'notifications'), {
        message: 'New food donation available in your area.',
        userId: donorId,
        type: 'alert',
        read: false,
        createdAt: serverTimestamp()
      });
    }

    resetForm();
  };

  // ✅ Handle Edit Food
  const handleEdit = (item) => {
    setFoodName(item.food_name);
    setQuantity(item.quantity);
    setExpiryDate(item.expiry_date.toDate().toISOString().split('T')[0]);
    setPickupSchedule(item.pickup_schedule.toDate().toISOString());
    setEditingId(item.id);
  };

  // ✅ Handle Delete Food
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'food_inventory', id));
  };

  // ✅ Reset Form After Adding or Editing
  const resetForm = () => {
    setFoodName('');
    setQuantity('');
    setExpiryDate('');
    setPhoto(null);
    setPickupSchedule('');
    setEditingId(null);
  };

  return (
    <div className="inventory-management">
      <h2>Manage Your Food Inventory</h2>

      {/* ✅ Add Food Form */}
      <form onSubmit={handleAddFood} className="food-form">
        <input type="text" placeholder="Food Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <input type="datetime-local" value={pickupSchedule} onChange={(e) => setPickupSchedule(e.target.value)} required />
        <button type="submit">{editingId ? 'Update Food' : 'Add Food'}</button>
      </form>

      {/* ✅ Display Food Inventory */}
      <div className="food-list">
        {foodItems.map(item => (
          <div key={item.id} className="food-item">
            <h4>{item.food_name}</h4>
            <p>Quantity: {item.quantity}</p>
            <p>Expiry: {new Date(item.expiry_date.toDate()).toDateString()}</p>
            <p>Pickup: {new Date(item.pickup_schedule.toDate()).toLocaleString()}</p>
            {item.photo_url && <img src={item.photo_url} alt="Food" className="food-image" />}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryManagement;
