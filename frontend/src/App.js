import React, { useState, useEffect } from "react";
import { getQuestions, getUniqueTypes } from "./grpcClient";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestions(query, type, 1, 10);
      setQuestions(response.questionsList || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      // Ensure you handle the response structure from getUniqueTypes
      const response = await getUniqueTypes();
      setTypes(response.typesList || []); // Adjust this to match the response
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []); // Fetch unique types only once when the component mounts

  return (
    <div className="App">
      <h1>QuestSearch</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t.type} value={t.type}>
              {t.type} ({t.count})
            </option>
          ))}
        </select>
        <button onClick={fetchQuestions}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length > 0 ? (
        <ul>
          {questions.map((q) => (
            <li key={q.id}>
              <strong>{q.type}</strong>: {q.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
}

export default App;
