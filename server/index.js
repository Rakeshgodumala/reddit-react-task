const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // version 2

const app = express();
app.use(cors({ origin: "*", methods: ["GET"] }));

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";

// Two proxy URLs: one primary, one fallback
const PROXY_PRIMARY = "https://api.allorigins.win/raw?url=";
const PROXY_BACKUP = "https://thingproxy.freeboard.io/fetch/";

app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

app.get("/reddit", async (req, res) => {
  try {
    // Try with the primary proxy first
    let response = await fetch(PROXY_PRIMARY + encodeURIComponent(REDDIT_URL));

    if (!response.ok) {
      console.warn("Primary proxy failed, trying backup...");
      response = await fetch(PROXY_BACKUP + REDDIT_URL);
    }

    if (!response.ok) {
      console.error(`Both proxies failed with ${response.status}`);
      return res.status(response.status).json({
        error: "Proxy fetch error",
        status: response.status,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
