import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar } from "react-chartjs-2";
import "../styles/admin.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [users, setUsers] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    API.get("/admin/bookings").then(res => setBookings(res.data));
    API.get("/admin/revenue").then(res => setRevenue(res.data.total_revenue || 0));
    API.get("/admin/users").then(res => setUsers(res.data));
    API.get("/admin/turfs").then(res => setTurfs(res.data));
  };

  const updateBookingStatus = (booking_id, status) => {
    API.put(`/admin/booking/${booking_id}/status`, { status })
      .then(() => loadData())
      .catch(err => alert("Update failed"));
  };

  const deleteTurf = (turf_id) => {
    if (window.confirm("Delete this turf?")) {
      API.delete(`/admin/turf/${turf_id}`)
        .then(() => loadData())
        .catch(err => alert("Delete failed"));
    }
  };

  const turfCounts = {};
  bookings.forEach(b => {
    turfCounts[b.turf_name] = (turfCounts[b.turf_name] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(turfCounts),
    datasets: [{
      label: "Bookings",
      data: Object.values(turfCounts),
      backgroundColor: "#faff69",
      borderColor: "#faff69",
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#ffffff" } } },
    scales: {
      x: { ticks: { color: "#a0a0a0" }, grid: { color: "rgba(65, 65, 65, 0.8)" } },
      y: { ticks: { color: "#a0a0a0" }, grid: { color: "rgba(65, 65, 65, 0.8)" } }
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <span className="section-label">Admin</span>
        <h1 className="feature-heading">Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`} onClick={() => setActiveTab("bookings")}>Bookings</button>
        <button className={`tab-btn ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>Users</button>
        <button className={`tab-btn ${activeTab === "turfs" ? "active" : ""}`} onClick={() => setActiveTab("turfs")}>Turfs</button>
      </div>

      {activeTab === "dashboard" && (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <span className="stat-number">₹{revenue}</span>
              <span className="caption">Total Revenue</span>
            </div>
            <div className="card stat-card">
              <span className="stat-number">{bookings.length}</span>
              <span className="caption">Total Bookings</span>
            </div>
            <div className="card stat-card">
              <span className="stat-number">{users.length}</span>
              <span className="caption">Total Users</span>
            </div>
            <div className="card stat-card">
              <span className="stat-number">{turfs.length}</span>
              <span className="caption">Total Turfs</span>
            </div>
          </div>
          <div className="card chart-card">
            <h3 className="sub-heading">Bookings per Turf</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}

      {activeTab === "bookings" && (
        <div className="card">
          <h3 className="sub-heading">All Bookings</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Turf</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.booking_id}>
                    <td>{b.booking_id}</td>
                    <td>{b.user_name}</td>
                    <td>{b.turf_name}</td>
                    <td>{b.booking_datetime?.split("T")[0]}</td>
                    <td>{b.start_time}:00 - {b.end_time}:00</td>
                    <td><span className={`status-badge status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                    <td>
                      {b.status === "BOOKED" && (
                        <>
                          <button className="action-btn success" onClick={() => updateBookingStatus(b.booking_id, "COMPLETED")}>Complete</button>
                          <button className="action-btn danger" onClick={() => updateBookingStatus(b.booking_id, "CANCELLED")}>Cancel</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="card">
          <h3 className="sub-heading">All Users</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td><span className={`role-badge role-${u.role?.toLowerCase()}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "turfs" && (
        <div className="card">
          <h3 className="sub-heading">All Turfs</h3>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price/hr</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {turfs.map(t => (
                  <tr key={t.turf_id}>
                    <td>{t.turf_id}</td>
                    <td>{t.name}</td>
                    <td>{t.location}</td>
                    <td>{t.type}</td>
                    <td>₹{t.price_per_hour}</td>
                    <td><span className={`status-badge status-${t.status?.toLowerCase()}`}>{t.status}</span></td>
                    <td>
                      <button className="action-btn danger" onClick={() => deleteTurf(t.turf_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;