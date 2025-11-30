import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const DEMO_FRIENDS = [
  {
    id: '1',
    name: 'Мария Иванова',
    level: 12,
    avatar: '👩‍🌾',
    lastActive: Date.now() - 1000 * 60 * 30,
  },
  {
    id: '2',
    name: 'Петр Смирнов',
    level: 8,
    avatar: '👨‍🌾',
    lastActive: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: '3',
    name: 'Анна Козлова',
    level: 15,
    avatar: '👩',
    lastActive: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export const Friends = () => {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Users" size={40} />
                <div>
                  <h2 className="text-3xl font-bold">Друзья</h2>
                  <p className="text-green-100">Играйте вместе с друзьями</p>
                </div>
              </div>
              
              <Button className="bg-white text-green-600 hover:bg-white/90">
                + Добавить друга
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_FRIENDS.map((friend) => (
            <Card key={friend.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-6xl bg-gradient-to-br from-green-400 to-teal-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                    {friend.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{friend.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        ⭐ Уровень {friend.level}
                      </span>
                      <span className="text-xs">
                        {formatDistanceToNow(friend.lastActive, { addSuffix: true, locale: ru })}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="Eye" size={16} className="mr-1" />
                        Посетить
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="Gift" size={16} className="mr-1" />
                        Подарок
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trophy" size={24} />
              Таблица лидеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...DEMO_FRIENDS]
                .sort((a, b) => b.level - a.level)
                .map((friend, index) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-teal-50 transition-colors"
                  >
                    <div className="text-2xl font-bold w-8 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                    </div>
                    
                    <div className="text-3xl">{friend.avatar}</div>
                    
                    <div className="flex-1">
                      <div className="font-medium">{friend.name}</div>
                      <div className="text-sm text-gray-600">Уровень {friend.level}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">⭐ {friend.level}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-3 text-purple-600" />
            <h3 className="text-xl font-bold mb-2">Пригласи друзей!</h3>
            <p className="text-gray-700 mb-4">
              За каждого приглашенного друга получишь бонусы
            </p>
            <div className="flex gap-2 justify-center">
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <div className="text-2xl">💰</div>
                <div className="text-sm font-medium">500 монет</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <div className="text-2xl">💎</div>
                <div className="text-sm font-medium">10 алмазов</div>
              </div>
            </div>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
              Пригласить друга
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
