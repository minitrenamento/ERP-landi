
import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  MoreHorizontal,
  Wallet,
  Calendar,
  FileText,
  X,
  Save,
  Landmark
} from 'lucide-react';
import { MOCK_BANK_ACCOUNTS, MOCK_BANK_TRANSACTIONS } from '../constants';
import { BankAccount, BankTransaction } from '../types';

const TreasuryBanks: React.FC = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_BANK_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [transactionType, setTransactionType] = useState<'Credit' | 'Debit'>('Credit');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter Logic
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const openModal = (type: 'Credit' | 'Debit') => {
    setTransactionType(type);
    setAmount('');
    setDescription('');
    setCategory('');
    setReference('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || Number(amount) <= 0) newErrors.amount = "Valor inválido";
    if (!description.trim()) newErrors.description = "Descrição obrigatória";
    if (!selectedAccountId) newErrors.account = "Selecione uma conta";
    
    const account = accounts.find(a => a.id === selectedAccountId);
    if (transactionType === 'Debit' && account && Number(amount) > account.balance) {
        newErrors.amount = "Saldo insuficiente na conta selecionada";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!account) return;

    const newTransaction: BankTransaction = {
      id: `BT-${Date.now()}`,
      accountId: account.id,
      bankName: account.bankName,
      date,
      type: transactionType,
      amount: Number(amount),
      description,
      category: category || 'Geral',
      reference
    };

    // Update Transactions
    setTransactions([newTransaction, ...transactions]);

    // Update Account Balance
    setAccounts(accounts.map(acc => {
      if (acc.id === selectedAccountId) {
        return {
          ...acc,
          balance: transactionType === 'Credit' 
            ? acc.balance + Number(amount) 
            : acc.balance - Number(amount)
        };
      }
      return acc;
    }));

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Landmark className="text-brand-600 dark:text-brand-400" />
            Bancos (Tesouraria)
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gestão de contas bancárias e conciliação.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => openModal('Credit')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <ArrowDownLeft size={16} />
            <span>Depósito / Recebimento</span>
          </button>
          <button 
            onClick={() => openModal('Debit')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium"
          >
            <ArrowUpRight size={16} />
            <span>Pagamento / Saída</span>
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance Card */}
        <div className="bg-gray-800 dark:bg-gray-900 p-5 rounded-xl text-white shadow-lg border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase">Saldo Total Consolidado</p>
              <h3 className="text-2xl font-bold mt-1">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalBalance)}
              </h3>
            </div>
            <div className="p-2 bg-gray-700 rounded-lg">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Todas as contas</p>
        </div>

        {/* Individual Bank Accounts */}
        {accounts.map(account => (
          <div key={account.id} className={`p-5 rounded-xl text-white shadow-md relative overflow-hidden ${account.color || 'bg-brand-600'}`}>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="opacity-80" />
                <span className="font-semibold text-sm">{account.bankName}</span>
              </div>
              <span className="text-xs opacity-70 bg-black/20 px-2 py-0.5 rounded">{account.currency}</span>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs opacity-80 mb-1 font-mono tracking-wider">
                **** **** {account.accountNumber.slice(-4)}
              </p>
              <h3 className="text-xl font-bold">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: account.currency }).format(account.balance)}
              </h3>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar transação..." 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Descrição</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Banco</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Valor</th>
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
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {t.bankName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'Credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'Credit' ? '+' : '-'} {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex p-1 rounded-full ${t.type === 'Credit' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                       {t.type === 'Credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        Nenhuma transação encontrada.
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
            <div className={`flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 ${transactionType === 'Credit' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${transactionType === 'Credit' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {transactionType === 'Credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                {transactionType === 'Credit' ? 'Registrar Recebimento' : 'Registrar Pagamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conta Bancária <span className="text-red-500">*</span></label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.account ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'}`}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.bankName} ({new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: acc.currency }).format(acc.balance)})</option>
                  ))}
                </select>
                {errors.account && <p className="text-xs text-red-500">{errors.account}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor (MZN) <span className="text-red-500">*</span></label>
                    <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.amount ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                    />
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Pagamento Fornecedor X"
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Serviços, Impostos..."
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
                  className={`px-6 py-2 rounded-lg text-white transition-colors text-sm font-medium shadow-sm flex items-center gap-2 ${transactionType === 'Credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
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

export default TreasuryBanks;
