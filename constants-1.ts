
import { Client, DashboardMetric, Invoice, StockItem, StockMovement } from './types-1';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Receipt, 
  FileSpreadsheet, 
  Mail, 
  BarChart3, 
  Settings,
  Package
} from 'lucide-react';

export const APP_NAME = "Landi Consultores";

// Sidebar Navigation Items
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'stocks', label: 'Stocks & Equip.', icon: Package },
  { id: 'faturas', label: 'Faturas', icon: FileText },
  { id: 'recibos', label: 'Recibos', icon: Receipt },
  { id: 'cotacao', label: 'Cotação', icon: FileSpreadsheet },
  { id: 'cartas', label: 'Cartas', icon: Mail },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'config', label: 'Configurações', icon: Settings },
];

// Mock Data: Dashboard Metrics
export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    title: 'Total de Clientes',
    value: 124,
    subtext: 'Clientes ativos na base',
    icon: 'Users',
    trend: 'up',
    trendValue: '+12%',
    colorClass: 'bg-blue-500',
  },
  {
    title: 'Recibos (Hoje)',
    value: '14.500 MT',
    subtext: '3 recibos emitidos hoje',
    icon: 'Receipt',
    trend: 'up',
    trendValue: '+5%',
    colorClass: 'bg-emerald-500',
  },
  {
    title: 'Faturas (Hoje)',
    value: 6,
    subtext: 'Total de faturas emitidas',
    icon: 'FileText',
    trend: 'neutral',
    trendValue: '0%',
    colorClass: 'bg-amber-500',
  },
  {
    title: 'Saldo Pendente',
    value: '8.172.362 MT',
    subtext: 'Valor total a receber',
    icon: 'Wallet',
    trend: 'down',
    trendValue: '-2%',
    colorClass: 'bg-indigo-600',
  }
];

// Mock Data: Recent Clients
export const RECENT_CLIENTS: Client[] = [
  { id: '1', name: 'Transportes Mahotas Lda', type: 'Empresa', nuit: '7788999000', phone: '846789000', email: 'geral@mahotas.co.mz', address: 'Maputo, Av. Angola', status: 'Ativo', paymentTerms: '30 Dias' },
  { id: '2', name: 'Land Consultoria', type: 'Empresa', nuit: '765433200', phone: '876545600', email: 'didi@land.com', address: 'Maputo, Polana', status: 'Ativo', paymentTerms: 'Pronto Pagamento' },
  { id: '3', name: 'Índico Comércio', type: 'Empresa', nuit: '400289221', phone: '821122334', email: 'comercio@indico.mz', address: 'Matola, Rio', status: 'Inativo', paymentTerms: '15 Dias' },
  { id: '4', name: 'Global Tech SA', type: 'Empresa', nuit: '556677889', phone: '840001122', email: 'info@globaltech.mz', address: 'Beira, Macuti', status: 'Ativo', paymentTerms: '60 Dias' },
  { id: '5', name: 'Eng. Carlos Mucapera', type: 'Individual', nuit: '112233445', phone: '869988776', email: 'cmucapera@gmail.com', address: 'Tete, Cidade', status: 'Ativo', paymentTerms: 'Pronto Pagamento' },
];

// Mock Data: Chart Data
export const REVENUE_DATA = [
  { name: 'Jan', faturas: 4000, recibos: 2400 },
  { name: 'Fev', faturas: 3000, recibos: 1398 },
  { name: 'Mar', faturas: 2000, recibos: 9800 },
  { name: 'Abr', faturas: 2780, recibos: 3908 },
  { name: 'Mai', faturas: 1890, recibos: 4800 },
  { name: 'Jun', faturas: 2390, recibos: 3800 },
  { name: 'Jul', faturas: 3490, recibos: 4300 },
  { name: 'Ago', faturas: 4200, recibos: 4100 },
  { name: 'Set', faturas: 3100, recibos: 3700 },
  { name: 'Out', faturas: 5200, recibos: 4900 },
  { name: 'Nov', faturas: 4600, recibos: 4200 },
  { name: 'Dez', faturas: 6100, recibos: 5600 },
];

// Mock Data: Recent Invoices (for list view)
export const RECENT_INVOICES: Invoice[] = [
  { id: 'FAT-2025/001', clientName: 'Transportes Mahotas Lda', amount: 150000, date: '2025-01-15', status: 'Pago' },
  { id: 'FAT-2025/002', clientName: 'Land Consultoria', amount: 25500, date: '2025-01-18', status: 'Pendente' },
  { id: 'FAT-2025/003', clientName: 'Global Tech SA', amount: 8900, date: '2025-01-20', status: 'Atrasado' },
];

// Mock Data: Stock Items
export const STOCK_ITEMS: StockItem[] = [
  { id: 'EQ-001', name: 'Portátil Dell Latitude', category: 'Informática', quantity: 12, minLevel: 5, location: 'Armazém A', status: 'Disponível', icon: 'Laptop' },
  { id: 'EQ-002', name: 'Projetor Epson 4k', category: 'Audiovisual', quantity: 1, minLevel: 2, location: 'Sala Reunião 1', status: 'Em Uso', icon: 'MonitorPlay' },
  { id: 'EQ-003', name: 'Impressora HP LaserJet', category: 'Informática', quantity: 3, minLevel: 1, location: 'Recepção', status: 'Manutenção', icon: 'Printer' },
  { id: 'EQ-004', name: 'Papel A4 (Caixa)', category: 'Consumíveis', quantity: 4, minLevel: 10, location: 'Armazém B', status: 'Esgotado', icon: 'FileText' },
  { id: 'EQ-005', name: 'Cadeiras de Escritório', category: 'Mobiliário', quantity: 25, minLevel: 5, location: 'Armazém A', status: 'Disponível', icon: 'Armchair' },
];

// Mock Data: Stock Movements
export const STOCK_MOVEMENTS: StockMovement[] = [
  { id: 'MOV-001', itemId: 'EQ-004', itemName: 'Papel A4 (Caixa)', type: 'Saída', quantity: 2, date: '2025-01-20 14:30', responsible: 'Maria Silva', reason: 'Uso Administrativo' },
  { id: 'MOV-002', itemId: 'EQ-001', itemName: 'Portátil Dell Latitude', type: 'Entrada', quantity: 5, date: '2025-01-19 09:00', responsible: 'João Santos', reason: 'Compra Nova' },
  { id: 'MOV-003', itemId: 'EQ-002', itemName: 'Projetor Epson 4k', type: 'Saída', quantity: 1, date: '2025-01-18 11:15', responsible: 'Carlos M.', reason: 'Apresentação Cliente' },
];