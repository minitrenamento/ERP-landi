
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Projects from './components/Projects';
import Financials from './components/Financials';
import AIConsultant from './components/AIConsultant';
import Invoices from './components/Invoices';
import Suppliers from './components/Suppliers';
import Services from './components/Services';
import Articles from './components/Articles';
import Quotes from './components/Quotes';
import DebitNotes from './components/DebitNotes';
import CreditNotes from './components/CreditNotes';
import DeliveryGuides from './components/DeliveryGuides';
import TransportGuides from './components/TransportGuides';
import CashSales from './components/CashSales';
import PurchaseInvoices from './components/PurchaseInvoices';
import StockList from './components/StockList';
import StockEntry from './components/StockEntry';
import StockExit from './components/StockExit';
import StockSettings from './components/StockSettings';
import TreasuryCash from './components/TreasuryCash';
import TreasuryBanks from './components/TreasuryBanks';
import PendingDocs from './components/PendingDocs';
import ClientExtracts from './components/ClientExtracts';
import CompanyDetails from './components/CompanyDetails';
import BankDetails from './components/BankDetails';
import Users from './components/Users';
import Profile from './components/Profile';
import Login from './components/Login';
import { ViewState } from './types';
import { Menu, Search, Bell, Moon, Sun, Construction, Loader2 } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { logUserAction } from './services/auditLogger';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const email = auth.currentUser?.email || 'Desconhecido';
      await logUserAction('Logout', 'Auth', `Usuário ${email} encerrou a sessão.`);
      await signOut(auth);
      setCurrentView('dashboard');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'clients_list':
      case 'clients': return <Clients />;
      case 'suppliers_list': return <Suppliers />;
      case 'services': return <Services />;
      case 'articles': return <Articles />;
      case 'quotes': return <Quotes />;
      case 'debit_notes': return <DebitNotes />;
      case 'credit_notes': return <CreditNotes />;
      case 'delivery_guides': return <DeliveryGuides />;
      case 'transport_guides': return <TransportGuides />;
      case 'cash_sales': return <CashSales />;
      case 'purchase_invoices': return <PurchaseInvoices />;
      case 'stock_list': return <StockList />;
      case 'stock_entry': return <StockEntry />;
      case 'stock_exit': return <StockExit />;
      case 'stock_settings': return <StockSettings />;
      case 'treasury_cash': return <TreasuryCash />;
      case 'treasury_banks': return <TreasuryBanks />;
      case 'pending_docs': return <PendingDocs />;
      case 'client_extracts': return <ClientExtracts />;
      case 'company_details': return <CompanyDetails />;
      case 'bank_details': return <BankDetails />;
      case 'users': return <Users />;
      case 'profile': return <Profile />;
      case 'assistant': return <AIConsultant />;
      case 'receipts': return <Financials />;
      case 'invoices': return <Invoices />;
      case 'projects': return <Projects />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500 dark:text-gray-400 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-sm mb-6 border border-gray-100 dark:border-gray-700 max-w-lg w-full">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                <Construction size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Módulo em Desenvolvimento</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                A página <b>{currentView.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</b> está sendo construída.
              </p>
              <div className="flex justify-center gap-3">
                 <button onClick={() => setCurrentView('dashboard')} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">Voltar</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onLogout={handleLogout}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-brand-900 sticky top-0 z-10 px-6 md:px-8 py-4 flex items-center justify-between shadow-md transition-colors duration-200 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors focus:outline-none">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">Landi Consultores ERP</h1>
              <p className="text-xs text-blue-200 mt-1 hidden sm:block">Sistema de Gestão Integrada</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
             <div className="hidden md:flex relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Pesquisar..." className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all"/>
             </div>

             <button onClick={toggleTheme} className="p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/10">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-50 rounded-full border-2 border-brand-900"></span>
            </button>
            
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/20 cursor-pointer">LC</div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
