// 게임 설정 상수
export const GAME_CONFIG = {
  // 월드 크기
  WORLD_WIDTH: 3000,
  WORLD_HEIGHT: 3000,

  // 지렁이 설정
  SNAKE_INITIAL_LENGTH: 10,
  SNAKE_SEGMENT_RADIUS: 12,
  SNAKE_BASE_SPEED: 10,
  SNAKE_BOOST_SPEED: 10,
  SNAKE_TURN_SPEED: 0.08,
  SNAKE_SEGMENT_DISTANCE: 8,

  // 먹이 설정
  FOOD_COUNT: 500,
  FOOD_MIN_RADIUS: 4,
  FOOD_MAX_RADIUS: 8,
  FOOD_VALUE: 1,

  // 폭탄 설정
  BOMB_COUNT: 40,
  BOMB_RADIUS: 12,
  BOMB_DAMAGE: 15, // 꼬리 15칸 감소

  // 시간 설정
  INITIAL_TIME: 15, // 15초
  TIME_ITEM_INCREMENT: 3, // 10초 증가
  TIME_ITEM_CHANCE: 0.05, // 5% 확률로 시간 아이템 생성
  MAX_TIME_ITEMS: 10, // 시간 아이템 최대 10개

  // 부스터 설정
  BOOST_COST: 0.5,

  // 플로팅 텍스트 설정
  FLOATING_TEXT_DURATION: 1500, // ms

  // 렌더링 설정
  GRID_SIZE: 50,
  BACKGROUND_COLOR: '#0d1117',
  GRID_COLOR: '#161b22',
} as const;

// 지렁이 색상 팔레트 (더 세련된 네온 색상)
export const SNAKE_COLORS = [
  '#00d4ff', // 시안
  '#00ff88', // 네온 그린
  '#ff6b9d', // 네온 핑크
  '#c084fc', // 퍼플
  '#fbbf24', // 골드
  '#f472b6', // 핑크
  '#34d399', // 에메랄드
  '#60a5fa', // 블루
  '#fb923c', // 오렌지
  '#a78bfa', // 바이올렛
];

// 먹이 색상 팔레트
export const FOOD_COLORS = [
  '#00d4ff',
  '#00ff88',
  '#ff6b9d',
  '#c084fc',
  '#fbbf24',
  '#f472b6',
  '#34d399',
  '#60a5fa',
  '#fb923c',
  '#a78bfa',
  '#22d3ee',
  '#4ade80',
];
