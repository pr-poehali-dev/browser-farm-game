import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Player, PlantedCrop, FarmAnimal, Achievement } from '@/types/game';
import { ACHIEVEMENTS } from '@/data/achievements';
import { CROPS } from '@/data/crops';
import { ANIMALS } from '@/data/animals';

interface GameContextType {
  gameState: GameState;
  plantCrop: (cropId: string, plot: number) => boolean;
  harvestCrop: (cropId: string) => void;
  buyAnimal: (animalId: string) => boolean;
  collectProduct: (animalId: string) => void;
  buyCrop: (cropId: string) => boolean;
  sellProduct: (productName: string, amount: number) => void;
  buyGems: (amount: number) => void;
  addFriend: (friendId: string) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYER: Player = {
  id: '1',
  name: 'Фермер',
  avatar: '👨‍🌾',
  level: 1,
  experience: 0,
  experienceToNext: 100,
  coins: 500,
  gems: 10,
  plots: 6,
  barnCapacity: 5,
  inventory: {},
  statistics: {
    cropsHarvested: 0,
    animalsCollected: 0,
    coinsEarned: 0,
    productsSold: 0,
  },
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('field');
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('farmGameState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      player: INITIAL_PLAYER,
      plantedCrops: [],
      animals: [],
      achievements: ACHIEVEMENTS,
      friends: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('farmGameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const updatedCrops = prev.plantedCrops.map((crop) => ({
          ...crop,
          isReady: now >= crop.harvestAt,
        }));
        const updatedAnimals = prev.animals.map((animal) => {
          const animalData = ANIMALS.find((a) => a.id === animal.animalId);
          if (!animalData) return animal;
          return {
            ...animal,
            isReady: now - animal.lastCollection >= animalData.productionTime * 1000,
          };
        });
        return {
          ...prev,
          plantedCrops: updatedCrops,
          animals: updatedAnimals,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAchievements = (newState: GameState) => {
    const updatedAchievements = newState.achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;
      
      let unlocked = false;
      const { type, value } = achievement.condition;
      
      switch (type) {
        case 'crops_harvested':
          unlocked = newState.player.statistics.cropsHarvested >= value;
          break;
        case 'animals_collected':
          unlocked = newState.player.statistics.animalsCollected >= value;
          break;
        case 'coins_earned':
          unlocked = newState.player.statistics.coinsEarned >= value;
          break;
        case 'level_reached':
          unlocked = newState.player.level >= value;
          break;
        case 'products_sold':
          unlocked = newState.player.statistics.productsSold >= value;
          break;
      }
      
      if (unlocked) {
        newState.player.coins += achievement.reward.coins || 0;
        newState.player.experience += achievement.reward.experience || 0;
        newState.player.gems += achievement.reward.gems || 0;
      }
      
      return { ...achievement, unlocked };
    });
    
    return updatedAchievements;
  };

  const addExperience = (state: GameState, exp: number): GameState => {
    let newExp = state.player.experience + exp;
    let newLevel = state.player.level;
    let expToNext = state.player.experienceToNext;
    
    while (newExp >= expToNext) {
      newExp -= expToNext;
      newLevel += 1;
      expToNext = Math.floor(expToNext * 1.5);
    }
    
    return {
      ...state,
      player: {
        ...state.player,
        experience: newExp,
        level: newLevel,
        experienceToNext: expToNext,
      },
    };
  };

  const plantCrop = (cropId: string, plot: number): boolean => {
    const crop = CROPS.find((c) => c.id === cropId);
    if (!crop) return false;
    
    if (gameState.player.coins < crop.price) return false;
    if (gameState.player.level < crop.level) return false;
    
    const plotOccupied = gameState.plantedCrops.some((c) => c.plot === plot);
    if (plotOccupied) return false;
    
    const now = Date.now();
    const newCrop: PlantedCrop = {
      id: `crop-${now}-${plot}`,
      cropId: crop.id,
      plantedAt: now,
      harvestAt: now + crop.growthTime * 1000,
      isReady: false,
      plot,
    };
    
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        coins: prev.player.coins - crop.price,
      },
      plantedCrops: [...prev.plantedCrops, newCrop],
    }));
    
    return true;
  };

  const harvestCrop = (cropId: string) => {
    setGameState((prev) => {
      const cropToHarvest = prev.plantedCrops.find((c) => c.id === cropId);
      if (!cropToHarvest || !cropToHarvest.isReady) return prev;
      
      const cropData = CROPS.find((c) => c.id === cropToHarvest.cropId);
      if (!cropData) return prev;
      
      let newState: GameState = {
        ...prev,
        plantedCrops: prev.plantedCrops.filter((c) => c.id !== cropId),
        player: {
          ...prev.player,
          coins: prev.player.coins + cropData.sellPrice * cropData.harvestAmount,
          statistics: {
            ...prev.player.statistics,
            cropsHarvested: prev.player.statistics.cropsHarvested + 1,
            coinsEarned: prev.player.statistics.coinsEarned + cropData.sellPrice * cropData.harvestAmount,
            productsSold: prev.player.statistics.productsSold + cropData.harvestAmount,
          },
        },
      };
      
      newState = addExperience(newState, 10);
      newState.achievements = checkAchievements(newState);
      
      return newState;
    });
  };

  const buyAnimal = (animalId: string): boolean => {
    const animal = ANIMALS.find((a) => a.id === animalId);
    if (!animal) return false;
    
    if (gameState.player.coins < animal.price) return false;
    if (gameState.player.level < animal.level) return false;
    if (gameState.animals.length >= gameState.player.barnCapacity) return false;
    
    const newAnimal: FarmAnimal = {
      id: `animal-${Date.now()}`,
      animalId: animal.id,
      lastCollection: Date.now(),
      isReady: false,
    };
    
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        coins: prev.player.coins - animal.price,
      },
      animals: [...prev.animals, newAnimal],
    }));
    
    return true;
  };

  const collectProduct = (animalId: string) => {
    setGameState((prev) => {
      const farmAnimal = prev.animals.find((a) => a.id === animalId);
      if (!farmAnimal || !farmAnimal.isReady) return prev;
      
      const animalData = ANIMALS.find((a) => a.id === farmAnimal.animalId);
      if (!animalData) return prev;
      
      const earnings = animalData.product.sellPrice * animalData.product.amount;
      
      let newState: GameState = {
        ...prev,
        animals: prev.animals.map((a) =>
          a.id === animalId ? { ...a, lastCollection: Date.now(), isReady: false } : a
        ),
        player: {
          ...prev.player,
          coins: prev.player.coins + earnings,
          statistics: {
            ...prev.player.statistics,
            animalsCollected: prev.player.statistics.animalsCollected + 1,
            coinsEarned: prev.player.statistics.coinsEarned + earnings,
            productsSold: prev.player.statistics.productsSold + animalData.product.amount,
          },
        },
      };
      
      newState = addExperience(newState, 15);
      newState.achievements = checkAchievements(newState);
      
      return newState;
    });
  };

  const buyCrop = (cropId: string): boolean => {
    return plantCrop(cropId, gameState.plantedCrops.length);
  };

  const sellProduct = (productName: string, amount: number) => {
    setGameState((prev) => {
      const inventory = prev.player.inventory[productName] || 0;
      if (inventory < amount) return prev;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          inventory: {
            ...prev.player.inventory,
            [productName]: inventory - amount,
          },
          statistics: {
            ...prev.player.statistics,
            productsSold: prev.player.statistics.productsSold + amount,
          },
        },
      };
    });
  };

  const buyGems = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        gems: prev.player.gems + amount,
      },
    }));
  };

  const addFriend = (friendId: string) => {
    console.log('Adding friend:', friendId);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        plantCrop,
        harvestCrop,
        buyAnimal,
        collectProduct,
        buyCrop,
        sellProduct,
        buyGems,
        addFriend,
        currentSection,
        setCurrentSection,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
