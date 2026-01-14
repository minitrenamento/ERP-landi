
export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastInteraction: string;
  nuit?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  nuit?: string;
  category: string;
  status: 'Active' | 'Inactive';
  address?: string;
}

export interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  unit: 'Hora' | 'Dia' | 'Mês' | 'Projeto' | 'Unidade' | 'Fixo';
  taxRate: number;
  status: 'Active' | 'Inactive';
}

export interface Article {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  salePrice: number;
  costPrice: number;
  currentStock: number;
  minStock: number;
  status: 'Active' | 'Inactive';
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  deadline: string;
  budget: number;
  progress: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  amount: number;
  type: 'In' | 'Out';
  category: string;
  responsible: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number;
  status: 'Active' | 'Inactive';
  color?: string;
  iban?: string;
  swift?: string;
}

export interface BankTransaction {
  id: string;
  accountId: string;
  bankName: string;
  date: string;
  description: string;
  type: 'Credit' | 'Debit';
  amount: number;
  category: string;
  reference?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  expiryDate: string;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  notes?: string;
}

export interface DebitNote {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  date: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Applied' | 'Cancelled';
}

export interface CreditNote {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  date: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'Applied' | 'Cancelled';
}

export interface DeliveryGuideItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface DeliveryGuide {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  deliveryDate: string;
  status: 'Draft' | 'In Transit' | 'Delivered' | 'Cancelled';
  deliveryAddress: string;
  driverName?: string;
  vehiclePlate?: string;
  items: DeliveryGuideItem[];
}

export interface TransportGuideItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  weight?: number;
}

export interface TransportGuide {
  id: string;
  date: string;
  expiryDate: string;
  originAddress: string;
  destinationAddress: string;
  customerName: string;
  carrierName: string;
  driverName: string;
  driverLicense: string;
  vehiclePlate: string;
  vehicleMake?: string;
  status: 'Draft' | 'Issued' | 'Completed' | 'Cancelled';
  items: TransportGuideItem[];
}

export interface CashSaleItem {
  id: string;
  articleId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CashSale {
  id: string;
  date: string;
  customerName?: string;
  nuit?: string;
  items: CashSaleItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentMethod: 'Cash' | 'POS' | 'Mpesa' | 'Transfer';
  status: 'Completed' | 'Cancelled';
}

export interface SalesInvoice {
  id: string;
  client: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  description: string;
}

export interface PurchaseInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseInvoice {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  referenceNumber?: string;
  items: PurchaseInvoiceItem[];
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ClientStatementItem {
  id: string;
  date: string;
  type: 'Invoice' | 'Receipt' | 'Credit Note' | 'Debit Note' | 'Opening Balance';
  documentRef: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CompanySettings {
  name: string;
  nuit: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  website?: string;
  logoUrl?: string;
  invoiceFooterNote?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Sales' | 'Stock' | 'Finance';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  phone?: string;
  department?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'Info' | 'Warning' | 'Error' | 'Success';
}

export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: any;
}

export type ViewState = 
  | 'dashboard' 
  | 'clients_list' 
  | 'suppliers_list'
  | 'articles' 
  | 'services' 
  | 'quotes' 
  | 'invoices' 
  | 'debit_notes' 
  | 'credit_notes' 
  | 'delivery_guides' 
  | 'transport_guides' 
  | 'cash_sales'
  | 'receipts' 
  | 'purchase_invoices'
  | 'stock_list'
  | 'stock_entry'
  | 'stock_exit'
  | 'stock_settings'
  | 'treasury_cash'
  | 'treasury_banks'
  | 'pending_docs'
  | 'client_extracts'
  | 'company_details'
  | 'bank_details'
  | 'users'
  | 'profile'
  | 'assistant'
  | 'clients' 
  | 'projects' 
  | 'financial' 
  | 'settings';

export interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}
