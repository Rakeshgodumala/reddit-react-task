const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // v2

const app = express();
app.use(cors());

const REDDIT_URL = "https://www.reddit.com/r/reactjs.json";

app.get("/", (req, res) => {
  res.send("Backend is running. Visit /reddit to see Reddit JSON data.");
});

app.get("/reddit", async (req, res) => {
  try {
    const response = await fetch(REDDIT_URL, {
      headers: {
        "User-Agent": "rakesh-react-task:v1.0 (by /u/demo_user)", // Important for Reddit API
      },
    });

    if (!response.ok) {
      console.error(`Reddit API returned ${response.status}`);
      return res
        .status(response.status)
        .json({ error: "Reddit returned an error", status: response.status });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
