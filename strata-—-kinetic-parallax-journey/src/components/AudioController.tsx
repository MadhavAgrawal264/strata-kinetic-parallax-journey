import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Music, Sliders, ChevronDown, ChevronUp, Waves, Wind, Sparkles, Orbit } from 'lucide-react';
import {
  getAudioMuted,
  setAudioMuted,
  getMasterVolume,
  setMasterVolume,
  playAmbientSoundscape,
  getActiveAmbientRealm,
  getAudioFrequencyData,
  subscribeAudioState,
  playUiClick
} from '../utils/audio';

interface AudioControllerProps {
  currentScrolledRealmId: string;
  autoSyncWithScroll: boolean;
  onToggleAutoSync: (val: boolean) => void;
}

const REALM_SOUND_METADATA: {
  [key: string]: {
    name: string;
    profile: string;
    freqRange: string;
    color: string;
    icon: typeof Waves;
  };
} = {
  abyss: {
    name: 'Hadal Trench',
    profile: 'Sub-bass Hydrostatic Drone & Sonar Ping',
    freqRange: '46 - 95 Hz',
    color: '#06b6d4',
    icon: Waves
  },
  lithosphere: {
    name: 'Alpine Crags',
    profile: 'Rock Ridge Gale & Glacial Wind Sweep',
    freqRange: '180 - 360 Hz',
    color: '#f59e0b',
    icon: Wind
  },
  troposphere: {
    name: 'Jet Stream',
    profile: 'High-Altitude Howling Vapor Vortex',
    freqRange: '420 - 740 Hz',
    color: '#38bdf8',
    icon: Wind
  },
  aurora: {
    name: 'Geomagnetic Aurora',
    profile: 'Ionized Plasma Shimmer & Sacred Chords',
    freqRange: '432 - 648 Hz',
    color: '#10b981',
    icon: Sparkles
  },
  exosphere: {
    name: 'Orbital Void',
    profile: 'Deep Space Vacuum Static & Telemetry Chirps',
    freqRange: '110 Hz & 2.2 kHz',
    color: '#a855f7',
    icon: Orbit
  }
};

export function AudioController({
  currentScrolledRealmId,
  autoSyncWithScroll,
  onToggleAutoSync
}: AudioControllerProps) {
  const [muted, setMuted] = useState(getAudioMuted());
  const [volume, setVolume] = useState(getMasterVolume());
  const [activeRealm, setActiveRealm] = useState<string>(getActiveAmbientRealm() || currentScrolledRealmId);
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subscribe to audio state changes
  useEffect(() => {
    return subscribeAudioState(() => {
      setMuted(getAudioMuted());
      setVolume(getMasterVolume());
      const current = getActiveAmbientRealm();
      if (current) setActiveRealm(current);
    });
  }, []);

  // When auto-sync is on, switch ambient soundscape when user scrolls to a different realm
  useEffect(() => {
    if (autoSyncWithScroll && !muted) {
      playAmbientSoundscape(currentScrolledRealmId);
      setActiveRealm(currentScrolledRealmId);
    }
  }, [currentScrolledRealmId, autoSyncWithScroll, muted]);

  // Audio Equalizer Visualizer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const data = getAudioFrequencyData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 12;
      const barWidth = 3;
      const gap = 2;
      const totalWidth = numBars * (barWidth + gap);
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < numBars; i++) {
        const val = muted ? 2 : Math.max(3, (data[i * 2] || 0) / 255 * (canvas.height - 2));
        const x = startX + i * (barWidth + gap);
        const y = canvas.height - val;

        const currentMeta = REALM_SOUND_METADATA[activeRealm] || REALM_SOUND_METADATA['abyss'];
        ctx.fillStyle = muted ? 'rgba(148, 163, 184, 0.3)' : currentMeta.color;
        ctx.fillRect(x, y, barWidth, val);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [muted, activeRealm]);

  const toggleMute = () => {
    playUiClick();
    const nextMuted = !muted;
    setAudioMuted(nextMuted);
    setMuted(nextMuted);
    if (!nextMuted) {
      playAmbientSoundscape(activeRealm || currentScrolledRealmId);
    }
  };

  const selectRealmSound = (id: string) => {
    playUiClick();
    setActiveRealm(id);
    if (muted) {
      setAudioMuted(false);
      setMuted(false);
    }
    playAmbientSoundscape(id);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMasterVolume(v);
    if (muted && v > 0) {
      setAudioMuted(false);
      setMuted(false);
    }
  };

  const currentMeta = REALM_SOUND_METADATA[activeRealm] || REALM_SOUND_METADATA['abyss'];
  const IconComponent = currentMeta.icon;

  return (
    <div
      aria-label="Environmental Soundscape Audio Controller"
      className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2 select-none"
    >
      {/* Expanded Soundscape Control Deck */}
      {isExpanded && (
        <div className="bg-[#070b14]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md w-80 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col gap-4 text-xs">
          {/* Deck Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white font-display text-sm">
                Soundscape Synthesizer
              </span>
            </div>
            <button
              onClick={() => {
                playUiClick();
                setIsExpanded(false);
              }}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Active Soundscape Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Active Soundscape
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: muted ? '#64748b' : currentMeta.color }}
              />
            </div>
            <div className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" style={{ color: currentMeta.color }} />
              <span className="font-semibold text-white text-xs">{currentMeta.name}</span>
            </div>
            <span className="text-[11px] text-slate-300 leading-tight">
              {currentMeta.profile}
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
              <span>Acoustic Spectrum:</span>
              <span className="text-white font-bold">{currentMeta.freqRange}</span>
            </div>
          </div>

          {/* Master Volume Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Master Level:</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {muted ? 'MUTED' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 rounded-full"
              />
            </div>
          </div>

          {/* Auto-Sync with Scroll Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-slate-200 text-[11px] font-medium">Auto-Follow Strata Scroll</span>
              <span className="text-[10px] text-slate-400">Crossfades as you scroll realms</span>
            </div>
            <button
              onClick={() => {
                playUiClick();
                onToggleAutoSync(!autoSyncWithScroll);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-md border transition-colors ${
                autoSyncWithScroll
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
            >
              {autoSyncWithScroll ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Manual Audition Buttons */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Audition Realms
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(REALM_SOUND_METADATA).map(([id, meta]) => (
                <button
                  key={id}
                  onClick={() => selectRealmSound(id)}
                  className={`px-2 py-1.5 rounded-lg text-left transition-all border flex items-center gap-1.5 ${
                    activeRealm === id && !muted
                      ? 'bg-white/10 border-white/30 text-white font-medium'
                      : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="truncate text-[10px] font-mono">{meta.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compact Dock Pill */}
      <div className="flex items-center gap-2 bg-[#070b14]/90 hover:bg-[#070b14] border border-white/10 hover:border-white/20 rounded-full px-3.5 py-2 shadow-2xl backdrop-blur-md transition-all group">
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute ambient soundscape' : 'Mute ambient soundscape'}
          className="p-1 rounded-full text-slate-400 group-hover:text-white transition-colors"
          title={muted ? 'Unmute Soundscape' : 'Mute Soundscape'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Live Audio Equalizer Visualizer Canvas */}
        <canvas
          ref={canvasRef}
          width={40}
          height={16}
          className="cursor-pointer"
          onClick={() => {
            playUiClick();
            setIsExpanded(!isExpanded);
          }}
          title="Click to open soundscape synthesizer deck"
        />

        {/* Active Soundscape Label */}
        <button
          onClick={() => {
            playUiClick();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
        >
          <span className="max-w-[120px] truncate font-medium">
            {muted ? 'Sound Muted' : currentMeta.name}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
