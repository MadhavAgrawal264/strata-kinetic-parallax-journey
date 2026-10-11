import { useState, useRef, useEffect } from 'react';
import { StrataRealm } from '../../types';
import { playSonarPing, playUiClick } from '../../utils/audio';
import { Radio, Gauge, Waves, Droplet, ArrowRight } from 'lucide-react';

interface AbyssSectionProps {
  realm: StrataRealm;
  scrollY: number;
  sectionTop: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
}

export function AbyssSection({
  realm,
  scrollY,
  sectionTop,
  depthMultiplier,
  tiltEnabled
}: AbyssSectionProps) {
  // Relative scroll offset within this section
  const relScroll = scrollY - sectionTop;

  // Parallax offsets
  const bgOffsetY = relScroll * 0.15 * depthMultiplier;
  const midOffsetY = relScroll * 0.45 * depthMultiplier;
  const fgOffsetY = relScroll * 1.65 * depthMultiplier;

  // Interactive Sonar State
  const [sonarPings, setSonarPings] = useState<{ id: number; x: number; y: number }[]>([]);
  const [probeDepth, setProbeDepth] = useState(10920);
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger sonar ping
  const handleTriggerSonar = (e?: React.MouseEvent) => {
    playSonarPing();
    const newPing = {
      id: Date.now(),
      x: e ? e.nativeEvent.offsetX : 150,
      y: e ? e.nativeEvent.offsetY : 150
    };
    setSonarPings((prev) => [...prev.slice(-4), newPing]);
  };

  // Draw sonar radar grid on canvas
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = Math.min(cx, cy) - 10;

      // Concentric rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach((factor) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * factor, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();

      // Rotating radar beam
      angle += 0.025;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + 0.4);
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Ping echoes
      sonarPings.forEach((p) => {
        const age = (Date.now() - p.id) / 1000;
        if (age < 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, age * 40, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, 1 - age / 2.5)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [sonarPings]);

  // Hydrostatic pressure calculation
  const calculatedAtm = Math.round((probeDepth / 10) + 1);

  return (
    <section
      id="abyss"
      className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-b from-[#030712] via-[#04131e] to-[#030712] border-t border-cyan-500/10"
    >
      {/* LAYER 0: Background Bathymetric Topography Curves (0.15x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-30"
        style={{ transform: `translate3d(0, ${bgOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-full text-cyan-500/20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 Q250,150 500,280 T1000,220 L1000,1000 L0,1000 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0,380 Q300,320 600,420 T1000,360 L1000,1000 L0,1000 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M0,560 Q200,620 500,530 T1000,600 L1000,1000 L0,1000 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M0,740 Q350,680 700,790 T1000,720 L1000,1000 L0,1000 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* LAYER 1: Midground Hydrothermal Rift & Basalt Spires (0.45x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-25 flex items-end"
        style={{ transform: `translate3d(0, ${midOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-80 text-cyan-900"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <polygon
            fill="currentColor"
            points="0,320 0,160 120,240 240,110 360,280 480,80 600,210 720,130 840,290 960,60 1080,240 1200,140 1320,270 1440,190 1440,320"
          />
        </svg>
      </div>

      {/* LAYER 2: Focal Content & Interactive Telemetry (1.00x velocity) */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Section Header with high contrast typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
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
            <span className="text-3xl sm:text-4xl font-bold text-cyan-400 tabular-nums">
              {realm.altitudeFormatted}
            </span>
            <span className="text-xs text-slate-400">Hydrostatic Datum · Mariana Trench</span>
          </div>
        </div>

        {/* Narrative & Key Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Narrative & Description */}
          <div className="lg:col-span-7 bg-[#05111c]/80 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Bathypelagic Dynamics
              </span>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed">
                {realm.description}
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Because sunlight disappears completely at the aphotic threshold (1,000 meters), all biological energy is driven by chemosynthesis around hydrothermal black smoker chimneys where volcanic mineral plumes erupt at over 380°C under immense pressure.
              </p>
            </div>

            {/* 4 Quantitative Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-cyan-500/15">
              {realm.keyMetrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{m.label}</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-cyan-400/80">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Micro-Interaction: Sonar Radar & Bathymetric Probe */}
          <div className="lg:col-span-5 bg-[#05111c]/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                Acoustic Sonar Ping Visualizer
              </span>
              <button
                onClick={() => handleTriggerSonar()}
                className="px-2.5 py-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md transition-colors"
              >
                Emit Pulse
              </button>
            </div>

            {/* Sonar Radar Canvas */}
            <div className="relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-cyan-500/15 p-2">
              <canvas
                ref={radarCanvasRef}
                width={300}
                height={220}
                onClick={handleTriggerSonar}
                className="cursor-crosshair w-full max-w-[300px] h-[220px]"
                title="Click anywhere to emit acoustic sonar ping"
              />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-400/80 pointer-events-none">
                FREQ: 14.5 kHz · SPEED: 1,532 m/s
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400 pointer-events-none">
                CLICK TO PING
              </div>
            </div>

            {/* Bathymetric Hydrostatic Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Hydrostatic Probe Depth:</span>
                <span className="text-cyan-300 font-bold tabular-nums">-{probeDepth.toLocaleString()} m</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10920"
                step="100"
                value={probeDepth}
                onChange={(e) => {
                  setProbeDepth(parseInt(e.target.value));
                  playUiClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-300">
                <span>Calculated Pressure:</span>
                <span className="text-white font-bold tabular-nums">{calculatedAtm} atmospheres</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground Bioluminescent Particles & Caustics (1.65x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{ transform: `translate3d(0, ${fgOffsetY}px, 0)` }}
      >
        <div className="absolute top-1/5 left-1/6 w-4 h-4 rounded-full bg-cyan-400/40 blur-xs animate-ping" />
        <div className="absolute top-2/3 right-1/8 w-5 h-5 rounded-full bg-cyan-300/30 blur-sm" />
        <div className="absolute bottom-1/6 left-2/5 w-3 h-3 rounded-full bg-teal-400/50 blur-xs" />
        <div className="absolute top-1/2 left-3/4 w-8 h-8 rounded-full bg-cyan-500/20 blur-md" />
      </div>
    </section>
  );
}
