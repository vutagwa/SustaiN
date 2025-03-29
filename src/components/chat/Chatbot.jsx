import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const openai = new OpenAIApi(
    new Configuration({ apiKey: "YOUR_OPENAI_API_KEY" }) // Replace with your API key
  );

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: "user" };
    setMessages([...messages, userMessage]);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You're a helpful food donation assistant." }, { role: "user", content: userInput }],
    });

    const botMessage = { text: response.data.choices[0].message.content, sender: "bot" };
    setMessages([...messages, userMessage, botMessage]);
    setUserInput("");
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </p>
        ))}
      </div>
      <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
