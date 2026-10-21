import React from 'react';

export const BatikBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic colorful mesh gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-cyan-400/25 via-teal-500/20 to-transparent blur-3xl" />
      <div className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-blue-600/25 via-indigo-500/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-500/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-[15%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tl from-emerald-400/20 via-teal-600/15 to-transparent blur-3xl" />

      {/* Subtle traditional Indonesian Batik Kawung & Mega Mendung SVG motif accents */}
      <svg
        className="absolute top-0 right-0 w-[420px] h-[420px] opacity-10 text-white transform rotate-12"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <defs>
          <pattern id="batikKawung" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="0" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="0" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#batikKawung)" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-[380px] h-[380px] opacity-10 text-white transform -rotate-12"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <rect width="200" height="200" fill="url(#batikKawung)" />
      </svg>

      {/* Subtle grid pattern for modern touch interface */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
    </div>
  );
};
