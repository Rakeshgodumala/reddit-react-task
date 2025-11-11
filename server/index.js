const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // v2

const app = express();
app.use(cors());

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";

// Root route (so Render homepage won’t show "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

// Reddit data route
app.get("/reddit", async (req, res) => {
  try {
    const response = await fetch(REDDIT_URL, {
      headers: { "User-Agent": "render-proxy/1.0" },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Reddit returned an error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 10000; // Render assigns its own port
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
