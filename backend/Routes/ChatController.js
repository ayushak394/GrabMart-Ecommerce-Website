const axios = require("axios");
const Product = require("../Models/ProductSchema");

let lastSearchTerm = "";

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are an AI assistant for an e-commerce website.

Classify the query:

1. search
2. greeting
3. other

IMPORTANT:
- Return meaningful keywords only
- Avoid vague words like "other"

Return JSON:
{
  "type": "search" | "greeting" | "other",
  "category": string | null,
  "keywords": string | null,
  "reply": string
}

User query: "${message}"
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let data = {};
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      data = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (err) {
      console.error("JSON Parse Error:", text);
    }

    console.log("AI OUTPUT:", data);

    const isFollowUp =
      message.toLowerCase().includes("other") ||
      message.toLowerCase().includes("more");

    if (data.type === "greeting") {
      return res.json({
        reply: data.reply || "Hello! How can I help you?",
        products: [],
      });
    }

    if (data.type === "other" && !isFollowUp) {
      return res.json({
        reply: data.reply || "I can help you find products.",
        products: [],
      });
    }

    let searchTerm = data.keywords || data.category || message;

    searchTerm = searchTerm.toLowerCase().trim();

    if (isFollowUp && lastSearchTerm) {
      searchTerm = lastSearchTerm;
    }

    if (searchTerm.endsWith("s")) {
      searchTerm = searchTerm.slice(0, -1);
    }

    const synonyms = {
      tv: "television",
      powerbank: "charger",
      headphones: "headphone",
      watch: "smart watch",
      wearable: "wearables",
      phone: "mobile",
    };

    if (synonyms[searchTerm]) {
      searchTerm = synonyms[searchTerm];
    }

    console.log("FINAL SEARCH TERM:", searchTerm);

    lastSearchTerm = searchTerm;

    let query = {
      $or: [
        { name: new RegExp(searchTerm, "i") },
        { description: new RegExp(searchTerm, "i") },
        { category: new RegExp(searchTerm, "i") },
      ],
    };

    let products;

    if (isFollowUp) {
      products = await Product.find(query).skip(2).limit(5);
    } else {
      products = await Product.find(query).limit(5);
    }

    if (products.length === 0) {
      products = await Product.find({
        $or: [
          { name: new RegExp(message, "i") },
          { description: new RegExp(message, "i") },
        ],
      }).limit(5);
    }

    if (products.length === 0) {
      return res.json({
        reply:
          data.reply ||
          "I couldn't find matching products. Try something else.",
        products: [],
      });
    }

    let finalReply = data.reply;

    if (data.type === "search") {
      finalReply = "Here are some products:";
    }

    if (isFollowUp) {
      finalReply = "Here are more options:";
    }

    return res.json({
      reply: finalReply,
      products,
    });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI chat failed" });
  }
};
