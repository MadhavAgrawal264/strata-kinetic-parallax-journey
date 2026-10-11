import { useState, useRef, useEffect } from 'react';
import { StrataRealm } from '../../types';
import { playAuroraChime, playUiClick } from '../../utils/audio';
import { Sparkles, Sliders, Sun, Shield } from 'lucide-react';

interface AuroraSectionProps {
  realm: StrataRealm;
  scrollY: number;
  sectionTop: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
}

export function AuroraSection({
  realm,
  scrollY,
  sectionTop,
  depthMultiplier,
  tiltEnabled
}: AuroraSectionProps) {
  const relScroll = scrollY - sectionTop;
  const bgOffsetY = relScroll * 0.15 * depthMultiplier;
  const midOffsetY = relScroll * 0.45 * depthMultiplier;
  const fgOffsetY = relScroll * 1.65 * depthMultiplier;

  const [solarSpeed, setSolarSpeed] = useState(480); // km/s
  const [magneticFlux, setMagneticFlux] = useState(54); // microteslas
  const auroraCanvasRef = useRef<HTMLCanvasElement>(null);

  // Aurora plasma wave canvas rendering
  useEffect(() => {
    const canvas = auroraCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.02 * (solarSpeed / 400);

      const w = canvas.width;
      const h = canvas.height;

      // Draw multi-layered waving auroral curtains
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, h);

        for (let x = 0; x <= w; x += 8) {
          const wave1 = Math.sin(x * 0.015 + step + layer) * 25;
          const wave2 = Math.cos(x * 0.03 - step * 1.5 + layer * 2) * 15;
          const baseHeight = h * 0.5 + layer * 18;
          const y = baseHeight + wave1 + wave2;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        if (magneticFlux > 60) {
          // Violet/purple high-flux
          grad.addColorStop(0, `rgba(168, 85, 247, ${0.45 - layer * 0.1})`);
          grad.addColorStop(0.5, `rgba(16, 185, 129, ${0.35 - layer * 0.1})`);
          grad.addColorStop(1, 'rgba(7, 6, 23, 0)');
        } else {
          // Emerald green standard oxygen excitation
          grad.addColorStop(0, `rgba(16, 185, 129, ${0.5 - layer * 0.1})`);
          grad.addColorStop(0.6, `rgba(6, 182, 212, ${0.3 - layer * 0.1})`);
          grad.addColorStop(1, 'rgba(7, 6, 23, 0)');
        }

        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [solarSpeed, magneticFlux]);

  const handleBurst = () => {
    playAuroraChime(Math.floor(Math.random() * 4));
    setSolarSpeed((prev) => Math.min(800, prev + 120));
  };

  return (
    <section
      id="aurora"
      className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-b from-[#030712] via-[#09081e] to-[#030712] border-t border-emerald-500/10"
    >
      {/* LAYER 0: Background Dipole Magnetic Field Curves (0.15x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-30"
        style={{ transform: `translate3d(0, ${bgOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-full text-emerald-500/20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M0,450 C360,150 1080,150 1440,450"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M0,450 C360,250 1080,250 1440,450"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M0,450 C360,350 1080,350 1440,450"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      {/* LAYER 1: Midground Glowing Auroral Curtain (0.45x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-40 flex items-center justify-center"
        style={{ transform: `translate3d(0, ${midOffsetY}px, 0)` }}
      >
        <div className="w-full h-[500px] bg-gradient-to-b from-emerald-500/10 via-purple-500/15 to-transparent blur-3xl transform -skew-y-3" />
      </div>

      {/* LAYER 2: Focal Content & Interactive Telemetry (1.00x velocity) */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              <span>{realm.index}. Strata Realm</span>
              <span aria-hidden="true">·</span>
              <span>{realm.coordinates}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight">
              {realm.name}
            </h2>
            <p className="mt-2 text-slate-300 max-w-xl text-base sm:text-lg">
              {realm.subtitle}
            </p>
          </div>

          <div className="flex flex-col md:items-end font-mono">
            <span className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">
              {realm.altitudeFormatted}
            </span>
            <span className="text-xs text-slate-400">Ionospheric Boundary · Geomagnetic Curtain</span>
          </div>
        </div>

        {/* Narrative & Aurora Tuner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Narrative & Metrics */}
          <div className="lg:col-span-6 bg-[#0c0a24]/80 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Plasma Excitation Physics
              </span>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed">
                {realm.description}
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                When solar coronal mass ejections strike Earth&apos;s magnetosphere, electrons spiral along geomagnetic field lines and collide with neutral oxygen atoms at 85 to 100 km altitude, producing the distinctive 557.7 nm spectral emission line of emerald-green aurora.
              </p>
            </div>

            {/* 4 Quantitative Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-emerald-500/15">
              {realm.keyMetrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{m.label}</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-emerald-400/80">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Aurora Resonance Tuner */}
          <div className="lg:col-span-6 bg-[#0c0a24]/80 border border-emerald-500/20 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Geomagnetic Plasma Resonance Visualizer
              </span>
              <button
                onClick={handleBurst}
                className="px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-md transition-colors"
              >
                Solar Pulse Burst
              </button>
            </div>

            {/* Aurora Canvas */}
            <div className="relative flex items-center justify-center bg-black/50 rounded-xl overflow-hidden border border-emerald-500/15 p-2">
              <canvas
                ref={auroraCanvasRef}
                width={360}
                height={210}
                onClick={handleBurst}
                className="cursor-pointer w-full max-w-[360px] h-[210px]"
                title="Click to trigger solar wind pulse"
              />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-emerald-400/80 pointer-events-none">
                ATOMIC OXYGEN EMISSION · λ = 557.7 nm
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400 pointer-events-none">
                CLICK TO EMIT SOLAR PULSE
              </div>
            </div>

            {/* Solar Wind & Magnetic Controls */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Solar Wind Velocity:</span>
                  <span className="text-emerald-300 font-bold tabular-nums">{solarSpeed} km/s</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="800"
                  value={solarSpeed}
                  onChange={(e) => {
                    setSolarSpeed(parseInt(e.target.value));
                    playUiClick();
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Geomagnetic Flux Density:</span>
                  <span className="text-purple-300 font-bold tabular-nums">{magneticFlux} µT</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={magneticFlux}
                  onChange={(e) => {
                    setMagneticFlux(parseInt(e.target.value));
                    playUiClick();
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground Ionized Cosmic Sparks & Micrometeors (1.65x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{ transform: `translate3d(0, ${fgOffsetY}px, 0)` }}
      >
        <div className="absolute top-1/4 left-1/5 w-24 h-0.5 bg-gradient-to-r from-emerald-400/70 to-transparent blur-xs transform -rotate-45" />
        <div className="absolute top-3/5 right-1/6 w-32 h-0.5 bg-gradient-to-r from-purple-400/70 to-transparent blur-xs transform -rotate-30" />
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-emerald-300/80 blur-xs" />
      </div>
    </section>
  );
}
