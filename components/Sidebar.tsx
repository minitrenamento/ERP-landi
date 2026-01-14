
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Bot,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  FileText,
  Truck,
  Wrench,
  Briefcase,
  Layers,
  TrendingUp,
  FileBarChart,
  Building2,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  currentView: any;
  onChangeView: (view: any) => void;
  isOpen?: boolean;
  navItems?: { id: string; label: string; icon: any }[];
  onLogout: () => void;
}

type MenuItem = 
  | { type: 'link'; id: string; label: string; icon: any }
  | { type: 'header'; label: string }
  | { type: 'group'; id: string; label: string; icon: any; children: { id: string; label: string }[] };

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen = true, onLogout }) => {
  // Set default expanded groups based on typical usage
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['sales', 'stock', 'config', 'reports', 'clients_group']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  // Menu structure based on the provided screenshots
  const menuItems: MenuItem[] = [
    { type: 'link', id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    
    // Section: Terceiros
    { type: 'header', label: 'Terceiros' },
    { 
      type: 'group', 
      id: 'clients_group', 
      label: 'Clientes', 
      icon: Users,
      children: [
        { id: 'clients_list', label: 'Listagem' },
      ]
    },
    { 
      type: 'group', 
      id: 'suppliers_group', 
      label: 'Fornecedores', 
      icon: Briefcase,
      children: [
        { id: 'suppliers_list', label: 'Listagem' },
      ]
    },

    // Section: Artigos & Serviços
    { type: 'header', label: 'Artigos & Serviços' },
    { 
      type: 'group', 
      id: 'items_services', 
      label: 'Artigos & Serviços', 
      icon: Layers,
      children: [
        { id: 'articles', label: 'Artigos' },
        { id: 'services', label: 'Serviços' },
      ]
    },

    // Section: Gestão de Vendas
    { type: 'header', label: 'Gestão de Vendas' },
    { 
      type: 'group', 
      id: 'sales', 
      label: 'Vendas', 
      icon: ShoppingCart,
      children: [
        { id: 'quotes', label: 'Cotação' },
        { id: 'invoices', label: 'Factura' },
        { id: 'debit_notes', label: 'Nota de Débito' },
        { id: 'credit_notes', label: 'Nota de Crédito' },
        { id: 'delivery_guides', label: 'Guia de Remessa' },
        { id: 'transport_guides', label: 'Guia de Transporte' },
        { id: 'cash_sales', label: 'Venda à Dinheiro' },
        { id: 'receipts', label: 'Recibos' },
      ]
    },

    // Section: Gestão de Compras
    { type: 'header', label: 'Gestão de Compras' },
    { 
      type: 'group', 
      id: 'purchases', 
      label: 'Compra Fornecedor', 
      icon: Truck,
      children: [
        { id: 'purchase_invoices', label: 'Factura de Compra' },
      ]
    },

    // Section: Gestão de Stock
    { type: 'header', label: 'Gestão de Stock' },
    { 
      type: 'group', 
      id: 'stock', 
      label: 'Stock', 
      icon: Package,
      children: [
        { id: 'stock_list', label: 'Stock Existente' },
        { id: 'stock_entry', label: 'Entrada de Stock' },
        { id: 'stock_exit', label: 'Saída de Stock' },
        { id: 'stock_settings', label: 'Definições' },
      ]
    },

    // Section: Tesouraria
    { 
      type: 'group', 
      id: 'treasury', 
      label: 'Tesouraria', 
      icon: Wallet,
      children: [
        { id: 'treasury_cash', label: 'Caixa' },
        { id: 'treasury_banks', label: 'Bancos' },
      ]
    },

    // Section: Relatórios
    { type: 'header', label: 'Relatórios' },
    { 
      type: 'group', 
      id: 'reports', 
      label: 'Relatório de Clientes', 
      icon: FileBarChart,
      children: [
        { id: 'pending_docs', label: 'Documentos Pendentes' },
        { id: 'client_extracts', label: 'Extractos de Clientes' },
      ]
    },

    // Section: Configurações
    { type: 'header', label: 'Configurações' },
    { 
      type: 'group', 
      id: 'config', 
      label: 'Configurações', 
      icon: Settings,
      children: [
        { id: 'company_details', label: 'Detalhes da Empresa' },
        { id: 'bank_details', label: 'Dados Bancários' },
        { id: 'users', label: 'Usuários' },
        { id: 'profile', label: 'Perfil' },
      ]
    },

    // Extra Tools
    { type: 'link', id: 'assistant', label: 'Consultor AI', icon: Bot },
  ];

  return (
    <aside className={`bg-brand-900 text-gray-400 flex flex-col h-screen fixed left-0 top-0 z-20 shadow-2xl transition-transform duration-300 overflow-y-auto custom-scrollbar no-print w-64 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      
      {/* User Profile Section */}
      <div className="p-8 flex flex-col items-center border-b border-white/10 bg-brand-900">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3 ring-4 ring-white/10">
          LC
        </div>
        <h2 className="text-white font-bold text-base tracking-wide">Landi Consultores</h2>
        <p className="text-xs text-blue-400 mt-1">Admin</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          if (item.type === 'header') {
            return (
              <div key={`header-${index}`} className="px-4 pt-6 pb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {item.label}
              </div>
            );
          }

          if (item.type === 'group') {
            const isExpanded = expandedGroups.includes(item.id);
            const Icon = item.icon;
            
            // Check if any child is active
            const hasActiveChild = item.children.some(child => child.id === currentView);
            
            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                     hasActiveChild ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={`${hasActiveChild ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-700 pl-3">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onChangeView(child.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors duration-200 ${
                          currentView === child.id
                            ? 'text-blue-400 font-medium bg-blue-500/10'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Link Item
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-brand-900">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all text-sm font-medium group"
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
