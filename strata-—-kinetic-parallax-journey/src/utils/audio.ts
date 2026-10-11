// Web Audio API procedural sound synthesis for ambient soundscapes & micro-interactions

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;

let isMuted = true; // muted by default for browser autoplay policy & polite UX
let masterVolume = 0.6; // 0.0 to 1.0
let activeRealmId: string | null = null;

// Ambient nodes registry for clean crossfading
let currentAmbientNodes: {
  stop: () => void;
} | null = null;

let timerInterval: number | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribeAudioState(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);

      // Analyser for UI visualizers
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;
      analyserNode.smoothingTimeConstant = 0.8;

      masterGain.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);

      // Dedicated Ambient bus
      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
      ambientGain.connect(masterGain);
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
  const ctx = getAudioContext();
  if (ctx && masterGain) {
    masterGain.gain.setTargetAtTime(muted ? 0 : masterVolume, ctx.currentTime, 0.05);
  }
  if (!muted && !currentAmbientNodes && activeRealmId) {
    playAmbientSoundscape(activeRealmId);
  }
  notifyListeners();
}

export function getAudioMuted(): boolean {
  return isMuted;
}

export function setMasterVolume(vol: number) {
  masterVolume = Math.max(0, Math.min(1, vol));
  const ctx = getAudioContext();
  if (ctx && masterGain && !isMuted) {
    masterGain.gain.setTargetAtTime(masterVolume, ctx.currentTime, 0.05);
  }
  notifyListeners();
}

export function getMasterVolume(): number {
  return masterVolume;
}

export function getActiveAmbientRealm(): string | null {
  return activeRealmId;
}

export function getAudioFrequencyData(): Uint8Array {
  if (!analyserNode) return new Uint8Array(16);
  const data = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(data);
  return data;
}

// ==========================================
// AMBIENT SOUNDSCAPES FOR EACH STRATA REALM
// ==========================================

export function playAmbientSoundscape(realmId: string) {
  activeRealmId = realmId;
  const ctx = getAudioContext();
  if (!ctx || !ambientGain) {
    notifyListeners();
    return;
  }

  // Crossfade out previous soundscape
  if (currentAmbientNodes) {
    currentAmbientNodes.stop();
    currentAmbientNodes = null;
  }

  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }

  const now = ctx.currentTime;
  const realmGain = ctx.createGain();
  realmGain.gain.setValueAtTime(0.001, now);
  realmGain.gain.exponentialRampToValueAtTime(0.65, now + 0.8);
  realmGain.connect(ambientGain);

  const cleanupFns: (() => void)[] = [];

  if (realmId === 'abyss') {
    // 1. HADAL ABYSS: Deep-sea oceanic hydrostatic sub-bass rumble & gentle distant sonar
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const droneGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(46, now); // Sub-bass 46Hz
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(53, now); // 53Hz creates slow binaural 7Hz hydrostatic beating

    droneGain.gain.setValueAtTime(0.35, now);
    osc1.connect(droneGain);
    osc2.connect(droneGain);

    // Deep water pressure noise (low-pass filtered white noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(95, now);
    lpFilter.Q.setValueAtTime(2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);

    noiseSrc.connect(lpFilter);
    lpFilter.connect(noiseGain);
    noiseGain.connect(realmGain);
    droneGain.connect(realmGain);

    osc1.start(now);
    osc2.start(now);
    noiseSrc.start(now);

    cleanupFns.push(() => {
      try {
        osc1.stop();
        osc2.stop();
        noiseSrc.stop();
      } catch (_) {}
    });

    // Periodic gentle distant sonar ping every 6 seconds
    timerInterval = window.setInterval(() => {
      if (!isMuted && activeRealmId === 'abyss') {
        const pingTime = ctx.currentTime;
        const pingOsc = ctx.createOscillator();
        const pGain = ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(840, pingTime);
        pingOsc.frequency.exponentialRampToValueAtTime(420, pingTime + 0.8);

        pGain.gain.setValueAtTime(0.08, pingTime);
        pGain.gain.exponentialRampToValueAtTime(0.0001, pingTime + 1.4);

        pingOsc.connect(pGain);
        pGain.connect(realmGain);
        pingOsc.start(pingTime);
        pingOsc.stop(pingTime + 1.4);
      }
    }, 6000);

  } else if (realmId === 'lithosphere') {
    // 2. LITHOSPHERE: Alpine gust wind & subtle low rocky resonance
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    // Resonant bandpass filter sweeping between 200Hz and 360Hz
    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(260, now);
    bpFilter.Q.setValueAtTime(3.5, now);

    // LFO to slowly sweep wind frequency
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, now); // slow 5s wind gust cycle
    lfoGain.gain.setValueAtTime(80, now);

    lfo.connect(lfoGain);
    lfoGain.connect(bpFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.3, now);

    noiseSrc.connect(bpFilter);
    bpFilter.connect(windGain);
    windGain.connect(realmGain);

    noiseSrc.start(now);
    lfo.start(now);

    cleanupFns.push(() => {
      try {
        noiseSrc.stop();
        lfo.stop();
      } catch (_) {}
    });

  } else if (realmId === 'troposphere') {
    // 3. TROPOSPHERE: High-velocity jet stream wind howling
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    // Howling bandpass filter centered around 580Hz
    const bpFilter = ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(580, now);
    bpFilter.Q.setValueAtTime(5.0, now); // High Q for vocal howling tone

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'triangle';
    lfo.frequency.setValueAtTime(0.45, now);
    lfoGain.gain.setValueAtTime(160, now);

    lfo.connect(lfoGain);
    lfoGain.connect(bpFilter.frequency);

    const howlGain = ctx.createGain();
    howlGain.gain.setValueAtTime(0.25, now);

    noiseSrc.connect(bpFilter);
    bpFilter.connect(howlGain);
    howlGain.connect(realmGain);

    noiseSrc.start(now);
    lfo.start(now);

    cleanupFns.push(() => {
      try {
        noiseSrc.stop();
        lfo.stop();
      } catch (_) {}
    });

  } else if (realmId === 'aurora') {
    // 4. AURORA: Geomagnetic ethereal crystalline chords & plasma hum
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const auraGain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, now); // Sacred A4 432Hz
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(436.5, now); // Detuned for 4.5Hz shimmer beating
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(648, now); // Perfect 5th harmonic E5

    // Tremolo LFO
    const tremolo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(0.6, now);
    tremoloGain.gain.setValueAtTime(0.04, now);

    auraGain.gain.setValueAtTime(0.18, now);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(auraGain.gain);

    osc1.connect(auraGain);
    osc2.connect(auraGain);
    osc3.connect(auraGain);
    auraGain.connect(realmGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    tremolo.start(now);

    cleanupFns.push(() => {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        tremolo.stop();
      } catch (_) {}
    });

  } else if (realmId === 'exosphere') {
    // 5. EXOSPHERE: Space vacuum static, solar radiation hum & cosmic telemetry
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    // High bandpass for cosmic static hiss
    const staticFilter = ctx.createBiquadFilter();
    staticFilter.type = 'bandpass';
    staticFilter.frequency.setValueAtTime(2200, now);
    staticFilter.Q.setValueAtTime(2.5, now);

    const staticGain = ctx.createGain();
    staticGain.gain.setValueAtTime(0.12, now);

    // Deep cosmic carrier wave hum (110Hz + 220Hz octave)
    const humOsc = ctx.createOscillator();
    const humGain = ctx.createGain();
    humOsc.type = 'triangle';
    humOsc.frequency.setValueAtTime(110, now);
    humGain.gain.setValueAtTime(0.1, now);

    noiseSrc.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(realmGain);

    humOsc.connect(humGain);
    humGain.connect(realmGain);

    noiseSrc.start(now);
    humOsc.start(now);

    cleanupFns.push(() => {
      try {
        noiseSrc.stop();
        humOsc.stop();
      } catch (_) {}
    });

    // Periodic telemetry radio chirp every 4.5 seconds
    timerInterval = window.setInterval(() => {
      if (!isMuted && activeRealmId === 'exosphere') {
        const chirpTime = ctx.currentTime;
        const chirpOsc = ctx.createOscillator();
        const cGain = ctx.createGain();

        chirpOsc.type = 'sine';
        chirpOsc.frequency.setValueAtTime(1520, chirpTime);
        chirpOsc.frequency.setValueAtTime(1860, chirpTime + 0.05);

        cGain.gain.setValueAtTime(0.04, chirpTime);
        cGain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.25);

        chirpOsc.connect(cGain);
        cGain.connect(realmGain);
        chirpOsc.start(chirpTime);
        chirpOsc.stop(chirpTime + 0.25);
      }
    }, 4500);
  }

  currentAmbientNodes = {
    stop: () => {
      const stopNow = ctx.currentTime;
      realmGain.gain.setTargetAtTime(0.0001, stopNow, 0.2);
      window.setTimeout(() => {
        cleanupFns.forEach((fn) => fn());
        try {
          realmGain.disconnect();
        } catch (_) {}
      }, 400);
    }
  };

  notifyListeners();
}

export function stopAmbientSoundscape() {
  activeRealmId = null;
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  if (currentAmbientNodes) {
    currentAmbientNodes.stop();
    currentAmbientNodes = null;
  }
  notifyListeners();
}

// ==========================================
// TACTILE MICRO-INTERACTION SOUNDS
// ==========================================

// 1. Acoustic Sonar Ping (Hadal Abyss)
export function playSonarPing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 1.2);
}

// 2. Resonant Mineral Tone (Lithosphere)
export function playMineralTone(freq: number = 320) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 1.5, now);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.8);
  osc2.stop(now + 0.8);
}

// 3. High Altitude Wind Breeze (Troposphere)
export function playWindBreeze() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.05;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.3);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noise.start(now);
}

// 4. Aurora Harmonic Chime (Mesosphere)
export function playAuroraChime(harmonic = 1) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const targetNote = notes[harmonic % notes.length];

  osc.type = 'sine';
  osc.frequency.setValueAtTime(targetNote, now);
  osc.frequency.exponentialRampToValueAtTime(targetNote * 1.02, now + 0.4);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.9);
}

// 5. Orbital Radar Glint (Exosphere)
export function playOrbitalPing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1480, now);
  osc.frequency.setValueAtTime(1960, now + 0.08);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.3);
}

// 6. Subtle Micro UI Click
export function playUiClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.03);
}
