import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setResponse(data.reply);
    } catch (error) {
      setResponse(`Fehler: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatbox}>
        <h1 style={styles.title}>HRSE Chatbot</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stelle deine Frage..."
            rows="4"
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Absenden</button>
        </form>
        {response && (
          <div style={styles.response}>
            <strong>Antwort:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  chatbox: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "600px",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    padding: "1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #ccc",
    resize: "vertical",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
  },
  response: {
    marginTop: "1.5rem",
    backgroundColor: "#f0f4ff",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #d0e0ff",
    color: "#333",
  },
};

export default App;