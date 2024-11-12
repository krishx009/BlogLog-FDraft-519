import React, { useState } from "react";
import axios from "axios";
import "../StyleSheets/NewBlogPost.css";

const API_URL = "http://localhost:5000/api";

export default function NewBlogPost({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
    setOriginalContent("");
  };

  const enhanceContent = async () => {
    if (!content.trim()) return;

    setIsEnhancing(true);
    setOriginalContent(content);

    try {
      const response = await axios.post(
        `${API_URL}/ai/enhance`,
        { content },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.enhancedContent) {
        setContent(response.data.enhancedContent);
      } else {
        throw new Error("No enhanced content received");
      }
    } catch (error) {
      console.error("Error enhancing content:", error);
      alert(
        `Failed to enhance content: ${
          error.response?.data?.message || "Please try again"
        }`
      );
    } finally {
      setIsEnhancing(false);
    }
  };

  const revertContent = () => {
    if (originalContent) {
      setContent(originalContent);
      setOriginalContent("");
    }
  };

  return (
    <div className="new-blog-post">
      <h2 className="new-blog-post__title">Create New Blog Post</h2>
      <form onSubmit={handleSubmit} className="new-blog-post__form">
        <div className="new-blog-post__input-group">
          <label htmlFor="blog-title" className="new-blog-post__label">
            Blog Title
          </label>
          <input
            id="blog-title"
            type="text"
            className="new-blog-post__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="new-blog-post__input-group">
          <label htmlFor="blog-content" className="new-blog-post__label">
            Blog Content
          </label>
          <textarea
            id="blog-content"
            className="new-blog-post__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="new-blog-post__enhancement-buttons">
          <button
            type="button"
            onClick={enhanceContent}
            disabled={isEnhancing || !content.trim()}
            className={`new-blog-post__enhance-btn ${
              isEnhancing ? "new-blog-post__enhance-btn--enhancing" : ""
            }`}
          >
            {isEnhancing ? (
              <>
                <span className="new-blog-post__spinner"></span>
                Enhancing...
              </>
            ) : (
              "Enhance with AI"
            )}
          </button>
          {originalContent && (
            <button
              type="button"
              onClick={revertContent}
              className="new-blog-post__revert-btn"
            >
              Revert Changes
            </button>
          )}
        </div>
        <div className="new-blog-post__form-buttons">
          <button type="submit" className="new-blog-post__submit-btn">
            Post
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="new-blog-post__cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}