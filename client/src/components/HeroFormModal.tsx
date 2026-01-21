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
    imageInput: heroToEdit?.images?.[0] || '', 
  });

  const [createSuperhero, { isLoading: isCreating }] = useCreateSuperheroMutation();
  const [updateSuperhero, { isLoading: isUpdating }] = useUpdateSuperheroMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      images: formData.imageInput ? [formData.imageInput] : [],
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
        
        <input 
          value={formData.nickname}
          placeholder="Nickname (e.g. Superman)" 
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
        <input 
          value={formData.imageInput}
          placeholder="Image URL (http://...)" 
          onChange={e => setFormData({...formData, imageInput: e.target.value})} 
        />
        
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={onClose}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isLoading ? 'Saving...' : heroToEdit ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '25px', borderRadius: '12px', 
  display: 'flex', flexDirection: 'column', gap: '12px', 
  minWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
};

export default HeroFormModal;