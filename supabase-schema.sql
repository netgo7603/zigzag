-- Supabase에서 실행할 테이블 생성 SQL

-- 리더보드 테이블 생성
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  nickname VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  length INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 점수 기준 내림차순 인덱스 (순위 조회 최적화)
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- 날짜 기준 인덱스 (오늘의 순위 조회 최적화)
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- 모든 사용자가 점수 삽입 가능
CREATE POLICY "Anyone can insert scores" ON leaderboard
  FOR INSERT WITH CHECK (true);
