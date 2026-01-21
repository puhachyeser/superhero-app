import React, { useState } from 'react';
import { 
  type Superhero, 
  useCreateSuperheroMutation, 
  useUpdateSuperheroMutation 
} from '../features/superheroesApi';

interface Props {
  onClose: () => void;
  heroToEdit: Superhero | null;
}

const HeroFormModal: React.FC<Props> = ({ onClose, heroToEdit }) => {
  const [formData, setFormData] = useState({
    nickname: heroToEdit?.nickname || '',
    real_name: heroToEdit?.real_name || '',
    origin_description: heroToEdit?.origin_description || '',
    superpowers: heroToEdit?.superpowers || '',
    catch_phrase: heroToEdit?.catch_phrase || '',
  });

  const [images, setImages] = useState<string[]>(
    heroToEdit?.images?.length ? [...heroToEdit.images] : ['']
  );

  const [createSuperhero, { isLoading: isCreating }] = useCreateSuperheroMutation();
  const [updateSuperhero, { isLoading: isUpdating }] = useUpdateSuperheroMutation();

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, '']);
  
  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.length ? newImages : ['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanImages = images.filter(url => url.trim() !== '');

    const payload = {
      ...formData,
      images: cleanImages,
    };

    try {
      if (heroToEdit) {
        await updateSuperhero({ id: heroToEdit._id, body: payload }).unwrap();
      } else {
        await createSuperhero(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <form onSubmit={handleSubmit} className="modal-content" style={modalContentStyle}>
        <h2>{heroToEdit ? 'Edit Hero' : 'Create New Hero'}</h2>
        
        <div style={scrollContainerStyle}>
          <label style={labelStyle}>General Information</label>
          <input 
            value={formData.nickname}
            placeholder="Nickname" 
            onChange={e => setFormData({...formData, nickname: e.target.value})} 
            required 
          />
          <input 
            value={formData.real_name}
            placeholder="Real Name" 
            onChange={e => setFormData({...formData, real_name: e.target.value})} 
            required
          />
          <textarea 
            value={formData.origin_description}
            placeholder="Origin Description" 
            onChange={e => setFormData({...formData, origin_description: e.target.value})} 
            required
            rows={3}
          />
          <input 
            value={formData.superpowers}
            placeholder="Superpowers" 
            onChange={e => setFormData({...formData, superpowers: e.target.value})} 
            required
          />
          <input 
            value={formData.catch_phrase}
            placeholder="Catch Phrase" 
            onChange={e => setFormData({...formData, catch_phrase: e.target.value})} 
            required
          />

          <label style={{...labelStyle, marginTop: '15px'}}>Images URLs</label>
          {images.map((url, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input 
                value={url}
                placeholder={`Image URL #${index + 1}`} 
                onChange={e => handleImageChange(index, e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => removeImageField(index)}
                style={removeBtnStyle}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addImageField} style={addBtnStyle}>
            + Add Another Image
          </button>
        </div>
        
        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button type="submit" disabled={isLoading} style={submitBtnStyle}>
            {isLoading ? 'Saving...' : heroToEdit ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1200
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '30px', borderRadius: '16px', 
  display: 'flex', flexDirection: 'column', width: '450px', maxHeight: '85vh'
};

const scrollContainerStyle: React.CSSProperties = {
  overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px'
};

const labelStyle: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' };

const footerStyle: React.CSSProperties = { marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' };

const submitBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const addBtnStyle: React.CSSProperties = { padding: '8px', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };
const removeBtnStyle: React.CSSProperties = { background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', width: '35px', cursor: 'pointer' };

export default HeroFormModal;