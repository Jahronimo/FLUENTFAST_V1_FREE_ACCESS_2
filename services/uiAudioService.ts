
/**
 * V__9_FLUENTFAST — UI AUDIO FLOOR SPEC v1.0
 * V__10_FLUENTFAST — MOTION AUDIO LAYER SPEC v1.0
 * V_11_PATCH — ANIMATED TITLE PRESENCE SOUND
 * V_11_PATCH — APP LAUNCH PRESENCE SOUND
 * V_11_PATCH — HOME ENTRY PRESENCE SOUND (3.10)
 * V_12.1_PATCH — PAGE TRANSITION AUDIO NEUTRALIZATION
 * 
 * Synthesized audio floor for tactile feedback, motion realism, and structural arrival.
 */

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Shared noise buffer for whispery and airy components.
 */
const getNoiseBuffer = (ctx: AudioContext) => {
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
};

const synthSound = (freq: number, duration: number, volume: number = 0.15) => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {}
};

/**
 * §3.1 PRIMARY UI TAP SOUND
 */
export const playTap = () => synthSound(800, 0.04, 0.1);

/**
 * §3.2 NAVIGATION CONFIRM SOUND
 */
export const playNav = () => synthSound(400, 0.06, 0.15);

/**
 * §3.3 TOGGLE SOUND
 */
export const playToggle = () => synthSound(1200, 0.03, 0.08);

/**
 * §3.6 TITLE ANIMATION PRESENCE SOUND (V11)
 * Intent: "Something important has arrived."
 * Character: Soft whoom, 20–60ms, airy arrival.
 */
export const playTitlePresence = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 0.05; // 50ms

    // Tonal component
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.06, now + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);

    // Airy component
    const source = ctx.createBufferSource();
    source.buffer = getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  } catch (e) {}
};

/**
 * §3.7 LETTER MOTION SOUND
 */
export const playLetterMotion = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000;
    filter.Q.value = 1.0;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.1);
  } catch (e) {}
};

/**
 * §3.8 PAGE TRANSITION SOUND
 * Neutralized by V_12.1.
 */
export const playPageTransition = () => {
  // Neutralized: ALL PAGE TRANSITIONS ARE SILENT
};

/**
 * §3.9 APP LAUNCH PRESENCE SOUND
 */
export const playAppLaunchPresence = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 0.4;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(165, now + duration);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {}
};

/**
 * §3.10 HOME ENTRY PRESENCE SOUND (PRODUCTION)
 * Intent: "I am here. Ready."
 */
export const playHomeEntryPresence = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 0.35; 

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + duration);

    filter.type = 'lowpass';
    filter.frequency.value = 600;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {}
};
