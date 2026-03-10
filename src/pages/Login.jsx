// Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // ملف CSS منفصل

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
const API_URL = import.meta.env.VITE_API_URL_AUTH;

const res = await fetch(`${API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Server error");
        return;
      }

      localStorage.setItem("token", data.token);
      setMsg("✅ Logged in!");
      navigate("/home"); // توجيه لصفحة Home بعد تسجيل الدخول
    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        {msg && <p>{msg}</p>}
        <p>New? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}