import { GameProvider, useGame } from '@/contexts/GameContext';
import { Header } from '@/components/game/Header';
import { Navigation } from '@/components/game/Navigation';
import { Field } from '@/components/game/sections/Field';
import { Barn } from '@/components/game/sections/Barn';
import { Shop } from '@/components/game/sections/Shop';
import { Achievements } from '@/components/game/sections/Achievements';
import { Profile } from '@/components/game/sections/Profile';
import { Friends } from '@/components/game/sections/Friends';
import { Donate } from '@/components/game/sections/Donate';

const GameContent = () => {
  const { currentSection } = useGame();
  
  const renderSection = () => {
    switch (currentSection) {
      case 'field':
        return <Field />;
      case 'barn':
        return <Barn />;
      case 'shop':
        return <Shop />;
      case 'achievements':
        return <Achievements />;
      case 'profile':
        return <Profile />;
      case 'friends':
        return <Friends />;
      case 'donate':
        return <Donate />;
      default:
        return <Field />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200">
      <Header />
      <Navigation />
      <main className="pb-6">
        {renderSection()}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
