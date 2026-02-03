export interface Point {
  x: number;
  y: number;
}

export interface Segment extends Point {
  radius: number;
}

export type FoodType = 'normal' | 'time';

export interface Food {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  value: number;
  type: FoodType;
}

export interface Bomb {
  id: string;
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  createdAt: number;
}

// 폭발 파티클
export interface ExplosionParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  createdAt: number;
}

export interface Snake {
  id: string;
  name: string;
  segments: Segment[];
  angle: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  boosting: boolean;
  color: string;
  score: number;
  alive: boolean;
  profileImage?: string; // 프로필 이미지 (base64 또는 URL)
}

export interface GameState {
  snake: Snake;
  foods: Food[];
  bombs: Bomb[];
  floatingTexts: FloatingText[];
  explosionParticles: ExplosionParticle[];
  gameOver: boolean;
  started: boolean;
  paused: boolean;
  pauseCount: number;
  maxPauseCount: number;
  worldWidth: number;
  worldHeight: number;
  timeLeft: number;
}

export type GameScreen = 'start' | 'playing' | 'gameover' | 'paused';
