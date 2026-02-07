import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { PrivacyPolicy } from './components/PrivacyPolicy';

function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0d1117] flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        {showPrivacy ? (
          <div className="absolute inset-0 z-50 overflow-y-auto bg-[#0d1117] p-4">
            <button
              onClick={() => setShowPrivacy(false)}
              className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              닫기
            </button>
            <PrivacyPolicy />
          </div>
        ) : (
          <GameCanvas />
        )}
      </div>

      <footer className="h-10 bg-black/40 backdrop-blur-sm border-t border-white/5 flex items-center justify-between px-4 z-40 text-[10px] text-white/30">
        <div>© 2026 ZigZag Game</div>
        <div className="flex gap-4">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-white/60 transition-colors">Privacy Policy</button>
          <a href="/" className="hover:text-white/60 transition-colors">Home</a>
        </div>
      </footer>
    </main>
  );
}

export default App;
