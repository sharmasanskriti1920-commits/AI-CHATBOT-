const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // root folder ko serve karega
// YE 2 LINE ADD KARO - iframe ke liye
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API route for chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error); // YE LINE IMPORTANT HAI
    res.status(500).json({ reply: "Server Error: " + error.message });
  }
});

// Frontend serve
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
