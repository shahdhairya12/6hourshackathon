import { describe, it, expect } from 'vitest';
import { sound } from './soundService';

describe('soundService', () => {
  it('toggles master sound enabled state', () => {
    const initial = sound.enabled;
    const toggled = sound.toggleSound();
    expect(toggled).toBe(!initial);
    // restore
    sound.toggleSound();
  });

  it('toggles UPI soundbox voice announcer state', () => {
    const initial = sound.soundboxEnabled;
    const toggled = sound.toggleSoundbox();
    expect(toggled).toBe(!initial);
    // restore
    sound.toggleSoundbox();
  });

  it('calls sound methods safely without crashing in test environment', () => {
    expect(() => {
      sound.playClick();
      sound.playCoin();
      sound.playWarning();
      sound.playSuccess();
      sound.playRoulette();
      sound.playUpiSoundbox(450, 'Test Merchant');
      sound.playDefconDrone();
    }).not.toThrow();
  });
});
