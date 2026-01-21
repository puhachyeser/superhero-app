import React, { useState } from 'react';
import { type Superhero, useDeleteSuperheroMutation } from '../features/superheroesApi';

interface HeroCardProps {
  hero: Superhero;
  onEdit: (hero: Superhero) => void;
  onView: (id: string) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onEdit, onView }) => {
  const [deleteSuperhero, { isLoading: isDeleting }] = useDeleteSuperheroMutation();
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${hero.nickname}?`)) {
      try {
        await deleteSuperhero(hero._id).unwrap();
      } catch (err) {
        console.error(err);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...cardStyle,
        transform: isHovered ? 'translateY(-5px)' : 'none',
        boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.05)'
      }}
    >
      <div style={imageContainerStyle}>
        {hero.images?.[0] ? (
          <img src={hero.images[0]} alt={hero.nickname} style={imageStyle} />
        ) : (
          <div style={placeholderStyle}>No Image</div>
        )}
        
        <div style={{
          ...overlayStyle,
          opacity: isHovered ? 1 : 0
        }}>
          <button onClick={handleEdit} style={editButtonStyle}>Edit</button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting} 
            style={deleteButtonStyle}
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div style={infoStyle}>
        <h3 style={nicknameStyle}>{hero.nickname}</h3>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  width: '200px',
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  backgroundColor: '#fff',
  border: '1px solid #eee',
  display: 'inline-block',
  margin: '10px'
};

const imageContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '260px',
  backgroundColor: '#f8f9fa'
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const placeholderStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#aaa',
  fontSize: '14px'
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  transition: 'opacity 0.3s ease',
  padding: '0 20px'
};

const infoStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'center',
  backgroundColor: '#fff'
};

const nicknameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const editButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#007bff',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer'
};

const deleteButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#ff4d4f',
  color: '#fff',
  fontWeight: '600',
  cursor: 'pointer'
};

export default HeroCard;