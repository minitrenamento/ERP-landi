
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Truck, 
  MoreHorizontal, 
  Printer, 
  X, 
  AlertCircle, 
  Filter,
  MapPin,
  Package,
  CheckCircle,
  FileText,
  Trash2,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';
import { MOCK_TRANSPORT_GUIDES, MOCK_CLIENTS } from '../constants';
import { TransportGuide, TransportGuideItem } from '../types';

const TransportGuides: React.FC = () => {
  const [guides, setGuides] = useState<TransportGuide[]>(MOCK_TRANSPORT_GUIDES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    expiryDate: '',
    originAddress: 'Sede - Landi Consultores',
    destinationAddress: '',
    carrierName: 'Próprio',
    driverName: '',
    driverLicense: '',
    vehiclePlate: '',
    vehicleMake: ''
  });

  const [items, setItems] = useState<TransportGuideItem[]>([
    { id: '1', description: '', quantity: 1, unit: 'Un', weight: 0 }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredGuides = guides.filter(g => {
    const matchesSearch = 
      g.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Completed': return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Concluído' };
      case 'Issued': return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Truck, label: 'Emitido' };
      case 'Draft': return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: FileText, label: 'Rascunho' };
      case 'Cancelled': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: X, label: 'Cancelado' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: FileText, label: status };
    }
  };

  // Form Handlers
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unit: 'Un', weight: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof TransportGuideItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerName) newErrors.customerName = "Cliente é obrigatório";
    if (!formData.destinationAddress) newErrors.destinationAddress = "Destino é obrigatório";
    if (!formData.vehiclePlate) newErrors.vehiclePlate = "Matrícula é obrigatória";
    if (!formData.driverName) newErrors.driverName = "Motorista é obrigatório";
    if (!formData.expiryDate) newErrors.expiryDate = "Validade é obrigatória";
    
    if (items.some(i => !i.description.trim())) newErrors.items = "Preencha a descrição dos itens";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newGuide: TransportGuide = {
        id: `GT-${new Date().getFullYear()}/${(guides.length + 1).toString().padStart(3, '0')}`,
        ...formData,
        status: 'Draft',
        items
      };

      setGuides([newGuide, ...guides]);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        expiryDate: '',
        originAddress: 'Sede - Landi Consultores',
        destinationAddress: '',
        carrierName: 'Próprio',
        driverName: '',
        driverLicense: '',
        vehiclePlate: '',
        vehicleMake: ''
    });
    setItems([{ id: '1', description: '', quantity: 1, unit: 'Un', weight: 0 }]);
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Truck className="text-brand-600 dark:text-brand-400" />
            Guias de Transporte
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Controle de transporte e circulação de mercadorias.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Nova Guia de Transporte</span>
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
              placeholder="Buscar por cliente, ID, matrícula..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Draft', 'Issued', 'Completed', 'Cancelled'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        statusFilter === status 
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {status === 'Todos' ? 'Todos' : getStatusConfig(status).label}
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
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente/Destinatário</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Rota</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Viatura / Motorista</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Validade</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredGuides.map((guide) => {
                const statusInfo = getStatusConfig(guide.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={guide.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                      {guide.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white font-medium">{guide.customerName}</div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                         {guide.items.reduce((acc, i) => acc + i.quantity, 0)} volumes
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1 text-xs">
                           <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300" title="Origem">
                               <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                               <span className="truncate max-w-[120px]">{guide.originAddress}</span>
                           </div>
                           <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300" title="Destino">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                               <span className="truncate max-w-[120px]">{guide.destinationAddress}</span>
                           </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-gray-800 dark:text-white font-medium text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit mb-1">
                            {guide.vehiclePlate}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1">
                            <User size={10} /> {guide.driverName}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                      Até {new Date(guide.expiryDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex justify-end gap-2">
                        <button title="Imprimir" className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                          <Printer size={16} />
                        </button>
                        <button title="Mais Opções" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredGuides.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <Truck size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhuma guia de transporte encontrada.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transport Guide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-brand-600" size={20}/>
                Nova Guia de Transporte
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Dates & Client */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente/Destinatário <span className="text-red-500">*</span></label>
                            <select
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.customerName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            >
                                <option value="">Selecione...</option>
                                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            {errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Emissão</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Válido Até <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.expiryDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            />
                            {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
                        </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <MapPin size={16} /> Itinerário
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Local de Carga (Origem)</label>
                                <input
                                    type="text"
                                    name="originAddress"
                                    value={formData.originAddress}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Local de Descarga (Destino) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="destinationAddress"
                                    value={formData.destinationAddress}
                                    onChange={handleChange}
                                    placeholder="Endereço de destino"
                                    className={`w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                                        errors.destinationAddress ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                                    }`}
                                />
                                {errors.destinationAddress && <p className="text-xs text-red-500">{errors.destinationAddress}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Vehicle & Driver */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Viatura (Matrícula) <span className="text-red-500">*</span></label>
                             <input
                                type="text"
                                name="vehiclePlate"
                                value={formData.vehiclePlate}
                                onChange={handleChange}
                                placeholder="AAA-000-MC"
                                className={`w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white uppercase focus:outline-none focus:ring-2 transition-all ${
                                    errors.vehiclePlate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                             />
                             {errors.vehiclePlate && <p className="text-xs text-red-500">{errors.vehiclePlate}</p>}
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marca/Modelo</label>
                             <input
                                type="text"
                                name="vehicleMake"
                                value={formData.vehicleMake}
                                onChange={handleChange}
                                placeholder="Ex: Toyota Hino"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Motorista <span className="text-red-500">*</span></label>
                             <input
                                type="text"
                                name="driverName"
                                value={formData.driverName}
                                onChange={handleChange}
                                placeholder="Nome completo"
                                className={`w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.driverName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                             />
                             {errors.driverName && <p className="text-xs text-red-500">{errors.driverName}</p>}
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Carta de Condução</label>
                             <input
                                type="text"
                                name="driverLicense"
                                value={formData.driverLicense}
                                onChange={handleChange}
                                placeholder="Nº da Carta"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                        </div>
                    </div>

                    {/* Items Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Mercadoria</h4>
                            <button type="button" onClick={handleAddItem} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                                <Plus size={16} /> Adicionar Item
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                                    <div className="col-span-5 md:col-span-6">
                                        <label className="text-xs text-gray-500 mb-1 block">Descrição</label>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            placeholder="Ex: Cimento..."
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
                                    <div className="col-span-2 md:col-span-2">
                                        <label className="text-xs text-gray-500 mb-1 block">Peso (Kg)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.weight}
                                            onChange={(e) => handleItemChange(item.id, 'weight', Number(e.target.value))}
                                            className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-3 md:col-span-1 flex justify-center">
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
                        <CreditCard size={16} />
                        Emitir Guia
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportGuides;
