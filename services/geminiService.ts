
import { GoogleGenAI } from "@google/genai";

export const getSmartAnalysis = async (contextData: string, userQuery: string) => {
  // Always get a fresh key from process.env.API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    return "Erro: Chave de API não configurada.";
  }

  // Initialize client right before use to ensure correct key usage
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Você é um Consultor Especialista em ERP da "Landi Consultores".
      Analise os dados de negócio fornecidos e responda à pergunta do usuário ou forneça um insight estratégico.
      
      CONTEXTO DE DADOS:
      ${contextData}

      PERGUNTA DO USUÁRIO:
      ${userQuery}

      Mantenha a resposta profissional, concisa e formatada em Markdown.
      Se sugerir ações, use listas (bullet points).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Não foi possível gerar uma análise.";
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return "Desculpe, encontrei um erro ao analisar os dados. Verifique a configuração da API.";
  }
};
