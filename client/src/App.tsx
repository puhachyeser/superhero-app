import { useState } from 'react';
import HeroList from './components/HeroList';
import HeroFormModal from './components/HeroFormModal';
import HeroDetailsModal from './components/HeroDetailsModal';
import { type Superhero } from './features/superheroesApi';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Superhero | null>(null);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingHero(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hero: Superhero) => {
    setEditingHero(hero);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Superhero Database</h1>
        <button onClick={handleOpenCreate} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white' }}>
          + Add New Hero
        </button>
      </header>

      <hr />

      <HeroList onEditHero={handleOpenEdit} onViewHero={(id) => setSelectedHeroId(id)} />

      {isModalOpen && (
        <HeroFormModal 
          heroToEdit={editingHero} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      {selectedHeroId && (
        <HeroDetailsModal 
          heroId={selectedHeroId} 
          onClose={() => setSelectedHeroId(null)} 
          onEdit={(hero) => {
            setSelectedHeroId(null);
            handleOpenEdit(hero);
          }}
        />
      )}
    </div>
  );
}

export default App;