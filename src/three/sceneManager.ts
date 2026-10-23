import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProductFinish, ProductId, LightingPresetId } from '../types';
import { LIGHTING_PRESETS } from '../data/products';
import { createHeadphonesModel, ModelWrapper } from './models/headphonesModel';
import { createSpeakerModel } from './models/speakerModel';
import { createSynthModel } from './models/synthModel';

// Pre-allocated scratch math helpers to ensure 0 GC during frame tick
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.3, 0);

export interface SceneManagerOptions {
  container: HTMLDivElement;
  onControlsChange?: () => void;
}

export class SceneManager {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private isSoftwareGl: boolean;
  private frameId: number = 0;
  private clock: THREE.Clock;

  // Models
  private currentProductId: ProductId = 'pulse-pro';
  private models: Map<ProductId, ModelWrapper> = new Map();
  private activeModel: ModelWrapper | null = null;

  // Lighting
  private keyLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private currentLightingPreset: LightingPresetId = 'studio-dark';

  // Floating particles & acoustic visualizer ring
  private particlePoints: THREE.Points;
  private visualizerRing: THREE.LineLoop;
  private visualizerWaveData: Float32Array;

  // Camera scroll choreography
  private scrollProgress: number = 0;
  private targetScrollProgress: number = 0;
  private mouseParallax = { x: 0, y: 0 };
  private targetMouseParallax = { x: 0, y: 0 };

  // Studio inspection mode state
  private isStudioMode: boolean = false;
  private explodedProgress: number = 0;
  private targetExplodedProgress: number = 0;
  private autoRotate: boolean = false;
  private audioPulseAmplitude: number = 0;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;
    this.clock = new THREE.Clock();

    // 1. Software-WebGL detection
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Modern Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x09090b);
    this.scene.fog = new THREE.Fog(0x09090b, 7, 24);

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    this.camera.position.set(0, 1.4, 5.2);

    // 4. Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio 3-point Lighting Rig
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.keyLight.position.set(4, 6, 4);
    if (!this.isSoftwareGl) {
      this.keyLight.castShadow = true;
      this.keyLight.shadow.mapSize.width = 1024;
      this.keyLight.shadow.mapSize.height = 1024;
      this.keyLight.shadow.bias = -0.0005;
      this.keyLight.shadow.normalBias = 0.02;
      this.keyLight.shadow.camera.near = 1;
      this.keyLight.shadow.camera.far = 16;
      this.keyLight.shadow.camera.left = -3;
      this.keyLight.shadow.camera.right = 3;
      this.keyLight.shadow.camera.top = 3;
      this.keyLight.shadow.camera.bottom = -3;
    }
    this.scene.add(this.keyLight);

    this.hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x09090b, 0.8);
    this.scene.add(this.hemiLight);

    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    this.rimLight.position.set(-5, 4, -4);
    this.scene.add(this.rimLight);

    // Precision Studio Turntable Platform & Millimeter CAD markings
    const turntableGroup = new THREE.Group();
    turntableGroup.position.y = 0.01;

    // Outer and inner concentric calibrated circular rings
    [1.8, 2.6, 3.4].forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.005, radius + 0.005, 64);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 1 ? 0x38bdf8 : 0x27272a,
        transparent: true,
        opacity: idx === 1 ? 0.35 : 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      turntableGroup.add(ringMesh);
    });

    // Crosshair axis ticks
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.8, 0, 0),
      new THREE.Vector3(3.8, 0, 0),
      new THREE.Vector3(0, 0, -3.8),
      new THREE.Vector3(0, 0, 3.8)
    ]);
    const axisMat = new THREE.LineBasicMaterial({
      color: 0x27272a,
      transparent: true,
      opacity: 0.3
    });
    const axisLines = new THREE.LineSegments(axisGeo, axisMat);
    turntableGroup.add(axisLines);

    this.scene.add(turntableGroup);

    // 6. Floating audio & dust particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 8;
      particlePos[i + 1] = Math.random() * 4.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.45
    });
    this.particlePoints = new THREE.Points(particleGeo, particleMat);
    this.scene.add(this.particlePoints);

    // 7. Spatial Soundwave Visualizer Ring
    const ringSegments = 96;
    const ringPositions = new Float32Array(ringSegments * 3);
    this.visualizerWaveData = new Float32Array(ringSegments);
    for (let i = 0; i < ringSegments; i++) {
      const angle = (i / ringSegments) * Math.PI * 2;
      ringPositions[i * 3] = Math.cos(angle) * 2.2;
      ringPositions[i * 3 + 1] = 0.05;
      ringPositions[i * 3 + 2] = Math.sin(angle) * 2.2;
    }
    const visualizerGeo = new THREE.BufferGeometry();
    visualizerGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    const visualizerMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55
    });
    this.visualizerRing = new THREE.LineLoop(visualizerGeo, visualizerMat);
    this.scene.add(this.visualizerRing);

    // 8. OrbitControls for Interactive Mode
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 8.5;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below ground
    this.controls.target.set(0, 1.3, 0);
    this.controls.enabled = false; // disabled during scroll story mode

    // 9. Instantiate procedural models
    this.initModels();

    // 10. Bind events
    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);

    // 11. Start RAF Loop
    this.tick = this.tick.bind(this);
    this.tick();
  }

  private initModels() {
    const hp = createHeadphonesModel();
    const sp = createSpeakerModel();
    const sy = createSynthModel();

    this.models.set('pulse-pro', hp);
    this.models.set('sphere-one', sp);
    this.models.set('core-prism', sy);

    hp.group.visible = true;
    sp.group.visible = false;
    sy.group.visible = false;

    this.scene.add(hp.group);
    this.scene.add(sp.group);
    this.scene.add(sy.group);

    this.activeModel = hp;
  }

  public setProduct(id: ProductId, finish?: ProductFinish) {
    if (this.currentProductId === id && this.activeModel) {
      if (finish) this.activeModel.updateFinish(finish);
      return;
    }

    this.models.forEach((m) => (m.group.visible = false));
    const nextModel = this.models.get(id);
    if (nextModel) {
      nextModel.group.visible = true;
      this.activeModel = nextModel;
      this.currentProductId = id;
      if (finish) {
        nextModel.updateFinish(finish);
      }
    }
  }

  public setFinish(finish: ProductFinish) {
    if (this.activeModel) {
      this.activeModel.updateFinish(finish);
    }
  }

  public setExplodedProgress(progress: number) {
    this.targetExplodedProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  public setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
  }

  public setStudioMode(enabled: boolean) {
    this.isStudioMode = enabled;
    this.controls.enabled = enabled;
    if (!enabled) {
      this.autoRotate = false;
    }
  }

  public setLightingPreset(presetId: LightingPresetId) {
    this.currentLightingPreset = presetId;
    const preset = LIGHTING_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    this.keyLight.color.setHex(preset.keyColor);
    this.keyLight.intensity = preset.keyIntensity;
    this.hemiLight.color.setHex(preset.fillColor);
    this.hemiLight.groundColor.setHex(preset.groundColor);
    this.hemiLight.intensity = preset.fillIntensity;
    this.rimLight.color.setHex(preset.fillColor);
    this.scene.background = new THREE.Color(preset.fogColor);
    if (this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.setHex(preset.fogColor);
    }
  }

  public setScrollProgress(progress: number) {
    this.targetScrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  public setAudioAmplitude(amplitude: number) {
    this.audioPulseAmplitude = amplitude;
  }

  private onPointerMove(e: PointerEvent) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    this.targetMouseParallax.x = nx * 0.35;
    this.targetMouseParallax.y = ny * 0.25;
  }

  private onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private tick() {
    this.frameId = requestAnimationFrame(this.tick);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth scroll interpolation
    this.scrollProgress = THREE.MathUtils.damp(this.scrollProgress, this.targetScrollProgress, 6, dt);

    // Smooth mouse parallax
    this.mouseParallax.x = THREE.MathUtils.damp(this.mouseParallax.x, this.targetMouseParallax.x, 4, dt);
    this.mouseParallax.y = THREE.MathUtils.damp(this.mouseParallax.y, this.targetMouseParallax.y, 4, dt);

    // Smooth exploded progress interpolation
    this.explodedProgress = THREE.MathUtils.damp(this.explodedProgress, this.targetExplodedProgress, 8, dt);
    if (this.activeModel) {
      this.activeModel.updateExploded(this.explodedProgress);
    }

    // Dynamic rotation & levitation logic
    if (this.activeModel) {
      if (this.currentProductId === 'sphere-one') {
        // Natural gentle levitation floating bob
        const sphereRoot = this.activeModel.group;
        sphereRoot.position.y = Math.sin(elapsedTime * 2.2) * 0.08;
      } else {
        this.activeModel.group.position.y = 0;
      }

      if (this.autoRotate || !this.isStudioMode) {
        // Gentle rotation in scroll mode or auto-rotate
        const idleSpeed = this.isStudioMode ? 0.6 : 0.25;
        this.activeModel.group.rotation.y += dt * idleSpeed;
      }
    }

    // Scroll Story Choreography when not in free OrbitControls Studio mode
    if (!this.isStudioMode) {
      this.updateScrollChoreography(elapsedTime, dt);
    } else {
      this.controls.update();
    }

    // Update soundwave visualizer ring
    this.updateVisualizerRing(elapsedTime);

    // Render frame
    this.renderer.render(this.scene, this.camera);
  }

  private updateScrollChoreography(time: number, dt: number) {
    const p = this.scrollProgress;

    // Choreograph Camera Waypoints based on scroll progress [0, 1]
    // 0.0 - 0.20: Hero introduction (clean front 3/4 beauty shot)
    // 0.20 - 0.45: Engineering & Diaphragm Macro (exploded view kicks in, camera gets intimate)
    // 0.45 - 0.70: Material Craftsmanship (wide side orbit, high reflections)
    // 0.70 - 0.85: Spatial Wave Stage (elevated cinematic view)
    // 0.85 - 1.00: Studio Ready / Showcase (settles into ready position)

    if (p < 0.22) {
      // Hero
      const localT = p / 0.22;
      _targetCamPos.set(
        Math.sin(localT * 0.4) * 1.5 + this.mouseParallax.x,
        1.5 + this.mouseParallax.y,
        4.8 - localT * 0.6
      );
      _targetLookAt.set(0, 1.35, 0);
      this.targetExplodedProgress = 0;
    } else if (p < 0.48) {
      // Architecture / Exploded Macro
      const localT = (p - 0.22) / 0.26;
      _targetCamPos.set(
        2.2 + this.mouseParallax.x,
        1.6 + localT * 0.4 + this.mouseParallax.y,
        3.2 - localT * 0.4
      );
      _targetLookAt.set(0.2, 1.4, 0);
      // Explode out to 0.75 in this section
      this.targetExplodedProgress = Math.sin(localT * Math.PI) * 0.85;
    } else if (p < 0.72) {
      // Craftsmanship & Finishes
      const localT = (p - 0.48) / 0.24;
      const angle = localT * Math.PI * 0.8;
      _targetCamPos.set(
        Math.cos(angle) * 3.6 + this.mouseParallax.x,
        1.7 + this.mouseParallax.y,
        Math.sin(angle) * 3.6
      );
      _targetLookAt.set(0, 1.3, 0);
      this.targetExplodedProgress = 0;
    } else if (p < 0.9) {
      // Spatial Soundstage
      const localT = (p - 0.72) / 0.18;
      _targetCamPos.set(
        0 + this.mouseParallax.x,
        2.4 + localT * 0.6 + this.mouseParallax.y,
        4.6
      );
      _targetLookAt.set(0, 1.2, 0);
      this.targetExplodedProgress = 0.15;
    } else {
      // Studio Showcase
      _targetCamPos.set(0 + this.mouseParallax.x, 1.6 + this.mouseParallax.y, 4.4);
      _targetLookAt.set(0, 1.3, 0);
    }

    // Exponentially damp camera position and lookAt
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _targetCamPos.x, 5, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _targetCamPos.y, 5, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _targetCamPos.z, 5, dt);

    _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _targetLookAt.x, 5, dt);
    _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _targetLookAt.y, 5, dt);
    _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _targetLookAt.z, 5, dt);

    this.camera.lookAt(_currentLookAt);
  }

  private updateVisualizerRing(time: number) {
    const posAttr = this.visualizerRing.geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const count = positions.length / 3;

    const baseRadius = 2.4;
    const amp = 0.08 + this.audioPulseAmplitude * 0.35;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const wave = Math.sin(angle * 8 + time * 6) * Math.cos(angle * 3 - time * 4) * amp;
      const r = baseRadius + wave;

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = 0.08 + Math.abs(wave) * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    posAttr.needsUpdate = true;
  }

  public setWireframe(enabled: boolean) {
    this.models.forEach((m) => {
      if (m.setWireframe) {
        m.setWireframe(enabled);
      }
    });
  }

  public setViewPreset(preset: 'front' | 'macro' | 'top' | 'isometric') {
    switch (preset) {
      case 'front':
        this.camera.position.set(0, 1.45, 4.2);
        this.controls.target.set(0, 1.35, 0);
        break;
      case 'macro':
        this.camera.position.set(1.5, 1.45, 2.2);
        this.controls.target.set(0.8, 1.4, 0);
        break;
      case 'top':
        this.camera.position.set(0, 4.8, 0.6);
        this.controls.target.set(0, 1.2, 0);
        break;
      case 'isometric':
        this.camera.position.set(3.2, 2.8, 3.8);
        this.controls.target.set(0, 1.3, 0);
        break;
    }
    this.controls.update();
  }

  public projectPointToScreen(coords: [number, number, number]): { x: number; y: number; visible: boolean } {
    const v = new THREE.Vector3(...coords);
    v.project(this.camera);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    const x = ((v.x + 1) * width) / 2;
    const y = ((-v.y + 1) * height) / 2;
    const visible = v.z < 1;

    return { x, y, visible };
  }

  public resetCamera() {
    this.camera.position.set(0, 1.6, 4.5);
    this.controls.target.set(0, 1.3, 0);
    this.controls.update();
  }

  public dispose() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);

    this.models.forEach((m) => m.dispose());
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
