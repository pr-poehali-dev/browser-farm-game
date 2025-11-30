import { useGame } from '@/contexts/GameContext';
import { CROPS } from '@/data/crops';
import { ANIMALS } from '@/data/animals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export const Shop = () => {
  const { gameState, buyAnimal, setCurrentSection } = useGame();
  
  const handleBuyCrop = () => {
    setCurrentSection('field');
  };
  
  const handleBuyAnimal = (animalId: string) => {
    buyAnimal(animalId);
  };
  
  return (
    <div className="p-6">
      <div 
        className="max-w-7xl mx-auto rounded-2xl p-8 shadow-xl min-h-[500px]"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/34cdbeb7-0c59-42a8-9f50-a270fcdeeff7/files/3b4ff2c0-0115-408b-87db-76b966426e96.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">🛒 Магазин</h2>
        
        <Tabs defaultValue="crops" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="crops">🌾 Семена</TabsTrigger>
            <TabsTrigger value="animals">🐄 Животные</TabsTrigger>
            <TabsTrigger value="upgrades">⭐ Улучшения</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crops">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CROPS.map((crop) => {
                const canAfford = gameState.player.coins >= crop.price;
                const hasLevel = gameState.player.level >= crop.level;
                const canBuy = canAfford && hasLevel;
                
                return (
                  <Card key={crop.id} className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-5xl text-center mb-3">{crop.icon}</div>
                      <div className="text-sm font-medium text-center mb-2">{crop.name}</div>
                      
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span>Цена:</span>
                          <span className="font-medium">💰 {crop.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Рост:</span>
                          <span className="font-medium">⏱️ {Math.floor(crop.growthTime / 60)}м</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Продажа:</span>
                          <span className="font-medium text-green-600">
                            💵 {crop.sellPrice} × {crop.harvestAmount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Уровень:</span>
                          <span className="font-medium">⭐ {crop.level}</span>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        size="sm"
                        disabled={!canBuy}
                        onClick={handleBuyCrop}
                      >
                        {!hasLevel
                          ? `Нужен ${crop.level} ур.`
                          : !canAfford
                          ? 'Недостаточно монет'
                          : 'Купить'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="animals">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ANIMALS.map((animal) => {
                const canAfford = gameState.player.coins >= animal.price;
                const hasLevel = gameState.player.level >= animal.level;
                const hasSpace = gameState.animals.length < gameState.player.barnCapacity;
                const canBuy = canAfford && hasLevel && hasSpace;
                
                return (
                  <Card key={animal.id} className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-5xl text-center mb-3">{animal.icon}</div>
                      <div className="text-sm font-medium text-center mb-2">{animal.name}</div>
                      
                      <div className="text-xs text-gray-600 space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span>Цена:</span>
                          <span className="font-medium">💰 {animal.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Производство:</span>
                          <span className="font-medium">⏱️ {Math.floor(animal.productionTime / 60)}м</span>
                        </div>
                        <div className="text-center my-2 p-2 bg-green-50 rounded">
                          <div className="font-medium">{animal.product.icon} {animal.product.name}</div>
                          <div className="text-green-600 font-bold">
                            💵 {animal.product.sellPrice} × {animal.product.amount}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Уровень:</span>
                          <span className="font-medium">⭐ {animal.level}</span>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        size="sm"
                        disabled={!canBuy}
                        onClick={() => handleBuyAnimal(animal.id)}
                      >
                        {!hasSpace
                          ? 'Нет места в амбаре'
                          : !hasLevel
                          ? `Нужен ${animal.level} ур.`
                          : !canAfford
                          ? 'Недостаточно монет'
                          : 'Купить'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="upgrades">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Plus" size={24} />
                    Новая грядка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Добавить еще одну грядку для выращивания культур
                  </p>
                  <div className="text-lg font-bold mb-4">💎 50 алмазов</div>
                  <Button className="w-full" disabled>
                    Скоро
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Warehouse" size={24} />
                    Расширение амбара
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Увеличить вместимость амбара на 2 животных
                  </p>
                  <div className="text-lg font-bold mb-4">💎 100 алмазов</div>
                  <Button className="w-full" disabled>
                    Скоро
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Zap" size={24} />
                    Ускорение роста
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Ускорить рост всех культур на 2 часа
                  </p>
                  <div className="text-lg font-bold mb-4">💎 30 алмазов</div>
                  <Button className="w-full" disabled>
                    Скоро
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
