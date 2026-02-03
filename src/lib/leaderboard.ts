import { supabase } from './supabase';

export interface LeaderboardEntry {
  id?: number;
  nickname: string;
  score: number;
  length: number;
  created_at?: string;
  rank?: number;
}

// 점수 저장
export async function saveScore(nickname: string, score: number, length: number): Promise<LeaderboardEntry | null> {
  try {
    console.log('점수 저장 시도:', { nickname, score, length });

    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ nickname, score, length }])
      .select()
      .single();

    if (error) {
      console.error('점수 저장 오류:', error.message, error.details, error.hint);
      return null;
    }

    console.log('점수 저장 성공:', data);
    return data;
  } catch (err) {
    console.error('점수 저장 실패:', err);
    return null;
  }
}

// 상위 10명 순위 조회
export async function getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    console.log('순위 조회 시도');

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('순위 조회 오류:', error.message, error.details, error.hint);
      return [];
    }

    console.log('순위 조회 성공:', data);
    return (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  } catch (err) {
    console.error('순위 조회 실패:', err);
    return [];
  }
}

// 특정 점수의 순위 조회
export async function getScoreRank(score: number): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    if (error) {
      console.error('순위 조회 오류:', error);
      return 0;
    }

    return (count || 0) + 1;
  } catch (err) {
    console.error('순위 조회 실패:', err);
    return 0;
  }
}

// 오늘의 상위 순위 조회
export async function getTodayTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('오늘 순위 조회 오류:', error);
      return [];
    }

    return (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  } catch (err) {
    console.error('오늘 순위 조회 실패:', err);
    return [];
  }
}
