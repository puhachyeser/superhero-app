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
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Superhero Database</h1>
        <button onClick={handleOpenCreate} style={styles.addButton}>
          + Add New Hero
        </button>
      </header>

      <div style={styles.divider} />

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

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '2rem',
    color: '#1a1a1a',
    margin: 0
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)'
  },
  divider: {
    height: '1px',
    backgroundColor: '#eee',
    margin: '20px 0 30px 0'
  }
};

export default App;