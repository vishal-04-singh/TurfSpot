import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/bookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    API.get(`/my-bookings/${user_id}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  };

  const submitReview = (booking_id) => {
    API.post("/review", {
      user_id: user_id,
      turf_id: reviewData.turf_id,
      booking_id: booking_id,
      rating: reviewData.rating,
      comment: reviewData.comment
    })
      .then(() => {
        alert("Review submitted");
        loadBookings();
      })
      .catch(() => {
        alert("Review failed");
      });
  };

  const cancelBooking = (booking_id) => {
    API.post("/cancel", { booking_id })
      .then(res => {
        alert("Cancelled! Refund: ₹" + res.data.refund);
        loadBookings();
      })
      .catch(err => {
        console.error(err);
        alert("Cancel failed");
      });
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <span className="section-label">Your</span>
        <h1 className="feature-heading">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p className="body-large">No bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b.booking_id} className="card booking-card">
              <div className="booking-header">
                <h3 className="sub-heading">{b.turf_name}</h3>
                <span className={`status-badge status-${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>
              
              <div className="booking-details">
                <p className="body-large">
                  <span className="text-silver">Date:</span> {b.booking_datetime}
                </p>
                <p className="body-large">
                  <span className="text-silver">Time:</span> {b.start_time} - {b.end_time}
                </p>
              </div>

              {b.status === "BOOKED" && (
                <button 
                  className="btn btn-dark" 
                  onClick={() => cancelBooking(b.booking_id)}
                >
                  Cancel Booking
                </button>
              )}

              {b.status === "COMPLETED" && (
                <div className="review-section">
                  <span className="section-label">Leave a Review</span>
                  <div className="review-inputs">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Rating (1-5)"
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          rating: e.target.value,
                          booking_id: b.booking_id,
                          turf_id: b.turf_id
                        })
                      }
                    />
                    <input
                      placeholder="Share your experience..."
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          comment: e.target.value
                        })
                      }
                    />
                    <button 
                      className="btn btn-neon" 
                      onClick={() => submitReview(b.booking_id)}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;