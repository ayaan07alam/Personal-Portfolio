'use client';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[var(--bg-main)] transition-colors duration-200">
      {/* Subtle Hairline Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(128,128,128,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
