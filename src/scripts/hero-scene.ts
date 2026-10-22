import * as THREE from 'three';

export interface SceneController { setRunning: (running: boolean) => void; dispose: () => void }

export function createHeroScene(host: HTMLElement, onFailure: () => void): SceneController {
  const canvas = host.querySelector('canvas')!;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.z = 7;
  const group = new THREE.Group();
  scene.add(group);
  const color = host.dataset.color || getComputedStyle(host).color;
  const secondary = host.dataset.secondary || color;
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
    geometries.add(geometry);
    materials.add(material);
    const object = new THREE.Mesh(geometry, material);
    group.add(object);
    return object;
  };
  const material = (opacity = 1) => new THREE.MeshStandardMaterial({ color, roughness: .4, metalness: .25, transparent: opacity < 1, opacity });
  const compact = host.clientWidth < 500;
  const preset = host.dataset.preset;
  let observer: ResizeObserver | undefined;
  let disposed = false;
  let running = false;
  let previous = 0;
  let elapsed = 0;
  const lost = (event: Event) => { event.preventDefault(); onFailure(); };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    observer?.disconnect();
    canvas.removeEventListener('webglcontextlost', lost);
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
    renderer.dispose();
  };

  try {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 3));
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(3, 4, 5);
    scene.add(light);
    if (preset === 'network') {
      const points = Array.from({length: compact ? 9 : 14}, (_, i) => {
        const angle = i * 2.4;
        return new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.4, Math.sin(i * 1.7) * .8);
      });
      const sharedGeometry = new THREE.SphereGeometry(.09, 12, 8);
      const sharedMaterial = material();
      points.forEach(point => mesh(sharedGeometry, sharedMaterial).position.copy(point));
      const connections: THREE.Vector3[] = [];
      points.forEach((point, i) => points.slice(i + 1).forEach(other => {
        if (point.distanceTo(other) < 2) connections.push(point, other);
      }));
      const geometry = new THREE.BufferGeometry().setFromPoints(connections);
      const lines = new THREE.LineBasicMaterial({color: secondary, transparent: true, opacity: .4});
      geometries.add(geometry); materials.add(lines);
      group.add(new THREE.LineSegments(geometry, lines));
    } else if (preset === 'landscape') {
      for (let i = 0; i < (compact ? 8 : 12); i++) {
        const points = Array.from({length: 65}, (_, j) => {
          const x = j / 64 * 3.8 - 1.9;
          return new THREE.Vector3(x, Math.sin(x * 1.8 + i * .18) * .42, i * .14 - .8);
        });
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 64, .025, 4, false), material(.45 + i * .035));
      }
      group.rotation.x = .6;
    } else {
      const ring = mesh(new THREE.TorusKnotGeometry(1, .24, compact ? 80 : 128, 12), material());
      ring.rotation.z = -.4;
      mesh(new THREE.IcosahedronGeometry(.44, 1), new THREE.MeshStandardMaterial({color: secondary, roughness: .7}));
    }

    const render = () => renderer.render(scene, camera);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height || disposed) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    const tick = (time: number) => {
      elapsed += previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      group.rotation.y = Math.sin(elapsed * .22) * .35;
      group.position.y = Math.sin(elapsed * .6) * .08;
      render();
    };
    canvas.addEventListener('webglcontextlost', lost);
    observer = new ResizeObserver(resize);
    observer.observe(host);
    resize(); // The fallback is replaced only after a successful first frame.
    return {
      setRunning(value) {
        if (disposed || running === value) return;
        running = value;
        previous = 0;
        renderer.setAnimationLoop(value ? tick : null);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
