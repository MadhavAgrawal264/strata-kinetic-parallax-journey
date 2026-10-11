import { useState, useRef, useEffect } from 'react';
import { StrataRealm } from '../../types';
import { playWindBreeze, playUiClick } from '../../utils/audio';
import { Cloud, Wind, Compass, Zap } from 'lucide-react';

interface TroposphereSectionProps {
  realm: StrataRealm;
  scrollY: number;
  sectionTop: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
}

export function TroposphereSection({
  realm,
  scrollY,
  sectionTop,
  depthMultiplier,
  tiltEnabled
}: TroposphereSectionProps) {
  const relScroll = scrollY - sectionTop;
  const bgOffsetY = relScroll * 0.15 * depthMultiplier;
  const midOffsetY = relScroll * 0.45 * depthMultiplier;
  const fgOffsetY = relScroll * 1.65 * depthMultiplier;

  const [airVelocity, setAirVelocity] = useState(310); // km/h
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 150, y: 110 });

  // Aerodynamic streamline particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; speed: number; length: number }[] = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (2 + Math.random() * 3) * (airVelocity / 200),
        length: 15 + Math.random() * 25
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(3, 15, 36, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Draw obstacle (virtual airfoil foil at mouse)
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Update & draw particles
      particles.forEach((p) => {
        // Streamline deflection around mouse
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40 && dist > 0) {
          p.y += (dy / dist) * 2;
        }

        p.x += p.speed;
        if (p.x > canvas.width) {
          p.x = 0;
          p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.moveTo(p.x - p.length, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [airVelocity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Mach number calculation (speed of sound ~ 1060 km/h at -56C)
  const machNumber = (airVelocity / 1060).toFixed(2);

  return (
    <section
      id="troposphere"
      className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-b from-[#030712] via-[#041528] to-[#030712] border-t border-sky-500/10"
    >
      {/* LAYER 0: Background Cirrus Vapor Bands & Twilight Horizon (0.15x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-35"
        style={{ transform: `translate3d(0, ${bgOffsetY}px, 0)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(56,189,248,0.12),transparent_70%)]" />
        <svg
          className="w-full h-full text-sky-400/20"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 C300,180 600,240 900,190 C1200,140 1350,220 1440,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0,350 C250,380 700,320 1000,360 C1250,400 1380,340 1440,350"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </svg>
      </div>

      {/* LAYER 1: Midground Undulating Cumulus Cloud Banks (0.45x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-40 flex items-end"
        style={{ transform: `translate3d(0, ${midOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-96 text-sky-950/60"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,218.7C672,224,768,192,864,176C960,160,1056,160,1152,176C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* LAYER 2: Focal Content & Interactive Telemetry (1.00x velocity) */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sky-500/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-widest mb-2">
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
            <span className="text-3xl sm:text-4xl font-bold text-sky-400 tabular-nums">
              {realm.altitudeFormatted}
            </span>
            <span className="text-xs text-slate-400">Tropopause Ceiling · Subcooled Vapor</span>
          </div>
        </div>

        {/* Narrative & Streamline Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Narrative & Metrics */}
          <div className="lg:col-span-6 bg-[#041528]/80 border border-sky-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
                Atmospheric Fluid Dynamics
              </span>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed">
                {realm.description}
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                At eleven kilometers altitude, the air temperature stabilizes around -56.5°C. The pressure falls to barely 226 hPa—less than one quarter of sea level. Water vapor crystallizes instantly into delicate hexagonal ice prisms forming towering cirrus plumes.
              </p>
            </div>

            {/* 4 Quantitative Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-sky-500/15">
              {realm.keyMetrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{m.label}</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-sky-400/80">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Streamline Visualizer */}
          <div className="lg:col-span-6 bg-[#041528]/80 border border-sky-500/20 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-sky-500/15 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-sky-400" />
                Aerodynamic Jet Stream Tunnel
              </span>
              <button
                onClick={() => {
                  playWindBreeze();
                }}
                className="px-2.5 py-1 text-[11px] font-mono text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 rounded-md transition-colors"
              >
                Trigger Gust
              </button>
            </div>

            {/* Streamline Canvas */}
            <div className="relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden border border-sky-500/15 p-2">
              <canvas
                ref={canvasRef}
                width={360}
                height={210}
                onMouseMove={handleMouseMove}
                className="cursor-crosshair w-full max-w-[360px] h-[210px]"
                title="Hover cursor to deflect aerodynamic streamlines"
              />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-sky-400/80 pointer-events-none">
                LAMINAR FLOW DEFLECTION · AIR DENSITY: 0.36 kg/m³
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400 pointer-events-none">
                HOVER TO DISTURB STREAMLINES
              </div>
            </div>

            {/* Velocity Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Jet Stream Speed:</span>
                <span className="text-sky-300 font-bold tabular-nums">{airVelocity} km/h (Mach {machNumber})</span>
              </div>
              <input
                type="range"
                min="120"
                max="450"
                value={airVelocity}
                onChange={(e) => {
                  setAirVelocity(parseInt(e.target.value));
                  playUiClick();
                }}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Vapor Supersaturation:</span>
                <span className="text-white font-bold">124% (Subcooled Ice Nucleation)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground High-Speed Vapor Streaks (1.65x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{ transform: `translate3d(0, ${fgOffsetY}px, 0)` }}
      >
        <div className="absolute top-1/3 left-1/12 w-28 h-0.5 bg-gradient-to-r from-transparent via-sky-300/40 to-transparent blur-xs transform -rotate-6" />
        <div className="absolute top-2/3 right-1/8 w-36 h-0.5 bg-gradient-to-r from-transparent via-sky-200/50 to-transparent blur-xs transform -rotate-3" />
        <div className="absolute bottom-1/5 left-1/3 w-20 h-0.5 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent blur-xs transform rotate-2" />
      </div>
    </section>
  );
}
