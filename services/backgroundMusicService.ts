
/**
 * V_14_FLUENTFAST — BACKGROUND MUSIC SERVICE v1.1
 * Procedural game-style loop synthesizer with fade-in/out logic.
 * Updated: 15% volume floor, 4s fade-out.
 */

let audioCtx: AudioContext | null = null;
let mainGain: GainNode | null = null;
let isPlaying = false;
let schedulerTimer: number | null = null;
let currentNote = 0;

const BPM = 124;
const NOTE_DURATION = 60 / BPM / 2; // Eighth notes

// Simple Pentatonic Arpeggio Loop
const MELODY = [60, 64, 67, 72, 67, 64, 60, 55]; // MIDI notes
const BASS = [36, 36, 43, 43, 31, 31, 36, 36];

const initContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    mainGain = audioCtx.createGain();
    mainGain.connect(audioCtx.destination);
    mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return { ctx: audioCtx, gain: mainGain! };
};

const playGameNote = (ctx: AudioContext, gainNode: GainNode, freq: number, type: OscillatorType, volume: number, length: number) => {
  const osc = ctx.createOscillator();
  const noteGain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  noteGain.gain.setValueAtTime(volume, ctx.currentTime);
  noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);
  
  osc.connect(noteGain);
  noteGain.connect(gainNode);
  
  osc.start();
  osc.stop(ctx.currentTime + length);
};

const mToF = (m: number) => Math.pow(2, (m - 69) / 12) * 440;

const schedule = () => {
  if (!isPlaying || !audioCtx || !mainGain) return;
  
  const mNote = MELODY[currentNote % MELODY.length];
  const bNote = BASS[Math.floor(currentNote / 2) % BASS.length];
  
  // Play Arpeggio (Square)
  playGameNote(audioCtx, mainGain, mToF(mNote), 'square', 0.04, NOTE_DURATION * 0.8);
  
  // Play Bass (Triangle)
  if (currentNote % 4 === 0) {
    playGameNote(audioCtx, mainGain, mToF(bNote), 'triangle', 0.15, NOTE_DURATION * 3.5);
  }

  currentNote++;
  schedulerTimer = window.setTimeout(schedule, NOTE_DURATION * 1000);
};

export const startMusic = () => {
  if (isPlaying) return;
  const { ctx, gain } = initContext();
  isPlaying = true;
  currentNote = 0;
  
  // Volume 15% target (0.15), fade in over 2s
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setTargetAtTime(0.15, ctx.currentTime, 0.8);
  
  schedule();
};

export const stopMusic = () => {
  if (!isPlaying || !audioCtx || !mainGain) return;
  isPlaying = false;
  if (schedulerTimer) clearTimeout(schedulerTimer);
  
  // Fade out over exactly 4 seconds
  mainGain.gain.cancelScheduledValues(audioCtx.currentTime);
  mainGain.gain.setValueAtTime(mainGain.gain.value, audioCtx.currentTime);
  mainGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 4);
};

export const isMusicActive = () => isPlaying;
