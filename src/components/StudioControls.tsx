import { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Sun,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Grid,
  Eye
} from 'lucide-react';
import { Product, ProductFinish, LightingPresetId } from '../types';
import { LIGHTING_PRESETS } from '../data/products';
import { soundFx } from '../utils/audioEngine';

interface StudioControlsProps {
  product: Product;
  selectedFinish: ProductFinish;
  onSelectFinish: (finish: ProductFinish) => void;
  lightingPreset: LightingPresetId;
  onSelectLighting: (preset: LightingPresetId) => void;
  explodedProgress: number;
  onExplodedChange: (value: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  wireframe: boolean;
  onToggleWireframe: () => void;
  onSelectViewPreset: (preset: 'front' | 'macro' | 'top' | 'isometric') => void;
  onResetCamera: () => void;
  onAddToCart: () => void;
}

export function StudioControls({
  product,
  selectedFinish,
  onSelectFinish,
  lightingPreset,
  onSelectLighting,
  explodedProgress,
  onExplodedChange,
  autoRotate,
  onToggleAutoRotate,
  wireframe,
  onToggleWireframe,
  onSelectViewPreset,
  onResetCamera,
  onAddToCart
}: StudioControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'explode' | 'finishes' | 'lighting' | 'views'>('explode');

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-[min(960px,94vw)] transition-transform duration-300">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => {
            soundFx.playClick(600);
            setIsCollapsed(!isCollapsed);
          }}
          className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-t-xl bg-zinc-900 border-t border-x border-zinc-700/80 text-zinc-400 hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Restore CAD Control Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hide Controls (Clean Zen Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950 p-4 text-zinc-100 shadow-2xl space-y-3.5">
          {/* Top Bar: Tabs & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <button
                onClick={() => {
                  soundFx.playClick(700);
                  setActiveTab('explode');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'explode'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exploded View</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick(700);
                  setActiveTab('views');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'views'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>CAD Views</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick(700);
                  setActiveTab('finishes');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'finishes'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Metallurgy</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick(700);
                  setActiveTab('lighting');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'lighting'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
                <span>Studio Rig</span>
              </button>
            </div>

            {/* Quick Actions (Wireframe, Auto-spin, Reset Camera, Add To Bag) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick(650);
                  onToggleWireframe();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  wireframe
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Toggle CAD Wireframe Mesh"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono text-[11px]">Wireframe</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick(650);
                  onToggleAutoRotate();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
                title="Toggle 360 degree turntable spin"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline font-mono text-[11px]">360° Turntable</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick(500);
                  onResetCamera();
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Camera Coordinates"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFx.playAddToCartChime();
                  onAddToCart();
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer shadow-md"
              >
                Acquire • ${product.price}
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div>
            {/* Exploded View Slider */}
            {activeTab === 'explode' && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center justify-between sm:w-48 text-xs font-mono text-zinc-300">
                  <span className="text-zinc-400">De-Coupling Axis:</span>
                  <span className="text-cyan-400 font-bold">
                    {Math.round(explodedProgress * 100)}% SEPARATION
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    Mated (0%)
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedProgress}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      soundFx.playSliderWhirr(val);
                      onExplodedChange(val);
                    }}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    Disassembled (100%)
                  </span>
                </div>
              </div>
            )}

            {/* CAD View Presets */}
            {activeTab === 'views' && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono">Orthographic Presets:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'front' as const, label: '01 / Front Elevation' },
                    { id: 'macro' as const, label: '02 / Planar Stator Macro' },
                    { id: 'top' as const, label: '03 / Plan Zenith View' },
                    { id: 'isometric' as const, label: '04 / Master 3/4 Isometric' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        soundFx.playClick(650);
                        onSelectViewPreset(preset.id);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs text-zinc-300 hover:border-cyan-400 hover:text-white transition-colors cursor-pointer font-mono"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Finishes */}
            {activeTab === 'finishes' && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono">Surface Metallurgy:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.finishes.map((finish) => {
                    const isSelected = finish.id === selectedFinish.id;
                    return (
                      <button
                        key={finish.id}
                        onClick={() => {
                          soundFx.playClick(850);
                          onSelectFinish(finish);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-zinc-900 text-white font-bold ring-1 ring-cyan-400/40'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/20 shrink-0 shadow-sm"
                          style={{ backgroundColor: finish.hex }}
                        />
                        <span>{finish.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lighting Atmospheres */}
            {activeTab === 'lighting' && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono">Photometric Rig:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {LIGHTING_PRESETS.map((preset) => {
                    const isSelected = preset.id === lightingPreset;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          soundFx.playClick(680);
                          onSelectLighting(preset.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer font-mono ${
                          isSelected
                            ? 'border-cyan-400 bg-zinc-900 text-white font-bold'
                            : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
