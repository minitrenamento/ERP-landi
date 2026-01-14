
import { Client, Project, Transaction, KPI, Supplier, Service, Article, Quote, DebitNote, CreditNote, DeliveryGuide, TransportGuide, CashSale, PurchaseInvoice, CashTransaction, BankAccount, BankTransaction, SalesInvoice, ClientStatementItem, CompanySettings, SystemUser, ActivityLog } from './types';

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'TechSolutions Ltda', contactPerson: 'Carlos Silva', email: 'carlos@techsolutions.com', phone: '(11) 98765-4321', status: 'Active', lastInteraction: '2023-10-25', nuit: '400123456' },
  { id: '2', name: 'Inova Varejo', contactPerson: 'Fernanda Costa', email: 'fernanda@inovavarejo.com.br', phone: '(21) 99887-1122', status: 'Active', lastInteraction: '2023-10-24', nuit: '400987654' },
  { id: '3', name: 'Construtora Horizonte', contactPerson: 'Roberto Almeida', email: 'roberto@horizonte.com', phone: '(31) 91234-5678', status: 'Inactive', lastInteraction: '2023-09-15', nuit: '400555666' },
  { id: '4', name: 'Educa Mais', contactPerson: 'Juliana Santos', email: 'juliana@educamais.edu', phone: '(41) 97777-8888', status: 'Active', lastInteraction: '2023-10-20', nuit: '400111222' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Papelaria Central', contactPerson: 'Ana Souza', email: 'vendas@pcentral.co.mz', phone: '(84) 111-2222', nuit: '500123456', category: 'Material de Escritório', status: 'Active', address: 'Av. 24 de Julho, Maputo' },
  { id: '2', name: 'TechMoz Servidores', contactPerson: 'João Magaia', email: 'suporte@techmoz.co.mz', phone: '(82) 333-4444', nuit: '500987654', category: 'Equipamentos TI', status: 'Active', address: 'Matola Rio' },
  { id: '3', name: 'Limpeza Total', contactPerson: 'Maria Langa', email: 'contato@limpezatotal.co.mz', phone: '(87) 555-6666', nuit: '500555666', category: 'Serviços Gerais', status: 'Active', address: 'Bairro Central, Maputo' },
  { id: '4', name: 'Internet Solutions', contactPerson: 'Pedro Cossa', email: 'billing@is.co.mz', phone: '(21) 400-500', nuit: '500111222', category: 'Telecomunicações', status: 'Inactive', address: 'Polana Cimento' },
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', code: 'SRV-001', name: 'Consultoria Financeira', description: 'Análise detalhada de fluxo de caixa e balanços.', price: 5000, unit: 'Hora', status: 'Active', taxRate: 16 },
  { id: '2', code: 'SRV-002', name: 'Implementação de ERP', description: 'Configuração, migração de dados e treinamento do software ERP.', price: 150000, unit: 'Projeto', status: 'Active', taxRate: 16 },
  { id: '3', code: 'SRV-003', name: 'Auditoria Fiscal', description: 'Revisão de conformidade tributária e fiscal.', price: 75000, unit: 'Fixo', status: 'Active', taxRate: 16 },
  { id: '4', code: 'SRV-004', name: 'Suporte Técnico Mensal', description: 'Manutenção preventiva e corretiva remota e local.', price: 25000, unit: 'Mês', status: 'Active', taxRate: 16 },
  { id: '5', code: 'SRV-005', name: 'Treinamento Corporativo', description: 'Workshop para capacitação de equipes.', price: 15000, unit: 'Dia', status: 'Inactive', taxRate: 16 },
];

export const MOCK_ARTICLES: Article[] = [
  { id: '1', code: 'ART-001', name: 'Laptop Dell Latitude 5420', category: 'Informática', unit: 'Un', salePrice: 85000, costPrice: 65000, currentStock: 12, minStock: 5, status: 'Active', location: 'Armazém A1' },
  { id: '2', code: 'ART-002', name: 'Cadeira Ergonômica Office', category: 'Mobiliário', unit: 'Un', salePrice: 12500, costPrice: 8000, currentStock: 45, minStock: 10, status: 'Active', location: 'Armazém B2' },
  { id: '3', code: 'ART-003', name: 'Papel A4 Navigator (Caixa)', category: 'Material Escritório', unit: 'Cx', salePrice: 2500, costPrice: 1800, currentStock: 3, minStock: 10, status: 'Active', location: 'Armazém C1' },
  { id: '4', code: 'ART-004', name: 'Monitor 27" 4K Samsung', category: 'Informática', unit: 'Un', salePrice: 22000, costPrice: 18000, currentStock: 0, minStock: 3, status: 'Inactive', location: 'Armazém A2' },
  { id: '5', code: 'ART-005', name: 'Teclado Mecânico Logitech', category: 'Acessórios', unit: 'Un', salePrice: 4500, costPrice: 3000, currentStock: 8, minStock: 5, status: 'Active', location: 'Prateleira 4' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '101', name: 'ERP Implementation', clientId: '1', clientName: 'TechSolutions Ltda', status: 'In Progress', deadline: '2023-12-31', budget: 150000, progress: 65 },
  { id: '102', name: 'E-commerce Redesign', clientId: '2', clientName: 'Inova Varejo', status: 'In Progress', deadline: '2023-11-15', budget: 45000, progress: 80 },
  { id: '103', name: 'Process Audit', clientId: '3', clientName: 'Construtora Horizonte', status: 'Completed', deadline: '2023-09-01', budget: 30000, progress: 100 },
  { id: '104', name: 'Staff Training', clientId: '4', clientName: 'Educa Mais', status: 'On Hold', deadline: '2024-02-28', budget: 25000, progress: 15 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-25', description: 'Consulting Fee - TechSolutions', amount: 15000, type: 'Income', category: 'Services' },
  { id: 't2', date: '2023-10-24', description: 'Office Rent', amount: 2500, type: 'Expense', category: 'Operations' },
  { id: 't3', date: '2023-10-22', description: 'Software Licenses', amount: 500, type: 'Expense', category: 'IT' },
  { id: 't4', date: '2023-10-20', description: 'Project Advance - Inova', amount: 10000, type: 'Income', category: 'Services' },
  { id: 't5', date: '2023-10-18', description: 'Marketing Campaign', amount: 1200, type: 'Expense', category: 'Marketing' },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'COT-2023/101',
    clientId: '1',
    clientName: 'TechSolutions Ltda',
    date: '2023-10-20',
    expiryDate: '2023-11-20',
    items: [
      { id: 'i1', description: 'Consultoria Financeira', quantity: 10, unitPrice: 5000, total: 50000 },
      { id: 'i2', description: 'Licença Software ERP', quantity: 1, unitPrice: 150000, total: 150000 }
    ],
    subtotal: 200000,
    taxAmount: 32000,
    total: 232000,
    status: 'Sent',
    notes: 'Proposta válida por 30 dias.'
  },
  {
    id: 'COT-2023/102',
    clientId: '2',
    clientName: 'Inova Varejo',
    date: '2023-10-22',
    expiryDate: '2023-11-05',
    items: [
      { id: 'i3', description: 'Treinamento Equipe', quantity: 2, unitPrice: 15000, total: 30000 }
    ],
    subtotal: 30000,
    taxAmount: 4800,
    total: 34800,
    status: 'Draft',
    notes: ''
  },
  {
    id: 'COT-2023/099',
    clientId: '3',
    clientName: 'Construtora Horizonte',
    date: '2023-09-15',
    expiryDate: '2023-10-15',
    items: [
      { id: 'i4', description: 'Auditoria Fiscal 2022', quantity: 1, unitPrice: 75000, total: 75000 }
    ],
    subtotal: 75000,
    taxAmount: 12000,
    total: 87000,
    status: 'Accepted'
  }
];

export const MOCK_DEBIT_NOTES: DebitNote[] = [
  { id: 'ND-2023/001', invoiceId: 'FAT-2023/001', clientId: '1', clientName: 'TechSolutions Ltda', date: '2023-11-01', reason: 'Erro de cálculo na fatura original (Diferença de IVA)', amount: 2500, status: 'Applied' },
  { id: 'ND-2023/002', invoiceId: 'FAT-2023/004', clientId: '4', clientName: 'Educa Mais', date: '2023-11-10', reason: 'Taxa de serviço adicional de entrega urgente', amount: 1500, status: 'Pending' },
];

export const MOCK_CREDIT_NOTES: CreditNote[] = [
  { id: 'NC-2023/001', invoiceId: 'FAT-2023/002', clientId: '2', clientName: 'Inova Varejo', date: '2023-11-05', reason: 'Devolução de mercadoria defeituosa', amount: 4500, status: 'Applied' },
  { id: 'NC-2023/002', invoiceId: 'FAT-2023/003', clientId: '3', clientName: 'Construtora Horizonte', date: '2023-11-12', reason: 'Desconto comercial acordado pós-fatura', amount: 1000, status: 'Pending' },
];

export const MOCK_DELIVERY_GUIDES: DeliveryGuide[] = [
  {
    id: 'GR-2023/001',
    clientId: '1',
    clientName: 'TechSolutions Ltda',
    date: '2023-10-26',
    deliveryDate: '2023-10-27',
    status: 'Delivered',
    deliveryAddress: 'Av. Mao Tse Tung, 123, Maputo',
    driverName: 'António Mucavele',
    vehiclePlate: 'ABB-123-MC',
    items: [
      { id: '1', description: 'Laptop Dell Latitude 5420', quantity: 2, unit: 'Un' }
    ]
  },
  {
    id: 'GR-2023/002',
    clientId: '2',
    clientName: 'Inova Varejo',
    date: '2023-10-28',
    deliveryDate: '2023-10-29',
    status: 'In Transit',
    deliveryAddress: 'Bairro do Zimpeto, Rua 4, Maputo',
    driverName: 'João Santos',
    vehiclePlate: 'ADF-555-MC',
    items: [
      { id: '1', description: 'Impressora HP LaserJet', quantity: 1, unit: 'Un' },
      { id: '2', description: 'Resmas de Papel A4', quantity: 10, unit: 'Cx' }
    ]
  },
  {
    id: 'GR-2023/003',
    clientId: '4',
    clientName: 'Educa Mais',
    date: '2023-11-01',
    deliveryDate: '2023-11-02',
    status: 'Draft',
    deliveryAddress: 'Matola Rio, Paragem 15',
    items: [
      { id: '1', description: 'Projetor Epson', quantity: 1, unit: 'Un' }
    ]
  }
];

export const MOCK_TRANSPORT_GUIDES: TransportGuide[] = [
  {
    id: 'GT-2023/001',
    date: '2023-10-30',
    expiryDate: '2023-11-05',
    originAddress: 'Armazém Central, Maputo',
    destinationAddress: 'Av. Angola, 55, Maputo',
    customerName: 'TechSolutions Ltda',
    carrierName: 'Logística Express',
    driverName: 'Pedro Mondlane',
    driverLicense: '123456789',
    vehiclePlate: 'ABC-123-MP',
    vehicleMake: 'Toyota Hino',
    status: 'Issued',
    items: [
      { id: '1', description: 'Mobiliário de Escritório', quantity: 10, unit: 'Un', weight: 150 }
    ]
  },
  {
    id: 'GT-2023/002',
    date: '2023-11-02',
    expiryDate: '2023-11-07',
    originAddress: 'Armazém Matola',
    destinationAddress: 'Beira, Sofala',
    customerName: 'Global Tech SA',
    carrierName: 'Landi Transportes (Próprio)',
    driverName: 'Carlos Macamo',
    driverLicense: '987654321',
    vehiclePlate: 'ADF-999-MC',
    status: 'Draft',
    items: [
      { id: '1', description: 'Servidores Rack', quantity: 2, unit: 'Un', weight: 80 }
    ]
  }
];

export const MOCK_CASH_SALES: CashSale[] = [
  {
    id: 'VD-2023/001',
    date: '2023-11-15T10:30:00',
    customerName: 'Consumidor Final',
    items: [
      { id: '1', description: 'Teclado Mecânico Logitech', quantity: 1, unitPrice: 4500, total: 4500 }
    ],
    subtotal: 4500,
    taxAmount: 720,
    total: 5220,
    paymentMethod: 'Mpesa',
    status: 'Completed'
  },
  {
    id: 'VD-2023/002',
    date: '2023-11-15T11:15:00',
    customerName: 'João Malate',
    items: [
      { id: '1', description: 'Papel A4 Navigator (Caixa)', quantity: 2, unitPrice: 2500, total: 5000 }
    ],
    subtotal: 5000,
    taxAmount: 800,
    total: 5800,
    paymentMethod: 'POS',
    status: 'Completed'
  }
];

export const MOCK_PURCHASE_INVOICES: PurchaseInvoice[] = [
  {
    id: 'FC-2023/088',
    supplierId: '1',
    supplierName: 'Papelaria Central',
    date: '2023-10-25',
    dueDate: '2023-11-25',
    referenceNumber: 'FAT-998877',
    totalAmount: 18500,
    status: 'Paid',
    items: [
        { id: '1', description: 'Resmas de Papel A4', quantity: 50, unitPrice: 300, total: 15000 },
        { id: '2', description: 'Canetas Azuis (Caixa)', quantity: 10, unitPrice: 350, total: 3500 }
    ]
  },
  {
    id: 'FC-2023/092',
    supplierId: '2',
    supplierName: 'TechMoz Servidores',
    date: '2023-11-01',
    dueDate: '2023-11-15',
    referenceNumber: 'INV-2023-55',
    totalAmount: 125000,
    status: 'Pending',
    items: [
        { id: '1', description: 'Servidor Dell PowerEdge', quantity: 1, unitPrice: 125000, total: 125000 }
    ]
  },
  {
    id: 'FC-2023/075',
    supplierId: '3',
    supplierName: 'Limpeza Total',
    date: '2023-09-10',
    dueDate: '2023-10-10',
    referenceNumber: 'REC-00123',
    totalAmount: 5000,
    status: 'Overdue',
    items: [
        { id: '1', description: 'Serviço de Limpeza Mensal', quantity: 1, unitPrice: 5000, total: 5000 }
    ]
  }
];

export const MOCK_CASH_TRANSACTIONS: CashTransaction[] = [
  { id: 'CX-001', date: '2023-11-15', type: 'In', description: 'Venda Balcão VD-2023/001', category: 'Vendas', amount: 5220, responsible: 'Ana Santos', reference: 'VD-2023/001' },
  { id: 'CX-002', date: '2023-11-15', type: 'Out', description: 'Pagamento de Água', category: 'Despesas Gerais', amount: 1500, responsible: 'Carlos Admin' },
  { id: 'CX-003', date: '2023-11-14', type: 'In', description: 'Reforço de Caixa', category: 'Tesouraria', amount: 10000, responsible: 'Gerente Financeiro' },
  { id: 'CX-004', date: '2023-11-14', type: 'Out', description: 'Compra Material Limpeza', category: 'Compras', amount: 850, responsible: 'Ana Santos' },
];

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: '1', bankName: 'BIM - Millennium', accountNumber: '123456789', iban: 'MZ5900010000123456789', swift: 'BIM-MZ-MA', currency: 'MZN', balance: 1250000.50, status: 'Active', color: 'bg-red-900' },
  { id: '2', bankName: 'BCI - Com. e Invest.', accountNumber: '987654321', iban: 'MZ5900020000987654321', swift: 'BCI-MZ-MA', currency: 'MZN', balance: 45000.00, status: 'Active', color: 'bg-blue-800' },
  { id: '3', bankName: 'Standard Bank', accountNumber: '555666777', iban: 'MZ5900030000555666777', swift: 'SB-MZ-MA', currency: 'MZN', balance: 850200.75, status: 'Active', color: 'bg-blue-600' },
];

export const MOCK_BANK_TRANSACTIONS: BankTransaction[] = [
  { id: 'BT-001', accountId: '1', bankName: 'BIM - Millennium', date: '2023-11-15', description: 'Pagamento Fatura TechSolutions', type: 'Credit', amount: 150000, category: 'Vendas', reference: 'FAT-2023/001' },
  { id: 'BT-002', accountId: '1', bankName: 'BIM - Millennium', date: '2023-11-14', description: 'Pagamento Aluguel Escritório', type: 'Debit', amount: 25000, category: 'Despesas Fixas', reference: 'ALUG-NOV' },
  { id: 'BT-003', accountId: '3', bankName: 'Standard Bank', date: '2023-11-12', description: 'Pagamento Fornecedor Papelaria Central', type: 'Debit', amount: 18500, category: 'Fornecedores', reference: 'FC-2023/088' },
  { id: 'BT-004', accountId: '2', bankName: 'BCI', date: '2023-11-10', description: 'Depósito em Numerário', type: 'Credit', amount: 5000, category: 'Tesouraria' },
];

export const MOCK_SALES_INVOICES: SalesInvoice[] = [
  { id: 'FAT-2023/001', client: 'TechSolutions Ltda', date: '2023-10-25', dueDate: '2023-11-25', amount: 15000, status: 'Pago', description: 'Consultoria de TI' },
  { id: 'FAT-2023/002', client: 'Inova Varejo', date: '2023-10-28', dueDate: '2023-11-28', amount: 4500, status: 'Pendente', description: 'Licença de Software' },
  { id: 'FAT-2023/003', client: 'Construtora Horizonte', date: '2023-09-01', dueDate: '2023-10-01', amount: 25000, status: 'Atrasado', description: 'Auditoria de Processos' },
  { id: 'FAT-2023/004', client: 'Educa Mais', date: '2023-11-05', dueDate: '2023-12-05', amount: 12000, status: 'Pendente', description: 'Treinamento Corporativo' },
];

export const MOCK_STATEMENT_DATA: ClientStatementItem[] = [
  { id: '1', date: '2023-01-01', type: 'Opening Balance', documentRef: '-', description: 'Saldo Inicial', debit: 0, credit: 0, balance: 0 },
  { id: '2', date: '2023-10-25', type: 'Invoice', documentRef: 'FAT-2023/001', description: 'Consultoria de TI', debit: 15000, credit: 0, balance: 15000 },
  { id: '3', date: '2023-10-30', type: 'Receipt', documentRef: 'REC-2023/001', description: 'Pagamento Parcial', debit: 0, credit: 5000, balance: 10000 },
  { id: '4', date: '2023-11-01', type: 'Debit Note', documentRef: 'ND-2023/001', description: 'Ajuste de Taxas', debit: 2500, credit: 0, balance: 12500 },
  { id: '5', date: '2023-11-15', type: 'Receipt', documentRef: 'REC-2023/005', description: 'Pagamento Restante FAT-001', debit: 0, credit: 12500, balance: 0 },
  { id: '6', date: '2023-11-20', type: 'Invoice', documentRef: 'FAT-2023/005', description: 'Manutenção Mensal', debit: 5000, credit: 0, balance: 5000 }
];

export const MOCK_USERS: SystemUser[] = [
  { id: '1', name: 'Carlos Admin', email: 'admin@landi.co.mz', role: 'Admin', status: 'Active', lastLogin: '2023-11-20 09:30', department: 'Gestão' },
  { id: '2', name: 'Ana Vendas', email: 'ana.vendas@landi.co.mz', role: 'Sales', status: 'Active', lastLogin: '2023-11-20 08:15', department: 'Comercial' },
  { id: '3', name: 'Pedro Logística', email: 'pedro.log@landi.co.mz', role: 'Stock', status: 'Active', lastLogin: '2023-11-19 16:45', department: 'Operações' },
  { id: '4', name: 'Marta Finanças', email: 'marta.fin@landi.co.mz', role: 'Finance', status: 'Inactive', lastLogin: '2023-10-15 14:00', department: 'Financeiro' },
];

export const MOCK_COMPANY_INFO: CompanySettings = {
  name: 'Landi Consultores Lda',
  nuit: '400123789',
  email: 'geral@landiconsultores.co.mz',
  phone: '+258 84 123 4567',
  address: 'Av. Mao Tse Tung, Nº 123, 1º Andar',
  city: 'Maputo',
  province: 'Maputo Cidade',
  website: 'www.landiconsultores.co.mz',
  invoiceFooterNote: 'Obrigado pela preferência. Mercadoria processada por computador.'
};

export const MOCK_CURRENT_USER: SystemUser = {
  id: '1', 
  name: 'Carlos Admin', 
  email: 'admin@landi.co.mz', 
  role: 'Admin', 
  status: 'Active', 
  lastLogin: 'Agora', 
  department: 'Gestão',
  phone: '+258 84 999 8888'
};

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: '1', userId: '1', action: 'Login', details: 'Acesso ao sistema via Web', timestamp: '2023-11-20 09:30', type: 'Success' },
  { id: '2', userId: '1', action: 'Create Invoice', details: 'Fatura FAT-2023/005 criada', timestamp: '2023-11-20 10:15', type: 'Info' },
  { id: '3', userId: '1', action: 'Update Settings', details: 'Alteração nos dados da empresa', timestamp: '2023-11-19 14:00', type: 'Warning' },
  { id: '4', userId: '1', action: 'Delete User', details: 'Tentativa de remover admin principal', timestamp: '2023-11-18 16:45', type: 'Error' },
  { id: '5', userId: '1', action: 'Export Report', details: 'Relatório Financeiro Outubro', timestamp: '2023-11-18 11:20', type: 'Info' },
];

export const DASHBOARD_KPIS: KPI[] = [
  { label: 'Faturamento (Out)', value: '85.400 MT', change: '+12%', positive: true },
  { label: 'Projetos Ativos', value: '14', change: '+2', positive: true },
  { label: 'Faturas Pendentes', value: '5', change: '-1', positive: true },
  { label: 'Satisfação', value: '4.8/5', change: '0%', positive: true },
];