
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  X, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Filter, 
  Download, 
  Trash2, 
  Edit2, 
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { MOCK_SUPPLIERS } from '../constants';
import { Supplier } from '../types';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    nuit: '',
    category: '',
    address: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filtering Logic
  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nuit?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome do fornecedor é obrigatório";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Pessoa de contato é obrigatória";
    if (!formData.category.trim()) newErrors.category = "Categoria é obrigatória";
    
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

    if (formData.nuit) {
      if (!/^\d{9}$/.test(formData.nuit)) {
        newErrors.nuit = "NUIT deve conter exatamente 9 dígitos numéricos";
      } else if (modalMode === 'create' && suppliers.some(s => s.nuit === formData.nuit)) {
        newErrors.nuit = "Este NUIT já está cadastrado para outro fornecedor";
      } else if (modalMode === 'edit' && suppliers.some(s => s.nuit === formData.nuit && s.id !== currentSupplierId)) {
         newErrors.nuit = "Este NUIT já está cadastrado para outro fornecedor";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (modalMode === 'create') {
        const newSupplier: Supplier = {
            id: (Math.max(...suppliers.map(s => parseInt(s.id))) + 1).toString(),
            name: formData.name,
            contactPerson: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            nuit: formData.nuit,
            category: formData.category,
            status: 'Active',
            address: formData.address
        };
        setSuppliers([newSupplier, ...suppliers]);
      } else {
        setSuppliers(suppliers.map(s => s.id === currentSupplierId ? {
            ...s,
            name: formData.name,
            contactPerson: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            nuit: formData.nuit,
            category: formData.category,
            address: formData.address
        } : s));
      }
      
      closeModal();
    }
  };

  const openCreateModal = () => {
      setModalMode('create');
      setFormData({ name: '', contactPerson: '', email: '', phone: '', nuit: '', category: '', address: '' });
      setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
      setModalMode('edit');
      setCurrentSupplierId(supplier.id);
      setFormData({
          name: supplier.name,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          nuit: supplier.nuit || '',
          category: supplier.category,
          address: supplier.address || ''
      });
      setIsModalOpen(true);
  };

  const deleteSupplier = (id: string) => {
      if (window.confirm("Tem certeza que deseja remover este fornecedor?")) {
          setSuppliers(suppliers.filter(s => s.id !== id));
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6" id="printable-area">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Briefcase className="text-brand-600 dark:text-brand-400" />
            Gestão de Fornecedores
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gerencie sua cadeia de suprimentos, contatos e categorias de parceiros.
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium shadow-sm">
            <Download size={18} />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={18} />
            <span>Novo Fornecedor</span>
          </button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-auto">
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                statusFilter === status 
                  ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {status === 'All' ? 'Todos' : status === 'Active' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, NUIT..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm shadow-sm"
            />
        </div>
      </div>

      {/* Suppliers Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Fornecedor</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Categoria</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Contato Principal</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg border border-brand-100 dark:border-brand-800 flex-shrink-0">
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{supplier.name}</div>
                        {supplier.nuit && (
                          <div className="text-gray-400 dark:text-gray-500 text-[11px] mt-0.5 font-mono">
                            NUIT: {supplier.nuit}
                          </div>
                        )}
                        {supplier.address && (
                          <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-1 truncate max-w-[200px]" title={supplier.address}>
                            <MapPin size={10} /> {supplier.address}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700 dark:text-gray-300 font-medium">{supplier.contactPerson}</div>
                    <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1 hover:text-brand-600 transition-colors cursor-pointer">
                        <Mail size={12} /> {supplier.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} /> {supplier.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      supplier.status === 'Active' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                        : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${supplier.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {supplier.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right no-print">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(supplier)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteSupplier(supplier.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <p className="font-medium">Nenhum fornecedor encontrado</p>
                            <p className="text-sm mt-1">Tente ajustar seus filtros ou cadastre um novo fornecedor.</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Mostrando {filteredSuppliers.length} de {suppliers.length} fornecedores</span>
            <div className="flex gap-1">
                <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Anterior</button>
                <button className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Próximo</button>
            </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="text-brand-600" size={20}/> : <Edit2 className="text-brand-600" size={20}/>}
                {modalMode === 'create' ? 'Novo Fornecedor' : 'Editar Fornecedor'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Fornecedor <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                        placeholder="Ex: Papelaria Central"
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
                </div>

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
                    placeholder="Ex: Informática, Limpeza..."
                    />
                    {errors.category && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.category}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pessoa de Contato <span className="text-red-500">*</span></label>
                    <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.contactPerson ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                    placeholder="Ex: João Silva"
                    />
                    {errors.contactPerson && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.contactPerson}</p>}
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                    placeholder="email@fornecedor.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                      errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                    }`}
                    placeholder="(84) 123-4567"
                  />
                  {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NUIT (Opcional)</label>
                <input
                  type="text"
                  name="nuit"
                  value={formData.nuit}
                  onChange={handleChange}
                  maxLength={9}
                  className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.nuit ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                  }`}
                  placeholder="123456789"
                />
                <p className="text-xs text-gray-500 mt-1">Número Único de Identificação Tributária (9 dígitos)</p>
                {errors.nuit && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {errors.nuit}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço (Opcional)</label>
                <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                    placeholder="Endereço físico completo do fornecedor..."
                    />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
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
                  {modalMode === 'create' ? 'Cadastrar Fornecedor' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
