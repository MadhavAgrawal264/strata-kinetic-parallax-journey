import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Sliders, Volume2, VolumeX } from 'lucide-react';
import { STRATA_REALMS } from '../data/realms';
import { playUiClick, getAudioMuted, setAudioMuted, subscribeAudioState } from '../utils/audio';

interface TelemetryHudProps {
  currentAltitude: number;
  activeRealmIndex: number;
  depthMultiplier: number;
  onSetDepthMultiplier: (val: number) => void;
  onOpenPerspectiveLab: () => void;
}

export function TelemetryHud({
  currentAltitude,
  activeRealmIndex,
  depthMultiplier,
  onSetDepthMultiplier,
  onOpenPerspectiveLab
}: TelemetryHudProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [muted, setMuted] = useState(getAudioMuted());

  useEffect(() => {
    return subscribeAudioState(() => {
      setMuted(getAudioMuted());
    });
  }, []);

  const toggleMute = () => {
    playUiClick();
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  };

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const p = Math.min(Math.max(window.scrollY / total, 0), 1);
        setScrollProgress(p);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRealm = (id: string) => {
    playUiClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formattedAlt = currentAltitude >= 0
    ? `+${currentAltitude.toLocaleString()} m`
    : `${currentAltitude.toLocaleString()} m`;

  const activeRealm = STRATA_REALMS[activeRealmIndex] || STRATA_REALMS[0];

  return (
    <aside
      aria-label="Strata Telemetry & Parallax Controls"
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3 pointer-events-none select-none"
    >
      {/* Altimeter Telemetry Card */}
      <div className="pointer-events-auto bg-[#030712]/80 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-2xl flex flex-col gap-2 min-w-[170px] text-right">
        <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 border-b border-white/5 pb-1.5">
          <span className="font-mono uppercase tracking-wider text-[10px]">Altitude Telemetry</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeRealm.accentColor }} />
        </div>

        <div className="flex flex-col">
          <span className="text-lg font-bold font-mono tabular-nums tracking-tight text-white">
            {formattedAlt}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
            {activeRealm.name}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>Atmosphere:</span>
          <span className="text-white">{activeRealm.pressure}</span>
        </div>

        {/* Quick Parallax Depth Factor Chips */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
          <span className="text-[10px] text-slate-400 font-mono">Depth:</span>
          <div className="flex items-center gap-1">
            {[0.5, 1.0, 1.6].map((factor) => (
              <button
                key={factor}
                onClick={() => {
                  playUiClick();
                  onSetDepthMultiplier(factor);
                }}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  Math.abs(depthMultiplier - factor) < 0.1
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {factor}x
              </button>
            ))}
          </div>
        </div>

        {/* Ambient Soundscape Mute Toggle Row */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
          <span className="text-[10px] text-slate-400 font-mono">Audio:</span>
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Unmute ambient soundscape' : 'Mute ambient soundscape'}
            className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all flex items-center gap-1.5 border ${
              !muted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white bg-white/5 border-white/10'
            }`}
          >
            {muted ? (
              <VolumeX className="w-3 h-3 text-slate-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-cyan-400" />
            )}
            <span>{muted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </div>

      {/* Vertical Spine with Realm Steps */}
      <div className="pointer-events-auto bg-[#030712]/70 backdrop-blur-md border border-white/10 rounded-full py-3 px-2 flex flex-col items-center gap-3 shadow-lg">
        <button
          onClick={() => {
            playUiClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Scroll to top"
          className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        <div className="flex flex-col items-center gap-2.5 relative">
          {/* Progress fill track */}
          <div className="w-0.5 h-32 bg-white/10 relative rounded-full overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-cyan-400 via-amber-400 to-purple-400 transition-all duration-150 rounded-full"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Quick realm dots */}
          <div className="absolute top-0 bottom-0 flex flex-col justify-between items-center pointer-events-auto">
            {STRATA_REALMS.map((realm, idx) => (
              <button
                key={realm.id}
                onClick={() => scrollToRealm(realm.id)}
                title={`${realm.name} (${realm.altitudeFormatted})`}
                aria-label={`Jump to ${realm.name}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 border ${
                  activeRealmIndex === idx
                    ? 'border-white scale-125 shadow-sm'
                    : 'border-white/20 hover:border-white/60 bg-[#030712]'
                }`}
                style={{
                  backgroundColor: activeRealmIndex === idx ? realm.accentColor : undefined
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            playUiClick();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
          aria-label="Scroll to bottom"
          className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
