import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  Sliders,
  Award,
  Zap,
  Info,
  Radio
} from 'lucide-react';
import { Product, ProductFinish, ProductId, AccessoryOption } from '../types';
import { soundFx } from '../utils/audioEngine';

interface ScrollSectionsProps {
  products: Product[];
  currentProduct: Product;
  selectedFinish: ProductFinish;
  onSelectFinish: (finish: ProductFinish) => void;
  onSelectProduct: (id: ProductId) => void;
  onAddToCart: (accessories?: AccessoryOption[], engraving?: string) => void;
  onOpenStudio: () => void;
  onOpenCart: () => void;
  onInspectHotspot?: (pos: [number, number, number]) => void;
}

export function ScrollSections({
  products,
  currentProduct,
  selectedFinish,
  onSelectFinish,
  onSelectProduct,
  onAddToCart,
  onOpenStudio,
  onOpenCart,
  onInspectHotspot
}: ScrollSectionsProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([]);
  const [engravingText, setEngravingText] = useState('');
  const [activeCurvePreset, setActiveCurvePreset] = useState<'harman' | 'diffuse' | 'flat'>('harman');
  const [hoveredFrequency, setHoveredFrequency] = useState<{ hz: number; db: number } | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string>('h1');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Monitor scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccessory = (acc: AccessoryOption) => {
    soundFx.playClick(650);
    setSelectedAccessories((prev) => {
      const exists = prev.some((a) => a.id === acc.id);
      if (exists) return prev.filter((a) => a.id !== acc.id);
      return [...prev, acc];
    });
  };

  const accessoriesTotal = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const totalCalculatedPrice = currentProduct.price + accessoriesTotal;

  return (
    <div className="relative z-10 w-full text-zinc-100 pointer-events-none">
      {/* ──────────────────────────────────────────────────────────
          SECTION 1: HERO VIEWPORT
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-16 pt-24 pb-12">
        <div className="max-w-2xl pointer-events-auto">
          {/* Eyebrow & Certifications */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/95 border border-zinc-700/80 text-[11px] font-mono text-zinc-300 mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-zinc-100 font-bold uppercase tracking-wider">{currentProduct.edition}</span>
          </div>

          {/* Master Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-[1.04] text-white">
            {currentProduct.name}
          </h1>

          <p className="mt-2 text-base font-mono text-cyan-400 tracking-wide uppercase">
            {currentProduct.subtitle}
          </p>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-light max-w-xl leading-relaxed">
            {currentProduct.description}
          </p>

          {/* Pricing & Laboratory Accreditation */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black font-['Space_Grotesk'] text-white">
                ${currentProduct.price}
              </span>
              <span className="text-sm font-mono text-zinc-500 line-through">
                ${currentProduct.originalPrice}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                VAT Incl.
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 border-l border-zinc-800 pl-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white font-mono">{currentProduct.rating}</span>
              <span className="text-zinc-500 font-mono">({currentProduct.reviewCount} Masters Tested)</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                soundFx.playAddToCartChime();
                onAddToCart(selectedAccessories, engravingText);
              }}
              className="px-8 py-3.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center gap-2"
            >
              <span>Acquire Reference Unit</span>
              <span className="text-zinc-400">•</span>
              <span className="font-mono">${currentProduct.price}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick(650);
                onOpenStudio();
              }}
              className="px-6 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900/90 text-zinc-200 font-semibold text-xs hover:border-cyan-400 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Enter 3D CAD Studio</span>
            </button>
          </div>

          {/* Finish Quick Selector */}
          <div className="mt-7 flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Finish:</span>
            <span className="text-xs font-bold text-white font-['Space_Grotesk']">{selectedFinish.name}</span>
            <div className="flex items-center gap-2 ml-1">
              {currentProduct.finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundFx.playClick(800);
                    onSelectFinish(f);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                    f.id === selectedFinish.id
                      ? 'border-white scale-125 ring-2 ring-cyan-400/80 shadow-md'
                      : 'border-zinc-700 opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: f.hex }}
                  title={f.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Prompt with CAD coordinates */}
        <div className="pointer-events-auto flex items-center justify-between border-t border-zinc-800/80 pt-4 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <div className="w-6 h-10 rounded-full border border-zinc-700 flex justify-center p-1.5">
              <div className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
            </div>
            <span>Scroll to de-couple 3D acoustic engine</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-500">
            <span>AXIS: 0.00 / 0.00 / 0.00</span>
            <span>POLAR: 38.0° FOV</span>
            <span>ROOM: PMREM PBR</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: ACOUSTIC ARCHITECTURE (EXPLODED MACRO & HOTSPOTS)
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-between px-6 md:px-16 py-24">
        {/* Left Side: Exploded Parts Matrix */}
        <div className="max-w-md pointer-events-auto rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>01 / Acoustic Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            De-Coupled Sub-Assembly Analysis.
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed">
            {currentProduct.architecturalOverview}
          </p>

          <div className="space-y-3 pt-2">
            {currentProduct.explodedParts.map((part, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 text-[10px]">0{idx + 1}</span>
                    <span>{part.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{part.material}</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 pl-5">{part.function}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playClick(650);
                onOpenStudio();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-bold hover:text-white hover:border-cyan-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Exploded Slider in 3D</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Hotspots */}
        <div className="hidden xl:block max-w-sm pointer-events-auto rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Precision Hotspots</span>
            <span className="text-cyan-400 font-bold">{currentProduct.hotspots.length} Nodes</span>
          </div>

          <div className="space-y-2">
            {currentProduct.hotspots.map((hs) => {
              const isActive = hs.id === activeHotspotId;
              return (
                <button
                  key={hs.id}
                  onClick={() => {
                    soundFx.playClick(700);
                    setActiveHotspotId(hs.id);
                    if (onInspectHotspot) onInspectHotspot(hs.position);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-cyan-400 bg-zinc-900/90 shadow-md ring-1 ring-cyan-400/40'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{hs.title}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{hs.part}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">{hs.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: BESPOKE FINISHES & LASER ENGRAVING
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center justify-end px-6 md:px-16 py-24">
        <div className="max-w-xl pointer-events-auto rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 / Aerospace Metallurgy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            CNC Monolithic Metallurgy.
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed">
            Milled from solid aerospace alloy billet with micro-bead blasted satin finish. Each unit is laser-etched with a unique serial number in our Kyoto workshop.
          </p>

          {/* Interactive Finishes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentProduct.finishes.map((finish) => {
              const isSelected = finish.id === selectedFinish.id;
              return (
                <button
                  key={finish.id}
                  onClick={() => {
                    soundFx.playClick(900);
                    onSelectFinish(finish);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-zinc-900 ring-1 ring-cyan-400/50'
                      : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: finish.hex }}
                    />
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="text-xs font-bold text-white font-['Space_Grotesk']">{finish.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {finish.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Laser Engraving Input */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Complimentary Laser Studio Engraving</span>
              <span className="font-mono text-[10px] text-cyan-400">FREE OF CHARGE</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Personalize your chassis spine or stator base plate with custom studio credentials or callsign (up to 18 characters).
            </p>
            <input
              type="text"
              maxLength={18}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
              placeholder="E.G. KYOTO STUDIO • 042"
              className="w-full px-3 py-2 text-xs font-mono uppercase bg-zinc-950 border border-zinc-700 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 tracking-wider"
            />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: HARMAN TARGET ACOUSTIC CURVE & AUDIO STAGE
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center px-6 md:px-16 py-24">
        <div className="max-w-2xl pointer-events-auto rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            <span>03 / Laboratory Frequency Target</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Reference Acoustic Target Benchmark.
          </h2>
          <p className="text-zinc-300 text-xs leading-relaxed">
            Calibrated on an industry-standard B&K 5128 High-Frequency Head Simulator. Our planar magnetic engine provides sub-bass extension down to 3 Hz without phase ringing or harmonic clipping.
          </p>

          {/* Interactive Acoustic Curve Visualizer Canvas */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-zinc-400">TARGET:</span>
                {(['harman', 'diffuse', 'flat'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      soundFx.playClick(600);
                      setActiveCurvePreset(preset);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase cursor-pointer ${
                      activeCurvePreset === preset
                        ? 'bg-zinc-800 text-cyan-400 font-bold border border-cyan-500/40'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <span className="font-mono text-cyan-400 text-xs">THD &lt; 0.03%</span>
            </div>

            {/* SVG Interactive Acoustic Response Curve */}
            <div
              className="relative h-44 bg-zinc-950 rounded-lg p-2 overflow-hidden border border-zinc-800/80 cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const xRatio = (e.clientX - rect.left) / rect.width;
                const hz = Math.round(20 * Math.pow(1000, xRatio));
                const db = +(Math.sin(xRatio * Math.PI * 2) * 2.5 + (activeCurvePreset === 'harman' ? 3 : 0)).toFixed(1);
                setHoveredFrequency({ hz, db });
              }}
              onMouseLeave={() => setHoveredFrequency(null)}
            >
              {/* dB grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20 text-[9px] font-mono text-zinc-500">
                <div className="border-b border-zinc-600 flex justify-between"><span>+10 dB</span></div>
                <div className="border-b border-zinc-600 flex justify-between"><span>0 dB</span></div>
                <div className="border-b border-zinc-600 flex justify-between"><span>-10 dB</span></div>
              </div>

              {/* Curve rendering */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Reference Baseline Target (dashed) */}
                <path
                  d="M 0,55 Q 80,48 160,60 T 320,55 T 400,68"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* AURA Measured Curve (cyan solid) */}
                <path
                  d={
                    activeCurvePreset === 'harman'
                      ? 'M 0,48 Q 70,42 150,58 T 300,52 T 400,64'
                      : activeCurvePreset === 'diffuse'
                      ? 'M 0,60 Q 80,55 160,52 T 320,48 T 400,70'
                      : 'M 0,58 L 400,58'
                  }
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />
              </svg>

              {/* Frequency Axis Labels */}
              <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[9px] font-mono text-zinc-500 pointer-events-none">
                <span>20 Hz (Sub-Bass)</span>
                <span>1 kHz (Mid)</span>
                <span>10 kHz (Presence)</span>
                <span>50 kHz (Air)</span>
              </div>

              {/* Tooltip probe */}
              {hoveredFrequency && (
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 font-mono text-[10px] text-white">
                  <span className="text-cyan-400 font-bold">{hoveredFrequency.hz} Hz</span>
                  <span className="text-zinc-500 mx-1.5">•</span>
                  <span>{hoveredFrequency.db} dB</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={() => {
                soundFx.playClick(600);
                soundFx.toggleSpatialAudioDemo();
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Engage 192 kHz Binaural Sound Sweep</span>
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5: PROFESSIONAL STUDIO ACCESSORY BUNDLES
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-24">
        <div className="max-w-2xl mb-8 pointer-events-auto">
          <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
            04 / Laboratory Interconnects & Accessories
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
            Precision Studio Interconnects.
          </h2>
          <p className="mt-2 text-zinc-400 text-xs">
            Complete your mastering chain with balanced pure silver interconnects and CNC machined desk docks.
          </p>
        </div>

        {/* Accessory options list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pointer-events-auto">
          {currentProduct.accessories.map((acc) => {
            const isSelected = selectedAccessories.some((a) => a.id === acc.id);
            return (
              <div
                key={acc.id}
                onClick={() => toggleAccessory(acc)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-zinc-900 shadow-xl ring-1 ring-cyan-400/50'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-['Space_Grotesk']">{acc.name}</span>
                    <span className="font-mono text-cyan-400 font-bold text-xs">+${acc.price}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{acc.description}</p>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-zinc-950' : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">
                    {isSelected ? 'Included in Bundle' : 'Add to Setup'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: SPEC SHEET & VERIFIED REVIEWS
          ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pointer-events-auto">
          {/* Tech Specs Table */}
          <div className="rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Master Measurement Metrics</div>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">
                Engineering Specifications
              </h3>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {currentProduct.specs.map((s, i) => (
                <div key={i} className="py-3 flex items-start justify-between text-xs gap-4">
                  <div>
                    <span className="text-zinc-300 font-semibold">{s.label}</span>
                    {s.detail && <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{s.detail}</div>}
                  </div>
                  <span className="font-bold text-zinc-100 font-mono text-right shrink-0">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>3-Year Studio Care</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>FedEx Priority Insured</span>
              </div>
            </div>
          </div>

          {/* Verified Acoustic Master Reviews */}
          <div className="rounded-2xl bg-zinc-950/95 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-500">Mastering Engineer Feedback</div>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">
                  Studio Endorsements
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-amber-400 font-mono">★ {currentProduct.rating}</div>
                <div className="text-[10px] text-zinc-500 font-mono">{currentProduct.reviewCount} Masters Verified</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Kenji Takahashi</span>
                  <span className="text-zinc-500 text-[10px] font-mono">NHK Symphony Chief Sound Engineer</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "The isodynamic planar magnetic stator reveals room reflections that dynamic moving-coil headphones simply smear. The mechanical damping of the 6061-T6 aluminum cup prevents any internal cavity coloration."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Julianne Mercer</span>
                  <span className="text-zinc-500 text-[10px] font-mono">Abbey Road Studios Mastering Engineer</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Zero fatigue over 10-hour mixing blocks. The spatial head tracking maintains bit-perfect 192 kHz resolution without any detectable wireless packet drop."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-20 pt-12 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold tracking-widest uppercase font-['Space_Grotesk'] text-white">
              A U R A
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Kyoto Acoustic Labs • Tokyo • Zurich • Copenhagen
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400 font-mono">
            <span className="hover:text-zinc-200 cursor-pointer">Acoustic Patents</span>
            <span className="hover:text-zinc-200 cursor-pointer">Calibration Portal</span>
            <span className="hover:text-zinc-200 cursor-pointer">ISO 9001 Certified</span>
          </div>
        </footer>
      </section>

      {/* ──────────────────────────────────────────────────────────
          STICKY BOTTOM PURCHASE BAR
          ────────────────────────────────────────────────────────── */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-zinc-950/95 border-t border-zinc-800/90 pointer-events-auto shadow-2xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: selectedFinish.hex }}
              />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                  {currentProduct.name}
                </span>
                <span className="text-[11px] text-zinc-400 ml-2 font-mono">({selectedFinish.name})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-black font-['Space_Grotesk'] text-white">
                  ${totalCalculatedPrice}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">In Stock • Ships Tomorrow</div>
              </div>

              <button
                onClick={() => {
                  soundFx.playAddToCartChime();
                  onAddToCart(selectedAccessories, engravingText);
                }}
                className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Acquire Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
