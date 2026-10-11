import { useState, useRef, useEffect } from 'react';
import { StrataRealm } from '../../types';
import { playOrbitalPing, playUiClick } from '../../utils/audio';
import { Orbit, Compass, Radio, Globe, ArrowUpRight } from 'lucide-react';

interface ExosphereSectionProps {
  realm: StrataRealm;
  scrollY: number;
  sectionTop: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
}

export function ExosphereSection({
  realm,
  scrollY,
  sectionTop,
  depthMultiplier,
  tiltEnabled
}: ExosphereSectionProps) {
  const relScroll = scrollY - sectionTop;
  const bgOffsetY = relScroll * 0.08 * depthMultiplier;
  const midOffsetY = relScroll * 0.40 * depthMultiplier;
  const fgOffsetY = relScroll * 1.90 * depthMultiplier;

  const [orbitAltitudeKm, setOrbitAltitudeKm] = useState(420); // km
  const orbitCanvasRef = useRef<HTMLCanvasElement>(null);

  // Orbital physics formulas (Earth radius = 6371 km, GM = 3.986e14 m3/s2)
  const rMeters = (6371 + orbitAltitudeKm) * 1000;
  const GM = 3.986004418e14;
  const orbitalVelocityMps = Math.sqrt(GM / rMeters);
  const orbitalVelocityKms = (orbitalVelocityMps / 1000).toFixed(2);
  const orbitalPeriodMin = ((2 * Math.PI * Math.sqrt(Math.pow(rMeters, 3) / GM)) / 60).toFixed(1);
  const microGravity = (9.80665 * Math.pow(6371 / (6371 + orbitAltitudeKm), 2)).toFixed(2);

  // Satellite orbital trajectory canvas
  useEffect(() => {
    const canvas = orbitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height + 60; // Earth center below canvas
      const earthRadius = 140;
      const orbitRadius = earthRadius + (orbitAltitudeKm / 420) * 55;

      // Draw Earth limb
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, Math.PI, 0);
      const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, earthRadius);
      earthGrad.addColorStop(0, '#0f172a');
      earthGrad.addColorStop(0.85, '#0369a1');
      earthGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Atmospheric limb glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius + 4, Math.PI, 0);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Orbital path track
      ctx.beginPath();
      ctx.arc(cx, cy, orbitRadius, Math.PI, 0);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite position
      angle += 0.015 * (7.66 / parseFloat(orbitalVelocityKms));
      const satAngle = Math.PI - (angle % Math.PI);
      const satX = cx + Math.cos(satAngle) * orbitRadius;
      const satY = cy - Math.sin(satAngle) * orbitRadius;

      // Draw satellite marker
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();

      // Satellite solar panels
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(satX - 8, satY);
      ctx.lineTo(satX + 8, satY);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [orbitAltitudeKm, orbitalVelocityKms]);

  const handleTelemetryPing = () => {
    playOrbitalPing();
  };

  return (
    <section
      id="exosphere"
      className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-b from-[#030712] via-[#02040c] to-[#010206] border-t border-purple-500/10"
    >
      {/* LAYER 0: Deep Starfield & Cosmic Nebula (0.08x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-60"
        style={{ transform: `translate3d(0, ${bgOffsetY}px, 0)` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.12),transparent_70%)]" />

        {/* Multi-depth stars */}
        <div className="absolute top-1/10 left-1/12 w-1 h-1 rounded-full bg-white opacity-80" />
        <div className="absolute top-1/5 right-1/8 w-1.5 h-1.5 rounded-full bg-cyan-200 opacity-90 animate-pulse" />
        <div className="absolute top-2/5 left-1/4 w-0.5 h-0.5 rounded-full bg-white opacity-60" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-purple-200 opacity-80" />
        <div className="absolute top-3/4 left-1/8 w-1.5 h-1.5 rounded-full bg-white opacity-90" />
        <div className="absolute bottom-1/6 right-1/5 w-0.5 h-0.5 rounded-full bg-cyan-100 opacity-50" />
      </div>

      {/* LAYER 1: Curved Earth Horizon with Glowing Thin Blue Atmospheric Rim (0.40x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform flex items-end justify-center opacity-70"
        style={{ transform: `translate3d(0, ${midOffsetY}px, 0)` }}
      >
        <div className="w-[1400px] h-[350px] relative rounded-t-[100%] overflow-hidden border-t-2 border-cyan-400 shadow-[0_-20px_60px_rgba(56,189,248,0.25)] bg-gradient-to-b from-sky-950/80 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.3),transparent_70%)]" />
        </div>
      </div>

      {/* LAYER 2: Focal Content & Interactive Telemetry (1.00x velocity) */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-purple-500/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">
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
            <span className="text-3xl sm:text-4xl font-bold text-purple-400 tabular-nums">
              {realm.altitudeFormatted}
            </span>
            <span className="text-xs text-slate-400">Low Earth Orbit · Planetary Horizon</span>
          </div>
        </div>

        {/* Narrative & Orbital Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Narrative & Metrics */}
          <div className="lg:col-span-6 bg-[#0c061e]/80 border border-purple-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                Orbital Kinematics
              </span>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed">
                {realm.description}
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Beyond 400 kilometers altitude, gas molecules are so sparse that their mean free path exceeds 10,000 kilometers. Spacecraft exist in perpetual free fall, counterbalancing gravitational attraction with a lateral orbital velocity of nearly eight kilometers every second.
              </p>
            </div>

            {/* 4 Quantitative Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-purple-500/15">
              {realm.keyMetrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{m.label}</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-purple-400/80">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Orbital Trajectory Simulator */}
          <div className="lg:col-span-6 bg-[#0c061e]/80 border border-purple-500/20 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Orbit className="w-4 h-4 text-purple-400" />
                Orbital Trajectory & Velocity Simulator
              </span>
              <button
                onClick={handleTelemetryPing}
                className="px-2.5 py-1 text-[11px] font-mono text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 rounded-md transition-colors"
              >
                Telemetry Ping
              </button>
            </div>

            {/* Orbital Canvas */}
            <div className="relative flex items-center justify-center bg-black/60 rounded-xl overflow-hidden border border-purple-500/15 p-2">
              <canvas
                ref={orbitCanvasRef}
                width={360}
                height={210}
                onClick={handleTelemetryPing}
                className="cursor-pointer w-full max-w-[360px] h-[210px]"
                title="Click to trigger satellite radar pulse"
              />
              <div className="absolute top-2 left-3 text-[10px] font-mono text-purple-400/80 pointer-events-none">
                TRAJECTORY INCLINATION: 51.6° · VISIBLE LIMB
              </div>
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-400 pointer-events-none">
                CLICK TO EMIT RADAR BURST
              </div>
            </div>

            {/* Orbital Altitude Slider */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Orbital Altitude:</span>
                  <span className="text-purple-300 font-bold tabular-nums">+{orbitAltitudeKm} km ({orbitAltitudeKm * 1000} m)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={orbitAltitudeKm}
                  onChange={(e) => {
                    setOrbitAltitudeKm(parseInt(e.target.value));
                    playUiClick();
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              {/* Dynamic Recalculated Values */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Orbital Velocity</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{orbitalVelocityKms} km/s</span>
                </div>
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Orbital Period</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{orbitalPeriodMin} min</span>
                </div>
                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Effective Grav</span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">{microGravity} m/s²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground Satellite Lens Flares & Orbital Glint (1.90x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{ transform: `translate3d(0, ${fgOffsetY}px, 0)` }}
      >
        <div className="absolute top-1/4 right-1/10 w-8 h-8 rounded-full bg-cyan-400/30 blur-md animate-pulse" />
        <div className="absolute top-1/2 left-1/8 w-4 h-4 rounded-full bg-purple-400/50 blur-xs" />
        <div className="absolute bottom-1/5 right-1/4 w-3 h-3 rounded-full bg-white/70 blur-xs" />
      </div>
    </section>
  );
}
