import { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, CreditCard, Lock, Sparkles, FileText, Download } from 'lucide-react';
import { CartItem } from '../types';
import { soundFx } from '../utils/audioEngine';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
  currency: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  currency
}: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'card' | 'wire'>('card');
  const [formData, setFormData] = useState({
    name: 'Dr. Hiroshi Tanaka',
    studio: 'Tokyo Sound Labs & Master Acoustics',
    email: 'hiroshi.tanaka@tokyo-mastering.jp',
    address: 'Minato-ku, Roppongi Hills Mori Tower 34F',
    city: 'Tokyo',
    postal: '106-6108',
    country: 'Japan',
    cardNumber: '•••• •••• •••• 8829',
    expiry: '09/29',
    cvv: '•••'
  });

  if (!isOpen) return null;

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';

  const total = items.reduce((sum, item) => {
    const accPrice = (item.selectedAccessories || []).reduce((s, a) => s + a.price, 0);
    return sum + (item.product.price + accPrice) * item.quantity;
  }, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playAddToCartChime();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStep('success');
    onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => {
          soundFx.playClick(500);
          onClose();
        }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick(500);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" />
              <span>AURA Acoustic Labs • Secure Checkout Protocol</span>
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              Authorize Hardware Reservation
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Each unit is assembled to order, frequency-matched to ±0.25 dB, and issued an individual certificate of authenticity.
            </p>

            {/* Order Items Preview */}
            <div className="mt-5 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider mb-1">
                Manifest Items ({items.length} Configured)
              </div>
              {items.map((item, idx) => {
                const accTotal = (item.selectedAccessories || []).reduce((s, a) => s + a.price, 0);
                const unitTotal = (item.product.price + accTotal) * item.quantity;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.selectedFinish.hex }}
                        />
                        <span className="font-bold text-white font-['Space_Grotesk']">{item.product.name}</span>
                        <span className="text-zinc-500 font-mono">x{item.quantity}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono pl-4.5">
                        Finish: {item.selectedFinish.name}
                        {item.engravingText && ` • Laser: "${item.engravingText}"`}
                      </div>
                    </div>
                    <span className="font-mono text-zinc-200 font-bold">
                      {currencySymbol}{unitTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
                <span className="font-['Space_Grotesk']">Grand Total</span>
                <span className="font-mono text-cyan-400 text-base">{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Master Engineer / Recipient
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Studio / Facility Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.studio}
                    onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Email for Telemetry & Shipping</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Country of Delivery</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Courier Delivery Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Payment Authorization</span>
                  </span>
                  <div className="flex gap-2">
                    {(['card', 'apple', 'wire'] as const).map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-zinc-800 text-white font-bold border border-cyan-400/50'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {method === 'card' ? 'Credit Card' : method === 'apple' ? 'Apple Pay' : 'Bank Wire'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Authorize Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                <span>Authorize & Issue Serial Number</span>
                <span className="opacity-40">•</span>
                <span className="font-mono">{currencySymbol}{total.toFixed(2)}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>3-Year Studio Care • Guaranteed Free Global Courier Returns</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Calibration Protocol Started • Serial #JP-84920</span>
              </div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Reference Order Authorized.
              </h2>
              <p className="text-xs text-zinc-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <span className="text-white font-bold">{formData.name}</span>. Your acoustic hardware has entered the precision assembly queue at our Kyoto laboratory.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2 max-w-sm mx-auto font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>FedEx Air Tracking:</span>
                <span className="font-semibold text-white">FX-993820-JP</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Arrival:</span>
                <span className="font-semibold text-emerald-400">In 2 Business Days</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Laboratory Destination:</span>
                <span className="font-semibold text-white truncate max-w-[170px]">
                  {formData.city}, {formData.country}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
              <button
                onClick={() => {
                  soundFx.playClick(600);
                  onClose();
                  setStep('form');
                }}
                className="w-full py-3 px-6 rounded-xl bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                Return to 3D Reference Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
