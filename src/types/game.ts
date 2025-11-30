export interface Crop {
  id: string;
  name: string;
  icon: string;
  growthTime: number;
  price: number;
  sellPrice: number;
  harvestAmount: number;
  level: number;
}

export interface Animal {
  id: string;
  name: string;
  icon: string;
  productionTime: number;
  price: number;
  product: {
    name: string;
    icon: string;
    sellPrice: number;
    amount: number;
  };
  level: number;
}

export interface FarmAnimal {
  id: string;
  animalId: string;
  lastCollection: number;
  isReady: boolean;
}

export interface PlantedCrop {
  id: string;
  cropId: string;
  plantedAt: number;
  harvestAt: number;
  isReady: boolean;
  plot: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'crops_harvested' | 'animals_collected' | 'coins_earned' | 'level_reached' | 'products_sold';
    value: number;
  };
  reward: {
    coins?: number;
    experience?: number;
    gems?: number;
  };
  unlocked: boolean;
}

export interface Friend {
  id: string;
  name: string;
  level: number;
  avatar: string;
  lastActive: number;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'crop' | 'animal' | 'decoration' | 'expansion' | 'premium';
  icon: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  level: number;
  data?: any;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  experienceToNext: number;
  coins: number;
  gems: number;
  plots: number;
  barnCapacity: number;
  inventory: {
    [key: string]: number;
  };
  statistics: {
    cropsHarvested: number;
    animalsCollected: number;
    coinsEarned: number;
    productsSold: number;
  };
}

export interface GameState {
  player: Player;
  plantedCrops: PlantedCrop[];
  animals: FarmAnimal[];
  achievements: Achievement[];
  friends: Friend[];
}
