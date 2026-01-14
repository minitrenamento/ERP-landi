
import React, { useState } from 'react';
import { Search, Plus, FileText, Download, MoreHorizontal, X, AlertCircle, Calendar, CheckCircle, Clock, AlertTriangle, Filter } from 'lucide-react';
import { MOCK_CLIENTS, MOCK_SALES_INVOICES } from '../constants';
import { SalesInvoice } from '../types';

const Invoices: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [formData, setFormData] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [invoices, setInvoices] = useState<SalesInvoice[]>(MOCK_SALES_INVOICES);

  const filteredInvoices = invoices.filter(invoice => 
    filterStatus === 'Todos' ? true : invoice.status === filterStatus
  );

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.client) newErrors.client = "Cliente é obrigatório";
    if (!formData.date) newErrors.date = "Data de emissão é obrigatória";
    if (!formData.dueDate) newErrors.dueDate = "Data de vencimento é obrigatória";
    
    if (formData.date && formData.dueDate && new Date(formData.dueDate) < new Date(formData.date)) {
      newErrors.dueDate = "Vencimento não pode ser anterior à emissão";
    }

    // Currency Validation for MZN
    if (!formData.amount) {
      newErrors.amount = "Valor é obrigatório";
    } else {
      const amountVal = Number(formData.amount);
      const currencyRegex = /^\d+(\.\d{1,2})?$/;
      
      if (isNaN(amountVal) || amountVal <= 0) {
        newErrors.amount = "Valor deve ser um número positivo maior que zero";
      } else if (!currencyRegex.test(formData.amount.toString())) {
        newErrors.amount = "Formato inválido. Insira um valor válido em MZN (ex: 1000.00)";
      }
    }
    
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newInvoice: SalesInvoice = {
        id: `FAT-2023/00${invoices.length + 1}`,
        client: formData.client,
        date: formData.date,
        dueDate: formData.dueDate,
        amount: Number(formData.amount),
        status: 'Pendente',
        description: formData.description
      };
      
      setInvoices([newInvoice, ...invoices]);
      alert("Fatura criada com sucesso!");
      setIsModalOpen(false);
      setFormData({
        client: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        amount: '',
        description: ''
      });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pago': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'Pendente': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Atrasado': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pago': return <CheckCircle size={14} />;
      case 'Pendente': return <Clock size={14} />;
      case 'Atrasado': return <AlertTriangle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6" id="printable-area">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestão de Faturas</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Emissão e controle de faturas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar fatura..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none h-full text-sm cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Atrasado">Atrasado</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova Fatura</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Emissão</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Vencimento</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Valor (MZN)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                    {inv.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{inv.client}</div>
                    <div className="text-gray-400 text-xs truncate max-w-[150px]">{inv.description}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(inv.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(inv.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(inv.status)}`}>
                      {getStatusIcon(inv.status)}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right no-print">
                    <div className="flex justify-end gap-2">
                      <button className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Download size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma fatura encontrada com o status "{filterStatus}".
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-brand-500" />
                Nova Fatura
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente <span className="text-red-500">*</span></label>
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all appearance-none ${
                      errors.client ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                  >
                    <option value="">Selecione um cliente</option>
                    {MOCK_CLIENTS.map(client => (
                      <option key={client.id} value={client.name}>{client.name}</option>
                    ))}
                  </select>
                  {errors.client && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.client}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor (MZN) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.amount}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Emissão <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.date ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                  />
                  {errors.date && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Vencimento <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.dueDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                  />
                  {errors.dueDate && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.dueDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Serviço/Produto <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                  placeholder="Descreva os detalhes da fatura..."
                />
                {errors.description && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
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
                  <CheckCircle size={16} />
                  Emitir Fatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
