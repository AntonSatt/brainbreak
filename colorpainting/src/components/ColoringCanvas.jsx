import { useRef, useEffect, useCallback } from 'react';
import { floodFill } from '../utils/floodFill';

export default function ColoringCanvas({ imageSrc, selectedColor }) {
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
      <h2>Färglägg din sida!</h2>
      <p className="hint">Klicka på ett vitt område för att fylla det med vald färg</p>
      <canvas
        ref={canvasRef}
        className="coloring-canvas"
        onClick={handleClick}
      />
    </div>
  );
}
