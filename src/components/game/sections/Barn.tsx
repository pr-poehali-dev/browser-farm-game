import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { ANIMALS } from '@/data/animals';
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

export const Barn = () => {
  const { gameState, buyAnimal, collectProduct } = useGame();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleBuyAnimal = (animalId: string) => {
    const success = buyAnimal(animalId);
    if (success) {
      setDialogOpen(false);
    }
  };
  
  const getAnimalData = (animalId: string) => {
    return ANIMALS.find((a) => a.id === animalId);
  };
  
  return (
    <div className="p-6">
      <div 
        className="max-w-7xl mx-auto rounded-2xl p-8 shadow-xl min-h-[500px]"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/34cdbeb7-0c59-42a8-9f50-a270fcdeeff7/files/89848233-c99a-4e97-a080-b9010756b699.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">🏚️ Амбар</h2>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
            disabled={gameState.animals.length >= gameState.player.barnCapacity}
          >
            + Купить животное
          </Button>
        </div>
        
        <div className="mb-4 text-white bg-black/30 backdrop-blur-sm p-3 rounded-lg inline-block">
          <span className="font-medium">
            Животных: {gameState.animals.length} / {gameState.player.barnCapacity}
          </span>
        </div>
        
        {gameState.animals.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🐄</div>
              <p className="text-gray-600">
                В амбаре пока нет животных. Купите первое животное!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gameState.animals.map((farmAnimal) => {
              const animal = getAnimalData(farmAnimal.animalId);
              if (!animal) return null;
              
              const nextCollection = farmAnimal.lastCollection + animal.productionTime * 1000;
              
              return (
                <Card
                  key={farmAnimal.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    farmAnimal.isReady
                      ? 'border-4 border-yellow-400 animate-pulse-glow'
                      : ''
                  }`}
                  onClick={() => farmAnimal.isReady && collectProduct(farmAnimal.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-6xl mb-2 animate-bounce-gentle">{animal.icon}</div>
                    <div className="text-sm font-medium mb-2">{animal.name}</div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <div>{animal.product.icon} {animal.product.name}</div>
                      <div className="text-green-600 font-medium">
                        💰 {animal.product.sellPrice} × {animal.product.amount}
                      </div>
                    </div>
                    
                    {farmAnimal.isReady ? (
                      <div className="text-green-600 font-bold">✅ Готово!</div>
                    ) : (
                      <div className="text-gray-600 text-xs">
                        Готово {formatDistanceToNow(nextCollection, { addSuffix: true, locale: ru })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Купить животное</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            {ANIMALS.map((animal) => {
              const canAfford = gameState.player.coins >= animal.price;
              const hasLevel = gameState.player.level >= animal.level;
              const hasSpace = gameState.animals.length < gameState.player.barnCapacity;
              const canBuy = canAfford && hasLevel && hasSpace;
              
              return (
                <Card
                  key={animal.id}
                  className={`${!canBuy ? 'opacity-50' : 'cursor-pointer hover:bg-accent'}`}
                >
                  <CardContent className="p-3">
                    <div className="text-4xl text-center mb-2">{animal.icon}</div>
                    <div className="text-sm font-medium text-center mb-1">{animal.name}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>💰 {animal.price} монет</div>
                      <div>⏱️ {Math.floor(animal.productionTime / 60)} мин</div>
                      <div>
                        {animal.product.icon} {animal.product.name}
                      </div>
                      <div>💵 {animal.product.sellPrice} × {animal.product.amount}</div>
                      <div>⭐ Уровень {animal.level}</div>
                    </div>
                    
                    <Button
                      className="w-full mt-2"
                      size="sm"
                      disabled={!canBuy}
                      onClick={() => handleBuyAnimal(animal.id)}
                    >
                      {!hasSpace
                        ? 'Нет места'
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
