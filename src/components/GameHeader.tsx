import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Sliders, Download, Trophy } from 'lucide-react';
import { GameSettings } from '../types';

interface GameHeaderProps {
  score: number;
  highScore: number;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  settings: GameSettings;
  onToggleSound: () => void;
  onOpenTuning: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  highScore,
  isNightMode,
  onToggleNightMode,
  settings,
  onToggleSound,
  onOpenTuning,
}) => {
  const pad5 = (n: number) => String(Math.floor(n)).padStart(5, '0');

  const downloadStandalone = () => {
    const link = document.createElement('a');
    link.href = '/dino-game.html';
    link.download = 'dino-game.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header id="game-header" className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
      {/* Brand & Retro Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center font-mono font-bold text-base shadow-sm">
          🦖
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
            DINO RUNNER
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Procedural Canvas 2D &bull; 600&times;180 px
          </p>
        </div>
      </div>

      {/* Scores & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
        {/* Score Display */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>HI {pad5(highScore)}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wider">
            {pad5(score)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            type="button"
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Night Mode Toggle */}
          <button
            id="btn-toggle-night-mode"
            type="button"
            onClick={onToggleNightMode}
            title={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            aria-label={isNightMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isNightMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Physics Tuning Modal Button */}
          <button
            id="btn-open-tuning"
            type="button"
            onClick={onOpenTuning}
            title="Customization & Physics"
            aria-label="Customization & Physics"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Download Standalone Single-file dino-game.html */}
          <button
            id="btn-download-standalone"
            type="button"
            onClick={downloadStandalone}
            title="Download Standalone dino-game.html"
            aria-label="Download Standalone dino-game.html"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer ml-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">.HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
