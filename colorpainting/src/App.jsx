import { useState, useRef } from 'react';
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
  const canvasDataRef = useRef(null);

  const handleGenerate = async () => {
    // Grab current canvas content
    const canvas = document.querySelector('.drawing-canvas');
    if (canvas) {
      canvasDataRef.current = canvas.toDataURL('image/png');
    }

    if (!canvasDataRef.current) {
      setError('Please draw something first!');
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
        throw new Error(data.error || 'Failed to generate coloring book page');
      }

      setColoringImage(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Coloring Book Generator</h1>
      <p className="subtitle">Draw a sketch and we'll turn it into a coloring book page!</p>

      <div className="main-layout">
        <div className="left-panel">
          <DrawingCanvas />

          <input
            type="text"
            className="text-input"
            placeholder="Optional: add a hint (e.g. 'a happy cat')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Coloring Page'}
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="right-panel">
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <p>Creating your coloring book page...</p>
            </div>
          )}

          {coloringImage && (
            <>
              <ColoringCanvas
                imageSrc={coloringImage}
                selectedColor={selectedColor}
              />
              <ColorPalette
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            </>
          )}

          {!coloringImage && !loading && (
            <div className="placeholder">
              <p>Your coloring book page will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
