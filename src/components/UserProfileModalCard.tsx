import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  AlertTriangle,
  Heart,
  Gift,
  AtSign,
  MessageSquare,
  Copy,
  Check,
  Crown,
  Award,
  Trophy,
  Shield,
  Star,
  Flame,
  Sparkles,
  UserCheck,
  MicOff,
  UserX,
  ShieldAlert
} from "lucide-react";
import { TigerCrown } from "../App";

export interface UserProfileData {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
  phone?: string;
  email?: string;
  authProvider?: string;
  country?: string;
  countryFlag?: string;
  birthday?: string;
  gender?: string;
  hasTigerCrown?: boolean;
  vipLevel?: number;
  bio?: string;
  idNo?: string;
  followersCount?: number;
  giftsCount?: number;
  intimacy?: string;
}

export interface UserProfileModalCardProps {
  user: UserProfileData | null;
  onClose: () => void;
  onFollowToggle: (user: UserProfileData) => void;
  isFollowing: boolean;
  onGiveGift: (user: UserProfileData) => void;
  onMention: (user: UserProfileData) => void;
  onOpenDirectChat: (user: UserProfileData) => void;
  isAdminOrHost?: boolean;
  activeSeatConfig?: { seatType: "host" | "super" | "grid"; gridIndex?: number } | null;
  onRemoveFromSeat?: (seatType: "host" | "super" | "grid", gridIndex?: number) => void;
  onToggleMuteSeat?: (seatType: "host" | "super" | "grid", gridIndex?: number) => void;
  isSeatMuted?: boolean;
  onReportUser?: (user: UserProfileData) => void;
}

export function UserProfileModalCard({
  user,
  onClose,
  onFollowToggle,
  isFollowing,
  onGiveGift,
  onMention,
  onOpenDirectChat,
  isAdminOrHost,
  activeSeatConfig,
  onRemoveFromSeat,
  onToggleMuteSeat,
  isSeatMuted,
  onReportUser
}: UserProfileModalCardProps) {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  if (!user) return null;

  const displayIdNo = user.idNo || (user.id.startsWith("user-") ? "7629964" : user.id.replace(/\D/g, "") || "6806275");
  const displayGender = user.gender || "Female";
  const isFemale = displayGender.toLowerCase().includes("female") || displayGender === "Female";

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayIdNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReported(true);
    if (onReportUser) {
      onReportUser(user);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center z-[180] p-0 sm:p-4 animate-fadeIn">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#162e29] via-[#0e1e1b] to-[#081210] rounded-t-[36px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-t sm:border border-emerald-500/30 text-white z-10 max-h-[90vh] overflow-y-auto scrollbar-none"
        >
          {/* TOP COVER WITH AURORA GLOW & REPORT / INTIMACY BADGES */}
          <div className="relative pt-4 px-5 pb-2 bg-gradient-to-r from-emerald-900/40 via-teal-900/50 to-indigo-900/40">
            <div className="flex items-center justify-between w-full">
              {/* TOP LEFT: Report Warning Icon Button */}
              <button
                onClick={handleReport}
                title="Report User"
                className={`p-2 rounded-full border transition-all cursor-pointer active:scale-90 flex items-center justify-center ${
                  reported
                    ? "bg-red-500/30 border-red-500 text-red-400"
                    : "bg-black/40 hover:bg-black/60 border-white/10 text-slate-300 hover:text-amber-400"
                }`}
              >
                <AlertTriangle className="w-5 h-5 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
              </button>

              {/* TOP RIGHT: Intimacy Badge */}
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500/25 to-purple-600/30 border border-pink-500/40 rounded-full px-3 py-1 shadow-md">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-pink-400 p-0.5 bg-pink-500/20 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Intimacy Partner"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-black text-pink-300 tracking-tight">
                  Intimacy <span className="text-pink-100 font-extrabold ml-0.5">34.57M</span>
                </span>
              </div>
            </div>

            {/* Close Button Top Right Floating */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white rounded-full p-1.5 transition-all cursor-pointer active:scale-90 z-20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MAIN AVATAR WITH ROYAL CROWN FRAME & CREST */}
          <div className="relative flex flex-col items-center text-center px-6 pt-1 pb-6">
            
            {/* AVATAR CONTAINER WITH TIGER CROWN & GLOW */}
            <div className="relative my-2 flex items-center justify-center">
              {/* Glowing Outer Ring */}
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.5)] relative z-10 shrink-0 flex items-center justify-center">
                {/* Tiger Royal Crown Banner wrapping avatar */}
                {user.hasTigerCrown !== false && (
                  <TigerCrown size="profile-banner" />
                )}
                
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full border-2 border-[#0e1e1b]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Royal Star Host Badge at bottom of avatar */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black text-[9px] font-black px-3 py-0.5 rounded-full border border-white shadow-md flex items-center gap-0.5 whitespace-nowrap z-20">
                  <Crown className="w-2.5 h-2.5 fill-black" />
                  <span>Star Host</span>
                </div>
              </div>
            </div>

            {/* USER DISPLAY NAME */}
            <h2 className="text-2xl font-black tracking-tight text-white mt-3 mb-1 flex items-center gap-1.5 justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="text-red-500">❤️</span>
              <span className="bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                {user.name}
              </span>
            </h2>

            {/* ID & BADGES ROW (Matching Screenshot) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 max-w-full">
              {/* ID Bar + Copy Button */}
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-200">
                <span className="font-bold text-amber-300">ID:{displayIdNo}</span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Gender Symbol Badge */}
              <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold text-white shadow-sm ${
                isFemale ? "bg-pink-500" : "bg-blue-500"
              }`}>
                {isFemale ? "♀" : "♂"}
              </div>

              {/* RG / Level Tag */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                <span>RG 48</span>
              </div>

              {/* Level 8 Tag */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                8
              </div>

              {/* VIP Badge */}
              <div className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500 text-black font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-tight">
                VIP 2
              </div>

              {/* Knight Badge */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 fill-black" />
                <span>Knight</span>
              </div>

              {/* Star Badge (52) */}
              <div className="bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-300" />
                <span>52</span>
              </div>

              {/* Crown Badge (59) */}
              <div className="bg-purple-500/30 border border-purple-400/40 text-purple-300 font-bold text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 fill-purple-300" />
                <span>59</span>
              </div>

              {/* Medal Badge (51) */}
              <div className="bg-pink-500/30 border border-pink-400/40 text-pink-300 font-bold text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Award className="w-2.5 h-2.5 fill-pink-300" />
                <span>51</span>
              </div>
            </div>

            {/* ROLE PILLS ROW (Agency, Host, Coinseller, Loyal Club, OneR Loyal) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 my-2.5 w-full">
              <span className="bg-gradient-to-r from-teal-500/30 to-emerald-600/30 border border-teal-400/50 text-teal-200 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-300" />
                Agency
              </span>
              <span className="bg-gradient-to-r from-pink-500/30 to-rose-600/30 border border-pink-400/50 text-pink-200 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Crown className="w-3 h-3 text-pink-300" />
                Host
              </span>
              <span className="bg-gradient-to-r from-amber-500/30 to-yellow-600/30 border border-amber-400/50 text-amber-200 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-300" />
                Coinseller
              </span>
              <span className="bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-400/50 text-rose-200 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Trophy className="w-3 h-3 text-rose-300" />
                Loyal Club
              </span>
              <span className="bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 text-cyan-200 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-300" />
                OneR Loyal
              </span>
            </div>

            {/* SHINY MEDALS CAROUSEL ROW (Matching Screenshot 2) */}
            <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-2.5 my-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-3 min-w-max justify-center px-2">
                {[
                  { icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/40" },
                  { icon: Crown, color: "text-amber-300", bg: "bg-amber-500/20 border-amber-500/40" },
                  { icon: Award, color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/40" },
                  { icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/20 border-cyan-500/40" },
                  { icon: Star, color: "text-pink-400", bg: "bg-pink-500/20 border-pink-500/40" },
                  { icon: Flame, color: "text-rose-400", bg: "bg-rose-500/20 border-rose-500/40" },
                  { icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/40" },
                  { icon: Trophy, color: "text-indigo-400", bg: "bg-indigo-500/20 border-indigo-500/40" },
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`w-9 h-9 rounded-full border ${item.bg} flex items-center justify-center shrink-0 shadow-inner transform hover:scale-110 transition-transform`}
                    >
                      <IconComp className={`w-5 h-5 ${item.color} filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BIO TEXT */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-[320px] bg-white/[0.03] border border-white/[0.04] p-2.5 rounded-2xl my-2 italic">
              "{user.bio || "OneR encourages positive broadcast. Let's chat & spread love ❤️"}"
            </p>

            {/* REAL-TIME DASHBOARD STATS (Followers, Gifts, Intimacy) */}
            <div className="grid grid-cols-3 gap-2 w-full my-2 bg-black/40 border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="flex flex-col items-center border-r border-white/10 pr-1">
                <span className="text-sm font-black text-pink-400">
                  {user.followersCount !== undefined ? user.followersCount : (isFollowing ? 1285 : 1284)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Followers</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/10 pr-1">
                <span className="text-sm font-black text-amber-400">
                  {user.giftsCount !== undefined ? user.giftsCount : 342} 🎁
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gifts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-emerald-400">
                  {user.intimacy || "34.57M"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Intimacy</span>
              </div>
            </div>

            {/* 4 MAIN BOTTOM ACTION BUTTONS (Matching Screenshots 1 & 2) */}
            <div className="grid grid-cols-4 gap-3 w-full mt-4 pt-3 border-t border-white/10">
              
              {/* 1. FOLLOW */}
              <button
                onClick={() => onFollowToggle(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all border ${
                  isFollowing
                    ? "bg-gradient-to-tr from-pink-600 to-rose-500 text-white border-pink-400 shadow-pink-500/30"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/15"
                }`}>
                  {isFollowing ? (
                    <UserCheck className="w-6 h-6 text-white" />
                  ) : (
                    <Heart className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="text-[12px] font-bold text-slate-200 tracking-tight">
                  {isFollowing ? "Following" : "Follow"}
                </span>
              </button>

              {/* 2. GIVE GIFT */}
              <button
                onClick={() => onGiveGift(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 text-white border border-amber-300/50 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
                  <Gift className="w-6 h-6 text-amber-200 fill-amber-200/20 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                </div>
                <span className="text-[12px] font-bold text-amber-300 tracking-tight">
                  Give gift
                </span>
              </button>

              {/* 3. MENTION */}
              <button
                onClick={() => onMention(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-600 to-blue-600 text-white border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
                  <AtSign className="w-6 h-6 text-cyan-200" />
                </div>
                <span className="text-[12px] font-bold text-cyan-300 tracking-tight">
                  Mention
                </span>
              </button>

              {/* 4. CHAT */}
              <button
                onClick={() => onOpenDirectChat(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white border border-violet-400/40 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-all">
                  <MessageSquare className="w-6 h-6 text-violet-200" />
                </div>
                <span className="text-[12px] font-bold text-violet-300 tracking-tight">
                  Chat
                </span>
              </button>

            </div>

            {/* ADMIN / HOST SEAT MANAGEMENT OPTIONS */}
            {isAdminOrHost && activeSeatConfig && (
              <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-3">
                {onToggleMuteSeat && (
                  <button
                    onClick={() => onToggleMuteSeat(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                    className="flex-1 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{isSeatMuted ? "Unmute Seat" : "Mute Seat"}</span>
                  </button>
                )}
                {onRemoveFromSeat && (
                  <button
                    onClick={() => onRemoveFromSeat(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                    className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Remove from Seat</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
