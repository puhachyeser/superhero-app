import React from 'react';
import { useGetSuperheroByIdQuery } from '../features/superheroesApi';

interface Props {
  heroId: string;
  onClose: () => void;
}

const HeroDetailsModal: React.FC<Props> = ({ heroId, onClose }) => {
  const { data: hero, isLoading, isError } = useGetSuperheroByIdQuery(heroId);

  if (isLoading) return null;
  if (isError || !hero) return <div>Error loading details</div>;

  return (
    <div className="modal-backdrop" style={backdropStyle} onClick={onClose}>
      <div className="modal-content" style={contentStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>✕</button>
        
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: '1' }}>
            {hero.images && hero.images.length > 0 ? (
              <img 
                src={hero.images[0]} 
                alt={hero.nickname} 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
              />
            ) : (
              <div style={noImageStyle}>No Image Available</div>
            )}
          </div>
          <div style={{ flex: '1.5' }}>
            <h1 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>{hero.nickname}</h1>
            <h3 style={{ color: '#666', marginBottom: '20px' }}>{hero.real_name}</h3>
            
            <div style={infoBlockStyle}>
              <h4>Origin</h4>
              <p>{hero.origin_description}</p>
            </div>

            <div style={infoBlockStyle}>
              <h4>Superpowers</h4>
              <p>{hero.superpowers}</p>
            </div>

            <div style={infoBlockStyle}>
              <h4>Catch Phrase</h4>
              <p style={{ fontStyle: 'italic', color: '#444' }}>"{hero.catch_phrase}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '40px', borderRadius: '20px', 
  maxWidth: '900px', width: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
};

const infoBlockStyle: React.CSSProperties = { marginBottom: '20px' };
const closeButtonStyle: React.CSSProperties = {
  position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer'
};
const noImageStyle: React.CSSProperties = {
  width: '100%', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px'
};

export default HeroDetailsModal;