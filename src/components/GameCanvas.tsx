import { useEffect, useRef, useCallback, useState } from 'react';
import { Game } from '../game/Game';
import { Renderer } from '../game/Renderer';
import { GameState, GameScreen } from '../types/game';
import { StartScreen } from './StartScreen';
import { GameOver } from './GameOver';
import { AdSense } from './AdSense';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('zigzag_player_name') || '플레이어';
  });
  const profileImageRef = useRef<string | undefined>(undefined);

  const [screen, setScreen] = useState<GameScreen>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [finalLength, setFinalLength] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);
  const [currentRemainingTime, setCurrentRemainingTime] = useState(120);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 모바일 감지
  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  // 게임 초기화
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const game = new Game();
    const renderer = new Renderer(canvas);

    gameRef.current = game;
    rendererRef.current = renderer;

    const handleResize = () => {
      renderer.resize();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    game.setUpdateCallback((state: GameState) => {
      renderer.render(state);

      setIsPaused(state.paused);
      setCurrentScore(state.snake.score);
      setCurrentLength(state.snake.segments.length);
      setCurrentRemainingTime(Math.ceil(state.timeLeft));

      // 현재 좌표 갱신 (반올림)
      if (state.snake.segments.length > 0) {
        setCurrentPos({
          x: Math.round(state.snake.segments[0].x),
          y: Math.round(state.snake.segments[0].y)
        });
      }

      if (state.gameOver && screen !== 'gameover') {
        setFinalScore(state.snake.score);
        setFinalLength(state.snake.segments.length);
        setScreen('gameover');
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      game.stop();
    };
  }, []);

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gameRef.current.setMousePosition(x, y, rect.width, rect.height);
  }, []);

  // 터치 이동 핸들러
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!gameRef.current || !canvasRef.current) return;
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    gameRef.current.setMousePosition(x, y, rect.width, rect.height);
  }, []);

  // 키보드 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRef.current) return;

      if (e.code === 'Space') {
        e.preventDefault();
        gameRef.current.setBoost(true);
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        gameRef.current.togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameRef.current) {
        gameRef.current.setBoost(false);
      }
    };

    const handleTouchStart = () => {
      if (gameRef.current) {
        setTimeout(() => {
          if (gameRef.current) gameRef.current.setBoost(true);
        }, 200);
      }
    };

    const handleTouchEnd = () => {
      if (gameRef.current) {
        gameRef.current.setBoost(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 네이티브 이벤트 리스너로 passive: false 설정 (preventDefault 가능하게)
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove as unknown as EventListener, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  // 게임 시작
  const handleStart = useCallback((name: string, profileImage?: string) => {
    setPlayerName(name);
    localStorage.setItem('zigzag_player_name', name);
    profileImageRef.current = profileImage;
    if (gameRef.current) {
      gameRef.current.start(name, profileImage);
      setScreen('playing');
    }
  }, []);

  // 게임 재시작
  const handleRestart = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.restart(playerName, profileImageRef.current);
      setScreen('playing');
    }
  }, [playerName]);

  // 일시정지 토글
  const handlePause = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.togglePause();
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0d1117]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none"
        onMouseMove={handleMouseMove}
      />

      {/* 모바일 HUD */}
      {isMobile && screen === 'playing' && !isPaused && (
        <div className="absolute top-0 left-0 right-0 p-4 safe-area-top">
          <div className="flex items-center gap-3">
            {/* 점수판 */}
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-[#161b22]/90 backdrop-blur-md border border-[#30363d]/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span className="text-xl font-bold text-white">{currentScore}</span>
              </div>

              <div className="w-px h-6 bg-[#30363d]" />

              <div className="flex items-center gap-2">
                <span className="text-xl">🐍</span>
                <span className="text-xl font-bold text-cyan-400">{currentLength}</span>
              </div>
            </div>

            {/* 정지 버튼 */}
            <button
              onClick={handlePause}
              className="w-14 h-14 rounded-2xl bg-[#161b22]/90 backdrop-blur-md border border-[#30363d]/50
                       flex items-center justify-center text-2xl text-white active:scale-95 transition-transform"
            >
              ⏸
            </button>
          </div>

          {/* 중앙 타이머 (모바일 전용) */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <div className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
              <span className={`text-2xl font-black ${currentRemainingTime <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                {Math.floor(currentRemainingTime / 60)}:{String(currentRemainingTime % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* 모바일 미니맵 (우측 상단 배치) */}
          <div className="absolute top-4 right-4 w-24 h-24 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden pointer-events-none">
            {/* 플레이어 위치 마커 */}
            <div
              className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"
              style={{
                left: `${(currentPos.x / 3000) * 100}%`,
                top: `${(currentPos.y / 3000) * 100}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.1s linear'
              }}
            />
            {/* 미니맵 장식 라인 */}
            <div className="absolute inset-0 border border-white/5 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 일시정지 오버레이 */}
      {screen === 'playing' && isPaused && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 safe-area-top safe-area-bottom">
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
            {/* 일시정지 헤더 */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-4xl">⏸️</span>
              </div>
              <h2 className="text-4xl font-bold text-white">일시정지</h2>
            </div>

            {/* 현재 점수 */}
            <div className="w-full flex justify-center gap-8 mb-6 py-4 px-6 rounded-2xl bg-[#161b22]/80 border border-[#30363d]">
              <div className="text-center">
                <p className="text-sm text-[#8b949e] mb-1">점수</p>
                <p className="text-3xl font-bold text-white">{currentScore}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#8b949e] mb-1">길이</p>
                <p className="text-3xl font-bold text-cyan-400">{currentLength}</p>
              </div>
            </div>

            {/* 광고 영역 */}
            <div className="w-full min-h-[250px] mb-6 rounded-2xl bg-[#1c2128] border border-[#30363d] flex items-center justify-center overflow-hidden">
              <AdSense
                slot="1032715451644664"
                format="rectangle"
                className="w-full h-full flex items-center justify-center"
              />
            </div>

            {/* 계속하기 버튼 */}
            <button
              onClick={handlePause}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600
                       text-white font-bold text-xl
                       transition-all duration-200 active:scale-[0.98]"
            >
              계속하기
            </button>

            <p className="text-[#8b949e] text-sm mt-4">
              {isMobile ? '버튼을 눌러 계속하기' : 'ESC 또는 P를 눌러 계속하기'}
            </p>
          </div>
        </div>
      )}

      {screen === 'start' && (
        <StartScreen onStart={handleStart} initialPlayerName={playerName} />
      )}

      {screen === 'gameover' && (
        <GameOver
          score={finalScore}
          length={finalLength}
          playerName={playerName}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
