// server/index.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // v2

const app = express();
app.use(cors()); // allow all origins for dev

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";

app.get("/reddit", async (req, res) => {
  try {
    const response = await fetch(REDDIT_URL, {
      headers: { "User-Agent": "local-proxy/1.0" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Reddit returned error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
