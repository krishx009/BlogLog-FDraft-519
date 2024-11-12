import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";
import "../StyleSheets/ContactUs.css";

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', { name, email, feedback, feedbackText });
    // Reset form fields
    setName('');
    setEmail('');
    setFeedback('');
    setFeedbackText('');
    setIsSubmitted(true);
    // Redirect to homepage after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="thank-you-message">
        <h2>Thank you for your feedback!</h2>
        <p>Redirecting you to the homepage...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="contact-page">
      <h1 className="contact-title">Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name<span className='span'>*</span></label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email <span className='span'>*</span></label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedbackText">Your Feedback</label>
          <textarea
            id="feedbackText"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>How was your experience?</label>
          <div className="feedback-options">
            <button
              type="button"
              className={`feedback-button ${feedback === 'great' ? 'selected' : ''}`}
              onClick={() => setFeedback('great')}
            >
              😃 Great
            </button>
            <button
              type="button"
              className={`feedback-button ${feedback === 'okay' ? 'selected' : ''}`}
              onClick={() => setFeedback('okay')}
            >
              😐 Okay
            </button>
            <button
              type="button"
              className={`feedback-button ${feedback === 'poor' ? 'selected' : ''}`}
              onClick={() => setFeedback('poor')}
            >
              😞 Poor
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">Send Message</button>
        <h9><span className='span'>*</span> Fields are Mandatory</h9>
      </form>
    </div>
    </>
  );
}