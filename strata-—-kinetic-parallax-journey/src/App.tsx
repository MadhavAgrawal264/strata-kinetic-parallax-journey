import { useState, useEffect, useRef } from 'react';
import { STRATA_REALMS } from './data/realms';
import { Navigation } from './components/Navigation';
import { TelemetryHud } from './components/TelemetryHud';
import { PerspectiveModal } from './components/PerspectiveModal';
import { HeroSection } from './components/HeroSection';
import { AbyssSection } from './components/sections/AbyssSection';
import { LithosphereSection } from './components/sections/LithosphereSection';
import { TroposphereSection } from './components/sections/TroposphereSection';
import { AuroraSection } from './components/sections/AuroraSection';
import { ExosphereSection } from './components/sections/ExosphereSection';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { Footer } from './components/Footer';
import { AudioController } from './components/AudioController';

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [depthMultiplier, setDepthMultiplier] = useState(1.0);
  const [exploded3D, setExploded3D] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const [isPerspectiveLabOpen, setIsPerspectiveLabOpen] = useState(false);
  const [autoSyncAudio, setAutoSyncAudio] = useState(true);

  // Section top coordinates for relative parallax calculation
  const [sectionOffsets, setSectionOffsets] = useState<{ [key: string]: number }>({});
  const [activeRealmIndex, setActiveRealmIndex] = useState(0);
  const [currentAltitude, setCurrentAltitude] = useState(-10920);

  // Measure section positions
  const updateOffsets = () => {
    const offsets: { [key: string]: number } = {};
    STRATA_REALMS.forEach((realm) => {
      const el = document.getElementById(realm.id);
      if (el) {
        offsets[realm.id] = el.offsetTop;
      }
    });
    setSectionOffsets(offsets);
  };

  useEffect(() => {
    updateOffsets();
    window.addEventListener('resize', updateOffsets);
    return () => window.removeEventListener('resize', updateOffsets);
  }, []);

  // Smooth scroll listener via requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sy = window.scrollY;
          setScrollY(sy);

          // Determine active realm
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollFrac = totalHeight > 0 ? Math.min(Math.max(sy / totalHeight, 0), 1) : 0;

          // Continuous altitude interpolation across the 5 realms
          if (scrollFrac < 0.15) {
            // Hero to Abyss
            setCurrentAltitude(-10920);
            setActiveRealmIndex(0);
          } else if (scrollFrac < 0.35) {
            // Abyss to Lithosphere
            const f = (scrollFrac - 0.15) / 0.2;
            setCurrentAltitude(Math.round(-10920 + f * (3840 - -10920)));
            setActiveRealmIndex(f < 0.5 ? 0 : 1);
          } else if (scrollFrac < 0.55) {
            // Lithosphere to Troposphere
            const f = (scrollFrac - 0.35) / 0.2;
            setCurrentAltitude(Math.round(3840 + f * (11200 - 3840)));
            setActiveRealmIndex(f < 0.5 ? 1 : 2);
          } else if (scrollFrac < 0.75) {
            // Troposphere to Aurora
            const f = (scrollFrac - 0.55) / 0.2;
            setCurrentAltitude(Math.round(11200 + f * (85000 - 11200)));
            setActiveRealmIndex(f < 0.5 ? 2 : 3);
          } else {
            // Aurora to Exosphere
            const f = (scrollFrac - 0.75) / 0.25;
            setCurrentAltitude(Math.round(85000 + f * (420000 - 85000)));
            setActiveRealmIndex(4);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeRealm = STRATA_REALMS[activeRealmIndex] || STRATA_REALMS[0];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <Navigation
        activeRealmId={activeRealm.id}
        onOpenPerspectiveLab={() => setIsPerspectiveLabOpen(true)}
      />

      {/* Floating Telemetry & Quick Parallax HUD */}
      <TelemetryHud
        currentAltitude={currentAltitude}
        activeRealmIndex={activeRealmIndex}
        depthMultiplier={depthMultiplier}
        onSetDepthMultiplier={setDepthMultiplier}
        onOpenPerspectiveLab={() => setIsPerspectiveLabOpen(true)}
      />

      {/* Exploded 3D Perspective Wrapper */}
      <div
        className={`transition-all duration-700 ease-out ${
          exploded3D
            ? 'origin-center perspective-1500 transform-style-3d'
            : ''
        }`}
        style={{
          transform: exploded3D
            ? 'rotateX(10deg) rotateY(-8deg) scale(0.92) translateY(20px)'
            : 'none'
        }}
      >
        {/* Banner indicator when Exploded 3D view is active */}
        {exploded3D && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-600/90 text-white text-xs font-mono px-4 py-1.5 rounded-full shadow-xl backdrop-blur-md border border-indigo-400 flex items-center gap-2">
            <span>3D Exploded Perspective Active (Scroll to observe physical Z-plane separation)</span>
            <button
              onClick={() => setExploded3D(false)}
              className="text-white hover:text-indigo-200 underline text-[11px] ml-2"
            >
              Exit 3D View
            </button>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection
          scrollY={scrollY}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
          onOpenPerspectiveLab={() => setIsPerspectiveLabOpen(true)}
        />

        {/* Realm 01: The Hadal Abyss */}
        <AbyssSection
          realm={STRATA_REALMS[0]}
          scrollY={scrollY}
          sectionTop={sectionOffsets['abyss'] || 900}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
        />

        {/* Realm 02: Lithosphere & Crags */}
        <LithosphereSection
          realm={STRATA_REALMS[1]}
          scrollY={scrollY}
          sectionTop={sectionOffsets['lithosphere'] || 1800}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
        />

        {/* Realm 03: Troposphere & Cloud Sea */}
        <TroposphereSection
          realm={STRATA_REALMS[2]}
          scrollY={scrollY}
          sectionTop={sectionOffsets['troposphere'] || 2700}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
        />

        {/* Realm 04: Mesosphere & Aurora Gate */}
        <AuroraSection
          realm={STRATA_REALMS[3]}
          scrollY={scrollY}
          sectionTop={sectionOffsets['aurora'] || 3600}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
        />

        {/* Realm 05: Orbital Exosphere */}
        <ExosphereSection
          realm={STRATA_REALMS[4]}
          scrollY={scrollY}
          sectionTop={sectionOffsets['exosphere'] || 4500}
          depthMultiplier={depthMultiplier}
          tiltEnabled={tiltEnabled}
        />

        {/* Tactile 2.5D Micro-Interactions Showcase */}
        <InteractiveShowcase tiltEnabled={tiltEnabled} />

        {/* Footer */}
        <Footer onOpenPerspectiveLab={() => setIsPerspectiveLabOpen(true)} />
      </div>

      {/* Perspective Lab Modal */}
      <PerspectiveModal
        isOpen={isPerspectiveLabOpen}
        onClose={() => setIsPerspectiveLabOpen(false)}
        depthMultiplier={depthMultiplier}
        onSetDepthMultiplier={setDepthMultiplier}
        exploded3D={exploded3D}
        onToggleExploded3D={setExploded3D}
        tiltEnabled={tiltEnabled}
        onToggleTilt={setTiltEnabled}
      />

      {/* Environmental Soundscapes Audio Controller */}
      <AudioController
        currentScrolledRealmId={activeRealm.id}
        autoSyncWithScroll={autoSyncAudio}
        onToggleAutoSync={setAutoSyncAudio}
      />
    </div>
  );
}
