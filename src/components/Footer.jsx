import React from 'react';
import { SearchCheck, Heart } from 'lucide-react';

export default function Footer({ setActiveRoute }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand-logo" style={{ fontSize: '1.05rem' }}>
          <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
            <SearchCheck size={16} />
          </div>
          <span>Lost & Found</span>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          © {year} Lost & Found Portal. Reconnecting belongings with care <Heart size={14} color="#ef4444" fill="#ef4444" />
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}
            onClick={() => {
              setActiveRoute('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            About & Contact
          </button>
        </div>
      </div>
    </footer>
  );
}
