import { useState, useRef, useEffect } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import ColoringCanvas from './components/ColoringCanvas';
import ColorPalette from './components/ColorPalette';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [coloringImage, setColoringImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const canvasDataRef = useRef(null);
  const headerRef = useRef(null);

  // Header scroll effect (matching homepage)
  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 40) {
          headerRef.current.classList.add('scrolled');
        } else {
          headerRef.current.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fade-in on scroll (matching homepage)
  useEffect(() => {
    const fadeTargets = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    fadeTargets.forEach((el) => fadeObserver.observe(el));
    return () => fadeObserver.disconnect();
  }, [coloringImage, loading]);

  // Close nav on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && navOpen) {
        setNavOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [navOpen]);

  const handleGenerate = async () => {
    const canvas = document.querySelector('.drawing-canvas');
    if (canvas) {
      canvasDataRef.current = canvas.toDataURL('image/png');
    }

    if (!canvasDataRef.current) {
      setError('Draw something first!');
      return;
    }
    setLoading(true);
    setError(null);
    setColoringImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: canvasDataRef.current,
          text: text.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not generate coloring page');
      }

      setColoringImage(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToApp = () => {
    const el = document.getElementById('app-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ===== HEADER / NAV ===== */}
      <header className="site-header" ref={headerRef}>
        <div className="header-inner">
          <a href="/index.html" className="logo" aria-label="Mindspace – Home">
            <svg className="logo-icon" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16 2C10 8 2 16 2 24c0 6 4 12 14 14C26 36 30 30 30 24 30 16 22 8 16 2Z" fill="#6B8F71"/>
              <path d="M16 38V14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 22c-4-3-8-2-10 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M16 18c3-3 7-2 9 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="logo-text">Mindspace</span>
          </a>

          <button
            className={`nav-toggle ${navOpen ? 'open' : ''}`}
            aria-label="Open menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            <span></span><span></span><span></span>
          </button>

          <nav className={`main-nav ${navOpen ? 'open' : ''}`} aria-label="Main navigation">
            <ul>
              <li><a href="/index.html" className="nav-link">Home</a></li>
              <li><button className="nav-link active" onClick={() => { scrollToApp(); setNavOpen(false); }}>ColorPainting</button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero" aria-label="Welcome">
        <div className="hero-bg">
          <div className="shape shape--top-right"></div>
          <div className="shape shape--left"></div>
          <div className="shape shape--circle"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Create your own <em>coloring book</em>
          </h1>
          <p className="hero-subtitle">
            Draw a sketch, let AI create a beautiful coloring page – and fill it with colors right in your browser.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="scroll-hint"
          aria-hidden="true"
          onClick={scrollToApp}
          style={{ cursor: 'pointer', marginTop: '2rem', animation: 'float 2.4s ease-in-out infinite', color: 'var(--clr-text-light)', opacity: 0.5 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ===== APP SECTION ===== */}
      <div className="app" id="app-section">
        {/* Section wave decoration */}
        <div className="section-wave" aria-hidden="true">
          <svg viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 6c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0" stroke="#6B8F71" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="main-layout">
          {/* Left panel: Drawing */}
          <div className="left-panel panel fade-in">
            <div className="panel-title">
              <svg className="panel-title-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Draw your sketch
            </div>

            <DrawingCanvas />

            <input
              type="text"
              className="text-input"
              placeholder="Optional: describe your drawing (e.g. 'a happy cat')"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create coloring page'}
            </button>

            {error && <p className="error">{error}</p>}
          </div>

          {/* Right panel: Coloring result */}
          <div className="right-panel">
            {loading && (
              <div className="loading fade-in visible">
                <div className="spinner" />
                <p>Creating your coloring page...</p>
              </div>
            )}

            {coloringImage && (
              <div className="fade-in visible">
                <ColoringCanvas
                  imageSrc={coloringImage}
                  selectedColor={selectedColor}
                />
                <ColorPalette
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              </div>
            )}

            {!coloringImage && !loading && (
              <div className="placeholder fade-in visible">
                <svg className="placeholder-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="16" r="3" fill="currentColor" opacity=".7"/>
                  <circle cx="30" cy="16" r="3" fill="currentColor" opacity=".5"/>
                  <circle cx="14" cy="26" r="3" fill="currentColor" opacity=".6"/>
                  <path d="M28 32c2-2 6-2 8 0s2 6-2 6-4-2-6 0-6 1-6-2 4-2 6-4Z" fill="currentColor" opacity=".4"/>
                </svg>
                <p>Your coloring page will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <p>&copy; 2026 Mindspace. All rights reserved.</p>
      </footer>

      {/* Float keyframe for scroll hint */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </>
  );
}

export default App;
