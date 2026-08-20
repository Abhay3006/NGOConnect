import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import PopupModal from "../components/PopupModal"; // ✅ Import custom modal
import "../styles/Auth.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name: fullName,
        email: email,
        password: password,
      });

      setModal({ isOpen: true, type: "success", title: "Account Created", message: "Registration successful! You can now login.", redirect: true });
    } catch (err) {
      console.log(err.response?.data);
      setModal({ isOpen: true, type: "error", title: "Registration Failed", message: err.response?.data?.detail || "Something went wrong." });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.redirect) navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join NGOConnect and start making an impact</p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s5-7 10-7 10 7 10 7-5 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 10c5 6 15 6 20 0"></path>
                <path d="M6.5 14L4 19"></path>
                <path d="M10.5 15.5L9.5 21"></path>
                <path d="M13.5 15.5L14.5 21"></path>
                <path d="M17.5 14L20 19"></path>
              </svg>
            )}
          </button>
        </div>

        <button onClick={handleRegister} className="btn btn-primary full-btn">
          Create Account
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* ✅ Render Modal */}
      <PopupModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}

export default Register;