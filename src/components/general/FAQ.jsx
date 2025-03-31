import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import { db, collection, addDoc, getDocs, serverTimestamp } from "../essentials/firebase";
import "../styles/FAQ.css";

const FAQ = () => {
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchFAQs = async () => {
      const querySnapshot = await getDocs(collection(db, "faqs"));
      const faqList = querySnapshot.docs.map((doc) => doc.data());
      setFaqs(faqList);
    };
    fetchFAQs();
  }, []);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (question.trim() === "") return;

    await addDoc(collection(db, "faqs"), {
      question,
      createdAt: serverTimestamp(),
    });

    setQuestion("");
    alert("Your question has been submitted!");
  };

  const handleContactUs = (e) => {
    e.preventDefault();
    alert(`Message sent from ${email}: ${message}`);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="faq-container">
      {/* Close Button */}
      <button className="close-btn" onClick={() => navigate("/")}>X</button>

      <h2>❓ FAQ</h2>
      <div className="faq-section">
        {faqs.length === 0 ? (
          <p>No FAQs available yet.</p>
        ) : (
          faqs.map((faq, index) => <p key={index}>{faq.question}</p>)
        )}
      </div>

      <div className="faq-layout">
        <div className="ask-form">
          <h2>Ask a Question</h2>
          <form onSubmit={handleAskQuestion}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question..."
            />
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="contact-form">
          <h2>Contact Us</h2>
          <form onSubmit={handleContactUs}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email..."
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
