import React from 'react';
import { UserState, ThemeType } from '../types';
import { Trophy, Star, Lock, Unlock } from 'lucide-react';

interface GamificationProps {
  userState: UserState;
  theme: ThemeType;
}

const Gamification: React.FC<GamificationProps> = ({ userState, theme }) => {
  const progressPercent = (userState.xp / userState.maxXp) * 100;

  const styles = {
    cyberpunk: {
      barBg: 'bg-gray-800',
      barFill: 'bg-cyber-primary shadow-[0_0_10px_#00ff9f]',
      text: 'text-cyber-primary font-mono',
      card: 'bg-cyber-card border border-cyber-accent',
      icon: 'text-cyber-secondary'
    },
    cozy: {
      barBg: 'bg-white',
      barFill: 'bg-cozy-secondary',
      text: 'text-cozy-primary font-serif font-bold',
      card: 'bg-cozy-card border-2 border-white shadow-inner rounded-2xl',
      icon: 'text-orange-400'
    },
    minimalist: {
      barBg: 'bg-gray-200',
      barFill: 'bg-black',
      text: 'text-black font-sans font-medium',
      card: 'bg-gray-50 border border-gray-300',
      icon: 'text-gray-600'
    }
  };

  const s = styles[theme];
  
  const themeNames: Record<string, string> = {
    cyberpunk: '賽博龐克',
    cozy: '溫馨森系',
    minimalist: '極簡主義'
  };

  return (
    <div className={`w-full p-4 mb-6 ${s.card}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${theme === 'cozy' ? 'bg-white' : 'bg-black/20'}`}>
            <Trophy className={`w-5 h-5 ${s.icon}`} />
          </div>
          <div>
            <p className={`text-xs opacity-70 ${theme === 'cyberpunk' ? 'text-white' : 'text-gray-600'}`}>目前等級</p>
            <p className={`text-xl ${s.text}`}>LVL {userState.level}</p>
          </div>
        </div>
        <div className="text-right">
           <div className="flex items-center gap-1 justify-end">
             <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
             <span className={theme === 'cyberpunk' ? 'text-white' : 'text-gray-800'}>{userState.xp} / {userState.maxXp} XP</span>
           </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className={`w-full h-3 ${s.barBg} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${s.barFill} transition-all duration-1000 ease-out`} 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Unlockables Preview */}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {['cyberpunk', 'cozy', 'minimalist'].map((t) => {
           const isUnlocked = userState.unlockedThemes.includes(t as ThemeType);
           return (
             <div key={t} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded border ${isUnlocked ? 'border-green-500 bg-green-500/10' : 'border-gray-500 bg-gray-500/10'}`}>
                {isUnlocked ? <Unlock className="w-3 h-3 text-green-500" /> : <Lock className="w-3 h-3 text-gray-500" />}
                <span className="text-xs uppercase">{themeNames[t] || t}</span>
             </div>
           )
        })}
      </div>
    </div>
  );
};

export default Gamification;