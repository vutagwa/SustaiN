import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"; // Correct imports
import { auth, db, app } from "../essentials/firebase"; // import the app from the firebase config file.

const ChatInterface = ({ recipientId, donorId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  let mediaRecorder;

  const chatId = recipientId < donorId ? `${recipientId}_${donorId}` : `${donorId}_${recipientId}`;
  const storage = getStorage(app); //initialize storage using app.

  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (audioUrl = null) => {
    if (!newMessage.trim() && !audioUrl) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: auth.currentUser.uid,
      text: newMessage || null,
      audioUrl: audioUrl || null,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.stop();
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    const audioRef = ref(storage, `chats/${chatId}/${Date.now()}.webm`);
    await uploadBytes(audioRef, audioBlob);
    const audioUrl = await getDownloadURL(audioRef);
    sendMessage(audioUrl);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.text && <p>{msg.text}</p>}
            {msg.audioUrl && <audio controls src={msg.audioUrl}></audio>}
          </div>
        ))}
      </div>
      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={() => sendMessage()}>Send</button>

      <button onMouseDown={startRecording} onMouseUp={stopRecording}>
        🎤 {recording ? "Recording..." : "Hold to Record"}
      </button>
      {audioBlob && <button onClick={uploadAudio}>Send Voice</button>}
    </div>
  );
};

export default ChatInterface;