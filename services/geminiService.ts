import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  let apiKey: string | undefined;
  try {
    // Safely attempt to access process.env.API_KEY
    apiKey = process.env.API_KEY;
  } catch (e) {
    console.warn("Unable to access process.env. API_KEY is missing.");
  }

  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getSmartAnalysis = async (contextData: string, userQuery: string) => {
  const ai = getClient();
  if (!ai) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const prompt = `
      You are an expert ERP Consultant for "Landi Consultores".
      Analyze the following business data and answer the user's question or provide an insight.
      
      DATA CONTEXT:
      ${contextData}

      USER QUESTION:
      ${userQuery}

      Keep the answer professional, concise, and formatted in Markdown.
      If suggesting actions, use bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return "Sorry, I encountered an error while analyzing the data.";
  }
};