
import React, { useState } from 'react';
import { 
  FileBarChart, 
  Search, 
  Download, 
  Printer, 
  Mail, 
  User, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_STATEMENT_DATA } from '../constants';
import { ClientStatementItem } from '../types';

const ClientExtracts: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]); // Start of current year
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Today

  const selectedClient = MOCK_CLIENTS.find(c => c.id === selectedClientId);

  // In a real app, this data would be fetched based on client ID and date range
  // For demo, we use MOCK_STATEMENT_DATA and calculate running balance
  const filteredData = selectedClientId ? MOCK_STATEMENT_DATA : [];

  // Summary Calculations
  const totalDebits = filteredData.reduce((acc, item) => acc + item.debit, 0);
  const totalCredits = filteredData.reduce((acc, item) => acc + item.credit, 0);
  const closingBalance = filteredData.length > 0 ? filteredData[filteredData.length - 1].balance : 0;
  const openingBalance = 0; // Assuming start from 0 for demo or fetch 'Opening Balance' item

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileBarChart className="text-brand-600 dark:text-brand-400" />
            Extractos de Clientes
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Histórico de conta corrente e movimentos.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm font-medium"
            onClick={() => window.print()}
            disabled={!selectedClientId}
          >
            <Printer size={16} />
            <span>Imprimir</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedClientId}
          >
            <Download size={16} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                    >
                        <option value="">Selecione um cliente...</option>
                        {MOCK_CLIENTS.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Data Início</label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Data Fim</label>
                <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>
        </div>
      </div>

      {selectedClientId ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden" id="printable-area">
            {/* Report Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Extracto de Conta</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Período: {new Date(startDate).toLocaleDateString('pt-BR')} a {new Date(endDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400">Landi Consultores</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Maputo, Moçambique</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">NUIT: 400123789</p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Cliente</p>
                        <p className="font-bold text-gray-800 dark:text-white">{selectedClient?.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedClient?.contactPerson}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">NUIT: {selectedClient?.nuit || 'N/A'}</p>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Saldo Anterior</p>
                            <p className="font-mono font-bold text-gray-700 dark:text-gray-300">{formatCurrency(openingBalance)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Saldo Atual</p>
                            <p className={`font-mono font-bold ${closingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(closingBalance)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards (Visual only) */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Débito (Faturado)</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(totalDebits)}</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Crédito (Pago)</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(totalCredits)}</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Movimentos</p>
                    <p className="font-bold text-gray-800 dark:text-white mt-1">{filteredData.length}</p>
                </div>
                <div className="p-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Situação</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${closingBalance > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {closingBalance > 0 ? 'Devedor' : 'Regular'}
                    </span>
                </div>
            </div>

            {/* Statement Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Data</th>
                            <th className="px-6 py-4 font-semibold">Documento</th>
                            <th className="px-6 py-4 font-semibold">Descrição</th>
                            <th className="px-6 py-4 font-semibold text-right">Débito</th>
                            <th className="px-6 py-4 font-semibold text-right">Crédito</th>
                            <th className="px-6 py-4 font-semibold text-right">Saldo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {new Date(item.date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                                    {item.type} <span className="text-gray-400 font-normal ml-1 text-xs">#{item.documentRef}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                    {item.description}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                                    {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                                    {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/50">
                                    {formatCurrency(item.balance)}
                                </td>
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    Nenhum movimento encontrado para este período.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer */}
            <div className="p-8 border-t border-gray-100 dark:border-gray-700 mt-auto bg-gray-50 dark:bg-gray-900/30">
                <div className="text-center text-xs text-gray-400">
                    <p>Este documento foi gerado eletronicamente pelo sistema Landi Consultores ERP.</p>
                    <p>Processado em {new Date().toLocaleString('pt-BR')}</p>
                </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center p-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Selecione um Cliente</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Utilize os filtros acima para selecionar um cliente e o período desejado para visualizar o extracto de conta.
            </p>
        </div>
      )}
    </div>
  );
};

export default ClientExtracts;
