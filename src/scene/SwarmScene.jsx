import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function SwarmScene({
  robots,
  selectedRobotId,
  onRobotClick,
  temperatureRef,
  isDrawMode,
  brushSize,
  brushIntensity,
  onHeatUpdate
}) {
  const mountRef = useRef();

  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const meshesRef = useRef([]);
  const tempTextureRef = useRef();
  const tempMeshRef = useRef();

  const isDrawingRef = useRef(false);
  const canDrawRef = useRef(false);
  const lastMousePosRef = useRef(null);
  const brushIndicatorRef = useRef(null);

  const brushSizeRef = useRef(brushSize);
  const brushIntensityRef = useRef(brushIntensity);

  useEffect(() => {
    brushSizeRef.current = brushSize;
    brushIntensityRef.current = brushIntensity;
    canDrawRef.current = isDrawMode;
  }, [brushSize, brushIntensity, isDrawMode]);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -50, 50, 50, -50, 1, 100
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(600, 600);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshesRef.current);

      if (hits.length > 0) {
        onRobotClick(hits[0].object.userData.id);
      }
    };

    const onMouseDown = (e) => {
      if (!canDrawRef.current) return;
      isDrawingRef.current = true;
      handleDraw(e, e.shiftKey ? -brushIntensity : brushIntensity);
    }

    const onMouseUp = () => {
      if (!canDrawRef.current) return;
      isDrawingRef.current = false;
      lastMousePosRef.current = null;
    }

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Update brush indicator position
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);

      if (brushIndicatorRef.current) {
        brushIndicatorRef.current.position.copy(intersectionPoint);
        brushIndicatorRef.current.scale.setScalar(brushSizeRef.current / 3);
      }

      if (isDrawingRef.current) {
        handleDraw(e, e.shiftKey ? -brushIntensityRef.current : brushIntensityRef.current);
      }
    };

    const handleDraw = (e, intensity) => {
      if (!tempTextureRef.current || !temperatureRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectionPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        // Convert world coordinates (0..100) to texture coordinates (0..1)
        const texX = (intersectionPoint.x + 50) / 100;
        const texY = ((intersectionPoint.y + 50) / 100); // Flip Y

        if (texX >= 0 && texX <= 1 && texY >= 0 && texY <= 1) {
          applyBrush(texX, texY, intensity);
          if (onHeatUpdate) {
            onHeatUpdate(temperatureRef.current.data);
          }
        }
      }
    };

    const applyBrush = (centerX, centerY, intensity) => {
      const texture = tempTextureRef.current;
      const tempData = temperatureRef.current.data;
      const width = temperatureRef.current.width;
      const height = temperatureRef.current.height;

      const centerPixelX = Math.floor(centerX * width);
      const centerPixelY = Math.floor(centerY * height);
      const radiusPixels = Math.floor(brushSizeRef.current * (width / 100));

      for (let y = -radiusPixels; y <= radiusPixels; y++) {
        for (let x = -radiusPixels; x <= radiusPixels; x++) {
          const pixelX = centerPixelX + x;
          const pixelY = centerPixelY + y;

          if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
            const distance = Math.sqrt(x * x + y * y) / radiusPixels;
            if (distance <= 1) {
              // Gaussian falloff
              const falloff = Math.exp(-(distance * distance) * 2);
              const idx = pixelY * width + pixelX;
              const newValue = tempData[idx] + intensity * falloff;
              tempData[idx] = Math.max(0, Math.min(1, newValue));
            }
          }
        }
      }

      texture.needsUpdate = true;
    };

    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseleave", onMouseUp);


    const field = temperatureRef.current;
    console.log("Creating temperature texture with field:", field.data.slice(0, 10));
    const texture = new THREE.DataTexture(
      field.data,
      field.width,
      field.height,
      THREE.RedFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.6
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      material
    );
    plane.position.z = -1; // behind robots
    scene.add(plane);

    tempTextureRef.current = texture;
    tempMeshRef.current = plane;


    return () => {
      renderer.domElement.removeEventListener("click", onClick);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // Clear old meshes
    meshesRef.current.forEach(m => scene.remove(m));
    meshesRef.current = [];

    robots.forEach(r => {
      const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(1.5, 16),
        new THREE.MeshBasicMaterial({ color: 0x00ffcc })
      );
      mesh.userData.id = r.id;
      scene.add(mesh);
      meshesRef.current.push(mesh);
    });
  }, [robots.length]); // only if count changes

  useEffect(() => {
    let frame;

    const animate = () => {
      robots.forEach((r, i) => {
        const mesh = meshesRef.current[i];
        if (!mesh) return;

        mesh.position.set(r.pos.x, r.pos.y, 0);
        mesh.material.color.set(
          r.id === selectedRobotId ? 0xff4444 : 0x00ffcc
        );
      });

      rendererRef.current.render(
        sceneRef.current,
        cameraRef.current
      );

      if (tempTextureRef.current) {
        tempTextureRef.current.image.data = temperatureRef.current.data;
        tempTextureRef.current.needsUpdate = true;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [robots, selectedRobotId]);

  return (
    <div className="swarm-scene">
      <div ref={mountRef} className="scene-container" />
      <style jsx>{`
      .swarm-scene {
        background: #1f2937;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #374151;
        position: relative;
      }

      .scene-container {
        width: 600px;
        height: 600px;
        cursor: ${isDrawMode ? 'crosshair' : 'pointer'};
      }

      .scene-container canvas {
        border-radius: 12px;
      }
    `}</style>
    </div>
  );
}
