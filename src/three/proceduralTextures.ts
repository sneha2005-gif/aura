import * as THREE from 'three';

/**
 * Creates a soft radial contact shadow texture for ground contact grounding.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.48
  );

  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.6)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.06)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a laser-perforated acoustic grill texture with hexagonal/radial mic holes.
 */
export function createGrillTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1c20';
  ctx.fillRect(0, 0, size, size);

  // Concentric perforated holes
  const cx = size / 2;
  const cy = size / 2;
  const rings = 18;

  ctx.fillStyle = '#060608';
  for (let r = 1; r <= rings; r++) {
    const radius = (r / rings) * (size * 0.44);
    const count = Math.floor(r * 5.8);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Golden planar coil serpentine trace at center
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 8; a += 0.1) {
    const spiralR = 12 + a * 3;
    const sx = cx + Math.cos(a) * spiralR;
    const sy = cy + Math.sin(a) * spiralR;
    if (a === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates a knurled metal bump texture for volume dials and rotary knobs.
 */
export function createKnurledTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Diamond cross-hatch
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 3;

  for (let x = -size; x < size * 2; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, size);
    ctx.lineTo(x + size, 0);
    ctx.stroke();
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (let x = -size; x < size * 2; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x + 2, 0);
    ctx.lineTo(x + size + 2, size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2);
  return texture;
}

/**
 * Creates a radial brushed metal normal/roughness map for dials and outer bevels.
 */
export function createRadialBrushedTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e2025';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const rays = 360;

  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const alpha = 0.05 + Math.random() * 0.12;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
    ctx.lineTo(cx + Math.cos(angle) * (size * 0.48), cy + Math.sin(angle) * (size * 0.48));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
