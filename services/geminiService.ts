
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de análise inteligente utilizando a SDK oficial do Google GenAI.
 * Otimizado para o modelo gemini-3-flash-preview.
 */
export const getSmartAnalysis = async (contextData: string, userQuery: string) => {
  // A chave de API deve ser configurada no Vercel como variável de ambiente API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("ERRO: Variável de ambiente API_KEY não encontrada.");
    return "Erro de configuração: Chave de API não encontrada no servidor.";
  }

  // Inicialização imediata para garantir o uso da chave atualizada
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Você é o Consultor Estratégico de ERP da "Landi Consultores", em Moçambique.
      Sua tarefa é analisar os dados fornecidos e responder de forma profissional, executiva e prática.

      DADOS DO SISTEMA (JSON):
      ${contextData}

      PERGUNTA OU SOLICITAÇÃO DO USUÁRIO:
      ${userQuery}

      REQUISITOS DA RESPOSTA:
      1. Use Português de Moçambique (formal e cordial).
      2. Formate a resposta exclusivamente em Markdown.
      3. Seja conciso, mas forneça insights baseados nos dados.
      4. Se houver problemas financeiros ou de estoque, destaque-os com emojis apropriados.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // A propriedade .text é garantida na SDK estável @google/genai
    return response.text || "O consultor não conseguiu processar os dados no momento.";
  } catch (error) {
    console.error("Erro na comunicação com Gemini API:", error);
    return "Lamentamos, ocorreu um erro técnico ao processar sua análise. Por favor, tente novamente mais tarde.";
  }
};
