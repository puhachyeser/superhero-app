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

  if (isLoading) return <div>Loading heroes...</div>;
  if (isError) return <div>Error loading heroes.</div>;

  return (
    <div>
      <div className="list-container">
        {data?.data.map((hero) => (
          <HeroCard key={hero._id} hero={hero} onEdit={onEditHero} onView={onViewHero} />
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {data?.lastPage || 1}</span>
        <button disabled={page === data?.lastPage} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default HeroList;