
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  BarChart2,
  Box,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';
import { Article } from '../types';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low' | 'Out'>('All');
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    unit: 'Un',
    salePrice: '',
    costPrice: '',
    currentStock: '',
    minStock: '',
    status: 'Active',
    location: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculations for Summary Cards
  const totalItems = articles.length;
  const totalStockValue = articles.reduce((acc, item) => acc + (item.costPrice * item.currentStock), 0);
  const lowStockItems = articles.filter(a => a.currentStock <= a.minStock && a.currentStock > 0).length;
  const outOfStockItems = articles.filter(a => a.currentStock === 0).length;

  // Filter Logic
  const filteredArticles = articles.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'Low') matchesStock = a.currentStock <= a.minStock && a.currentStock > 0;
    if (stockFilter === 'Out') matchesStock = a.currentStock === 0;

    return matchesSearch && matchesStock;
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome do artigo é obrigatório";
    if (!formData.code.trim()) newErrors.code = "Código é obrigatório";
    if (!formData.category.trim()) newErrors.category = "Categoria é obrigatória";
    
    const isCodeDuplicate = articles.some(a => 
      a.code.toLowerCase() === formData.code.toLowerCase() && 
      (modalMode === 'create' || a.id !== currentArticleId)
    );
    if (isCodeDuplicate) newErrors.code = "Código já existente";

    if (!formData.salePrice || Number(formData.salePrice) < 0) newErrors.salePrice = "Preço de venda inválido";
    if (!formData.costPrice || Number(formData.costPrice) < 0) newErrors.costPrice = "Preço de custo inválido";
    
    if (formData.currentStock === '' || Number(formData.currentStock) < 0) newErrors.currentStock = "Stock inválido";
    if (formData.minStock === '' || Number(formData.minStock) < 0) newErrors.minStock = "Stock mínimo inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (modalMode === 'create') {
        const newArticle: Article = {
            id: (Math.max(0, ...articles.map(a => parseInt(a.id))) + 1).toString(),
            code: formData.code.toUpperCase(),
            name: formData.name,
            category: formData.category,
            unit: formData.unit,
            salePrice: Number(formData.salePrice),
            costPrice: Number(formData.costPrice),
            currentStock: Number(formData.currentStock),
            minStock: Number(formData.minStock),
            status: formData.status as any,
            location: formData.location
        };
        setArticles([newArticle, ...articles]);
      } else {
        setArticles(articles.map(a => a.id === currentArticleId ? {
            ...a,
            code: formData.code.toUpperCase(),
            name: formData.name,
            category: formData.category,
            unit: formData.unit,
            salePrice: Number(formData.salePrice),
            costPrice: Number(formData.costPrice),
            currentStock: Number(formData.currentStock),
            minStock: Number(formData.minStock),
            status: formData.status as any,
            location: formData.location
        } : a));
      }
      closeModal();
    }
  };

  const openCreateModal = () => {
      setModalMode('create');
      const nextId = (Math.max(0, ...articles.map(a => parseInt(a.id))) + 1).toString().padStart(3, '0');
      setFormData({ 
          code: `ART-${nextId}`, 
          name: '', 
          category: '', 
          unit: 'Un', 
          salePrice: '', 
          costPrice: '', 
          currentStock: '0', 
          minStock: '5', 
          status: 'Active',
          location: '' 
        });
      setIsModalOpen(true);
  };

  const openEditModal = (article: Article) => {
      setModalMode('edit');
      setCurrentArticleId(article.id);
      setFormData({
          code: article.code,
          name: article.name,
          category: article.category,
          unit: article.unit,
          salePrice: article.salePrice.toString(),
          costPrice: article.costPrice.toString(),
          currentStock: article.currentStock.toString(),
          minStock: article.minStock.toString(),
          status: article.status,
          location: article.location || ''
      });
      setIsModalOpen(true);
  };

  const deleteArticle = (id: string) => {
      if (window.confirm("Tem certeza que deseja remover este artigo?")) {
          setArticles(articles.filter(a => a.id !== id));
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getStockStatus = (article: Article) => {
      if (article.currentStock === 0) return { label: 'Esgotado', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: AlertTriangle };
      if (article.currentStock <= article.minStock) return { label: 'Baixo', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: AlertTriangle };
      return { label: 'Disponível', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Package size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Artigos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalItems}</p>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <DollarSign size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Valor em Stock</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(totalStockValue)}
                  </p>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Baixo Stock</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowStockItems}</p>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                  <Box size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Esgotados</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStockItems}</p>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
             <button 
                onClick={() => setStockFilter('All')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${stockFilter === 'All' ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
             >
                 Todos
             </button>
             <button 
                onClick={() => setStockFilter('Low')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${stockFilter === 'Low' ? 'bg-white dark:bg-gray-600 shadow text-amber-600' : 'text-gray-500 dark:text-gray-400'}`}
             >
                 Baixo Stock
             </button>
             <button 
                onClick={() => setStockFilter('Out')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${stockFilter === 'Out' ? 'bg-white dark:bg-gray-600 shadow text-red-600' : 'text-gray-500 dark:text-gray-400'}`}
             >
                 Esgotados
             </button>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar artigo..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
                />
            </div>
            <button 
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium whitespace-nowrap"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Artigo</span>
            </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Artigo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Preço Venda</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Custo</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredArticles.map((article) => {
                  const stockStatus = getStockStatus(article);
                  const StatusIcon = stockStatus.icon;

                  return (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{article.name}</span>
                            <span className="text-xs text-gray-400 font-mono mt-0.5">{article.code}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                            {article.category}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${stockStatus.color}`}>
                                <StatusIcon size={12} />
                                {article.currentStock} {article.unit}
                             </div>
                             {article.location && (
                                 <span className="text-[10px] text-gray-400 border border-gray-200 dark:border-gray-600 px-1 rounded" title="Localização">
                                     {article.location}
                                 </span>
                             )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(article.salePrice)}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(article.costPrice)}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'Active' ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {article.status === 'Active' ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => openEditModal(article)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => deleteArticle(article.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                    </tr>
                  );
              })}
              {filteredArticles.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <Package size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhum artigo encontrado.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="text-brand-600" size={20}/> : <Edit2 className="text-brand-600" size={20}/>}
                {modalMode === 'create' ? 'Novo Artigo' : 'Editar Artigo'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Código <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all uppercase font-mono text-sm ${
                        errors.code ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                    />
                    {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Artigo <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                        placeholder="Ex: Teclado USB"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.category ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                        placeholder="Informática"
                    />
                     {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="Un">Unidade</option>
                        <option value="Kg">Quilograma</option>
                        <option value="L">Litro</option>
                        <option value="Cx">Caixa</option>
                        <option value="M">Metro</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Armazém A"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preço de Venda <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">MZN</span>
                        <input
                            type="number"
                            name="salePrice"
                            value={formData.salePrice}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.salePrice ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                            }`}
                        />
                    </div>
                    {errors.salePrice && <p className="text-xs text-red-500">{errors.salePrice}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preço de Custo <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">MZN</span>
                        <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.costPrice ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                            }`}
                        />
                    </div>
                     {errors.costPrice && <p className="text-xs text-red-500">{errors.costPrice}</p>}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Atual <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="currentStock"
                        value={formData.currentStock}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.currentStock ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                    />
                    {errors.currentStock && <p className="text-xs text-red-500">{errors.currentStock}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Mínimo (Alerta) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.minStock ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                    />
                    {errors.minStock && <p className="text-xs text-red-500">{errors.minStock}</p>}
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Articles;
