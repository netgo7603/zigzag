import { useEffect, useState, useRef } from 'react';
import { formatScore } from '../game/utils';
import { saveScore, getTopScores, getScoreRank, LeaderboardEntry } from '../lib/leaderboard';
import { AdSenseAd } from './AdSenseAd';

interface GameOverProps {
  score: number;
  length: number;
  playerName: string;
  onRestart: () => void;
}

export function GameOver({ score, length, playerName, onRestart }: GameOverProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const submitScore = async () => {
      if (hasSubmitted.current) return;
      hasSubmitted.current = true;

      setIsLoading(true);

      // 점수 저장
      await saveScore(playerName, score, length);

      // 순위 조회
      const [topScores, rank] = await Promise.all([
        getTopScores(10),
        getScoreRank(score)
      ]);

      setLeaderboard(topScores);
      setMyRank(rank);
      setIsLoading(false);
    };

    submitScore();
  }, [playerName, score, length]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md max-h-full overflow-y-auto">
        <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* 상단 글로우 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="p-6 sm:p-8">
            {/* 게임 오버 헤더 */}
            <div className="text-center mb-6">
              <h2 className="text-4xl sm:text-5xl font-black mb-2">
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Game Over
                </span>
              </h2>
              <p className="text-white/40 text-sm">벽에 부딪혔습니다!</p>
            </div>

            {/* 내 결과 */}
            <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    {playerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{playerName}</p>
                    <p className="text-white/40 text-xs">
                      {myRank > 0 ? `#${myRank} 순위` : '순위 계산 중...'}
                    </p>
                  </div>
                </div>
                {myRank > 0 && myRank <= 3 && (
                  <div className="text-3xl">
                    {myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : '🥉'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-white/40 text-xs mb-1">점수</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {formatScore(score)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-white/40 text-xs mb-1">길이</p>
                  <p className="text-2xl font-black text-cyan-400">
                    {length}
                  </p>
                </div>
              </div>
            </div>

            {/* 리더보드 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Leaderboard</span>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${entry.nickname === playerName && entry.score === score
                        ? 'bg-cyan-500/20 border border-cyan-500/30'
                        : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.05]'
                        }`}
                    >
                      {/* 순위 */}
                      <div className="w-8 h-8 flex items-center justify-center">
                        {index === 0 ? (
                          <span className="text-xl">🥇</span>
                        ) : index === 1 ? (
                          <span className="text-xl">🥈</span>
                        ) : index === 2 ? (
                          <span className="text-xl">🥉</span>
                        ) : (
                          <span className="text-white/40 font-bold">{index + 1}</span>
                        )}
                      </div>

                      {/* 닉네임 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{entry.nickname}</p>
                        <p className="text-white/30 text-xs">{formatDate(entry.created_at)}</p>
                      </div>

                      {/* 점수 */}
                      <div className="text-right">
                        <p className="text-white font-bold">{formatScore(entry.score)}</p>
                        <p className="text-white/30 text-xs">길이 {entry.length}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/30">
                  <p>아직 기록이 없습니다</p>
                  <p className="text-sm mt-1">첫 번째 기록을 세워보세요!</p>
                </div>
              )}
            </div>

            {/* 다시하기 버튼 */}
            <button
              onClick={onRestart}
              className="group relative w-full py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_70%)]" />
              <span className="relative text-white font-bold text-lg flex items-center justify-center gap-2">
                다시 하기
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            </button>

            {/* 광고 영역 */}
            <div className="mt-4 rounded-xl overflow-hidden bg-white/5 border border-white/5 min-h-[100px] flex items-center justify-center">
              <AdSenseAd
                client="ca-pub-1032715451644664"
                slot="5712499147"
                format="auto"
                responsive="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
