import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ItemDetailModal from './components/ItemDetailModal';

import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import ReportPage from './pages/ReportPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [reportType, setReportType] = useState('lost');
  
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/items');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch items from server');
      }
      const data = await res.json();
      // Sort items by createdAt descending if available
      data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setFetchError(err.message || 'Unable to connect to items service.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItemSuccess = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="app-wrapper">
      <Navbar 
        activeRoute={activeRoute} 
        setActiveRoute={setActiveRoute}
        setReportType={setReportType}
      />

      <main className="main-content">
        {activeRoute === 'home' && (
          <HomePage
            items={items}
            setActiveRoute={setActiveRoute}
            setReportType={setReportType}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        )}

        {activeRoute === 'items' && (
          <ItemsPage
            items={items}
            onSelectItem={(item) => setSelectedItem(item)}
            isLoading={isLoading}
            fetchError={fetchError}
          />
        )}

        {activeRoute === 'report' && (
          <ReportPage
            initialReportType={reportType}
            onAddItemSuccess={handleAddItemSuccess}
            setActiveRoute={setActiveRoute}
          />
        )}

        {activeRoute === 'about' && (
          <AboutPage />
        )}
      </main>

      <Footer setActiveRoute={setActiveRoute} />

      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
