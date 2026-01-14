
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle, 
  Briefcase, 
  Tag, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  FileText,
  Percent
} from 'lucide-react';
import { MOCK_SERVICES } from '../constants';
import { Service } from '../types';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    unit: 'Hora',
    taxRate: '16',
    status: 'Active'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filters
  const filteredServices = services.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome do serviço é obrigatório";
    if (!formData.code.trim()) newErrors.code = "Código é obrigatório";
    
    // Check Unique Code
    const isCodeDuplicate = services.some(s => 
      s.code.toLowerCase() === formData.code.toLowerCase() && 
      (modalMode === 'create' || s.id !== currentServiceId)
    );
    if (isCodeDuplicate) newErrors.code = "Este código já está em uso";

    if (!formData.price) {
        newErrors.price = "Preço é obrigatório";
    } else if (Number(formData.price) <= 0) {
        newErrors.price = "Preço deve ser maior que zero";
    }

    if (!formData.taxRate) newErrors.taxRate = "Taxa de IVA é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (modalMode === 'create') {
        const newService: Service = {
            id: (Math.max(0, ...services.map(s => parseInt(s.id))) + 1).toString(),
            code: formData.code.toUpperCase(),
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            unit: formData.unit as any,
            taxRate: Number(formData.taxRate),
            status: 'Active'
        };
        setServices([newService, ...services]);
      } else {
        setServices(services.map(s => s.id === currentServiceId ? {
            ...s,
            code: formData.code.toUpperCase(),
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            unit: formData.unit as any,
            taxRate: Number(formData.taxRate)
        } : s));
      }
      closeModal();
    }
  };

  const openCreateModal = () => {
      setModalMode('create');
      // Auto-generate code
      const nextId = (Math.max(0, ...services.map(s => parseInt(s.id))) + 1).toString().padStart(3, '0');
      setFormData({ 
          code: `SRV-${nextId}`, 
          name: '', 
          description: '', 
          price: '', 
          unit: 'Hora', 
          taxRate: '16', 
          status: 'Active' 
        });
      setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
      setModalMode('edit');
      setCurrentServiceId(service.id);
      setFormData({
          code: service.code,
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          unit: service.unit,
          taxRate: service.taxRate.toString(),
          status: service.status
      });
      setIsModalOpen(true);
  };

  const toggleStatus = (id: string) => {
      setServices(services.map(s => s.id === id ? {
          ...s,
          status: s.status === 'Active' ? 'Inactive' : 'Active'
      } : s));
  };

  const deleteService = (id: string) => {
      if (window.confirm("Tem certeza que deseja remover este serviço?")) {
          setServices(services.filter(s => s.id !== id));
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Tag className="text-brand-600 dark:text-brand-400" />
            Catálogo de Serviços
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Gerencie os serviços prestados, preços e taxas aplicáveis.
          </p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium w-full lg:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
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
              placeholder="Buscar serviço, código..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm shadow-sm"
            />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Código</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Serviço</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Preço Unit.</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Unidade</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Imposto</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                     <span className="font-mono text-gray-500 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {service.code}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{service.name}</div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 max-w-[250px] truncate">
                      {service.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(service.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      <Clock size={10} />
                      {service.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {service.taxRate}% IVA
                  </td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={() => toggleStatus(service.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            service.status === 'Active' 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100' 
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {service.status === 'Active' ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right no-print">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(service)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                                <Briefcase size={24} className="text-gray-400" />
                            </div>
                            <p className="font-medium">Nenhum serviço encontrado</p>
                        </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                {modalMode === 'create' ? <Plus className="text-brand-600" size={20}/> : <Edit2 className="text-brand-600" size={20}/>}
                {modalMode === 'create' ? 'Novo Serviço' : 'Editar Serviço'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Código <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all uppercase font-mono text-sm ${
                        errors.code ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                        placeholder="SRV-000"
                    />
                    {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Serviço <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                        }`}
                        placeholder="Ex: Consultoria..."
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                  placeholder="Detalhes sobre o serviço..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preço (MZN) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.price ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                            }`}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unidade</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="Hora">Por Hora</option>
                        <option value="Dia">Por Dia</option>
                        <option value="Mês">Mensal</option>
                        <option value="Projeto">Por Projeto</option>
                        <option value="Fixo">Valor Fixo</option>
                        <option value="Unidade">Por Unidade</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">IVA (%)</label>
                    <div className="relative">
                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            name="taxRate"
                            value={formData.taxRate}
                            onChange={handleChange}
                            className={`w-full pl-8 pr-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                            errors.taxRate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                            }`}
                        />
                    </div>
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
                  className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
