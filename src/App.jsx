import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://hrse-chatbot-backend.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse(`Fehler: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>HRSE Chatbot</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Was möchtest du wissen?"
        />
        <br />
        <button type="submit">Absenden</button>
      </form>
      <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{response}</p>
    </div>
  );
}

export default App;