import { formatScore } from '../game/utils';
import { AdSense } from './AdSense';

interface GameOverProps {
  score: number;
  length: number;
  onRestart: () => void;
}

export function GameOver({ score, length, onRestart }: GameOverProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 safe-area-top safe-area-bottom overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* 게임 오버 텍스트 */}
        <div className="text-center mb-6">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
            Game Over
          </h2>
          <p className="text-[#8b949e]">벽에 부딪혔습니다!</p>
        </div>

        {/* 결과 */}
        <div className="w-full bg-[#161b22]/80 rounded-2xl p-6 mb-6 border border-[#30363d]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#8b949e]">최종 점수</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {formatScore(score)}
            </span>
          </div>
          <div className="h-px bg-[#30363d] mb-4" />
          <div className="flex justify-between items-center">
            <span className="text-[#8b949e]">최종 길이</span>
            <span className="text-3xl font-bold text-cyan-400">
              {length}
            </span>
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

        {/* 다시하기 버튼 */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600
                   text-white font-bold text-xl
                   transition-all duration-200 active:scale-[0.98]"
        >
          다시 하기
        </button>

        {/* 팁 */}
        <p className="mt-4 text-[#484f58] text-sm">
          Tip: 빨간 폭탄을 조심하세요!
        </p>
      </div>
    </div>
  );
}
