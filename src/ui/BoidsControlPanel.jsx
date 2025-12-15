export default function BoidsControlPanel({ boids, setBoids }) {
  const slider = (key, min, max, step = 0.05, label) => (
    <div className="slider-group">
      <div className="slider-header">
        <span className="slider-label">{label || key}</span>
        <span className="slider-value">{boids[key].toFixed(2)}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={boids[key]}
        onChange={e =>
          setBoids(b => ({
            ...b,
            [key]: +e.target.value
          }))
        }
      />
    </div>
  );

  return (
    <div className="control-panel-container">
      <div className="control-panel">
        <h3 className="panel-title">Boids Weights</h3>
        <div className="sliders-grid">
          {slider("sep", 0, 3, 0.05, "Separation")}
          {slider("ali", 0, 3, 0.05, "Alignment")}
          {slider("coh", 0, 3, 0.05, "Cohesion")}
          {slider("heat", 0, 3, 0.05, "Heat Influence")}
        </div>
      </div>
      <style jsx>{`
        .control-panel-container {
          width: 600px; /* Same width as SwarmScene */
          margin-top: 0;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .control-panel {
          background: #1f2937;
          border: 1px solid #374151;
          border-top: none;
          border-radius: 0 0 12px 12px;
          padding: 1.25rem 1.5rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #f9fafb;
          width: 100%;
          box-sizing: border-box;
        }

        .panel-title {
          margin: 0 0 1.25rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #e5e7eb;
          text-align: center;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #374151;
          padding-bottom: 0.75rem;
        }

        .sliders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slider-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #d1d5db;
          text-transform: capitalize;
        }

        .slider-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #60a5fa;
          background: rgba(96, 165, 250, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          min-width: 3rem;
          text-align: center;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        }

        .slider {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(90deg, #374151 0%, #4b5563 100%);
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          border: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 0 0 1px #374151, 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          background: #3b82f6;
          transform: scale(1.1);
          box-shadow: 0 0 0 1px #374151, 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 0 0 1px #374151, 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          background: #3b82f6;
          transform: scale(1.1);
          box-shadow: 0 0 0 1px #374151, 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        .slider::-webkit-slider-thumb:active {
          background: #2563eb;
          transform: scale(0.95);
        }

        .slider::-moz-range-thumb:active {
          background: #2563eb;
          transform: scale(0.95);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .sliders-grid {
            grid-template-columns: 1fr;
          }

          .control-panel {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
