import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import "../styles/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateRegister = ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";

    if (password.length < 6) return "Password must be at least 6 characters";

    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateRegister({
      name,
      email,
      password,
      confirmPassword,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password });
      console.log("Registration successful:", res);
      if (res.data.message === "User signed up successfully")
        navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error">{error}</div>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

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

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
