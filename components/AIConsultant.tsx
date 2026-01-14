import React, { useState } from 'react';
import { Bot, Send, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { getSmartAnalysis } from '../services/geminiService';
import { MOCK_TRANSACTIONS, MOCK_PROJECTS, DASHBOARD_KPIS } from '../constants';

const AIConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prepare context from mock data
  const dataContext = JSON.stringify({
    kpis: DASHBOARD_KPIS,
    activeProjects: MOCK_PROJECTS.filter(p => p.status === 'In Progress'),
    recentTransactions: MOCK_TRANSACTIONS
  });

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse(null);
    
    const result = await getSmartAnalysis(dataContext, query);
    
    setResponse(result);
    setLoading(false);
  };

  const hasApiKey = (() => {
    try {
      return !!process.env.API_KEY;
    } catch {
      return false;
    }
  })();

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Consultant</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-y-auto flex flex-col transition-colors">
        {!response && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 space-y-4">
            <Bot size={48} className="text-brand-200 dark:text-brand-800" />
            <div className="max-w-md">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Como posso ajudar hoje?</p>
              <p className="text-sm">Analiso dados financeiros, status de projetos e métricas de desempenho para fornecer insights estratégicos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-8">
              <button onClick={() => setQuery("Qual é o status da nossa saúde financeira?")} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors text-left">
                💰 Qual a saúde financeira atual?
              </button>
              <button onClick={() => setQuery("Resuma o progresso dos projetos ativos.")} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors text-left">
                📊 Resumo dos projetos ativos
              </button>
              <button onClick={() => setQuery("Quais clientes precisam de atenção?")} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors text-left">
                ⚠️ Clientes em risco
              </button>
              <button onClick={() => setQuery("Crie um plano de ação para aumentar a receita.")} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors text-left">
                📈 Plano para aumentar receita
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
            <Loader2 size={40} className="text-brand-500 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Analisando dados corporativos...</p>
          </div>
        )}

        {response && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="prose prose-brand dark:prose-invert max-w-none">
              <div className="flex items-start gap-3 mb-4">
                 <Bot className="text-brand-600 dark:text-brand-400 mt-1 flex-shrink-0" size={24} />
                 <div className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                   {response}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-2 transition-colors">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Pergunte sobre seus dados (ex: 'Analise as despesas de outubro')"
          className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button 
          onClick={handleAsk}
          disabled={loading || !query.trim()}
          className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          <span>Analisar</span>
        </button>
      </div>
      
      {!hasApiKey && (
         <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-900/30 p-2 rounded border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={14} />
            <span>Nota: Configure a API_KEY para ativar o Gemini 2.5 Flash.</span>
         </div>
      )}
    </div>
  );
};

export default AIConsultant;