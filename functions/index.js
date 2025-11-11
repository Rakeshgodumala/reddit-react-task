const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.reddit = functions.https.onRequest(async (req, res) => {
  try {
    const response = await fetch("https://www.reddit.com/r/reactjs.json", {
      headers: { "User-Agent": "firebase-proxy/1.0" },
    });
    const data = await response.json();
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reddit" });
  }
});
