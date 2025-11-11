import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateLogin = (email, password) => {
    if (!email || !password) return "Email and password are required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";

    if (password.length < 6) return "Password must be at least 6 characters";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const { data, accessToken } = res.data;

      login({ userData: data, token: accessToken });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error">{error}</div>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
