export default function ControlPanel({ run, rec, setRun, setRec, dt, setDt, freq, setFreq }) {
  return (
    <div className="control-panel">
      <h3 className="panel-title">Simulation Controls</h3>

      <div className="button-group">
        <button
          className={`control-button ${run ? 'pause' : 'run'}`}
          onClick={() => setRun(v => !v)}
        >
          <span className="button-icon">
            {run ? '⏸️' : '▶️'}
          </span>
          {run ? "Pause" : "Run"}
        </button>

        <button
          className={`control-button ${rec ? 'recording' : 'record'}`}
          onClick={() => setRec(v => !v)}
        >
          <span className="button-icon">
            {rec ? '⏺️' : '⏺️'}
          </span>
          {rec ? "Stop Recording" : "Record"}
        </button>
      </div>

      <div className="slider-group">
        <div className="slider-item">
          <label className="slider-label">
            <span>Speed: {dt.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={dt}
            onChange={(e) => setDt(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>

        <div className="slider-item">
          <label className="slider-label">
            <span>Update Frequency: {freq.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={freq}
            onChange={(e) => setFreq(parseFloat(e.target.value))}
            className="control-slider"
          />
        </div>
      </div>

      <style jsx>{`
        .control-panel {
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

        .button-group {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .control-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-button.run {
          background: #10b981;
          color: white;
        }

        .control-button.run:hover {
          background: #059669;
        }

        .control-button.pause {
          background: #f59e0b;
          color: white;
        }

        .control-button.pause:hover {
          background: #d97706;
        }

        .control-button.record {
          background: #f3f4f6;
          color: #374151;
        }

        .control-button.record:hover {
          background: #e5e7eb;
        }

        .control-button.recording {
          background: #ef4444;
          color: white;
        }

        .control-button.recording:hover {
          background: #dc2626;
        }

        .button-icon {
          font-size: 16px;
        }

        .slider-group {
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
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .control-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
