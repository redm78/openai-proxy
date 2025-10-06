import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await apiRes.text();

    try {
      const data = JSON.parse(text);
      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          error: data.error || "Unknown error from OpenAI"
        });
      }
      res.status(apiRes.status).json(data);
    } catch {
      // если OpenAI вернул не JSON
      res.status(apiRes.status).send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

