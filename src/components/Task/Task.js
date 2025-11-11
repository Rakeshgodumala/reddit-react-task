import React, { useEffect, useState } from "react";
import "./Task.css";

const Task = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/reddit";

  // Helper to decode HTML entities (&lt;, &gt;, etc.)
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const items = data?.data?.children || [];
        setPosts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to fetch Reddit posts.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">⏳ Loading Reddit posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="task-container">
      <h1 className="task-title"> Reddit Feed</h1>
      <div className="task-grid">
        {posts.map((post) => {
          const { id, title, selftext_html, url, score } = post.data;

          return (
            <div className="task-card" key={id}>
              <h2 className="task-card-title">{title}</h2>

              {selftext_html ? (
                // ✅ Decode & render post HTML
                <div
                  className="task-card-body"
                  dangerouslySetInnerHTML={{
                    __html: decodeHTML(selftext_html),
                  }}
                />
              ) : (
                <p className="no-text">No text available.</p>
              )}

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="task-card-link"
              >
                🔗 Read More
              </a>
              <p className="task-card-score">👍 Score: {score}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Task;
