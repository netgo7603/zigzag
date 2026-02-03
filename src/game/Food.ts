import { Food } from '../types/game';
import { GAME_CONFIG, FOOD_COLORS } from './constants';
import { generateId, randomRange, randomChoice } from './utils';

export function createFood(worldWidth: number, worldHeight: number, canBeTimeItem: boolean = true): Food {
  const margin = 50;
  const radius = randomRange(GAME_CONFIG.FOOD_MIN_RADIUS, GAME_CONFIG.FOOD_MAX_RADIUS);

  return {
    id: generateId(),
    x: randomRange(margin, worldWidth - margin),
    y: randomRange(margin, worldHeight - margin),
    radius,
    color: randomChoice(FOOD_COLORS),
    value: Math.ceil(radius / 2),
    type: canBeTimeItem && Math.random() < (GAME_CONFIG as any).TIME_ITEM_CHANCE ? 'time' : 'normal',
  };
}

export function createFoods(count: number, worldWidth: number, worldHeight: number): Food[] {
  const foods: Food[] = [];
  for (let i = 0; i < count; i++) {
    foods.push(createFood(worldWidth, worldHeight));
  }
  return foods;
}

export function spawnFoodNearPosition(
  x: number,
  y: number,
  spread: number,
  worldWidth: number,
  worldHeight: number
): Food {
  const margin = 50;
  const offsetX = randomRange(-spread, spread);
  const offsetY = randomRange(-spread, spread);

  const newX = Math.max(margin, Math.min(worldWidth - margin, x + offsetX));
  const newY = Math.max(margin, Math.min(worldHeight - margin, y + offsetY));

  return {
    id: generateId(),
    x: newX,
    y: newY,
    radius: randomRange(GAME_CONFIG.FOOD_MIN_RADIUS, GAME_CONFIG.FOOD_MAX_RADIUS),
    color: randomChoice(FOOD_COLORS),
    value: GAME_CONFIG.FOOD_VALUE,
    type: 'normal',
  };
}
