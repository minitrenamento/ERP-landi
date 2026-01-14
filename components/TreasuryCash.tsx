
import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Download, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  MoreHorizontal,
  X,
  Save,
  Calendar,
  FileText
} from 'lucide-react';
import { MOCK_CASH_TRANSACTIONS } from '../constants';
import { CashTransaction } from '../types';

const TreasuryCash: React.FC = () => {
  const [transactions, setTransactions] = useState<CashTransaction[]>(MOCK_CASH_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'In' | 'Out'>('In');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Derived Data
  const currentBalance = transactions.reduce((acc, t) => t.type === 'In' ? acc + t.amount : acc - t.amount, 0);
  const totalIn = transactions.filter(t => t.type === 'In').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'Out').reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openModal = (type: 'In' | 'Out') => {
    setModalType(type);
    setAmount('');
    setDescription('');
    setCategory('');
    setReference('');
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || Number(amount) <= 0) newErrors.amount = "Valor inválido";
    if (!description.trim()) newErrors.description = "Descrição obrigatória";
    if (!category.trim()) newErrors.category = "Categoria obrigatória";
    
    if (modalType === 'Out' && Number(amount) > currentBalance) {
        newErrors.amount = "Saldo insuficiente em caixa";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTransaction: CashTransaction = {
      id: `CX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: modalType,
      amount: Number(amount),
      description,
      category,
      reference,
      responsible: 'Admin User' // Em um app real, pegar do contexto de auth
    };

    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Wallet className="text-brand-600 dark:text-brand-400" />
            Caixa (Tesouraria)
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gestão de movimentos diários e saldo de caixa.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => openModal('In')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={16} />
            <span>Entrada</span>
          </button>
          <button 
            onClick={() => openModal('Out')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <Minus size={16} />
            <span>Saída</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-600 p-5 rounded-xl text-white shadow-lg shadow-brand-600/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-brand-100 text-xs font-medium uppercase">Saldo Atual</p>
              <h3 className="text-3xl font-bold mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(currentBalance)}
              </h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-xs text-brand-200">Disponível para movimentação</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Total Entradas</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                +{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalIn)}
              </h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              <ArrowUpCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">Total Saídas</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                -{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalOut)}
              </h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
              <ArrowDownCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar movimento..." 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                 <Filter size={16} />
                 <span>Filtros</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                 <Download size={16} />
                 <span>Exportar</span>
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Descrição</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Responsável</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor (MZN)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{t.description}</div>
                    {t.reference && <div className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{t.reference}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {t.responsible}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'In' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'In' ? '+' : '-'} {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex p-1 rounded-full ${t.type === 'In' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                       {t.type === 'In' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma movimentação encontrada.
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className={`flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 ${modalType === 'In' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${modalType === 'In' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {modalType === 'In' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                Registrar {modalType === 'In' ? 'Entrada' : 'Saída'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor (MZN) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.amount ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                />
                {errors.amount && <p className="text-xs text-red-500 flex items-center gap-1">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Compra material escritório"
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500 flex items-center gap-1">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria <span className="text-red-500">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.category ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Despesas Gerais">Despesas Gerais</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 flex items-center gap-1">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Referência (Doc)</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: FT-001/23"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
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
                  className={`px-6 py-2 rounded-lg text-white transition-colors text-sm font-medium shadow-sm flex items-center gap-2 ${modalType === 'In' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  <Save size={16} />
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasuryCash;
