import { useState } from 'react';
import { Volume2, VolumeX, ShoppingBag, Box, ChevronDown } from 'lucide-react';
import { Product, ProductId } from '../types';
import { soundFx } from '../utils/audioEngine';

interface NavbarProps {
  products: Product[];
  currentProduct: Product;
  onSelectProduct: (id: ProductId) => void;
  cartCount: number;
  onOpenCart: () => void;
  isStudioMode: boolean;
  onToggleStudioMode: () => void;
  currency: string;
  onChangeCurrency: (c: string) => void;
}

export function Navbar({
  products,
  currentProduct,
  onSelectProduct,
  cartCount,
  onOpenCart,
  isStudioMode,
  onToggleStudioMode,
  currency,
  onChangeCurrency
}: NavbarProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const handleToggleAudio = () => {
    soundFx.playClick(600);
    const active = soundFx.toggleSpatialAudioDemo();
    setIsPlayingAudio(active);
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between border-b border-zinc-800/90 bg-zinc-950/90 text-zinc-100 backdrop-blur-md">
      {/* Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white font-extrabold text-sm tracking-widest font-mono shadow-sm">
          A
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-[0.25em] uppercase font-['Space_Grotesk'] text-white">
              A U R A
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-400 font-mono border border-zinc-700/50">
              Reference Audio
            </span>
          </div>
          <span className="text-[10px] tracking-wider text-zinc-500 font-mono">
            Kyoto Acoustic Laboratory
          </span>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
        {products.map((prod) => {
          const isActive = prod.id === currentProduct.id;
          return (
            <button
              key={prod.id}
              onClick={() => {
                soundFx.playClick(750);
                onSelectProduct(prod.id);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {prod.name.replace('AURA ', '')}
            </button>
          );
        })}
      </nav>

      {/* Utility Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Currency Switcher */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-mono rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-zinc-700 cursor-pointer"
          >
            <span>{currency}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
          {showCurrencyDropdown && (
            <div className="absolute top-full mt-1.5 right-0 w-24 rounded-lg bg-zinc-900 border border-zinc-800 p-1 shadow-2xl z-50">
              {currencies.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChangeCurrency(c);
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1 text-xs rounded font-mono ${
                    c === currency ? 'bg-zinc-800 text-cyan-400 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spatial Audio Demo Trigger */}
        <button
          onClick={handleToggleAudio}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
            isPlayingAudio
              ? 'border-cyan-400/80 bg-cyan-950/40 text-cyan-300'
              : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:text-white'
          }`}
          title="Toggle 3D spatial acoustic binaural wave test"
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span className="hidden xl:inline text-[11px] font-mono">192 kHz Binaural</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden xl:inline text-[11px]">Acoustic Test</span>
            </>
          )}
        </button>

        {/* 3D Studio Inspection Mode Toggle */}
        <button
          onClick={() => {
            soundFx.playClick(650);
            onToggleStudioMode();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            isStudioMode
              ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
              : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-700 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">{isStudioMode ? 'Exit Studio' : '3D Studio'}</span>
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => {
            soundFx.playClick(850);
            onOpenCart();
          }}
          className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bag</span>
          {cartCount > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold rounded-full bg-cyan-600 text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
