/**
 * Procedural Web Audio Engine
 * Zero external audio files, 100% reliable synthetic soundscapes & micro-haptics.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingSpatialDemo: boolean = false;
  private spatialOscA: OscillatorNode | null = null;
  private spatialOscB: OscillatorNode | null = null;
  private spatialGain: GainNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private animFrameId: number = 0;
  private onAmplitudeCallback?: (amp: number) => void;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setAmplitudeCallback(cb: (amp: number) => void) {
    this.onAmplitudeCallback = cb;
  }

  /**
   * Crisp acoustic click for swatch selection, mode toggles, buttons
   */
  public playClick(freq = 800, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  /**
   * High-tech mechanical slide tone for exploded slider
   */
  public playSliderWhirr(progress: number) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const freq = 180 + progress * 320;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Ignore
    }
  }

  /**
   * Harmonious chime when adding item to cart
   */
  public playAddToCartChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.09, this.ctx!.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.07);
        osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.4);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Start / stop 3D spatial binaural sound demo with sweeping pan and harmonic beats
   */
  public toggleSpatialAudioDemo(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isPlayingSpatialDemo) {
      this.stopSpatialAudioDemo();
      return false;
    }

    try {
      const t = this.ctx.currentTime;
      this.spatialGain = this.ctx.createGain();
      this.spatialGain.gain.setValueAtTime(0.001, t);
      this.spatialGain.gain.linearRampToValueAtTime(0.12, t + 0.4);

      // Stereo panner for spatial motion
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.connect(this.ctx.destination);
        this.spatialGain.connect(this.pannerNode);
      } else {
        this.spatialGain.connect(this.ctx.destination);
      }

      // Dual detuned oscillators creating binaural beats & warm acoustic chord
      this.spatialOscA = this.ctx.createOscillator();
      this.spatialOscA.type = 'sawtooth';
      this.spatialOscA.frequency.setValueAtTime(130.81, t); // C3

      // Low-pass filter for smooth analog warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);

      this.spatialOscB = this.ctx.createOscillator();
      this.spatialOscB.type = 'sine';
      this.spatialOscB.frequency.setValueAtTime(196.0, t); // G3

      this.spatialOscA.connect(filter);
      this.spatialOscB.connect(filter);
      filter.connect(this.spatialGain);

      this.spatialOscA.start();
      this.spatialOscB.start();

      this.isPlayingSpatialDemo = true;

      // Animate spatial panner in a circular orbit and pulse amplitude
      let angle = 0;
      const animateSpatial = () => {
        if (!this.isPlayingSpatialDemo || !this.ctx) return;
        angle += 0.03;
        const pan = Math.sin(angle);
        if (this.pannerNode) {
          this.pannerNode.pan.setValueAtTime(pan, this.ctx.currentTime);
        }
        const amp = 0.4 + Math.sin(angle * 2) * 0.3;
        if (this.onAmplitudeCallback) {
          this.onAmplitudeCallback(amp);
        }
        this.animFrameId = requestAnimationFrame(animateSpatial);
      };
      this.animFrameId = requestAnimationFrame(animateSpatial);

      return true;
    } catch {
      return false;
    }
  }

  public stopSpatialAudioDemo() {
    if (this.ctx && this.spatialGain) {
      try {
        const t = this.ctx.currentTime;
        this.spatialGain.gain.linearRampToValueAtTime(0.001, t + 0.3);
        setTimeout(() => {
          this.spatialOscA?.stop();
          this.spatialOscB?.stop();
          this.spatialOscA?.disconnect();
          this.spatialOscB?.disconnect();
          this.spatialGain?.disconnect();
          this.isPlayingSpatialDemo = false;
          if (this.onAmplitudeCallback) this.onAmplitudeCallback(0);
        }, 320);
      } catch {
        this.isPlayingSpatialDemo = false;
      }
    } else {
      this.isPlayingSpatialDemo = false;
    }
    cancelAnimationFrame(this.animFrameId);
  }

  public isDemoActive(): boolean {
    return this.isPlayingSpatialDemo;
  }
}

export const soundFx = new AudioEngine();
