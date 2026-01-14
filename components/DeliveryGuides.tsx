
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
  Clock,
  FileText,
  Trash2
} from 'lucide-react';
import { MOCK_DELIVERY_GUIDES, MOCK_CLIENTS } from '../constants';
import { DeliveryGuide, DeliveryGuideItem } from '../types';

const DeliveryGuides: React.FC = () => {
  const [guides, setGuides] = useState<DeliveryGuide[]>(MOCK_DELIVERY_GUIDES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Form State
  const [client, setClient] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  
  const [items, setItems] = useState<DeliveryGuideItem[]>([
    { id: '1', description: '', quantity: 1, unit: 'Un' }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredGuides = guides.filter(g => {
    const matchesSearch = 
      g.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Delivered': return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, label: 'Entregue' };
      case 'In Transit': return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Truck, label: 'Em Trânsito' };
      case 'Draft': return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: FileText, label: 'Rascunho' };
      case 'Cancelled': return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: X, label: 'Cancelado' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: FileText, label: status };
    }
  };

  // Form Logic
  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unit: 'Un' }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof DeliveryGuideItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!client) newErrors.client = "Cliente é obrigatório";
    if (!deliveryDate) newErrors.deliveryDate = "Data de entrega é obrigatória";
    if (!deliveryAddress.trim()) newErrors.deliveryAddress = "Endereço de entrega é obrigatório";
    if (items.some(i => !i.description.trim())) newErrors.items = "Preencha a descrição de todos os itens";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedClient = MOCK_CLIENTS.find(c => c.name === client);
      const newGuide: DeliveryGuide = {
        id: `GR-${new Date().getFullYear()}/${(guides.length + 1).toString().padStart(3, '0')}`,
        clientId: selectedClient?.id || '0',
        clientName: client,
        date,
        deliveryDate,
        status: 'Draft',
        deliveryAddress,
        driverName,
        vehiclePlate,
        items
      };

      setGuides([newGuide, ...guides]);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setClient('');
    setDeliveryDate('');
    setDeliveryAddress('');
    setDriverName('');
    setVehiclePlate('');
    setItems([{ id: '1', description: '', quantity: 1, unit: 'Un' }]);
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Truck className="text-brand-600 dark:text-brand-400" />
            Guias de Remessa
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie o transporte e entrega de mercadorias.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            <span>Nova Guia</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
               <Truck size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 dark:text-gray-400">Em Trânsito</p>
               <p className="text-2xl font-bold text-gray-800 dark:text-white">{guides.filter(g => g.status === 'In Transit').length}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
               <CheckCircle size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 dark:text-gray-400">Entregues (Mês)</p>
               <p className="text-2xl font-bold text-gray-800 dark:text-white">{guides.filter(g => g.status === 'Delivered').length}</p>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
               <FileText size={24} />
            </div>
            <div>
               <p className="text-sm text-gray-500 dark:text-gray-400">Rascunhos</p>
               <p className="text-2xl font-bold text-gray-800 dark:text-white">{guides.filter(g => g.status === 'Draft').length}</p>
            </div>
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
              placeholder="Buscar por cliente, ID, endereço..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
            />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['Todos', 'Draft', 'In Transit', 'Delivered', 'Cancelled'].map(status => (
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
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Emissão</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Destino</th>
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
                      <div className="text-gray-900 dark:text-white font-medium">{guide.clientName}</div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs">
                        {guide.items.length} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(guide.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 max-w-[200px] truncate" title={guide.deliveryAddress}>
                          <MapPin size={14} className="flex-shrink-0 text-gray-400" />
                          <span className="truncate">{guide.deliveryAddress}</span>
                       </div>
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
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <Package size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhuma guia de remessa encontrada.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Guide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="text-brand-600" size={20}/>
                Nova Guia de Remessa
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente <span className="text-red-500">*</span></label>
                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.client ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            >
                                <option value="">Selecione...</option>
                                {MOCK_CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            {errors.client && <p className="text-xs text-red-500">{errors.client}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Emissão</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Entrega <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.deliveryDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                            />
                            {errors.deliveryDate && <p className="text-xs text-red-500">{errors.deliveryDate}</p>}
                        </div>
                    </div>

                    {/* Logistics Section */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg space-y-4">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <MapPin size={16} /> Dados de Logística
                        </h4>
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço de Entrega <span className="text-red-500">*</span></label>
                             <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Endereço completo do local de entrega"
                                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                    errors.deliveryAddress ? 'border-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-500'
                                }`}
                             />
                             {errors.deliveryAddress && <p className="text-xs text-red-500">{errors.deliveryAddress}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Motorista (Opcional)</label>
                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    placeholder="Nome do motorista"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Matrícula (Opcional)</label>
                                <input
                                    type="text"
                                    value={vehiclePlate}
                                    onChange={(e) => setVehiclePlate(e.target.value)}
                                    placeholder="AAA-000-MC"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                                />
                             </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200">Itens da Carga</h4>
                            <button type="button" onClick={handleAddItem} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                                <Plus size={16} /> Adicionar Item
                            </button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                                    <div className="col-span-6 md:col-span-6">
                                        <label className="text-xs text-gray-500 mb-1 block">Descrição do Item</label>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            placeholder="Ex: Caixa de Papel..."
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
                                    <div className="col-span-3 md:col-span-3">
                                        <label className="text-xs text-gray-500 mb-1 block">Unidade</label>
                                        <select
                                            value={item.unit}
                                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                            className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                                        >
                                            <option value="Un">Unidade</option>
                                            <option value="Cx">Caixa</option>
                                            <option value="Kg">Kg</option>
                                            <option value="L">Litro</option>
                                            <option value="Palete">Palete</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1 md:col-span-1 flex justify-center">
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
                        <Truck size={16} />
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

export default DeliveryGuides;
