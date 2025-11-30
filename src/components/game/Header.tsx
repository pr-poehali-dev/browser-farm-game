import { useGame } from '@/contexts/GameContext';
import { Progress } from '@/components/ui/progress';

export const Header = () => {
  const { gameState } = useGame();
  const { player } = gameState;
  
  const expProgress = (player.experience / player.experienceToNext) * 100;
  
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{player.avatar}</div>
            <div>
              <h2 className="text-xl font-bold">{player.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <span>Уровень {player.level}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="font-bold">{player.coins}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="font-bold">{player.gems}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={expProgress} className="h-2 flex-1" />
          <span className="text-xs whitespace-nowrap">
            {player.experience} / {player.experienceToNext} XP
          </span>
        </div>
      </div>
    </div>
  );
};
