import { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, serverTimestamp } from '../essentials/firebase';
import '../styles/FAQ.css';

const FAQ = () => {
  const [question, setQuestion] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch FAQs from Firestore
  const fetchFAQs = async () => {
    const querySnapshot = await getDocs(collection(db, 'faqs'));
    const faqList = querySnapshot.docs.map(doc => doc.data());
    setFaqs(faqList);
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Handle Ask a Question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (question.trim() === '') return;

    await addDoc(collection(db, 'faqs'), {
      question,
      createdAt: serverTimestamp()
    });

    setQuestion('');
    fetchFAQs(); // Refresh FAQs
  };

  // Handle Contact Us
  const handleContactUs = (e) => {
    e.preventDefault();
    alert(`Message from ${email}: ${message}`);
    setEmail('');
    setMessage('');
  };

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-section">
        {faqs.map((faq, index) => (
          <p key={index}>{faq.question}</p>
        ))}
      </div>

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
  );
};

export default FAQ;
