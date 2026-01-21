import React, { useState } from 'react';
import { useGetSuperheroByIdQuery, useDeleteSuperheroMutation } from '../features/superheroesApi';
import { type Superhero } from '../features/superheroesApi';

interface Props {
  heroId: string;
  onClose: () => void;
  onEdit: (hero: Superhero) => void;
}

const HeroDetailsModal: React.FC<Props> = ({ heroId, onClose, onEdit }) => {
  const { data: hero, isLoading, isError } = useGetSuperheroByIdQuery(heroId);
  const [deleteSuperhero] = useDeleteSuperheroMutation();

  const [hoverBtn, setHoverBtn] = useState<'edit' | 'delete' | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  const handleDelete = async () => {
    if (hero && window.confirm(`Are you sure you want to delete ${hero.nickname}?`)) {
      try {
        await deleteSuperhero(hero._id).unwrap();
        onClose();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const handleEditClick = () => {
    if (hero) {
      onEdit(hero);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hero?.images) {
      setActiveImgIndex((prev) => (prev + 1) % hero.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hero?.images) {
      setActiveImgIndex((prev) => (prev - 1 + hero.images.length) % hero.images.length);
    }
  };

  if (isLoading) return null;
  if (isError || !hero) return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={contentStyle}>Error loading details</div>
    </div>
  );

  return (
    <div className="modal-backdrop" style={backdropStyle} onClick={onClose}>
      <div className="modal-content" style={contentStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeButtonStyle}>✕</button>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div 
              style={imageContainerStyle}
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
            >
              {hero.images && hero.images.length > 0 ? (
                <>
                  <div 
                    key={`bg-${activeImgIndex}`}
                    style={{
                      ...blurredBackgroundStyle,
                      backgroundImage: `url(${hero.images[activeImgIndex]})`,
                    }} 
                  />

                  <img 
                    key={`img-${activeImgIndex}`}
                    src={hero.images[activeImgIndex]} 
                    alt={hero.nickname} 
                    style={mainImageStyle} 
                  />

                  {hero.images.length > 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      zIndex: 10, 
                      pointerEvents: 'none',
                      opacity: isGalleryHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <button 
                        onClick={prevImage} 
                        style={{ ...arrowStyle, left: '15px', pointerEvents: 'auto' }}
                      >
                        <span style={{ marginTop: '-4px' }}>‹</span>
                      </button>
                      <button 
                        onClick={nextImage} 
                        style={{ ...arrowStyle, right: '15px', pointerEvents: 'auto' }}
                      >
                        <span style={{ marginTop: '-4px' }}>›</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={noImageStyle}>No Image Available</div>
              )}
            </div>

            {hero.images && hero.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {hero.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: activeImgIndex === idx ? '3px solid #007bff' : '3px solid transparent',
                      transition: 'all 0.2s',
                      opacity: activeImgIndex === idx ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2.5rem', color: '#1a1a1a' }}>{hero.nickname}</h1>
            <h3 style={{ color: '#313131', marginBottom: '25px', fontWeight: '400' }}>{hero.real_name}</h3>
            
            <div style={infoBlockStyle}>
              <h4 style={labelStyle}>Origin Story</h4>
              <p style={textStyle}>{hero.origin_description}</p>
            </div>

            <div style={infoBlockStyle}>
              <h4 style={labelStyle}>Superpowers</h4>
              <p style={textStyle}>{hero.superpowers}</p>
            </div>

            <div style={infoBlockStyle}>
              <h4 style={labelStyle}>Catch Phrase</h4>
              <p style={{ ...textStyle, fontStyle: 'italic', color: '#555', borderLeft: '4px solid #eee', paddingLeft: '15px' }}>
                "{hero.catch_phrase}"
              </p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', gap: '15px' }}>
              <button 
                onClick={handleEditClick}
                onMouseEnter={() => setHoverBtn('edit')}
                onMouseLeave={() => setHoverBtn(null)}
                style={{ 
                  ...actionButtonStyle, 
                  backgroundColor: '#007bff',
                  opacity: hoverBtn === 'edit' ? 0.85 : 1,
                  transform: hoverBtn === 'edit' ? 'translateY(-2px)' : 'none'
                }}
              >
                Edit Details
              </button>
              <button 
                onClick={handleDelete}
                onMouseEnter={() => setHoverBtn('delete')}
                onMouseLeave={() => setHoverBtn(null)}
                style={{ 
                  ...actionButtonStyle, 
                  backgroundColor: '#dc3545',
                  opacity: hoverBtn === 'delete' ? 0.85 : 1,
                  transform: hoverBtn === 'delete' ? 'translateY(-2px)' : 'none'
                }}
              >
                Delete Hero
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px'
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '50px', borderRadius: '24px', 
  maxWidth: '1100px', width: '100%', position: 'relative', 
  maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const imageContainerStyle: React.CSSProperties = {
  position: 'relative', 
  width: '100%', 
  height: '450px', 
  borderRadius: '16px', 
  overflow: 'hidden', 
  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  backgroundColor: '#000'
};

const blurredBackgroundStyle: React.CSSProperties = {
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  backgroundSize: 'cover', backgroundPosition: 'center',
  filter: 'blur(20px) brightness(0.6)', transform: 'scale(1.1)', zIndex: 1,
  transition: 'opacity 0.4s ease-in-out'
};

const mainImageStyle: React.CSSProperties = {
  position: 'relative', width: '100%', height: '100%', 
  objectFit: 'contain', zIndex: 2, transition: 'opacity 0.4s ease-in-out'
};

const labelStyle: React.CSSProperties = { margin: '0 0 8px 0', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' };
const textStyle: React.CSSProperties = { margin: '0', fontSize: '1.1rem', lineHeight: '1.6', color: '#333' };
const infoBlockStyle: React.CSSProperties = { marginBottom: '25px' };

const actionButtonStyle: React.CSSProperties = {
  padding: '12px 24px', color: 'white', border: 'none', borderRadius: '10px', 
  fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
  flex: 1, textAlign: 'center'
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f8f9fa', 
  width: '40px', height: '40px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', zIndex: 100
};

const arrowStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', width: '48px', height: '48px',
  borderRadius: '50%', fontSize: '32px', cursor: 'pointer', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  lineHeight: 0, color: '#333'
};

const noImageStyle: React.CSSProperties = {
  width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', 
  justifyContent: 'center', alignItems: 'center', borderRadius: '16px', color: '#aaa', fontSize: '1.2rem'
};

export default HeroDetailsModal;