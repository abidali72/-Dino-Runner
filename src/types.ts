export type GameStatus = 'idle' | 'playing' | 'gameover';

export interface DinoState {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  gravity: number;
  jumpForce: number;
  grounded: boolean;
  ducking: boolean;
  legTimer: number;
}

export interface Obstacle {
  id: number;
  type: 'cactus' | 'bird';
  x: number;
  y: number;
  w: number;
  h: number;
  isLarge?: boolean;
  wingTimer?: number;
}

export interface Cloud {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GroundBump {
  x: number;
  length: number;
  offsetY: number;
}

export interface GameSettings {
  startingSpeed: number;
  speedRamp: number;
  jumpForce: number;
  gravity: number;
  birdScoreThreshold: number;
  soundEnabled: boolean;
  nightModeEnabled: boolean;
}
