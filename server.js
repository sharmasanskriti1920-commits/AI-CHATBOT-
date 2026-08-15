import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";  // YE NAYA PACKAGE HAI
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

// YEHI NAYA TARIQA HAI - v1 API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",  // seedha yehi naam
      contents: [  // <-- ARRAY BANA DE
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });
 const text = result.text;
    res.json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
