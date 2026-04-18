import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/turfs.css";

function Turfs() {
  const [turfs, setTurfs] = useState([]);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    API.get("/turfs").then((res) => {
      setTurfs(res.data);

      res.data.forEach((turf) => {
        API.get(`/reviews/${turf.turf_id}`).then((r) => {
          setReviews((prev) => ({
            ...prev,
            [turf.turf_id]: r.data,
          }));
        });
      });
    });
  }, []);

  return (
    <div className="turfs-page">
      <div className="page-header">
        <span className="section-label">Browse</span>
        <h1 className="feature-heading">Available Turfs</h1>
      </div>

      {turfs.length === 0 ? (
        <div className="empty-state">
          <p className="body-large">No turfs available at the moment.</p>
        </div>
      ) : (
        <div className="turfs-grid">
          {turfs.map((t) => (
            <div key={t.turf_id} className="card turf-card">
              <div className="turf-header">
                <h3 className="sub-heading">{t.name}</h3>
                <span className="turf-price">₹{t.price_per_hour}<span className="caption">/hr</span></span>
              </div>
              
              <p className="body-large turf-location">📍 {t.location}</p>
              
              <div className="turf-reviews">
                <span className="section-label">Reviews</span>
                {reviews[t.turf_id]?.length > 0 ? (
                  <div className="reviews-list">
                    {reviews[t.turf_id].map((r, index) => (
                      <div key={index} className="review-item">
                        <span className="review-rating">⭐ {r.rating}</span>
                        <span className="review-comment">"{r.comment}"</span>
                        <span className="review-author caption">- {r.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="caption">No reviews yet</p>
                )}
              </div>
              
              <Link to={`/book/${t.turf_id}`} className="btn btn-forest">
                Book Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Turfs;