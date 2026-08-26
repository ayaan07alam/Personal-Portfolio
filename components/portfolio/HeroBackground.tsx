'use client';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[var(--bg-main)] transition-colors duration-200">
      {/* Subtle Hairline Grid using CSS border variable */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-300"
        style={{
          backgroundImage:
            'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Gradient Glows (Top Left & Top Right) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] transition-opacity duration-300" />
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] transition-opacity duration-300" />
    </div>
  );
}
