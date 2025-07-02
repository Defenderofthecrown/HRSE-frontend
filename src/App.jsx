import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("https://hrse-chatbot-backend.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: `Fehler: ${error.message}` }]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatbox}>
        <h1 style={styles.title}>HRSE Chatbot</h1>
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.user : styles.bot),
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="3"
            placeholder="Deine Frage …"
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Absenden</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#eef2f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  chatbox: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "95%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  bubble: {
    maxWidth: "75%",
    padding: "0.75rem 1rem",
    borderRadius: "1rem",
    fontSize: "1rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#0070f3",
    color: "#fff",
    borderTopRightRadius: 0,
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    color: "#333",
    borderTopLeftRadius: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  textarea: {
    fontSize: "1rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
};

export default App;
