import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API = "http://localhost:8000/api";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API}/tickets/classify/`, {
        description,
      });
      setCategory(res.data.category);
      setPriority(res.data.priority);
    } catch (err) {
      setError("Classification failed.");
    } finally {
      setLoading(false);
    }
  };

  const submitTicket = async () => {
    try {
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
    } catch (err) {
      setError("Failed to submit ticket.");
    }
  };

  const deleteTicket = async (id) => {
    try {
      await axios.delete(`${API}/tickets/${id}/`);
      fetchTickets();
      fetchStats();
    } catch (err) {
      setError("Failed to delete ticket.");
    }
  };

  const chartData = stats
    ? {
        labels: ["Total Tickets", "Open Tickets"],
        datasets: [
          {
            label: "Tickets",
            data: [stats.total_tickets, stats.open_tickets],
            backgroundColor: ["#007bff", "#28a745"],
          },
        ],
      }
    : null;

  return (
    <div className="container">
      <h1>AI Support Ticket System</h1>

      {/* Create Ticket Card */}
      <div className="card">
        <h2>Create Ticket</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button onClick={classifyTicket} disabled={loading}>
          {loading ? "Classifying..." : "Auto Classify"}
        </button>

        <button className="submit" onClick={submitTicket}>
          Submit Ticket
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {/* Tickets List */}
      <div className="card">
        <h2>Tickets</h2>

        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket">
            <div className="ticket-header">
              <strong>{ticket.title}</strong>
              <button
                className="delete"
                onClick={() => deleteTicket(ticket.id)}
              >
                Delete
              </button>
            </div>

            <p>{ticket.description}</p>

            <span>{ticket.category}</span> |{" "}
            <span>{ticket.priority}</span>
          </div>
        ))}
      </div>

      {/* Statistics + Chart */}
      {stats && (
        <div className="card">
          <h2>Statistics</h2>

          <Bar data={chartData} />

          <p>Total Tickets: {stats.total_tickets}</p>
          <p>Open Tickets: {stats.open_tickets}</p>
          <p>Average per Day: {stats.average_tickets_per_day}</p>
        </div>
      )}
    </div>
  );
}

export default App;