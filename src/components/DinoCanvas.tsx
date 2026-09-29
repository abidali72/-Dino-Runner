import React, { useEffect, useRef } from 'react';
import { GameStatus, DinoState, Obstacle, Cloud, GroundBump, GameSettings } from '../types';
import { sounds } from '../audio';

interface DinoCanvasProps {
  settings: GameSettings;
  isNightMode: boolean;
  onScoreChange: (score: number, highScore: number) => void;
  onStatusChange: (status: GameStatus) => void;
  gameRef: React.MutableRefObject<{
    jump: () => void;
    setDuck: (duck: boolean) => void;
    restart: () => void;
  } | null>;
}

const CANVAS_W = 600;
const CANVAS_H = 180;
const GROUND_Y = 150;

const DINO_STAND_W = 40;
const DINO_STAND_H = 44;
const DINO_DUCK_W = 55;
const DINO_DUCK_H = 26;

export const DinoCanvas: React.FC<DinoCanvasProps> = ({
  settings,
  isNightMode,
  onScoreChange,
  onStatusChange,
  gameRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for continuous mutable state inside requestAnimationFrame
  const stateRef = useRef<{
    status: GameStatus;
    score: number;
    highScore: number;
    speed: number;
    groundX: number;
    nextObstacleGap: number;
    scoreFlashTimer: number;
    nextObsId: number;
    clouds: Cloud[];
    obstacles: Obstacle[];
    groundBumps: GroundBump[];
    dino: DinoState;
    stars: { x: number; y: number; s: number }[];
  }>({
    status: 'idle',
    score: 0,
    highScore: 0,
    speed: settings.startingSpeed,
    groundX: 0,
    nextObstacleGap: 80,
    scoreFlashTimer: 0,
    nextObsId: 1,
    clouds: [
      { id: 1, x: 180, y: 35, w: 46, h: 14 },
      { id: 2, x: 420, y: 55, w: 46, h: 14 },
    ],
    obstacles: [],
    groundBumps: [],
    dino: {
      x: 45,
      y: GROUND_Y - DINO_STAND_H,
      w: DINO_STAND_W,
      h: DINO_STAND_H,
      vy: 0,
      gravity: settings.gravity,
      jumpForce: settings.jumpForce,
      grounded: true,
      ducking: false,
      legTimer: 0,
    },
    stars: [],
  });

  // Keep settings ref updated
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
    stateRef.current.dino.gravity = settings.gravity;
    stateRef.current.dino.jumpForce = settings.jumpForce;
    sounds.enabled = settings.soundEnabled;
  }, [settings]);

  // Read saved high score once
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dino_runner_hi');
      if (saved) {
        const val = parseInt(saved, 10) || 0;
        stateRef.current.highScore = val;
        onScoreChange(0, val);
      }
    } catch {
      // Ignore localStorage error
    }
  }, [onScoreChange]);

  // Pre-seed ground bumps & night stars
  useEffect(() => {
    const bumps: GroundBump[] = [];
    for (let i = 0; i < 45; i++) {
      bumps.push({
        x: Math.random() * CANVAS_W * 2,
        length: 2 + Math.floor(Math.random() * 5),
        offsetY: Math.floor(Math.random() * 5),
      });
    }
    stateRef.current.groundBumps = bumps;

    const stars: { x: number; y: number; s: number }[] = [];
    for (let i = 0; i < 20; i++) {
      stars.push({
        x: Math.random() * CANVAS_W,
        y: 10 + Math.random() * 60,
        s: Math.random() > 0.6 ? 2 : 1,
      });
    }
    stateRef.current.stars = stars;
  }, []);

  // Expose jump & duck actions
  const jump = () => {
    const s = stateRef.current;
    if (s.status === 'idle' || s.status === 'gameover') {
      resetGame();
      return;
    }
    if (s.dino.grounded && !s.dino.ducking) {
      s.dino.vy = s.dino.jumpForce;
      s.dino.grounded = false;
      sounds.play('jump');
    }
  };

  const setDuck = (duck: boolean) => {
    const s = stateRef.current;
    if (s.status !== 'playing') return;
    if (duck) {
      if (s.dino.grounded) {
        s.dino.ducking = true;
        s.dino.w = DINO_DUCK_W;
        s.dino.h = DINO_DUCK_H;
        s.dino.y = GROUND_Y - DINO_DUCK_H;
      }
    } else {
      s.dino.ducking = false;
      s.dino.w = DINO_STAND_W;
      s.dino.h = DINO_STAND_H;
      s.dino.y = GROUND_Y - DINO_STAND_H;
    }
  };

  const resetGame = () => {
    const s = stateRef.current;
    s.status = 'playing';
    s.score = 0;
    s.speed = settingsRef.current.startingSpeed;
    s.nextObstacleGap = 80;
    s.groundX = 0;
    s.scoreFlashTimer = 0;
    s.obstacles = [];
    s.clouds = [
      { id: 1, x: 180, y: 35, w: 46, h: 14 },
      { id: 2, x: 440, y: 55, w: 46, h: 14 },
    ];

    s.dino.w = DINO_STAND_W;
    s.dino.h = DINO_STAND_H;
    s.dino.y = GROUND_Y - DINO_STAND_H;
    s.dino.vy = 0;
    s.dino.grounded = true;
    s.dino.ducking = false;
    s.dino.legTimer = 0;

    onStatusChange('playing');
    onScoreChange(0, s.highScore);
  };

  const endGame = () => {
    const s = stateRef.current;
    s.status = 'gameover';
    sounds.play('hit');

    const finalScore = Math.floor(s.score);
    if (finalScore > s.highScore) {
      s.highScore = finalScore;
      try {
        localStorage.setItem('dino_runner_hi', String(s.highScore));
      } catch {
        // Safe fallback
      }
    }
    onStatusChange('gameover');
    onScoreChange(finalScore, s.highScore);
  };

  // Provide external ref
  useEffect(() => {
    gameRef.current = {
      jump,
      setDuck,
      restart: resetGame,
    };
  });

  // Spawn Obstacles (Cacti or Birds)
  const spawnObstacle = () => {
    const s = stateRef.current;
    const allowBird = s.score > settingsRef.current.birdScoreThreshold;
    const spawnBird = allowBird && Math.random() < 0.35;

    if (spawnBird) {
      // 3 fixed heights: low (must jump), mid (must duck or jump), high (safe under)
      const heights = [GROUND_Y - 30, GROUND_Y - 50, GROUND_Y - 74];
      const chosenY = heights[Math.floor(Math.random() * heights.length)];
      s.obstacles.push({
        id: s.nextObsId++,
        type: 'bird',
        x: CANVAS_W + 20,
        y: chosenY,
        w: 42,
        h: 30,
        wingTimer: 0,
      });
    } else {
      const isLarge = Math.random() < 0.45;
      const clusterSize = Math.floor(Math.random() * 3) + 1; // 1 to 3
      let startX = CANVAS_W + 20;

      for (let i = 0; i < clusterSize; i++) {
        const w = isLarge ? 24 : 17;
        const h = isLarge ? 48 : 35;
        s.obstacles.push({
          id: s.nextObsId++,
          type: 'cactus',
          x: startX,
          y: GROUND_Y - h,
          w: w,
          h: h,
          isLarge: isLarge,
        });
        startX += w + 4;
      }
    }
  };

  // AABB collision check with 4px inward padding
  const rectsOverlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
    const pad = 4;
    return (
      a.x + pad < b.x + b.w - pad &&
      a.x + a.w - pad > b.x + pad &&
      a.y + pad < b.y + b.h - pad &&
      a.y + a.h - pad > b.y + pad
    );
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderLoop = () => {
      const s = stateRef.current;
      const conf = settingsRef.current;

      // Color selection based on night mode
      const fgColor = isNightMode ? '#e2e8f0' : '#475569';
      const bgColor = isNightMode ? '#18181b' : '#f8fafc';
      const groundColor = isNightMode ? '#64748b' : '#64748b';

      if (s.status === 'playing') {
        const prevHundred = Math.floor(s.score / 100);
        s.score += s.speed * 0.08;
        const currentHundred = Math.floor(s.score / 100);

        if (currentHundred > prevHundred && currentHundred > 0) {
          sounds.play('milestone');
          s.scoreFlashTimer = 32;
        }
        if (s.scoreFlashTimer > 0) s.scoreFlashTimer--;

        // Speed ramp
        s.speed += conf.speedRamp;

        // Dino physics
        if (!s.dino.grounded) {
          s.dino.vy += s.dino.gravity;
          s.dino.y += s.dino.vy;
          if (s.dino.y >= GROUND_Y - s.dino.h) {
            s.dino.y = GROUND_Y - s.dino.h;
            s.dino.vy = 0;
            s.dino.grounded = true;
          }
        }

        // Running leg animation counter
        s.dino.legTimer = (s.dino.legTimer + 1) % 12;

        // Ground scroll
        s.groundX = (s.groundX + s.speed) % CANVAS_W;

        // Parallax clouds
        for (let i = s.clouds.length - 1; i >= 0; i--) {
          s.clouds[i].x -= s.speed * 0.3;
          if (s.clouds[i].x + s.clouds[i].w < -20) {
            s.clouds.splice(i, 1);
          }
        }
        if (Math.random() < 0.008 && s.clouds.length < 5) {
          s.clouds.push({
            id: s.nextObsId++,
            x: CANVAS_W + 20,
            y: 20 + Math.random() * 50,
            w: 46,
            h: 14,
          });
        }

        // Obstacles scroll & animation
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          if (obs.type === 'bird') {
            obs.wingTimer = ((obs.wingTimer || 0) + 1) % 20;
          }

          // Collision test
          if (rectsOverlap(s.dino, obs)) {
            endGame();
            break;
          }

          // Remove offscreen
          if (obs.x + obs.w < -20) {
            s.obstacles.splice(i, 1);
          }
        }

        // Spawn obstacles
        s.nextObstacleGap--;
        if (s.nextObstacleGap <= 0) {
          spawnObstacle();
          const minGap = Math.max(35, Math.floor(75 - s.speed * 2));
          const maxGap = Math.max(minGap + 15, Math.floor(130 - s.speed * 3));
          s.nextObstacleGap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        }

        onScoreChange(Math.floor(s.score), s.highScore);
      }

      // --- Rendering ---
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // In night mode, draw faint stars & crescent moon
      if (isNightMode) {
        ctx.fillStyle = '#94a3b8';
        s.stars.forEach((st) => {
          ctx.fillRect(st.x, st.y, st.s, st.s);
        });

        // Crescent moon
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(520, 32, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(516, 30, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      // 1. Draw Clouds
      ctx.fillStyle = fgColor;
      ctx.globalAlpha = isNightMode ? 0.35 : 0.45;
      s.clouds.forEach((c) => {
        ctx.fillRect(c.x, c.y + 4, c.w, c.h - 4);
        ctx.fillRect(c.x + 8, c.y, c.w - 18, 6);
        ctx.fillRect(c.x + 22, c.y - 2, 12, 6);
      });
      ctx.globalAlpha = 1.0;

      // 2. Draw Ground Line & Texture
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      ctx.fillStyle = groundColor;
      s.groundBumps.forEach((b) => {
        let drawX = (b.x - s.groundX) % (CANVAS_W * 2);
        if (drawX < 0) drawX += CANVAS_W * 2;
        if (drawX <= CANVAS_W) {
          ctx.fillRect(drawX, GROUND_Y + 2 + b.offsetY, b.length, 1);
        }
      });

      // 3. Draw Obstacles
      s.obstacles.forEach((obs) => {
        ctx.fillStyle = fgColor;
        const x = obs.x;
        const y = obs.y;
        const w = obs.w;
        const h = obs.h;

        if (obs.type === 'cactus') {
          if (!obs.isLarge) {
            const trunkW = 6;
            const trunkX = x + Math.floor((w - trunkW) / 2);
            ctx.fillRect(trunkX, y, trunkW, h);
            ctx.fillRect(x, y + 10, trunkX - x, 4);
            ctx.fillRect(x, y + 4, 4, 10);
            ctx.fillRect(trunkX + trunkW, y + 14, x + w - (trunkX + trunkW), 4);
            ctx.fillRect(x + w - 4, y + 8, 4, 10);
          } else {
            const trunkW = 8;
            const trunkX = x + Math.floor((w - trunkW) / 2);
            ctx.fillRect(trunkX, y, trunkW, h);
            ctx.fillRect(x, y + 15, trunkX - x, 5);
            ctx.fillRect(x, y + 8, 5, 12);
            ctx.fillRect(trunkX + trunkW, y + 22, x + w - (trunkX + trunkW), 5);
            ctx.fillRect(x + w - 5, y + 14, 5, 13);
          }
        } else if (obs.type === 'bird') {
          // Bird torso
          ctx.fillRect(x + 12, y + 12, 18, 9);
          // Head
          ctx.fillRect(x + 28, y + 8, 8, 8);
          // Beak
          ctx.fillRect(x + 36, y + 10, 6, 4);
          // Eye
          ctx.fillStyle = bgColor;
          ctx.fillRect(x + 32, y + 9, 2, 2);
          ctx.fillStyle = fgColor;
          // Tail
          ctx.fillRect(x + 4, y + 13, 8, 5);
          ctx.fillRect(x, y + 14, 4, 3);

          // Animated wings
          const wingTimer = obs.wingTimer || 0;
          if (wingTimer < 10) {
            ctx.beginPath();
            ctx.moveTo(x + 14, y + 12);
            ctx.lineTo(x + 22, y - 2);
            ctx.lineTo(x + 26, y + 12);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(x + 14, y + 18);
            ctx.lineTo(x + 22, y + 30);
            ctx.lineTo(x + 26, y + 18);
            ctx.closePath();
            ctx.fill();
          }
        }
      });

      // 4. Draw Dino
      const d = s.dino;
      ctx.fillStyle = fgColor;

      if (!d.ducking) {
        // Standing Dino
        ctx.fillRect(d.x + 22, d.y, 18, 16);
        ctx.fillRect(d.x + 30, d.y + 6, 10, 8);

        // Eye
        ctx.fillStyle = bgColor;
        if (s.status === 'gameover') {
          // X / crossed eye
          ctx.fillRect(d.x + 26, d.y + 3, 4, 4);
          ctx.fillStyle = fgColor;
          ctx.fillRect(d.x + 27, d.y + 4, 2, 2);
        } else {
          ctx.fillRect(d.x + 26, d.y + 3, 3, 3);
        }
        ctx.fillStyle = fgColor;

        // Torso
        ctx.fillRect(d.x + 10, d.y + 14, 22, 18);
        // Tail
        ctx.fillRect(d.x, d.y + 14, 10, 8);
        ctx.fillRect(d.x + 2, d.y + 22, 8, 4);
        // Arm
        ctx.fillRect(d.x + 26, d.y + 19, 6, 3);
        ctx.fillRect(d.x + 30, d.y + 22, 2, 3);

        // Legs
        if (!d.grounded) {
          ctx.fillRect(d.x + 14, d.y + 32, 4, 9);
          ctx.fillRect(d.x + 14, d.y + 41, 6, 3);
          ctx.fillRect(d.x + 22, d.y + 32, 4, 7);
        } else if (s.status === 'idle') {
          ctx.fillRect(d.x + 14, d.y + 32, 4, 9);
          ctx.fillRect(d.x + 14, d.y + 41, 6, 3);
          ctx.fillRect(d.x + 22, d.y + 32, 4, 9);
          ctx.fillRect(d.x + 22, d.y + 41, 6, 3);
        } else {
          if (d.legTimer < 6) {
            ctx.fillRect(d.x + 14, d.y + 32, 4, 9);
            ctx.fillRect(d.x + 14, d.y + 41, 6, 3);
            ctx.fillRect(d.x + 22, d.y + 32, 4, 5);
            ctx.fillRect(d.x + 24, d.y + 37, 4, 3);
          } else {
            ctx.fillRect(d.x + 14, d.y + 32, 4, 5);
            ctx.fillRect(d.x + 16, d.y + 37, 4, 3);
            ctx.fillRect(d.x + 22, d.y + 32, 4, 9);
            ctx.fillRect(d.x + 22, d.y + 41, 6, 3);
          }
        }
      } else {
        // Ducking Dino
        ctx.fillRect(d.x + 8, d.y + 4, 30, 14);
        ctx.fillRect(d.x + 38, d.y + 4, 17, 12);
        ctx.fillRect(d.x + 48, d.y + 8, 7, 6);

        ctx.fillStyle = bgColor;
        ctx.fillRect(d.x + 42, d.y + 6, 3, 3);
        ctx.fillStyle = fgColor;

        ctx.fillRect(d.x, d.y + 4, 8, 6);
        ctx.fillRect(d.x + 32, d.y + 11, 5, 3);

        if (d.legTimer < 6) {
          ctx.fillRect(d.x + 14, d.y + 18, 4, 6);
          ctx.fillRect(d.x + 14, d.y + 24, 6, 2);
          ctx.fillRect(d.x + 24, d.y + 18, 4, 4);
        } else {
          ctx.fillRect(d.x + 14, d.y + 18, 4, 4);
          ctx.fillRect(d.x + 24, d.y + 18, 4, 6);
          ctx.fillRect(d.x + 24, d.y + 24, 6, 2);
        }
      }

      // 5. Draw HUD Text
      ctx.fillStyle = fgColor;
      ctx.font = "bold 13px 'Courier New', Courier, monospace";
      ctx.textAlign = 'right';

      const pad5 = (n: number) => String(Math.floor(n)).padStart(5, '0');
      const hiStr = `HI ${pad5(s.highScore)}`;
      const scoreStr = pad5(s.score);

      const showCurrentScore = s.scoreFlashTimer === 0 || Math.floor(s.scoreFlashTimer / 4) % 2 === 0;

      ctx.globalAlpha = 0.55;
      ctx.fillText(hiStr, CANVAS_W - 75, 24);
      ctx.globalAlpha = 1.0;

      if (showCurrentScore) {
        ctx.fillText(scoreStr, CANVAS_W - 15, 24);
      }

      // Overlay messages
      if (s.status === 'idle') {
        ctx.textAlign = 'center';
        ctx.font = "14px 'Courier New', Courier, monospace";
        ctx.fillText('PRESS SPACE OR TAP TO JUMP', CANVAS_W / 2, 85);
      } else if (s.status === 'gameover') {
        ctx.textAlign = 'center';
        ctx.font = "bold 16px 'Courier New', Courier, monospace";
        ctx.fillText('G A M E   O V E R', CANVAS_W / 2, 70);

        ctx.font = "20px 'Courier New', Courier, monospace";
        ctx.fillText('↺', CANVAS_W / 2, 98);

        ctx.font = "12px 'Courier New', Courier, monospace";
        ctx.fillText('PRESS SPACE OR TAP TO RESTART', CANVAS_W / 2, 120);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isNightMode, onScoreChange, onStatusChange]);

  // Global Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setDuck(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        setDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      id="canvas-stage-wrapper"
      className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm bg-[#f8fafc] dark:bg-[#18181b]"
    >
      <canvas
        id="dino-game-canvas"
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={(e) => {
          e.preventDefault();
          jump();
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
        className="w-full h-auto block select-none cursor-pointer image-pixelated"
        style={{ imageRendering: 'pixelated' }}
        aria-label="Dino Runner Canvas"
      />
    </div>
  );
};
