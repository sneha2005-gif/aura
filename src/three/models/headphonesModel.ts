import * as THREE from 'three';
import { ProductFinish } from '../../types';
import {
  createContactShadowTexture,
  createGrillTexture,
  createKnurledTexture,
  createRadialBrushedTexture
} from '../proceduralTextures';

export interface ModelWrapper {
  group: THREE.Group;
  updateExploded: (progress: number) => void;
  updateFinish: (finish: ProductFinish) => void;
  setWireframe?: (wireframe: boolean) => void;
  dispose: () => void;
}

export function createHeadphonesModel(): ModelWrapper {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'HeadphonesRoot';

  // Grounding contact shadow plane flush at ground level
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false
  });
  const shadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02; // prevent z-fight with floor
  rootGroup.add(shadowMesh);

  // Textures
  const grillTex = createGrillTexture();
  const knurlTex = createKnurledTexture();
  const radialTex = createRadialBrushedTexture();

  // Materials with PBR properties
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.22,
    metalness: 0.88,
    bumpMap: radialTex,
    bumpScale: 0.003
  });

  const accentMetalMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.15,
    metalness: 0.95
  });

  const knurlMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.35,
    metalness: 0.85,
    bumpMap: knurlTex,
    bumpScale: 0.02
  });

  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c0e,
    roughness: 0.85,
    metalness: 0.05
  });

  const ledMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  const driverMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9,
    map: grillTex
  });

  const grillMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.4,
    metalness: 0.6,
    map: grillTex
  });

  // Track parts for exploded view
  const explodedParts: {
    object: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeOffset: THREE.Vector3;
  }[] = [];

  const mainRig = new THREE.Group();
  mainRig.position.y = 1.9; // Pivot above ground so bottom of cushions rests naturally
  rootGroup.add(mainRig);

  // 1. Outer Headband Arch
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.45, -0.4, 0),
    new THREE.Vector3(-1.3, 0.5, 0),
    new THREE.Vector3(-0.8, 1.25, 0),
    new THREE.Vector3(0, 1.45, 0),
    new THREE.Vector3(0.8, 1.25, 0),
    new THREE.Vector3(1.3, 0.5, 0),
    new THREE.Vector3(1.45, -0.4, 0)
  ]);
  const headbandGeo = new THREE.TubeGeometry(curve, 48, 0.08, 12, false);
  const headbandMesh = new THREE.Mesh(headbandGeo, metalMat);
  mainRig.add(headbandMesh);

  // 2. Inner Padded Headband Cushion
  const innerCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.95, 0.95, 0),
    new THREE.Vector3(-0.5, 1.28, 0),
    new THREE.Vector3(0, 1.36, 0),
    new THREE.Vector3(0.5, 1.28, 0),
    new THREE.Vector3(0.95, 0.95, 0)
  ]);
  const innerBandGeo = new THREE.TubeGeometry(innerCurve, 32, 0.12, 12, false);
  const innerBandMesh = new THREE.Mesh(innerBandGeo, cushionMat);
  mainRig.add(innerBandMesh);

  explodedParts.push({
    object: headbandMesh,
    basePos: headbandMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0.45, 0)
  });
  explodedParts.push({
    object: innerBandMesh,
    basePos: innerBandMesh.position.clone(),
    explodeOffset: new THREE.Vector3(0, 0.35, 0)
  });

  // Function to create earcup stack (left: side = -1, right: side = 1)
  function createEarcup(side: number) {
    const xBase = side * 1.55;

    // Yoke bracket
    const yokeGeo = new THREE.TorusGeometry(0.78, 0.045, 8, 24, Math.PI * 0.9);
    const yokeMesh = new THREE.Mesh(yokeGeo, accentMetalMat);
    yokeMesh.rotation.z = side > 0 ? -Math.PI * 0.45 : Math.PI * 0.55;
    yokeMesh.rotation.y = Math.PI / 2;
    yokeMesh.position.set(side * 1.48, -0.25, 0);
    mainRig.add(yokeMesh);

    // Outer Anodized Earcup Housing
    const cupOuterGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.35, 36);
    cupOuterGeo.rotateZ(Math.PI / 2);
    const cupMesh = new THREE.Mesh(cupOuterGeo, metalMat);
    cupMesh.position.set(xBase, -0.45, 0);
    mainRig.add(cupMesh);
    explodedParts.push({
      object: cupMesh,
      basePos: cupMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 0.35, 0, 0)
    });

    // Rotary Dial on outer face
    const dialGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 24);
    dialGeo.rotateZ(Math.PI / 2);
    const dialMesh = new THREE.Mesh(dialGeo, knurlMat);
    dialMesh.position.set(xBase + side * 0.22, -0.45, 0);
    mainRig.add(dialMesh);
    explodedParts.push({
      object: dialMesh,
      basePos: dialMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 0.65, 0, 0)
    });

    // LED Ring Accent
    const ledGeo = new THREE.TorusGeometry(0.74, 0.02, 8, 36);
    ledGeo.rotateY(Math.PI / 2);
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(xBase - side * 0.02, -0.45, 0);
    mainRig.add(ledMesh);
    explodedParts.push({
      object: ledMesh,
      basePos: ledMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 0.45, 0, 0)
    });

    // Planar Driver Magnet & Coil Disc
    const driverGeo = new THREE.CylinderGeometry(0.64, 0.64, 0.05, 32);
    driverGeo.rotateZ(Math.PI / 2);
    const driverMesh = new THREE.Mesh(driverGeo, driverMat);
    driverMesh.position.set(xBase - side * 0.12, -0.45, 0);
    mainRig.add(driverMesh);
    explodedParts.push({
      object: driverMesh,
      basePos: driverMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 0.9, 0, 0)
    });

    // Laser Perforated Acoustic Grill
    const grillPlateGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.04, 32);
    grillPlateGeo.rotateZ(Math.PI / 2);
    const grillMesh = new THREE.Mesh(grillPlateGeo, grillMat);
    grillMesh.position.set(xBase - side * 0.2, -0.45, 0);
    mainRig.add(grillMesh);
    explodedParts.push({
      object: grillMesh,
      basePos: grillMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 1.3, 0, 0)
    });

    // Ergonomic Memory-Foam Ear Cushion
    const cushionGeo = new THREE.TorusGeometry(0.62, 0.22, 16, 32);
    cushionGeo.rotateY(Math.PI / 2);
    const cushionMesh = new THREE.Mesh(cushionGeo, cushionMat);
    cushionMesh.position.set(xBase - side * 0.32, -0.45, 0);
    mainRig.add(cushionMesh);
    explodedParts.push({
      object: cushionMesh,
      basePos: cushionMesh.position.clone(),
      explodeOffset: new THREE.Vector3(side * 1.8, 0, 0)
    });
  }

  createEarcup(-1);
  createEarcup(1);

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
      metalMat.color.setHex(finish.bodyColor);
      metalMat.roughness = finish.roughness;
      metalMat.metalness = finish.metalness;

      accentMetalMat.color.setHex(finish.bodyColor);
      cushionMat.color.setHex(finish.cushionColor);
      ledMat.color.setHex(finish.accentColor);
    },
    setWireframe: (wireframe: boolean) => {
      metalMat.wireframe = wireframe;
      accentMetalMat.wireframe = wireframe;
      knurlMat.wireframe = wireframe;
      cushionMat.wireframe = wireframe;
      driverMat.wireframe = wireframe;
      grillMat.wireframe = wireframe;
    },
    dispose: () => {
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      grillTex.dispose();
      knurlTex.dispose();
      radialTex.dispose();
      metalMat.dispose();
      accentMetalMat.dispose();
      knurlMat.dispose();
      cushionMat.dispose();
      ledMat.dispose();
      driverMat.dispose();
      grillMat.dispose();
      headbandGeo.dispose();
      innerBandGeo.dispose();
    }
  };
}
