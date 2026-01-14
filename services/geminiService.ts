
import { GoogleGenAI } from "@google/genai";

/**
 * Serviço de análise estratégica utilizando a API do Google Gemini.
 * Otimizado para o modelo gemini-3-flash-preview.
 */
export const getSmartAnalysis = async (contextData: string, userQuery: string) => {
  // A chave de API deve ser configurada nas variáveis de ambiente do Vercel como API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Erro: Variável de ambiente API_KEY não encontrada.");
    return "Erro: Configuração de IA ausente no servidor.";
  }

  // Inicializa o cliente seguindo as diretrizes oficiais
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Você é o Consultor Estratégico Especialista em ERP da "Landi Consultores", operando em Moçambique.
      
      DADOS ATUAIS DO SISTEMA (JSON):
      ${contextData}

      SOLICITAÇÃO DO USUÁRIO:
      ${userQuery}

      INSTRUÇÕES PARA RESPOSTA:
      1. Use Português de Moçambique (formal, cordial e executivo).
      2. Forneça insights práticos baseados nos dados fornecidos.
      3. Use formatação Markdown (títulos, negrito, listas).
      4. Seja conciso e focado em resultados de negócio.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Retorna o texto gerado acessando a propriedade .text (conforme especificação da SDK @google/genai)
    return response.text || "O consultor não conseguiu processar os dados. Tente reformular a pergunta.";
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Lamentamos, ocorreu um erro técnico ao processar sua análise estratégica. Por favor, tente novamente.";
  }
};
