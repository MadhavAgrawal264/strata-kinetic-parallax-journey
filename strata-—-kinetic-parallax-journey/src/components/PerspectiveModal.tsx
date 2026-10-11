import { useState, useRef } from 'react';
import { X, Layers, Sliders, Eye, Rotate3d, Check } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface PerspectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  depthMultiplier: number;
  onSetDepthMultiplier: (val: number) => void;
  exploded3D: boolean;
  onToggleExploded3D: (val: boolean) => void;
  tiltEnabled: boolean;
  onToggleTilt: (val: boolean) => void;
}

export function PerspectiveModal({
  isOpen,
  onClose,
  depthMultiplier,
  onSetDepthMultiplier,
  exploded3D,
  onToggleExploded3D,
  tiltEnabled,
  onToggleTilt
}: PerspectiveModalProps) {
  // Sandbox 3D rotation state
  const [sandboxRotation, setSandboxRotation] = useState({ x: 20, y: -25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, initialRotX: 20, initialRotY: -25 });

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialRotX: sandboxRotation.x,
      initialRotY: sandboxRotation.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setSandboxRotation({
      x: Math.max(-45, Math.min(45, dragStart.current.initialRotX - dy * 0.4)),
      y: Math.max(-60, Math.min(60, dragStart.current.initialRotY + dx * 0.4))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Perspective Lab & Parallax Controls"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0f19] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Perspective Lab</h2>
              <p className="text-xs text-slate-400">
                Multi-plane optical parallax kinematics & spatial depth parameters
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Controls Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Parallax Depth Multiplier */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Kinetic Depth Multiplier
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                  {depthMultiplier.toFixed(1)}x Velocity
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Amplifies the relative velocity differential between background terrain, foreground particles, and focal typography.
              </p>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={depthMultiplier}
                onChange={(e) => {
                  onSetDepthMultiplier(parseFloat(e.target.value));
                  playUiClick();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.2x (Subtle Float)</span>
                <span>1.0x (Calibrated)</span>
                <span>2.0x (Hyper-Deep)</span>
              </div>
            </div>

            {/* 3D Exploded Perspective Mode Toggle */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Rotate3d className="w-4 h-4 text-indigo-400" />
                  Exploded 3D Orthographic View
                </span>
                <p className="text-xs text-slate-400">
                  Rotates the entire viewport into a 3D isometric plane, revealing the physical Z-separation between all parallax layers as you scroll.
                </p>
              </div>
              <button
                onClick={() => {
                  playUiClick();
                  onToggleExploded3D(!exploded3D);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 border ${
                  exploded3D
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {exploded3D ? 'Enabled (Active)' : 'Enable 3D'}
              </button>
            </div>

            {/* Mouse 2.5D Tilt Tracking */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Tactile Cursor Perspective Tilt
                </span>
                <p className="text-xs text-slate-400">
                  Enables interactive gyroscopic mouse tilt on showcase cards, shifting interior highlights and text layers dynamically.
                </p>
              </div>
              <button
                onClick={() => {
                  playUiClick();
                  onToggleTilt(!tiltEnabled);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 border ${
                  tiltEnabled
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white/10 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {tiltEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Velocity Kinematics Table */}
            <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Velocity Differential Matrix
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded bg-cyan-950/40 border border-cyan-800/30">
                  <div className="text-[10px] text-cyan-400 font-mono">Layer 0</div>
                  <div className="text-slate-300 text-[11px] font-medium">Cosmos</div>
                  <div className="text-xs font-mono font-bold text-white tabular-nums">
                    {(0.15 * depthMultiplier).toFixed(2)}x
                  </div>
                </div>
                <div className="p-2 rounded bg-amber-950/40 border border-amber-800/30">
                  <div className="text-[10px] text-amber-400 font-mono">Layer 1</div>
                  <div className="text-slate-300 text-[11px] font-medium">Terrain</div>
                  <div className="text-xs font-mono font-bold text-white tabular-nums">
                    {(0.45 * depthMultiplier).toFixed(2)}x
                  </div>
                </div>
                <div className="p-2 rounded bg-sky-950/40 border border-sky-800/30">
                  <div className="text-[10px] text-sky-400 font-mono">Layer 2</div>
                  <div className="text-slate-300 text-[11px] font-medium">Content</div>
                  <div className="text-xs font-mono font-bold text-white tabular-nums">
                    {(1.0 * depthMultiplier).toFixed(2)}x
                  </div>
                </div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-800/30">
                  <div className="text-[10px] text-purple-400 font-mono">Layer 3</div>
                  <div className="text-slate-300 text-[11px] font-medium">Optics</div>
                  <div className="text-xs font-mono font-bold text-white tabular-nums">
                    {(1.65 * depthMultiplier).toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Interactive Sandbox Visualization */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Interactive Layer Separation Stage
              </span>
              <span className="text-[11px] text-slate-400">
                Click & drag to rotate in 3D
              </span>
            </div>

            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="h-80 bg-gradient-to-b from-slate-900/90 to-[#030712] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing select-none perspective-1000"
            >
              {/* Perspective container */}
              <div
                className="w-56 h-56 relative transform-style-3d transition-transform duration-75"
                style={{
                  transform: `rotateX(${sandboxRotation.x}deg) rotateY(${sandboxRotation.y}deg)`
                }}
              >
                {/* Layer 0: Cosmos / Deep Grid (Z = -60px) */}
                <div
                  className="absolute inset-0 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xs flex flex-col justify-between p-3 transform-style-3d transition-all duration-300"
                  style={{ transform: `translateZ(${-60 * depthMultiplier}px)` }}
                >
                  <span className="text-[10px] font-mono text-cyan-400">L0 · Deep Cosmos (0.15x)</span>
                  <div className="grid grid-cols-4 gap-1 opacity-40">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-4 border border-cyan-400/30 rounded-xs" />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">Z: -60px</span>
                </div>

                {/* Layer 1: Geological Strata (Z = -20px) */}
                <div
                  className="absolute inset-0 rounded-xl border border-amber-500/40 bg-amber-950/30 backdrop-blur-xs flex flex-col justify-between p-3 transform-style-3d transition-all duration-300"
                  style={{ transform: `translateZ(${-20 * depthMultiplier}px)` }}
                >
                  <span className="text-[10px] font-mono text-amber-400">L1 · Basalt Ridges (0.45x)</span>
                  <div className="w-full h-8 border-b-2 border-dashed border-amber-400/40" />
                  <span className="text-[9px] font-mono text-slate-400">Z: -20px</span>
                </div>

                {/* Layer 2: Focal Interface Typography (Z = +20px) */}
                <div
                  className="absolute inset-0 rounded-xl border border-white/30 bg-slate-900/70 backdrop-blur-sm flex flex-col justify-between p-3 shadow-xl transform-style-3d transition-all duration-300"
                  style={{ transform: `translateZ(${20 * depthMultiplier}px)` }}
                >
                  <span className="text-[10px] font-mono text-white">L2 · Focal Telemetry (1.00x)</span>
                  <div className="font-display font-bold text-sm text-white">
                    STRATA PARALLAX
                  </div>
                  <span className="text-[9px] font-mono text-cyan-300">Z: +20px (Focal plane)</span>
                </div>

                {/* Layer 3: Foreground Optical Flares (Z = +60px) */}
                <div
                  className="absolute inset-0 rounded-xl border border-purple-500/40 bg-purple-950/20 backdrop-blur-xs flex flex-col justify-between p-3 transform-style-3d transition-all duration-300 pointer-events-none"
                  style={{ transform: `translateZ(${60 * depthMultiplier}px)` }}
                >
                  <span className="text-[10px] font-mono text-purple-400">L3 · Bokeh Flares (1.65x)</span>
                  <div className="w-8 h-8 rounded-full bg-purple-400/30 blur-xs mx-auto animate-pulse" />
                  <span className="text-[9px] font-mono text-purple-300">Z: +60px (Speed plane)</span>
                </div>
              </div>

              {/* Instructions banner */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/60 px-3 py-1.5 rounded-lg border border-white/5">
                <span>Rot: {Math.round(sandboxRotation.x)}° / {Math.round(sandboxRotation.y)}°</span>
                <button
                  onClick={() => setSandboxRotation({ x: 20, y: -25 })}
                  className="text-cyan-400 hover:underline text-[10px]"
                >
                  Reset Angles
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When you scroll the page, each layer is translated along the Y-axis at a calculated velocity fraction. The foreground appears near and fast, while the cosmic starfields drift slowly in the distance, producing true optical parallax.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
