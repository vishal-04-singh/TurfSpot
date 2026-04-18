# TurfSpot - Turf Management System

A full-stack turf booking management application with dark/light theme support.

## Features

- **User Authentication** - Register/Login with role-based access (Admin/Customer)
- **Turf Booking** - Browse and book available turfs
- **Booking Management** - View, cancel, and review completed bookings
- **Admin Dashboard** - Manage bookings, users, and turfs with analytics
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React, React Router, Chart.js
- **Backend**: Node.js, Express, MySQL
- **Styling**: Custom CSS with CSS variables (ClickHouse-inspired design)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL

### Setup

1. **Clone and install dependencies:**
```bash
cd turf-frontend
npm install

cd ../turf-backend
npm install
```

2. **Configure database:**
- Create MySQL database `turf_management`
- Create `turf-backend/.env` with your MySQL credentials:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=turf_management
```
- If your local MySQL user is not `root`, update `DB_USER` accordingly.

3. **Create tables:**
```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(100),
  role ENUM('ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER'
);

CREATE TABLE turf (
  turf_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(200),
  type VARCHAR(50),
  price_per_hour DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE booking (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  turf_id INT,
  booking_datetime DATETIME,
  start_time INT,
  end_time INT,
  status ENUM('BOOKED', 'COMPLETED', 'CANCELLED') DEFAULT 'BOOKED',
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (turf_id) REFERENCES turf(turf_id)
);

CREATE TABLE payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  amount DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'PAID',
  FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
);

CREATE TABLE reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  turf_id INT,
  booking_id INT,
  rating INT,
  comment TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (turf_id) REFERENCES turf(turf_id),
  FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
);
```

4. **Seed turfs (optional):**
```sql
INSERT INTO turf (name, location, type, price_per_hour) VALUES
('Green Valley Turf', 'Dehradun - Rajpur Road', 'Football', 1200),
('Champion Cricket Ground', 'Dehradun - Prem Nagar', 'Cricket', 1500),
('Urban Kick Arena', 'Dehradun - ISBT Area', 'Football', 1000);
```

### Run the Project

1. **Start backend:**
```bash
cd turf-backend
node server.js
```
Backend runs on: http://localhost:5001

2. **Start frontend:**
```bash
cd turf-frontend
npm start
```
Frontend runs on: http://localhost:3000

## API Endpoints

### Auth
- `POST /register` - Register new user
- `POST /login` - Login user

### Turfs
- `GET /turfs` - Get all turfs
- `GET /reviews/:turf_id` - Get turf reviews

### Bookings
- `POST /book` - Create booking
- `GET /my-bookings/:user_id` - Get user bookings
- `POST /cancel` - Cancel booking
- `POST /review` - Add review

### Admin
- `GET /admin/bookings` - All bookings
- `GET /admin/revenue` - Total revenue
- `GET /admin/users` - All users
- `GET /admin/turfs` - All turfs
- `PUT /admin/booking/:id/status` - Update booking status
- `DELETE /admin/turf/:id` - Delete turf
- `POST /admin/add-turf` - Add new turf

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@gmail.com | admin123 |
| CUSTOMER | john@example.com | john123 |

## Design System

### Colors (Dark Mode)
- Background: `#000000`
- Card: `#141414`
- Border: `rgba(65, 65, 65, 0.8)`
- Accent: `#faff69` (Neon Volt)
- Secondary: `#166534` (Forest Green)

### Colors (Light Mode)
- Background: `#ffffff`
- Card: `#ffffff`
- Border: `rgba(0, 0, 0, 0.1)`
- Accent: `#166534` (Forest Green)

## Project Structure

```
Truf_Management_System/
├── turf-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Book.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── MyBookings.js
│   │   │   ├── Navbar.js
│   │   │   ├── Register.js
│   │   │   └── Turfs.js
│   │   ├── styles/
│   │   │   ├── admin.css
│   │   │   ├── bookings.css
│   │   │   ├── book.css
│   │   │   ├── home.css
│   │   │   ├── login.css
│   │   │   ├── navbar.css
│   │   │   └── turfs.css
│   │   ├── services/api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── turf-backend/
│   ├── db.js
│   ├── server.js
│   └── package.json
└── README.md
```

## License

MIT# TurfSpot
