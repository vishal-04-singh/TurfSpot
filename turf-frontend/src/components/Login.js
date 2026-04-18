import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = () => {
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    API.post("/login", { email, password })
      .then(res => {
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/turfs");
        }
      })
      .catch(() => setError("Invalid email or password"));
  };

  return (
    <div className="login-container">

      <div className="login-card">
        <h2>Login</h2>

        {error && <div className="login-error">{error}</div>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;