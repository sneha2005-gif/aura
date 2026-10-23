import { useEffect, useRef } from 'react';
import { SceneManager } from '../three/sceneManager';
import { ProductFinish, ProductId, LightingPresetId } from '../types';
import { soundFx } from '../utils/audioEngine';

interface ThreeCanvasProps {
  productId: ProductId;
  selectedFinish: ProductFinish;
  lightingPreset: LightingPresetId;
  scrollProgress: number;
  isStudioMode: boolean;
  explodedProgress: number;
  autoRotate: boolean;
  wireframe?: boolean;
  onSceneReady?: (sceneManager: SceneManager) => void;
}

export function ThreeCanvas({
  productId,
  selectedFinish,
  lightingPreset,
  scrollProgress,
  isStudioMode,
  explodedProgress,
  autoRotate,
  wireframe = false,
  onSceneReady
}: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // Initialize WebGL scene once
  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new SceneManager({
      container: mountRef.current
    });
    sceneManagerRef.current = manager;

    // Connect Web Audio visualizer pulse to scene manager
    soundFx.setAmplitudeCallback((amp) => {
      manager.setAudioAmplitude(amp);
    });

    if (onSceneReady) {
      onSceneReady(manager);
    }

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Update product model & finish
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setProduct(productId, selectedFinish);
    }
  }, [productId, selectedFinish]);

  // Update lighting preset
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setLightingPreset(lightingPreset);
    }
  }, [lightingPreset]);

  // Update scroll choreography
  useEffect(() => {
    if (sceneManagerRef.current && !isStudioMode) {
      sceneManagerRef.current.setScrollProgress(scrollProgress);
    }
  }, [scrollProgress, isStudioMode]);

  // Update studio mode
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setStudioMode(isStudioMode);
    }
  }, [isStudioMode]);

  // Update exploded view slider in studio mode
  useEffect(() => {
    if (sceneManagerRef.current && isStudioMode) {
      sceneManagerRef.current.setExplodedProgress(explodedProgress);
    }
  }, [explodedProgress, isStudioMode]);

  // Update auto rotate
  useEffect(() => {
    if (sceneManagerRef.current && isStudioMode) {
      sceneManagerRef.current.setAutoRotate(autoRotate);
    }
  }, [autoRotate, isStudioMode]);

  // Update wireframe mode
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setWireframe(wireframe);
    }
  }, [wireframe]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-auto"
      style={{
        cursor: isStudioMode ? 'grab' : 'default'
      }}
    />
  );
}
