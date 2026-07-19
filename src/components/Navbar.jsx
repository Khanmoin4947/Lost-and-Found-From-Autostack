import React from 'react';
import { Home, Package, PlusCircle, Info, SearchCheck } from 'lucide-react';

export default function Navbar({ activeRoute, setActiveRoute, setReportType }) {
  const handleNav = (route) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div 
          className="brand-logo" 
          onClick={() => handleNav('home')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-icon">
            <SearchCheck size={20} />
          </div>
          <span>Lost & Found</span>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <button
            className={`nav-button ${activeRoute === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            <Home size={17} />
            <span>Home</span>
          </button>

          <button
            className={`nav-button ${activeRoute === 'items' ? 'active' : ''}`}
            onClick={() => handleNav('items')}
          >
            <Package size={17} />
            <span>Browse Items</span>
          </button>

          <button
            className={`nav-button ${activeRoute === 'report' ? 'active' : ''}`}
            onClick={() => {
              setReportType('lost');
              handleNav('report');
            }}
          >
            <PlusCircle size={17} />
            <span>Report Item</span>
          </button>

          <button
            className={`nav-button ${activeRoute === 'about' ? 'active' : ''}`}
            onClick={() => handleNav('about')}
          >
            <Info size={17} />
            <span>About Us</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
