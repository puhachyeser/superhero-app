import React, { useState } from 'react';
import { useGetSuperheroesQuery, type Superhero } from '../features/superheroesApi';
import HeroCard from './HeroCard';

interface HeroListProps {
  onEditHero: (hero: Superhero) => void;
  onViewHero: (id: string) => void;
}

const HeroList: React.FC<HeroListProps> = ({ onEditHero, onViewHero }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetSuperheroesQuery({ page, limit: 5 });

  if (isLoading) return <div style={styles.loading}>Loading heroes...</div>;
  if (isError) return <div style={styles.error}>Error loading heroes.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.listContainer}>
        {data?.data.map((hero) => (
          <HeroCard 
            key={hero._id} 
            hero={hero} 
            onEdit={onEditHero} 
            onView={onViewHero} 
          />
        ))}
      </div>

      <div style={styles.paginationContainer}>
        <button 
          style={{
            ...styles.navButton,
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? 'not-allowed' : 'pointer'
          }}
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          ← Prev
        </button>
        
        <span style={styles.pageInfo}>
          Page <strong>{page}</strong> of {data?.lastPage || 1}
        </span>
        
        <button 
          style={{
            ...styles.navButton,
            opacity: page === (data?.lastPage || 1) ? 0.5 : 1,
            cursor: page === (data?.lastPage || 1) ? 'not-allowed' : 'pointer'
          }}
          disabled={page === (data?.lastPage || 1)} 
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '20px 0'
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px'
  },
  paginationContainer: {
    marginTop: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    backgroundColor: '#f8f9fa',
    padding: '10px 20px',
    borderRadius: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  navButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  pageInfo: {
    fontSize: '16px',
    color: '#444'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    color: '#dc3545',
    fontWeight: 'bold'
  }
};

export default HeroList;