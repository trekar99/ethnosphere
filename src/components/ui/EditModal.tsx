import { X, Send, MapPin, Music, Radio } from 'lucide-react';
import { useAppStore } from '../../store';
import { useState } from 'react';

export function EditModal() {
  const { isEditModalOpen, closeEditModal, currentMode, selectedItem } = useAppStore();
  const [formData, setFormData] = useState({
    name: selectedItem?.name || '',
    country: selectedItem?.country || '',
    region: selectedItem?.region || '',
    description: selectedItem?.description || '',
    category: currentMode,
    lat: selectedItem?.coordinates.lat.toString() || '',
    lng: selectedItem?.coordinates.lng.toString() || '',
    tags: selectedItem?.tags.join(', ') || '',
  });

  if (!isEditModalOpen) return null;

  const accentColor = currentMode === 'instruments' 
    ? 'text-neon-cyan' 
    : 'text-neon-purple';

  const borderColor = currentMode === 'instruments'
    ? 'border-neon-cyan/30 focus:border-neon-cyan'
    : 'border-neon-purple/30 focus:border-neon-purple';

  const buttonClass = currentMode === 'instruments'
    ? 'bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border-neon-cyan/30'
    : 'bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple border-neon-purple/30';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the data and close
    console.log('Form submitted:', formData);
    alert('Thank you! Your suggestion has been recorded. (UI Demo)');
    closeEditModal();
  };

  const inputClass = `
    w-full px-4 py-3 rounded-lg bg-dark-blue/60 border ${borderColor}
    text-white placeholder-white/40 font-mono text-sm
    focus:outline-none transition-colors
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeEditModal}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg glass-panel border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentMode === 'instruments' ? (
              <Music className={accentColor} size={24} />
            ) : (
              <Radio className={accentColor} size={24} />
            )}
            <h2 className="text-xl font-semibold text-white">
              {selectedItem ? 'Suggest Edit' : 'Add New Entry'}
            </h2>
          </div>
          <button
            onClick={closeEditModal}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Flamenco Guitar"
              className={inputClass}
              required
            />
          </div>

          {/* Country & Region */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Spain"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
                Region
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Andalusia"
                className={inputClass}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
              Category *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="instruments"
                  checked={formData.category === 'instruments'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'instruments' | 'radio' })}
                  className="accent-neon-cyan"
                />
                <span className="text-white/80 text-sm">Instrument</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="radio"
                  checked={formData.category === 'radio'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'instruments' | 'radio' })}
                  className="accent-neon-purple"
                />
                <span className="text-white/80 text-sm">Ethno-Radio</span>
              </label>
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2 flex items-center gap-2`}>
              <MapPin size={14} />
              Coordinates *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                placeholder="Latitude"
                className={inputClass}
                required
              />
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                placeholder="Longitude"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the instrument or music style..."
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-mono uppercase tracking-wider ${accentColor} mb-2`}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="string, plucked, traditional"
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`
              w-full py-3 rounded-lg font-mono text-sm uppercase tracking-wider
              flex items-center justify-center gap-2 border
              ${buttonClass} transition-all duration-300
            `}
          >
            <Send size={16} />
            Submit Suggestion
          </button>
        </form>
      </div>
    </div>
  );
}
