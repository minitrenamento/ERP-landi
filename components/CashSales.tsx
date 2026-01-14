
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ShoppingCart, 
  Trash2, 
  X, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Banknote,
  Printer,
  MoreHorizontal,
  Box,
  LayoutGrid,
  List
} from 'lucide-react';
import { MOCK_CASH_SALES, MOCK_ARTICLES } from '../constants';
import { CashSale, CashSaleItem, Article } from '../types';

const CashSales: React.FC = () => {
  const [sales, setSales] = useState<CashSale[]>(MOCK_CASH_SALES);
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // POS State
  const [cartItems, setCartItems] = useState<CashSaleItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerName, setCustomerName] = useState('Consumidor Final');
  const [customerNuit, setCustomerNuit] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'Cash' | 'POS' | 'Mpesa'>('Cash');
  const [amountPaid, setAmountPaid] = useState('');

  // Main List Filters
  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // POS Logic
  const filteredProducts = MOCK_ARTICLES.filter(a => 
    a.status === 'Active' && 
    (a.name.toLowerCase().includes(productSearch.toLowerCase()) || a.code.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const addToCart = (article: Article) => {
    const existingItem = cartItems.find(item => item.articleId === article.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.articleId === article.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice } 
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: Date.now().toString(),
        articleId: article.id,
        description: article.name,
        quantity: 1,
        unitPrice: article.salePrice,
        total: article.salePrice
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, total: newQty * item.unitPrice };
      }
      return item;
    }));
  };

  // POS Calculations
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const cartTax = cartSubtotal * 0.16; // 16% IVA
  const cartTotal = cartSubtotal + cartTax;
  const change = amountPaid ? Math.max(0, Number(amountPaid) - cartTotal) : 0;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const newSale: CashSale = {
      id: `VD-${new Date().getFullYear()}/${(sales.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      customerName: customerName || 'Consumidor Final',
      nuit: customerNuit,
      items: cartItems,
      subtotal: cartSubtotal,
      taxAmount: cartTax,
      total: cartTotal,
      paymentMethod: selectedPayment,
      status: 'Completed'
    };

    setSales([newSale, ...sales]);
    setIsPosOpen(false);
    resetPos();
    alert(`Venda realizada com sucesso!\nTroco: ${new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(change)}`);
  };

  const resetPos = () => {
    setCartItems([]);
    setCustomerName('Consumidor Final');
    setCustomerNuit('');
    setSelectedPayment('Cash');
    setAmountPaid('');
    setProductSearch('');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <DollarSign className="text-brand-600 dark:text-brand-400" />
            Vendas à Dinheiro
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Ponto de venda rápido para transações imediatas.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto no-print">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar venda..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
            />
          </div>
          <button 
            onClick={() => setIsPosOpen(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Nova Venda (POS)</span>
          </button>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">ID Venda</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Data/Hora</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Itens</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Pagamento</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-600 dark:text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-600 dark:text-brand-400">
                    {sale.id}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(sale.date).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {sale.customerName}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {sale.items.reduce((acc, item) => acc + item.quantity, 0)} un.
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(sale.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 w-fit">
                        {sale.paymentMethod === 'Cash' && <Banknote size={12} />}
                        {sale.paymentMethod === 'POS' && <CreditCard size={12} />}
                        {sale.paymentMethod === 'Mpesa' && <Smartphone size={12} />}
                        {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button title="Recibo" className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        <Printer size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POS Modal - Full Screen Overlay */}
      {isPosOpen && (
        <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row animate-fade-in overflow-hidden">
            {/* Left Side: Product Selection */}
            <div className="w-full md:w-2/3 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <Box size={20} className="text-brand-600" /> Catálogo
                    </h3>
                    <div className="relative w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Buscar artigo (Nome ou Código)..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(article => (
                            <button 
                                key={article.id}
                                onClick={() => addToCart(article)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-brand-500 hover:shadow-md transition-all text-left flex flex-col h-32 justify-between group"
                            >
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100 line-clamp-2 text-sm">{article.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">{article.code}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-brand-600 dark:text-brand-400">
                                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 }).format(article.salePrice)}
                                    </span>
                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                        <Plus size={14} />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Cart & Checkout */}
            <div className="w-full md:w-1/3 flex flex-col bg-white dark:bg-gray-800 h-full shadow-2xl relative">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <ShoppingCart size={20} className="text-brand-600" /> Carrinho
                    </h3>
                    <button onClick={() => setIsPosOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                            <ShoppingCart size={48} className="mb-2" />
                            <p>Carrinho vazio</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white text-sm line-clamp-1">{item.description}</p>
                                    <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(item.unitPrice)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">-</button>
                                        <span className="px-2 text-xs font-medium text-gray-800 dark:text-white w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                    
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="text-sm px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="Nome Cliente"
                        />
                        <input 
                            type="text" 
                            value={customerNuit}
                            onChange={(e) => setCustomerNuit(e.target.value)}
                            className="text-sm px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="NUIT (Opcional)"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="flex gap-2">
                        {(['Cash', 'POS', 'Mpesa'] as const).map(method => (
                            <button
                                key={method}
                                onClick={() => setSelectedPayment(method)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                                    selectedPayment === method 
                                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {method === 'Cash' && <Banknote size={16} />}
                                {method === 'POS' && <CreditCard size={16} />}
                                {method === 'Mpesa' && <Smartphone size={16} />}
                                {method}
                            </button>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-1 pt-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Subtotal</span>
                            <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(cartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>IVA (16%)</span>
                            <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(cartTax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(cartTotal)}</span>
                        </div>
                    </div>

                    {/* Amount Paid & Change */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Valor Pago</label>
                            <input 
                                type="number" 
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="w-full text-sm px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Troco</label>
                            <div className="w-full text-sm px-3 py-2 border border-transparent bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 font-medium">
                                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(change)}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Finalizar Venda
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon for button
import { CheckCircle } from 'lucide-react';

export default CashSales;
