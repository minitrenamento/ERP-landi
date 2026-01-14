
import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Save, 
  Upload, 
  FileText,
  Briefcase
} from 'lucide-react';
import { MOCK_COMPANY_INFO } from '../constants';
import { CompanySettings } from '../types';

const CompanyDetails: React.FC = () => {
  const [formData, setFormData] = useState<CompanySettings>(MOCK_COMPANY_INFO);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSaved) setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API save
    setTimeout(() => {
        setIsSaved(true);
        // In a real app, update the global context or trigger a refetch here
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Building2 className="text-brand-600 dark:text-brand-400" />
            Detalhes da Empresa
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie as informações principais da sua organização.</p>
        </div>
        <button 
            onClick={handleSubmit}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium shadow-sm transition-all ${
                isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'
            }`}
        >
            <Save size={18} />
            {isSaved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branding */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center">
                <div className="relative group cursor-pointer mb-4">
                    <div className="w-32 h-32 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 border-2 border-dashed border-brand-200 dark:border-brand-700 overflow-hidden">
                        {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-4xl font-bold">LC</div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="text-white" size={24} />
                    </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{formData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Consultoria & Gestão</p>
                <button className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
                    Alterar Logotipo
                </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2 flex items-center gap-2">
                    <Briefcase size={16} /> Sobre a Licença
                </h4>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                    <p><span className="font-medium">Plano:</span> Enterprise</p>
                    <p><span className="font-medium">Validade:</span> 31 Dez 2025</p>
                    <p><span className="font-medium">Estado:</span> Ativo</p>
                </div>
            </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* General Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Informações Gerais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Empresa <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NUIT <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="nuit"
                            value={formData.nuit}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </div>
            </div>

            {/* Contacts */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Contactos & Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail Principal</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                        <div className="relative">
                            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                name="website"
                                value={formData.website || ''}
                                onChange={handleChange}
                                placeholder="www.exemplo.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço Físico</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Província</label>
                            <input 
                                type="text" 
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    Configuração de Documentos
                </h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nota de Rodapé Padrão (Faturas/Cotações)</label>
                    <div className="relative">
                        <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                        <textarea 
                            name="invoiceFooterNote"
                            value={formData.invoiceFooterNote || ''}
                            onChange={handleChange}
                            rows={3}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            placeholder="Ex: Processado por Computador"
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Este texto aparecerá no rodapé de todos os documentos emitidos.</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
