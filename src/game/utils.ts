import { Point } from '../types/game';

// 두 점 사이의 거리 계산
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 두 원의 충돌 감지
export function circleCollision(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < r1 + r2;
}

// 랜덤 숫자 생성 (min ~ max)
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// 랜덤 정수 생성 (min ~ max)
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

// 배열에서 랜덤 요소 선택
export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 각도 정규화 (-PI ~ PI)
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

// 두 각도 사이의 최단 회전 방향
export function angleDiff(from: number, to: number): number {
  const diff = normalizeAngle(to - from);
  return diff;
}

// 고유 ID 생성
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// 점수 포맷팅
export function formatScore(score: number): string {
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M';
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K';
  }
  return score.toString();
}

// 선형 보간
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// 클램프
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
