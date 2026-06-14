import React from 'react';
import { Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';

export default function ControlPanel({
  isActive,
  onStartPause,
  onReset,
  onFlip,
  duration,
  onSelectDuration,
}) {
  const durations = [1, 3, 5, 10, 30, 60];

  return (
    <aside className="glass-panel w-full lg:w-80 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden transition-all duration-300">
      {/* Decorative top corner gold highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold tracking-widest text-gold-400 uppercase mb-2">Controls</h2>
        <h1 className="text-2xl md:text-3xl font-serif text-gold-gradient font-light">Timer settings</h1>
        <p className="text-obsidian-400 text-xs mt-1">Configure and manage your focused session.</p>
      </div>

      {/* Duration Selector */}
      <div className="flex flex-col space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-obsidian-300">Select Duration</span>
        <div className="grid grid-cols-3 gap-2">
          {durations.map((mins) => {
            const secs = mins * 60;
            const isSelected = duration === secs;
            return (
              <button
                key={mins}
                id={`duration-${mins}`}
                onClick={() => onSelectDuration(secs)}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-gold-500/10 border-gold-400/40 text-gold-300 shadow-[0_0_15px_rgba(204,160,98,0.15)]'
                    : 'bg-obsidian-900/40 border-obsidian-800 text-obsidian-300 hover:border-gold-500/30 hover:text-gold-200'
                }`}
              >
                <span className="text-lg font-semibold">{mins}</span>
                <span className="text-[10px] uppercase opacity-75">min</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col space-y-4">
        {/* Play/Pause Main Button */}
        <button
          id="btn-play-pause"
          onClick={onStartPause}
          className={`w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center space-x-3 transition-all duration-300 ${
            isActive
              ? 'bg-obsidian-800 hover:bg-obsidian-750 text-gold-400 border border-gold-500/30'
              : 'bg-gold-gradient text-obsidian-950 font-bold bg-gold-glow bg-gold-glow-hover'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSE SESSION</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>START SESSION</span>
            </>
          )}
        </button>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-flip"
            onClick={onFlip}
            className="py-3.5 px-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-obsidian-200 hover:border-gold-500/30 hover:text-gold-200 flex items-center justify-center space-x-2 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-gold-500" />
            <span className="text-xs font-semibold tracking-wider">FLIP</span>
          </button>
          
          <button
            id="btn-reset"
            onClick={onReset}
            className="py-3.5 px-4 rounded-xl bg-obsidian-900/60 border border-obsidian-800 text-obsidian-200 hover:border-gold-500/30 hover:text-gold-200 flex items-center justify-center space-x-2 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 text-gold-500" />
            <span className="text-xs font-semibold tracking-wider">RESET</span>
          </button>
        </div>
      </div>
      
      {/* Session State Badge */}
      <div className="pt-2 border-t border-obsidian-900 text-center">
        <span className="text-[10px] tracking-widest text-obsidian-500 uppercase font-bold">
          {isActive ? 'FLOW IN PROGRESS' : 'SESSION IDLE'}
        </span>
      </div>
    </aside>
  );
}
