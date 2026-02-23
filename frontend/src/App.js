import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchTickets = async () => {
    const res = await axios.get(`${API}/tickets/`);
    setTickets(res.data);
  };

  const fetchStats = async () => {
    const res = await axios.get(`${API}/tickets/stats/`);
    setStats(res.data);
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const classifyTicket = async () => {
    if (!description) return;

    const res = await axios.post(`${API}/tickets/classify/`, {
      description,
    });

    setCategory(res.data.category);
    setPriority(res.data.priority);
  };

  const submitTicket = async () => {
    await axios.post(`${API}/tickets/`, {
      title,
      description,
      category,
      priority,
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("");

    fetchTickets();
    fetchStats();
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Support Ticket System</h1>

      <h2>Create Ticket</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <button onClick={classifyTicket}>Auto Classify</button>
      <br /><br />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      />
      <br /><br />

      <button onClick={submitTicket}>Submit</button>

      <hr />

      <h2>Tickets</h2>
      {tickets.map((ticket) => (
        <div key={ticket.id}>
          <strong>{ticket.title}</strong> - {ticket.category} - {ticket.priority}
        </div>
      ))}

      <hr />

      <h2>Stats</h2>
      {stats && (
        <div>
          <p>Total: {stats.total_tickets}</p>
          <p>Open: {stats.open_tickets}</p>
          <p>Avg/day: {stats.average_tickets_per_day}</p>
        </div>
      )}
    </div>
  );
}

export default App;