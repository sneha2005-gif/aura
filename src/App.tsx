import { useState, useEffect, useRef } from 'react';
import { PRODUCTS, LIGHTING_PRESETS } from './data/products';
import { ProductId, ProductFinish, LightingPresetId, CartItem, AccessoryOption } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { ScrollSections } from './components/ScrollSections';
import { StudioControls } from './components/StudioControls';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SceneManager } from './three/sceneManager';

export default function App() {
  const [currentProductId, setCurrentProductId] = useState<ProductId>('pulse-pro');
  const currentProduct = PRODUCTS.find((p) => p.id === currentProductId) || PRODUCTS[0];

  const [selectedFinish, setSelectedFinish] = useState<ProductFinish>(currentProduct.finishes[0]);
  const [lightingPreset, setLightingPreset] = useState<LightingPresetId>('studio-dark');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');

  // 3D Studio Mode
  const [isStudioMode, setIsStudioMode] = useState<boolean>(false);
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);

  // E-commerce state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      selectedFinish: PRODUCTS[0].finishes[0],
      selectedAccessories: [PRODUCTS[0].accessories[0]],
      engravingText: 'KYOTO STUDIO • 042',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const sceneManagerRef = useRef<SceneManager | null>(null);

  // When product changes, reset finish and accessories
  const handleSelectProduct = (id: ProductId) => {
    const nextProd = PRODUCTS.find((p) => p.id === id);
    if (nextProd) {
      setCurrentProductId(id);
      setSelectedFinish(nextProd.finishes[0]);
      setExplodedProgress(0);
    }
  };

  // Scroll listener for 3D camera choreography
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setIsStudioMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart operations
  const handleAddToCart = (accessories: AccessoryOption[] = [], engraving?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === currentProduct.id &&
          i.selectedFinish.id === selectedFinish.id &&
          i.engravingText === engraving
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product: currentProduct,
          selectedFinish,
          selectedAccessories: accessories,
          engravingText: engraving,
          quantity: 1
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(index);
    } else {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[index].quantity = qty;
        return updated;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-zinc-950 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Three.js 3D Canvas Layer */}
      <ThreeCanvas
        productId={currentProductId}
        selectedFinish={selectedFinish}
        lightingPreset={lightingPreset}
        scrollProgress={scrollProgress}
        isStudioMode={isStudioMode}
        explodedProgress={explodedProgress}
        autoRotate={autoRotate}
        wireframe={wireframe}
        onSceneReady={(manager) => {
          sceneManagerRef.current = manager;
        }}
      />

      {/* Global Navbar */}
      <Navbar
        products={PRODUCTS}
        currentProduct={currentProduct}
        onSelectProduct={handleSelectProduct}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        isStudioMode={isStudioMode}
        onToggleStudioMode={() => {
          setIsStudioMode(!isStudioMode);
          if (isStudioMode) {
            setExplodedProgress(0);
          }
        }}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      {/* Main Narrative Scroll Experience */}
      {!isStudioMode && (
        <ScrollSections
          products={PRODUCTS}
          currentProduct={currentProduct}
          selectedFinish={selectedFinish}
          onSelectFinish={setSelectedFinish}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onOpenStudio={() => setIsStudioMode(true)}
          onOpenCart={() => setIsCartOpen(true)}
          onInspectHotspot={(pos) => {
            if (sceneManagerRef.current) {
              sceneManagerRef.current.setViewPreset('macro');
            }
          }}
        />
      )}

      {/* Interactive 3D Studio Mode Bottom Dock */}
      {isStudioMode && (
        <>
          {/* Top Instruction Banner */}
          <div className="fixed top-18 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs text-zinc-300 shadow-xl pointer-events-none font-mono">
            <span className="text-cyan-400 font-bold">CAD REFERENCE STUDIO</span> • Free Orbit • Scroll to Zoom
          </div>

          <StudioControls
            product={currentProduct}
            selectedFinish={selectedFinish}
            onSelectFinish={setSelectedFinish}
            lightingPreset={lightingPreset}
            onSelectLighting={setLightingPreset}
            explodedProgress={explodedProgress}
            onExplodedChange={setExplodedProgress}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            wireframe={wireframe}
            onToggleWireframe={() => setWireframe(!wireframe)}
            onSelectViewPreset={(preset) => {
              if (sceneManagerRef.current) {
                sceneManagerRef.current.setViewPreset(preset);
              }
            }}
            onResetCamera={() => {
              if (sceneManagerRef.current) {
                sceneManagerRef.current.resetCamera();
              }
            }}
            onAddToCart={() => handleAddToCart()}
          />
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        currency={currency}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={() => {
          setCartItems([]);
        }}
        currency={currency}
      />
    </div>
  );
}
