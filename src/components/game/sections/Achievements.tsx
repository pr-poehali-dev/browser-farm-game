import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export const Achievements = () => {
  const { gameState } = useGame();
  
  const getProgress = (achievement: typeof gameState.achievements[0]) => {
    const { type, value } = achievement.condition;
    let current = 0;
    
    switch (type) {
      case 'crops_harvested':
        current = gameState.player.statistics.cropsHarvested;
        break;
      case 'animals_collected':
        current = gameState.player.statistics.animalsCollected;
        break;
      case 'coins_earned':
        current = gameState.player.statistics.coinsEarned;
        break;
      case 'level_reached':
        current = gameState.player.level;
        break;
      case 'products_sold':
        current = gameState.player.statistics.productsSold;
        break;
    }
    
    return { current, total: value, percentage: Math.min((current / value) * 100, 100) };
  };
  
  const unlockedCount = gameState.achievements.filter((a) => a.unlocked).length;
  
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Trophy" size={40} className="text-yellow-300" />
            <div>
              <h2 className="text-3xl font-bold">Достижения</h2>
              <p className="text-purple-100">Твой прогресс в игре</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Общий прогресс</span>
              <span className="font-bold text-xl">
                {unlockedCount} / {gameState.achievements.length}
              </span>
            </div>
            <Progress
              value={(unlockedCount / gameState.achievements.length) * 100}
              className="h-3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameState.achievements.map((achievement) => {
            const progress = getProgress(achievement);
            
            return (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  achievement.unlocked
                    ? 'border-4 border-yellow-400 shadow-xl'
                    : 'opacity-70'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`text-5xl ${achievement.unlocked ? 'animate-bounce-gentle' : ''}`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Прогресс</span>
                          <span>
                            {progress.current} / {progress.total}
                          </span>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-700">Награда:</div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {achievement.reward.coins && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              💰 {achievement.reward.coins}
                            </span>
                          )}
                          {achievement.reward.experience && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              ⭐ {achievement.reward.experience} XP
                            </span>
                          )}
                          {achievement.reward.gems && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              💎 {achievement.reward.gems}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {achievement.unlocked && (
                        <div className="mt-3 flex items-center gap-2 text-green-600 font-bold">
                          <Icon name="Check" size={20} />
                          <span>Получено!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
