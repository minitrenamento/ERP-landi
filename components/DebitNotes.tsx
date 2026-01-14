
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FilePlus, 
  MoreHorizontal, 
  Download, 
  X, 
  AlertCircle, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import { MOCK_DEBIT_NOTES, MOCK_CLIENTS } from '../constants';
import { DebitNote } from '../types';

const DebitNotes: React.FC = () => {
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>(MOCK_DEBIT_NOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    invoiceId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reason: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredNotes = debitNotes.filter(note => {
    const matchesSearch = 
      note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || note.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Applied': return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Aplicada' };
      case 'Pending': return { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: Clock, label: 'Pendente' };
      case 'Cancelled': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, label: 'Cancelada' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: FileText, label: status };
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.clientName) newErrors.clientName = "Cliente é obrigatório";
    if (!formData.invoiceId) newErrors.invoiceId = "Fatura de referência é obrigatória";
    if (!formData.amount || Number(formData.amount) <= 0) newErrors.amount = "Valor deve ser maior que zero";
    if (!formData.reason.trim()) newErrors.reason = "Motivo da emissão é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedClient = MOCK_CLIENTS.find(c => c.name === formData.clientName);
      const newNote: DebitNote = {
        id: `ND-${new Date().getFullYear()}/${(debitNotes.length + 1).toString().padStart(3, '0')}`,
        invoiceId: formData.invoiceId,
        clientId: selectedClient?.id || '0',
        clientName: formData.clientName,
        date: formData.date,
        reason: formData.reason,
        amount: Number(formData.amount),
        status: 'Pending'
      };

      setDebitNotes([newNote, ...debitNotes]);
      setIsModalOpen(false);
      setFormData({ clientName: '', invoiceId: '', date: new Date().toISOString().split('T')[0], amount: '', reason: '' });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FilePlus className="text-brand-600 dark:text-brand-400" />
            Notas de Débito
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Emita retificações para aumentar o valor de faturas emitidas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Nova Nota de Débito</span>
          </button>
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
              placeholder="Buscar por cliente, ND ou Fatura..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Pending', 'Applied', 'Cancelled'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        statusFilter === status 
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {status === 'Todos' ? 'Todas' : getStatusConfig(status).label}
                </button>
            ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Ref. Fatura</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Valor (MZN)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredNotes.map((note) => {
                const statusInfo = getStatusConfig(note.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                      {note.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                      {note.invoiceId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white font-medium">{note.clientName}</div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs truncate max-w-[200px]" title={note.reason}>
                        {note.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(note.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(note.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex justify-end gap-2">
                        <button title="Baixar PDF" className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                          <Download size={16} />
                        </button>
                        <button title="Mais Opções" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredNotes.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma nota de débito encontrada.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Debit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <FilePlus className="text-brand-600" size={20}/>
                Nova Nota de Débito
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente <span className="text-red-500">*</span></label>
                <select
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.clientName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                >
                  <option value="">Selecione um cliente</option>
                  {MOCK_CLIENTS.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.clientName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.clientName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fatura Referência (ID) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="invoiceId"
                  value={formData.invoiceId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.invoiceId ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                  placeholder="Ex: FAT-2023/001"
                />
                {errors.invoiceId && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.invoiceId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Emissão</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-200 dark:border-gray-600"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor (MZN) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="amount"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Motivo da Retificação <span className="text-red-500">*</span></label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.reason ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                  placeholder="Descreva o motivo..."
                />
                {errors.reason && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.reason}</p>}
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
                  <FilePlus size={16} />
                  Emitir Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitNotes;
