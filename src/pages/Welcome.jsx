import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          {/* أيقونة بسيطة تعبر عن المجتمع أو التنقل */}
          <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#0984e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>

        <h1 className="welcome-title">Safe Journey Community</h1>
        <p className="welcome-description">
          Welcome to our community! We help you manage and track your trips with ease and safety.
        </p>

        <div className="welcome-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/login")}
          >
            Login to Account
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/signup")}
          >
            Join Us Now
          </button>
        </div>

        <footer className="welcome-footer">
          <p>© 2026 Community Service Portal</p>
        </footer>
      </div>
    </div>
  );
}