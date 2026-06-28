import React, { useState } from 'react';
import Button from './Button';

const MetadataModal = ({ isOpen, onClose, type, onSubmit, metadata }) => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isTag = type === 'tag';
  const title = isTag ? 'Create New Tag' : 'Create New List';
  const defaultName = isTag 
    ? `Tag ${(metadata?.tags?.length || 0) + 1}` 
    : `List ${(metadata?.lists?.length || 0) + 1}`;
  const placeholder = isTag ? `e.g. Design, Urgent (Default: ${defaultName})` : `e.g. Groceries (Default: ${defaultName})`;
  const label = isTag ? 'Tag Name' : 'List Name';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalValue = value.trim() || defaultName;
    setSubmitting(true);
    await onSubmit(finalValue);
    setSubmitting(false);
    setValue('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal__body">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">{label}</label>
              <input
                type="text"
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
              />
            </div>
            
            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>Add {isTag ? 'Tag' : 'List'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
