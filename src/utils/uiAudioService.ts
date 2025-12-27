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

export const playTap = () => synthSound(800, 0.04, 0.1);
export const playNav = () => synthSound(400, 0.06, 0.15);
export const playToggle = () => synthSound(1200, 0.03, 0.08);

export const playTitlePresence = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 0.05;
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