import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { GameStatus } from '../types';

interface TouchControlsProps {
  status: GameStatus;
  onJump: () => void;
  onDuckChange: (duck: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  status,
  onJump,
  onDuckChange,
}) => {
  return (
    <div id="touch-controls-bar" className="w-full grid grid-cols-2 gap-3 pt-2">
      {/* Jump Button */}
      <button
        id="touch-jump-btn"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onJump();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onJump();
        }}
        className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold tracking-wide active:scale-[0.98] transition-transform select-none shadow-sm cursor-pointer"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        <span>{status === 'gameover' ? 'RESTART' : 'JUMP'}</span>
      </button>

      {/* Duck Button */}
      <button
        id="touch-duck-btn"
        type="button"
        onMouseDown={() => onDuckChange(true)}
        onMouseUp={() => onDuckChange(false)}
        onMouseLeave={() => onDuckChange(false)}
        onTouchStart={(e) => {
          e.preventDefault();
          onDuckChange(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onDuckChange(false);
        }}
        disabled={status !== 'playing'}
        className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold tracking-wide transition-all select-none shadow-sm cursor-pointer ${
          status !== 'playing'
            ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98]'
        }`}
      >
        <ArrowDown className="w-5 h-5 stroke-[2.5]" />
        <span>DUCK (HOLD)</span>
      </button>
    </div>
  );
};
