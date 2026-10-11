/**
 * @file soundService.js
 * @description Tactile Web Audio API Synthesizer and Indian UPI Soundbox Voice Generator.
 * Synthesizes zero-asset audio directly in the client without external media network calls.
 * @author PULSE OS Engineering
 * @version 1.1.0
 */

class SoundService {
  constructor() {
    /** @type {AudioContext | null} */
    this.ctx = null;
    this.enabled = true;
    this.soundboxEnabled = true;
  }

  /**
   * Initializes or resumes the AudioContext on user gesture.
   */
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Toggles sound master state.
   * @returns {boolean} New enabled state
   */
  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playClick();
    }
    return this.enabled;
  }

  /**
   * Toggles UPI soundbox voice announcements.
   * @returns {boolean} New soundbox state
   */
  toggleSoundbox() {
    this.soundboxEnabled = !this.soundboxEnabled;
    return this.soundboxEnabled;
  }

  /**
   * Plays a crisp micro-interaction click sound.
   */
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context may be restricted by browser autoplay policy
    }
  }

  /**
   * Plays a two-tone coin payment sound.
   */
  playCoin() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      osc2.frequency.setValueAtTime(1318.51, now);
      osc2.frequency.setValueAtTime(1975.53, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {}
  }

  /**
   * Plays a descending buzz warning tone for financial stress or curveball alerts.
   */
  playWarning() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  /**
   * Plays a cheerful 4-note major arpeggio for savings milestones and wishlist rewards.
   */
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.1, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.25);
      });
    } catch {}
  }

  /**
   * Plays an escalating frequency sweep for the curveball roulette wheel.
   */
  playRoulette() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + i * 70, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch {}
  }

  /**
   * Plays the iconic Indian UPI Soundbox 3-note melodic chime (C6 - E6 - G6)
   * followed by an optional speech synthesized audio confirmation.
   * 
   * @param {number} amount 
   * @param {string} [merchant='PULSE OS']
   */
  playUpiSoundbox(amount, merchant = 'PULSE') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Paytm / PhonePe signature melodic soundbox carrier chime
      const chimeNotes = [1046.50, 1318.51, 1567.98]; // C6, E6, G6
      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });

      // 2. Synthesize voice announcement using SpeechSynthesis API if available & enabled
      if (this.soundboxEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setTimeout(() => {
          try {
            window.speechSynthesis.cancel(); // clear queue
            const utterance = new SpeechSynthesisUtterance(
              `Rupees ${amount} debited on ${merchant}`
            );
            utterance.rate = 1.05;
            utterance.pitch = 1.1;
            utterance.volume = 0.85;
            window.speechSynthesis.speak(utterance);
          } catch {
            // Speech synthesis not available or blocked
          }
        }, 420);
      }
    } catch {}
  }

  /**
   * Tactical low drone for DEFCON lockdown alerts.
   */
  playDefconDrone() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }
}

export const sound = new SoundService();
