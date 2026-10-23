export type ProductId = 'pulse-pro' | 'sphere-one' | 'core-prism';

export interface ProductFinish {
  id: string;
  name: string;
  hex: string;
  bodyColor: number;
  accentColor: number;
  cushionColor: number;
  roughness: number;
  metalness: number;
  description: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ProductHotspot {
  id: string;
  title: string;
  description: string;
  part: string;
  position: [number, number, number];
}

export interface Product {
  id: ProductId;
  name: string;
  subtitle: string;
  tagline: string;
  category: string;
  edition: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  architecturalOverview: string;
  features: string[];
  specs: { label: string; value: string; detail?: string }[];
  finishes: ProductFinish[];
  explodedParts: { name: string; material: string; function: string }[];
  hotspots: ProductHotspot[];
  accessories: AccessoryOption[];
}

export interface CartItem {
  product: Product;
  selectedFinish: ProductFinish;
  selectedAccessories: AccessoryOption[];
  engravingText?: string;
  quantity: number;
}

export type LightingPresetId = 'studio-dark' | 'warm-sunset' | 'cyber-neon' | 'lunar-white';

export interface LightingPreset {
  id: LightingPresetId;
  name: string;
  keyColor: number;
  keyIntensity: number;
  fillColor: number;
  fillIntensity: number;
  groundColor: number;
  ambientIntensity: number;
  fogColor: number;
  bgColor: string;
}
