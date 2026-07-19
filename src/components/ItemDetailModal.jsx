import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Tag, User, Mail, Phone, FileText, ImageOff } from 'lucide-react';

export default function ItemDetailModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isLost = item.status === 'lost';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {item.title}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {item.imageUrl ? (
            <div className="modal-image-wrapper">
              <img src={item.imageUrl} alt={item.title} />
            </div>
          ) : (
            <div className="modal-image-wrapper" style={{ height: '140px', color: '#9ca3af' }}>
              <ImageOff size={40} opacity={0.4} />
            </div>
          )}

          <div className="modal-section-title">Item Overview</div>
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <strong>Category</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={15} color="#ef4444" /> {item.category || 'N/A'}
              </span>
            </div>

            <div className="modal-info-item">
              <strong>Date {isLost ? 'Lost' : 'Found'}</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} color="#ef4444" /> {item.date || 'N/A'}
              </span>
            </div>

            <div className="modal-info-item" style={{ gridColumn: '1 / -1' }}>
              <strong>Location</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="#ef4444" /> {item.location || 'N/A'}
              </span>
            </div>
          </div>

          <div className="modal-section-title">Description</div>
          <div 
            style={{ 
              background: '#f9fafb', 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              fontSize: '0.95rem',
              color: '#374151',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <FileText size={16} color="#6b7280" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{item.description || 'No detailed description provided.'}</span>
            </div>
          </div>

          <div className="modal-section-title">Contact Information</div>
          <div className="modal-info-grid">
            <div className="modal-info-item">
              <strong>Contact Person</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} color="#6b7280" /> {item.contactName || 'Not provided'}
              </span>
            </div>

            {item.contactEmail && (
              <div className="modal-info-item">
                <strong>Email Address</strong>
                <a 
                  href={`mailto:${item.contactEmail}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontWeight: 600 }}
                >
                  <Mail size={15} /> {item.contactEmail}
                </a>
              </div>
            )}

            {item.contactPhone && (
              <div className="modal-info-item">
                <strong>Phone Number</strong>
                <a 
                  href={`tel:${item.contactPhone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontWeight: 600 }}
                >
                  <Phone size={15} /> {item.contactPhone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
