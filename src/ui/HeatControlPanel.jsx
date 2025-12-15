export default function HeatControlPanel({
  isDrawMode,
  onToggleDrawMode,
  brushSize,
  onBrushSizeChange,
  brushIntensity,
  onBrushIntensityChange,
  onClearHeat,
  onRandomizeHeat
}) {
  return (
    <div className="heat-control-panel">
      <h3 className="panel-title">Heat Controls</h3>

      <div className="mode-toggle">
        <button
          className={`mode-button ${isDrawMode ? 'active' : ''}`}
          onClick={onToggleDrawMode}
        >
          <span className="button-icon">
            {isDrawMode ? '👁️' : '✏️'}
          </span>
          {isDrawMode ? "Observe Mode" : "Draw Mode"}
        </button>

        <div className="mode-hint">
          {isDrawMode ? "Click+drag to draw, Shift+drag to cool" : "Click robots to inspect"}
        </div>
      </div>

      <div className="brush-controls">
        <div className="brush-sliders">
          <div className="slider-item">
            <label className="slider-label">
              <span>Brush Size: {brushSize}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
              className="control-slider"
            />
          </div>

          <div className="slider-item">
            <label className="slider-label">
              <span>Brush Intensity: {brushIntensity}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={brushIntensity}
              onChange={(e) => onBrushIntensityChange(parseInt(e.target.value))}
              className="control-slider"
            />
          </div>
        </div>

        <div className="heat-presets">
          <button
            className="preset-button clear"
            onClick={onClearHeat}
          >
            Clear Heat
          </button>
          <button
            className="preset-button random"
            onClick={onRandomizeHeat}
          >
            Randomize
          </button>
        </div>
      </div>

      <style jsx>{`
        .heat-control-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
        }

        .panel-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
          margin-top: 0;
        }

        .mode-toggle {
          margin-bottom: 24px;
        }

        .mode-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-button:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .mode-button.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .button-icon {
          font-size: 18px;
        }

        .mode-hint {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          margin-top: 8px;
          font-style: italic;
        }

        .brush-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .brush-sliders {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .slider-item {
          margin-bottom: 8px;
        }

        .slider-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .control-slider {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .control-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${isDrawMode ? '#ef4444' : '#3b82f6'};
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .control-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${isDrawMode ? '#ef4444' : '#3b82f6'};
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .heat-presets {
          display: flex;
          gap: 12px;
        }

        .preset-button {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-button.clear {
          background: #f3f4f6;
          color: #374151;
        }

        .preset-button.clear:hover {
          background: #e5e7eb;
        }

        .preset-button.random {
          background: #8b5cf6;
          color: white;
        }

        .preset-button.random:hover {
          background: #7c3aed;
        }
      `}</style>
    </div>
  );
}
