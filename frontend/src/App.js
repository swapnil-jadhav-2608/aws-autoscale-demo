import React, { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // Use environment variable for the API URL, with a fallback for local development.
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/messages`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      // Sort messages by creation date, newest first
      setMessages(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Could not load messages. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!username || !message) {
      alert("Please enter a username and message.");
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });
      if (!res.ok) {
        throw new Error(`Failed to send message. Status: ${res.status}`);
      }
      setMessage(""); // Clear message input on success
      fetchMessages(); // Refresh the messages list
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
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
        <button onClick={sendMessage} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
      <div style={{ marginTop: 20 }}>
        {loading && <p>Loading messages...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {messages.map((msg) => (
              <li key={msg.id} style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
                <b>{msg.username}</b>: {msg.message}
                <br />
                <small>{new Date(msg.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
