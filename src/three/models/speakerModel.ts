import * as THREE from 'three';
import { ProductFinish } from '../../types';
import {
  createContactShadowTexture,
  createKnurledTexture,
  createRadialBrushedTexture
} from '../proceduralTextures';
import { ModelWrapper } from './headphonesModel';

export function createSpeakerModel(): ModelWrapper {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SpeakerRoot';

  // Grounding contact shadow plane
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  });
  const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02;
  rootGroup.add(shadowMesh);

  const knurlTex = createKnurledTexture();
  const radialTex = createRadialBrushedTexture();

  // PBR Materials
  const baseMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1f242d,
    roughness: 0.2,
    metalness: 0.88,
    bumpMap: radialTex,
    bumpScale: 0.003
  });

  const knurlMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.35,
    metalness: 0.85,
    bumpMap: knurlTex,
    bumpScale: 0.02
  });

  const brassFootMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.15,
    metalness: 0.95
  });

  const sphereShellMat = new THREE.MeshStandardMaterial({
    color: 0x1f242d,
    roughness: 0.18,
    metalness: 0.85
  });

  const coreAcousticMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
    metalness: 0.7
  });

  const ledMat = new THREE.MeshBasicMaterial({
    color: 0x00f2fe
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    transparent: true,
    opacity: 0.85,
    ior: 1.52,
    clearcoat: 1.0
  });

  const explodedParts: {
    object: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeOffset: THREE.Vector3;
  }[] = [];

  // 1. Base Platform Stand
  const baseGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.28, 48);
  const baseMesh = new THREE.Mesh(baseGeo, baseMetalMat);
  baseMesh.position.y = 0.32;
  rootGroup.add(baseMesh);

  // Knurled perimeter rim
  const baseRimGeo = new THREE.CylinderGeometry(1.51, 1.51, 0.18, 48);
  const baseRimMesh = new THREE.Mesh(baseRimGeo, knurlMat);
  baseRimMesh.position.y = 0.32;
  rootGroup.add(baseRimMesh);

  // 3 Brass acoustic isolation feet
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const footGeo = new THREE.ConeGeometry(0.12, 0.22, 16);
    footGeo.rotateX(Math.PI);
    const footMesh = new THREE.Mesh(footGeo, brassFootMat);
    footMesh.position.set(Math.cos(angle) * 1.25, 0.11, Math.sin(angle) * 1.25);
    rootGroup.add(footMesh);
  }

  // Base magnetic emitter ring & glowing halo
  const emitterRingGeo = new THREE.TorusGeometry(0.9, 0.035, 12, 48);
  emitterRingGeo.rotateX(Math.PI / 2);
  const emitterRingMesh = new THREE.Mesh(emitterRingGeo, ledMat);
  emitterRingMesh.position.y = 0.48;
  rootGroup.add(emitterRingMesh);

  // 2. Levitating Pod Assembly (floats above base at y = 1.85)
  const podRig = new THREE.Group();
  podRig.position.y = 1.85;
  rootGroup.add(podRig);

  // Lower Acoustic Hemisphere Shell
  const lowerShellGeo = new THREE.SphereGeometry(1.05, 36, 18, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.48);
  const lowerShellMesh = new THREE.Mesh(lowerShellGeo, sphereShellMat);
  lowerShellMesh.position.y = 0;
  podRig.add(lowerShellMesh);
  explodedParts.push({
    object: lowerShellMesh,
    basePos: lowerShellMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, -0.65, 0)
  });

  // Central Wavefield Dispersion Core (Concentric Aero-fin stack)
  const coreStack = new THREE.Group();
  for (let f = -2; f <= 2; f++) {
    const r = 0.95 - Math.abs(f) * 0.15;
    const finGeo = new THREE.CylinderGeometry(r, r, 0.04, 36);
    const finMesh = new THREE.Mesh(finGeo, coreAcousticMat);
    finMesh.position.y = f * 0.12;
    coreStack.add(finMesh);
  }
  podRig.add(coreStack);
  explodedParts.push({
    object: coreStack,
    basePos: coreStack.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0, 0)
  });

  // Internal LED Glow Core
  const coreLightGeo = new THREE.SphereGeometry(0.35, 24, 24);
  const coreLightMesh = new THREE.Mesh(coreLightGeo, ledMat);
  podRig.add(coreLightMesh);

  // Upper Acoustic Hemisphere Shell
  const upperShellGeo = new THREE.SphereGeometry(1.05, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.46);
  const upperShellMesh = new THREE.Mesh(upperShellGeo, sphereShellMat);
  upperShellMesh.position.y = 0;
  podRig.add(upperShellMesh);
  explodedParts.push({
    object: upperShellMesh,
    basePos: upperShellMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0.75, 0)
  });

  // Sapphire Glass Capacitive Top Disc
  const glassTopGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 36);
  const glassTopMesh = new THREE.Mesh(glassTopGeo, glassMat);
  glassTopMesh.position.y = 1.05;
  podRig.add(glassTopMesh);
  explodedParts.push({
    object: glassTopMesh,
    basePos: glassTopMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 1.4, 0)
  });

  // Illuminated Ring around Glass Top
  const topRingGeo = new THREE.TorusGeometry(0.56, 0.015, 8, 36);
  topRingGeo.rotateX(Math.PI / 2);
  const topRingMesh = new THREE.Mesh(topRingGeo, ledMat);
  topRingMesh.position.y = 1.05;
  podRig.add(topRingMesh);
  explodedParts.push({
    object: topRingMesh,
    basePos: topRingMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 1.4, 0)
  });

  return {
    group: rootGroup,
    updateExploded: (progress: number) => {
      explodedParts.forEach(({ object, basePos, explodeOffset }) => {
        object.position.x = basePos.x + explodeOffset.x * progress;
        object.position.y = basePos.y + explodeOffset.y * progress;
        object.position.z = basePos.z + explodeOffset.z * progress;
      });
    },
    updateFinish: (finish: ProductFinish) => {
      sphereShellMat.color.setHex(finish.bodyColor);
      sphereShellMat.roughness = finish.roughness;
      sphereShellMat.metalness = finish.metalness;

      baseMetalMat.color.setHex(finish.bodyColor);
      ledMat.color.setHex(finish.accentColor);
    },
    setWireframe: (wireframe: boolean) => {
      sphereShellMat.wireframe = wireframe;
      baseMetalMat.wireframe = wireframe;
      knurlMat.wireframe = wireframe;
      brassFootMat.wireframe = wireframe;
      coreAcousticMat.wireframe = wireframe;
    },
    dispose: () => {
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      knurlTex.dispose();
      radialTex.dispose();
      baseMetalMat.dispose();
      knurlMat.dispose();
      brassFootMat.dispose();
      sphereShellMat.dispose();
      coreAcousticMat.dispose();
      ledMat.dispose();
      glassMat.dispose();
      baseGeo.dispose();
      baseRimGeo.dispose();
      lowerShellGeo.dispose();
      upperShellGeo.dispose();
      glassTopGeo.dispose();
    }
  };
}
