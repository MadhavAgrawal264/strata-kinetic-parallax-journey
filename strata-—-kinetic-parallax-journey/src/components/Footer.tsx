import { ArrowUp, Layers, Compass } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface FooterProps {
  onOpenPerspectiveLab: () => void;
}

export function Footer({ onOpenPerspectiveLab }: FooterProps) {
  const scrollToTop = () => {
    playUiClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToRealm = (id: string) => {
    playUiClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#02050c] border-t border-white/10 py-16 px-6 text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white font-display text-xl font-bold">
              <span className="w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-sm" />
              <span>STRATA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Kinetic multi-plane parallax scrolling expedition spanning oceanic trenches to orbital boundaries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <button
              onClick={() => scrollToRealm('abyss')}
              className="hover:text-white transition-colors"
            >
              01. Abyss
            </button>
            <button
              onClick={() => scrollToRealm('lithosphere')}
              className="hover:text-white transition-colors"
            >
              02. Lithosphere
            </button>
            <button
              onClick={() => scrollToRealm('troposphere')}
              className="hover:text-white transition-colors"
            >
              03. Atmosphere
            </button>
            <button
              onClick={() => scrollToRealm('aurora')}
              className="hover:text-white transition-colors"
            >
              04. Aurora
            </button>
            <button
              onClick={() => scrollToRealm('exosphere')}
              className="hover:text-white transition-colors"
            >
              05. Exosphere
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playUiClick();
                onOpenPerspectiveLab();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Perspective Lab</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer Credit Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Data Reference:</span>
            <span>NOAA Ocean Exploration</span>
            <span aria-hidden="true">·</span>
            <span>ESA Earth Observation</span>
            <span aria-hidden="true">·</span>
            <span>NASA Goddard Space Flight Center</span>
          </div>

          {/* Developer Card Box */}
          <a
            href="https://www.linkedin.com/in/madhav-agrawal-100286430?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all duration-200 shadow-sm hover:shadow-cyan-500/10"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.88a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-cyan-400/90 transition-colors">
                Developer
              </span>
              <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1 font-display">
                Madhav Agrawal
                <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </div>
          </a>
        </div>

        {/* Bottom copyright line */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-4">
          <span className="font-mono">&copy; {new Date().getFullYear()} STRATA Spatial Laboratory</span>
          <span className="font-mono text-[10px] text-slate-400">All coordinates referenced to WGS84 datum</span>
        </div>
      </div>
    </footer>
  );
}
