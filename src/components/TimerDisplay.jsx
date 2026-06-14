import React, { useMemo } from 'react';

export default function TimerDisplay({ timeLeft, duration, isActive }) {
  // Format seconds to MM:SS
  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Calculate progress percent and SVG circle offset
  const progress = useMemo(() => {
    return Math.min(1, Math.max(0, (duration - timeLeft) / duration));
  }, [timeLeft, duration]);

  // Circle SVG properties
  const radius = 64;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius; // approx 402.12
  const strokeDashoffset = circumference - progress * circumference;

  const statusText = useMemo(() => {
    if (timeLeft === 0) return 'Session Completed';
    if (isActive) return 'Flow State Active';
    return 'Flow Paused';
  }, [timeLeft, isActive]);

  return (
    <aside className="glass-panel w-full lg:w-80 rounded-2xl p-6 md:p-8 flex flex-col justify-between items-center space-y-8 relative overflow-hidden transition-all duration-300">
      {/* Decorative corner glow */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="w-full text-center lg:text-left">
        <h2 className="text-sm font-semibold tracking-widest text-gold-400 uppercase mb-2">Display</h2>
        <h1 className="text-2xl md:text-3xl font-serif text-gold-gradient font-light">Time tracking</h1>
        <p className="text-obsidian-400 text-xs mt-1">Monitor your real-time session progress.</p>
      </div>

      {/* Radial Progress Clock dial */}
      <div className="relative flex items-center justify-center my-4">
        {/* Outer Glow Ring */}
        <div className="absolute w-44 h-44 rounded-full border border-gold-500/10 pointer-events-none" />

        {/* SVG Circle Progress */}
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 140 140">
          {/* Base Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-obsidian-900"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Golden Progress */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-gold-400 transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Digital Time Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-light tracking-tight font-sans text-gold-100">
            {formattedTime}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-gold-500 font-semibold mt-1">
            Remaining
          </span>
        </div>
      </div>

      {/* Numerical Progress details */}
      <div className="w-full space-y-4">
        {/* Percent complete */}
        <div className="flex justify-between items-center text-xs border-b border-obsidian-900/60 pb-3">
          <span className="text-obsidian-400">Completion</span>
          <span className="font-semibold text-gold-200">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* Active Session time */}
        <div className="flex justify-between items-center text-xs border-b border-obsidian-900/60 pb-3">
          <span className="text-obsidian-400">Total Duration</span>
          <span className="font-semibold text-gold-200">
            {Math.round(duration / 60)} min
          </span>
        </div>

        {/* Current status info */}
        <div className="flex justify-between items-center text-xs pb-1">
          <span className="text-obsidian-400">Status</span>
          <span
            className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full ${
              timeLeft === 0
                ? 'bg-gold-950 border border-gold-500/20 text-gold-400'
                : isActive
                ? 'bg-gold-500/10 text-gold-300'
                : 'bg-obsidian-900 text-obsidian-400'
            }`}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* Quote/Mindfulness cue */}
      <div className="w-full text-center pt-2 border-t border-obsidian-900 text-obsidian-400 text-[10px] italic">
        "Time flows like sand. Focus on the present."
      </div>
    </aside>
  );
}
