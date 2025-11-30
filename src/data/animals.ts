import { Animal } from '@/types/game';

export const ANIMALS: Animal[] = [
  {
    id: 'chicken',
    name: '🐔 Курица',
    icon: '🐔',
    productionTime: 180,
    price: 100,
    product: {
      name: 'Яйца',
      icon: '🥚',
      sellPrice: 30,
      amount: 3,
    },
    level: 1,
  },
  {
    id: 'cow',
    name: '🐄 Корова',
    icon: '🐄',
    productionTime: 360,
    price: 300,
    product: {
      name: 'Молоко',
      icon: '🥛',
      sellPrice: 80,
      amount: 2,
    },
    level: 3,
  },
  {
    id: 'sheep',
    name: '🐑 Овца',
    icon: '🐑',
    productionTime: 480,
    price: 500,
    product: {
      name: 'Шерсть',
      icon: '🧶',
      sellPrice: 150,
      amount: 2,
    },
    level: 5,
  },
  {
    id: 'pig',
    name: '🐷 Свинья',
    icon: '🐷',
    productionTime: 300,
    price: 250,
    product: {
      name: 'Бекон',
      icon: '🥓',
      sellPrice: 100,
      amount: 3,
    },
    level: 4,
  },
  {
    id: 'goat',
    name: '🐐 Коза',
    icon: '🐐',
    productionTime: 420,
    price: 450,
    product: {
      name: 'Козий сыр',
      icon: '🧀',
      sellPrice: 120,
      amount: 2,
    },
    level: 7,
  },
];
