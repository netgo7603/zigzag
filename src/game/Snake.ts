import { Snake, Segment, Point } from '../types/game';
import { GAME_CONFIG, SNAKE_COLORS } from './constants';
import { generateId, randomChoice, normalizeAngle, angleDiff } from './utils';

export function createSnake(name: string, x: number, y: number): Snake {
  const segments: Segment[] = [];
  const color = randomChoice(SNAKE_COLORS);
  const radius = GAME_CONFIG.SNAKE_SEGMENT_RADIUS;

  // 초기 세그먼트 생성
  for (let i = 0; i < GAME_CONFIG.SNAKE_INITIAL_LENGTH; i++) {
    segments.push({
      x: x - i * GAME_CONFIG.SNAKE_SEGMENT_DISTANCE,
      y,
      radius,
    });
  }

  return {
    id: generateId(),
    name,
    segments,
    angle: 0,
    targetAngle: 0,
    speed: GAME_CONFIG.SNAKE_BASE_SPEED,
    baseSpeed: GAME_CONFIG.SNAKE_BASE_SPEED,
    boosting: false,
    color,
    score: 0,
    alive: true,
  };
}

export function updateSnake(snake: Snake, worldWidth: number, worldHeight: number): void {
  if (!snake.alive) return;

  // 각도 부드럽게 회전
  const diff = angleDiff(snake.angle, snake.targetAngle);
  snake.angle += diff * GAME_CONFIG.SNAKE_TURN_SPEED;
  snake.angle = normalizeAngle(snake.angle);

  // 부스터 처리
  if (snake.boosting && snake.segments.length > GAME_CONFIG.SNAKE_INITIAL_LENGTH) {
    snake.speed = GAME_CONFIG.SNAKE_BOOST_SPEED;
    // 부스터 사용 시 길이 감소
    if (Math.random() < GAME_CONFIG.BOOST_COST * 0.1) {
      snake.segments.pop();
      snake.score = Math.max(0, snake.score - 1);
    }
  } else {
    snake.speed = GAME_CONFIG.SNAKE_BASE_SPEED;
    snake.boosting = false;
  }

  // 머리 이동
  const head = snake.segments[0];
  const newX = head.x + Math.cos(snake.angle) * snake.speed;
  const newY = head.y + Math.sin(snake.angle) * snake.speed;

  // 월드 경계 체크 (충돌)
  const margin = head.radius;
  if (newX < margin || newX > worldWidth - margin ||
      newY < margin || newY > worldHeight - margin) {
    snake.alive = false;
    return;
  }

  // 새로운 머리 위치 설정
  const newHead: Segment = {
    x: newX,
    y: newY,
    radius: head.radius,
  };

  // 세그먼트들을 앞 세그먼트 방향으로 따라오게 함
  for (let i = snake.segments.length - 1; i > 0; i--) {
    const current = snake.segments[i];
    const target = snake.segments[i - 1];

    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > GAME_CONFIG.SNAKE_SEGMENT_DISTANCE) {
      const ratio = GAME_CONFIG.SNAKE_SEGMENT_DISTANCE / dist;
      current.x = target.x - dx * ratio;
      current.y = target.y - dy * ratio;
    }
  }

  snake.segments[0] = newHead;
}

export function setSnakeTarget(snake: Snake, targetX: number, targetY: number): void {
  const head = snake.segments[0];
  snake.targetAngle = Math.atan2(targetY - head.y, targetX - head.x);
}

export function growSnake(snake: Snake, amount: number = 1): void {
  const tail = snake.segments[snake.segments.length - 1];
  const prevTail = snake.segments[snake.segments.length - 2] || tail;

  for (let i = 0; i < amount; i++) {
    const dx = tail.x - prevTail.x;
    const dy = tail.y - prevTail.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    snake.segments.push({
      x: tail.x + (dx / dist) * GAME_CONFIG.SNAKE_SEGMENT_DISTANCE,
      y: tail.y + (dy / dist) * GAME_CONFIG.SNAKE_SEGMENT_DISTANCE,
      radius: tail.radius,
    });
  }

  snake.score += amount;
}

export function checkSelfCollision(snake: Snake): boolean {
  if (snake.segments.length < 20) return false;

  const head = snake.segments[0];

  // 머리에서 일정 거리 이상 떨어진 세그먼트와만 충돌 체크
  for (let i = 15; i < snake.segments.length; i++) {
    const segment = snake.segments[i];
    const dx = head.x - segment.x;
    const dy = head.y - segment.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < head.radius + segment.radius * 0.8) {
      return true;
    }
  }

  return false;
}

export function getSnakeHead(snake: Snake): Point {
  return snake.segments[0];
}

export function getSnakeLength(snake: Snake): number {
  return snake.segments.length;
}

export function shrinkSnake(snake: Snake, amount: number): number {
  const minLength = GAME_CONFIG.SNAKE_INITIAL_LENGTH;
  const actualShrink = Math.min(amount, snake.segments.length - minLength);

  if (actualShrink > 0) {
    for (let i = 0; i < actualShrink; i++) {
      snake.segments.pop();
    }
    snake.score = Math.max(0, snake.score - actualShrink);
  }

  return actualShrink;
}
