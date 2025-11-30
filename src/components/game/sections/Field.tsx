import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { CROPS } from '@/data/crops';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const Field = () => {
  const { gameState, plantCrop, harvestCrop } = useGame();
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handlePlotClick = (plot: number) => {
    const planted = gameState.plantedCrops.find((c) => c.plot === plot);
    if (planted) {
      if (planted.isReady) {
        harvestCrop(planted.id);
      }
    } else {
      setSelectedPlot(plot);
      setDialogOpen(true);
    }
  };
  
  const handlePlantCrop = (cropId: string) => {
    if (selectedPlot !== null) {
      const success = plantCrop(cropId, selectedPlot);
      if (success) {
        setDialogOpen(false);
        setSelectedPlot(null);
      }
    }
  };
  
  const getPlotStatus = (plot: number) => {
    const planted = gameState.plantedCrops.find((c) => c.plot === plot);
    if (!planted) return null;
    
    const crop = CROPS.find((c) => c.id === planted.cropId);
    if (!crop) return null;
    
    return { planted, crop };
  };
  
  return (
    <div className="p-6">
      <div 
        className="max-w-7xl mx-auto rounded-2xl p-8 shadow-xl min-h-[500px]"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/34cdbeb7-0c59-42a8-9f50-a270fcdeeff7/files/65143eb3-f62c-40df-a3aa-0cac15730b5f.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">🌾 Поле</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: gameState.player.plots }).map((_, i) => {
            const status = getPlotStatus(i);
            
            return (
              <Card
                key={i}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  status?.planted.isReady
                    ? 'border-4 border-yellow-400 animate-pulse-glow'
                    : ''
                }`}
                onClick={() => handlePlotClick(i)}
              >
                <CardContent className="p-4 text-center">
                  {status ? (
                    <>
                      <div className="text-6xl mb-2 animate-bounce-gentle">{status.crop.icon}</div>
                      <div className="text-sm font-medium">{status.crop.name}</div>
                      {status.planted.isReady ? (
                        <div className="text-green-600 font-bold mt-2">✅ Готово!</div>
                      ) : (
                        <div className="text-gray-600 text-xs mt-2">
                          Готово {formatDistanceToNow(status.planted.harvestAt, { addSuffix: true, locale: ru })}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-2">🟫</div>
                      <div className="text-sm text-gray-600">Пустая грядка</div>
                      <div className="text-xs text-gray-500 mt-1">Нажми для посадки</div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выберите культуру для посадки</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            {CROPS.map((crop) => {
              const canAfford = gameState.player.coins >= crop.price;
              const hasLevel = gameState.player.level >= crop.level;
              const canPlant = canAfford && hasLevel;
              
              return (
                <Card
                  key={crop.id}
                  className={`${!canPlant ? 'opacity-50' : 'cursor-pointer hover:bg-accent'}`}
                >
                  <CardContent className="p-3">
                    <div className="text-4xl text-center mb-2">{crop.icon}</div>
                    <div className="text-sm font-medium text-center mb-1">{crop.name}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>💰 {crop.price} монет</div>
                      <div>⏱️ {Math.floor(crop.growthTime / 60)} мин</div>
                      <div>💵 Продажа: {crop.sellPrice} × {crop.harvestAmount}</div>
                      <div>⭐ Уровень {crop.level}</div>
                    </div>
                    
                    <Button
                      className="w-full mt-2"
                      size="sm"
                      disabled={!canPlant}
                      onClick={() => handlePlantCrop(crop.id)}
                    >
                      {!hasLevel
                        ? `Нужен ${crop.level} ур.`
                        : !canAfford
                        ? 'Недостаточно монет'
                        : 'Посадить'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
