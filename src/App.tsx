import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type AnimalType = 'chicken' | 'cow' | 'sheep';
type ProductType = 'egg' | 'milk' | 'wool';

interface Animal {
  id: string;
  type: AnimalType;
  position: number;
  productionTime: number;
  maxProductionTime: number;
  level: number;
}

interface Product {
  type: ProductType;
  amount: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  unlocked: boolean;
  icon: string;
}

interface ShopItem {
  id: string;
  type: AnimalType;
  name: string;
  price: number;
  priceType: 'coins' | 'gems';
  emoji: string;
  isPremium: boolean;
}

const ANIMAL_DATA = {
  chicken: { emoji: '🐔', product: 'egg' as ProductType, productEmoji: '🥚', time: 5, price: 50 },
  cow: { emoji: '🐮', product: 'milk' as ProductType, productEmoji: '🥛', time: 10, price: 150 },
  sheep: { emoji: '🐑', product: 'wool' as ProductType, productEmoji: '🧶', time: 15, price: 200 },
};

const PRODUCT_PRICES = {
  egg: 10,
  milk: 25,
  wool: 40,
};

const SHOP_ITEMS: ShopItem[] = [
  { id: '1', type: 'chicken', name: 'Курица', price: 50, priceType: 'coins', emoji: '🐔', isPremium: false },
  { id: '2', type: 'cow', name: 'Корова', price: 150, priceType: 'coins', emoji: '🐮', isPremium: false },
  { id: '3', type: 'sheep', name: 'Овца', price: 200, priceType: 'coins', emoji: '🐑', isPremium: false },
  { id: '4', type: 'chicken', name: 'Золотая курица', price: 10, priceType: 'gems', emoji: '🐓', isPremium: true },
  { id: '5', type: 'cow', name: 'Радужная корова', price: 20, priceType: 'gems', emoji: '🦄', isPremium: true },
];

function App() {
  const [coins, setCoins] = useState(100);
  const [gems, setGems] = useState(5);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { type: 'egg', amount: 0 },
    { type: 'milk', amount: 0 },
    { type: 'wool', amount: 0 },
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Первые шаги', description: 'Купите первое животное', progress: 0, maxProgress: 1, reward: 20, unlocked: false, icon: '🌟' },
    { id: '2', title: 'Фермер', description: 'Соберите 50 продуктов', progress: 0, maxProgress: 50, reward: 100, unlocked: false, icon: '🏆' },
    { id: '3', title: 'Бизнесмен', description: 'Накопите 500 монет', progress: 0, maxProgress: 500, reward: 50, unlocked: false, icon: '💰' },
    { id: '4', title: 'Коллекционер', description: 'Купите по одному животному каждого вида', progress: 0, maxProgress: 3, reward: 10, unlocked: false, icon: '🎯' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimals(prev =>
        prev.map(animal => {
          if (animal.productionTime < animal.maxProductionTime) {
            return { ...animal, productionTime: animal.productionTime + 1 };
          }
          return animal;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const buyAnimal = (item: ShopItem) => {
    const emptySlot = Array.from({ length: 9 }, (_, i) => i).find(
      pos => !animals.some(a => a.position === pos)
    );

    if (emptySlot === undefined) {
      toast({ title: '❌ Нет места', description: 'На ферме закончилось место для животных' });
      return;
    }

    if (item.priceType === 'coins' && coins < item.price) {
      toast({ title: '❌ Недостаточно монет', description: `Нужно ${item.price} монет` });
      return;
    }

    if (item.priceType === 'gems' && gems < item.price) {
      toast({ title: '❌ Недостаточно алмазов', description: `Нужно ${item.price} алмазов` });
      return;
    }

    const newAnimal: Animal = {
      id: Date.now().toString(),
      type: item.type,
      position: emptySlot,
      productionTime: 0,
      maxProductionTime: ANIMAL_DATA[item.type].time,
      level: 1,
    };

    setAnimals(prev => [...prev, newAnimal]);
    
    if (item.priceType === 'coins') {
      setCoins(prev => prev - item.price);
    } else {
      setGems(prev => prev - item.price);
    }

    updateAchievement('1', 1);
    
    const uniqueTypes = new Set([...animals.map(a => a.type), item.type]);
    updateAchievement('4', uniqueTypes.size);

    toast({ title: '✅ Куплено!', description: `${item.name} добавлен на ферму` });
  };

  const collectProduct = (animal: Animal) => {
    if (animal.productionTime < animal.maxProductionTime) {
      toast({ title: '⏳ Еще не готово', description: 'Подождите, пока животное произведет продукт' });
      return;
    }

    const productType = ANIMAL_DATA[animal.type].product;
    
    setProducts(prev =>
      prev.map(p =>
        p.type === productType ? { ...p, amount: p.amount + 1 } : p
      )
    );

    setAnimals(prev =>
      prev.map(a =>
        a.id === animal.id ? { ...a, productionTime: 0 } : a
      )
    );

    const totalProducts = products.reduce((sum, p) => sum + p.amount, 0) + 1;
    updateAchievement('2', totalProducts);

    toast({ title: '✅ Собрано!', description: `+1 ${ANIMAL_DATA[animal.type].productEmoji}` });
  };

  const sellProduct = (productType: ProductType) => {
    const product = products.find(p => p.type === productType);
    if (!product || product.amount === 0) {
      toast({ title: '❌ Нет продуктов', description: 'Сначала соберите продукцию' });
      return;
    }

    const earnings = PRODUCT_PRICES[productType] * product.amount;
    setCoins(prev => prev + earnings);
    
    setProducts(prev =>
      prev.map(p =>
        p.type === productType ? { ...p, amount: 0 } : p
      )
    );

    updateAchievement('3', coins + earnings);

    toast({ title: '💰 Продано!', description: `+${earnings} монет` });
  };

  const updateAchievement = (id: string, progress: number) => {
    setAchievements(prev =>
      prev.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          const newProgress = Math.min(progress, ach.maxProgress);
          if (newProgress >= ach.maxProgress) {
            setCoins(c => c + ach.reward);
            toast({ title: '🏆 Достижение!', description: `${ach.title} - награда: ${ach.reward} монет` });
            return { ...ach, progress: newProgress, unlocked: true };
          }
          return { ...ach, progress: newProgress };
        }
        return ach;
      })
    );
  };

  const buyGems = (amount: number, price: number) => {
    toast({ title: '💎 Покупка', description: `В реальной игре здесь была бы оплата ${price}₽` });
    setGems(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-yellow-50 to-blue-100 p-4">
      <Toaster />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-primary flex items-center gap-2">
              🚜 Моя Ферма
            </h1>
            <div className="flex gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                <Icon name="Coins" size={20} className="mr-1" />
                {coins}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-cyan-400 text-cyan-900 hover:bg-cyan-500">
                <Icon name="Gem" size={20} className="mr-1" />
                {gems}
              </Badge>
            </div>
          </div>
        </header>

        <Tabs defaultValue="farm" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="farm" className="text-lg">🌾 Поле</TabsTrigger>
            <TabsTrigger value="barn" className="text-lg">🏚️ Амбар</TabsTrigger>
            <TabsTrigger value="shop" className="text-lg">🛒 Магазин</TabsTrigger>
            <TabsTrigger value="achievements" className="text-lg">🏆 Награды</TabsTrigger>
            <TabsTrigger value="donate" className="text-lg">💎 Донат</TabsTrigger>
          </TabsList>

          <TabsContent value="farm" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Твоя ферма</h2>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }, (_, i) => {
                  const animal = animals.find(a => a.position === i);
                  const isReady = animal && animal.productionTime >= animal.maxProductionTime;
                  
                  return (
                    <Card
                      key={i}
                      className={`aspect-square flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        isReady ? 'animate-pulse-glow border-4 border-yellow-400' : 'bg-green-50'
                      }`}
                      onClick={() => animal && collectProduct(animal)}
                    >
                      {animal ? (
                        <div className="text-center">
                          <div className="text-6xl mb-2 animate-bounce-gentle">
                            {ANIMAL_DATA[animal.type].emoji}
                          </div>
                          {isReady && (
                            <div className="text-4xl animate-wiggle">
                              {ANIMAL_DATA[animal.type].productEmoji}
                            </div>
                          )}
                          <Progress 
                            value={(animal.productionTime / animal.maxProductionTime) * 100} 
                            className="mt-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {animal.productionTime}/{animal.maxProductionTime}с
                          </p>
                        </div>
                      ) : (
                        <div className="text-4xl text-muted-foreground">➕</div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="barn" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Склад продукции</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                  <Card key={product.type} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl">
                          {ANIMAL_DATA[Object.keys(ANIMAL_DATA).find(k => ANIMAL_DATA[k as AnimalType].product === product.type) as AnimalType]?.productEmoji}
                        </span>
                        <div>
                          <p className="font-bold text-lg">{product.amount} шт</p>
                          <p className="text-sm text-muted-foreground">
                            {PRODUCT_PRICES[product.type]} монет/шт
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => sellProduct(product.type)}
                      disabled={product.amount === 0}
                      className="w-full"
                    >
                      Продать за {PRODUCT_PRICES[product.type] * product.amount} 💰
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Магазин животных</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SHOP_ITEMS.map(item => (
                  <Card key={item.id} className={`p-4 ${item.isPremium ? 'border-2 border-purple-400 bg-purple-50' : ''}`}>
                    <div className="text-center mb-3">
                      <div className="text-6xl mb-2">{item.emoji}</div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {item.isPremium && (
                        <Badge className="mt-1 bg-purple-500">Премиум</Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => buyAnimal(item)}
                      className={`w-full ${item.isPremium ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                    >
                      {item.price} {item.priceType === 'coins' ? '💰' : '💎'}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Достижения</h2>
              <div className="space-y-3">
                {achievements.map(ach => (
                  <Card key={ach.id} className={`p-4 ${ach.unlocked ? 'bg-green-50 border-green-300' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{ach.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold">{ach.title}</h3>
                          {ach.unlocked && <Badge className="bg-green-500">✓ Получено</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ach.description}</p>
                        <Progress value={(ach.progress / ach.maxProgress) * 100} />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {ach.progress}/{ach.maxProgress}
                          </p>
                          <p className="text-sm font-bold text-yellow-600">
                            Награда: {ach.reward} 💰
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="donate" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">💎 Магазин алмазов</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 text-center hover:scale-105 transition-all cursor-pointer border-2 hover:border-purple-400">
                  <div className="text-5xl mb-3">💎</div>
                  <h3 className="font-bold text-xl mb-2">10 алмазов</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-4">99₽</p>
                  <Button onClick={() => buyGems(10, 99)} className="w-full bg-purple-500 hover:bg-purple-600">
                    Купить
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:scale-105 transition-all cursor-pointer border-4 border-purple-400 bg-purple-50 relative">
                  <Badge className="absolute top-2 right-2 bg-red-500">Популярное</Badge>
                  <div className="text-5xl mb-3">💎💎</div>
                  <h3 className="font-bold text-xl mb-2">50 алмазов</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-4">399₽</p>
                  <Button onClick={() => buyGems(50, 399)} className="w-full bg-purple-500 hover:bg-purple-600">
                    Купить
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:scale-105 transition-all cursor-pointer border-2 hover:border-purple-400">
                  <div className="text-5xl mb-3">💎💎💎</div>
                  <h3 className="font-bold text-xl mb-2">150 алмазов</h3>
                  <p className="text-3xl font-bold text-purple-600 mb-4">999₽</p>
                  <Button onClick={() => buyGems(150, 999)} className="w-full bg-purple-500 hover:bg-purple-600">
                    Купить
                  </Button>
                </Card>
              </div>

              <Card className="p-6 mt-6 bg-gradient-to-r from-yellow-100 to-orange-100">
                <h3 className="font-bold text-xl mb-3 text-center">⚡ Ускорители</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white py-6">
                    <div className="text-center">
                      <div className="text-2xl mb-1">⏰</div>
                      <div>Ускорить производство x2</div>
                      <div className="text-sm">5 💎 на 1 час</div>
                    </div>
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white py-6">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🌟</div>
                      <div>Автосбор продукции</div>
                      <div className="text-sm">10 💎 на 24 часа</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
