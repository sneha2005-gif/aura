import * as THREE from 'three';
import { ProductFinish } from '../../types';
import {
  createContactShadowTexture,
  createKnurledTexture,
  createRadialBrushedTexture
} from '../proceduralTextures';
import { ModelWrapper } from './headphonesModel';

export function createSynthModel(): ModelWrapper {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SynthRoot';

  // Grounding contact shadow plane
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02;
  rootGroup.add(shadowMesh);

  const knurlTex = createKnurledTexture();
  const radialTex = createRadialBrushedTexture();

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x14161a,
    roughness: 0.24,
    metalness: 0.85,
    bumpMap: radialTex,
    bumpScale: 0.002
  });

  const padMat = new THREE.MeshStandardMaterial({
    color: 0x222630,
    roughness: 0.7,
    metalness: 0.1
  });

  const knobMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.25,
    metalness: 0.9,
    bumpMap: knurlTex,
    bumpScale: 0.02
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.15,
    metalness: 0.95
  });

  const ledMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.92,
    transparent: true,
    opacity: 0.88,
    ior: 1.6,
    clearcoat: 1.0
  });

  const explodedParts: {
    object: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeOffset: THREE.Vector3;
  }[] = [];

  const synthRig = new THREE.Group();
  synthRig.position.y = 0.8;
  synthRig.rotation.x = 0.28; // ergonomic incline towards camera
  rootGroup.add(synthRig);

  // 1. Unibody CNC Aluminum Chassis
  const chassisGeo = new THREE.BoxGeometry(2.6, 0.32, 1.9);
  const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
  synthRig.add(chassisMesh);

  // 2. Internal Circuit Board Plate
  const pcbGeo = new THREE.BoxGeometry(2.4, 0.04, 1.7);
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.4,
    metalness: 0.5
  });
  const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
  pcbMesh.position.y = 0.16;
  synthRig.add(pcbMesh);
  explodedParts.push({
    object: pcbMesh,
    basePos: pcbMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0.3, 0)
  });

  // 3. 12 Haptic RGB Pads (4 columns x 3 rows)
  const padGroup = new THREE.Group();
  const padGeo = new THREE.BoxGeometry(0.38, 0.08, 0.38);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const x = (col - 1.5) * 0.48 - 0.25;
      const z = (row - 1.0) * 0.48 + 0.12;
      const padMesh = new THREE.Mesh(padGeo, padMat);
      padMesh.position.set(x, 0.2, z);
      padGroup.add(padMesh);
    }
  }
  synthRig.add(padGroup);
  explodedParts.push({
    object: padGroup,
    basePos: padGroup.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0.7, 0)
  });

  // 4. Optical Spectrum Glass Prism (Center right or top center)
  const prismGeo = new THREE.CylinderGeometry(0.28, 0.38, 0.45, 3);
  const prismMesh = new THREE.Mesh(prismGeo, glassMat);
  prismMesh.position.set(0.92, 0.36, -0.4);
  prismMesh.rotation.y = Math.PI / 6;
  synthRig.add(prismMesh);
  explodedParts.push({
    object: prismMesh,
    basePos: prismMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 1.25, 0)
  });

  // LED Glow under the prism
  const prismLedGeo = new THREE.RingGeometry(0.08, 0.26, 24);
  prismLedGeo.rotateX(-Math.PI / 2);
  const prismLedMesh = new THREE.Mesh(prismLedGeo, ledMat);
  prismLedMesh.position.set(0.92, 0.17, -0.4);
  synthRig.add(prismLedMesh);

  // 5. Dual CNC Knurled Rotary Encoders
  const knobGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 24);
  for (let k = 0; k < 2; k++) {
    const kMesh = new THREE.Mesh(knobGeo, knobMat);
    const kz = 0.15 + k * 0.52;
    kMesh.position.set(0.92, 0.26, kz);
    synthRig.add(kMesh);

    // Indicator dot
    const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const dotMesh = new THREE.Mesh(dotGeo, ledMat);
    dotMesh.position.set(0.92 + 0.12, 0.38, kz);
    synthRig.add(dotMesh);

    explodedParts.push({
      object: kMesh,
      basePos: kMesh.position.clone(),
      explodeOffset: new THREE.Vector3(0, 0.85, 0)
    });
    explodedParts.push({
      object: dotMesh,
      basePos: dotMesh.position.clone(),
      explodeOffset: new THREE.Vector3(0, 0.85, 0)
    });
  }

  // 6. Rear Gold Audio Jacks
  for (let j = 0; j < 3; j++) {
    const jackGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16);
    jackGeo.rotateX(Math.PI / 2);
    const jackMesh = new THREE.Mesh(jackGeo, goldMat);
    jackMesh.position.set(-0.8 + j * 0.45, 0.06, -0.96);
    synthRig.add(jackMesh);
  }

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
      chassisMat.color.setHex(finish.bodyColor);
      chassisMat.roughness = finish.roughness;
      chassisMat.metalness = finish.metalness;

      padMat.color.setHex(finish.cushionColor);
      ledMat.color.setHex(finish.accentColor);
    },
    setWireframe: (wireframe: boolean) => {
      chassisMat.wireframe = wireframe;
      padMat.wireframe = wireframe;
      knobMat.wireframe = wireframe;
      goldMat.wireframe = wireframe;
      pcbMat.wireframe = wireframe;
    },
    dispose: () => {
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      knurlTex.dispose();
      radialTex.dispose();
      chassisMat.dispose();
      padMat.dispose();
      knobMat.dispose();
      goldMat.dispose();
      ledMat.dispose();
      glassMat.dispose();
      pcbMat.dispose();
      chassisGeo.dispose();
      pcbGeo.dispose();
      padGeo.dispose();
      prismGeo.dispose();
      knobGeo.dispose();
    }
  };
}
