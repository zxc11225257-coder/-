import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Settings, PieChart, Gamepad2, 
  MessageSquare, LayoutGrid, X, Ghost 
} from 'lucide-react';
import { ThemeType, Expense, UserState } from './types';
import VisualAssets from './components/VisualAssets';
import ReceiptUploader from './components/ReceiptUploader';
import Gamification from './components/Gamification';
import { generateExpenseInsight, generateDailyTip } from './services/geminiService';

// Initial State Mock
const INITIAL_EXPENSES: Expense[] = [
  { id: '1', amount: 120, category: '飲食', description: '壽司晚餐', date: '2023-10-25' },
  { id: '2', amount: 45, category: '交通', description: 'Uber 上班', date: '2023-10-26' },
  { id: '3', amount: 15, category: '飲食', description: '咖啡', date: '2023-10-26' },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('cyberpunk');
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [userState, setUserState] = useState<UserState>({
    level: 5,
    xp: 450,
    maxXp: 1000,
    streak: 3,
    coins: 120,
    unlockedThemes: ['cyberpunk', 'cozy', 'minimalist']
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>("系統上線。準備追蹤信用點數。");
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Form State
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState('飲食');

  // Theme Classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'cyberpunk':
        return "bg-cyber-bg text-gray-200 font-mono min-h-screen selection:bg-cyber-secondary selection:text-white";
      case 'cozy':
        return "bg-cozy-bg text-gray-800 font-serif min-h-screen selection:bg-cozy-accent selection:text-white";
      case 'minimalist':
        return "bg-minimal-bg text-black font-sans min-h-screen selection:bg-gray-300";
      default:
        return "";
    }
  };

  // Nav Classes
  const getNavClass = (active: boolean) => {
    const base = "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors";
    if (theme === 'cyberpunk') return `${base} ${active ? 'text-cyber-primary border-t-2 border-cyber-primary bg-cyber-primary/10' : 'text-gray-500 hover:text-white'}`;
    if (theme === 'cozy') return `${base} ${active ? 'text-cozy-secondary' : 'text-gray-400 hover:text-cozy-primary'}`;
    return `${base} ${active ? 'text-black font-bold' : 'text-gray-400'}`;
  };

  // Add Expense Logic
  const handleAddExpense = useCallback(async (manualData?: Partial<Expense>) => {
    const amount = manualData?.amount || parseFloat(newExpenseAmount);
    if (!amount) return;

    const newExpense: Expense = {
      id: Date