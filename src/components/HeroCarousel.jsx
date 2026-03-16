import React, { useState, useEffect, useRef, useCallback } from 'react';
import SoundCard from './SoundCard';
import SoundModal from './SoundModal';
import { sounds } from '../data/sounds';
import './HeroCarousel.css';

const CARD_W = 300;
const CARD_GAP = 24;
const STEP = CARD_W + CARD_GAP; // 324

export default function HeroCarousel({ activeGenre }) {
  const filtered = activeGenre === 'all'
    ? sounds
    : sounds.filter(s => s.genre === activeGenre);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalSound,  setModalSound]  = useState(null);

  const trackRef       = useRef(null);
  const autoRef        = useRef(null);
  const isProg         = useRef(false);
  const isDragging     = useRef(false);
  const dragStartX     = useRef(0);
  const dragScrollLeft = useRef(0);
  const dragMoved      = useRef(false);
  const activeRef      = useRef(0);

  /* ─────────────────────────────────────────────────────────────────────
     Spacer width = calc(50vw - 150px), same as CSS ::before/::after.
     Card[i] left edge in scroll coords = spacerW + i*STEP
     Card[i] centre                     = spacerW + i*STEP + CARD_W/2
     We want card[i] centre at track.offsetWidth/2:
       scrollLeft = spacerW + i*STEP + CARD_W/2 - trackW/2
  ───────────────────────────────────────────────────────────────────── */
  const getSpacerW = () => {
    const track = trackRef.current;
    if (!track) return 0;
    // Match CSS: calc(50vw - 150px)
    return window.innerWidth / 2 - CARD_W / 2;
  };

  const scrollToIdx = useCallback((idx, animated = true) => {
    const track = trackRef.current;
    if (!track) return;
    const spacerW = getSpacerW();
    const target = spacerW + idx * STEP + CARD_W / 2 - track.offsetWidth / 2;
    isProg.current = true;
    track.scrollTo({ left: Math.max(0, target), behavior: animated ? 'smooth' : 'instant' });
    clearTimeout(track._t);
    track._t = setTimeout(() => { isProg.current = false; }, 700);
  }, []);

  /* Snap to nearest after drag */
  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const spacerW = getSpacerW();
    // inverse: idx = (scrollLeft - spacerW - CARD_W/2 + trackW/2) / STEP
    const idx = Math.round(
      (track.scrollLeft - spacerW - CARD_W / 2 + track.offsetWidth / 2) / STEP
    );
    const clamped = Math.max(0, Math.min(filtered.length - 1, idx));
    setActiveIndex(clamped);
  }, [filtered.length]);

  /* Genre reset */
  useEffect(() => {
    setActiveIndex(0);
    activeRef.current = 0;
    requestAnimationFrame(() => scrollToIdx(0, false));
  }, [activeGenre, scrollToIdx]);

  /* Scroll on index change */
  useEffect(() => {
    activeRef.current = activeIndex;
    scrollToIdx(activeIndex);
  }, [activeIndex, scrollToIdx]);

  /* Re-centre on resize */
  useEffect(() => {
    const onResize = () => scrollToIdx(activeRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scrollToIdx]);

  /* ─── Mouse drag ───────────────────────────────────────────────────── */
  const onMouseDown = useCallback((e) => {
    isDragging.current     = true;
    dragMoved.current      = false;
    dragStartX.current     = e.clientX;
    dragScrollLeft.current = trackRef.current.scrollLeft;
    clearInterval(autoRef.current);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4) dragMoved.current = true;
    isProg.current = true;
    trackRef.current.scrollLeft = dragScrollLeft.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    isProg.current = false;
    snapToNearest();
    startAuto(); // eslint-disable-line
  }, [snapToNearest]); // eslint-disable-line

  /* ─── Touch drag ───────────────────────────────────────────────────── */
  const onTouchStart = useCallback((e) => {
    dragStartX.current     = e.touches[0].clientX;
    dragScrollLeft.current = trackRef.current.scrollLeft;
    dragMoved.current      = false;
    clearInterval(autoRef.current);
  }, []);

  const onTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - dragStartX.current;
    if (Math.abs(dx) > 4) dragMoved.current = true;
    isProg.current = true;
    trackRef.current.scrollLeft = dragScrollLeft.current - dx;
  }, []);

  const onTouchEnd = useCallback(() => {
    isProg.current = false;
    snapToNearest();
    startAuto(); // eslint-disable-line
  }, [snapToNearest]); // eslint-disable-line

  /* Global mouse up/move */
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  /* ─── Auto-advance ─────────────────────────────────────────────────── */
  function startAuto() {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filtered.length);
    }, 5000);
  }

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [filtered.length]); // eslint-disable-line

  /* ─── Click handler ────────────────────────────────────────────────── */
  const handleCardClick = (idx) => {
    if (dragMoved.current) return;
    if (idx === activeIndex) setModalSound(filtered[idx]);
    else { setActiveIndex(idx); startAuto(); }
  };

  return (
    <>
      <div className="carousel-root" id="sounds">
        <button className="carousel-arrow carousel-arrow--left"
          onClick={() => { setActiveIndex(i => Math.max(0, i - 1)); startAuto(); }}
          aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div
          className="carousel-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {filtered.map((sound, idx) => (
            <div
              key={sound.id}
              className={`carousel-slide ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <SoundCard sound={sound} isActive={idx === activeIndex} />
            </div>
          ))}
        </div>

        <button className="carousel-arrow carousel-arrow--right"
          onClick={() => { setActiveIndex(i => Math.min(filtered.length - 1, i + 1)); startAuto(); }}
          aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="carousel-dots">
          {filtered.map((_, idx) => (
            <button key={idx}
              className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => { setActiveIndex(idx); startAuto(); }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {modalSound && (
        <SoundModal sound={modalSound} onClose={() => setModalSound(null)} />
      )}
    </>
  );
}