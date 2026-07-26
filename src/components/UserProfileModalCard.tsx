import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Gift,
  AtSign,
  MessageCircle,
  User,
  Plus,
  UserCheck,
  Shield,
  MicOff,
  UserX,
  Copy
} from "lucide-react";

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
  onOpenFullProfile?: (user: UserProfileData) => void;
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
  onOpenFullProfile,
  isAdminOrHost,
  activeSeatConfig,
  onRemoveFromSeat,
  onToggleMuteSeat,
  isSeatMuted,
  onReportUser
}: UserProfileModalCardProps) {
  const [reported, setReported] = useState(false);

  if (!user) return null;

  const displayIdNo = user.idNo || (user.id.startsWith("user-") ? "21357440" : user.id.replace(/\D/g, "") || "21357440");
  const displayGender = user.gender || "Male";
  const isFemale = displayGender.toLowerCase().includes("female");
  const followersCount = user.followersCount !== undefined ? user.followersCount : (isFollowing ? 1 : 0);

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReported(true);
    if (onReportUser) {
      onReportUser(user);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-[180] p-0 animate-fadeIn">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md bg-white rounded-t-[32px] pt-0 pb-6 px-6 shadow-2xl z-10 select-none"
        >
          {/* Top bar with Report button */}
          <div className="flex items-center justify-between w-full pt-4 pb-2 relative z-20">
            <div className="w-8" /> {/* spacer */}
            <button
              onClick={handleReport}
              title="Report User"
              className={`p-1.5 rounded-full transition-all cursor-pointer active:scale-90 flex items-center justify-center ${
                reported ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>

          {/* OVERLAPPING AVATAR */}
          <div className="relative flex flex-col items-center text-center -mt-8">
            <div className="relative mb-2">
              {/* Outer Blue Ring Frame matching screenshot */}
              <div className="w-22 h-22 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-lg relative flex items-center justify-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* NAME & BADGES ROW */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1">
              {/* New Badge */}
              <span className="bg-[#22c55e] text-white text-[10px] font-black px-2 py-0.5 rounded-full tracking-wide shadow-2xs">
                New
              </span>

              {/* Name */}
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                <span>{user.name.includes("Villain") ? user.name : `🌺❤️${user.name}❤️🌺`}</span>
              </h3>

              {/* Gender Symbol */}
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                isFemale ? "bg-pink-500" : "bg-blue-500"
              }`}>
                {isFemale ? "♀" : "♂"}
              </span>
            </div>

            {/* LEVEL BADGE (Lv.2) */}
            <div className="my-1.5">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-amber-950 font-black text-[11px] px-3 py-0.5 rounded-full shadow-2xs inline-flex items-center gap-1">
                <Shield className="w-3 h-3 fill-amber-950/20" />
                <span>Lv.{user.vipLevel || 2}</span>
              </span>
            </div>

            {/* ID & COUNTRY FLAG & FOLLOWERS COUNT */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold my-1.5 px-2">
              {/* ID Badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(displayIdNo);
                  if (typeof window !== "undefined" && (window as any).triggerToast) {
                    (window as any).triggerToast(`ID Copied: ${displayIdNo} 📋`, "success");
                  }
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer active:scale-95 transition-all border border-slate-200/80 shadow-2xs"
                title="Click to copy ID"
              >
                <span className="text-slate-400 font-bold text-[10px]">ID</span>
                <span>{displayIdNo}</span>
                <Copy className="w-3 h-3 text-slate-500" />
              </button>

              {/* Country Flag Badge */}
              <div className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-200/80 shadow-2xs">
                <span className="text-xs">{user.countryFlag || "🇧🇩"}</span>
                <span className="text-[11px] text-slate-700">{user.country || "Bangladesh"}</span>
              </div>

              {/* Followers count */}
              <span className="text-slate-500 font-bold text-[11px]">
                {followersCount} Followers
              </span>
            </div>

            {/* BIO SLOGAN PREVIEW */}
            <div className="text-xs italic text-slate-600 font-medium max-w-xs truncate my-1 px-4 py-1 bg-slate-50 rounded-xl border border-slate-100">
              💬 "{user.bio || user.description || "Live life to the fullest 🚀"}"
            </div>

            {/* 3 ACTION BUTTONS ROW (Profile, Chat, Mention - Mute Voice REMOVED) */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs my-5 pt-3 border-t border-slate-100">
              
              {/* 1. PROFILE */}
              <button
                onClick={() => {
                  if (onOpenFullProfile) {
                    onOpenFullProfile(user);
                  }
                  onClose();
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center transition-colors">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Profile
                </span>
              </button>

              {/* 2. CHAT */}
              <button
                onClick={() => onOpenDirectChat(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/10" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Chat
                </span>
              </button>

              {/* 3. MENTION */}
              <button
                onClick={() => onMention(user)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <AtSign className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Mention
                </span>
              </button>

            </div>

            {/* 2 MAIN BOTTOM PILL BUTTONS (+ Follow / Send Gifts) */}
            <div className="grid grid-cols-2 gap-3 w-full pt-1">
              
              {/* LEFT PILL: + Follow */}
              <button
                onClick={() => onFollowToggle(user)}
                className={`py-3 px-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer active:scale-95 ${
                  isFollowing
                    ? "bg-slate-100 border-slate-200 text-slate-600"
                    : "bg-white border-[#00d2a8] text-[#00d2a8] hover:bg-emerald-50"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              {/* RIGHT PILL: Send Gifts */}
              <button
                onClick={() => onGiveGift(user)}
                className="py-3 px-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 bg-[#00d2a8] hover:bg-[#00b894] text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Gift className="w-4 h-4 fill-white/20" />
                <span>Send Gifts</span>
              </button>

            </div>

            {/* ADMIN / HOST SEAT CONTROLS IF APPLICABLE */}
            {isAdminOrHost && activeSeatConfig && (
              <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                {onToggleMuteSeat && (
                  <button
                    onClick={() => onToggleMuteSeat(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                    className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{isSeatMuted ? "Unmute Mic" : "Mute Mic"}</span>
                  </button>
                )}
                {onRemoveFromSeat && (
                  <button
                    onClick={() => onRemoveFromSeat(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                    className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Kick Seat</span>
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
