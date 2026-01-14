
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  BarChart2, 
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  RefreshCcw
} from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';
import { Article } from '../types';

const StockList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [stockStatusFilter, setStockStatusFilter] = useState('Todos');

  // Derived Data
  const totalItems = MOCK_ARTICLES.length;
  const totalStockValue = MOCK_ARTICLES.reduce((acc, item) => acc + (item.costPrice * item.currentStock), 0);
  const potentialRevenue = MOCK_ARTICLES.reduce((acc, item) => acc + (item.salePrice * item.currentStock), 0);
  const lowStockItems = MOCK_ARTICLES.filter(item => item.currentStock <= item.minStock && item.currentStock > 0);
  const outOfStockItems = MOCK_ARTICLES.filter(item => item.currentStock === 0);

  // Categories for filter
  const categories = ['Todas', ...Array.from(new Set(MOCK_ARTICLES.map(a => a.category)))];

  // Filtering
  const filteredStock = MOCK_ARTICLES.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || item.category === categoryFilter;
    
    let matchesStatus = true;
    if (stockStatusFilter === 'Baixo') matchesStatus = item.currentStock <= item.minStock && item.currentStock > 0;
    if (stockStatusFilter === 'Esgotado') matchesStatus = item.currentStock === 0;
    if (stockStatusFilter === 'Normal') matchesStatus = item.currentStock > item.minStock;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockHealthColor = (current: number, min: number) => {
    if (current === 0) return 'bg-red-500';
    if (current <= min) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStockHealthLabel = (current: number, min: number) => {
    if (current === 0) return { label: 'Esgotado', class: 'text-red-600 bg-red-50 dark:bg-red-900/20' };
    if (current <= min) return { label: 'Crítico', class: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' };
    return { label: 'Bom', class: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' };
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Package className="text-brand-600 dark:text-brand-400" />
            Stock Existente
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Visão geral do inventário e valorização.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm text-sm font-medium">
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium">
            <Download size={16} />
            <span>Relatório de Inventário</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Valor de Custo Total</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(totalStockValue)}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <ArrowUpRight size={12} />
            Ativo Circulante
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Receita Potencial</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(potentialRevenue)}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <BarChart2 size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            Margem Estimada: {((potentialRevenue - totalStockValue) / potentialRevenue * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Itens Críticos</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{lowStockItems.length + outOfStockItems.length}</h3>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            Necessitam reposição
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Total de Artigos</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{totalItems}</h3>
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categories.length - 1} Categorias
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-96">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar artigo, código..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
                <option value="Todos">Status: Todos</option>
                <option value="Normal">Normal</option>
                <option value="Baixo">Baixo Stock</option>
                <option value="Esgotado">Esgotado</option>
            </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Artigo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 w-48">Nível de Stock</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor Custo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor Venda</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Localização</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStock.map((item) => {
                const health = getStockHealthLabel(item.currentStock, item.minStock);
                const percentage = Math.min(100, Math.max(5, (item.currentStock / (item.minStock * 3)) * 100)); // Visual estimation

                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-gray-400 font-mono text-xs">{item.code}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                            {item.category}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{item.currentStock} {item.unit}</span>
                            <span className="text-gray-400">Min: {item.minStock}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                                className={`h-1.5 rounded-full ${getStockHealthColor(item.currentStock, item.minStock)}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.costPrice)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-200">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.salePrice)}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                            <MapPin size={12} />
                            {item.location || 'N/A'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${health.class}`}>
                            {health.label}
                        </span>
                    </td>
                  </tr>
                );
              })}
              {filteredStock.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <Package size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhum item de stock encontrado.</p>
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

export default StockList;
