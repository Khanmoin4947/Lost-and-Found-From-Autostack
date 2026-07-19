import React from 'react';
import { Search, PlusCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function HomePage({ items, setActiveRoute, setReportType, onSelectItem }) {
  const recentItems = items.slice(0, 3);

  return (
    <div className="container">
      <section className="hero">

        <h1 className="hero-title">
          Lost & <span>Found</span> Community Portal
        </h1>

        <p className="hero-subtitle">
          Report lost items, list found belongings, and browse active listings to safely reunite people with their misplaced possessions.
        </p>

        <div className="hero-cta">
          <button
            className="btn btn-primary"
            onClick={() => {
              setReportType('lost');
              setActiveRoute('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <PlusCircle size={18} />
            Report Lost Item
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setReportType('found');
              setActiveRoute('report');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <PlusCircle size={18} />
            Report Found Item
          </button>
        </div>

        <button
          className="hero-secondary-link"
          onClick={() => {
            setActiveRoute('items');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Search size={16} /> Browse all reported items <ArrowRight size={15} />
        </button>
      </section>

      {recentItems.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Recent Reports</h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Latest items reported by community members</p>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              onClick={() => {
                setActiveRoute('items');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="items-grid">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={onSelectItem} />
            ))}
          </div>
        </section>
      )}

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Zap size={22} />
          </div>
          <h3>Instant Reporting</h3>
          <p>Easily log lost or found items with photo uploads, category tagging, and location details in under a minute.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Search size={22} />
          </div>
          <h3>Smart Filtering</h3>
          <p>Quickly search by item name, description, date range, or specific categories to spot matches.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={22} />
          </div>
          <h3>Safe Reunion</h3>
          <p>Masked contact details and safety guidelines ensure secure communication between rightful owners and finders.</p>
        </div>
      </section>
    </div>
  );
}
