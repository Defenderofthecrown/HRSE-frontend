// src/App.jsx
import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.PROD
    ? 'https://hrse-chatbot-backend.onrender.com'
    : 'http://localhost:3000';

  const sendMessage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Antwort vom Server war nicht erfolgreich.');
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">HRSE Chatbot</h1>
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="4"
          placeholder="Stelle eine Frage an den Chatbot..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Wird gesendet...' : 'Absenden'}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-800">
            Fehler: {error}
          </div>
        )}
        {response && !error && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-gray-800">
            <strong>Antwort:</strong> {response}
          </div>
        )}
      </div>
    </div>
  );
}
