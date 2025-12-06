// backend/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.parseRFPRequirements = async (naturalLanguageText) => {
  try {
    // Use a model that supports structured output well (Gemini 1.5 Flash is fast & free)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a procurement expert AI. 
      Analyze the following natural language requirement and extract structured data.
      
      User Requirement: "${naturalLanguageText}"
      
      Return ONLY a valid JSON object with the following fields (do not add Markdown formatting):
      {
        "items": [
          { "name": "Item Name", "quantity": Number, "specs": "Key specifications" }
        ],
        "budget": Number (or null if not mentioned),
        "delivery_deadline": "YYYY-MM-DD" (calculate based on context if "in 30 days" is said, assuming today is ${new Date().toISOString().split('T')[0]}),
        "payment_terms": "String",
        "warranty_req": "String"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup: Sometimes AI wraps JSON in ```json ... ``` blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("❌ AI Parsing Error:", error);
    return {}; // Return empty object on failure so the app doesn't crash
  }
};

exports.parseVendorProposal = async (emailBody) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are a procurement assistant. Read the following email response from a vendor and extract the structured proposal details.
      
      Vendor Email: "${emailBody}"
      
      Return ONLY a valid JSON object with these fields:
      {
        "total_price": Number (extract the total cost mentioned, just the number),
        "currency": "String" (e.g., USD, INR),
        "delivery_time": "String" (e.g., "2 weeks", "45 days"),
        "warranty_offered": "String",
        "key_deviations": "String" (if they mentioned they can't meet a specific requirement, summarize it, else "None")
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Cleanup JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("❌ AI Parsing Proposal Error:", error);
    return {};
  }
};