import React from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react';

const Financials: React.FC = () => {
  return (
    <div className="space-y-6" id="printable-area">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financeiro</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Controle de receitas e despesas.</p>
        </div>
        <button className="no-print flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm transition-colors">
          <Download size={16} />
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receitas (Out)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">R$ 45.200,00</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Despesas (Out)</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">R$ 12.450,00</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Atual</p>
            <p className="text-xl font-bold text-brand-700 dark:text-brand-400">R$ 32.750,00</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Descrição</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
              <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {MOCK_TRANSACTIONS.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{t.description}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-medium ${t.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {t.type === 'Income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Financials;