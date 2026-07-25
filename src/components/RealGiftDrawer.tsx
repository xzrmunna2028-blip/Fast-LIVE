import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Check, Sparkles, Trophy, Flame, Crown, Heart, Gift, Mic, Clock } from "lucide-react";
import { Participant } from "../types";

export interface GiftCatalogItem {
  id: string;
  name: string;
  category: "Gifts" | "PK" | "Lucky" | "Event" | "Custom" | "Premium" | "Couple";
  price: number;
  tag?: string;
  tagBg?: string;
  iconType: string;
}

export const REAL_GIFTS_LIST: GiftCatalogItem[] = [
  {
    id: "g_pk1",
    name: "PK Fire Dragon",
    category: "PK",
    price: 150000,
    tag: "PK HOT",
    tagBg: "bg-red-600",
    iconType: "pk_dragon",
  },
  {
    id: "g_pk2",
    name: "PK Hammer",
    category: "PK",
    price: 1000,
    tag: "PK",
    tagBg: "bg-amber-600",
    iconType: "pk_hammer",
  },
  {
    id: "g_pk3",
    name: "PK Power Glove",
    category: "PK",
    price: 5000,
    tag: "PK",
    tagBg: "bg-purple-600",
    iconType: "pk_glove",
  },
  {
    id: "g_pk4",
    name: "PK Victory Shield",
    category: "PK",
    price: 30000,
    tag: "DEFENSE",
    tagBg: "bg-blue-600",
    iconType: "pk_shield",
  },
  {
    id: "g_pk5",
    name: "PK Rocket Bomb",
    category: "PK",
    price: 88000,
    tag: "BOOM",
    tagBg: "bg-orange-600",
    iconType: "pk_rocket",
  },
  {
    id: "g1",
    name: "World Cup",
    category: "Gifts",
    price: 40000,
    tag: "clock",
    iconType: "world_cup",
  },
  {
    id: "g2",
    name: "Guitarist Cat",
    category: "Gifts",
    price: 176000,
    iconType: "guitarist_cat",
  },
  {
    id: "g3",
    name: "Red Rose",
    category: "Gifts",
    price: 600,
    iconType: "red_rose",
  },
  {
    id: "g4",
    name: "Fog Moon",
    category: "Gifts",
    price: 100,
    iconType: "fog_moon",
  },
  {
    id: "g5",
    name: "Couple Love",
    category: "Couple",
    price: 20000,
    iconType: "couple_love",
  },
  {
    id: "g6",
    name: "Fireworks Castle",
    category: "Event",
    price: 19980,
    iconType: "fireworks_castle",
  },
  {
    id: "g7",
    name: "Kiss Kiss",
    category: "Gifts",
    price: 19800,
    iconType: "kiss_kiss",
  },
  {
    id: "g8",
    name: "My Heart",
    category: "Couple",
    price: 19800,
    iconType: "my_heart",
  },
  {
    id: "g9",
    name: "Clinking Glasses",
    category: "Event",
    price: 520,
    tag: "NEW",
    tagBg: "bg-pink-500",
    iconType: "clinking_glasses",
  },
  {
    id: "g10",
    name: "Royal Crown",
    category: "Premium",
    price: 50000,
    tag: "HOT",
    tagBg: "bg-amber-500",
    iconType: "royal_crown",
  },
  {
    id: "g11",
    name: "Royal Cards",
    category: "Lucky",
    price: 12000,
    iconType: "royal_cards",
  },
  {
    id: "g12",
    name: "Treasure Chest",
    category: "Lucky",
    price: 85000,
    tag: "VIP",
    tagBg: "bg-yellow-500",
    iconType: "treasure_chest",
  },
];

interface RealGiftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hostSeatUser: Participant | null;
  superSeatUser: Participant | null;
  gridSeatsUsers: (Participant | null)[];
  userCoins: number;
  onSendGift: (gift: GiftCatalogItem, recipientKey: string, count: number) => void;
  onRechargeCoins: (amount: number) => void;
}

export const RealGiftDrawer: React.FC<RealGiftDrawerProps> = ({
  isOpen,
  onClose,
  hostSeatUser,
  superSeatUser,
  gridSeatsUsers,
  userCoins,
  onSendGift,
  onRechargeCoins,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("Gifts");
  const [selectedGift, setSelectedGift] = useState<GiftCatalogItem>(REAL_GIFTS_LIST[0]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("ALL");
  const [giftCount, setGiftCount] = useState<number>(1);
  const [showCountMenu, setShowCountMenu] = useState<boolean>(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState<boolean>(false);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ["Gifts", "PK", "Lucky", "Event", "Custom", "Premium", "Couple"];

  const filteredGifts = REAL_GIFTS_LIST.filter(
    (g) => activeCategory === "Gifts" || g.category === activeCategory
  );

  const multiplierOptions = [1, 10, 66, 99, 188, 520, 1314];

  // Render high fidelity 3D graphics matching exact screenshot items
  const render3DGiftGraphic = (type: string) => {
    switch (type) {
      case "pk_dragon":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-red-600/30 rounded-full blur-md animate-pulse" />
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-950 via-rose-900 to-amber-950 p-1 flex items-center justify-center shadow-lg border border-red-500/60">
              <span className="text-3xl drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]">🐉</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute top-1 right-1 animate-ping" />
            </div>
          </div>
        );

      case "pk_hammer":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-950 via-orange-950 to-slate-900 flex items-center justify-center shadow-md border border-amber-500/50">
              <span className="text-3xl drop-shadow-[0_2px_10px_rgba(245,158,11,0.9)]">🔨</span>
              <Flame className="w-4 h-4 text-orange-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
        );

      case "pk_glove":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-950 via-rose-950 to-red-900 flex items-center justify-center shadow-md border border-purple-400/50">
              <span className="text-3xl drop-shadow-[0_2px_10px_rgba(168,85,247,0.9)]">🥊</span>
            </div>
          </div>
        );

      case "pk_shield":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-950 via-indigo-950 to-cyan-900 flex items-center justify-center shadow-md border border-cyan-400/50">
              <span className="text-3xl drop-shadow-[0_2px_10px_rgba(56,189,248,0.9)]">🛡️</span>
            </div>
          </div>
        );

      case "pk_rocket":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-950 via-red-950 to-slate-900 flex items-center justify-center shadow-md border border-orange-400/50">
              <span className="text-3xl drop-shadow-[0_2px_10px_rgba(249,115,22,0.9)]">🚀</span>
            </div>
          </div>
        );
      case "world_cup":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/30 to-purple-500/30 rounded-full blur-md animate-pulse" />
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 p-1 flex items-center justify-center shadow-lg border border-yellow-400/50">
              <Trophy className="w-9 h-9 text-yellow-300 drop-shadow-[0_2px_8px_rgba(253,224,71,0.8)]" />
              <Sparkles className="w-4 h-4 text-white absolute top-1 right-1 animate-spin" />
            </div>
          </div>
        );

      case "guitarist_cat":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-950 via-indigo-950 to-purple-900 flex items-center justify-center shadow-md border border-purple-400/30 overflow-hidden">
              <span className="text-2xl drop-shadow-[0_2px_10px_rgba(251,191,36,0.8)]">🐱🎸</span>
              <span className="absolute bottom-0 text-[10px]">🌙</span>
            </div>
          </div>
        );

      case "red_rose":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl drop-shadow-[0_4px_12px_rgba(244,63,94,0.9)] animate-pulse">🌹</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 absolute -top-1 -right-1" />
            </div>
          </div>
        );

      case "fog_moon":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]">💡</span>
              <Sparkles className="w-4 h-4 text-pink-300 absolute -top-1" />
            </div>
          </div>
        );

      case "couple_love":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center">
              <span className="text-3xl drop-shadow-[0_4px_10px_rgba(239,68,68,0.8)]">🎈</span>
              <span className="text-xs absolute bottom-1">👩‍❤️‍👨</span>
            </div>
          </div>
        );

      case "fireworks_castle":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex flex-col items-center justify-center">
              <span className="text-3xl drop-shadow-[0_4px_12px_rgba(251,191,36,0.8)]">🏰</span>
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 animate-ping" />
            </div>
          </div>
        );

      case "kiss_kiss":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl drop-shadow-[0_4px_12px_rgba(244,63,94,0.9)]">💋</span>
              <Heart className="w-3.5 h-3.5 text-pink-400 absolute -top-1 -right-1 fill-pink-400" />
            </div>
          </div>
        );

      case "my_heart":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl drop-shadow-[0_4px_15px_rgba(236,72,153,0.9)]">💖</span>
              <span className="absolute -left-2 text-xs">🕊️</span>
              <span className="absolute -right-2 text-xs">🕊️</span>
            </div>
          </div>
        );

      case "clinking_glasses":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="text-3xl drop-shadow-[0_2px_10px_rgba(239,68,68,0.8)]">🥂</span>
          </div>
        );

      case "royal_crown":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_2px_12px_rgba(245,158,11,0.9)]" />
          </div>
        );

      case "royal_cards":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="text-3xl drop-shadow-[0_2px_10px_rgba(250,204,21,0.8)]">🃏</span>
          </div>
        );

      case "treasure_chest":
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <span className="text-3xl drop-shadow-[0_4px_12px_rgba(245,158,11,0.9)]">🏴‍☠️</span>
          </div>
        );

      default:
        return (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Gift className="w-10 h-10 text-amber-400" />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-[140] p-0 animate-fadeIn">
        
        {/* Click outside closer */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="relative w-full max-w-md bg-[#131217] rounded-t-[28px] overflow-hidden border-t border-white/10 text-white z-10 flex flex-col max-h-[82vh] select-none shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
        >
          {/* Header Row (Top Left Avatar & Top Right "All 🎙️" Pill) */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            
            {/* Top Left User Badge */}
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#1e1c24] flex items-center justify-center font-black text-amber-400 text-sm">
                  {hostSeatUser?.name ? hostSeatUser.name.charAt(0).toUpperCase() : "M"}
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-[#131217] flex items-center justify-center text-[7px] font-extrabold text-black">
                ★
              </div>
            </div>

            {/* Top Right "All 🎙️" Recipient Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                className="px-3 py-1 rounded-full bg-[#23212b] hover:bg-[#2e2a38] text-xs font-bold text-slate-200 flex items-center gap-1.5 border border-white/5 cursor-pointer shadow-sm"
              >
                <span>{selectedRecipient === "ALL" ? "All" : selectedRecipient === "HOST" ? "Host" : "Recipient"}</span>
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Mic className="w-3 h-3 text-slate-300" />
                </div>
              </button>

              {/* Recipient Dropdown */}
              {showRecipientDropdown && (
                <div className="absolute top-full mt-1 right-0 w-36 bg-[#1f1d26] border border-white/10 rounded-2xl p-1 shadow-2xl z-50 flex flex-col gap-1 text-[11px]">
                  <button
                    onClick={() => { setSelectedRecipient("ALL"); setShowRecipientDropdown(false); }}
                    className="px-2.5 py-1.5 text-left rounded-xl hover:bg-white/10 font-bold flex items-center gap-2"
                  >
                    🎙️ <span>All Members</span>
                  </button>
                  {hostSeatUser && (
                    <button
                      onClick={() => { setSelectedRecipient("HOST"); setShowRecipientDropdown(false); }}
                      className="px-2.5 py-1.5 text-left rounded-xl hover:bg-white/10 font-bold flex items-center gap-2"
                    >
                      👑 <span>Host ({hostSeatUser.name})</span>
                    </button>
                  )}
                  {superSeatUser && (
                    <button
                      onClick={() => { setSelectedRecipient("SUPER"); setShowRecipientDropdown(false); }}
                      className="px-2.5 py-1.5 text-left rounded-xl hover:bg-white/10 font-bold flex items-center gap-2"
                    >
                      ⭐ <span>Super ({superSeatUser.name})</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Category Tabs (Gifts ▾, Lucky, Event, Custom, Premium, Couple) */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 overflow-x-auto scrollbar-none shrink-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-semibold tracking-tight shrink-0 pb-1.5 relative transition-colors cursor-pointer flex items-center gap-0.5 ${
                  activeCategory === cat ? "text-white font-black" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{cat}</span>
                {cat === "Gifts" && (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryYellowBar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Gifts Grid (4 Columns Layout) */}
          <div className="p-3 grid grid-cols-4 gap-2.5 overflow-y-auto max-h-[46vh] scrollbar-none">
            {filteredGifts.map((gift) => {
              const isSelected = selectedGift.id === gift.id;
              return (
                <div
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`relative rounded-2xl p-2 flex flex-col items-center justify-between cursor-pointer transition-all duration-150 aspect-[4/4.8] ${
                    isSelected
                      ? "bg-[#1e1b26] border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.02]"
                      : "bg-[#17161c] border border-white/[0.04] hover:bg-[#1d1c24]"
                  }`}
                >
                  {/* Top Left Clock Icon / Badge */}
                  {gift.tag === "clock" ? (
                    <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-xs">
                      <Clock className="w-2.5 h-2.5" />
                    </div>
                  ) : gift.tag ? (
                    <div className={`absolute top-1 left-1 px-1.5 py-0.2 text-[8px] font-black uppercase text-white rounded-full ${gift.tagBg || "bg-amber-500"} scale-90`}>
                      {gift.tag}
                    </div>
                  ) : null}

                  {/* 3D Visual Graphic */}
                  <div className="w-14 h-14 mt-1 flex items-center justify-center">
                    {render3DGiftGraphic(gift.iconType)}
                  </div>

                  {/* Name and Price */}
                  <div className="w-full flex flex-col items-center text-center mt-1">
                    <span className="text-[10px] font-bold text-slate-100 truncate w-full leading-tight">
                      {gift.name}
                    </span>
                    <span className="text-[9px] font-extrabold text-amber-400 flex items-center gap-0.5 mt-0.5">
                      <span className="text-[10px]">🪙</span>
                      <span>{gift.price.toLocaleString()}</span>
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Controls Footer Bar */}
          <div className="mt-auto px-3 py-2.5 bg-[#0e0d12] border-t border-white/5 flex items-center justify-between gap-2 shrink-0">
            
            {/* Left Controls: Coins Pill + "RECHARGE REWARDS >" Pill */}
            <div className="flex items-center gap-1.5">
              
              {/* Coin Counter Pill */}
              <button
                onClick={() => setShowRechargeModal(true)}
                className="px-2.5 py-1.5 rounded-full bg-[#1c1a24] border border-white/5 text-xs font-black text-white flex items-center gap-1 hover:bg-[#252230] cursor-pointer"
              >
                <span className="text-amber-400 text-xs">🪙</span>
                <span>{userCoins.toLocaleString()}</span>
                <span className="text-slate-400 text-[10px] ml-0.5">&gt;</span>
              </button>

              {/* Recharge Rewards Pill Button */}
              <button
                onClick={() => setShowRechargeModal(true)}
                className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1 shadow-md cursor-pointer border border-pink-300/30"
              >
                <Gift className="w-3 h-3 text-yellow-200 animate-bounce" />
                <span>Recharge Rewards</span>
                <span className="text-[8px]">&gt;</span>
              </button>

            </div>

            {/* Right Controls: Unified Multiplier + Send Button */}
            <div className="relative flex items-center rounded-full bg-[#1b1924] border border-amber-400/80 p-0.5 overflow-visible shadow-lg">
              
              {/* Multiplier Trigger section */}
              <div className="relative">
                <button
                  onClick={() => setShowCountMenu(!showCountMenu)}
                  className="px-3 py-1.5 text-xs font-black text-white flex items-center gap-1 hover:text-amber-300 cursor-pointer"
                >
                  <span>{giftCount}</span>
                  <ChevronUp className="w-3 h-3 text-slate-400" />
                </button>

                {/* Multiplier Dropdown */}
                {showCountMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-[#1f1c2b] border border-amber-400/40 rounded-2xl p-1.5 shadow-2xl z-50 grid grid-cols-2 gap-1 w-28 text-[10px]">
                    {multiplierOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setGiftCount(opt); setShowCountMenu(false); }}
                        className={`py-1 rounded-xl font-black text-center transition-colors ${
                          giftCount === opt ? "bg-amber-400 text-black" : "hover:bg-white/10 text-white"
                        }`}
                      >
                        x{opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Yellow Send Button */}
              <button
                onClick={() => {
                  onSendGift(selectedGift, selectedRecipient, giftCount);
                  onClose();
                }}
                className="px-5 py-1.5 rounded-full bg-[#facc15] hover:bg-[#eab308] active:scale-95 font-black text-xs text-black transition-all cursor-pointer shadow-md tracking-wide"
              >
                Send
              </button>

            </div>

          </div>

        </motion.div>

        {/* RECHARGE COINS MODAL */}
        <AnimatePresence>
          {showRechargeModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[160] flex items-center justify-center p-4">
              <div className="bg-[#1b143a] border border-amber-500/30 rounded-3xl p-5 max-w-sm w-full text-white shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪙</span>
                    <h3 className="font-black text-base">Recharge Room Coins</h3>
                  </div>
                  <button
                    onClick={() => setShowRechargeModal(false)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-300 mb-4">
                  Select an instant coin bundle to send gifts to hosts during live streams:
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { coins: 50000, price: "$1.99", bonus: "+5K" },
                    { coins: 150000, price: "$4.99", bonus: "+20K" },
                    { coins: 500000, price: "$14.99", bonus: "+100K" },
                    { coins: 2000000, price: "$49.99", bonus: "+500K" },
                  ].map((pack, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onRechargeCoins(pack.coins);
                        setShowRechargeModal(false);
                      }}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-500/10 transition-all text-center flex flex-col items-center cursor-pointer"
                    >
                      <span className="text-xs font-black text-amber-400">🪙 {pack.coins.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-400 font-extrabold mt-0.5">{pack.bonus} Bonus</span>
                      <span className="text-xs font-bold text-white mt-1">{pack.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
};
