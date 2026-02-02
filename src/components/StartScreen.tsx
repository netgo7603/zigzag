import { useState, useEffect, useRef } from 'react';

interface StartScreenProps {
  onStart: (playerName: string, profileImage?: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 제한 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('파일 크기는 2MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = playerName.trim() || '플레이어';
    onStart(name, profileImage);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end bg-[#0d1117] overflow-y-auto px-10 pb-5 sm:pb-8">
      {/* 배경 그라데이션 효과 - 시각적 깊이감 추가 */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-purple-500/15 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,196,255,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-[310px] sm:max-w-sm">
        <div className="relative text-center p-8 sm:p-10 rounded-[2rem] bg-[#161b22]/95 backdrop-blur-3xl border border-[#3c444d]/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col gap-6">

          {/* 로고 영역 - 간격 확대 */}
          <div className="space-y-3">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-sm">
                ZigZag
              </span>
            </h1>
            <p className="text-[#8b949e] text-xl font-medium tracking-wide"><br>지렁이 서바이벌</br></p>
          </div>

          {/* 프로필 & 닉네임 입력 폼 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* 프로필 사진 업로드 */}
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-24 h-24 rounded-full bg-[#0d1117] border-2 border-dashed border-[#30363d]
                         flex items-center justify-center cursor-pointer overflow-hidden
                         hover:border-cyan-500 transition-all duration-300"
              >
                {profileImage ? (
                  <img src={profileImage} alt="프로필" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="text-center group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📷</span>
                    <p className="text-[10px] text-[#484f58] mt-1 uppercase tracking-tighter">Photo</p>
                  </div>
                )}
                {/* 호버 효과 블러 */}
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-[#8b949e] text-sm font-medium">나만의 프로필</p>
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="닉네임 입력"
                maxLength={15}
                className="w-full px-6 py-5 rounded-2xl bg-[#0d1117] border border-[#30363d]
                         text-white placeholder-[#484f58] focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10
                         text-center text-xl transition-all duration-300 shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600
                       text-white font-black text-2xl shadow-lg shadow-cyan-500/20
                       hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/40
                       transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              게임 시작
            </button>
          </form>

          {/* 조작 안내 - 디자인 세분화 */}
          <div className="pt-8 border-t border-[#30363d]/50">
            <div className="bg-[#0d1117]/50 rounded-2xl p-6 text-left space-y-4">
              <p className="font-bold text-white text-base flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                플레이 가이드
              </p>

              <div className="text-[#8b949e] text-[0.9rem] leading-relaxed space-y-2">
                {isMobile ? (
                  <>
                    <p className="flex items-center gap-2"><span className="text-cyan-500">☝</span> 터치로 자유롭게 이동</p>
                    <p className="flex items-center gap-2"><span className="text-cyan-500">🔥</span> 롱 터치로 부스터 활성화</p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2"><span className="text-cyan-500">🖱</span> 마우스 방향으로 이동</p>
                    <p className="flex items-center gap-2"><span className="text-cyan-500">⌨</span> <span className="bg-[#30363d] px-2 py-0.5 rounded text-xs text-white">SPACE</span> 부스터 사용</p>
                  </>
                )}
                <div className="h-px bg-[#30363d]/50 my-2" />
                <p className="flex items-center gap-2"><span className="text-green-500">✨</span> 먹이를 먹고 몸집 키우기</p>
                <p className="flex items-center gap-2"><span className="text-red-500">💣</span> 폭탄을 피해 생존하세요!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
