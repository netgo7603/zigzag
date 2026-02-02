import { GameState, Segment } from '../types/game';
import { GAME_CONFIG } from './constants';
import { createSnake, updateSnake, setSnakeTarget, growSnake, checkSelfCollision, getSnakeHead } from './Snake';
import { createFoods, createFood } from './Food';
import { createBombs, createBomb, updateBombPulse } from './Bomb';
import { circleCollision, generateId, randomRange } from './utils';

export class Game {
  private state: GameState;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private onUpdate: ((state: GameState) => void) | null = null;
  private explosionQueue: Segment[] = []; // 폭발 대기열
  private explosionTimer: number = 0;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      snake: createSnake(
        'Player',
        GAME_CONFIG.WORLD_WIDTH / 2,
        GAME_CONFIG.WORLD_HEIGHT / 2
      ),
      foods: createFoods(
        GAME_CONFIG.FOOD_COUNT,
        GAME_CONFIG.WORLD_WIDTH,
        GAME_CONFIG.WORLD_HEIGHT
      ),
      bombs: createBombs(
        GAME_CONFIG.BOMB_COUNT,
        GAME_CONFIG.WORLD_WIDTH,
        GAME_CONFIG.WORLD_HEIGHT
      ),
      floatingTexts: [],
      explosionParticles: [],
      gameOver: false,
      started: false,
      paused: false,
      pauseCount: 0,
      maxPauseCount: 3,
      worldWidth: GAME_CONFIG.WORLD_WIDTH,
      worldHeight: GAME_CONFIG.WORLD_HEIGHT,
    };
  }

  public start(playerName: string, profileImage?: string): void {
    this.state = this.createInitialState();
    this.state.snake.name = playerName;
    this.state.snake.profileImage = profileImage;
    this.state.started = true;
    this.state.gameOver = false;
    this.state.paused = false;
    this.explosionQueue = [];
    this.explosionTimer = 0;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public restart(playerName: string, profileImage?: string): void {
    this.stop();
    this.start(playerName, profileImage);
  }

  public togglePause(): void {
    if (!this.state.started || this.state.gameOver) return;

    this.state.paused = !this.state.paused;

    if (!this.state.paused) {
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  public isPaused(): boolean {
    return this.state.paused;
  }

  public setUpdateCallback(callback: (state: GameState) => void): void {
    this.onUpdate = callback;
  }

  public setMousePosition(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number): void {
    if (!this.state.started || this.state.gameOver || this.state.paused) return;

    const head = getSnakeHead(this.state.snake);

    const offsetX = screenX - canvasWidth / 2;
    const offsetY = screenY - canvasHeight / 2;

    const worldX = head.x + offsetX;
    const worldY = head.y + offsetY;

    setSnakeTarget(this.state.snake, worldX, worldY);
  }

  public setBoost(boosting: boolean): void {
    if (!this.state.started || this.state.gameOver || this.state.paused) return;
    this.state.snake.boosting = boosting;
  }

  public getState(): GameState {
    return this.state;
  }

  private addFloatingText(x: number, y: number, text: string, color: string): void {
    this.state.floatingTexts.push({
      id: generateId(),
      x,
      y,
      text,
      color,
      opacity: 1,
      createdAt: performance.now(),
    });
  }

  private addExplosionParticles(segment: Segment): void {
    const particleCount = 8;
    const color = this.state.snake.color;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + randomRange(-0.3, 0.3);
      const speed = randomRange(2, 5);

      this.state.explosionParticles.push({
        id: generateId(),
        x: segment.x,
        y: segment.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: randomRange(3, 6),
        color,
        opacity: 1,
        createdAt: performance.now(),
      });
    }
  }

  private gameLoop = (): void => {
    if (this.state.paused) {
      if (this.onUpdate) {
        this.onUpdate(this.state);
      }
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 16) {
      this.update();
      this.lastTime = currentTime;
    }

    if (!this.state.gameOver && !this.state.paused) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    if (this.onUpdate) {
      this.onUpdate(this.state);
    }
  };

  private update(): void {
    if (!this.state.started || this.state.gameOver || this.state.paused) return;

    const snake = this.state.snake;

    updateSnake(snake, this.state.worldWidth, this.state.worldHeight);

    if (!snake.alive) {
      this.state.gameOver = true;
      return;
    }

    if (checkSelfCollision(snake)) {
      snake.alive = false;
      this.state.gameOver = true;
      return;
    }

    // 폭탄 펄스 업데이트
    for (const bomb of this.state.bombs) {
      updateBombPulse(bomb);
    }

    // 폭발 대기열 처리 (순차적으로 터지는 효과)
    this.processExplosionQueue();

    this.checkFoodCollisions();
    this.checkBombCollisions();
    this.updateFloatingTexts();
    this.updateExplosionParticles();
    this.maintainFoodCount();
    this.maintainBombCount();
  }

  private processExplosionQueue(): void {
    if (this.explosionQueue.length === 0) return;

    this.explosionTimer++;

    // 5프레임마다 하나씩 폭발
    if (this.explosionTimer >= 5) {
      this.explosionTimer = 0;
      const segment = this.explosionQueue.shift();
      if (segment) {
        this.addExplosionParticles(segment);
      }
    }
  }

  private checkFoodCollisions(): void {
    const head = this.state.snake.segments[0];
    const eatenFoodIds: Set<string> = new Set();

    for (const food of this.state.foods) {
      if (circleCollision(
        head.x, head.y, head.radius,
        food.x, food.y, food.radius
      )) {
        eatenFoodIds.add(food.id);
        growSnake(this.state.snake, food.value);
        this.addFloatingText(food.x, food.y, `+${food.value}`, '#4ade80');
      }
    }

    if (eatenFoodIds.size > 0) {
      this.state.foods = this.state.foods.filter(f => !eatenFoodIds.has(f.id));
    }
  }

  private checkBombCollisions(): void {
    const head = this.state.snake.segments[0];
    const hitBombIds: Set<string> = new Set();

    for (const bomb of this.state.bombs) {
      if (circleCollision(
        head.x, head.y, head.radius,
        bomb.x, bomb.y, bomb.radius
      )) {
        hitBombIds.add(bomb.id);

        // 머리 바로 다음 세그먼트부터 5개 폭발
        const snake = this.state.snake;
        const minLength = GAME_CONFIG.SNAKE_INITIAL_LENGTH;
        const shrinkCount = Math.min(GAME_CONFIG.BOMB_DAMAGE, snake.segments.length - minLength);

        if (shrinkCount > 0) {
          // 머리 다음 위치(인덱스 1)부터 shrinkCount개의 세그먼트를 폭발 대기열에 추가
          const startIndex = 1;
          const segmentsToExplode = snake.segments.slice(startIndex, startIndex + shrinkCount);

          // 폭발할 세그먼트들을 대기열에 추가
          this.explosionQueue.push(...segmentsToExplode);

          // 세그먼트 제거 (머리 다음부터)
          snake.segments.splice(startIndex, shrinkCount);
          snake.score = Math.max(0, snake.score - shrinkCount);

          this.addFloatingText(bomb.x, bomb.y, `-${shrinkCount}`, '#ff4444');
        }
      }
    }

    if (hitBombIds.size > 0) {
      this.state.bombs = this.state.bombs.filter(b => !hitBombIds.has(b.id));
    }
  }

  private updateFloatingTexts(): void {
    const now = performance.now();
    this.state.floatingTexts = this.state.floatingTexts.filter(ft => {
      const age = now - ft.createdAt;
      if (age >= GAME_CONFIG.FLOATING_TEXT_DURATION) {
        return false;
      }
      ft.opacity = 1 - age / GAME_CONFIG.FLOATING_TEXT_DURATION;
      ft.y -= 0.5;
      return true;
    });
  }

  private updateExplosionParticles(): void {
    const now = performance.now();
    const duration = 500; // 0.5초

    this.state.explosionParticles = this.state.explosionParticles.filter(p => {
      const age = now - p.createdAt;
      if (age >= duration) {
        return false;
      }

      // 파티클 이동
      p.x += p.vx;
      p.y += p.vy;

      // 속도 감소
      p.vx *= 0.95;
      p.vy *= 0.95;

      // 투명도 감소
      p.opacity = 1 - age / duration;

      return true;
    });
  }

  private maintainFoodCount(): void {
    const deficit = GAME_CONFIG.FOOD_COUNT - this.state.foods.length;
    for (let i = 0; i < deficit; i++) {
      this.state.foods.push(
        createFood(this.state.worldWidth, this.state.worldHeight)
      );
    }
  }

  private maintainBombCount(): void {
    const deficit = GAME_CONFIG.BOMB_COUNT - this.state.bombs.length;
    for (let i = 0; i < deficit; i++) {
      this.state.bombs.push(
        createBomb(this.state.worldWidth, this.state.worldHeight)
      );
    }
  }
}
