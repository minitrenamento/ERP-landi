
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { DashboardCard } from './components/DashboardCard';
import { RecentClientsTable } from './components/RecentClientsTable';
import { RevenueChart } from './components/RevenueChart';
import { StockManagement } from './components/StockManagement';
import { ClientManagement } from './components/ClientManagement';
import { QuotationManagement } from './components/QuotationManagement';
import { DASHBOARD_METRICS, RECENT_INVOICES, NAV_ITEMS } from './constants-1';
import { ViewState } from './types-1';
import { Menu, Bell, Search, User, Calendar as CalendarIcon, FilePlus, Download } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Set today's date on mount
  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {DASHBOARD_METRICS.map((metric, index) => (
                <DashboardCard key={index} metric={metric} />
              ))}
            </div>

            {/* Main Content Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>

              {/* Mini Calendar / Quick Actions / Summary */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-semibold text-lg mb-1">Acesso Rápido</h3>
                    <p className="text-brand-100 text-sm mb-6">Crie novos documentos instantaneamente.</p>
                    
                    <div className="space-y-3">
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 flex items-center transition-colors">
                            <div className="bg-white text-brand-700 p-1.5 rounded mr-3">
                                <FilePlus size={16} />
                            </div>
                            <span className="text-sm font-medium">Nova Fatura</span>
                        </button>
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 flex items-center transition-colors">
                             <div className="bg-white text-brand-700 p-1.5 rounded mr-3">
                                <FilePlus size={16} />
                            </div>
                            <span className="text-sm font-medium">Novo Recibo</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Calendário</h4>
                        <CalendarIcon size={16} className="text-gray-400" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{currentDate.split(',')[0]}</p>
                        <p className="text-3xl font-bold text-gray-800">{new Date().getDate()}</p>
                        <p className="text-sm text-gray-600 mt-1">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-gray-600">Vencimento Faturas (2)</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-gray-600">Reunião de Clientes</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Table Section - Full width within the grid or span */}
              <div className="xl:col-span-3">
                <RecentClientsTable />
              </div>
            </div>
          </>
        );
      
      case 'stocks':
        return <StockManagement />;

      case 'clientes':
        return <ClientManagement />;

      case 'cotacao':
        return <QuotationManagement />;

      case 'faturas':
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Gestão de Faturas</h2>
                    <button className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors flex items-center text-sm">
                        <FilePlus size={16} className="mr-2"/> Nova Fatura
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Valor (MT)</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {RECENT_INVOICES.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-brand-600">{inv.id}</td>
                                    <td className="px-4 py-3 text-gray-800">{inv.clientName}</td>
                                    <td className="px-4 py-3 text-gray-600 text-sm">{inv.date}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{inv.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            inv.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 
                                            inv.status === 'Pendente' ? 'bg-amber-100 text-amber-800' : 
                                            'bg-rose-100 text-rose-800'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-gray-400 hover:text-brand-600"><Download size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <FilePlus className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2">{currentView}</h2>
            <p className="text-gray-500 max-w-md">
              O módulo de {currentView} está pronto para ser integrado. A estrutura está completa.
            </p>
            <button className="mt-6 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
              Criar Novo Item
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view: any) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        navItems={NAV_ITEMS}
        onLogout={() => console.log('Logout clicked')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none mr-4"
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden md:flex items-center text-gray-500 text-sm">
                <span className="font-medium text-gray-900 capitalize">{currentView}</span>
                <span className="mx-2 text-gray-300">/</span>
                <span>{currentDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input 
                  type="text" 
                  placeholder="Pesquisar..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent w-64"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-brand-600 transition-colors rounded-full hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="flex items-center pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end mr-3 hidden sm:flex">
                    <span className="text-sm font-semibold text-gray-800">Admin User</span>
                    <span className="text-xs text-gray-500">Landi Consultores</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 border-2 border-white shadow-sm">
                    <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
          
          <footer className="mt-12 mb-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Landi Consultores. Todos os direitos reservados.
          </footer>
        </main>
      </div>
    </div>
  );
}
