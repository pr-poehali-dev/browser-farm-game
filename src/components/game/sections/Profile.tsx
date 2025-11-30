import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export const Profile = () => {
  const { gameState } = useGame();
  const { player } = gameState;
  
  const expProgress = (player.experience / player.experienceToNext) * 100;
  const achievementsUnlocked = gameState.achievements.filter((a) => a.unlocked).length;
  
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-8xl bg-white/20 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center">
                {player.avatar}
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
                <div className="flex items-center gap-2 text-xl mb-4">
                  <span>⭐ Уровень {player.level}</span>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Опыт до следующего уровня</span>
                    <span className="font-bold">
                      {player.experience} / {player.experienceToNext}
                    </span>
                  </div>
                  <Progress value={expProgress} className="h-3" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold">{player.coins}</div>
                <div className="text-sm opacity-90">Монеты</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-2xl font-bold">{player.gems}</div>
                <div className="text-sm opacity-90">Алмазы</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🌾</div>
                <div className="text-2xl font-bold">{player.plots}</div>
                <div className="text-sm opacity-90">Грядки</div>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🏚️</div>
                <div className="text-2xl font-bold">{player.barnCapacity}</div>
                <div className="text-sm opacity-90">Животных</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={24} />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl mb-2">🌾</div>
                <div className="text-2xl font-bold text-green-600">
                  {player.statistics.cropsHarvested}
                </div>
                <div className="text-sm text-gray-600">Собрано урожаев</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-4xl mb-2">🐄</div>
                <div className="text-2xl font-bold text-orange-600">
                  {player.statistics.animalsCollected}
                </div>
                <div className="text-sm text-gray-600">Собрано продукции</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {player.statistics.coinsEarned}
                </div>
                <div className="text-sm text-gray-600">Заработано монет</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-4xl mb-2">🛒</div>
                <div className="text-2xl font-bold text-purple-600">
                  {player.statistics.productsSold}
                </div>
                <div className="text-sm text-gray-600">Продано товаров</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trophy" size={24} />
              Достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-6xl">🏆</div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Получено достижений</span>
                  <span className="font-bold text-xl">
                    {achievementsUnlocked} / {gameState.achievements.length}
                  </span>
                </div>
                <Progress
                  value={(achievementsUnlocked / gameState.achievements.length) * 100}
                  className="h-3"
                />
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {gameState.achievements
                .filter((a) => a.unlocked)
                .map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full"
                  >
                    <span className="text-xl">{achievement.icon}</span>
                    <span className="text-sm font-medium">{achievement.name}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sprout" size={24} />
              Активная ферма
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-4xl mb-2">🌾</div>
                <div className="text-2xl font-bold text-green-600">
                  {gameState.plantedCrops.length}
                </div>
                <div className="text-sm text-gray-600">Посажено культур</div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-4xl mb-2">🐄</div>
                <div className="text-2xl font-bold text-orange-600">
                  {gameState.animals.length}
                </div>
                <div className="text-sm text-gray-600">Животных в амбаре</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
