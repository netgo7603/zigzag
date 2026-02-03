import { GameState, Snake, Food as FoodType, Bomb, FloatingText, ExplosionParticle, Point } from '../types/game';
import { GAME_CONFIG } from './constants';
import { getSnakeHead } from './Snake';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Point = { x: 0, y: 0 };
  private profileImageCache: Map<string, HTMLImageElement> = new Map();
  private isMobile: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    this.isMobile = 'ontouchstart' in window;
  }

  public resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
  }

  private loadProfileImage(src: string): HTMLImageElement | null {
    if (this.profileImageCache.has(src)) {
      const img = this.profileImageCache.get(src)!;
      return img.complete ? img : null;
    }

    const img = new Image();
    img.src = src;
    this.profileImageCache.set(src, img);
    return null;
  }

  public render(state: GameState): void {
    const { width, height } = this.canvas.getBoundingClientRect();

    if (state.snake.alive) {
      const head = getSnakeHead(state.snake);
      this.camera.x = head.x - width / 2;
      this.camera.y = head.y - height / 2;
    }

    this.ctx.fillStyle = GAME_CONFIG.BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, width, height);

    this.drawGrid(width, height);
    this.drawWorldBorder(state);
    this.drawFoods(state.foods, width, height);
    this.drawBombs(state.bombs, width, height);
    this.drawExplosionParticles(state.explosionParticles, width, height);
    this.drawSnake(state.snake);
    this.drawFloatingTexts(state.floatingTexts, width, height);

    // 모바일에서는 React HUD 사용, PC에서만 Canvas HUD 표시
    if (!this.isMobile) {
      this.drawHUD(state, width, height);

      if (state.paused) {
        this.drawPauseOverlay(width, height, state);
      }
    }
  }

  private worldToScreen(worldX: number, worldY: number): Point {
    return {
      x: worldX - this.camera.x,
      y: worldY - this.camera.y,
    };
  }

  private drawGrid(width: number, height: number): void {
    const gridSize = GAME_CONFIG.GRID_SIZE;
    this.ctx.strokeStyle = GAME_CONFIG.GRID_COLOR;
    this.ctx.lineWidth = 1;

    const startX = -((this.camera.x % gridSize) + gridSize) % gridSize;
    const startY = -((this.camera.y % gridSize) + gridSize) % gridSize;

    for (let x = startX; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    for (let y = startY; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
  }

  private drawWorldBorder(state: GameState): void {
    const borderWidth = 8;

    const topLeft = this.worldToScreen(0, 0);
    const bottomRight = this.worldToScreen(state.worldWidth, state.worldHeight);

    this.ctx.shadowColor = '#ff3366';
    this.ctx.shadowBlur = 20;
    this.ctx.strokeStyle = '#ff3366';
    this.ctx.lineWidth = borderWidth;

    this.ctx.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );

    this.ctx.shadowBlur = 0;
  }

  private drawFoods(foods: FoodType[], width: number, height: number): void {
    const margin = 50;

    for (const food of foods) {
      const screen = this.worldToScreen(food.x, food.y);

      if (screen.x < -margin || screen.x > width + margin ||
        screen.y < -margin || screen.y > height + margin) {
        continue;
      }

      const isTimeItem = food.type === 'time';
      const color = isTimeItem ? '#22d3ee' : food.color;
      const visualRadius = food.radius * (isTimeItem ? 3 : 1.5);

      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = isTimeItem ? 35 : 15;

      const gradient = this.ctx.createRadialGradient(
        screen.x, screen.y, 0,
        screen.x, screen.y, visualRadius
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, color);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, visualRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // 시간 아이템이면 시계 아이콘 같은 표시 추가
      if (isTimeItem) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, food.radius * 1.2, 0, Math.PI * 2);
        this.ctx.moveTo(screen.x, screen.y);
        this.ctx.lineTo(screen.x, screen.y - food.radius * 0.8);
        this.ctx.moveTo(screen.x, screen.y);
        this.ctx.lineTo(screen.x + food.radius * 0.6, screen.y);
        this.ctx.stroke();
      }

      this.ctx.shadowBlur = 0;
    }
  }

  private drawBombs(bombs: Bomb[], width: number, height: number): void {
    const margin = 50;

    for (const bomb of bombs) {
      const screen = this.worldToScreen(bomb.x, bomb.y);

      if (screen.x < -margin || screen.x > width + margin ||
        screen.y < -margin || screen.y > height + margin) {
        continue;
      }

      const pulse = Math.sin(bomb.pulsePhase) * 0.3 + 1;
      const radius = bomb.radius * pulse;

      this.ctx.shadowColor = '#ff0000';
      this.ctx.shadowBlur = 25;

      const gradient = this.ctx.createRadialGradient(
        screen.x, screen.y, 0,
        screen.x, screen.y, radius * 2
      );
      gradient.addColorStop(0, '#ff4444');
      gradient.addColorStop(0.4, '#cc0000');
      gradient.addColorStop(0.7, '#880000');
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, radius * 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ff2222';
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      const iconSize = radius * 0.5;
      this.ctx.moveTo(screen.x - iconSize, screen.y - iconSize);
      this.ctx.lineTo(screen.x + iconSize, screen.y + iconSize);
      this.ctx.moveTo(screen.x + iconSize, screen.y - iconSize);
      this.ctx.lineTo(screen.x - iconSize, screen.y + iconSize);
      this.ctx.stroke();

      this.ctx.shadowBlur = 0;
    }
  }

  private drawExplosionParticles(particles: ExplosionParticle[], width: number, height: number): void {
    const margin = 50;

    for (const p of particles) {
      const screen = this.worldToScreen(p.x, p.y);

      if (screen.x < -margin || screen.x > width + margin ||
        screen.y < -margin || screen.y > height + margin) {
        continue;
      }

      this.ctx.globalAlpha = p.opacity;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }
  }

  private drawSnake(snake: Snake): void {
    if (!snake.alive && snake.segments.length === 0) return;

    const segments = snake.segments;

    // 몸통 (뒤에서부터)
    for (let i = segments.length - 1; i >= 1; i--) {
      const segment = segments[i];
      const screen = this.worldToScreen(segment.x, segment.y);

      const brightness = 0.6 + (1 - i / segments.length) * 0.4;
      const color = this.adjustBrightness(snake.color, brightness);

      if (snake.boosting && i < 5) {
        this.ctx.shadowColor = snake.color;
        this.ctx.shadowBlur = 30;
      }

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, segment.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = this.adjustBrightness(snake.color, brightness * 1.2);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.shadowBlur = 0;
    }

    // 머리 그리기
    if (segments.length > 0) {
      this.drawSnakeHead(snake);
    }
  }

  private drawSnakeHead(snake: Snake): void {
    const head = snake.segments[0];
    const screen = this.worldToScreen(head.x, head.y);

    // 프로필 이미지가 있으면 원형으로 클리핑해서 그리기
    if (snake.profileImage) {
      const img = this.loadProfileImage(snake.profileImage);

      if (img) {
        this.ctx.save();

        // 원형 클리핑 마스크
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, head.radius, 0, Math.PI * 2);
        this.ctx.clip();

        // 이미지 그리기 (회전 적용)
        this.ctx.translate(screen.x, screen.y);
        this.ctx.rotate(snake.angle + Math.PI / 2);
        this.ctx.drawImage(
          img,
          -head.radius,
          -head.radius,
          head.radius * 2,
          head.radius * 2
        );

        this.ctx.restore();

        // 테두리
        this.ctx.strokeStyle = snake.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, head.radius, 0, Math.PI * 2);
        this.ctx.stroke();

        return;
      }
    }

    // 프로필 이미지가 없으면 기본 머리 + 눈
    const color = this.adjustBrightness(snake.color, 1);

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y, head.radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = this.adjustBrightness(snake.color, 1.2);
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.drawSnakeEyes(snake);
  }

  private drawSnakeEyes(snake: Snake): void {
    const head = snake.segments[0];
    const screen = this.worldToScreen(head.x, head.y);
    const eyeOffset = head.radius * 0.4;
    const eyeRadius = head.radius * 0.35;
    const pupilRadius = eyeRadius * 0.5;

    const perpAngle = snake.angle + Math.PI / 2;
    const forwardOffset = head.radius * 0.3;

    const leftEye = {
      x: screen.x + Math.cos(snake.angle) * forwardOffset + Math.cos(perpAngle) * eyeOffset,
      y: screen.y + Math.sin(snake.angle) * forwardOffset + Math.sin(perpAngle) * eyeOffset,
    };

    const rightEye = {
      x: screen.x + Math.cos(snake.angle) * forwardOffset - Math.cos(perpAngle) * eyeOffset,
      y: screen.y + Math.sin(snake.angle) * forwardOffset - Math.sin(perpAngle) * eyeOffset,
    };

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(leftEye.x, leftEye.y, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(rightEye.x, rightEye.y, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();

    const pupilOffset = eyeRadius * 0.25;
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(
      leftEye.x + Math.cos(snake.angle) * pupilOffset,
      leftEye.y + Math.sin(snake.angle) * pupilOffset,
      pupilRadius, 0, Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(
      rightEye.x + Math.cos(snake.angle) * pupilOffset,
      rightEye.y + Math.sin(snake.angle) * pupilOffset,
      pupilRadius, 0, Math.PI * 2
    );
    this.ctx.fill();
  }

  private drawFloatingTexts(texts: FloatingText[], width: number, height: number): void {
    for (const ft of texts) {
      const screen = this.worldToScreen(ft.x, ft.y);

      if (screen.x < -50 || screen.x > width + 50 ||
        screen.y < -50 || screen.y > height + 50) {
        continue;
      }

      this.ctx.globalAlpha = ft.opacity;
      this.ctx.fillStyle = ft.color;
      this.ctx.font = 'bold 24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.shadowColor = ft.color;
      this.ctx.shadowBlur = 15;
      this.ctx.fillText(ft.text, screen.x, screen.y);
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    }
  }

  private drawHUD(state: GameState, width: number, height: number): void {
    // 시간 (중앙 상단)
    const timeLeft = Math.ceil(state.timeLeft);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, '0');

    this.ctx.save();
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = timeLeft <= 10 ? '#ef4444' : '#fbbf24';
    this.ctx.shadowBlur = 15;
    this.ctx.fillStyle = timeLeft <= 10 ? '#ef4444' : '#fbbf24';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.fillText(`${minutes}:${seconds}`, width / 2, 50);
    this.ctx.restore();

    // 점수 패널 배경
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.roundRect(15, 15, 150, 70, 10);
    this.ctx.fill();

    // 점수
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`${state.snake.score}`, 25, 45);

    // 길이
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`길이: ${state.snake.segments.length}`, 25, 70);

    // 조작 안내 및 좌표 표시
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';

    const head = getSnakeHead(state.snake);
    const posText = `POS: ${Math.round(head.x)}, ${Math.round(head.y)}`;
    const controlText = 'ESC: 일시정지  |  SPACE: 부스터';

    this.ctx.fillText(`${controlText}    |    ${posText}`, 15, height - 15);

    // 미니맵
    this.drawMinimap(state, width);
  }

  private drawMinimap(state: GameState, width: number): void {
    const mapSize = 100;
    const mapX = width - mapSize - 15;
    const mapY = 15;
    const scale = mapSize / state.worldWidth;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
    this.ctx.fill();

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(mapX, mapY, mapSize, mapSize, 8);
    this.ctx.stroke();

    const head = getSnakeHead(state.snake);
    const playerMapX = mapX + head.x * scale;
    const playerMapY = mapY + head.y * scale;

    this.ctx.shadowColor = state.snake.color;
    this.ctx.shadowBlur = 5;
    this.ctx.fillStyle = state.snake.color;
    this.ctx.beginPath();
    this.ctx.arc(playerMapX, playerMapY, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  private drawPauseOverlay(width: number, height: number, _state: GameState): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = '#00d4ff';
    this.ctx.shadowBlur = 20;
    this.ctx.fillText('일시정지', width / 2, height / 2 - 20);

    this.ctx.font = '18px Arial';
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.fillText('ESC 또는 P를 눌러 계속하기', width / 2, height / 2 + 30);
  }

  private adjustBrightness(hex: string, factor: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    return `rgb(${newR}, ${newG}, ${newB})`;
  }
}
