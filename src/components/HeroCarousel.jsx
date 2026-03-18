import React, { useState, useEffect, useRef, useCallback } from 'react';
import SoundCard from './SoundCard';
import SoundModal from './SoundModal';
import { sounds } from '../data/sounds';
import './HeroCarousel.css';

export default function HeroCarousel({ activeGenre }) {
  const filtered = activeGenre === 'all'
    ? sounds
    : sounds.filter(s => s.genre === activeGenre);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalSound,  setModalSound]  = useState(null);

  const trackRef   = useRef(null);
  const autoRef    = useRef(null);
  const activeRef  = useRef(0);
  const debRef     = useRef(null);
  const isDragging = useRef(false);
  const dragMoved  = useRef(false);
  const dragX0     = useRef(0);
  const dragSL0    = useRef(0);

  /* ── Programmatic scroll to a slide ─────────────────────────────────
     Each .carousel-slide has scroll-snap-align:center.
     We just scrollIntoView — browser handles the centering perfectly.
  ──────────────────────────────────────────────────────────────────── */
  const scrollToIdx = useCallback((idx, animated = true) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll('.carousel-slide');
    if (!slides[idx]) return;
    slides[idx].scrollIntoView({
      behavior: animated ? 'smooth' : 'instant',
      block: 'nearest',
      inline: 'center',
    });
  }, []);

  /* Genre reset */
  useEffect(() => {
    setActiveIndex(0);
    activeRef.current = 0;
    // instant jump — no animation
    requestAnimationFrame(() => scrollToIdx(0, false));
  }, [activeGenre, scrollToIdx]);

  /* Scroll on index change */
  useEffect(() => {
    activeRef.current = activeIndex;
    scrollToIdx(activeIndex);
  }, [activeIndex, scrollToIdx]);

  /* Detect active card from scroll position */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const fn = () => {
      clearTimeout(debRef.current);
      debRef.current = setTimeout(() => {
        const slides = track.querySelectorAll('.carousel-slide');
        const trackCx = track.getBoundingClientRect().left + track.offsetWidth / 2;
        let best = 0, bestDist = Infinity;
        slides.forEach((slide, i) => {
          const r = slide.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const d  = Math.abs(cx - trackCx);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        if (best !== activeRef.current) {
          activeRef.current = best;
          setActiveIndex(best);
        }
      }, 80);
    };
    track.addEventListener('scroll', fn, { passive: true });
    return () => track.removeEventListener('scroll', fn);
  }, [filtered.length]);

  /* Auto-advance */
  function startAuto() {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setActiveIndex(p => (p + 1) % filtered.length);
    }, 5000);
  }
  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [filtered.length]); // eslint-disable-line

  /* Mouse drag */
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    dragMoved.current  = false;
    dragX0.current     = e.clientX;
    dragSL0.current    = trackRef.current.scrollLeft;
    clearInterval(autoRef.current);
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragX0.current;
    if (Math.abs(dx) > 3) dragMoved.current = true;
    trackRef.current.scrollLeft = dragSL0.current - dx;
  }, []);
  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    startAuto();
  }, []); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="carousel-track" ref={trackRef}
          onMouseDown={onMouseDown}>

          {filtered.map((sound, idx) => (
            <div key={sound.id}
              className={`carousel-slide ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(idx)}>
              <SoundCard sound={sound} isActive={idx === activeIndex} />
            </div>
          ))}
        </div>

        <button className="carousel-arrow carousel-arrow--right"
          onClick={() => { setActiveIndex(i => Math.min(filtered.length - 1, i + 1)); startAuto(); }}
          aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {modalSound && <SoundModal sound={modalSound} onClose={() => setModalSound(null)} />}
    </>
  );
}