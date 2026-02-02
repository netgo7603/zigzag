import { Bomb } from '../types/game';
import { GAME_CONFIG } from './constants';
import { generateId, randomRange } from './utils';

export function createBomb(worldWidth: number, worldHeight: number): Bomb {
  const margin = 100;

  return {
    id: generateId(),
    x: randomRange(margin, worldWidth - margin),
    y: randomRange(margin, worldHeight - margin),
    radius: GAME_CONFIG.BOMB_RADIUS,
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

export function createBombs(count: number, worldWidth: number, worldHeight: number): Bomb[] {
  const bombs: Bomb[] = [];
  for (let i = 0; i < count; i++) {
    bombs.push(createBomb(worldWidth, worldHeight));
  }
  return bombs;
}

export function updateBombPulse(bomb: Bomb): void {
  bomb.pulsePhase += 0.1;
  if (bomb.pulsePhase > Math.PI * 2) {
    bomb.pulsePhase -= Math.PI * 2;
  }
}
