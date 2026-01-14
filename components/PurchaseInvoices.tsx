
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  FileText, 
  Filter, 
  MoreHorizontal, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  X,
  Trash2,
  Truck
} from 'lucide-react';
import { MOCK_PURCHASE_INVOICES, MOCK_SUPPLIERS } from '../constants';
import { PurchaseInvoice, PurchaseInvoiceItem } from '../types';

const PurchaseInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(MOCK_PURCHASE_INVOICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Form State
  const [supplierId, setSupplierId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<PurchaseInvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.referenceNumber && inv.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'Todos' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Paid': return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Pago' };
      case 'Pending': return { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', icon: Clock, label: 'Pendente' };
      case 'Overdue': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: AlertTriangle, label: 'Atrasado' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: FileText, label: status };
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

  const handleItemChange = (id: string, field: keyof PurchaseInvoiceItem, value: any) => {
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
    if (!supplierId) newErrors.supplierId = "Fornecedor é obrigatório";
    if (!date) newErrors.date = "Data de emissão é obrigatória";
    if (!dueDate) newErrors.dueDate = "Data de vencimento é obrigatória";
    
    if (items.some(i => !i.description.trim())) newErrors.items = "Preencha a descrição de todos os itens";
    if (items.some(i => i.quantity <= 0 || i.unitPrice <= 0)) newErrors.items = "Quantidade e preço devem ser positivos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedSupplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      
      const newInvoice: PurchaseInvoice = {
        id: `FC-${new Date().getFullYear()}/${(invoices.length + 1).toString().padStart(3, '0')}`,
        supplierId: supplierId,
        supplierName: selectedSupplier?.name || 'Desconhecido',
        date,
        dueDate,
        referenceNumber,
        items,
        totalAmount,
        status: 'Pending'
      };

      setInvoices([newInvoice, ...invoices]);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSupplierId('');
    setReferenceNumber('');
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setErrors({});
  };

  const calculateTotal = () => {
      return items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Truck className="text-brand-600 dark:text-brand-400" />
            Faturas de Compra
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Registre e gerencie compras de fornecedores.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Nova Compra</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 text-xs font-medium uppercase">Total em Aberto</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(
                    invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0)
                )}
            </p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-red-600 text-xs font-medium uppercase">Vencidas</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                 {invoices.filter(i => i.status === 'Overdue').length}
            </p>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-blue-600 text-xs font-medium uppercase">Compras do Mês</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{invoices.length}</p>
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
              placeholder="Buscar por fornecedor, ID..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Paid', 'Pending', 'Overdue'].map(status => (
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
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">ID Interno</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Fornecedor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Ref. Externa</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Emissão</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Vencimento</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Total (MZN)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredInvoices.map((inv) => {
                const statusInfo = getStatusConfig(inv.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                      {inv.id}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {inv.supplierName}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {inv.referenceNumber || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(inv.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                      {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(inv.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex justify-end gap-2">
                        <button title="Baixar" className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
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
              {filteredInvoices.length === 0 && (
                <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <FileText size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhuma fatura de compra encontrada.</p>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-brand-600" size={20}/>
                Lançar Fatura de Compra
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2 lg:col-span-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fornecedor <span className="text-red-500">*</span></label>
                            <select
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.supplierId ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            >
                                <option value="">Selecione...</option>
                                {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplierId && <p className="text-xs text-red-500">{errors.supplierId}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ref. Fatura Fornecedor</label>
                            <input
                                type="text"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Ex: INV-9988"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Emissão <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Vencimento <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.dueDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            />
                            {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
                        </div>
                    </div>

                    {/* Items Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Itens da Fatura</h4>
                            <button type="button" onClick={handleAddItem} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                                <Plus size={16} /> Adicionar Item
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                                    <div className="col-span-5 md:col-span-5">
                                        <label className="text-xs text-gray-500 mb-1 block">Descrição do Produto/Serviço</label>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            placeholder="Ex: Material de Limpeza"
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

                    {/* Footer Totals */}
                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-right">
                            <span className="text-gray-500 dark:text-gray-400 text-sm mr-4">Total da Fatura:</span>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(calculateTotal())}
                            </span>
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
                        <CheckCircle size={16} />
                        Lançar Compra
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseInvoices;
