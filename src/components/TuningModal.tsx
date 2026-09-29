import React from 'react';
import { X, RotateCcw, Sliders } from 'lucide-react';
import { GameSettings } from '../types';

interface TuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdate: (updated: Partial<GameSettings>) => void;
  onReset: () => void;
}

export const TuningModal: React.FC<TuningModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="tuning-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="tuning-modal-panel"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Physics & Difficulty Tuning
            </h2>
          </div>
          <button
            id="btn-close-tuning"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Starting Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
              <span>Starting Speed</span>
              <span className="font-mono">{settings.startingSpeed.toFixed(1)}</span>
            </div>
            <input
              id="slider-start-speed"
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={settings.startingSpeed}
              onChange={(e) => onUpdate({ startingSpeed: parseFloat(e.target.value) })}
              className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
            />
          </div>

          {/* Jump Force */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
              <span>Jump Force (Floatiness)</span>
              <span className="font-mono">{Math.abs(settings.jumpForce).toFixed(1)}</span>
            </div>
            <input
              id="slider-jump-force"
              type="range"
              min="8"
              max="15"
              step="0.5"
              value={Math.abs(settings.jumpForce)}
              onChange={(e) => onUpdate({ jumpForce: -parseFloat(e.target.value) })}
              className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
            />
          </div>

          {/* Gravity */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
              <span>Gravity</span>
              <span className="font-mono">{settings.gravity.toFixed(2)}</span>
            </div>
            <input
              id="slider-gravity"
              type="range"
              min="0.35"
              max="1.0"
              step="0.05"
              value={settings.gravity}
              onChange={(e) => onUpdate({ gravity: parseFloat(e.target.value) })}
              className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
            />
          </div>

          {/* Speed Ramp Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
              <span>Speed Acceleration Rate</span>
              <span className="font-mono">+{settings.speedRamp.toFixed(4)}/frame</span>
            </div>
            <input
              id="slider-speed-ramp"
              type="range"
              min="0.0005"
              max="0.0040"
              step="0.0005"
              value={settings.speedRamp}
              onChange={(e) => onUpdate({ speedRamp: parseFloat(e.target.value) })}
              className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
            />
          </div>

          {/* Bird Score Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
              <span>Bird Spawning Score Floor</span>
              <span className="font-mono">{settings.birdScoreThreshold} pts</span>
            </div>
            <input
              id="slider-bird-score"
              type="range"
              min="0"
              max="800"
              step="50"
              value={settings.birdScoreThreshold}
              onChange={(e) => onUpdate({ birdScoreThreshold: parseInt(e.target.value, 10) })}
              className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            id="btn-reset-tuning"
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            id="btn-apply-tuning"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
