import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Swords, Flame, Trophy, Zap, Shield, Clock, X, Play, RotateCcw } from "lucide-react";
import { Participant } from "../types";

interface PKBattleBarProps {
  isActive: boolean;
  redUser: Participant | null;
  blueUser: Participant | null;
  redScore: number;
  blueScore: number;
  onTogglePK: () => void;
  onSetDuration?: (seconds: number) => void;
}

export const PKBattleBar: React.FC<PKBattleBarProps> = ({
  isActive,
  redUser,
  blueUser,
  redScore,
  blueScore,
  onTogglePK,
  onSetDuration,
}) => {
  const [pkDuration, setPkDuration] = useState<number>(300); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [winner, setWinner] = useState<"red" | "blue" | "draw" | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>("");

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(pkDuration);
      setWinner(null);
      return;
    }

    setTimeLeft(pkDuration);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Determine winner
          if (redScore > blueScore) setWinner("red");
          else if (blueScore > redScore) setWinner("blue");
          else setWinner("draw");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, pkDuration]);

  // Format MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate percentage split
  const total = redScore + blueScore;
  const redPercentage = total === 0 ? 50 : Math.min(90, Math.max(10, Math.round((redScore / total) * 100)));

  const handleSelectPreset = (sec: number) => {
    setPkDuration(sec);
    setTimeLeft(sec);
    if (onSetDuration) onSetDuration(sec);
  };

  const handleSetCustomMinutes = () => {
    const mins = parseInt(customMinutesInput);
    if (!isNaN(mins) && mins > 0) {
      const sec = mins * 60;
      setPkDuration(sec);
      setTimeLeft(sec);
      if (onSetDuration) onSetDuration(sec);
      setCustomMinutesInput("");
    }
  };

  return (
    <>
      {/* 1. TOP COMPACT PK SCORES & PROGRESS BAR (When Active) */}
      {isActive ? (
        <div className="w-full my-1.5 px-2 relative z-20">
          <div className="relative w-full rounded-2xl bg-gradient-to-r from-red-950/90 via-purple-950/95 to-blue-950/90 backdrop-blur-md border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] p-2 flex flex-col gap-1.5 overflow-hidden">
            
            {/* Top Timer & Badge */}
            <div className="flex items-center justify-between px-2">
              
              {/* Red Side Info */}
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 rounded-full border-2 border-red-500 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  <img
                    src={redUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60&h=60"}
                    alt="Red PK"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-red-300 truncate max-w-[80px]">
                    {redUser?.name || "Red Host"}
                  </span>
                  <span className="text-xs font-black text-yellow-300 drop-shadow">
                    🪙 {redScore.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Center PK VS Icon & Timer */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-2.5 py-0.5 rounded-full bg-black/70 border border-yellow-400/80 text-yellow-300 text-[11px] font-black tracking-wider flex items-center gap-1 shadow-inner hover:scale-105 active:scale-95 transition-all"
                >
                  <Swords className="w-3 h-3 text-red-400 animate-pulse" />
                  <span>{winner ? "PK FINISHED" : formatTime(timeLeft)}</span>
                  <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
                </button>
              </div>

              {/* Blue Side Info */}
              <div className="flex items-center gap-1.5 min-w-0 justify-end text-right">
                <div className="flex flex-col min-w-0 items-end">
                  <span className="text-[10px] font-black text-blue-300 truncate max-w-[80px]">
                    {blueUser?.name || "Blue Challenger"}
                  </span>
                  <span className="text-xs font-black text-yellow-300 drop-shadow">
                    🪙 {blueScore.toLocaleString()}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-blue-500 overflow-hidden shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                  <img
                    src={blueUser?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60&h=60"}
                    alt="Blue PK"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

            {/* Realtime Split Score Progress Bar */}
            <div className="relative w-full h-3 rounded-full bg-slate-900 border border-amber-400/40 overflow-hidden flex items-center">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: `${redPercentage}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
              <div className="h-full flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
              </div>

              {/* PK Divider Glow Line */}
              <div className="absolute inset-y-0 w-1 bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,1)] z-10" style={{ left: `${redPercentage}%` }} />
            </div>

            {/* Winner Announcement or PK Status */}
            {winner && (
              <div className="w-full flex items-center justify-between px-2 pt-1 border-t border-amber-400/30">
                <div className="flex items-center gap-1.5 text-yellow-300 font-black text-xs">
                  <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
                  <span>
                    {winner === "red" ? `VICTORY: ${redUser?.name || "Red Team"} 🎉` : winner === "blue" ? `VICTORY: ${blueUser?.name || "Blue Team"} 🎉` : "MATCH DRAW! 🤝"}
                  </span>
                </div>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-3 py-0.5 rounded-full bg-slate-800 border border-amber-400 text-amber-300 text-[10px] font-bold uppercase tracking-wider"
                >
                  RESTART PK
                </button>
              </div>
            )}

          </div>
        </div>
      ) : null}

      {/* 2. FLOATING RIGHT-SIDE COMPACT RECTANGULAR PK BADGE */}
      <div className="fixed right-3 bottom-28 z-[80]">
        <button
          onClick={() => setShowConfigModal(true)}
          className={`px-3 py-2 rounded-2xl bg-gradient-to-br from-red-600 via-purple-700 to-indigo-800 border-2 border-yellow-400 text-white font-black text-xs shadow-[0_0_20px_rgba(239,68,68,0.8)] flex flex-col items-center justify-center gap-0.5 hover:scale-105 active:scale-95 transition-all ${
            isActive ? "animate-pulse" : ""
          }`}
        >
          <div className="flex items-center gap-1 text-yellow-300">
            <Swords className="w-4 h-4 animate-bounce" />
            <span className="text-sm tracking-wider">PK</span>
          </div>
          <span className="text-[9px] font-extrabold text-amber-200 uppercase">
            {isActive ? formatTime(timeLeft) : "SETTINGS"}
          </span>
        </button>
      </div>

      {/* 3. PK CONFIGURATION & CONTROL MODAL */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-950 border-2 border-amber-400 p-5 shadow-[0_0_40px_rgba(245,158,11,0.6)] text-white flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-lg uppercase tracking-wide">
                  <Swords className="w-6 h-6 text-red-400" />
                  <span>PK Battle Control</span>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Info */}
              <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
                <span className="text-slate-400">Current Status:</span>
                <span className={isActive ? "text-green-400" : "text-amber-400"}>
                  {isActive ? `🔥 Active (${formatTime(timeLeft)})` : "⏸️ Inactive"}
                </span>
              </div>

              {/* Time Presets Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select PK Duration:</span>
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "1 Minute", sec: 60 },
                    { label: "2 Minutes", sec: 120 },
                    { label: "3 Minutes", sec: 180 },
                    { label: "5 Minutes", sec: 300 },
                    { label: "10 Minutes", sec: 600 },
                    { label: "1 Hour", sec: 3600 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleSelectPreset(preset.sec)}
                      className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all ${
                        pkDuration === preset.sec
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-yellow-300 shadow-md scale-105"
                          : "bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Minutes Input */}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Custom mins (e.g. 15)"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-bold"
                  />
                  <button
                    onClick={handleSetCustomMinutes}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shrink-0"
                  >
                    Set Time
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                {!isActive ? (
                  <button
                    onClick={() => {
                      onTogglePK();
                      setShowConfigModal(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                  >
                    <Play className="w-5 h-5 text-yellow-300" />
                    <span>START PK BATTLE ({formatTime(pkDuration)})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onTogglePK();
                      setShowConfigModal(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-900 to-rose-950 border border-red-500 text-red-200 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-red-800"
                  >
                    <X className="w-5 h-5" />
                    <span>STOP / END PK BATTLE</span>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
