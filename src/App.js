import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import GenreFilter from './components/GenreFilter';
import Dashboard from './components/Dashboard';
import AuthModal from './components/Authmodal';
import Footer from './components/Footer';
import { useStore } from './components/Usestore';
import './styles/globals.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [activeGenre, setActiveGenre] = useState('all');
  const { user } = useStore();

  // Always force light theme on first load, then follow toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Ensure light on mount regardless of any cached preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const handleProfileClick = () => {
    if (user) setShowDash(true);
    else setShowAuth(true);
  };

  return (
    <div className="app">
      <Header
        darkMode={darkMode}
        toggleDark={() => setDarkMode(d => !d)}
        onProfile={handleProfileClick}
        user={user}
      />
      <main>
        <section className="hero-section">
          <div className="hero-text">
            <span className="hero-tag">Find your stillness</span>
            <h1 className="hero-title">Drift into <em>peace</em></h1>
            <p className="hero-sub">Curated soundscapes for deep focus, rest &amp; healing.</p>
          </div>
          <HeroCarousel activeGenre={activeGenre} />
        </section>
        <GenreFilter activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
      </main>
      <Footer />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showDash && <Dashboard onClose={() => setShowDash(false)} />}
    </div>
  );
}