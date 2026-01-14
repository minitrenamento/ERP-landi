
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Filter, 
  MoreHorizontal, 
  Download, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Trash2,
  Send,
  Printer
} from 'lucide-react';
import { MOCK_QUOTES, MOCK_CLIENTS } from '../constants';
import { Quote, QuoteItem } from '../types';

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Form State
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * 0.16; // 16% IVA
  const total = subtotal + taxAmount;

  // Filter Logic
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'Sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Accepted': return 'Aceite';
      case 'Rejected': return 'Rejeitada';
      case 'Sent': return 'Enviada';
      case 'Draft': return 'Rascunho';
      default: return status;
    }
  };

  // Form Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!client) newErrors.client = "Selecione um cliente";
    if (!expiryDate) newErrors.expiryDate = "Defina a validade";
    if (items.some(i => !i.description)) newErrors.items = "Preencha a descrição de todos os itens";
    if (items.some(i => i.total <= 0)) newErrors.items = "Verifique os valores dos itens";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedClient = MOCK_CLIENTS.find(c => c.name === client);
      const newQuote: Quote = {
        id: `COT-2023/${100 + quotes.length + 1}`,
        clientId: selectedClient?.id || '0',
        clientName: client,
        date,
        expiryDate,
        items,
        subtotal,
        taxAmount,
        total,
        status: 'Draft',
        notes
      };
      
      setQuotes([newQuote, ...quotes]);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setClient('');
    setExpiryDate('');
    setNotes('');
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setErrors({});
  };

  const handleCreateInvoice = (quoteId: string) => {
    if(confirm('Deseja converter esta cotação em Fatura?')) {
        // Logic to create invoice would go here
        alert('Cotação convertida com sucesso! (Simulação)');
    }
  }

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="text-brand-600 dark:text-brand-400" />
            Cotações
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie orçamentos e propostas comerciais.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Nova Cotação</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 text-xs font-medium uppercase">Total em Aberto</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(
                    quotes.filter(q => q.status === 'Sent' || q.status === 'Draft').reduce((acc, q) => acc + q.total, 0)
                )}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-green-600 text-xs font-medium uppercase">Aceites (Mês)</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                 {quotes.filter(q => q.status === 'Accepted').length}
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-blue-600 text-xs font-medium uppercase">Taxa de Conversão</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">35%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
         <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cotação..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
         </div>
         <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Draft', 'Sent', 'Accepted', 'Rejected'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        statusFilter === status 
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {getStatusLabel(status === 'Todos' ? 'Todos' : status)}
                </button>
            ))}
         </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cotação</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Validade</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600 dark:text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                    {quote.id}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {quote.clientName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(quote.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Date(quote.expiryDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(quote.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        {quote.status === 'Accepted' && (
                            <button 
                                onClick={() => handleCreateInvoice(quote.id)}
                                title="Converter em Fatura"
                                className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30 rounded-md transition-colors"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        )}
                        <button title="Imprimir" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <Printer size={16} />
                        </button>
                        <button title="Mais Opções" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="text-brand-600" size={20}/>
                Nova Cotação
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente <span className="text-red-500">*</span></label>
                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.client ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            >
                                <option value="">Selecione...</option>
                                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            {errors.client && <p className="text-xs text-red-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Emissão</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Válido Até <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.expiryDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            />
                            {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
                        </div>
                    </div>

                    {/* Items Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Itens da Cotação</h4>
                            <button type="button" onClick={handleAddItem} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                                <Plus size={16} /> Adicionar Item
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                                    <div className="col-span-6 md:col-span-5">
                                        <label className="text-xs text-gray-500 mb-1 block">Descrição</label>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            placeholder="Ex: Consultoria..."
                                            className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-2">
                                        <label className="text-xs text-gray-500 mb-1 block">Qtd</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-3 md:col-span-2">
                                        <label className="text-xs text-gray-500 mb-1 block">Preço Unit.</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between gap-2">
                                         <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                                            {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.total)}
                                         </span>
                                         <button 
                                            type="button" 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors"
                                            disabled={items.length === 1}
                                         >
                                            <Trash2 size={16} />
                                         </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.items && <p className="text-xs text-red-500 mt-2">{errors.items}</p>}
                    </div>

                    {/* Totals & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas / Condições</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm"
                                placeholder="Detalhes de pagamento, entrega, etc."
                            />
                         </div>
                         <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>IVA (16%)</span>
                                <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(taxAmount)}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between font-bold text-lg text-gray-800 dark:text-white">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(total)}</span>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                    >
                        <Send size={16} />
                        Criar Cotação
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
