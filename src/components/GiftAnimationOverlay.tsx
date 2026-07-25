import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Crown, Heart, Gift, Send } from "lucide-react";

export interface ActiveGiftInfo {
  giftName: string;
  senderName: string;
  senderAvatar?: string;
  receiverName: string;
  receiverAvatar?: string;
  count: number;
  price: number;
  timestamp: number;
}

interface GiftAnimationOverlayProps {
  activeGift: ActiveGiftInfo | null;
  onClear: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({ activeGift, onClear }) => {
  const [, setFrameIndex] = useState(0);
  const onClearRef = useRef(onClear);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  useEffect(() => {
    if (!activeGift) return;

    // Frame loop for particle/effect updates
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 12);
    }, 100);

    // Auto dismiss after 3.2 seconds so it disappears cleanly without sticking
    const timer = setTimeout(() => {
      if (onClearRef.current) {
        onClearRef.current();
      }
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [activeGift?.timestamp, activeGift?.giftName]);

  if (!activeGift) return null;

  const giftLowerName = activeGift.giftName.toLowerCase();

  // Helper to get real-time emoji/icon badge for the specific gift
  const getGiftEmoji = () => {
    if (giftLowerName.includes("dragon")) return "🐉";
    if (giftLowerName.includes("hammer")) return "🔨";
    if (giftLowerName.includes("glove")) return "🥊";
    if (giftLowerName.includes("shield")) return "🛡️";
    if (giftLowerName.includes("rocket")) return "🚀";
    if (giftLowerName.includes("world cup") || giftLowerName.includes("trophy")) return "🏆";
    if (giftLowerName.includes("rose")) return "🌹";
    if (giftLowerName.includes("cat") || giftLowerName.includes("guitar")) return "🐱🎸";
    if (giftLowerName.includes("kiss")) return "💋";
    if (giftLowerName.includes("castle") || giftLowerName.includes("fireworks")) return "🏰";
    if (giftLowerName.includes("couple") || giftLowerName.includes("love")) return "👩‍❤️‍👨";
    if (giftLowerName.includes("heart")) return "💖";
    if (giftLowerName.includes("moon")) return "🌙";
    if (giftLowerName.includes("clinking") || giftLowerName.includes("glass")) return "🥂";
    if (giftLowerName.includes("crown")) return "👑";
    if (giftLowerName.includes("card")) return "🃏";
    if (giftLowerName.includes("chest") || giftLowerName.includes("treasure")) return "💎";
    return "🎁";
  };

  // Gift Thumbnail for Top Banner
  const renderBannerGiftIcon = () => {
    const emoji = getGiftEmoji();
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-700 border border-amber-300 flex items-center justify-center shadow-lg">
        <span className="text-2xl drop-shadow">{emoji}</span>
      </div>
    );
  };

  // Render Full Screen Realistic 3D Broadcast Experience WITHOUT Darkening the Display
  const render3DFullScreenBroadcast = () => {
    const emoji = getGiftEmoji();

    // Specific custom high-impact 3D animations per gift item
    if (giftLowerName.includes("dragon")) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 200, x: (i - 8) * 30, opacity: 0 }}
              animate={{ y: -400, opacity: [0, 1, 0], scale: [0.5, 1.5, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute text-3xl text-orange-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.95)]"
            >
              🔥
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.1, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative flex flex-col items-center justify-center z-20"
          >
            <div className="absolute w-96 h-96 rounded-full bg-red-600/30 blur-3xl animate-pulse" />
            <span className="text-[130px] drop-shadow-[0_0_80px_rgba(239,68,68,0.95)] animate-bounce">🐉</span>
            <div className="mt-2 px-8 py-2 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 border-2 border-yellow-300 text-yellow-100 font-black text-lg uppercase tracking-wider shadow-2xl animate-pulse">
              🔥 PK FIRE DRAGON ATTACK 🔥
            </div>
          </motion.div>
        </div>
      );
    }

    if (giftLowerName.includes("hammer")) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scale: 0.1, y: -200, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="relative flex flex-col items-center justify-center z-20"
          >
            <div className="absolute w-80 h-80 rounded-full bg-amber-500/25 blur-3xl animate-pulse" />
            <span className="text-[120px] drop-shadow-[0_0_60px_rgba(245,158,11,0.95)] animate-pulse">🔨</span>
            <div className="mt-2 px-8 py-2 rounded-full bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-500 border-2 border-amber-300 text-black font-black text-lg uppercase tracking-wider shadow-2xl">
              💥 PK HAMMER STRIKE 💥
            </div>
          </motion.div>
        </div>
      );
    }

    if (giftLowerName.includes("crown")) {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -150, x: (i - 7) * 35, opacity: 0 }}
              animate={{ y: 250, opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.12 }}
              className="absolute text-3xl drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]"
            >
              ✨
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative flex flex-col items-center justify-center z-20"
          >
            <div className="absolute w-80 h-80 rounded-full bg-yellow-400/30 blur-3xl animate-pulse" />
            <span className="text-[130px] drop-shadow-[0_0_70px_rgba(234,179,8,0.95)] animate-bounce">👑</span>
            <div className="mt-2 px-8 py-2 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-500 border-2 border-yellow-200 text-black font-black text-lg uppercase tracking-wider shadow-2xl">
              👑 ROYAL CROWN PRESENTED 👑
            </div>
          </motion.div>
        </div>
      );
    }

    // Default High-Impact Floating 3D Gift Animation for ALL gifts (completely transparent background!)
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 200, x: (i - 7) * 30, opacity: 0 }}
            animate={{ y: -300, opacity: [0, 1, 0], scale: [0.5, 1.4, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.12 }}
            className="absolute text-3xl drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]"
          >
            {i % 2 === 0 ? "✨" : emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0.2, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.2, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="relative flex flex-col items-center justify-center z-20"
        >
          <div className="absolute w-80 h-80 rounded-full bg-amber-400/25 blur-3xl animate-pulse" />
          <span className="text-[130px] drop-shadow-[0_0_80px_rgba(245,158,11,0.95)] animate-bounce">
            {emoji}
          </span>
          <div className="mt-3 px-8 py-2 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 border-2 border-yellow-300 text-yellow-100 font-black text-base uppercase tracking-wider shadow-2xl">
            {activeGift.giftName.toUpperCase()} x{activeGift.count}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-[120] flex flex-col items-center justify-between overflow-hidden">
        
        {/* TOP VIP GIFT BANNER */}
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative mt-12 z-50 pointer-events-auto"
        >
          {/* Floating Recipient Avatar Centered Right Above the Top Border */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-pink-400 p-0.5 bg-gradient-to-tr from-pink-500 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.9)] overflow-hidden flex items-center justify-center">
              {activeGift.receiverAvatar ? (
                <img src={activeGift.receiverAvatar} alt="receiver" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-xs font-black text-white">{activeGift.receiverName.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* Main Purple/Neon Gradient VIP Banner Container */}
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-950/95 via-fuchsia-950/95 via-indigo-950/95 to-purple-900/95 backdrop-blur-md border-2 border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.8)] flex items-center gap-3 text-white max-w-[92vw]">
            
            {/* Sender Avatar Circle */}
            <div className="w-9 h-9 rounded-full border-2 border-purple-300 p-0.5 bg-gradient-to-tr from-amber-400 to-purple-600 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
              {activeGift.senderAvatar ? (
                <img src={activeGift.senderAvatar} alt="sender" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-xs font-extrabold text-white">{activeGift.senderName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Sender & Receiver Info */}
            <div className="flex flex-col text-left shrink-0">
              <span className="text-xs font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200 drop-shadow">
                ★ {activeGift.senderName} ★
              </span>
              <span className="text-[10px] text-pink-300/90 font-bold flex items-center gap-1">
                <span>Send</span>
                <Send className="w-2.5 h-2.5 text-pink-400" />
                <span className="text-amber-300 font-extrabold">★ {activeGift.receiverName}</span>
              </span>
            </div>

            {/* Gift Thumbnail Icon */}
            <div className="shrink-0 ml-1">
              {renderBannerGiftIcon()}
            </div>

            {/* Gift Multiplier Text */}
            <div className="text-sm font-black text-fuchsia-300 italic tracking-tight shrink-0">
              x{activeGift.count}
            </div>

            {/* Yellow "Go" Button */}
            <button className="px-3.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs shadow-md shrink-0 uppercase tracking-wide">
              Go
            </button>

          </div>
        </motion.div>

        {/* FULL SCREEN REALTIME 3D BROADCAST EXPERIENCE */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          {render3DFullScreenBroadcast()}
        </div>

      </div>
    </AnimatePresence>
  );
};
