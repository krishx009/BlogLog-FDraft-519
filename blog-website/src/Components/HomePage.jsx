import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../StyleSheets/HomePage.css";

const topics = [
  { name: "Technology", icon: "💻" },
  { name: "Science", icon: "🔬" },
  { name: "Art", icon: "🎨" },
  { name: "Music", icon: "🎵" },
  { name: "Travel", icon: "✈️" },
  { name: "Food", icon: "🍳" },
  { name: "Lifestyle", icon: "🌿" },
  { name: "Health", icon: "💪" },
  { name: "Education", icon: "📚" },
];

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addListener(handleDarkModeChange);

    return () => darkModeMediaQuery.removeListener(handleDarkModeChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`page-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar showLoginButton={false} />
      <div className="homepage-content">
        <h1 className="page-title">Explore Topics</h1>
        <div className="topic-grid">
          {topics.map((topic, index) => (
            <Link to={`/topic/${topic.name}`} key={index} className="topic-box">
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-name">{topic.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default HomePage;