import { Product, LightingPreset } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'pulse-pro',
    name: 'AURA Pulse Reference Pro',
    subtitle: 'Planar Magnetic Spatial Reference Studio Monitor',
    tagline: 'Engineered for Mastering Architects & Critical Audiophiles',
    category: 'Reference Acoustic Monitors',
    edition: 'Reference Master Series • Serialized Limited Production',
    price: 549,
    originalPrice: 649,
    rating: 4.96,
    reviewCount: 384,
    description: 'Developed over four years in our Kyoto acoustic labs. Featuring custom 70mm planar magnetic stators, ultra-thin 0.5-micron vapor-deposited diaphragms, and an acoustically decoupled unibody milled from a solid billet of aerospace-grade 6061-T6 aluminum.',
    architecturalOverview: 'Unlike conventional dynamic moving-coil transducers prone to cone break-up and phase smearing, the Pulse Reference Pro utilizes an isodynamic push-pull planar magnetic engine. Magnetic flux density of 1.45 Tesla is distributed uniformly across the entire diaphragm surface, yielding instantaneous transient speed and unmeasurable harmonic distortion below 0.03%.',
    features: [
      '70mm Nanoscale Isodynamic Planar Diaphragm (0.5µm Substrate)',
      'Symmetric Push-Pull Neodymium N52 Magnetic Stator Grid',
      'Acoustically Decoupled CNC Monolithic 6061-T6 Aluminum Chassis',
      'Lossless 24-bit / 192 kHz Wireless via Ultra-Wideband & LC3+ Audio',
      'Perforated Icelandic Lambskin Memory Foam Acoustic Cushions',
      'Individually Lab-Calibrated & Frequency-Matched to ±0.25 dB'
    ],
    specs: [
      { label: 'Transducer Architecture', value: '70mm Isodynamic Planar Magnetic', detail: '0.5µm vapor-deposited gold traces' },
      { label: 'Effective Frequency Band', value: '3 Hz – 54,000 Hz', detail: 'Harmonic extension beyond audible range' },
      { label: 'Nominal Impedance', value: '32 Ω @ 1 kHz', detail: 'Linear impedance curve across all octaves' },
      { label: 'Total Harmonic Distortion (THD)', value: '< 0.03% @ 1 kHz, 100 dB SPL', detail: 'Class-leading laboratory benchmark' },
      { label: 'Acoustic Principle', value: 'Semi-Open Diffuse Soundstage', detail: 'Eliminates ear cup internal standing pressure' },
      { label: 'Chassis Material', value: 'CNC 6061-T6 Aerospace Aluminum', detail: '5-Axis diamond-tool milled' },
      { label: 'Weight & Distribution', value: '380g (Optimized Ergonomic CG)', detail: 'Floating spring-steel tension headband' }
    ],
    finishes: [
      {
        id: 'matte-obsidian',
        name: 'Space Obsidian Black',
        hex: '#141417',
        bodyColor: 0x141417,
        accentColor: 0x38bdf8,
        cushionColor: 0x09090b,
        roughness: 0.28,
        metalness: 0.86,
        description: 'Micro-bead blasted matte black hard anodizing with laser-etched precision markings.'
      },
      {
        id: 'satin-titanium',
        name: 'Satin Titanium Gray',
        hex: '#787e87',
        bodyColor: 0x6e7682,
        accentColor: 0x94a3b8,
        cushionColor: 0x1c1e22,
        roughness: 0.22,
        metalness: 0.94,
        description: 'Natural grade-5 titanium finish with subtle satin directional grain.'
      },
      {
        id: 'champagne-gold',
        name: 'Champagne Warm Bronze',
        hex: '#c29d62',
        bodyColor: 0xb59257,
        accentColor: 0xf59e0b,
        cushionColor: 0x1f1d19,
        roughness: 0.24,
        metalness: 0.9,
        description: 'Vapor-deposited champagne bronze with hand-burnished highlights.'
      },
      {
        id: 'pure-platinum',
        name: 'Machined Billet Silver',
        hex: '#d6dbe1',
        bodyColor: 0xd0d6dc,
        accentColor: 0x0284c7,
        cushionColor: 0x2d343f,
        roughness: 0.16,
        metalness: 0.95,
        description: 'Raw diamond-cut CNC aluminum unibody with mirror-chamfered bevels.'
      }
    ],
    explodedParts: [
      { name: 'Outer Monolithic Acoustic Cup', material: '5-Axis CNC 6061-T6 Billet Aluminum', function: 'Structural damping & resonance suppression' },
      { name: 'Nanoscale Planar Diaphragm', material: '0.5µm Polyimide with Vapor-Gold Trace', function: 'Zero-inertia acoustic wave propulsion' },
      { name: 'Push-Pull Neodymium Stator Array', material: 'Matched N52 Rare-Earth Magnets', function: 'Linear 1.45 Tesla symmetrical magnetic field' },
      { name: 'Micro-Perforated Air Chamber Grill', material: 'Laser-Etched Stainless Steel 316L', function: 'Controlled back-pressure damping' },
      { name: 'Ergonomic Acoustic Cushions', material: 'Perforated Icelandic Lambskin & Memory Foam', function: 'Acoustic seal & thermal dissipation' }
    ],
    hotspots: [
      { id: 'h1', title: 'Planar Driver Array', description: '70mm nanoscale diaphragm with zero phase distortion', part: 'Planar Stator', position: [-1.4, 1.45, 0] },
      { id: 'h2', title: 'Rotary Volume Gimbal', description: 'Precision knurled 64-step logarithmic attenuator', part: 'Gimbal Dial', position: [-1.8, 1.45, 0] },
      { id: 'h3', title: 'Tension Headband Arch', description: 'Floating spring-steel band with memory-foam cradle', part: 'Headband', position: [0, 3.25, 0] },
      { id: 'h4', title: 'Perforated Acoustic Seal', description: 'Hand-stitched lambskin cushions for deep linear sub-bass', part: 'Acoustic Cushion', position: [1.4, 1.45, 0] }
    ],
    accessories: [
      { id: 'acc-cable', name: '4.4mm Pentaconn Balanced Pure Silver Cable (2.5m)', price: 149, description: '8-core OCC monocrystalline pure silver wire with rhodium-plated connectors.' },
      { id: 'acc-stand', name: 'Monolithic Billet Aluminum Desktop Stand', price: 119, description: 'Machined from solid aluminum with non-marking silicone resting cradle.' },
      { id: 'acc-case', name: 'Milled Hard-Shell Leather Travel Vault', price: 89, description: 'Water-resistant aluminum spine and ballistic nylon interior.' }
    ]
  },
  {
    id: 'sphere-one',
    name: 'AURA Sphere Acoustic Pod',
    subtitle: 'Active Magnetic Levitation Omnidirectional Transducer',
    tagline: 'Boundary-Free Point-Source Acoustic Dispersion',
    category: 'Spatial Architectural Acoustics',
    edition: 'Architectural Signature Series',
    price: 789,
    originalPrice: 899,
    rating: 4.98,
    reviewCount: 219,
    description: 'Suspended in zero friction by a closed-loop electromagnetic field, the AURA Sphere disperses sound in a true 360-degree spherical wavefront. Free from furniture boundary resonance and cabinet diffraction.',
    architecturalOverview: 'Traditional loudspeaker cabinets introduce cabinet coloration through cabinet diffraction and mechanical coupling into the supporting table. By levitating the entire transducer sphere in mid-air via an active PID electromagnetic coil array, mechanical vibration transfer is literally 0.00%.',
    features: [
      'Active Closed-Loop Electromagnetic Levitation Suspended at 24mm',
      '360° Spherical Point-Source Wavefront Propagation',
      'Dual Opposed Titanium High-Frequency Diffusers',
      '140W Bi-Amplified Ultra-Low-Noise Class-D Hybrid Core',
      'Capacitive Sapphire Crystal Optical Touch Interface',
      'Continuous Laser Room Mapping & Acoustic Phase Alignment'
    ],
    specs: [
      { label: 'Continuous Output Power', value: '140W RMS (2x 70W Bi-Amp)', detail: 'Ultra-low THD+N < 0.005%' },
      { label: 'Levitation Air Gap', value: '24mm Magnetic Suspension', detail: 'Real-time 1,000Hz magnetic PID loop' },
      { label: 'Dispersion Characteristic', value: 'True 360° Spherical Isotropic', detail: 'Zero sweet-spot restriction' },
      { label: 'Signal-to-Noise Ratio (SNR)', value: '> 112 dB (A-Weighted)', detail: 'Near-zero noise floor' },
      { label: 'Base Stator Billet', value: 'Machined Solid C360 Brass & Aluminum', detail: 'Concentric cooling heat sink' },
      { label: 'Sphere Enclosure', value: 'Acoustic Resin & Ceramic Composite', detail: 'Zero mechanical cavity ringing' }
    ],
    finishes: [
      {
        id: 'matte-obsidian',
        name: 'Obsidian Black & Gunmetal',
        hex: '#141417',
        bodyColor: 0x181c22,
        accentColor: 0x38bdf8,
        cushionColor: 0x0f172a,
        roughness: 0.22,
        metalness: 0.88,
        description: 'Satin graphite shell with subtle electric cyan flux illumination ring.'
      },
      {
        id: 'champagne-gold',
        name: 'Cast Brass & Architectural Bronze',
        hex: '#c29d62',
        bodyColor: 0xbda065,
        accentColor: 0xf59e0b,
        cushionColor: 0x1f1912,
        roughness: 0.26,
        metalness: 0.92,
        description: 'Solid machined brass stator base with warm burnished champagne orb.'
      },
      {
        id: 'pure-platinum',
        name: 'Ceramic White & Polished Chrome',
        hex: '#edf0f4',
        bodyColor: 0xe6e9ee,
        accentColor: 0x0284c7,
        cushionColor: 0x334155,
        roughness: 0.12,
        metalness: 0.84,
        description: 'High-density glazed acoustic ceramic with diamond-polished aluminum.'
      }
    ],
    explodedParts: [
      { name: 'Sapphire Crystal Touch Disc', material: 'Synthetic Monocrystalline Sapphire', function: 'Capacitive gestures & optical refractive clarity' },
      { name: 'High-Frequency Diffuser Dome', material: 'Inverted Beryllium-Coated Titanium', function: 'Phase-aligned 360-degree acoustic spreading' },
      { name: 'Central Acoustic Dispersion Core', material: 'Aero-Finned Duralumin Heatsink Stack', function: 'Linear laminar airflow & wave directivity' },
      { name: 'Neodymium Levitation Core', material: 'High-Coercivity N52 Magnet Array', function: 'Repulsive magnetic floatation matrix' },
      { name: 'Stator Electromagnetic Base', material: 'Heavy Brass & Solid Milled Billet', function: 'Ground stabilization & electromagnetic field' }
    ],
    hotspots: [
      { id: 'h1', title: 'Sapphire Interface', description: 'Capacitive touch surface with edge-lit optical feedback', part: 'Touch Disc', position: [0, 2.9, 0] },
      { id: 'h2', title: 'Diffuser Aero-Fin Stack', description: 'Directs soundwaves outward without boundary diffraction', part: 'Core Fin Stack', position: [0, 1.85, 0] },
      { id: 'h3', title: 'Magnetic Air Gap', description: '24mm frictionless levitation field with PID alignment', part: 'Levitation Gap', position: [0, 1.0, 0] },
      { id: 'h4', title: 'Machined Stator Base', description: 'Solid billet foundation with brass acoustic decoupling cones', part: 'Base Platform', position: [0, 0.35, 0] }
    ],
    accessories: [
      { id: 'acc-base', name: 'Carved Black Walnut Acoustic Pedestal', price: 169, description: 'Hand-finished sustainable American black walnut base riser.' },
      { id: 'acc-adapter', name: 'Gold-Plated Optical/TOSLINK Studio Bridge', price: 79, description: 'Bit-perfect optical interconnect with braided Kevlar sleeve.' }
    ]
  },
  {
    id: 'core-prism',
    name: 'AURA Core Prism Studio Console',
    subtitle: 'Tactile Spatial Audio Synthesizer & DAW Matrix Engine',
    tagline: 'Master Studio Tactility Milled from Aerospace Monolith',
    category: 'Master Audio Hardware',
    edition: 'Master Production Suite • Studio Calibration',
    price: 469,
    originalPrice: 549,
    rating: 4.93,
    reviewCount: 268,
    description: 'Precision physical hardware interface designed for tactile spatial positioning, parameter automation, and lossless multi-channel DAW mixing. Featuring 12 polyphonic aftertouch silicon cells and endless optical encoders.',
    architecturalOverview: 'Touchscreens lack muscle-memory and physical resistance. Core Prism delivers calibrated physical detents and polyphonic aftertouch pressure, allowing audio engineers to sculpt spatial coordinates without looking away from the acoustic image.',
    features: [
      '12 Polyphonic Haptic Pressure Velocity Cells with RGB Matrix',
      'Dual Continuous Optical CNC Rotary Encoders (1,024 ticks/rev)',
      'Solid Refractive K9 Optical Glass Dispersion Visualizer Prism',
      'Dual 1/4" Balanced Neutrik Gold-Plated TRS Outputs',
      'Native Precision Integration with Ableton, Logic Pro, and Pro Tools',
      'Precision Angled Wedge Profile (14° Ergonomic Desktop Pitch)'
    ],
    specs: [
      { label: 'Pad Matrix Array', value: '12 Velocity & Polyphonic Aftertouch Cells', detail: '0.1g pressure threshold trigger' },
      { label: 'Rotary Encoders', value: '2x 360° Endless CNC Optical Dials', detail: 'Integrated push-switch click action' },
      { label: 'Display & Visualizer', value: 'Solid K9 Refractive Optical Prism', detail: 'Hardware audio spectrum dispersion' },
      { label: 'Audio Circuitry', value: 'Dual 1/4" TRS Gold Balanced Line Out', detail: 'Differential op-amp output stage' },
      { label: 'Latency', value: '< 0.8ms Round-Trip MIDI 2.0 / USB-C', detail: 'Ultra-high-speed polling' },
      { label: 'Enclosure Billet', value: 'Monolithic 6061 Aluminum Unibody', detail: '14-degree ergonomic desktop rake' }
    ],
    finishes: [
      {
        id: 'matte-obsidian',
        name: 'Master Anodized Black',
        hex: '#141417',
        bodyColor: 0x14161a,
        accentColor: 0xa855f7,
        cushionColor: 0x1e2129,
        roughness: 0.25,
        metalness: 0.85,
        description: 'Deep black satin anodized chassis with violet calibrated cell glow.'
      },
      {
        id: 'satin-titanium',
        name: 'Industrial Gunmetal Slate',
        hex: '#475569',
        bodyColor: 0x333b47,
        accentColor: 0x38bdf8,
        cushionColor: 0x1a212d,
        roughness: 0.2,
        metalness: 0.9,
        description: 'Studio gunmetal enclosure with crisp ice-cyan status indicators.'
      },
      {
        id: 'pure-platinum',
        name: 'Natural Machine Aluminum',
        hex: '#d6dbe1',
        bodyColor: 0xd6dce2,
        accentColor: 0x10b981,
        cushionColor: 0x334155,
        roughness: 0.16,
        metalness: 0.94,
        description: 'Raw brushed aerospace finish with precision emerald status lighting.'
      }
    ],
    explodedParts: [
      { name: 'K9 Optical Dispersion Glass Prism', material: 'Precision Cut Optical Float Glass', function: 'Light wave refraction & audio spectrum visualizer' },
      { name: '12-Cell Silicone Tactile Matrix', material: 'High-Density Conductive Silicone', function: 'Polyphonic aftertouch velocity sensing' },
      { name: 'Dual Knurled CNC Rotary Dials', material: 'Aerospace Billet Aluminum', function: 'High-resolution parameter modulation' },
      { name: 'Multi-Layer High-Speed PCB', material: 'Gold-Plated Immersion (ENIG) Board', function: 'Sub-millisecond signal processing' },
      { name: 'Unibody Beveled Chassis Base', material: 'CNC Monolithic Aluminum Block', function: 'Mechanical weight & vibration isolation' }
    ],
    hotspots: [
      { id: 'h1', title: 'K9 Optical Prism', description: 'Dispersion prism converts frequency spectrum into visual light', part: 'Optical Prism', position: [0.92, 1.15, -0.4] },
      { id: 'h2', title: 'Polyphonic Cells', description: '12 responsive silicon pads for dynamic spatial automation', part: 'Haptic Pads', position: [-0.4, 1.0, 0.1] },
      { id: 'h3', title: 'Dual Optical Dials', description: 'CNC diamond-knurled dials with 1,024 ticks per rotation', part: 'Encoders', position: [0.92, 1.05, 0.4] },
      { id: 'h4', title: 'Gold TRS Ports', description: 'Studio-grade balanced 1/4" analog audio outputs', part: 'Audio Jacks', position: [-0.4, 0.85, -0.96] }
    ],
    accessories: [
      { id: 'acc-deck', name: 'Precision Molded Polycarbonate Decksaver', price: 49, description: 'Impact-resistant smoked transparent dust and transport cover.' },
      { id: 'acc-usb', name: 'Braided Right-Angle Studio USB-C Cable (3m)', price: 35, description: 'Double-shielded high-speed audiophile data cable.' }
    ]
  }
];

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio-dark',
    name: 'Obsidian Reference',
    keyColor: 0xffffff,
    keyIntensity: 2.2,
    fillColor: 0x94a3b8,
    fillIntensity: 0.7,
    groundColor: 0x090a0d,
    ambientIntensity: 0.35,
    fogColor: 0x090a0d,
    bgColor: '#090a0d'
  },
  {
    id: 'warm-sunset',
    name: 'Warm Acoustic Gallery',
    keyColor: 0xffe6c2,
    keyIntensity: 2.4,
    fillColor: 0xd97706,
    fillIntensity: 0.9,
    groundColor: 0x14100c,
    ambientIntensity: 0.4,
    fogColor: 0x120e0a,
    bgColor: '#120e0a'
  },
  {
    id: 'cyber-neon',
    name: 'Precision Ice Cyan',
    keyColor: 0xe0f2fe,
    keyIntensity: 2.4,
    fillColor: 0x0284c7,
    fillIntensity: 1.0,
    groundColor: 0x080c14,
    ambientIntensity: 0.45,
    fogColor: 0x070b12,
    bgColor: '#070b12'
  },
  {
    id: 'lunar-white',
    name: 'Clean CAD Studio',
    keyColor: 0xffffff,
    keyIntensity: 2.0,
    fillColor: 0xcbd5e1,
    fillIntensity: 0.85,
    groundColor: 0x111620,
    ambientIntensity: 0.5,
    fogColor: 0x0f141e,
    bgColor: '#0f141e'
  }
];
