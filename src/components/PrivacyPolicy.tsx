

export function PrivacyPolicy() {
    return (
        <div className="bg-[#0d1117] text-white/80 p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto my-8">
            <h1 className="text-2xl font-bold mb-4 text-white">개인정보 처리방침 (Privacy Policy)</h1>
            <p className="mb-4">
                본 사이트는 Google AdSense를 사용하여 광고를 게재합니다. 이에 따라 다음과 같은 사항을 준수합니다.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-white/90">로그 파일 및 쿠키</h2>
            <p className="mb-4">
                Google을 포함한 제3자 제공업체는 사용자의 이전 방문을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.
                광고 쿠키를 사용하면 Google과 그 파트너는 본 사이트 또는 다른 사이트 방문을 바탕으로 사용자에게 광고를 게재할 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-white/90">사용자 선택권</h2>
            <p className="mb-4">
                사용자는 <a href="https://adssettings.google.com" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Google 광고 설정</a>을 방문하여 맞춤형 광고 게재를 중단할 수 있습니다.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-white/90">데이터 수집</h2>
            <p className="mb-4">
                이 서비스에서는 게임 랭킹을 위해 닉네임과 점수를 수집할 수 있습니다. 수집된 데이터는 게임 기능 제공 목적으로만 사용됩니다.
            </p>

            <div className="mt-8 text-sm text-white/40">
                최종 수정일: 2026년 2월 7일
            </div>
        </div>
    );
}
