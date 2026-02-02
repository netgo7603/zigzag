import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseProps {
    slot: string;
    format?: string;
    style?: React.CSSProperties;
    className?: string;
}

export function AdSense({ slot, format = 'auto', style, className }: AdSenseProps) {
    useEffect(() => {
        let isLoaded = false;
        const insElement = document.getElementById(`ad-${slot}`);

        const loadAd = () => {
            if (isLoaded) return;
            try {
                if (window.adsbygoogle && insElement && insElement.offsetWidth > 0) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    isLoaded = true;
                }
            } catch (e) {
                console.error('AdSense push error:', e);
            }
        };

        // 너비 변화를 감지하여 너비가 확보되면 광고 로드
        const observer = new ResizeObserver(() => {
            if (!isLoaded && insElement && insElement.offsetWidth > 0) {
                loadAd();
            }
        });

        if (insElement) {
            observer.observe(insElement);
        }

        // 백업용 지연 실행
        const timer = setTimeout(loadAd, 500);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [slot]);

    return (
        <div className={className} style={{ width: '100%', minWidth: '250px', minHeight: '100px', ...style }}>
            <ins
                id={`ad-${slot}`}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-1032715451644664"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
