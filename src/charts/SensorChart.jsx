
import * as d3 from "d3";
import { useRef, useEffect, useState } from "react";

export default function SensorChart({ robot }) {
  const ref = useRef();
  const [takeLast, setTakeLast] = useState(100);

  useEffect(() => {
    if (!robot || !robot.history) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const startIndex = Math.max(0, robot.history.length - takeLast);
    const d = robot.history.slice(startIndex);

    if (!d.length) return;

    const w = 300, h = 150;
    const x = d3.scaleLinear()
      .domain(d3.extent(d, e => e.t))
      .range([20, w - 20]);
    const y = d3.scaleLinear()
      .domain(d3.extent(d, e => e.temp))
      .range([h - 20, 20]);

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${h - 20})`)
      .call(d3.axisBottom(x).tickSize(-(h - 40)).tickFormat(""));

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(20,0)`)
      .call(d3.axisLeft(y).tickSize(-(w - 40)).tickFormat(""));

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${h - 20})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(20,0)`)
      .call(d3.axisLeft(y));

    // Add line
    svg.append("path")
      .datum(d)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(e => x(e.t))
        .y(e => y(e.temp))
      );

    // Add gradient area
    const area = d3.area()
      .x(e => x(e.t))
      .y0(h - 20)
      .y1(e => y(e.temp));

    svg.append("path")
      .datum(d)
      .attr("fill", "url(#temperature-gradient)")
      .attr("opacity", 0.3)
      .attr("d", area);

    // Add gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "temperature-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ef4444")
      .attr("stop-opacity", 0.8);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ef4444")
      .attr("stop-opacity", 0.1);

  }, [robot, takeLast]);

  return (
    <div className="sensor-chart">
      <div className="chart-header">
        <h3 className="chart-title">Temperature History</h3>
        {robot && (
          <span className="current-temp">
            Current: {robot.temperature?.toFixed(1) || "0.0"}°C
          </span>
        )}
      </div>

      <svg
        ref={ref}
        className="chart-svg"
        width={400}
        height={200}
      />

      <div className="chart-controls">
        <label className="range-label">
          <span>Time Window:</span>
          <span className="range-value">{takeLast} samples</span>
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="1"
          value={takeLast}
          onChange={(e) => setTakeLast(parseInt(e.target.value))}
          className="range-slider"
        />
      </div>

      <style jsx>{`
        .sensor-chart {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          border: 1px solid #e5e7eb;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .current-temp {
          font-size: 14px;
          color: #ef4444;
          font-weight: 500;
          background: #fef2f2;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .chart-svg {
          display: block;
          margin: 0 auto;
        }

        .chart-svg :global(.grid line) {
          stroke: #f3f4f6;
          stroke-width: 1;
        }

        .chart-svg :global(.grid path) {
          stroke-width: 0;
        }

        .chart-svg :global(.domain),
        .chart-svg :global(.tick line) {
          stroke: #9ca3af;
        }

        .chart-svg :global(.tick text) {
          fill: #6b7280;
          font-size: 11px;
        }

        .chart-controls {
          margin-top: 16px;
        }

        .range-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .range-value {
          font-weight: 500;
          color: #111827;
        }

        .range-slider {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .range-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
