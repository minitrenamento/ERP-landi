
import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Plus, 
  Search, 
  Edit2, 
  Shield, 
  CheckCircle, 
  XCircle,
  Activity,
  Clock,
  Trash2
} from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { SystemUser, SystemLog } from '../types';
import { subscribeToAuditLogs } from '../services/auditLogger';

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Users' | 'Monitoring'>('Users');
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    const unsubscribe = subscribeToAuditLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200';
      case 'Manager': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
      case 'Finance': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200';
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('Login')) return 'text-green-600 dark:text-green-400';
    if (action.includes('Logout')) return 'text-gray-500 dark:text-gray-400';
    if (action.includes('Erro') || action.includes('Falha')) return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UsersIcon className="text-brand-600 dark:text-brand-400" />
            Gestão de Usuários
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Administre contas e monitore atividades do sistema.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg no-print">
          <button
            onClick={() => setActiveTab('Users')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'Users' ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Contas
          </button>
          <button
            onClick={() => setActiveTab('Monitoring')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'Monitoring' ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Activity size={16} />
            Monitoramento
          </button>
        </div>
      </div>

      {activeTab === 'Users' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuário..." 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">Usuário</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Função</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Departamento</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.department || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle size={14} /> {user.status === 'Active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Clock size={18} /> Atividades Recentes (Real-time)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Data/Hora</th>
                    <th className="px-6 py-4 font-semibold">Usuário</th>
                    <th className="px-6 py-4 font-semibold">Módulo</th>
                    <th className="px-6 py-4 font-semibold">Ação</th>
                    <th className="px-6 py-4 font-semibold">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                        {log.timestamp.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                        {log.userName}
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {log.module}
                        </span>
                      </td>
                      <td className={`px-6 py-3 font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs italic">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                        Nenhuma atividade registrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
