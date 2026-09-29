import React from 'react';
import { Keyboard, Zap, ShieldAlert, Sparkles } from 'lucide-react';

export const GameDetails: React.FC = () => {
  return (
    <div id="game-details" className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-xs">
      {/* Controls Card */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Keyboard className="w-3.5 h-3.5 text-slate-500" />
          <span>Input Controls</span>
        </div>
        <ul className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          <li><span className="font-semibold text-slate-800 dark:text-slate-200">Space / &uarr;</span>: Jump</li>
          <li><span className="font-semibold text-slate-800 dark:text-slate-200">&darr; (hold)</span>: Duck (Hitbox 26px)</li>
          <li><span className="font-semibold text-slate-800 dark:text-slate-200">Tap / Click</span>: Jump / Start</li>
        </ul>
      </div>

      {/* Speed & Scoring */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Scoring &amp; Ramp</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          Points accrue as <code className="font-mono bg-slate-200/60 dark:bg-slate-700 px-1 rounded">speed &times; 0.08</code>. Speed starts at 6.0 and accelerates by +0.0015 each frame.
        </p>
      </div>

      {/* Obstacles Card */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Obstacles</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          Small (17&times;35) &amp; large (25&times;50) cacti in clusters of 1–3. Flying birds spawn after 300 pts across 3 altitudes.
        </p>
      </div>

      {/* Technicals Card */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Procedural Engine</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          Pure 2D Canvas vector rendering. 4px inward AABB collision padding, Web Audio synthesized beeps, and night mode cycle.
        </p>
      </div>
    </div>
  );
};
