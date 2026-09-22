import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/users/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      const token = response.data.token;

      if (!token) {
        setError(
          "Login failed. Token was not received."
        );
        return;
      }

      login(token);

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Invalid email or password."
        );
      } else if (
        error.response?.data?.message
      ) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Shop<span>Ease</span>
        </div>

        <h1>
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to continue shopping with
          ShopEase.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}

          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;