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

  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading heroes...</div>;
  if (isError) return <div style={{ textAlign: 'center', color: 'red' }}>Error loading heroes.</div>;

  return (
    <div style={containerStyle}>
      <div style={listContainerStyle}>
        {data?.data.map((hero) => (
          <HeroCard 
            key={hero._id} 
            hero={hero} 
            onEdit={onEditHero} 
            onView={onViewHero} 
          />
        ))}
      </div>

      <div style={paginationContainerStyle}>
        <button 
          style={navButtonStyle}
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          ← Prev
        </button>
        
        <span style={pageInfoStyle}>
          Page <strong>{page}</strong> of {data?.lastPage || 1}
        </span>
        
        <button 
          style={navButtonStyle}
          disabled={page === (data?.lastPage || 1)} 
          onClick={() => setPage(p => p + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: '20px 0'
};

const listContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '1200px'
};

const paginationContainerStyle: React.CSSProperties = {
  marginTop: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  backgroundColor: '#f8f9fa',
  padding: '10px 20px',
  borderRadius: '30px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
};

const navButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: '20px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.2s',
  opacity: 1
};

const pageInfoStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#444'
};

export default HeroList;