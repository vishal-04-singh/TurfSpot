import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Turfs from "./components/Turfs";
// import Book from "./components/Book";
// import MyBookings from "./components/MyBookings";
// import AdminDashboard from "./components/AdminDashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Turfs from "./components/Turfs";
import Book from "./components/Book";
import AdminDashboard from "./components/AdminDashboard";
import MyBookings from "./components/MyBookings";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />   {/* 👈 always visible */}
      
      {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/turfs" element={<Turfs />} />
        <Route path="/book" element={<Book />} />
      </Routes> */}

<Routes>
  <Route path="/" element={<Home />} />         
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/turfs" element={<Turfs />} />
  <Route path="/book/:id" element={<Book />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/my-bookings" element={<MyBookings />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;