import { useEffect, useRef, useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat-messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem("chat-username") || "");
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "bot", text: "Willkommen beim HRSE Chatbot. Wie heisst du?" }]);
    }
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e, overrideText) => {
    e.preventDefault();
    const question = overrideText || input.trim();
    if (!question) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setLoading(true);
    setSuggestions([]);

    if (!name) {
      localStorage.setItem("chat-username", question);
      setName(question);
      const reply = `Hallo ${question}, wie kann ich dich im HR unterstützen?`;
      setMessages([...newMessages, { role: "bot", text: reply }]);
      setLoading(false);
      speak(reply);
      return;
    }

    try {
      const res = await fetch("https://hrse-chatbot-backend.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });

      if (!res.ok) throw new Error("Fehler beim Server");
      const data = await res.json();

      const reply = `Okay, ${name}. ${data.reply}`;
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setSuggestions(data.suggestions?.slice(0, 3) || []);
      speak(reply);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: `Fehler: ${err.message}` }]);
    }
    setLoading(false);
  };

  const toggleDark = () => setDarkMode(!darkMode);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: darkMode ? "#1e1e1e" : "#eef2f8",
    color: darkMode ? "#eee" : "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: 600, padding: 20 }}>
        <h1 style={{ textAlign: "center" }}>
          {darkMode ? "🌙 " : "☀️ "}HR-Profi Jürg
          <button onClick={toggleDark} style={{ float: "right" }}>🌓</button>
        </h1>
        <div style={{
          height: "70vh",
          overflowY: "auto",
          background: darkMode ? "#2c2c2c" : "#fff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.role === "user" ? "#0070f3" : darkMode ? "#444" : "#e0e0e0",
                color: msg.role === "user" ? "#fff" : darkMode ? "#fff" : "#000",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                maxWidth: "75%",
                whiteSpace: "pre-wrap"
              }}>
              {msg.text}
              {msg.role === "bot" && (
                <div style={{ marginTop: 5 }}>
                  <button style={{ marginRight: 5 }}>👍</button>
                  <button>👎</button>
                </div>
              )}
            </div>
          ))}
          {loading && <div>🤖 schreibt …</div>}
          <div ref={scrollRef} />
        </div>

        {suggestions.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={(e) => handleSubmit(e, s)}
                style={{ marginRight: 5, marginBottom: 5 }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Stelle deine Frage …"
            style={{ padding: 10, fontSize: "1rem", borderRadius: 5 }}
          />
          <button type="submit" style={{ padding: 10, fontSize: "1rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: 5 }}>
            Absenden
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;