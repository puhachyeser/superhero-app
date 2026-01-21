import React from 'react';
import { type Superhero, useDeleteSuperheroMutation } from '../features/superheroesApi';

interface HeroCardProps {
  hero: Superhero;
  onEdit: (hero: Superhero) => void;
  onView: (id: string) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onEdit, onView }) => {
  const [deleteSuperhero, { isLoading: isDeleting }] = useDeleteSuperheroMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${hero.nickname}?`)) {
      try {
        await deleteSuperhero(hero._id).unwrap();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(hero);
  };

  return (
    <div 
      onClick={() => onView(hero._id)}
      style={cardStyle}
    >
      <div style={{ display: 'flex', gap: '15px' }}>
        {hero.images?.[0] ? (
          <img 
            src={hero.images[0]} 
            alt={hero.nickname} 
            style={imageStyle} 
          />
        ) : (
          <div style={placeholderStyle}>No Image</div>
        )}
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0' }}>{hero.nickname}</h3>
          <p style={{ margin: 0, color: '#666' }}>
            <strong>Real name:</strong> {hero.real_name}
          </p>
        </div>
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleEdit}
          style={editButtonStyle}
        >
          Edit
        </button>
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          style={deleteButtonStyle}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '15px',
  marginBottom: '15px',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const imageStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  objectFit: 'cover',
  backgroundColor: '#f0f0f0'
};

const placeholderStyle: React.CSSProperties = {
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  color: '#999'
};

const editButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff'
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#ff4d4f',
  color: 'white'
};

export default HeroCard;