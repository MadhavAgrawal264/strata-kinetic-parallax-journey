import { useState, useRef } from 'react';
import { Layers, Activity, Compass, ArrowUpRight, Gauge, Radio, Sparkles } from 'lucide-react';
import { playUiClick, playSonarPing, playMineralTone, playOrbitalPing } from '../utils/audio';

interface TiltCardProps {
  title: string;
  category: string;
  datum: string;
  description: string;
  metric: string;
  unit: string;
  accentColor: string;
  soundFn: () => void;
  tiltEnabled: boolean;
}

function TiltCard({
  title,
  category,
  datum,
  description,
  metric,
  unit,
  accentColor,
  soundFn,
  tiltEnabled
}: TiltCardProps) {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;
    setRot({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRot({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        playUiClick();
        soundFn();
      }}
      className="group relative rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 md:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden transform-style-3d hover:border-white/20 hover:shadow-2xl hover:shadow-black/60"
      style={{
        transform: tiltEnabled && isHovered
          ? `perspective(1000px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      }}
    >
      {/* Dynamic specular lighting sheen based on cursor tilt */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${50 + rot.y * 2}% ${50 - rot.x * 2}%, rgba(255,255,255,0.1), transparent 70%)`
        }}
      />

      {/* Top row */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="uppercase tracking-wider text-[11px]" style={{ color: accentColor }}>
          {category}
        </span>
        <span className="tabular-nums text-slate-300 font-semibold">{datum}</span>
      </div>

      {/* Middle: Title & Description */}
      <div className="my-6">
        <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
          <span>{title}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white" />
        </h3>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Metric */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {metric}
          </span>
          <span className="ml-1.5 text-xs text-slate-400">{unit}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
          Click for Audio
        </span>
      </div>
    </div>
  );
}

interface InteractiveShowcaseProps {
  tiltEnabled: boolean;
}

export function InteractiveShowcase({ tiltEnabled }: InteractiveShowcaseProps) {
  return (
    <section className="py-24 px-6 relative bg-[#030712] border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            <span>Tactile 2.5D Micro-Interactions</span>
            <span aria-hidden="true">·</span>
            <span>Spatial Depth</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Kinetic Perspective Artifacts
          </h2>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Hover over each specimen card to experience responsive gyroscopic perspective tilt with real-time specular highlights and procedural acoustic triggers.
          </p>
        </div>

        {/* 3 Interactive Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <TiltCard
            title="Acoustic Sonar Bathymetry"
            category="Deep Trenches"
            datum="-10,920 m"
            description="Active acoustic echolocation penetrating the aphotic abyss, mapping undersea canyons and volcanic vents."
            metric="1,532"
            unit="m/s acoustic speed"
            accentColor="#06b6d4"
            soundFn={playSonarPing}
            tiltEnabled={tiltEnabled}
          />
          <TiltCard
            title="Lithospheric Orogeny"
            category="Continental Crust"
            datum="+3,840 m"
            description="Crystalline granodiorite cores subjected to millions of years of compressive tectonic uplift and glacial erosion."
            metric="220"
            unit="MPa rock strength"
            accentColor="#f59e0b"
            soundFn={() => playMineralTone(330)}
            tiltEnabled={tiltEnabled}
          />
          <TiltCard
            title="Keplerian Astrodynamics"
            category="Low Earth Orbit"
            datum="+420,000 m"
            description="Equilibrium freefall kinematics balancing planetary gravitational pull with continuous tangential velocity."
            metric="7.66"
            unit="km/s orbital speed"
            accentColor="#a855f7"
            soundFn={playOrbitalPing}
            tiltEnabled={tiltEnabled}
          />
        </div>

        {/* Quantitative Rigor Proof Strip */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Dimensional Gradient Rigor
            </span>
            <span className="text-lg font-semibold text-white mt-1">
              Earth-Atmosphere Vertical Continuum
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-8 sm:gap-12 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Span Covered</span>
              <span className="text-xl font-bold text-cyan-400 tabular-nums">430,920 m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Pressure Gradient</span>
              <span className="text-xl font-bold text-amber-400 tabular-nums">1,086 to 10⁻¹² atm</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Framerate Target</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">120 fps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
