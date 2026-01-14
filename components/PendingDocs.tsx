
import React, { useState } from 'react';
import { 
  FileText, 
  Truck, 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { MOCK_SALES_INVOICES, MOCK_PURCHASE_INVOICES, MOCK_QUOTES } from '../constants';

type DocType = 'Sales' | 'Purchases' | 'Quotes';

const PendingDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocType>('Sales');

  // Filter Data
  const pendingSales = MOCK_SALES_INVOICES.filter(i => i.status === 'Pendente' || i.status === 'Atrasado');
  const pendingPurchases = MOCK_PURCHASE_INVOICES.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  const openQuotes = MOCK_QUOTES.filter(q => q.status === 'Draft' || q.status === 'Sent');

  // Totals
  const totalReceivable = pendingSales.reduce((acc, i) => acc + i.amount, 0);
  const totalPayable = pendingPurchases.reduce((acc, i) => acc + i.totalAmount, 0);
  const potentialRevenue = openQuotes.reduce((acc, q) => acc + q.total, 0);

  const getActiveList = () => {
    switch(activeTab) {
        case 'Sales': return pendingSales;
        case 'Purchases': return pendingPurchases;
        case 'Quotes': return openQuotes;
        default: return [];
    }
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const renderStatusBadge = (status: string) => {
      let colorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      
      if (['Atrasado', 'Overdue'].includes(status)) {
          colorClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      } else if (['Pendente', 'Pending', 'Sent'].includes(status)) {
          colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      } else if (status === 'Draft') {
          colorClass = 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      }

      return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {status}
          </span>
      );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Clock className="text-brand-600 dark:text-brand-400" />
          Documentos Pendentes
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Visão consolidada de itens que requerem atenção.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">A Receber (Faturas)</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalReceivable)}
                    </h3>
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={20} />
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{pendingSales.length} documentos pendentes</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-red-500 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">A Pagar (Fornecedores)</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalPayable)}
                    </h3>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                    <TrendingDown size={20} />
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{pendingPurchases.length} documentos pendentes</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Receita Potencial (Cotações)</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(potentialRevenue)}
                    </h3>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <FileSpreadsheet size={20} />
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{openQuotes.length} cotações em aberto</p>
        </div>
      </div>

      {/* Tabs & List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
            <button
                onClick={() => setActiveTab('Sales')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'Sales' 
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                <FileText size={18} />
                Faturas a Receber
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {pendingSales.length}
                </span>
            </button>
            <button
                onClick={() => setActiveTab('Purchases')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'Purchases' 
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                <Truck size={18} />
                Faturas a Pagar
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {pendingPurchases.length}
                </span>
            </button>
            <button
                onClick={() => setActiveTab('Quotes')}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'Quotes' 
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-900/10' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                <FileSpreadsheet size={18} />
                Cotações Abertas
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {openQuotes.length}
                </span>
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Documento</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Entidade</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data Emissão</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Vencimento / Validade</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {getActiveList().map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                                {item.id}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-900 dark:text-white font-medium">
                                    {item.client || item.clientName || item.supplierName}
                                </div>
                                {item.description && (
                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                        {item.description}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                {formatDate(item.date)}
                            </td>
                            <td className="px-6 py-4">
                                {item.dueDate || item.expiryDate ? (
                                    <div className={`flex items-center gap-1.5 ${
                                        (item.status === 'Atrasado' || item.status === 'Overdue') ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                        {(item.status === 'Atrasado' || item.status === 'Overdue') && <AlertTriangle size={14} />}
                                        {formatDate(item.dueDate || item.expiryDate)}
                                    </div>
                                ) : '-'}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.amount || item.totalAmount || item.total)}
                            </td>
                            <td className="px-6 py-4">
                                {renderStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-brand-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {getActiveList().length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                Nenhum documento pendente nesta categoria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PendingDocs;
