import React from 'react';
import { Expense, ThemeType } from '../types';
import { Battery, Coffee, ShoppingBag, Map, Zap, Car, Home, Utensils } from 'lucide-react';

interface VisualAssetsProps {
  expenses: Expense[];
  theme: ThemeType;
}

// Group expenses by category
const groupExpenses = (expenses: Expense[]) => {
  const groups: Record<string, { total: number; count: number; items: Expense[] }> = {};
  expenses.forEach(e => {
    const cat = e.category || '其他';
    if (!groups[cat]) groups[cat] = { total: 0, count: 0, items: [] };
    groups[cat].total += e.amount;
    groups[cat].count += 1;
    groups[cat].items.push(e);
  });
  return groups;
};

const getCategoryIcon = (category: string) => {
  if (category.includes('食') || category.includes('Food')) return <Utensils className="mr-2 h-4 w-4" />;
  if (category.includes('車') || category.includes('交') || category.includes('Transport')) return <Car className="mr-2 h-4 w-4" />;
  if (category.includes('購') || category.includes('Shopping')) return <ShoppingBag className="mr-2 h-4 w-4" />;
  return <Zap className="mr-2 h-4 w-4" />;
};

const getCategoryIconCozy = (category: string) => {
  if (category.includes('食') || category.includes('Food')) return <Coffee className="text-cozy-secondary w-8 h-8" />;
  if (category.includes('車') || category.includes('交') || category.includes('Transport')) return <Map className="text-cozy-accent w-8 h-8" />;
  return <ShoppingBag className="text-cozy-primary w-8 h-8" />;
};

const getCategoryIconMinimal = (category: string) => {
  if (category.includes('食') || category.includes('Food')) return <Utensils className="w-4 h-4 text-gray-700" />;
  return <ShoppingBag className="w-4 h-4 text-gray-700" />;
};

const VisualAssets: React.FC<VisualAssetsProps> = ({ expenses, theme }) => {
  const groups = groupExpenses(expenses);

  const renderCyberpunk = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groups).map(([cat, data]) => (
        <div key={cat} className="border-2 border-cyber-primary p-4 bg-cyber-card relative overflow-hidden group hover:border-cyber-accent transition-all">
          <div className="absolute top-0 right-0 p-1 bg-cyber-secondary text-xs font-mono text-white">SYS.LOG: {data.count}</div>
          <h3 className="text-cyber-primary font-mono text-xl mb-2 flex items-center uppercase tracking-widest">
            {getCategoryIcon(cat)}
            {cat}
          </h3>
          <div className="w-full bg-gray-900 h-4 border border-cyber-primary/50 relative">
            <div 
              className="bg-cyber-primary h-full absolute top-0 left-0 animate-pulse" 
              style={{ width: `${Math.min((data.total / 500) * 100, 100)}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-cyber-primary font-bold">
              負載: {data.total.toFixed(0)} / 500 信用點
            </span>
          </div>
          <div className="mt-2 text-xs text-cyber-accent font-mono opacity-80">
            最新: {data.items[data.items.length - 1].description}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCozy = () => (
    <div className="flex flex-wrap gap-6 justify-center">
      {Object.entries(groups).map(([cat, data]) => (
        <div key={cat} className="bg-cozy-card w-full md:w-5/12 rounded-3xl p-6 shadow-lg border-4 border-cozy-bg flex flex-col items-center">
          <div className="bg-cozy-bg p-4 rounded-full mb-2 border-2 border-cozy-primary">
            {getCategoryIconCozy(cat)}
          </div>
          <h3 className="text-cozy-primary font-serif font-bold text-lg mb-1">{cat} 收藏集</h3>
          <p className="text-gray-600 text-sm italic mb-3">你已經收集了 {data.count} 個物品！</p>
          
          <div className="flex gap-1 flex-wrap justify-center">
            {data.items.slice(-5).map((item, idx) => (
              <div key={idx} className="w-8 h-8 rounded-lg bg-white border-2 border-cozy-bg flex items-center justify-center text-xs" title={item.description}>
                 {idx % 2 === 0 ? '🌰' : '🍄'}
              </div>
            ))}
             {data.items.length > 5 && <span className="text-xs text-cozy-secondary pt-2">+{data.items.length - 5} 更多</span>}
          </div>
          <div className="mt-3 w-full bg-white rounded-full h-3 overflow-hidden">
             <div className="bg-cozy-secondary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((data.total / 500) * 100, 100)}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMinimalist = () => (
    <div className="space-y-4">
      {Object.entries(groups).map(([cat, data]) => (
        <div key={cat} className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
           <div className="flex items-center gap-4 w-1/3">
              <div className="p-2 bg-gray-100 rounded">
                {getCategoryIconMinimal(cat)}
              </div>
              <span className="font-sans font-medium text-gray-800">{cat}</span>
           </div>
           
           <div className="w-1/3 px-2">
             <div className="w-full bg-gray-100 h-1">
                <div className="bg-black h-1" style={{ width: `${Math.min((data.total / 500) * 100, 100)}%` }}></div>
             </div>
           </div>

           <div className="w-1/3 text-right font-mono text-sm">
             ${data.total.toFixed(2)}
           </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {theme === 'cyberpunk' && renderCyberpunk()}
      {theme === 'cozy' && renderCozy()}
      {theme === 'minimalist' && renderMinimalist()}
      {expenses.length === 0 && (
        <div className={`text-center p-10 opacity-50 ${theme === 'cyberpunk' ? 'text-cyber-accent font-mono' : 'text-gray-500'}`}>
           無資料 // 開始記錄
        </div>
      )}
    </div>
  );
};

export default VisualAssets;