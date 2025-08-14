import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/proxy", async (req, res) => {
  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));