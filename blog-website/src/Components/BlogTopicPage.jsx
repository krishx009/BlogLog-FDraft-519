import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import NewBlogPost from "./NewBlogPost";
import { useAuth } from "../AuthContext";
import "../StyleSheets/BlogTopicPage.css";

const API_URL = "http://localhost:5000/api";
const BlogTopicPage = () => {
  const { topic } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false); 
  const { user } = useAuth();
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [topic]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/topic/${topic}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs. Please try again later.");
    }
  };

  const addNewBlog = async (blogData) => {
    try {
      await axios.post(
        `${API_URL}/blogs`,
        { ...blogData, topic },
        { withCredentials: true }
      );
      fetchBlogs();
      setShowNewPostForm(false);
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create a new blog. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const summarizeBlog = async (blogId, content) => {
    setLoading(true);
    try {
      const summaryResponse = await axios.post(`${API_URL}/ai/summarize`, {
        text: content,
      });
      setSummaries((prev) => ({
        ...prev,
        [blogId]: summaryResponse.data.summary,
      }));
    } catch (error) {
      console.error("Error summarizing blog:", error);
      alert("Failed to summarize the blog.");
    } finally {
      setLoading(false);
    }
  };  

  const clearSummary = (blogId) => {
    setSummaries((prev) => {
      const newSummaries = { ...prev };
      delete newSummaries[blogId];
      return newSummaries;
    });
  };

  // New function to handle chat interactions
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        prompt: chatInput,
      });
      const botMessage = { role: "assistant", content: response.data.response };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      alert("Failed to get a response from the chatbot. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar showLoginButton={true} />
      <div className="blog-topic-content">
        <div className="topic-header">
          <h1 className="topic-title">
            {topic?.charAt(0).toUpperCase() + topic?.slice(1)}
          </h1>
        </div>
        {user && (
          <div className="new-post-section">
            <button
              className="new-post-btn"
              onClick={() => setShowNewPostForm(true)}
              aria-label="Add a new blog post"
            >
              Add New Post
            </button>
          </div>
        )}
        {showNewPostForm && (
          <NewBlogPost
            onSubmit={addNewBlog}
            onCancel={() => setShowNewPostForm(false)}
          />
        )}
        <div className="blogs-container">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-box">
                <h2>{blog.title}</h2>
                <p>{blog.content.substring(0, 100)}...</p>
                <p className="blog-date">
                  Posted on: {formatDate(blog.createdAt)}
                </p>
                <Link to={`/blog/${blog._id}`} className="read-more">
                  Read More
                </Link>
                <button
                  onClick={() => summarizeBlog(blog._id, blog.content)}
                  className="summarize-btn"
                  disabled={loading}
                >
                  {loading ? "Summarizing..." : "Summarize"}
                </button>
                {summaries[blog._id] && (
                  <div className="summary-container">
                    <p className="blog-summary">{summaries[blog._id]}</p>
                    <button
                      onClick={() => clearSummary(blog._id)}
                      className="clear-summary-btn"
                    >
                      Clear Summary
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No blogs found for this topic.</p>
          )}
        </div>

        {/* Chatbot interface */}
        <div className="chatbot-container">
          <h2>Chat with AI</h2>
          <div className="chat-messages">
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
            {isChatLoading && <div className="message assistant">Thinking...</div>}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question..."
              className="chat-input"
            />
            <button type="submit" className="chat-submit-btn" disabled={isChatLoading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogTopicPage;