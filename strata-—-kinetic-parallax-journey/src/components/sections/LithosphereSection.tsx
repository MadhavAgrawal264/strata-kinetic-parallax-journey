import { useState } from 'react';
import { StrataRealm } from '../../types';
import { playMineralTone, playUiClick } from '../../utils/audio';
import { Mountain, Layers, Activity, ShieldCheck } from 'lucide-react';

interface LithosphereSectionProps {
  realm: StrataRealm;
  scrollY: number;
  sectionTop: number;
  depthMultiplier: number;
  tiltEnabled: boolean;
}

interface MineralLayer {
  name: string;
  depth: string;
  age: string;
  composition: string;
  density: string;
  hardness: string;
  freq: number;
  color: string;
}

const MINERAL_LAYERS: MineralLayer[] = [
  {
    name: 'Glacial Permafrost & Moraine',
    depth: '0 - 150 m',
    age: '0.01 Ma (Holocene)',
    composition: 'Cryoturbated silt, angular granite boulders',
    density: '1.92 g/cm³',
    hardness: '3.5 Mohs',
    freq: 520,
    color: '#cbd5e1'
  },
  {
    name: 'Foliated Metamorphic Schist',
    depth: '150 - 1,200 m',
    age: '145 Ma (Late Jurassic)',
    composition: 'Biotite, muscovite mica, quartz ribbons',
    density: '2.74 g/cm³',
    hardness: '5.5 Mohs',
    freq: 410,
    color: '#94a3b8'
  },
  {
    name: 'Crystalline Granodiorite Massif',
    depth: '1,200 - 3,400 m',
    age: '310 Ma (Hercynian Orogeny)',
    composition: 'Plagioclase feldspar, hornblende, smoky quartz',
    density: '2.85 g/cm³',
    hardness: '6.5 Mohs',
    freq: 330,
    color: '#f59e0b'
  },
  {
    name: 'Basaltic Gabbro Sub-Crust',
    depth: '3,400+ m',
    age: '420 Ma (Silurian Rift)',
    composition: 'Pyroxene, calcic plagioclase, olivine micro-crystals',
    density: '3.08 g/cm³',
    hardness: '7.0 Mohs',
    freq: 240,
    color: '#d97706'
  }
];

export function LithosphereSection({
  realm,
  scrollY,
  sectionTop,
  depthMultiplier,
  tiltEnabled
}: LithosphereSectionProps) {
  const relScroll = scrollY - sectionTop;
  const bgOffsetY = relScroll * 0.15 * depthMultiplier;
  const midOffsetY = relScroll * 0.45 * depthMultiplier;
  const fgOffsetY = relScroll * 1.65 * depthMultiplier;

  const [activeLayerIndex, setActiveLayerIndex] = useState(2);
  const [tectonicStrain, setTectonicStrain] = useState(64);

  const selectedMineral = MINERAL_LAYERS[activeLayerIndex];

  const handleSelectLayer = (idx: number) => {
    setActiveLayerIndex(idx);
    playMineralTone(MINERAL_LAYERS[idx].freq);
  };

  return (
    <section
      id="lithosphere"
      className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-b from-[#030712] via-[#0f1118] to-[#030712] border-t border-amber-500/10"
    >
      {/* LAYER 0: Background Distant Jagged Alpine Range (0.15x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-30 flex items-center"
        style={{ transform: `translate3d(0, ${bgOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-96 text-slate-700/40"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <polygon
            fill="currentColor"
            points="0,400 0,220 180,110 320,260 480,70 650,230 820,130 990,280 1140,90 1300,240 1440,160 1440,400"
          />
        </svg>
      </div>

      {/* LAYER 1: Midground Razor-Sharp Obsidian Spires & Ridge (0.45x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform opacity-30 flex items-end"
        style={{ transform: `translate3d(0, ${midOffsetY}px, 0)` }}
      >
        <svg
          className="w-full h-80 text-amber-950/70"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <polygon
            fill="currentColor"
            points="0,320 0,180 140,290 280,120 420,270 560,60 700,230 840,140 980,300 1120,90 1260,250 1440,170 1440,320"
          />
        </svg>
      </div>

      {/* LAYER 2: Focal Content & Interactive Telemetry (1.00x velocity) */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-500/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
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
            <span className="text-3xl sm:text-4xl font-bold text-amber-400 tabular-nums">
              {realm.altitudeFormatted}
            </span>
            <span className="text-xs text-slate-400">Tectonic Spire Datum · Continental Uplift</span>
          </div>
        </div>

        {/* Narrative & Stratigraphy Scanner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Narrative & Metrics */}
          <div className="lg:col-span-6 bg-[#12141c]/80 border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Orogenic Kinematics
              </span>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed">
                {realm.description}
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                High-altitude rock faces undergo rapid thermal expansion and frost shattering. With air density at 0.82 kg/m³, solar ultraviolet radiation accelerates surface spallation, exposing billions of years of compressed continental lithosphere.
              </p>
            </div>

            {/* 4 Quantitative Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-amber-500/15">
              {realm.keyMetrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">{m.label}</span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-amber-400/80">{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Stratigraphy Core Scanner */}
          <div className="lg:col-span-6 bg-[#12141c]/80 border border-amber-500/20 rounded-2xl p-6 flex flex-col gap-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Geological Core Stratigraphy Scanner
              </span>
              <span className="text-[10px] font-mono text-amber-400">
                ACOUSTIC RESONANCE
              </span>
            </div>

            {/* Interactive Mineral Core Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Click a strata horizon to inspect mineral composition & acoustic frequency:
              </span>
              <div className="grid grid-cols-4 gap-1.5 h-14 rounded-xl overflow-hidden border border-white/10 p-1 bg-black/40">
                {MINERAL_LAYERS.map((layer, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLayer(idx)}
                    className={`h-full rounded-lg transition-all flex flex-col items-center justify-center p-1 text-center border ${
                      activeLayerIndex === idx
                        ? 'border-amber-400 scale-[1.02] shadow-md bg-amber-500/20'
                        : 'border-transparent hover:border-white/20 bg-white/5 opacity-80'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-white truncate w-full font-bold">
                      {layer.name.split(' ')[0]}
                    </span>
                    <span className="text-[8px] font-mono text-slate-400">
                      {layer.depth.split(' ')[0]}m
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Horizon Card */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">
                  {selectedMineral.name}
                </span>
                <span className="text-xs font-mono text-amber-400 font-semibold">
                  {selectedMineral.depth}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pt-1 border-t border-white/5">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Geological Epoch</span>
                  <span className="text-slate-200 font-medium">{selectedMineral.age}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Bulk Density</span>
                  <span className="text-slate-200 font-mono">{selectedMineral.density}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Mineral Matrix</span>
                  <span className="text-slate-200 text-[11px] line-clamp-1">{selectedMineral.composition}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Hardness / Sonic Freq</span>
                  <span className="text-amber-300 font-mono">{selectedMineral.hardness} · {selectedMineral.freq} Hz</span>
                </div>
              </div>
            </div>

            {/* Tectonic Stress Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Lithospheric Shear Strain:</span>
                <span className="text-amber-300 font-bold tabular-nums">{tectonicStrain} MPa</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                value={tectonicStrain}
                onChange={(e) => {
                  setTectonicStrain(parseInt(e.target.value));
                  playUiClick();
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Fault Rupture Risk:</span>
                <span className="text-white font-bold">
                  {tectonicStrain > 120 ? 'Critical Shear Dilatancy' : 'Stable Elastic Creep'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: Foreground Snow Flurries & Whipping Mist (1.65x velocity) */}
      <div
        className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
        style={{ transform: `translate3d(0, ${fgOffsetY}px, 0)` }}
      >
        <div className="absolute top-1/4 right-1/5 w-2 h-2 rounded-full bg-white/70 blur-xs" />
        <div className="absolute top-1/2 left-1/10 w-3 h-3 rounded-full bg-amber-300/40 blur-xs" />
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 rounded-full bg-white/60 blur-xs" />
        <div className="absolute top-3/4 left-2/3 w-6 h-6 rounded-full bg-amber-500/10 blur-md" />
      </div>
    </section>
  );
}
