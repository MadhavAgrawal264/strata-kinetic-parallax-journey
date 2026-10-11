import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Layers, Compass } from 'lucide-react';
import { playUiClick, setAudioMuted, getAudioMuted, subscribeAudioState } from '../utils/audio';

interface NavigationProps {
  onOpenPerspectiveLab: () => void;
  activeRealmId: string;
}

export function Navigation({ onOpenPerspectiveLab, activeRealmId }: NavigationProps) {
  const [muted, setMuted] = useState(getAudioMuted());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return subscribeAudioState(() => {
      setMuted(getAudioMuted());
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextMuted = !muted;
    setAudioMuted(nextMuted);
    setMuted(nextMuted);
    if (!nextMuted) {
      playUiClick();
    }
  };

  const scrollToRealm = (id: string) => {
    playUiClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030712]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playUiClick();
          }}
          className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display flex items-center gap-2 group"
        >
          <span className="w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-sm transform group-hover:rotate-45 transition-transform duration-300" />
          <span>STRATA</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollToRealm('abyss')}
            className={`whitespace-nowrap shrink-0 transition-colors relative py-1 text-xs tracking-wider uppercase ${
              activeRealmId === 'abyss' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Abyss
            {activeRealmId === 'abyss' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => scrollToRealm('lithosphere')}
            className={`whitespace-nowrap shrink-0 transition-colors relative py-1 text-xs tracking-wider uppercase ${
              activeRealmId === 'lithosphere' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lithosphere
            {activeRealmId === 'lithosphere' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => scrollToRealm('troposphere')}
            className={`whitespace-nowrap shrink-0 transition-colors relative py-1 text-xs tracking-wider uppercase ${
              activeRealmId === 'troposphere' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Atmosphere
            {activeRealmId === 'troposphere' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => scrollToRealm('aurora')}
            className={`whitespace-nowrap shrink-0 transition-colors relative py-1 text-xs tracking-wider uppercase ${
              activeRealmId === 'aurora' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Aurora
            {activeRealmId === 'aurora' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => scrollToRealm('exosphere')}
            className={`whitespace-nowrap shrink-0 transition-colors relative py-1 text-xs tracking-wider uppercase ${
              activeRealmId === 'exosphere' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Exosphere
            {activeRealmId === 'exosphere' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary action + sound utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Unmute procedural soundscapes' : 'Mute procedural soundscapes'}
            className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-xs flex items-center gap-1.5"
            title={muted ? 'Enable soundscapes' : 'Mute soundscapes'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline text-[11px] font-mono">{muted ? 'Audio Off' : 'Audio On'}</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onOpenPerspectiveLab();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>Perspective Lab</span>
          </button>
        </div>
      </div>
    </header>
  );
}
