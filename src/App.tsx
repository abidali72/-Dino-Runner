import { useState, useRef, useEffect } from 'react';
import { GameStatus, GameSettings } from './types';
import { DinoCanvas } from './components/DinoCanvas';
import { TouchControls } from './components/TouchControls';
import { GameHeader } from './components/GameHeader';
import { GameDetails } from './components/GameDetails';
import { TuningModal } from './components/TuningModal';

const DEFAULT_SETTINGS: GameSettings = {
  startingSpeed: 6.0,
  speedRamp: 0.0015,
  jumpForce: -11.5,
  gravity: 0.62,
  birdScoreThreshold: 300,
  soundEnabled: true,
  nightModeEnabled: false,
};

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [isNightMode, setIsNightMode] = useState(false);
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const gameRef = useRef<{
    jump: () => void;
    setDuck: (duck: boolean) => void;
    restart: () => void;
  } | null>(null);

  // Automatic night mode cycle when enabled / based on score
  useEffect(() => {
    if (settings.nightModeEnabled) {
      setIsNightMode(true);
      return;
    }
    // Chrome dino inverts colors every ~700 points for a duration of 200 points
    if (score > 0) {
      const inNightPeriod = (score % 700) > 450;
      setIsNightMode(inNightPeriod);
    } else {
      setIsNightMode(false);
    }
  }, [score, settings.nightModeEnabled]);

  // Sync dark class on document element
  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isNightMode]);

  const handleScoreChange = (newScore: number, newHighScore: number) => {
    setScore(newScore);
    setHighScore(newHighScore);
  };

  const handleStatusChange = (newStatus: GameStatus) => {
    setStatus(newStatus);
  };

  const handleToggleNightMode = () => {
    setSettings((prev) => ({
      ...prev,
      nightModeEnabled: !prev.nightModeEnabled,
    }));
  };

  const handleToggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const handleUpdateSettings = (updated: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div
      id="app-root"
      className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 transition-colors duration-500"
    >
      <main
        id="game-wrapper"
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4"
      >
        {/* Header Bar with Scores and Toggles */}
        <GameHeader
          score={score}
          highScore={highScore}
          isNightMode={isNightMode}
          onToggleNightMode={handleToggleNightMode}
          settings={settings}
          onToggleSound={handleToggleSound}
          onOpenTuning={() => setIsTuningOpen(true)}
        />

        {/* 600x180 Procedural Canvas Area */}
        <div className="relative">
          <DinoCanvas
            settings={settings}
            isNightMode={isNightMode}
            onScoreChange={handleScoreChange}
            onStatusChange={handleStatusChange}
            gameRef={gameRef}
          />
        </div>

        {/* Mobile / Click Touch Controls */}
        <TouchControls
          status={status}
          onJump={() => gameRef.current?.jump()}
          onDuckChange={(duck) => gameRef.current?.setDuck(duck)}
        />

        {/* Informative Specs & Controls breakdown */}
        <GameDetails />
      </main>

      {/* Physics & Difficulty Customization Modal */}
      <TuningModal
        isOpen={isTuningOpen}
        onClose={() => setIsTuningOpen(false)}
        settings={settings}
        onUpdate={handleUpdateSettings}
        onReset={handleResetSettings}
      />
    </div>
  );
}
