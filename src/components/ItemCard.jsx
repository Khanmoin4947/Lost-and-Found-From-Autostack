import React from 'react';
import { MapPin, Calendar, Tag, ImageOff, ArrowRight, UserCheck } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  const isLost = item.status === 'lost';

  const maskContact = (item) => {
    if (item.contactEmail) {
      const [name, domain] = item.contactEmail.split('@');
      if (!domain) return item.contactEmail;
      const visible = name.slice(0, 2);
      return `${visible}***@${domain}`;
    }
    if (item.contactPhone) {
      const trimmed = item.contactPhone.replace(/\s+/g, '');
      if (trimmed.length <= 4) return item.contactPhone;
      return '****' + trimmed.slice(-4);
    }
    return 'Not provided';
  };

  return (
    <article 
      className="item-card" 
      onClick={() => onClick(item)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
    >
      <div className="item-card-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <ImageOff size={32} opacity={0.5} />
            <span style={{ fontSize: '0.8rem' }}>No Image Attached</span>
          </div>
        )}
        <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'} item-card-badge`}>
          {isLost ? 'Lost' : 'Found'}
        </span>
      </div>

      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>

        <div className="item-card-meta">
          <div className="item-meta-row">
            <Tag size={15} color="#6b7280" />
            <span>{item.category || 'General'}</span>
          </div>
          <div className="item-meta-row">
            <Calendar size={15} color="#6b7280" />
            <span>{item.date}</span>
          </div>
          <div className="item-meta-row">
            <MapPin size={15} color="#6b7280" />
            <span>{item.location}</span>
          </div>
        </div>

        <div className="item-card-footer">
          <div className="item-contact-masked">
            <UserCheck size={15} color="#6b7280" />
            <span>{maskContact(item)}</span>
          </div>
          <span className="item-view-btn">
            Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
