import { useRef } from 'react';
import { ArrowDown, Layers, Compass, Sparkles } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface HeroSectionProps {
  scrollY: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
  onOpenPerspectiveLab: () => void;
}

export function HeroSection({
  scrollY,
  depthMultiplier,
  tiltEnabled,
  onOpenPerspectiveLab
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax offsets computed based on scrollY and depthMultiplier
  const bgOffsetY = scrollY * 0.15 * depthMultiplier;
  const midOffsetY = scrollY * 0.45 * depthMultiplier;
  const contentOffsetY = scrollY * 0.85 * depthMultiplier;
  const fgOffsetY = scrollY * 1.65 * depthMultiplier;

  const scrollToFirstRealm = () => {
    playUiClick();
    const el = document.getElementById('abyss');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-6"
    >
      {/* LAYER 0: Background Deep Spatial Grid & Radial Gradient (0.15x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${bgOffsetY}px, 0)`
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_60%)]" />

        {/* Fine dimensional coordinate grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* LAYER 1: Midground Geometric Orbitals & Bathymetric Contours (0.45x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, ${midOffsetY}px, 0)`
        }}
      >
        {/* Concentric orbital rings */}
        <div className="w-[640px] h-[640px] md:w-[860px] md:h-[860px] rounded-full border border-white/5 opacity-50 absolute flex items-center justify-center">
          <div className="w-[480px] h-[480px] md:w-[680px] md:h-[680px] rounded-full border border-dashed border-cyan-500/20" />
        </div>

        {/* Dynamic decorative horizon wireframe */}
        <svg
          className="absolute w-full h-96 bottom-0 opacity-20 text-cyan-400"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M0,192L48,181.3C96,171,192,149,288,165.3C384,181,480,235,576,245.3C672,256,768,224,864,197.3C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,202.7C672,224,768,256,864,250.7C960,245,1056,203,1152,192C1248,181,1344,203,1392,213.3L1440,224"
          />
        </svg>
      </div>

      {/* LAYER 2: Focal Content & High-Contrast Typography (1.00x focal velocity) */}
      <div
        className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center will-change-transform"
        style={{
          transform: `translate3d(0, ${contentOffsetY}px, 0)`
        }}
      >
        {/* Clean unboxed editorial metadata without pill badges */}
        <div className="flex items-center gap-2 text-xs text-cyan-400/90 font-mono tracking-widest uppercase mb-4">
          <span>Kinetic Vertical Parallax</span>
          <span aria-hidden="true">·</span>
          <span>5 Dimensional Strata</span>
          <span aria-hidden="true">·</span>
          <span>-10,920m to +420,000m</span>
        </div>

        {/* Primary Hero Headline with High Contrast Typography */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white font-display uppercase leading-none drop-shadow-sm">
          STRATA
        </h1>

        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed text-balance">
          An interactive expedition through the physical gradients of our planet. As you scroll, foreground and background strata shift at calibrated velocities, creating depth through kinetic optical physics.
        </p>

        {/* Primary Actions & Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={scrollToFirstRealm}
            className="px-6 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 active:scale-[0.98] rounded-xl transition-all shadow-lg flex items-center gap-2 group cursor-pointer"
          >
            <span>Begin Vertical Descent</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              playUiClick();
              onOpenPerspectiveLab();
            }}
            className="px-6 py-3 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/15 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Perspective Lab</span>
          </button>
        </div>

        {/* Quick Vertical Scale Indicators */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-white/10 pt-8 w-full max-w-3xl">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Hadal Datum</span>
            <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">-10,920 m</span>
            <span className="text-[11px] text-slate-400">Mariana Trench</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Alpine Ridge</span>
            <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">+3,840 m</span>
            <span className="text-[11px] text-slate-400">Crystalline Spires</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mesosphere</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">+85,000 m</span>
            <span className="text-[11px] text-slate-400">Aurora Ionization</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Low Orbit</span>
            <span className="text-xl font-bold font-mono text-purple-400 tabular-nums">+420,000 m</span>
            <span className="text-[11px] text-slate-400">Orbital Exosphere</span>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground Optical Flares & Speed Dust (1.65x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{
          transform: `translate3d(0, ${fgOffsetY}px, 0)`
        }}
      >
        {/* Floating optical bokeh particles rushing past the camera */}
        <div className="absolute top-1/4 left-1/12 w-6 h-6 rounded-full bg-cyan-400/25 blur-sm animate-pulse" />
        <div className="absolute top-3/5 right-1/10 w-10 h-10 rounded-full bg-indigo-500/20 blur-md" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-cyan-300/40 blur-xs" />
        <div className="absolute bottom-1/4 left-1/5 w-8 h-8 rounded-full bg-purple-500/20 blur-sm" />
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 pointer-events-none animate-bounce">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Scroll to Explore</span>
        <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
      </div>
    </section>
  );
}
