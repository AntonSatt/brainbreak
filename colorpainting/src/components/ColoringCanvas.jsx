import { useRef, useEffect, useCallback } from 'react';
import { floodFill } from '../utils/floodFill';

export default function ColoringCanvas({ imageSrc, selectedColor, focusMode, onToggleFocus }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = imageSrc;
  }, [imageSrc]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    // Convert hex color to RGB
    const r = parseInt(selectedColor.slice(1, 3), 16);
    const g = parseInt(selectedColor.slice(3, 5), 16);
    const b = parseInt(selectedColor.slice(5, 7), 16);

    floodFill(ctx, x, y, [r, g, b]);
  }, [selectedColor]);

  if (!imageSrc) return null;

  return (
    <div className="coloring-section">
      <div className="coloring-header">
        <div>
          <h2>Color your page!</h2>
          <p className="hint">Click on a white area to fill it with the selected color</p>
        </div>
        <button
          className={`focus-btn${focusMode ? ' active' : ''}`}
          onClick={onToggleFocus}
          title={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
        >
          {focusMode ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 4 20 10 20" />
                <polyline points="20 10 20 4 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Exit focus
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Focus mode
            </>
          )}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="coloring-canvas"
        onClick={handleClick}
      />
    </div>
  );
}
