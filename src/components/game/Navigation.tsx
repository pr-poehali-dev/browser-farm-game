import { useGame } from '@/contexts/GameContext';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const SECTIONS = [
  { id: 'field', label: 'Поле', icon: 'Sprout' },
  { id: 'barn', label: 'Амбар', icon: 'Warehouse' },
  { id: 'shop', label: 'Магазин', icon: 'Store' },
  { id: 'achievements', label: 'Достижения', icon: 'Trophy' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'friends', label: 'Друзья', icon: 'Users' },
  { id: 'donate', label: 'Донат', icon: 'Gem' },
];

export const Navigation = () => {
  const { currentSection, setCurrentSection } = useGame();
  
  return (
    <div className="bg-gradient-to-b from-green-600 to-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around py-2 gap-2 overflow-x-auto">
          {SECTIONS.map((section) => (
            <Button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              variant={currentSection === section.id ? 'default' : 'ghost'}
              className={`flex-col h-auto py-2 px-4 gap-1 ${
                currentSection === section.id
                  ? 'bg-white text-green-700 hover:bg-white/90'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Icon name={section.icon} size={24} />
              <span className="text-xs font-medium whitespace-nowrap">{section.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
