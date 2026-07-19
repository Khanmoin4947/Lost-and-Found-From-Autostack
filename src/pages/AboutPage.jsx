import React from 'react';
import { Target, HelpCircle, Shield, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
          About Lost & Found
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Our mission is to help people reunite with their misplaced items in a simple, secure, and focused space.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="form-card" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '38px', height: '38px' }}>
              <Target size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Our Mission</h2>
          </div>
          <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
            Every day, thousands of valuable personal items—from wallets and keys to electronics and documents—are misplaced. 
            The Lost & Found portal exists to bridge the gap between people who lose items and kind individuals who find them. 
            By centralizing reports in an easy-to-use interface, we minimize stress and maximize successful reunions.
          </p>
        </div>

        <div className="form-card" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '38px', height: '38px' }}>
              <HelpCircle size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>How It Works</h2>
          </div>

          <ol style={{ paddingLeft: '1.25rem', color: '#4b5563', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Report:</strong> Submit a detailed report of an item you lost or found using our form with optional photo upload.
            </li>
            <li>
              <strong>Browse & Filter:</strong> Check the public listings using real-time search, date ranges, and category filters.
            </li>
            <li>
              <strong>Connect Safely:</strong> Click any item to view details and use the provided contact email or phone number to reach out.
            </li>
            <li>
              <strong>Reunite:</strong> Arrange a safe handover in a public location.
            </li>
          </ol>
        </div>

        <div className="form-card" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div className="feature-icon-wrapper" style={{ margin: 0, width: '38px', height: '38px' }}>
              <Shield size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Privacy & Safety</h2>
          </div>
          <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            Your security is important to us. Public cards display masked contact information to prevent spam while allowing legit inquiries.
          </p>
          <ul style={{ paddingLeft: '1.25rem', color: '#4b5563', lineHeight: 1.7 }}>
            <li>Always meet in a well-lit, public location for handovers.</li>
            <li>Verify item details or ownership proof before handing over high-value belongings.</li>
            <li>Only share contact details you are comfortable making visible to other portal users.</li>
          </ul>
        </div>

        <div className="form-card" style={{ maxWidth: '100%', background: 'linear-gradient(135deg, #fff5f5, #ffffff)', borderColor: '#ffe1e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Mail size={22} color="#dc2626" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>Contact Administrators</h2>
          </div>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>
            Have questions, feedback, or need assistance removing a listing? Email our portal administrators at{' '}
            <a href="mailto:admin@lostandfound.example" style={{ color: '#dc2626', fontWeight: 600 }}>
              admin@lostandfound.example
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
