import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/book.css";

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [turf, setTurf] = useState(null);

  useEffect(() => {
    if (id) {
      localStorage.setItem("turf_id", id);
      API.get("/turfs").then(res => {
        const found = res.data.find(t => t.turf_id === parseInt(id));
        setTurf(found);
      });
    }
  }, [id]);

  const book = () => {
    if (!data.booking_datetime || !data.start_time || !data.end_time) {
      alert("Please fill all fields");
      return;
    }

    const startHour = parseInt(data.start_time.split(":")[0]);
    const endHour = parseInt(data.end_time.split(":")[0]);

    API.post("/book", {
      user_id: localStorage.getItem("user_id"),
      turf_id: id,
      booking_datetime: data.booking_datetime,
      start_time: startHour,
      end_time: endHour
    })
    .then(res => {

      navigate("/my-bookings");
    })
    .catch(err => {
      console.error("Booking error:", err);
      alert(err.response?.data || err.message || "Booking failed");
    });
  };

  return (
    <div className="book-page">
      <div className="page-header">
        <span className="section-label">Book</span>
        <h1 className="feature-heading">{turf?.name || "Turf"}</h1>
        {turf && <p className="body-large">📍 {turf.location} • ₹{turf.price_per_hour}/hr</p>}
      </div>

      <div className="book-form card">
        <label>Date</label>
        <input 
          type="date"
          onChange={e => setData({...data, booking_datetime: e.target.value})}
        />

        <label>Start Time</label>
        <input 
          type="time"
          onChange={e => setData({...data, start_time: e.target.value})}
        />

        <label>End Time</label>
        <input 
          type="time"
          onChange={e => setData({...data, end_time: e.target.value})}
        />

        <button className="btn btn-neon" onClick={book}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default Book;