import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowLeft,
  Camera,
  Edit3,
  Copy,
  Check,
  Heart,
  Gift,
  MessageSquare,
  UserCheck,
  Crown,
  Award,
  Trophy,
  Shield,
  Star,
  Users,
  Plus,
  CheckCircle2,
  Share2,
  Flame,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { TigerCrown } from "../App";

export interface UserProfileFullData {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  phone?: string;
  email?: string;
  country?: string;
  countryFlag?: string;
  birthday?: string;
  gender?: string;
  hasTigerCrown?: boolean;
  vipLevel?: number;
  bio?: string;
  idNo?: string;
  followersCount?: number;
  followingCount?: number;
  visitorsCount?: number;
  giftsCount?: number;
  giftsReceivedCoins?: number;
  giftsSentCoins?: number;
  familyData?: {
    name: string;
    logo?: string;
    role: string;
    idNo: string;
    members: string;
    rank: string;
  };
}

export interface FullUserProfileModalProps {
  user: UserProfileFullData | null;
  loggedInUserId?: string;
  onClose: () => void;
  onFollowToggle: (user: UserProfileFullData) => void;
  isFollowing: boolean;
  onGiveGift: (user: UserProfileFullData) => void;
  onOpenDirectChat: (user: UserProfileFullData) => void;
  onSaveProfileUpdate?: (updatedData: Partial<UserProfileFullData>) => Promise<void> | void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const COVER_PRESETS = [
  { name: "Lion King", url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80" },
  { name: "Golden Royalty", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80" },
  { name: "Sunset Aurora", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80" },
  { name: "Neon Cyber", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80" },
];

export const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
];

export function FullUserProfileModal({
  user,
  loggedInUserId,
  onClose,
  onFollowToggle,
  isFollowing,
  onGiveGift,
  onOpenDirectChat,
  onSaveProfileUpdate,
  triggerToast
}: FullUserProfileModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit states for own profile
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [editCover, setEditCover] = useState(user?.coverPhoto || COVER_PRESETS[0].url);
  const [editAvatar, setEditAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const isOwnProfile = user.id === loggedInUserId || user.id === "user-current";
  const displayIdNo = user.idNo || (user.id.startsWith("user-") ? "10005" : user.id.replace(/\D/g, "") || "10005");
  const currentCover = user.coverPhoto || "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80";

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayIdNo);
    setCopiedId(true);
    triggerToast("ID copied to clipboard!", "success");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditBio(user.bio || "india, saudi recharge available 24×7");
    setEditCover(user.coverPhoto || COVER_PRESETS[0].url);
    setEditAvatar(user.avatar);
    setShowEditModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "avatar") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        if (target === "cover") setEditCover(reader.result as string);
        else setEditAvatar(reader.result as string);
        triggerToast(`${target === "cover" ? "Cover photo" : "Profile picture"} uploaded!`, "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      triggerToast("Nickname cannot be empty", "error");
      return;
    }
    setIsSaving(true);
    try {
      if (onSaveProfileUpdate) {
        await onSaveProfileUpdate({
          name: editName.trim(),
          bio: editBio.trim(),
          coverPhoto: editCover,
          avatar: editAvatar,
        });
      }
      triggerToast("Profile updated successfully! ✨", "success");
      setShowEditModal(false);
    } catch (err) {
      console.error("Save profile error", err);
      triggerToast("Failed to save profile changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Real-time Received Gifts List (if user has real gifts)
  const giftsReceived = (user.giftsReceivedCoins && user.giftsReceivedCoins > 0) ? [
    { id: "g-1", name: "Royal Crown 👑", count: 1, sender: "VIP_Giver", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", icon: "👑", coins: user.giftsReceivedCoins },
  ] : [];

  const followersCount = user.followersCount !== undefined ? user.followersCount : (isFollowing ? 1 : 0);
  const followingCount = user.followingCount !== undefined ? user.followingCount : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[200] p-0 overflow-y-auto">
        {/* Backdrop */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md bg-slate-100 overflow-hidden shadow-2xl text-slate-900 z-10 min-h-screen sm:min-h-0 flex flex-col select-none"
        >
          {/* HEADER TOP BAR OVERLAY */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer active:scale-90 transition-all backdrop-blur-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {isOwnProfile ? (
              <button
                onClick={handleOpenEdit}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-full cursor-pointer active:scale-90 transition-all shadow-md flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={() => triggerToast("Shared profile link!", "info")}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer active:scale-90 transition-all backdrop-blur-xs"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* MAIN SCROLL CONTAINER */}
          <div className="flex-1 overflow-y-auto scrollbar-none pb-28">
            
            {/* TOP COVER BANNER (Clean Image Banner) */}
            <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden shrink-0">
              <img
                src={currentCover}
                alt="Cover"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </div>

            {/* MAIN WHITE CARD CONTAINER (Rounded Top, Overlapping Cover) */}
            <div className="relative z-10 bg-white rounded-t-[32px] -mt-8 px-5 pt-0 pb-6 text-slate-900 shadow-2xl flex flex-col min-h-[420px]">
              
              {/* AVATAR & EDIT BUTTON ROW */}
              <div className="flex items-end justify-between -mt-10 mb-3">
                {/* Round Profile Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 shadow-xl relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full border-4 border-white bg-slate-100"
                    />
                  </div>
                  <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white text-white text-[10px] font-black flex items-center justify-center shadow-md ${
                    user.gender === "Female" ? "bg-pink-500" : "bg-blue-500"
                  }`}>
                    {user.gender === "Female" ? "♀" : "♂"}
                  </span>
                </div>

                {/* Right Top Action Button */}
                {isOwnProfile ? (
                  <button
                    onClick={handleOpenEdit}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => triggerToast("Room ID: " + displayIdNo, "info")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-slate-200"
                  >
                    <span>Room ID:{displayIdNo}</span>
                  </button>
                )}
              </div>

              {/* USER NAME & ID ROW */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>{user.name}</span>
                  </h2>
                  {isOwnProfile && (
                    <button 
                      onClick={handleOpenEdit}
                      className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Bio & Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* ID Tag & Country Flag */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    onClick={handleCopyId}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border border-slate-200/80"
                    title="Click to copy ID"
                  >
                    <span className="text-slate-400 font-bold">ID</span>
                    <span>{displayIdNo}</span>
                    <Copy className="w-3 h-3 text-slate-500" />
                  </span>

                  <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200/80">
                    <span className="text-sm">{user.countryFlag || "🇧🇩"}</span>
                    <span className="text-slate-700 font-bold">{user.country || "Bangladesh"}</span>
                  </span>
                </div>

                {/* Role & Level Badges Row */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {user.vipLevel && user.vipLevel > 0 ? (
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs">
                      VIP {user.vipLevel}
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs">
                      VIP 3
                    </span>
                  )}

                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md shadow-2xs">
                    {user.vipLevel ? `Lv.${user.vipLevel * 5}` : "Lv.15"}
                  </span>
                </div>

                {/* STARTER MEDALS SHOWCASE ROW */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  {[
                    { num: "0", label: "Crown", icon: "👑" },
                    { num: "0", label: "VIP", icon: "💎" },
                    { num: "0", label: "Lion", icon: "🦁" },
                    { num: "0", label: "Charm", icon: "❤️" },
                    { num: "0", label: "Rich", icon: "🛡️" },
                    { num: "0", label: "Star", icon: "⭐" },
                  ].map((m, idx) => (
                    <div
                      key={`badge-icon-${idx}`}
                      className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 p-0.5 shadow-2xs flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-95 relative overflow-hidden"
                      title={m.label}
                    >
                      <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] leading-none">{m.icon}</span>
                        <span className="text-[9px] font-black text-slate-500 leading-none mt-0.5">{m.num}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* STATS ROW (Followers | Following) */}
                <div className="grid grid-cols-2 text-center py-2.5 my-2 border-y border-slate-100 text-slate-900 bg-slate-50/80 rounded-2xl">
                  <div>
                    <span className="block text-base font-black leading-tight text-slate-900">{followersCount}</span>
                    <span className="text-[11px] font-extrabold text-slate-500">Followers</span>
                  </div>
                  <div className="border-l border-slate-200">
                    <span className="block text-base font-black leading-tight text-slate-900">{followingCount}</span>
                    <span className="text-[11px] font-extrabold text-slate-500">Following</span>
                  </div>
                </div>

              </div>

              {/* PROFILE TAB WITH GREEN UNDERLINE */}
              <div className="mt-4 mb-3">
                <h3 className="text-base font-black text-slate-900 inline-block relative">
                  Profile
                  <span className="block h-1 w-6 bg-[#00d2a8] rounded-full mt-1" />
                </h3>
              </div>

              {/* ABOUT ME SECTION */}
              <div className="space-y-1.5 mb-5">
                <h4 className="text-sm font-black text-slate-900">
                  About Me
                </h4>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {user.bio || "Always together in heart & soul 💖"}
                </p>
              </div>

              {/* FAMILY SECTION */}
              <div className="space-y-2 mb-5">
                <h4 className="text-sm font-black text-slate-900">
                  Family
                </h4>
                {user.familyData ? (
                  <div className="bg-gradient-to-r from-[#fef9c3] via-[#fef08a] to-[#fde047] rounded-2xl p-3.5 border border-amber-300/60 shadow-xs flex items-center justify-between relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300 p-1 flex items-center justify-center font-black text-amber-900 text-xs text-center shadow-xs">
                        {user.familyData.name}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{user.familyData.name}</span>
                          <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full">
                            {user.familyData.role}
                          </span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-600 mt-0.5">
                          Family ID: {user.familyData.idNo} <span className="mx-1">|</span> 👥 {user.familyData.members}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100/60 border border-amber-200/50 flex items-center justify-center font-black text-amber-800 text-sm text-center">
                        🏠
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">No Family Joined</div>
                        <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                          Family ID: 0 <span className="mx-1">|</span> 👥 0 Members
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-full">
                      0 Family
                    </span>
                  </div>
                )}
              </div>

              {/* STAR A GIFT SECTION */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <h4 className="text-sm font-black text-slate-900">
                      Star A Gift
                    </h4>
                    <span className="text-xs font-bold text-slate-400">({giftsReceived.length} Gifts)</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#00d2a8] cursor-pointer hover:underline" onClick={() => onGiveGift(user)}>
                    Send Gift &gt;
                  </span>
                </div>

                {giftsReceived.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {giftsReceived.map((g, idx) => (
                      <div
                        key={`recv-gift-${g.id || idx}-${idx}`}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 flex flex-col items-center justify-between text-center"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100/60 flex items-center justify-center text-xl">
                          {g.icon}
                        </div>
                        <div className="mt-1">
                          <div className="text-[11px] font-black text-slate-800 leading-tight truncate">{g.name}</div>
                          <div className="text-[10px] font-extrabold text-slate-400 mt-0.5">x{g.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-2">
                    <p className="text-xs font-semibold text-slate-500">No gifts received yet</p>
                    <button
                      type="button"
                      onClick={() => onGiveGift(user)}
                      className="px-4 py-1.5 bg-[#00d2a8] hover:bg-[#00b894] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-all"
                    >
                      Send First Gift 🎁
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* BOTTOM FIXED BUTTONS (+ Follow / Chat) matching Screenshot */}
          <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t border-slate-100 p-3 px-6 z-40 grid grid-cols-2 gap-4 shadow-lg">
            
            {/* LEFT BUTTON: + Follow */}
            <button
              onClick={() => onFollowToggle(user)}
              className="py-3 px-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-1.5 bg-[#00d2a8] hover:bg-[#00b894] text-white shadow-md transition-all cursor-pointer active:scale-95"
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

            {/* RIGHT BUTTON: Chat */}
            <button
              onClick={() => onOpenDirectChat(user)}
              className="py-3 px-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 bg-[#00d2a8] hover:bg-[#00b894] text-white shadow-md transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chat</span>
            </button>

          </div>

        </motion.div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[220] p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-[#121526] border border-amber-400/40 rounded-3xl p-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-black text-amber-200 mb-1.5 uppercase tracking-wider">
                  🖼️ Cover Photo
                </label>
                <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-amber-400/40 mb-2">
                  <img src={editCover} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
                <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold text-amber-300 cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Upload Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "cover")}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-black text-amber-200 mb-1 uppercase tracking-wider">
                  🏷️ Nickname
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  placeholder="Enter nickname..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-amber-200 mb-1 uppercase tracking-wider">
                  📝 About Me / Bio
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="Set about me description..."
                />
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm rounded-xl shadow-lg cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                {isSaving ? <span>Saving...</span> : <span>Save Changes</span>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
