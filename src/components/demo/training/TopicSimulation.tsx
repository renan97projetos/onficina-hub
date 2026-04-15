import { useState, useEffect } from "react";

/**
 * Compact, focused simulation for a single training topic.
 * Shows only the relevant UI area for the action being demonstrated.
 */

interface AnimFrame {
  elements: React.ReactNode;
  label: string;
  cursor?: { x: number; y: number };
}

interface Props {
  frames: AnimFrame[];
}

const TopicSimulation = ({ frames }: Props) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(0);
  }, [frames]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [frames.length]);

  const frame = frames[frameIndex % frames.length];

  return (
    <div className="relative w-full max-w-md rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden select-none" style={{ minHeight: 160 }}>
      {/* Mini browser chrome */}
      <div className="flex items-center gap-1 bg-[#1a1a1a] px-2 py-1 border-b border-white/10">
        <div className="flex gap-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex-1 rounded bg-white/5 px-1.5 py-0.5 text-[6px] text-muted-foreground">
          onficina.com.br
        </div>
        <div className="flex items-center gap-0.5">
          <div className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[5px] text-muted-foreground">REC</span>
        </div>
      </div>

      {/* Content area */}
      <div className="p-3">
        {frame.elements}
      </div>

      {/* Cursor */}
      {frame.cursor && (
        <div
          className="absolute w-2.5 h-2.5 pointer-events-none transition-all duration-700 ease-in-out z-20"
          style={{ left: `${frame.cursor.x}%`, top: `${frame.cursor.y}%` }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L5 11L6.5 6.5L11 5L1 1Z" fill="white" stroke="black" strokeWidth="0.5" />
          </svg>
        </div>
      )}

      {/* Label */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 border border-white/10 px-2.5 py-0.5">
        <span className="text-[7px] text-muted-foreground">{frame.label}</span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-1.5 right-2 flex gap-0.5">
        {frames.map((_, i) => (
          <div key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === frameIndex % frames.length ? "w-2 bg-primary" : "w-0.5 bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
};

export default TopicSimulation;
