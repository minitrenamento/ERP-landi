
import React, { useState } from 'react';
import { 
  Settings, 
  MapPin, 
  Tag, 
  Scale, 
  Plus, 
  Trash2, 
  Save, 
  Warehouse,
  CheckCircle2
} from 'lucide-react';

// Simple types for settings
interface SettingItem {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

const StockSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'categories' | 'units'>('warehouses');

  // Mock Data State
  const [warehouses, setWarehouses] = useState<SettingItem[]>([
    { id: '1', name: 'Armazém Central', description: 'Sede Principal - Maputo', isDefault: true },
    { id: '2', name: 'Armazém Matola', description: 'Centro de Distribuição Sul', isDefault: false },
    { id: '3', name: 'Loja 1', description: 'Ponto de Venda - Polana', isDefault: false },
  ]);

  const [categories, setCategories] = useState<SettingItem[]>([
    { id: '1', name: 'Informática', description: 'Laptops, Desktops e Periféricos' },
    { id: '2', name: 'Mobiliário', description: 'Mesas, Cadeiras e Armários' },
    { id: '3', name: 'Consumíveis', description: 'Papel, Tinteiros e Material de Escritório' },
    { id: '4', name: 'Software', description: 'Licenças e Assinaturas' },
  ]);

  const [units, setUnits] = useState<SettingItem[]>([
    { id: '1', name: 'Unidade (Un)', description: 'Item individual' },
    { id: '2', name: 'Caixa (Cx)', description: 'Caixa padrão' },
    { id: '3', name: 'Kilograma (Kg)', description: 'Peso' },
    { id: '4', name: 'Litro (L)', description: 'Volume líquido' },
    { id: '5', name: 'Metro (m)', description: 'Comprimento' },
  ]);

  // Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem: SettingItem = {
      id: Date.now().toString(),
      name: newItemName,
      description: newItemDesc,
      isDefault: false
    };

    if (activeTab === 'warehouses') setWarehouses([...warehouses, newItem]);
    if (activeTab === 'categories') setCategories([...categories, newItem]);
    if (activeTab === 'units') setUnits([...units, newItem]);

    setNewItemName('');
    setNewItemDesc('');
  };

  const handleDeleteItem = (id: string) => {
    if (activeTab === 'warehouses') {
      if (warehouses.find(w => w.id === id)?.isDefault) {
        alert("Não é possível remover o armazém padrão.");
        return;
      }
      setWarehouses(warehouses.filter(w => w.id !== id));
    }
    if (activeTab === 'categories') setCategories(categories.filter(c => c.id !== id));
    if (activeTab === 'units') setUnits(units.filter(u => u.id !== id));
  };

  const renderList = (items: SettingItem[], icon: React.ReactNode) => (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-sm transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                {item.isDefault && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                    Padrão
                  </span>
                )}
              </div>
              {item.description && <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>}
            </div>
          </div>
          <button 
            onClick={() => handleDeleteItem(item.id)}
            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
            title="Remover"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Settings className="text-brand-600 dark:text-brand-400" />
            Definições de Stock
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure armazéns, categorias e unidades de medida.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'warehouses' 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Warehouse size={18} />
            Armazéns
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'categories' 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Tag size={18} />
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'units' 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Scale size={18} />
            Unidades
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Add New Item Form */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Plus size={18} className="text-brand-600 dark:text-brand-400" />
              Adicionar {activeTab === 'warehouses' ? 'Armazém' : activeTab === 'categories' ? 'Categoria' : 'Unidade'}
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={activeTab === 'warehouses' ? "Nome do Armazém (ex: Matola)" : activeTab === 'categories' ? "Nome da Categoria (ex: Peças)" : "Nome da Unidade (ex: Metro)"}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Descrição opcional..."
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button 
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
                className="px-6 py-2 bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-brand-700 text-white rounded-lg shadow-sm transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>

          {/* List Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Lista de {activeTab === 'warehouses' ? 'Armazéns' : activeTab === 'categories' ? 'Categorias' : 'Unidades'}
            </h3>
            
            {activeTab === 'warehouses' && renderList(warehouses, <Warehouse size={20} />)}
            {activeTab === 'categories' && renderList(categories, <Tag size={20} />)}
            {activeTab === 'units' && renderList(units, <Scale size={20} />)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StockSettings;
