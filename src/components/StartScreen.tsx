import { useState, useEffect, useRef } from 'react';

interface StartScreenProps {
  onStart: (playerName: string, profileImage?: string) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('파일 크기는 4MB 이하여야 합니다.');
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
    const name = playerName.trim();
    if (!name) return;
    onStart(name, profileImage);
  };

  const isNameValid = playerName.trim().length > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030712] overflow-hidden">
      {/* 애니메이션 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 그리드 패턴 오버레이 */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* 메인 카드 */}
      <div className={`relative w-full max-w-md mx-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
          {/* 카드 상단 글로우 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* 로고 */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    ZigZag
                  </span>
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 rounded-full opacity-60" />
              </div>
              <p className="text-white/40 text-sm font-medium tracking-widest uppercase mt-4">Survival Game</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 프로필 업로드 */}
              <div className="flex justify-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full opacity-0 group-hover:opacity-70 blur transition-all duration-500" />
                  <div className="relative w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-white/30 group-hover:scale-105">
                    {profileImage ? (
                      <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-white/30 group-hover:text-white/60 transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[10px] font-medium uppercase tracking-wider">Avatar</span>
                      </div>
                    )}
                  </div>
                  {/* 플러스 아이콘 */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* 닉네임 입력 */}
              <div className="relative group mb-2">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300" />
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={15}
                  required
                  className={`relative w-full px-5 py-4 rounded-xl bg-white/5 border
                           text-white placeholder-white/25 text-center text-lg font-medium
                           focus:outline-none focus:bg-white/[0.07]
                           transition-all duration-300
                           ${isNameValid ? 'border-white/10 focus:border-white/20' : 'border-white/10 focus:border-cyan-500/50'}`}
                />
              </div>

              {/* 닉네임 안내 메시지 */}
              <p className={`text-center text-sm mb-4 transition-colors ${isNameValid ? 'text-emerald-400' : 'text-white/40'}`}>
                {isNameValid ? '✓ 멋진 닉네임이에요!' : '닉네임을 입력해주세요'}
              </p>

              {/* 시작 버튼 */}
              <button
                type="submit"
                disabled={!isNameValid}
                className={`group relative w-full py-4 rounded-xl overflow-hidden transition-all duration-300
                          ${isNameValid ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${isNameValid ? 'from-cyan-500 via-violet-500 to-fuchsia-500' : 'from-gray-500 via-gray-600 to-gray-500'}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.3),transparent_70%)]" />
                <span className="relative text-white font-bold text-lg tracking-wide flex items-center justify-center gap-2">
                  게임 시작
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>

            {/* 친구 초대용 QR 코드 */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Play with Friends</span>
              </div>

              <div className="group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-fuchsia-500/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative p-2 rounded-2xl bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:scale-[1.1] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <img
                    src="/qr.png"
                    alt="Game QR Code"
                    className="w-36 h-36 rounded-lg transition-all duration-500"
                  />
                  {/* 스캔 유도 뱃지 - QR 코드를 가리지 않도록 하단 배치 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-violet-600 border border-white/20 shadow-xl whitespace-nowrap">
                      <span className="text-[10px] text-white font-black tracking-widest uppercase">Scan with Camera</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-white/30 text-[10px] text-center font-medium leading-relaxed">
                친구에게 QR 코드를 보여주세요!<br />함께라면 더 즐거워요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
