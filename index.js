require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Brak wiadomości w żądaniu" });
    }
    
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 100,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
    
        console.log("Odpowiedź od OpenAI:", response.data);
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Błąd w komunikacji z OpenAI API:", error.response?.data || error.message);
        res.status(500).json({ error: "Wystąpił błąd podczas przetwarzania wiadomości." });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
