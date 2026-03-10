import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busId, setBusId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !password || !busId) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
const res = await fetch(`${import.meta.env.VITE_API_URL_AUTH}/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password, bus_id: busId }),
});
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // بدلاً من الـ alert التقليدي، ننتقل مباشرة مع رسالة نجاح (اختياري)
      navigate("/login"); 
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us to manage your trips easily</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Bus ID (Example: B-202)"
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              className="signup-input"
            />
          </div>

          {error && <div className="signup-error-box">{error}</div>}

          <button 
            type="submit" 
            className={`signup-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register Now"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <span className="signup-link" onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}