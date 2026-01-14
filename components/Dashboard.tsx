import React from 'react';
import { 
  DollarSign, 
  Share2, 
  ThumbsUp, 
  Star, 
  MoreHorizontal 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock Data
const barData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
];

const pieData = [
  { name: 'Completed', value: 85 },
  { name: 'Remaining', value: 15 },
];

const waveData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const COLORS = ['#1e3a8a', '#f3f4f6']; // Dark Blue, Light Gray

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="printable-area">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Dark Blue (Earning style) */}
        <div className="bg-[#0f172a] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Saldo Pendente</p>
              <h3 className="text-3xl font-bold">8.172k</h3>
            </div>
            <div className="bg-white/10 p-2 rounded-lg text-white">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-blue-300/80">landiconsultores.co.mz</p>
        </div>

        {/* Card 2: White (Share style) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Facturas</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">2434</h3>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-500">
              <Share2 size={20} />
            </div>
          </div>
        </div>

        {/* Card 3: White (Likes style) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Recibos</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">1259</h3>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg text-yellow-500">
              <ThumbsUp size={20} />
            </div>
          </div>
        </div>

        {/* Card 4: White (Rating style) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Satisfação</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">8.5</h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-500">
              <Star size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Bar Chart + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Faturamento Anual</h3>
            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal /></button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="income" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center relative">
          <h3 className="absolute top-6 left-6 text-lg font-bold text-gray-800 dark:text-white">Metas</h3>
          <div className="w-full h-64 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="cell-0" fill="#1e3a8a" />
                  <Cell key="cell-1" fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-800 dark:text-white">85%</span>
              <span className="text-xs text-gray-400">Meta Atingida</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 px-4">
            Progresso total das metas financeiras estabelecidas para este trimestre.
          </p>
        </div>
      </div>

      {/* Bottom Section: Wave Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wave Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Fluxo de Caixa</h3>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
               <span className="w-3 h-3 rounded-full bg-blue-900"></span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorVal2)" strokeDasharray="5 5"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Calendário</h3>
             <span className="text-sm text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">Hoje</span>
          </div>
          <div className="grid grid-cols-7 text-center text-sm gap-y-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-gray-400 font-medium">{d}</div>
            ))}
             {Array.from({length: 31}, (_, i) => i + 1).map(day => (
               <div 
                key={day} 
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto text-gray-600 dark:text-gray-300
                  ${day === 15 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : ''}
                  ${day === 24 ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
               >
                 {day}
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;