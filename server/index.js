const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors({ origin: "*", methods: ["GET"] }));

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";
const PROXY = "https://api.allorigins.win/raw?url=";
let cache = null;
let cacheTs = 0;
const CACHE_TTL = 60000;

app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

app.get("/reddit", async (req, res) => {
  try {
    if (cache && Date.now() - cacheTs < CACHE_TTL) {
      return res.json(cache);
    }

    const redditResp = await fetch(REDDIT_URL, {
      headers: {
        "User-Agent": "web:rakesh-react-task:v1.0 (by /u/demo_user)",
        Accept: "application/json"
      }
    });

    if (redditResp.ok) {
      const data = await redditResp.json();
      cache = data;
      cacheTs = Date.now();
      return res.json(data);
    }

    const proxyResp = await fetch(PROXY + encodeURIComponent(REDDIT_URL));
    if (!proxyResp.ok) {
      return res.status(proxyResp.status).json({ error: "Proxy fetch error", status: proxyResp.status });
    }

    const proxyData = await proxyResp.json();
    cache = proxyData;
    cacheTs = Date.now();
    return res.json(proxyData);
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
