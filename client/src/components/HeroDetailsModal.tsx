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
    if (hero) onEdit(hero);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hero?.images) setActiveImgIndex((prev) => (prev + 1) % hero.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hero?.images) setActiveImgIndex((prev) => (prev - 1 + hero.images.length) % hero.images.length);
  };

  if (isLoading) return null;
  if (isError || !hero) return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.content}>Error loading details</div>
    </div>
  );

  return (
    <div className="modal-backdrop" style={styles.backdrop} onClick={onClose}>
      <div className="modal-content" style={styles.content} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeButton}>✕</button>

        <div style={styles.mainGrid}>
          <div style={styles.galleryColumn}>
            <div 
              style={styles.imageContainer}
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
            >
              {hero.images && hero.images.length > 0 ? (
                <>
                  <div 
                    key={`bg-${activeImgIndex}`}
                    style={{
                      ...styles.blurredBackground,
                      backgroundImage: `url(${hero.images[activeImgIndex]})`,
                    }} 
                  />

                  <img 
                    key={`img-${activeImgIndex}`}
                    src={hero.images[activeImgIndex]} 
                    alt={hero.nickname} 
                    style={styles.mainImage} 
                  />

                  {hero.images.length > 1 && (
                    <div style={{ ...styles.arrowOverlay, opacity: isGalleryHovered ? 1 : 0 }}>
                      <button 
                        onClick={prevImage} 
                        style={{ ...styles.arrow, left: '15px', pointerEvents: 'auto' }}
                      >
                        <span style={styles.arrowIcon}>‹</span>
                      </button>
                      <button 
                        onClick={nextImage} 
                        style={{ ...styles.arrow, right: '15px', pointerEvents: 'auto' }}
                      >
                        <span style={styles.arrowIcon}>›</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={styles.noImage}>No Image Available</div>
              )}
            </div>

            {hero.images && hero.images.length > 1 && (
              <div style={styles.thumbnailRow}>
                {hero.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      ...styles.thumbnail,
                      border: activeImgIndex === idx ? '3px solid #007bff' : '3px solid transparent',
                      opacity: activeImgIndex === idx ? 1 : 0.6
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={styles.infoColumn}>
            <h1 style={styles.nickname}>{hero.nickname}</h1>
            <h3 style={styles.realName}>{hero.real_name}</h3>
            
            <div style={styles.infoBlock}>
              <h4 style={styles.label}>Origin Story</h4>
              <p style={styles.text}>{hero.origin_description}</p>
            </div>

            <div style={styles.infoBlock}>
              <h4 style={styles.label}>Superpowers</h4>
              <p style={styles.text}>{hero.superpowers}</p>
            </div>

            <div style={styles.infoBlock}>
              <h4 style={styles.label}>Catch Phrase</h4>
              <p style={styles.catchPhrase}>"{hero.catch_phrase}"</p>
            </div>

            <div style={styles.buttonRow}>
              <button 
                onClick={handleEditClick}
                onMouseEnter={() => setHoverBtn('edit')}
                onMouseLeave={() => setHoverBtn(null)}
                style={getButtonStyle('edit', hoverBtn)}
              >
                Edit Details
              </button>
              <button 
                onClick={handleDelete}
                onMouseEnter={() => setHoverBtn('delete')}
                onMouseLeave={() => setHoverBtn(null)}
                style={getButtonStyle('delete', hoverBtn)}
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

const getButtonStyle = (type: 'edit' | 'delete', activeType: string | null): React.CSSProperties => ({
  ...styles.actionButton,
  backgroundColor: type === 'edit' ? '#007bff' : '#dc3545',
  opacity: activeType === type ? 0.85 : 1,
  transform: activeType === type ? 'translateY(-2px)' : 'none'
});

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, padding: '20px'
  },
  content: {
    backgroundColor: 'white', padding: '50px', borderRadius: '24px', 
    maxWidth: '1100px', width: '100%', position: 'relative', 
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  mainGrid: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  galleryColumn: { flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' },
  imageContainer: {
    position: 'relative', width: '100%', height: '450px', 
    borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', backgroundColor: '#000'
  },
  blurredBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: 'cover', backgroundPosition: 'center',
    filter: 'blur(20px) brightness(0.6)', transform: 'scale(1.1)', zIndex: 1,
    transition: 'opacity 0.4s ease-in-out'
  },
  mainImage: {
    position: 'relative', width: '100%', height: '100%', 
    objectFit: 'contain', zIndex: 2, transition: 'opacity 0.4s ease-in-out'
  },
  arrowOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    zIndex: 10, pointerEvents: 'none', transition: 'opacity 0.3s ease'
  },
  arrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', width: '48px', height: '48px',
    borderRadius: '50%', fontSize: '32px', cursor: 'pointer', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    lineHeight: 0, color: '#333'
  },
  arrowIcon: { marginTop: '-4px' },
  thumbnailRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
  thumbnail: {
    width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', 
    cursor: 'pointer', transition: 'all 0.2s'
  },
  infoColumn: { flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column' },
  nickname: { margin: '0 0 5px 0', fontSize: '2.5rem', color: '#1a1a1a' },
  realName: { color: '#313131', marginBottom: '25px', fontWeight: '400' },
  infoBlock: { marginBottom: '25px' },
  label: { margin: '0 0 8px 0', fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },
  text: { margin: '0', fontSize: '1.1rem', lineHeight: '1.6', color: '#333' },
  catchPhrase: { 
    margin: '0', fontSize: '1.1rem', lineHeight: '1.6', color: '#555', 
    fontStyle: 'italic', borderLeft: '4px solid #eee', paddingLeft: '15px' 
  },
  buttonRow: { marginTop: 'auto', paddingTop: '20px', display: 'flex', gap: '15px' },
  actionButton: {
    padding: '12px 24px', color: 'white', border: 'none', borderRadius: '10px', 
    fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
    flex: 1, textAlign: 'center'
  },
  closeButton: {
    position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f8f9fa', 
    width: '40px', height: '40px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', zIndex: 100
  },
  noImage: {
    width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', borderRadius: '16px', color: '#aaa', fontSize: '1.2rem'
  }
};

export default HeroDetailsModal;