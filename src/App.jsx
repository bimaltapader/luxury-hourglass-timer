import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Compass, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import Hourglass3D from './components/Hourglass3D';
import ControlPanel from './components/ControlPanel';
import TimerDisplay from './components/TimerDisplay';

// Procedural mechanical tick-tock audio synthesizer using Web Audio API
const playTickSound = (isTock) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Alternate pitch between tick (1050Hz) and tock (850Hz) for realism
    osc.frequency.setValueAtTime(isTock ? 850 : 1050, audioCtx.currentTime);
    osc.type = 'sine';

    // Ultra short, subtle wood block style decay envelope
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (error) {
    console.warn('AudioContext failed to play tick:', error);
  }
};

// Procedural bell chime chord synthesizer for session completion
const playCompletionSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    
    // Play a luxury harmonic chord (E Major: E4, G#4, B4, E5)
    const frequencies = [329.63, 415.30, 493.88, 659.25];
    
    frequencies.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.type = 'sine';
      
      // Slight delay between notes for a premium rolled strum effect
      const startTime = audioCtx.currentTime + idx * 0.05;
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);
      
      osc.start(startTime);
      osc.stop(startTime + 2.6);
    });
  } catch (error) {
    console.warn('AudioContext failed to play completion sound:', error);
  }
};

export default function App() {
  const [duration, setDuration] = useState(60); // Default to 1 minute (60 seconds)
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef(null);

  // Timer countdown effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            triggerCompletionEffect();
            if (!isMuted) {
              playCompletionSound();
            }
            return 0;
          }
          if (!isMuted) {
            playTickSound(prev % 2 === 0);
          }
          return prev - 1;
        });
      }, 1000);

      // Play starting tick sound immediately
      if (!isMuted) {
        playTickSound(timeLeft % 2 === 0);
      }
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, isMuted]);

  // Trigger celebration on completion
  const triggerCompletionEffect = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 50 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      // Confetti colors matching gold and bronze luxury theme
      const colors = ['#ebd3ae', '#dcb37d', '#cca062', '#be8a4d', '#805732'];
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
    }, 250);
  };

  // Start / Pause handler
  const handleStartPause = () => {
    if (timeLeft === 0) {
      // If completed, flip or reset before starting
      setTimeLeft(duration);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  // Reset handler
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  // Select new duration handler
  const handleSelectDuration = (newDuration) => {
    setIsActive(false);
    setDuration(newDuration);
    setTimeLeft(newDuration);
  };

  // Flip hourglass handler (simulates physics)
  const handleFlip = () => {
    setRotationAngle((prev) => prev + Math.PI);
    
    if (timeLeft === 0) {
      // If sand had completely run out, flipping restarts the flow with full duration
      setTimeLeft(duration);
    } else {
      // Realistic physics: flipping midway means the remaining sand is now at the top
      // and the accumulated sand starts draining. Remaining sand time becomes duration - timeLeft
      setTimeLeft((prev) => duration - prev);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-between p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-bronze-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-950/10 blur-[120px] pointer-events-none" />

      {/* Decorative stars / particles in background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#cca062_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center z-10 py-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center bg-obsidian-900/50">
            <Compass className="w-4 h-4 text-gold-400 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-serif font-light tracking-[0.25em] text-gold-gradient">A U R A</span>
            <span className="text-[8px] uppercase tracking-widest text-gold-500/80 block -mt-1 font-semibold">Luxury Hourglass</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mute/Unmute sound toggle button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-gold-500/10 hover:border-gold-500/30 bg-obsidian-900/50 hover:bg-obsidian-800 text-gold-400 hover:text-gold-200 transition-all duration-300 shadow-sm cursor-pointer"
            title={isMuted ? "Unmute ticking sound" : "Mute ticking sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center space-x-2 text-xs text-gold-300/60 glass-panel py-1.5 px-3 rounded-full border border-gold-500/10">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium tracking-wide">Flow Session Active</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6 z-10">
        {/* Left Control Panel Column */}
        <section className="lg:col-span-3 order-2 lg:order-1 flex justify-center">
          <ControlPanel
            isActive={isActive}
            onStartPause={handleStartPause}
            onReset={handleReset}
            onFlip={handleFlip}
            duration={duration}
            onSelectDuration={handleSelectDuration}
          />
        </section>

        {/* Center 3D Hourglass Column */}
        <section className="lg:col-span-6 order-1 lg:order-2 h-[55vh] lg:h-[70vh] flex flex-col justify-center items-center">
          <Hourglass3D
            timeLeft={timeLeft}
            duration={duration}
            isActive={isActive}
            rotationAngle={rotationAngle}
          />
          {/* Subtle status caption under 3D scene */}
          <p className="text-[10px] text-obsidian-400 tracking-[0.2em] uppercase mt-2 hidden lg:block select-none">
            DRAG TO ROTATE &bull; PINCH TO ZOOM
          </p>
        </section>

        {/* Right Timer Display Column */}
        <section className="lg:col-span-3 order-3 flex justify-center">
          <TimerDisplay
            timeLeft={timeLeft}
            duration={duration}
            isActive={isActive}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-4 text-[10px] text-obsidian-400 border-t border-obsidian-900/60 z-10 space-y-2 md:space-y-0">
        <div>
          &copy; {new Date().getFullYear()} AURA Lifestyle Inc. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <span className="hover:text-gold-400 transition-colors cursor-pointer">PRIVACY POLICY</span>
          <span>&bull;</span>
          <span className="hover:text-gold-400 transition-colors cursor-pointer">TERMS OF SERVICE</span>
          <span>&bull;</span>
          <span 
            onClick={() => setIsMuted(!isMuted)} 
            className="hover:text-gold-400 transition-colors cursor-pointer"
          >
            {isMuted ? "UNMUTE SOUND" : "MUTE SOUND"}
          </span>
        </div>
      </footer>
    </div>
  );
}
