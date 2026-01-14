
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Save, 
  X, 
  ArrowDownLeft, 
  Package, 
  Calendar, 
  FileText,
  Truck,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { MOCK_ARTICLES, MOCK_SUPPLIERS } from '../constants';
import { Article } from '../types';

interface EntryItem {
  id: string;
  articleId: string;
  articleName: string;
  code: string;
  quantity: number;
  unitCost: number;
  total: number;
}

const StockEntry: React.FC = () => {
  // Header Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierId, setSupplierId] = useState('');
  const [documentRef, setDocumentRef] = useState('');
  const [notes, setNotes] = useState('');

  // Item Form State
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  
  // List State
  const [items, setItems] = useState<EntryItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Search/Filter for dropdown
  const [productSearch, setProductSearch] = useState('');

  // Derived Values
  const filteredArticles = MOCK_ARTICLES.filter(a => 
    a.status === 'Active' && 
    (a.name.toLowerCase().includes(productSearch.toLowerCase()) || a.code.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const selectedArticle = MOCK_ARTICLES.find(a => a.id === selectedArticleId);
  const totalEntryValue = items.reduce((acc, item) => acc + item.total, 0);

  // Handlers
  const handleAddItem = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedArticleId) newErrors.article = "Selecione um artigo";
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = "Quantidade inválida";
    if (!unitCost || Number(unitCost) < 0) newErrors.unitCost = "Custo inválido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (selectedArticle) {
      const qtyNum = Number(quantity);
      const costNum = Number(unitCost);
      
      const newItem: EntryItem = {
        id: Date.now().toString(),
        articleId: selectedArticle.id,
        articleName: selectedArticle.name,
        code: selectedArticle.code,
        quantity: qtyNum,
        unitCost: costNum,
        total: qtyNum * costNum
      };

      setItems([...items, newItem]);
      
      // Reset Item Form
      setSelectedArticleId('');
      setQuantity('');
      setUnitCost('');
      setProductSearch('');
      setErrors({});
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmitEntry = () => {
    const newErrors: { [key: string]: string } = {};
    if (!supplierId) newErrors.supplier = "Fornecedor é obrigatório";
    if (!documentRef) newErrors.document = "Referência do documento é obrigatória";
    if (items.length === 0) newErrors.list = "Adicione pelo menos um item";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Por favor, preencha os campos obrigatórios e adicione itens.");
      return;
    }

    // Logic to save to backend would go here
    alert(`Entrada de Stock Registrada com Sucesso!\nValor Total: ${new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalEntryValue)}`);
    
    // Reset All
    setItems([]);
    setSupplierId('');
    setDocumentRef('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Auto-fill cost when product selected
  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedArticleId(id);
    const article = MOCK_ARTICLES.find(a => a.id === id);
    if (article) {
      setUnitCost(article.costPrice.toString());
    } else {
      setUnitCost('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ArrowDownLeft className="text-brand-600 dark:text-brand-400" />
            Entrada de Stock
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Registre compras e recebimentos de mercadoria.</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total da Entrada</p>
           <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
             {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalEntryValue)}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Document Header Info */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
              <FileText size={18} className="text-gray-400" />
              Dados do Documento
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Data de Entrada</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Fornecedor <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Truck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none appearance-none ${errors.supplier ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                  >
                    <option value="">Selecione...</option>
                    {MOCK_SUPPLIERS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                {errors.supplier && <p className="text-xs text-red-500 mt-1">{errors.supplier}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Ref. Documento (Fatura/Guia) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={documentRef}
                  onChange={(e) => setDocumentRef(e.target.value)}
                  placeholder="Ex: FAT-001/2023"
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${errors.document ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                />
                {errors.document && <p className="text-xs text-red-500 mt-1">{errors.document}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Notas / Observações</label>
                <textarea 
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Add Item Form */}
          <div className="bg-brand-50 dark:bg-brand-900/10 p-5 rounded-xl border border-brand-100 dark:border-brand-800 shadow-sm space-y-4">
            <h3 className="font-semibold text-brand-800 dark:text-brand-300 flex items-center gap-2 border-b border-brand-200 dark:border-brand-800 pb-2">
              <Package size={18} className="text-brand-600 dark:text-brand-400" />
              Adicionar Artigo
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-brand-700 dark:text-brand-300 mb-1 block">Artigo <span className="text-red-500">*</span></label>
                <select 
                  value={selectedArticleId}
                  onChange={handleSelectProduct}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${errors.article ? 'border-red-500' : 'border-brand-200 dark:border-brand-700'}`}
                >
                  <option value="">Selecione um artigo...</option>
                  {filteredArticles.map(a => (
                    <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                  ))}
                </select>
                {errors.article && <p className="text-xs text-red-500 mt-1">{errors.article}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-700 dark:text-brand-300 mb-1 block">Quantidade <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${errors.quantity ? 'border-red-500' : 'border-brand-200 dark:border-brand-700'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 dark:text-brand-300 mb-1 block">Custo Unit. (MZN) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none ${errors.unitCost ? 'border-red-500' : 'border-brand-200 dark:border-brand-700'}`}
                  />
                </div>
              </div>

              <button 
                onClick={handleAddItem}
                className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Plus size={16} /> Adicionar à Lista
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Items Table */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200">Itens da Entrada</h3>
              <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full">
                {items.length} itens
              </span>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Código</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Artigo</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Qtd</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Custo Unit.</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Total</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{item.code}</td>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{item.articleName}</td>
                      <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                      <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.unitCost)}
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.total)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Package size={32} className="opacity-20" />
                          <p>Nenhum item adicionado à lista.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {errors.list && <span className="text-red-500 flex items-center gap-1"><AlertCircle size={14}/> {errors.list}</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-medium">Total Geral</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalEntryValue)}
                    </p>
                  </div>
               </div>
               <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setItems([]);
                      setErrors({});
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSubmitEntry}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg shadow-green-600/20 transition-all text-sm font-bold flex items-center gap-2"
                  >
                    <Save size={18} />
                    Confirmar Entrada
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StockEntry;
