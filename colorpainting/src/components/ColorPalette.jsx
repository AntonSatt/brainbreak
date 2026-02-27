const COLORS = [
  '#FF0000', '#FF6B00', '#FFD700', '#00C853',
  '#2196F3', '#9C27B0', '#E91E63', '#795548',
  '#607D8B', '#000000', '#FFFFFF', '#FF9800',
  '#4CAF50', '#03A9F4', '#673AB7', '#F44336',
];

export default function ColorPalette({ selectedColor, onSelectColor }) {
  return (
    <div className="color-palette">
      {COLORS.map((color) => (
        <button
          key={color}
          className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
          title={color}
        />
      ))}
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => onSelectColor(e.target.value)}
        className="color-picker-input"
        title="Custom color"
      />
    </div>
  );
}
