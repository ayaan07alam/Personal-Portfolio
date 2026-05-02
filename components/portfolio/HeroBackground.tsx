'use client';

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Blob 1 — violet, top-right */}
            <div
                className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full animate-float-slow opacity-30"
                style={{
                    background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0) 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Blob 2 — teal/sky, bottom-left */}
            <div
                className="absolute -bottom-[15%] -left-[15%] w-[600px] h-[600px] rounded-full animate-float-slow opacity-25"
                style={{
                    background: 'radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0) 70%)',
                    filter: 'blur(80px)',
                    animationDelay: '-8s',
                }}
            />

            {/* Blob 3 — emerald, center-right, very subtle */}
            <div
                className="absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full animate-float-slow opacity-15"
                style={{
                    background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0) 70%)',
                    filter: 'blur(60px)',
                    animationDelay: '-14s',
                }}
            />

            {/* Noise / grain overlay — very subtle */}
            <div className="absolute inset-0 opacity-[0.015]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
            />
        </div>
    );
}
