import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { shayari } = body;

    if (!shayari) {
      return { statusCode: 400, body: JSON.stringify({ error: "No Shayari provided" }) };
    }

    const API_KEY = "AIzaSyBiWQFIdw7qSJtnj_8dZ6EsTpo1DINFXP4"; // <-- apni Gemini key yahan daalo

    const prompt = `
      You are a creative poet. Translate this Shayari into:
      1. English
      2. Hindi
      3. Hinglish
      Shayari:
      ${shayari}
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No output";

    // Optional: Image placeholder
    const imgURL = `https://source.unsplash.com/800x400/?poetry,moon,night`;

    return {
      statusCode: 200,
      body: JSON.stringify({ text: output, image: imgURL })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
