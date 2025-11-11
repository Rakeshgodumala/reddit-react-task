const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // version 2

const app = express();
app.use(cors({ origin: "*", methods: ["GET"] }));

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";

// Use a reliable free proxy API
const PROXY_URL = "https://api.codetabs.com/v1/proxy?quest=";

app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

app.get("/reddit", async (req, res) => {
  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(REDDIT_URL));

    if (!response.ok) {
      console.error("Proxy fetch failed:", response.status);
      return res.status(response.status).json({
        error: "Proxy fetch failed",
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
