import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Register() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const register = () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    API.post("/register", form)
      .then(() => {
        alert("Registered Successfully");
        navigate("/login");
      })
      .catch(() => setError("Registration failed. Try a different email."));
  };

  return (
    <div className="login-container">

      <div className="login-card">
        <h2>Sign Up</h2>

        {error && <div className="login-error">{error}</div>}

        <label>Name</label>
        <input
          placeholder="Enter your name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
        />

        <label>Role</label>
        <select
          className="role-select"
          value={form.role || "CUSTOMER"}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button onClick={register}>Sign Up</button>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>

    </div>
  );
}

export default Register;