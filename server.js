import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });// YAHI CHANGE HAI
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("GEMINI ERROR:", error.message);
    res.status(500).json({ reply: "Server Error: " + error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
