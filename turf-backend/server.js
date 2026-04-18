const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Turf Management Backend Running 🚀");
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

app.post("/test-user", (req, res) => {
  const sql = "INSERT INTO USERS (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, ["Test User", "test@example.com", "1234567890", "password123"], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Test user created");
  });
});

app.post("/create-test-users", (req, res) => {
  const users = [
    ["John Doe", "john@example.com", "9876543210", "john123"],
    ["Jane Smith", "jane@example.com", "9876543211", "jane123"],
    ["Admin User", "admin@turf.com", "9876543212", "admin123"]
  ];
  
  const sql = "INSERT INTO USERS (name, email, phone, password) VALUES (?, ?, ?, ?)";
  
  users.forEach(user => {
    db.query(sql, user, (err, result) => {});
  });
  
  db.query("SELECT user_id, name, email, role FROM USERS", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get("/turfs", (req, res) => {
  db.query("SELECT * FROM TURF", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching turfs ❌");
    }
    res.json(result);
  });
});
app.post("/register", (req, res) => {
    const { name, email, phone, password, role } = req.body;
  
    const sql = "INSERT INTO USERS (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)";
  
    db.query(sql, [name, email, phone, password, role || "CUSTOMER"], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("User Registered ✅");
      }
    });
  });

  app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM USERS WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.post("/book", (req, res) => {
    const { user_id, turf_id, booking_datetime, start_time, end_time } = req.body;
  
    if (start_time >= end_time) {
        return res.status(400).send("Invalid time slot ❌");
      }
    // Step 1: Check double booking
    const checkSql = `
      SELECT * FROM BOOKING 
      WHERE turf_id = ? 
      AND DATE(booking_datetime) = DATE(?)
      AND (
        (start_time < ? AND end_time > ?) 
      )
      AND status = 'BOOKED'
    `;
  
    db.query(checkSql, [turf_id, booking_datetime, end_time, start_time], (err, result) => {
      if (result.length > 0) {
        return res.status(400).send("Slot already booked ❌");
      }
  
      // Step 2: Get turf price
      db.query("SELECT price_per_hour FROM TURF WHERE turf_id = ?", [turf_id], (err, turfData) => {
        let basePrice = turfData[0].price_per_hour;
  
        let bookingDate = new Date(booking_datetime);
        let formattedDate = bookingDate.toISOString().slice(0, 19).replace("T", " ");
        let day = bookingDate.getDay(); // 0 = Sunday
  
        let multiplier = 1;
  
        // Weekend pricing
        if (day === 0 || day === 6) multiplier = 2;
  
        // Rush hour pricing
        if (start_time >= 17 && start_time <= 22) multiplier += 0.5;
  
        let hours = end_time - start_time;
        let finalPrice = basePrice * multiplier * hours;
  
        // Step 3: Insert booking
        const insertSql = `
          INSERT INTO BOOKING 
          (user_id, turf_id, booking_datetime, start_time, end_time) 
          VALUES (?, ?, ?, ?, ?)
        `;
  
        db.query(insertSql, [user_id, turf_id, booking_datetime, start_time, end_time], (err, bookingResult) => {
  
          // Step 4: Insert payment
          const paymentSql = `
            INSERT INTO PAYMENT (booking_id, amount, payment_status)
            VALUES (?, ?, 'PAID')
          `;
  
          db.query(paymentSql, [bookingResult.insertId, finalPrice]);
  
          res.json({
            message: "Booking successful ✅",
            price: finalPrice
          });
        });
      });
    });
  });

  app.post("/review", (req, res) => {
    const { user_id, turf_id, booking_id, rating, comment } = req.body;
  
    // Step 1: Check if booking is completed
    const checkSql = `
      SELECT * FROM BOOKING 
      WHERE booking_id = ? 
      AND user_id = ? 
      AND status = 'COMPLETED'
    `;
  
    db.query(checkSql, [booking_id, user_id], (err, result) => {
      if (result.length === 0) {
        return res.status(400).send("You can only review after playing ❌");
      }
  
      // Step 2: Insert review
      const insertSql = `
        INSERT INTO REVIEWS (user_id, turf_id, booking_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      db.query(insertSql, [user_id, turf_id, booking_id, rating, comment], (err) => {
        if (err) {
          return res.status(500).send("Already reviewed or error ❌");
        }
  
        res.send("Review added ✅");
      });
    });
  });

  app.get("/reviews/:turf_id", (req, res) => {
    const turf_id = req.params.turf_id;
  
    const sql = `
      SELECT U.name, R.rating, R.comment
      FROM REVIEWS R
      JOIN USERS U ON R.user_id = U.user_id
      WHERE R.turf_id = ?
    `;
  
    db.query(sql, [turf_id], (err, result) => {
      res.json(result);
    });
  });

  app.post("/cancel", (req, res) => {
    const { booking_id } = req.body;
  
    // Get booking + payment
    const sql = `
      SELECT B.booking_datetime, P.amount, P.payment_id
      FROM BOOKING B
      JOIN PAYMENT P ON B.booking_id = P.booking_id
      WHERE B.booking_id = ?
    `;
  
    db.query(sql, [booking_id], (err, result) => {
      const booking = result[0];
  
      let bookingTime = new Date(booking.booking_datetime);
      let now = new Date();
  
      let diffHours = (bookingTime - now) / (1000 * 60 * 60);
  
      let refundAmount = 0;
  
      if (diffHours > 24) refundAmount = booking.amount * 0.75;
      else if (diffHours > 12) refundAmount = booking.amount * 0.5;
      else if (diffHours > 6) refundAmount = booking.amount * 0.25;
  
      // Update booking
      db.query("UPDATE BOOKING SET status='CANCELLED' WHERE booking_id = ?", [booking_id]);
  
      // Insert refund
      db.query(
        "INSERT INTO REFUND (payment_id, refund_amount, refund_status) VALUES (?, ?, 'PROCESSED')",
        [booking.payment_id, refundAmount]
      );
  
      res.json({
        message: "Booking cancelled",
        refund: refundAmount
      });
    });
  });

  app.post("/complete-booking", (req, res) => {
    const { booking_id } = req.body;
  
    const sql = "UPDATE BOOKING SET status='COMPLETED' WHERE booking_id = ?";
  
    db.query(sql, [booking_id], (err, result) => {
        if (err) {
          console.error("DB ERROR:", err);   // 👈 ADD THIS
          return res.status(500).send("Error updating booking ❌");
        }
      if (result.affectedRows === 0) {
        return res.status(404).send("Booking not found ❌");
      }
  
      res.send("Booking marked as completed ✅");
    });
  });

  app.get("/my-bookings/:user_id", (req, res) => {
    const user_id = req.params.user_id;
  
    const sql = `
      SELECT B.booking_id, B.turf_id, T.name AS turf_name, B.booking_datetime, 
             B.start_time, B.end_time, B.status
      FROM BOOKING B
      JOIN TURF T ON B.turf_id = T.turf_id
      WHERE B.user_id = ?
    `;
  
    db.query(sql, [user_id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });

  app.get("/admin/bookings", (req, res) => {
    const sql = `
      SELECT B.booking_id, U.name AS user_name, T.name AS turf_name,
             B.booking_datetime, B.start_time, B.end_time, B.status
      FROM BOOKING B
      JOIN USERS U ON B.user_id = U.user_id
      JOIN TURF T ON B.turf_id = T.turf_id
    `;
  
    db.query(sql, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });

  app.get("/admin/revenue", (req, res) => {
    const sql = `
      SELECT SUM(amount) AS total_revenue
      FROM PAYMENT
      WHERE payment_status = 'PAID'
    `;
  
    db.query(sql, (err, result) => {
      res.json(result[0]);
    });
  });

  app.get("/admin/refunds", (req, res) => {
    const sql = `
      SELECT R.refund_id, P.amount, R.refund_amount, R.refund_status
      FROM REFUND R
      JOIN PAYMENT P ON R.payment_id = P.payment_id
    `;
  
    db.query(sql, (err, result) => {
      res.json(result);
    });
  });

  app.post("/admin/add-turf", (req, res) => {
    const { name, location, type, price } = req.body;
  
    const sql = `
      INSERT INTO TURF (name, location, type, price_per_hour)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(sql, [name, location, type, price], (err) => {
      if (err) return res.status(500).send(err);
      res.send("Turf added ✅");
    });
  });

  app.get("/admin/users", (req, res) => {
    const sql = "SELECT user_id, name, email, phone, role FROM USERS";
    db.query(sql, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });

  app.get("/admin/turfs", (req, res) => {
    const sql = "SELECT * FROM TURF";
    db.query(sql, (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });

  app.put("/admin/booking/:id/status", (req, res) => {
    const { status } = req.body;
    const booking_id = req.params.id;
    const sql = "UPDATE BOOKING SET status = ? WHERE booking_id = ?";
    db.query(sql, [status, booking_id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Status updated ✅");
    });
  });

  app.delete("/admin/turf/:id", (req, res) => {
    const turf_id = req.params.id;
    const sql = "DELETE FROM TURF WHERE turf_id = ?";
    db.query(sql, [turf_id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Turf deleted ✅");
    });
  });