
export interface Client {
  id: string;
  name: string;
  nuit: string;
  phone: string;
  email: string;
  address: string;
  status: 'Ativo' | 'Inativo';
  // Extended fields for detailed registration
  city?: string;
  province?: string;
  paymentTerms?: string; // e.g., 'Pronto Pagamento', '30 Dias'
  type?: 'Empresa' | 'Individual';
  notes?: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  subtext: string;
  icon: string; // Icon name reference
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  colorClass: string; // Tailwind bg class for the icon container
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  location: string;
  status: 'Disponível' | 'Em Uso' | 'Manutenção' | 'Esgotado';
  icon: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  date: string;
  responsible: string; // Quem retirou ou adicionou
  reason?: string;
}

export type ViewState = 'dashboard' | 'clientes' | 'faturas' | 'recibos' | 'cotacao' | 'cartas' | 'relatorios' | 'stocks' | 'config';
