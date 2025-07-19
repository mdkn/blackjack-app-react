// Simple sound effects using base64 encoded audio for embedded sounds
// This avoids needing external audio files and works well in a Tauri app

export type SoundEffect =
  | "cardDeal"
  | "cardFlip"
  | "chipPlace"
  | "chipWin"
  | "blackjack"
  | "bust"
  | "win"
  | "lose"
  | "push";

interface SoundManager {
  play: (effect: SoundEffect, volume?: number) => Promise<void>;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  isEnabled: () => boolean;
}

class WebAudioSoundManager implements SoundManager {
  private enabled = true;
  private volume = 0.7;
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundEffect, AudioBuffer> = new Map();

  constructor() {
    this.initializeAudioContext();
    this.generateSounds();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch (error) {
      console.warn(
        "Web Audio API not supported, falling back to HTML5 Audio",
        error
      );
    }
  }

  private generateSounds() {
    // Generate simple procedural sounds using Web Audio API
    if (!this.audioContext) return;

    this.generateCardDealSound();
    this.generateCardFlipSound();
    this.generateChipPlaceSound();
    this.generateChipWinSound();
    this.generateBlackjackSound();
    this.generateBustSound();
    this.generateWinSound();
    this.generateLoseSound();
    this.generatePushSound();
  }

  private createTone(
    frequency: number,
    duration: number,
    type: "sine" | "square" | "sawtooth" | "triangle" = "sine"
  ): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not available");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case "sine":
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case "square":
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case "triangle":
          sample =
            (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
          break;
        case "sawtooth":
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }

      // Apply envelope (fade in/out)
      const fadeTime = 0.1;
      const fadeSamples = fadeTime * sampleRate;
      let envelope = 1;

      if (i < fadeSamples) {
        envelope = i / fadeSamples;
      } else if (i > length - fadeSamples) {
        envelope = (length - i) / fadeSamples;
      }

      data[i] = sample * envelope * 0.3; // Reduce volume
    }

    return buffer;
  }

  private generateCardDealSound() {
    if (!this.audioContext) return;
    // Quick swoosh sound - high frequency sweep
    const buffer = this.createNoiseSwoop(800, 400, 0.1);
    this.sounds.set("cardDeal", buffer);
  }

  private generateCardFlipSound() {
    if (!this.audioContext) return;
    // Sharp click sound
    const buffer = this.createTone(1200, 0.05, "square");
    this.sounds.set("cardFlip", buffer);
  }

  private generateChipPlaceSound() {
    if (!this.audioContext) return;
    // Soft clink sound
    const buffer = this.createTone(600, 0.1, "sine");
    this.sounds.set("chipPlace", buffer);
  }

  private generateChipWinSound() {
    if (!this.audioContext) return;
    // Pleasant chime
    const buffer = this.createChord([523, 659, 784], 0.3); // C major chord
    this.sounds.set("chipWin", buffer);
  }

  private generateBlackjackSound() {
    if (!this.audioContext) return;
    // Triumphant fanfare
    const buffer = this.createChord([523, 659, 784, 1047], 0.5); // C major with octave
    this.sounds.set("blackjack", buffer);
  }

  private generateBustSound() {
    if (!this.audioContext) return;
    // Descending minor sound
    const buffer = this.createDescendingTone(400, 200, 0.3);
    this.sounds.set("bust", buffer);
  }

  private generateWinSound() {
    if (!this.audioContext) return;
    // Happy ascending tone
    const buffer = this.createAscendingTone(400, 600, 0.3);
    this.sounds.set("win", buffer);
  }

  private generateLoseSound() {
    if (!this.audioContext) return;
    // Sad descending tone
    const buffer = this.createDescendingTone(300, 150, 0.4);
    this.sounds.set("lose", buffer);
  }

  private generatePushSound() {
    if (!this.audioContext) return;
    // Neutral tone
    const buffer = this.createTone(440, 0.2, "sine");
    this.sounds.set("push", buffer);
  }

  private createNoiseSwoop(
    startFreq: number,
    endFreq: number,
    duration: number
  ): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not available");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = i / length;
      const frequency = startFreq + (endFreq - startFreq) * progress;

      // Add some noise
      const noise = (Math.random() - 0.5) * 0.1;
      const tone = Math.sin(2 * Math.PI * frequency * t) * 0.2;

      // Envelope
      const envelope = Math.exp(-t * 10); // Quick decay

      data[i] = (tone + noise) * envelope;
    }

    return buffer;
  }

  private createChord(frequencies: number[], duration: number): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not available");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Add all frequencies
      for (const freq of frequencies) {
        sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
      }

      // Envelope
      const fadeTime = 0.1;
      const fadeSamples = fadeTime * sampleRate;
      let envelope = 1;

      if (i < fadeSamples) {
        envelope = i / fadeSamples;
      } else if (i > length - fadeSamples) {
        envelope = (length - i) / fadeSamples;
      }

      data[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  private createAscendingTone(
    startFreq: number,
    endFreq: number,
    duration: number
  ): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not available");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = i / length;
      const frequency = startFreq + (endFreq - startFreq) * progress;

      const sample = Math.sin(2 * Math.PI * frequency * t);

      // Envelope
      const envelope = Math.sin(Math.PI * progress); // Bell curve

      data[i] = sample * envelope * 0.2;
    }

    return buffer;
  }

  private createDescendingTone(
    startFreq: number,
    endFreq: number,
    duration: number
  ): AudioBuffer {
    if (!this.audioContext) throw new Error("Audio context not available");

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = i / length;
      const frequency = startFreq - (startFreq - endFreq) * progress;

      const sample = Math.sin(2 * Math.PI * frequency * t);

      // Envelope
      const envelope = Math.exp(-progress * 3); // Exponential decay

      data[i] = sample * envelope * 0.2;
    }

    return buffer;
  }

  async play(effect: SoundEffect, volume?: number): Promise<void> {
    if (!this.enabled || !this.audioContext || !this.sounds.has(effect)) {
      return;
    }

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const buffer = this.sounds.get(effect);
      if (!buffer) return;

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      const effectiveVolume = (volume ?? this.volume) / 100;
      gainNode.gain.setValueAtTime(
        effectiveVolume,
        this.audioContext.currentTime
      );

      source.start();
    } catch (error) {
      console.warn(`Failed to play sound effect "${effect}":`, error);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume)) / 100;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Fallback HTML5 Audio implementation for browsers without Web Audio API
class HTML5AudioSoundManager implements SoundManager {
  private enabled = true;
  private volume = 0.7;

  async play(effect: SoundEffect, volume?: number): Promise<void> {
    if (!this.enabled) return;

    // Simple beep sounds using data URLs (very basic fallback)
    const audio = new Audio();
    const effectiveVolume = (volume ?? this.volume) / 100;
    audio.volume = effectiveVolume;

    // Generate simple beep based on effect type
    const frequency = this.getFrequencyForEffect(effect);
    const duration = this.getDurationForEffect(effect);

    // This is a very simple implementation - in a real app you'd want actual audio files
    const dataUrl = this.generateBeepDataUrl(frequency, duration);
    audio.src = dataUrl;

    try {
      await audio.play();
    } catch (error) {
      console.warn(`Failed to play sound effect "${effect}":`, error);
    }
  }

  private getFrequencyForEffect(effect: SoundEffect): number {
    switch (effect) {
      case "cardDeal":
        return 800;
      case "cardFlip":
        return 1200;
      case "chipPlace":
        return 600;
      case "chipWin":
        return 700;
      case "blackjack":
        return 1000;
      case "bust":
        return 300;
      case "win":
        return 500;
      case "lose":
        return 200;
      case "push":
        return 440;
      default:
        return 440;
    }
  }

  private getDurationForEffect(effect: SoundEffect): number {
    switch (effect) {
      case "cardDeal":
        return 0.1;
      case "cardFlip":
        return 0.05;
      case "chipPlace":
        return 0.1;
      case "chipWin":
        return 0.3;
      case "blackjack":
        return 0.5;
      case "bust":
        return 0.3;
      case "win":
        return 0.3;
      case "lose":
        return 0.4;
      case "push":
        return 0.2;
      default:
        return 0.1;
    }
  }

  private generateBeepDataUrl(): string {
    // This would generate a simple WAV file data URL
    // For simplicity, we'll just return a silent audio data URL
    return "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvW0gCg==";
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume)) / 100;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create and export the sound manager instance
export const soundManager: SoundManager = (() => {
  try {
    // Try to create Web Audio API manager first
    return new WebAudioSoundManager();
  } catch (error) {
    console.warn(
      "Web Audio API not available, using HTML5 Audio fallback:",
      error
    );
    return new HTML5AudioSoundManager();
  }
})();

// Convenience functions for common game events
export const playCardDeal = () => soundManager.play("cardDeal");
export const playCardFlip = () => soundManager.play("cardFlip");
export const playChipPlace = () => soundManager.play("chipPlace");
export const playChipWin = () => soundManager.play("chipWin");
export const playBlackjack = () => soundManager.play("blackjack");
export const playBust = () => soundManager.play("bust");
export const playWin = () => soundManager.play("win");
export const playLose = () => soundManager.play("lose");
export const playPush = () => soundManager.play("push");
