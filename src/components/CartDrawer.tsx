import { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { soundFx } from '../utils/audioEngine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  currency: string;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currency
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const calculateItemPrice = (item: CartItem) => {
    const accPrice = (item.selectedAccessories || []).reduce((sum, a) => sum + a.price, 0);
    return item.product.price + accPrice;
  };

  const rawSubtotal = items.reduce(
    (sum, item) => sum + calculateItemPrice(item) * item.quantity,
    0
  );
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  const handleApplyPromo = () => {
    soundFx.playClick(750);
    if (promoCode.trim().toUpperCase() === 'AURA20') {
      setDiscountPercent(20);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Use "AURA20" for 20% studio privilege.');
    }
  };

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => {
          soundFx.playClick(500);
          onClose();
        }}
        className="absolute inset-0 bg-black/75 transition-opacity backdrop-blur-sm"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-['Space_Grotesk'] text-white">Your Studio Manifest</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)} {items.length === 1 ? 'Unit' : 'Units'}
              </span>
            </div>
            <button
              onClick={() => {
                soundFx.playClick(500);
                onClose();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Courier guarantee */}
          <div className="px-6 py-2.5 bg-zinc-900 border-b border-zinc-800/80 text-[11px] text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Complimentary Insured Air Courier & 45-Day Laboratory Audition</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-800/80">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Tag className="w-5 h-5" />
                </div>
                <p className="text-sm text-zinc-300 font-medium">Your studio bag is empty.</p>
                <p className="text-xs text-zinc-500">
                  Explore our reference monitors to configure your setup.
                </p>
              </div>
            ) : (
              items.map((item, index) => {
                const itemSinglePrice = calculateItemPrice(item);
                return (
                  <div key={`${item.product.id}-${item.selectedFinish.id}-${index}`} className="py-4 flex gap-4">
                    {/* Finish Swatch Box */}
                    <div
                      className="w-16 h-16 rounded-xl border border-zinc-700/80 flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: item.selectedFinish.hex }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-white/10" />
                      <span className="relative z-10 text-[9px] font-mono font-bold text-white uppercase tracking-widest">
                        AURA
                      </span>
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white truncate font-['Space_Grotesk']">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-white ml-2">
                            {currencySymbol}{(itemSinglePrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                          {item.selectedFinish.name}
                        </div>

                        {/* Accessories list */}
                        {item.selectedAccessories && item.selectedAccessories.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.selectedAccessories.map((a) => (
                              <div key={a.id} className="text-[10px] text-zinc-400 font-mono flex justify-between">
                                <span className="truncate">+ {a.name}</span>
                                <span>{currencySymbol}{a.price}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Custom Engraving */}
                        {item.engravingText && (
                          <div className="text-[10px] text-amber-400 font-mono mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Engraving: "{item.engravingText}"</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900">
                          <button
                            onClick={() => {
                              soundFx.playClick(600);
                              onUpdateQuantity(index, item.quantity - 1);
                            }}
                            className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              soundFx.playClick(600);
                              onUpdateQuantity(index, item.quantity + 1);
                            }}
                            className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            soundFx.playClick(450);
                            onRemoveItem(index);
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Promo */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-800 space-y-3.5 bg-zinc-950">
              {/* Promo code */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Privilege Code (try AURA20)"
                    className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-red-400 mt-1">{promoError}</p>}
                {discountPercent > 0 && (
                  <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                    ✓ Applied: {discountPercent}% Studio Master Discount
                  </p>
                )}
              </div>

              {/* Subtotal calculation */}
              <div className="space-y-1 text-xs text-zinc-400 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200">{currencySymbol}{rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (20%)</span>
                    <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>FedEx Priority Delivery</span>
                  <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                  <span className="font-['Space_Grotesk']">Manifest Total</span>
                  <span className="text-cyan-400 font-mono">{currencySymbol}{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  soundFx.playClick(800);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
              >
                <span>Authorize Studio Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>256-Bit Encrypted • Serialized Certificate Included</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
