import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseAdProps {
    client: string;
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    responsive?: 'true' | 'false';
    style?: React.CSSProperties;
    className?: string;
}

export function AdSenseAd({
    client,
    slot,
    format = 'auto',
    responsive = 'true',
    style = { display: 'block' },
    className = '',
}: AdSenseAdProps) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className={`adsense-container ${className}`} style={{ overflow: 'hidden', minHeight: '100px' }}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
}
