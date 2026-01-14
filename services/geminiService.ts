
import { GoogleGenAI } from "@google/genai";

export const getSmartAnalysis = async (contextData: string, userQuery: string) => {
  // Obtém a chave diretamente do ambiente conforme as diretrizes
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key não configurada no ambiente.");
    return "Erro: Chave de API não configurada corretamente.";
  }

  // Inicializa o cliente conforme o padrão recomendado
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Você é um Consultor Especialista em ERP da "Landi Consultores".
      Analise os dados de negócio fornecidos abaixo e responda à pergunta do usuário ou forneça um insight estratégico.
      
      CONTEXTO DE DADOS:
      ${contextData}

      PERGUNTA DO USUÁRIO:
      ${userQuery}

      Instruções de Resposta:
      - Responda em Português de Moçambique.
      - Seja profissional e direto.
      - Use Markdown para formatação (negrito, listas).
    `;

    // Uso do modelo mais recente seguindo as diretrizes de codificação
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Acessa a propriedade .text diretamente conforme a documentação atualizada
    return response.text || "O consultor não conseguiu gerar uma análise no momento.";
  } catch (error) {
    console.error("Erro na análise do Gemini:", error);
    return "Desculpe, ocorreu um erro ao processar sua solicitação com a IA.";
  }
};
