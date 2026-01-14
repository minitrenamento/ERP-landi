
import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Globe, 
  Copy,
  Save,
  X
} from 'lucide-react';
import { MOCK_BANK_ACCOUNTS } from '../constants';
import { BankAccount } from '../types';

const BankDetails: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    currency: 'MZN',
    status: 'Active'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.bankName.trim()) newErrors.bankName = "Nome do banco é obrigatório";
    if (!formData.accountNumber.trim()) newErrors.accountNumber = "Número da conta é obrigatório";
    if (!formData.currency) newErrors.currency = "Moeda é obrigatória";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (modalMode === 'create') {
        const newAccount: BankAccount = {
          id: Date.now().toString(),
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          swift: formData.swift,
          currency: formData.currency,
          status: formData.status as 'Active' | 'Inactive',
          balance: 0, // Default balance for new accounts in settings
          color: 'bg-gray-700' // Default color
        };
        setAccounts([...accounts, newAccount]);
      } else if (currentAccountId) {
        setAccounts(accounts.map(acc => acc.id === currentAccountId ? {
          ...acc,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          iban: formData.iban,
          swift: formData.swift,
          currency: formData.currency,
          status: formData.status as 'Active' | 'Inactive'
        } : acc));
      }
      closeModal();
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      bankName: '',
      accountNumber: '',
      iban: '',
      swift: '',
      currency: 'MZN',
      status: 'Active'
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (account: BankAccount) => {
    setModalMode('edit');
    setCurrentAccountId(account.id);
    setFormData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      iban: account.iban || '',
      swift: account.swift || '',
      currency: account.currency,
      status: account.status
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccountId(null);
  };

  const deleteAccount = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta conta bancária?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setAccounts(accounts.map(acc => acc.id === id ? {
      ...acc,
      status: acc.status === 'Active' ? 'Inactive' : 'Active'
    } : acc));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Building2 className="text-brand-600 dark:text-brand-400" />
            Dados Bancários
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie as contas bancárias da empresa para recebimentos e pagamentos.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} />
          <span>Adicionar Conta</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold ${account.color || 'bg-gray-600'}`}>
                    {account.bankName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{account.bankName}</h3>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      account.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {account.status === 'Active' ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(account)}
                    className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteAccount(account.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">Número da Conta</label>
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-mono text-lg font-medium mt-1">
                    <CreditCard size={18} className="text-gray-400" />
                    {account.accountNumber}
                    <span className="text-sm text-gray-400 ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{account.currency}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">IBAN</label>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mt-1 break-all">
                      {account.iban || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">SWIFT / BIC</label>
                    <div className="flex items-center gap-2 text-sm font-mono text-gray-700 dark:text-gray-300 mt-1">
                      <Globe size={14} className="text-gray-400" />
                      {account.swift || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
               <span className="text-xs text-gray-500 dark:text-gray-400">
                 Usada em {account.status === 'Active' ? 'Faturas e Cotações' : 'Nenhum documento'}
               </span>
               <button 
                 onClick={() => toggleStatus(account.id)}
                 className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                   account.status === 'Active' 
                   ? 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' 
                   : 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                 }`}
               >
                 {account.status === 'Active' ? 'Desativar Conta' : 'Ativar Conta'}
               </button>
            </div>
          </div>
        ))}

        <button 
          onClick={openCreateModal}
          className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all min-h-[280px]"
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Plus size={32} />
          </div>
          <span className="font-bold text-lg">Adicionar Nova Conta</span>
          <p className="text-sm mt-2 text-center max-w-xs">Cadastre uma nova conta bancária para exibir nos documentos e gerenciar na tesouraria.</p>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Building2 size={20} className="text-brand-600" />
                {modalMode === 'create' ? 'Nova Conta Bancária' : 'Editar Conta Bancária'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Banco <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  placeholder="Ex: BIM - Millennium"
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.bankName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                />
                {errors.bankName && <p className="text-xs text-red-500">{errors.bankName}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número da Conta <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    placeholder="123456789"
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.accountNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                  />
                  {errors.accountNumber && <p className="text-xs text-red-500">{errors.accountNumber}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Moeda <span className="text-red-500">*</span></label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="MZN">MZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">IBAN</label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({...formData, iban: e.target.value})}
                  placeholder="MZ59..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SWIFT / BIC</label>
                  <input
                    type="text"
                    value={formData.swift}
                    onChange={(e) => setFormData({...formData, swift: e.target.value})}
                    placeholder="BIMMZMA"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Active">Ativa</option>
                    <option value="Inactive">Inativa</option>
                  </select>
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
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-all text-sm font-bold flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDetails;
