// Synthesized page-turn sound using Web Audio API — no external files needed

let audioCtx: AudioContext | null = null;
let soundEnabled = localStorage.getItem('grimoire-sound') !== 'off';

export function isSoundEnabled() { return soundEnabled; }
export function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('grimoire-sound', soundEnabled ? 'on' : 'off');
  return soundEnabled;
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Play a subtle page-turn / paper rustle sound.
 * Uses filtered noise with a quick amplitude envelope.
 */
export function playPageTurn(volume = 0.12) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const duration = 0.35;
    const now = ctx.currentTime;

    // Create noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter — paper-like frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.value = 0.8;

    // High shelf to add some crispness
    const highShelf = ctx.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 4000;
    highShelf.gain.value = -6;

    // Amplitude envelope — quick attack, smooth decay
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(volume * 0.6, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(highShelf);
    highShelf.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration);
  } catch {
    // Silently fail — audio is non-critical
  }
}

/**
 * Play a subtle quill/ink writing sound for form opens.
 */
export function playQuillSound(volume = 0.08) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const duration = 0.2;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + duration);
  } catch {
    // Silently fail
  }
}
