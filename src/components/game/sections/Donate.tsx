import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const GEM_PACKAGES = [
  { id: 'starter', gems: 50, price: 99, discount: 0, popular: false },
  { id: 'basic', gems: 120, price: 199, discount: 10, popular: false },
  { id: 'premium', gems: 300, price: 449, discount: 20, popular: true },
  { id: 'mega', gems: 700, price: 899, discount: 30, popular: false },
  { id: 'ultimate', gems: 1500, price: 1699, discount: 40, popular: false },
];

const PREMIUM_FEATURES = [
  {
    id: 'auto_harvest',
    name: 'Авто-сбор урожая',
    description: 'Урожай собирается автоматически',
    icon: '🤖',
    price: 150,
  },
  {
    id: 'double_production',
    name: 'Двойная продукция',
    description: 'Животные дают в 2 раза больше продукции',
    icon: '⚡',
    price: 200,
  },
  {
    id: 'fast_grow',
    name: 'Ускоренный рост',
    description: 'Культуры растут на 50% быстрее',
    icon: '🚀',
    price: 180,
  },
  {
    id: 'lucky_farmer',
    name: 'Удача фермера',
    description: 'Шанс получить бонусный урожай',
    icon: '🍀',
    price: 120,
  },
];

export const Donate = () => {
  const { buyGems } = useGame();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  const handleBuyPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowDialog(true);
  };
  
  const handleConfirmPurchase = () => {
    const pkg = GEM_PACKAGES.find((p) => p.id === selectedPackage);
    if (pkg) {
      buyGems(pkg.gems);
      setShowDialog(false);
      setSelectedPackage(null);
    }
  };
  
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <Icon name="Gem" size={48} className="text-yellow-300" />
              <div>
                <h2 className="text-4xl font-bold mb-2">Магазин алмазов</h2>
                <p className="text-purple-100 text-lg">
                  Ускорь развитие своей фермы с премиум-возможностями!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💎</span>
            <span>Пакеты алмазов</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {GEM_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative transition-all hover:scale-105 ${
                  pkg.popular ? 'border-4 border-yellow-400 shadow-2xl' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold">
                    ⭐ ПОПУЛЯРНО
                  </div>
                )}
                
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-3">💎</div>
                  <div className="text-3xl font-bold mb-2">{pkg.gems}</div>
                  <div className="text-sm text-gray-600 mb-4">алмазов</div>
                  
                  {pkg.discount > 0 && (
                    <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold mb-3">
                      -{pkg.discount}%
                    </div>
                  )}
                  
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    {pkg.price} ₽
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={pkg.popular ? 'default' : 'outline'}
                    onClick={() => handleBuyPackage(pkg.id)}
                  >
                    Купить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Премиум-возможности</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREMIUM_FEATURES.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-4xl">{feature.icon}</span>
                    <span>{feature.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-purple-600">
                      💎 {feature.price} алмазов
                    </div>
                    <Button disabled>Скоро</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Icon name="Info" size={32} className="text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Как использовать алмазы?</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Покупайте редких животных и культуры</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Расширяйте ферму и амбар</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Ускоряйте рост и производство</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Получайте премиум-возможности</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение покупки</DialogTitle>
            <DialogDescription>
              Это демонстрационная версия. В реальной игре здесь будет интеграция с платежной системой.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">💎</div>
              <div className="text-3xl font-bold mb-2">
                {GEM_PACKAGES.find((p) => p.id === selectedPackage)?.gems} алмазов
              </div>
              <div className="text-2xl text-green-600 mb-6">
                {GEM_PACKAGES.find((p) => p.id === selectedPackage)?.price} ₽
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDialog(false)}
                >
                  Отмена
                </Button>
                <Button className="flex-1" onClick={handleConfirmPurchase}>
                  Получить алмазы (демо)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
