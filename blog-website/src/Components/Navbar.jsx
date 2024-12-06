import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "../StyleSheets/Navbar.css";


export default function Navbar({ showLoginButton }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        Blogger Spotted 
      </Link>      <div className="navbar-links">
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
