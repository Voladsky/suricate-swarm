
import { useState, useEffect } from "react";
import { useRef } from "react";
import { createRobots, updateRobots } from "./swarmLogic";
import SwarmScene from "../scene/SwarmScene";
import ControlPanel from "../ui/ControlPanel";
import SensorChart from "../charts/SensorChart";
import { addHeat, createTemperatureField, diffuse } from "./temperatureField";
import HeatControlPanel from "../ui/HeatControlPanel";
import BoidsControlPanel from "../ui/BoidsControlPanel";

export default function SimulationController() {
  const [robots, setRobots] = useState(() => createRobots(42));
  const temperatureFieldRef = useRef(createTemperatureField(100, 100, 0));
  const [run, setRun] = useState(true);
  const [rec, setRec] = useState(false);
  const [speed, setSpeed] = useState(.5);
  const [dt, setDt] = useState(.5);

  const [selectedRobotId, setSelectedRobotId] = useState(null);
  const simTimeRef = useRef(0);

  const [isDrawMode, setIsDrawMode] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushIntensity, setBrushIntensity] = useState(1);

  const [boids, setBoids] = useState({
    sep: 1.2,
    ali: 1.0,
    coh: 0.8,
    heat: 0.5
  });
  useEffect(() => {
    if (!run) return;
    let id;
    const step = () => {
      setRobots(r => updateRobots(r, temperatureFieldRef.current,
        {
          recording: rec,
          speed: speed,
          currentTime: simTimeRef.current,
          dt: dt,
          boids: boids
        }));
      diffuse(temperatureFieldRef.current, 0.1 * dt);
      //console.log(temperatureFieldRef.current.data.slice(0, 10));
      id = requestAnimationFrame(step);
      simTimeRef.current += dt;
    };
    step(); return () => cancelAnimationFrame(id);
  }, [run, rec, speed, dt, boids]);
  return (
    <div className="simulation-container">
      <div className="simulation-main">
        <div className="swarm-container">
          <SwarmScene
            robots={robots}
            temperatureRef={temperatureFieldRef}
            selectedRobotId={selectedRobotId}
            onRobotClick={setSelectedRobotId}
            isDrawMode={isDrawMode}
            brushSize={brushSize}
            brushIntensity={brushIntensity}
          />
          <BoidsControlPanel boids={boids} setBoids={setBoids} />
        </div>
        <div className="control-sidebar">
          <ControlPanel
            run={run}
            rec={rec}
            setRun={setRun}
            setRec={setRec}
            dt={speed}
            setDt={setSpeed}
            freq={dt}
            setFreq={setDt} />
          <HeatControlPanel
            isDrawMode={isDrawMode}
            onToggleDrawMode={() => {
              setRun(isDrawMode);
              setIsDrawMode(!isDrawMode);
            }}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
            brushIntensity={brushIntensity}
            onBrushIntensityChange={setBrushIntensity}
            onClearHeat={() => {
              temperatureFieldRef.current.data.fill(0);
            }}
            onRandomizeHeat={() => {
              temperatureFieldRef.current.data = temperatureFieldRef.current.data.map(() => Math.random() * 100 - 50);
            }}
            onHeatUpdate={(data) => {
              temperatureFieldRef.current.data = data;
            }} />
          <SensorChart robot={robots[selectedRobotId]} />
        </div>
      </div>

      <style jsx>{`
      .simulation-container {
        padding: 20px;
        background: #f9fafb;
        min-height: 100vh;
      }

      .swarm-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    width: 600px;
    margin: 0 auto;
  }

      .simulation-main {
        display: flex;
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .control-sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex: 1;
        min-width: 320px;
      }
    `}</style>
    </div>
  );
}
