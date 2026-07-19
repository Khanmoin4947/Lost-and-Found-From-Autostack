import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Tag, RefreshCw, AlertCircle } from 'lucide-react';
import ItemCard from '../components/ItemCard';

export default function ItemsPage({ items, onSelectItem, isLoading, fetchError }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Extract unique categories from items array
  const categories = useMemo(() => {
    const set = new Set();
    const defaults = ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Others'];
    defaults.forEach((c) => set.add(c));
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set).sort();
  }, [items]);

  // Filter items matching all active filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const haystack = `${item.title || ''} ${item.category || ''} ${item.description || ''} ${item.location || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (selectedStatus && item.status !== selectedStatus) {
        return false;
      }

      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      if (fromDate && item.date < fromDate) {
        return false;
      }

      if (toDate && item.date > toDate) {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus, fromDate, toDate]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedStatus || fromDate || toDate;

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
          Reported Items
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Browse all active lost and found listings. Use search and date filters to locate specific belongings.
        </p>
      </div>

      <div className="search-card">
        <div className="search-input-wrapper">
          <Search className="search-input-icon" size={18} />
          <input
            type="search"
            className="form-input"
            placeholder="Search by title, category, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <div className="form-group">
            <label className="form-label">
              <Tag size={14} /> Category
            </label>
            <select
              className="form-input form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Filter size={14} /> Status
            </label>
            <select
              className="form-input form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All (Lost & Found)</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> From Date
            </label>
            <input
              type="date"
              className="form-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={14} /> To Date
            </label>
            <input
              type="date"
              className="form-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={handleClearFilters}>
              <RefreshCw size={14} /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="empty-state">
          <p style={{ color: '#6b7280' }}>Loading items from database...</p>
        </div>
      ) : fetchError ? (
        <div className="empty-state" style={{ borderColor: '#fca5a5' }}>
          <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            Connection Notice
          </h3>
          <p style={{ color: '#6b7280', maxWidth: '450px', margin: '0 auto 1rem auto' }}>
            {fetchError}
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={28} />
          </div>
          <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
            No matching items found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>
            Try adjusting your search criteria or date filters to find what you're looking for.
          </p>
          {hasActiveFilters && (
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={onSelectItem} />
          ))}
        </div>
      )}
    </div>
  );
}
