import React, { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://<LOAD_BALANCER_DNS>/api"; // Replace later

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch {
      console.error("Failed to fetch messages");
    }
  };

  const sendMessage = async () => {
    await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message }),
    });
    setMessage("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>AWS Auto Scaling + DynamoDB Demo</h2>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <b>{msg.username}</b>: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
