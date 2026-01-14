
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Shield, 
  Activity, 
  Save, 
  Lock, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info
} from 'lucide-react';
import { MOCK_CURRENT_USER, MOCK_ACTIVITY_LOGS } from '../constants';
import { ActivityLog } from '../types';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Security' | 'Activity'>('General');
  const [user, setUser] = useState(MOCK_CURRENT_USER);
  const [logs] = useState<ActivityLog[]>(MOCK_ACTIVITY_LOGS);

  // Form States
  const [isSaved, setIsSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
        alert("As senhas não coincidem!");
        return;
    }
    alert("Senha atualizada com sucesso!");
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const getLogIcon = (type: string) => {
      switch(type) {
          case 'Success': return <CheckCircle size={16} className="text-green-500" />;
          case 'Warning': return <AlertTriangle size={16} className="text-amber-500" />;
          case 'Error': return <XCircle size={16} className="text-red-500" />;
          default: return <Info size={16} className="text-blue-500" />;
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <User className="text-brand-600 dark:text-brand-400" />
            Meu Perfil
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie suas informações pessoais e de segurança.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Card */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-400"></div>
                <div className="px-6 pb-6 relative">
                    <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 absolute -top-12 flex items-center justify-center text-3xl font-bold text-brand-600 dark:text-brand-400 shadow-sm">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="mt-14">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.role}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Mail size={16} className="text-gray-400" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone size={16} className="text-gray-400" />
                                {user.phone || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Briefcase size={16} className="text-gray-400" />
                                {user.department}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2">
                <button 
                    onClick={() => setActiveTab('General')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeTab === 'General' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    <User size={18} /> Dados Pessoais
                </button>
                <button 
                    onClick={() => setActiveTab('Security')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeTab === 'Security' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    <Shield size={18} /> Segurança
                </button>
                <button 
                    onClick={() => setActiveTab('Activity')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                        activeTab === 'Activity' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    <Activity size={18} /> Atividade Recente
                </button>
            </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[500px]">
                
                {/* GENERAL TAB */}
                {activeTab === 'General' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
                            Informações Pessoais
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                                <input 
                                    type="email" 
                                    value={user.email}
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                                <input 
                                    type="tel" 
                                    value={user.phone}
                                    onChange={(e) => setUser({...user, phone: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento</label>
                                <input 
                                    type="text" 
                                    value={user.department}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit"
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium shadow-sm transition-all ${
                                    isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'
                                }`}
                            >
                                <Save size={18} />
                                {isSaved ? 'Salvo!' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'Security' && (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
                            Alterar Senha
                        </h3>
                        <div className="max-w-md space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha Atual</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="password" 
                                        value={passwordForm.current}
                                        onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="password" 
                                        value={passwordForm.new}
                                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="password" 
                                        value={passwordForm.confirm}
                                        onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm font-medium"
                            >
                                <Shield size={18} />
                                Atualizar Senha
                            </button>
                        </div>
                    </form>
                )}

                {/* ACTIVITY TAB */}
                {activeTab === 'Activity' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">
                            Histórico de Atividade
                        </h3>
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div className="mt-1">
                                        {getLogIcon(log.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="text-sm font-medium text-gray-800 dark:text-white">{log.action}</h4>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={12} /> {log.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{log.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
