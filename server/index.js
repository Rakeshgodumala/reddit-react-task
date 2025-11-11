const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors({ origin: "*", methods: ["GET"] }));

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";
const PROXY = "https://api.allorigins.win/raw?url=";

// Cache setup
let cache = null;
let cacheTs = 0;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

app.get("/reddit", async (req, res) => {
  try {
    // ✅ Serve cached data if recent
    if (cache && Date.now() - cacheTs < CACHE_TTL) {
      console.log("Serving cached Reddit data");
      return res.json(cache);
    }

    // ✅ Try Reddit API directly first
    let response = await fetch(REDDIT_URL, {
      headers: {
        "User-Agent": "web:rakesh-react-task:v1.0 (by /u/demo_user)",
        Accept: "application/json",
      },
    });

    // ✅ If Reddit blocks, use proxy
    if (!response.ok) {
      console.warn(`Reddit returned ${response.status}, using proxy`);
      response = await fetch(PROXY + encodeURIComponent(REDDIT_URL));
    }

    if (!response.ok) {
      console.error(`Both sources failed with ${response.status}`);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch Reddit data", status: response.status });
    }

    // ✅ Store and return fresh data
    const data = await response.json();
    cache = data;
    cacheTs = Date.now();

    res.json(data);
  } catch (err) {
    console.error("Server fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

// ✅ Keep Render awake (ping itself every 5 minutes)
setInterval(() => {
  fetch("https://reddit-react-task.onrender.com/").catch(() =>
    console.log("Self-ping failed (Render sleeping)")
  );
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
