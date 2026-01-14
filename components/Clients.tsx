
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, X, AlertCircle } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { logUserAction } from '../services/auditLogger';

const Clients: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    nuit: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nome da empresa é obrigatório";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Pessoa de contato é obrigatória";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de e-mail inválido";
    }
    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (formData.phone.replace(/\D/g, '').length < 9) {
      newErrors.phone = "Telefone deve ter pelo menos 9 dígitos";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert(`Cliente cadastrado com sucesso!`);
      await logUserAction('Criar Cliente', 'Terceiros', `Novo cliente: ${formData.name} (NUIT: ${formData.nuit || 'N/A'})`);
      setIsModalOpen(false);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', nuit: '' });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="space-y-6" id="printable-area">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestão de Clientes</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie sua base de clientes e contatos.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar cliente..." className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"/>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
            <Plus size={18} />
            <span className="hidden sm:inline">Novo Cliente</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Empresa</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Contato</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Última Interação</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {MOCK_CLIENTS.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                    <div className="text-gray-400 text-xs">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700 dark:text-gray-300">{client.contactPerson}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {client.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(client.lastInteraction).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-right no-print">
                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pessoa de Contato <span className="text-red-500">*</span></label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"/>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
