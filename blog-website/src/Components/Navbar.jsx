import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../StyleSheets/Navbar.css";
import ContactPage from "./ContactUs";

export default function Navbar({ showLoginButton }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        BlogWebsite
      </Link>
      <div className="navbar-links">
        <div 
          className="navbar-link features-dropdown"
          onMouseEnter={() => setShowFeatures(true)}
          onMouseLeave={() => setShowFeatures(false)}
        >
          Features
          {showFeatures && (
            <div className="features-content">
              <p>✓ You Can Read blogs without a User-Account ✌️😁</p>
              <p>✓ If You Want To Write blogs You Should Log-in With Your User Account😉🤞</p>
              <p>✓ 😌You Can Edit and Delete Your Own Blogs in Your Profile😁</p>
              <p>✓ 🤠AI-powered content enhancement</p>
              <p>✓ 😋AI blog summarization</p>
              <p>🔐Your Details are Hidden for Security Reasons🪪</p> 
              <p>✓ If You Have Read it Upto here You Are a Genius 🤓</p>
              <p>Please Leave Us a Feedback in the Contact Page</p> 
            </div>
          )}
        </div>
        <Link to="/contact" className="navbar-link">
          Contact
        </Link>
        {showLoginButton &&
          (user ? (
            <>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button onClick={logout} className="navbar-link">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="navbar-link">
              Login
            </button>
          ))}
      </div>
    </nav>
  );
}