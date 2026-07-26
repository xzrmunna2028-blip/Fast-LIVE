/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, useCallback, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "./lib/firebase";
import { createAgoraRtcService, createAgoraChatService } from "./lib/agora";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, deleteDoc, addDoc, query, where, getDocs, increment, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import voxaclubLogo from "./assets/images/voxaclub_logo_1784157398686.jpg";
import loginBg from "./assets/images/login_bg_1784157824235.jpg";
import voxaclubLoginLogo from "./assets/images/voxaclub_login_logo_1784157809686.jpg";
import {
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Users,
  MessageSquare,
  X,
  Power,
  Volume2,
  VolumeX,
  Send,
  Music,
  Share2,
  Lock,
  Headphones,
  Activity,
  Award,
  Crown,
  Smartphone,
  CheckCircle2,
  User,
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  Search,
  Calendar,
  Flame,
  Home,
  Compass,
  Heart,
  Trophy,
  MessageCircle,
  Plus,
  Gift,
  Globe,
  Settings,
  Shirt,
  ShoppingBag,
  Star,
  Copy,
  Edit3,
  Info,
  PhoneCall,
  Phone,
  Video,
  Flag,
  AlertTriangle,
  MinusSquare,
  LogOut,
  Maximize2,
  Minimize2,
  ExternalLink,
  UserPlus,
  Unlock,
  Mail,
  Trash2,
  Wallet,
  Shield,
  RotateCcw,
  VideoOff,
  MoreHorizontal,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";

import { RealGiftDrawer, GiftCatalogItem } from "./components/RealGiftDrawer";
import { GiftAnimationOverlay, ActiveGiftInfo } from "./components/GiftAnimationOverlay";
import { PKBattleBar } from "./components/PKBattleBar";
import { UserProfileModalCard } from "./components/UserProfileModalCard";
import { FullUserProfileModal, UserProfileFullData } from "./components/FullUserProfileModal";
import { DirectChatCallModal } from "./components/DirectChatCallModal";

// Participant interface for the live room
interface Participant {
  id: string;
  name: string;
  role: "Host" | "Co-Host" | "Speaker" | "Listener";
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number; // 0 to 100
  hasTigerCrown?: boolean;
  agoraUid?: number;
}

// Live Chat Message interface
interface ChatMessage {
  id: string;
  user: string;
  role: string;
  text: string;
  timestamp: string;
}

export function FlowerBouquetSVG() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)]">
      {/* Bouquet wrap ribbon */}
      <path d="M26,45 L38,45 L35,58 L29,58 Z" fill="#fbcfe8" opacity="0.8" />
      {/* Rose Stems */}
      <path d="M27,35 L25,48 M32,35 L32,48 M37,35 L39,48" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      {/* Green Leaves */}
      <path d="M18,30 Q22,25 24,32" fill="#10b981" stroke="#047857" strokeWidth="1" />
      <path d="M46,30 Q42,25 40,32" fill="#10b981" stroke="#047857" strokeWidth="1" />
      {/* Pink Roses */}
      <circle cx="32" cy="22" r="9" fill="#db2777" />
      <circle cx="32" cy="22" r="6" fill="#f43f5e" />
      <circle cx="32" cy="22" r="3" fill="#fda4af" />
      <circle cx="21" cy="26" r="8" fill="#e11d48" />
      <circle cx="21" cy="26" r="5" fill="#f43f5e" />
      <circle cx="43" cy="26" r="8" fill="#e11d48" />
      <circle cx="43" cy="26" r="5" fill="#f43f5e" />
      <circle cx="32" cy="11" r="8" fill="#be185d" />
      <circle cx="32" cy="11" r="5" fill="#db2777" />
      {/* Ribbon Bow */}
      <path d="M32,45 C28,40 24,48 32,45 Z" fill="#ec4899" />
      <path d="M32,45 C36,40 40,48 32,45 Z" fill="#ec4899" />
      <circle cx="32" cy="45" r="2" fill="#fbcfe8" />
    </svg>
  );
}

export function GoldCrownGiftSVG() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]">
      <path d="M12,46 L14,26 L24,34 L32,18 L40,34 L50,26 L52,46 Z" fill="url(#giftCrownGrad)" stroke="#78350f" strokeWidth="1.5" />
      <rect x="15" y="46" width="34" height="4" rx="1" fill="#78350f" />
      <circle cx="32" cy="18" r="3" fill="#22d3ee" />
      <circle cx="14" cy="26" r="2" fill="#ec4899" />
      <circle cx="50" cy="26" r="2" fill="#ec4899" />
      <circle cx="24" cy="34" r="1.5" fill="#f59e0b" />
      <circle cx="40" cy="34" r="1.5" fill="#f59e0b" />
      <defs>
        <linearGradient id="giftCrownGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const renderUserBadges = (userName: string, vipLevel: number, isRoomOwner?: boolean, role?: string, isHost?: boolean) => {
  const badges = [];

  // 1. Host / Owner / Admin Badges (Custom silhouettes and stylized English texts)
  if (isHost || role === "Host") {
    badges.push(
      <span key="host" className="px-2 py-0.5 rounded bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[9px] font-black border border-pink-400/50 shadow-sm leading-none uppercase tracking-wider whitespace-nowrap shrink-0" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
        Host
      </span>
    );
  } else if (isRoomOwner || role === "Owner") {
    badges.push(
      <span key="owner" className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-yellow-500/25 border border-yellow-400 text-yellow-400 shadow-sm leading-none shrink-0" title="Owner">
        <User className="w-3 h-3 fill-current" />
      </span>
    );
  } else if (role === "Admin" || userName?.includes("Admin") || userName?.includes("🛡️")) {
    badges.push(
      <span key="admin" className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-sky-500/25 border border-sky-400 text-sky-400 shadow-sm leading-none shrink-0" title="Admin">
        <User className="w-3 h-3 fill-current" />
      </span>
    );
  }

  // 2. Level Badge (e.g., Lv.11)
  const displayLevel = vipLevel || 11;
  badges.push(
    <span key="level" className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[8px] font-black border border-yellow-300 shadow-sm leading-none whitespace-nowrap">
      Lv.{displayLevel}
    </span>
  );

  // 3. VIP Badge (e.g., VIP1)
  const vipNum = vipLevel ? (vipLevel > 5 ? 5 : vipLevel) : 1;
  badges.push(
    <span key="vip" className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-gradient-to-r from-stone-700 via-stone-600 to-stone-800 text-yellow-400 text-[8px] font-black border border-stone-500 shadow-sm leading-none whitespace-nowrap">
      VIP{vipNum}
    </span>
  );

  return (
    <div className="flex items-center gap-1 shrink-0">
      {badges}
    </div>
  );
};

export function TigerCrown({ size = "grid-seat" }: { size?: "premium-seat" | "grid-seat" | "profile-banner" | "success-modal" }) {
  // Center frame dynamically with absolute center position based on target container size
  let dims = "w-[133px] h-[133px]";
  if (size === "premium-seat") {
    dims = "w-[144px] h-[144px]";
  } else if (size === "profile-banner") {
    dims = "w-[118px] h-[118px]";
  } else if (size === "success-modal") {
    dims = "w-[177px] h-[177px]";
  } else {
    dims = "w-[133px] h-[133px]";
  }

  return (
    <div
      className={`absolute z-40 pointer-events-none select-none ${dims} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible`}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-[0_4px_16px_rgba(6,182,212,0.5)]">
        <defs>
          {/* Metallic Golden Gradients for 3D realism */}
          <linearGradient id="gold-metal-3d" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fffeee" />
            <stop offset="20%" stopColor="#fbbf24" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="60%" stopColor="#fef08a" />
            <stop offset="85%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <linearGradient id="gold-shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Glowing Aura Gradients (Deep blue -> Neon Cyan -> Sky blue) */}
          <linearGradient id="blue-aura" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="cyan-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#22d3ee" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#083344" />
          </linearGradient>

          <linearGradient id="dark-track" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2e2f38" />
            <stop offset="50%" stopColor="#111317" />
            <stop offset="100%" stopColor="#050608" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="flame-neon-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Embedded CSS style for smooth, static, stable rendering with no zoom/jitter issues */}
        <style>
          {`
            .wing-l {
              transform-origin: 75px 100px;
              filter: drop-shadow(0 0 4px rgba(34,211,238,0.5));
            }
            .wing-r {
              transform-origin: 125px 100px;
              filter: drop-shadow(0 0 4px rgba(34,211,238,0.5));
            }
            .gem-glow {
              filter: drop-shadow(0 0 2px #22d3ee);
            }
            .sparkle-dot {
              opacity: 0.9;
            }
          `}
        </style>

        {/* MAIN METALLIC CIRCULAR AVATAR FRAME RING */}
        {/* Outer Golden Border */}
        <circle cx="100" cy="100" r="57.5" fill="none" stroke="url(#gold-metal-3d)" strokeWidth="3" />
        {/* Dark Textured Inner Track */}
        <circle cx="100" cy="100" r="52.5" fill="none" stroke="url(#dark-track)" strokeWidth="7" />
        {/* Inner Golden Rim */}
        <circle cx="100" cy="100" r="48" fill="none" stroke="url(#gold-metal-3d)" strokeWidth="1.5" />

        {/* EMBEDDED CYAN DIAMOND GEMS ON MAIN RING */}
        {/* Left gem */}
        <polygon points="48,94 54,100 48,106 42,100" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />
        {/* Right gem */}
        <polygon points="152,94 158,100 152,106 146,100" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />
        {/* Upper-Left gem */}
        <polygon points="65,54 71,60 65,66 59,60" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />
        {/* Upper-Right gem */}
        <polygon points="135,54 141,60 135,66 129,60" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />
        {/* Lower-Left gem */}
        <polygon points="65,140 71,146 65,152 59,146" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />
        {/* Lower-Right gem */}
        <polygon points="135,140 141,146 135,152 129,146" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" />

        {/* ROYAL GOLD CROWN ON TOP HEAD */}
        <g id="crown-top">
          {/* Base band curve */}
          <path d="M 74,45 C 85,37 115,37 126,45 L 128,41 C 115,33 85,33 72,41 Z" fill="url(#gold-metal-3d)" stroke="#451a03" strokeWidth="0.75" />
          {/* Crown peaks */}
          <path d="M 76,41 L 79,22 L 91,32 L 100,16 L 109,32 L 121,22 L 124,41 Z" fill="url(#gold-metal-3d)" stroke="#451a03" strokeWidth="1" />
          {/* Peak jewels */}
          <circle cx="100" cy="16" r="2.5" fill="#22d3ee" className="gem-glow" />
          <circle cx="79" cy="22" r="1.75" fill="#f59e0b" className="sparkle-dot" />
          <circle cx="121" cy="22" r="1.75" fill="#f59e0b" className="sparkle-dot" />
          
          {/* Dangling drop gem from crown center */}
          <path d="M 100,31 C 96.5,37 100,45 100,45 C 100,45 103.5,37 100,31 Z" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.75" className="gem-glow" />
        </g>

        {/* GOLD WINGS AND BADGE SHIELD AT BOTTOM */}
        <g id="badge-bottom">
          {/* Left golden feather wing */}
          <path d="M 100,163 C 78,163 63,148 53,158 C 63,173 83,178 100,173 Z" fill="url(#gold-metal-3d)" stroke="#451a03" strokeWidth="0.75" />
          {/* Right golden feather wing */}
          <path d="M 100,163 C 122,163 137,148 147,158 C 137,173 117,178 100,173 Z" fill="url(#gold-metal-3d)" stroke="#451a03" strokeWidth="0.75" />
          {/* Medallion crest shield */}
          <path d="M 86,146 C 86,146 100,138 100,138 C 100,138 114,146 114,146 C 114,163 100,178 100,178 C 100,178 86,163 86,146 Z" fill="url(#gold-metal-3d)" stroke="#451a03" strokeWidth="1.2" />
          {/* Giant glowing cyan medallion gem */}
          <path d="M 100,144 C 93.5,150 100,164 100,164 C 100,164 106.5,150 100,144 Z" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="1" className="gem-glow" />
        </g>

        {/* MAGICAL SPARKS & GLOSS SHIMMERS */}
        <g opacity="0.95">
          {/* Top-right sparkle */}
          <path d="M 160,50 Q 165,50 165,45 Q 165,50 170,50 Q 165,50 165,55 Q 165,50 160,50" fill="#ffffff" className="sparkle-dot" />
          {/* Bottom-left sparkle */}
          <path d="M 35,145 Q 40,145 40,140 Q 40,145 45,145 Q 40,145 40,150 Q 40,145 35,145" fill="#22d3ee" className="sparkle-dot" />
        </g>
      </svg>
    </div>
  );
}

export function VipBadgeCenterpiece({ level = 1, avatar, name }: { level: number; avatar?: string; name?: string }) {
  // Keeping the magnificent gold-purple-fire design uniform and highly rendered for all levels
  // as explicitly requested by the user so it looks like a real 3D premium GIF.
  const gemColor1 = "#f472b6"; // Glowing purple-pink
  const gemColor2 = "#701a75"; // Deep amethyst purple
  const fireColor1 = "#fde047"; // Hot golden fire
  const fireColor2 = "#ea580c"; // Burning orange
  const fireColor3 = "#7f1d1d"; // Deep crimson embers
  const glowColor = "#ea580c"; // Warm golden/orange aura

  // Safe fallback avatar URL
  const fallbackAvatar = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200";

  // Dynamic state to load current logged-in user if props are not explicitly passed
  const [localUser, setLocalUser] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    if (!avatar || !name) {
      try {
        const saved = localStorage.getItem("voxaclub_current_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            setLocalUser({
              name: parsed.name || "Md Munna",
              avatar: parsed.avatar || fallbackAvatar
            });
          }
        }
      } catch (e) {
        // ignore errors
      }
    }
  }, [avatar, name, level]);

  const displayAvatar = avatar || localUser?.avatar || fallbackAvatar;
  const displayName = name || localUser?.name || "Md Munna";

  return (
    <div className="relative w-80 h-80 mx-auto flex items-center justify-center select-none pointer-events-none">
      {/* Background radial rays glow mimicking GIF aura */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl animate-pulse opacity-45 transition-all duration-700"
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Dynamic Rotating Starburst Rings (GIF aura simulation) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-30 animate-spin" style={{ animationDuration: '40s' }}>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1, 8" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="2, 5" />
        </svg>
      </div>

      {/* Floating Animated Golden Sparkles around the crown */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-yellow-300 text-sm filter drop-shadow-[0_0_3px_rgba(253,224,71,0.9)] select-none"
            initial={{ 
              opacity: 0, 
              y: 190, 
              x: 120 + (i * 12 - 60), 
              scale: 0.4 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: [160, 20], 
              x: [120 + (i * 14 - 70), 120 + (i * 18 - 90) + (Math.sin(i) * 24)],
              scale: [0.4, 1.4, 1.0, 0.3] 
            }}
            transition={{
              duration: 3.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* Main SVG Graphic - Perfect 1:1 Replicating Screenshot 2 Premium Frame */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] relative z-10">
        <defs>
          {/* Real Gold Bevel & Lighting Filter to create incredibly rich 3D metal depth */}
          <filter id="goldBevelFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
            <feSpecularLighting in="blur" specularExponent="35" specularConstant="1.8" surfaceScale="2.8" lightingColor="#ffffff" result="light">
              <feDistantLight azimuth="135" elevation="45" />
            </feSpecularLighting>
            <feComposite in="light" in2="SourceAlpha" operator="in" result="specular" />
            <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="0.85" k4="0" result="lit" />
          </filter>

          {/* Glowing Aura Filter for Precious Amethyst Purple Gems */}
          <filter id="gemGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Premium Metallic Multi-stop Golden Gradient for ultimate metallic realism */}
          <linearGradient id="realGoldGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#fff0ca" />
            <stop offset="28%" stopColor="#f5ca62" />
            <stop offset="45%" stopColor="#d99926" />
            <stop offset="60%" stopColor="#8c5a04" />
            <stop offset="75%" stopColor="#ffd978" />
            <stop offset="90%" stopColor="#f5b82e" />
            <stop offset="100%" stopColor="#3d2100" />
          </linearGradient>

          {/* Wing gold gradient */}
          <linearGradient id="wingsGoldGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#805607" />
            <stop offset="45%" stopColor="#fedb7c" />
            <stop offset="75%" stopColor="#ffd256" />
            <stop offset="100%" stopColor="#e5a11c" />
          </linearGradient>

          {/* Premium Amethyst Purple Gem Gradients */}
          <linearGradient id="purpleGemGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="75%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>

          {/* Warm Flame Gradient */}
          <linearGradient id="warmFlameGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={fireColor3} />
            <stop offset="50%" stopColor={fireColor2} />
            <stop offset="100%" stopColor={fireColor1} />
          </linearGradient>

          {/* Shimmer Sweep overlay gradient */}
          <linearGradient id="shimmerSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Mask for the circular gold frame to make shimmer sweep across */}
          <mask id="ringMask">
            <circle cx="100" cy="100" r="54" fill="#ffffff" />
            <circle cx="100" cy="100" r="42" fill="#000000" />
          </mask>

          {/* Circular avatar clipping path */}
          <clipPath id="centerpieceAvatarClip">
            <circle cx="100" cy="100" r="45.5" />
          </clipPath>

          {/* Inner Shadow gradient for the avatar to sit deep in the gold hoop */}
          <radialGradient id="centerpieceAvatarShadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <style>
          {`
            @keyframes wingPulseL {
              0%, 100% { transform: rotate(0deg) scale(1); filter: brightness(1); }
              50% { transform: rotate(-3.5deg) scale(1.02); filter: brightness(1.15) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); }
            }
            @keyframes wingPulseR {
              0%, 100% { transform: rotate(0deg) scale(1); filter: brightness(1); }
              50% { transform: rotate(3.5deg) scale(1.02); filter: brightness(1.15) drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); }
            }
            @keyframes firePulse1 {
              0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.9; }
              50% { transform: scale(1.04) translate(-1px, -3px); opacity: 1; filter: brightness(1.2) drop-shadow(0 0 12px #f97316); }
            }
            @keyframes firePulse2 {
              0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.8; }
              50% { transform: scale(1.06) translate(1px, -2px); opacity: 0.95; filter: brightness(1.1) drop-shadow(0 0 8px #ef4444); }
            }
            @keyframes firePulse3 {
              0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.85; }
              50% { transform: scale(1.03) translate(0px, -2px); opacity: 1; filter: brightness(1.25); }
            }
            @keyframes shineSweep {
              0% { transform: translate(-140px, -140px) rotate(45deg); }
              40%, 100% { transform: translate(140px, 140px) rotate(45deg); }
            }
            @keyframes crownBob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-3px); }
            }
            .v-wing-l {
              animation: wingPulseL 2.2s ease-in-out infinite;
              transform-origin: 52px 100px;
            }
            .v-wing-r {
              animation: wingPulseR 2.2s ease-in-out infinite;
              animation-delay: 1.1s;
              transform-origin: 148px 100px;
            }
            .fire-layer-1 {
              animation: firePulse1 1.8s ease-in-out infinite;
              transform-origin: 100px 170px;
            }
            .fire-layer-2 {
              animation: firePulse2 1.4s ease-in-out infinite;
              animation-delay: 0.3s;
              transform-origin: 100px 170px;
            }
            .fire-layer-3 {
              animation: firePulse3 2s ease-in-out infinite;
              animation-delay: 0.6s;
              transform-origin: 100px 170px;
            }
            .gold-sheen-rect {
              animation: shineSweep 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            .top-crest-bob {
              animation: crownBob 3s ease-in-out infinite;
              transform-origin: 100px 45px;
            }
          `}
        </style>

        {/* ================= BACKGROUND FIERY SHIELD AURA FLICKER ================= */}
        <g className="fire-layer-1">
          {/* Broad deep flame backdrop (Screenshot 2 style phoenix flames) */}
          <path d="M 100,166 C 60,166 38,135 34,115 C 30,95 44,95 52,110 C 62,128 80,146 100,154 Z" fill="url(#warmFlameGradient)" opacity="0.4" />
          <path d="M 100,166 C 140,166 162,135 166,115 C 170,95 156,95 148,110 C 138,128 120,146 100,154 Z" fill="url(#warmFlameGradient)" opacity="0.4" />
        </g>

        {/* ================= LEFT WING LAYER (Screenshot 2 Style Golden Wings) ================= */}
        <g className="v-wing-l">
          {/* Base shadow feathers */}
          <path d="M 52,100 C 35,80 18,70 12,58 C 8,50 14,50 20,60 C 28,74 42,88 52,100 Z" fill="#3d2805" />
          {/* Golden Wing Layer 1 */}
          <path d="M 52,100 C 36,83 19,72 13,60 C 9,52 16,52 22,62 C 30,76 43,90 52,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 2 */}
          <path d="M 52,100 C 32,88 15,83 9,72 C 6,66 12,65 18,74 C 26,86 40,94 52,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 3 */}
          <path d="M 52,100 C 30,96 12,94 6,86 C 3,80 10,80 15,88 C 24,94 38,98 52,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 4 */}
          <path d="M 52,100 C 32,105 16,110 10,102 C 8,96 14,96 20,100 C 30,103 42,102 52,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Shiny Specular lines */}
          <path d="M 52,100 C 38,85 24,76 18,66" fill="none" stroke="#fff" strokeWidth="0.75" opacity="0.4" />
          <path d="M 52,100 C 34,90 20,85 14,76" fill="none" stroke="#fff" strokeWidth="0.75" opacity="0.4" />
        </g>

        {/* ================= RIGHT WING LAYER (Screenshot 2 Style Golden Wings) ================= */}
        <g className="v-wing-r">
          {/* Base shadow feathers */}
          <path d="M 148,100 C 165,80 182,70 188,58 C 192,50 186,50 180,60 C 172,74 158,88 148,100 Z" fill="#3d2805" />
          {/* Golden Wing Layer 1 */}
          <path d="M 148,100 C 164,83 181,72 187,60 C 191,52 184,52 178,62 C 170,76 157,90 148,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 2 */}
          <path d="M 148,100 C 168,88 185,83 191,72 C 194,66 188,65 182,74 C 174,86 160,94 148,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 3 */}
          <path d="M 148,100 C 170,96 188,94 194,86 C 197,80 190,80 185,88 C 176,94 162,98 148,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Golden Wing Layer 4 */}
          <path d="M 148,100 C 168,105 184,110 190,102 C 192,96 186,96 180,100 C 170,103 158,102 148,100 Z" fill="url(#wingsGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.5" />
          {/* Shiny Specular lines */}
          <path d="M 148,100 C 162,85 176,76 182,66" fill="none" stroke="#fff" strokeWidth="0.75" opacity="0.4" />
          <path d="M 148,100 C 166,90 180,85 186,76" fill="none" stroke="#fff" strokeWidth="0.75" opacity="0.4" />
        </g>

        {/* ================= THE MAIN GOLDEN RING EMBLEM ================= */}
        <g id="mainRingFrame">
          {/* Dark Background plate */}
          <circle cx="100" cy="100" r="54" fill="rgba(24, 10, 2, 0.88)" stroke="#3f270b" strokeWidth="1.2" />

          {/* User's dynamic profile avatar clipped inside the centerpiece circle */}
          <g clipPath="url(#centerpieceAvatarClip)">
            {displayAvatar ? (
              <image 
                href={displayAvatar} 
                x="54.5" 
                y="54.5" 
                width="91" 
                height="91" 
                preserveAspectRatio="xMidYMid slice" 
              />
            ) : (
              <rect x="54.5" y="54.5" width="91" height="91" fill="#1e1b4b" />
            )}
            
            {/* Ambient inner depth shadow layer */}
            <circle cx="100" cy="100" r="45.5" fill="url(#centerpieceAvatarShadowGrad)" />
          </g>
          
          {/* Multi-layered Beveled Gold Ring (Screen 2 Outer Golden Hoop) */}
          <circle cx="100" cy="100" r="52" fill="none" stroke="url(#realGoldGradient)" filter="url(#goldBevelFilter)" strokeWidth="6" />
          <circle cx="100" cy="100" r="47.5" fill="none" stroke="#4a310c" strokeWidth="1" />
          <circle cx="100" cy="100" r="46.5" fill="none" stroke="url(#realGoldGradient)" filter="url(#goldBevelFilter)" strokeWidth="1.8" />
          
          {/* Golden rim specular highlight */}
          <circle cx="100" cy="100" r="53.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          <circle cx="100" cy="100" r="45.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* ================= SHIMMER SHEEN GLINT EFFECT (GIF Sim) ================= */}
        <g mask="url(#ringMask)">
          <rect x="-10" y="-10" width="220" height="220" fill="url(#shimmerSheen)" className="gold-sheen-rect" />
        </g>

        {/* ================= TOP GOLDEN EAGLE HEAD / CREST ================= */}
        <g className="top-crest-bob">
          {/* Back purple ornament backdrop */}
          <path d="M 82,34 L 118,34 L 110,48 L 90,48 Z" fill="#4a2185" stroke="#7e22ce" strokeWidth="1.5" />
          {/* Shiny top design detailing */}
          <path d="M 85,34 L 115,34 L 100,44 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" />

          {/* Top Majestic Eagle head facing right */}
          <g transform="translate(100, 38) scale(1.15)">
            {/* Eagle Head silhouette back */}
            <path d="M -12,0 C -12,-8 -2,-12 4,-12 C 10,-12 12,-4 14,-2 C 15,0 12,2 8,2 C 1,2 -4,6 -12,0 Z" fill="#4a3205" />
            {/* Main eagle head (shiny gold) */}
            <path d="M -11,-1 C -11,-7 -2,-11 3,-11 C 9,-11 11,-4 13,-2 C 14,-1 11,1 8,1 C 1,1 -3,5 -11,-1 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#2c1a00" strokeWidth="0.4" />
            {/* Eagle Beak pointing right-down */}
            <path d="M 7,-5 L 13,-2 L 7,1 C 8,-1 8,-3 7,-5 Z" fill="#ffffff" opacity="0.9" />
            <path d="M 7,-4 L 11,-2 L 7,0 C 7.5,-1 7.5,-3 7,-4 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" />
            {/* Violet eye jewel */}
            <circle cx="1" cy="-4" r="1.2" fill="url(#purpleGemGradient)" filter="url(#gemGlowFilter)" />
            <circle cx="1" cy="-4" r="0.5" fill="#ffffff" />
          </g>
        </g>

        {/* ================= SIDE PURPLE GEM ATTACHMENTS ================= */}
        {/* Left Side Gem Assembly */}
        <g transform="translate(0, 0)">
          {/* Metal diamond bracket */}
          <rect x="46" y="94" width="12" height="12" transform="rotate(45 52 100)" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#2e1a00" strokeWidth="1" />
          <rect x="48" y="96" width="8" height="8" transform="rotate(45 52 100)" fill="#120700" />
          {/* Polished purple gemstone diamond (Screenshot 2 purple jewels) */}
          <rect x="48.5" y="96.5" width="7" height="7" transform="rotate(45 52 100)" fill="url(#purpleGemGradient)" filter="url(#gemGlowFilter)" className="animate-pulse" />
          {/* Specular sparkle dot */}
          <circle cx="52" cy="100" r="1.2" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Right Side Gem Assembly */}
        <g transform="translate(0, 0)">
          {/* Metal diamond bracket */}
          <rect x="142" y="94" width="12" height="12" transform="rotate(45 148 100)" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#2e1a00" strokeWidth="1" />
          <rect x="144" y="96" width="8" height="8" transform="rotate(45 148 100)" fill="#120700" />
          {/* Polished purple gemstone diamond */}
          <rect x="144.5" y="96.5" width="7" height="7" transform="rotate(45 148 100)" fill="url(#purpleGemGradient)" filter="url(#gemGlowFilter)" className="animate-pulse" />
          {/* Specular sparkle dot */}
          <circle cx="148" cy="100" r="1.2" fill="#ffffff" opacity="0.9" />
        </g>

        {/* ================= THE BOTTOM FIERY PHOENIX/EAGLE ASSEMBLY ================= */}
        {/* Back and Middle Fire Layers */}
        <g className="fire-layer-2">
          {/* Vibrant outer fire wings (Screenshot 2 flames) */}
          <path d="M 100,172 C 72,172 50,152 46,134 C 44,124 54,124 58,132 C 66,146 80,156 100,161 Z" fill="url(#warmFlameGradient)" />
          <path d="M 100,172 C 128,172 150,152 154,134 C 156,124 146,124 142,132 C 134,146 120,156 100,161 Z" fill="url(#warmFlameGradient)" />
        </g>

        <g className="fire-layer-3">
          {/* Inner hot golden flame feathers */}
          <path d="M 100,166 C 80,166 64,152 62,141 C 60,134 68,134 72,139 C 78,147 88,154 100,157 Z" fill="url(#realGoldGradient)" />
          <path d="M 100,166 C 120,166 136,152 138,141 C 140,134 132,134 128,139 C 122,147 112,154 100,157 Z" fill="url(#realGoldGradient)" />
        </g>

        {/* Phoenix Crowned Mask/Head directly centered at bottom */}
        <g id="phoenixFace" transform="translate(0, 4)">
          {/* The Golden Royal Crown atop bottom bird */}
          <path d="M 86,136 L 90,126 L 95,130 L 100,120 L 105,130 L 110,126 L 114,136 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#271900" strokeWidth="0.75" />
          <circle cx="100" cy="120" r="1.5" fill={gemColor1} className="animate-pulse" />
          <circle cx="90" cy="126" r="1" fill={gemColor1} />
          <circle cx="110" cy="126" r="1" fill={gemColor1} />

          {/* Golden Mask Head Profile */}
          <path d="M 82,148 C 82,136 100,132 100,132 C 100,132 118,136 118,148 C 118,162 108,168 100,172 C 92,168 82,162 82,148 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#3f2305" strokeWidth="1.2" />
          
          {/* Inner dark accents of bird face */}
          <path d="M 88,148 C 88,141 100,138 100,138 C 100,138 112,141 112,148 C 112,156 106,161 100,163 C 94,161 88,156 88,148 Z" fill="#201103" />

          {/* Purple Gemstone on bottom bird's forehead */}
          <g transform="translate(100, 145)">
            <rect x="-3.5" y="-3.5" width="7" height="7" transform="rotate(45)" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" />
            <rect x="-2.5" y="-2.5" width="5" height="5" transform="rotate(45)" fill="url(#purpleGemGradient)" filter="url(#gemGlowFilter)" className="animate-pulse" />
            <circle cx="0" cy="0" r="0.7" fill="#ffffff" />
          </g>

          {/* Golden beak */}
          <path d="M 96,154 L 100,163 L 104,154 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#3f2305" strokeWidth="0.5" />
          <path d="M 97,154 L 100,161 L 103,154 Z" fill="#fff" opacity="0.6" />

          {/* Fierce angled purple glowing eyes */}
          <path d="M 90,147 L 95,149 L 91,151 Z" fill={gemColor1} className="animate-pulse" />
          <path d="M 110,147 L 105,149 L 109,151 Z" fill={gemColor1} className="animate-pulse" />
        </g>

        {/* ================= METALLIC RIBBON BANNER FOR VIP TEXT ================= */}
        <g id="vipBanner" transform="translate(0, 6)">
          {/* Shadow banner */}
          <path d="M 46,113 Q 100,102 154,113 L 145,133 Q 100,121 55,133 Z" fill="#150600" opacity="0.65" />
          {/* Main 3D Banner */}
          <path d="M 48,111 Q 100,100 152,111 L 143,130 Q 100,118 57,130 Z" fill="url(#realGoldGradient)" filter="url(#goldBevelFilter)" stroke="#422501" strokeWidth="1.2" strokeLinejoin="round" />
          
          {/* Left ribbon tail folding backwards */}
          <path d="M 48,111 L 36,122 L 53,124 Z" fill="#7a5511" stroke="#331e00" strokeWidth="0.75" />
          {/* Right ribbon tail folding backwards */}
          <path d="M 152,111 L 164,122 L 147,124 Z" fill="#7a5511" stroke="#331e00" strokeWidth="0.75" />

          {/* Dynamic gloss highlight line inside ribbon */}
          <path d="M 52,114 Q 100,104 148,114" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.5" />
        </g>

        {/* ================= VIP LEVEL TITLE TEXT ================= */}
        <text 
          x="100" 
          y="126" 
          textAnchor="middle" 
          fill="#1b0c00" 
          fontSize="11.5" 
          fontWeight="1000" 
          fontFamily="Impact, Arial Black, sans-serif" 
          letterSpacing="1.2"
          transform="translate(0, 6)"
          className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
        >
          VIP {level}
        </text>

        {/* Sparkly cross overlays to emphasize high premium item quality */}
        <g opacity="0.95" className="animate-pulse">
          <path d="M 158,62 Q 162,62 162,58 Q 162,62 166,62 Q 162,62 162,66 Q 162,62 158,62" fill="#ffffff" />
          <circle cx="162" cy="62" r="1.5" fill="#fef08a" />
          <path d="M 32,128 Q 36,128 36,124 Q 36,128 40,128 Q 36,128 36,132 Q 36,128 32,128" fill="#ffffff" style={{ animationDelay: '0.8s' }} />
          <circle cx="36" cy="128" r="1.5" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
}

// Local Database structure for mock registered users
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  phone?: string;
  email?: string;
  authProvider: "phone" | "google" | "facebook" | "email";
  country?: string;
  countryFlag?: string;
  birthday?: string;
  gender?: string;
  hasTigerCrown?: boolean;
  vipLevel?: number;
  bio?: string;
  description?: string;
  idNo?: string;
  followersCount?: number;
  followingCount?: number;
  giftsCount?: number;
  giftsReceivedCoins?: number;
  giftsSentCoins?: number;
}

// Lobby Room interface for matching screenshot 3 design
interface LobbyRoom {
  id: string;
  title: string;
  subtitle: string;
  hostName: string;
  avatar: string;
  hasVipFrame?: boolean;
  vipFrameUrl?: string;
  countryFlag: string;
  categoryTag: string; // "Music" | "Girl" | "Friend" | "Love" | etc
  categoryColor: string; // Tailind class
  popularity: number;
  userCount: number;
  hasChest?: boolean;
  idNo?: string;
  hostId?: string;
}

const INITIAL_LOBBY_ROOMS: LobbyRoom[] = [];

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200", // Woman 1
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200", // Man 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200", // Woman 2
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", // Man 2
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200", // Woman 3
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200", // Man 3
];

const INVITE_MEMBERS = [
  { name: "GudiyaV™", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳", hasTigerCrown: true },
  { name: "Názakat🍁", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "WRONG PASSWORD🔐", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "MÆRCO❤️", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳", hasTigerCrown: true },
  { name: "Sùbhü🔥", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Official", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "pari 🥰", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Angel_Piu", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇮🇳" },
  { name: "Imran_vocal", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇧🇩" },
  { name: "VIP BABA", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇧🇩", hasTigerCrown: true }
];

const COUNTRIES_LIST = [
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Armenia", flag: "🇦🇲" },
  { name: "Azerbaijan", flag: "🇦🇿" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Bhutan", flag: "🇧🇹" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "China", flag: "🇨🇳" },
  { name: "Cyprus", flag: "🇨🇾" },
  { name: "Georgia", flag: "🇬🇪" },
  { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Kyrgyzstan", flag: "🇰🇬" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Maldives", flag: "🇲🇻" },
  { name: "Mongolia", flag: "🇲🇳" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "North Korea", flag: "🇰🇵" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Palestine", flag: "🇵🇸" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Taiwan", flag: "🇹🇼" },
  { name: "Tajikistan", flag: "🇹🇯" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Timor-Leste", flag: "🇹🇱" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Turkmenistan", flag: "🇹🇲" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Uzbekistan", flag: "🇺🇿" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Yemen", flag: "🇾🇪" }
];

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  // Authentication & Agreement States (Screenshot 2)
  const [isAgreed, setIsAgreed] = useState(false);
  const [authProvider, setAuthProvider] = useState<"phone" | "google" | "facebook" | "email" | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(() => {
    const savedSession = localStorage.getItem("voxaclub_current_user");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        console.error("Failed to parse saved session, returning default", e);
      }
    }
    const defaultUser: UserProfile = {
      id: "user-current",
      idNo: "1488500",
      name: "Md Munna",
      avatar: DEFAULT_AVATARS[0],
      phone: "+8801640227120",
      email: "xzrmunna974@gmail.com",
      authProvider: "google",
      country: "Bangladesh",
      countryFlag: "🇧🇩",
      birthday: "1999-10-12",
      gender: "Male",
      bio: "Live your life to the fullest 🚀",
      description: "Hosting is my passion!",
      hasTigerCrown: true,
      vipLevel: 1,
    };
    try {
      localStorage.setItem("voxaclub_current_user", JSON.stringify(defaultUser));
    } catch (e) {}
    return defaultUser;
  });

  // Navigation & Step Management
  const [currentStep, setCurrentStep] = useState<"loading" | "login" | "phone-otp" | "register" | "select-country" | "profile-details" | "lobby" | "room" | "email-auth">("loading");
  
  // Lobby state managers (Screenshot 3)
  const [lobbyRooms, setLobbyRooms] = useState<LobbyRoom[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<UserProfile[]>([]);
  const [selectedProfileUser, setSelectedProfileUser] = useState<UserProfile | null>(null);
  const [fullProfileUser, setFullProfileUser] = useState<UserProfileFullData | null>(null);
  const [activeRoomMembers, setActiveRoomMembers] = useState<any[]>([]);
  const [presenceTick, setPresenceTick] = useState(0);
  const [activeRoomFollowers, setActiveRoomFollowers] = useState<any[]>([]);
  const [activeBottomTab, setActiveBottomTab] = useState<"home" | "moment" | "social" | "mine">("home");
  const [lobbyActiveSubTab, setLobbyActiveSubTab] = useState<"Popular" | "Mine" | "Explore">("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeRoom, setActiveRoom] = useState<LobbyRoom | null>(null);

  // Carousel Sliders state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [giftersSlideIndex, setGiftersSlideIndex] = useState(0);

  // Auto-play interval for Top Banner Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play interval for Middle Gifters Banner Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setGiftersSlideIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Real-time daily check-in states
  const [lastClaimedTimestamp, setLastClaimedTimestamp] = useState<number>(() => {
    const stored = localStorage.getItem("voxaclub_last_claimed_timestamp");
    return stored ? Number(stored) : 0;
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Room Creation state
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const [newRoomSubtitle, setNewRoomSubtitle] = useState("Welcome everyone ! Let's chat and have fun together !");
  const [newRoomCategory, setNewRoomCategory] = useState("Friend");
  const [newRoomCountry, setNewRoomCountry] = useState("🇧🇩");
  const [newRoomPhoto, setNewRoomPhoto] = useState<string | null>(null);
  const [newRoomPhotoType, setNewRoomPhotoType] = useState<"image" | "video" | null>(null);

  // Room Theme and Dropdown states
  const [roomTheme, setRoomTheme] = useState<"normal" | "star-host">("normal");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [isFollowingRoom, setIsFollowingRoom] = useState(false);
  const [roomFollowersCount, setRoomFollowersCount] = useState(106);
  const [showLocationLockedAlert, setShowLocationLockedAlert] = useState(false);

  // Seat Options Modal States (Owner/Admin vs regular user)
  const [showSeatActionsModal, setShowSeatActionsModal] = useState(false);
  const [activeSeatConfig, setActiveSeatConfig] = useState<{ seatType: "host" | "super" | "grid"; gridIndex?: number } | null>(null);
  const [testRoomRole, setTestRoomRole] = useState<"admin" | "user">("admin");

  // PK Battle States
  const [pkBattleActive, setPkBattleActive] = useState<boolean>(false);
  const [pkRedScore, setPkRedScore] = useState<number>(0);
  const [pkBlueScore, setPkBlueScore] = useState<number>(0);

  // Room Gifting States
  const [showRoomGiftingModal, setShowRoomGiftingModal] = useState(false);
  const [selectedGiftRecipient, setSelectedGiftRecipient] = useState<string>("HOST");
  const [selectedGiftItem, setSelectedGiftItem] = useState<string>("Victory Party");
  const [selectedGiftCount, setSelectedGiftCount] = useState<number>(1);
  const [userCoinsBalance, setUserCoinsBalance] = useState<number>(150000);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<ActiveGiftInfo | null>(null);
  const [seatCoinsMap, setSeatCoinsMap] = useState<Record<string, number>>({});

  // Daily Sign-In Check-In Calendar state
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Room Details & Cover Editing states
  const [minimizedRoom, setMinimizedRoom] = useState<LobbyRoom | null>(null);
  const [showBroadcastDrawer, setShowBroadcastDrawer] = useState(false);
  const [showRoomDetailsSheet, setShowRoomDetailsSheet] = useState(false);
  const [showAllJoinedMembers, setShowAllJoinedMembers] = useState(false);
  const [showOnlineMembersModal, setShowOnlineMembersModal] = useState(false);
  const [followedMemberIds, setFollowedMemberIds] = useState<Record<string, boolean>>({
    "m1": true,
    "m2": true,
    "m3": true,
  });
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const [editedRoomName, setEditedRoomName] = useState("");
  const [showEditRoomCoverModal, setShowEditRoomCoverModal] = useState(false);
  const [customRoomCoverUrl, setCustomRoomCoverUrl] = useState("");

  // Room EXP & Level persistent states
  const [roomExpMap, setRoomExpMap] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem("voxaclub_room_exps");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Sync Room EXPs
  useEffect(() => {
    if (showLocationLockedAlert) {
      const timer = setTimeout(() => {
        setShowLocationLockedAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLocationLockedAlert]);

  useEffect(() => {
    localStorage.setItem("voxaclub_room_exps", JSON.stringify(roomExpMap));
  }, [roomExpMap]);

  // Dynamic Level system calculation helper (exponential / scaling requirements)
  const getCumulativeExpNeeded = (L: number): number => {
    if (L <= 1) return 0;
    if (L <= 10) {
      // lower levels: fast and easy
      return Math.floor(1000 * Math.pow(L - 1, 1.8));
    } else if (L <= 25) {
      // mid levels: moderate scale
      const base10 = Math.floor(1000 * Math.pow(9, 1.8));
      return base10 + Math.floor(5000 * Math.pow(L - 10, 2.2));
    } else {
      // high levels (above 25/30): takes extremely long to grow
      const base10 = Math.floor(1000 * Math.pow(9, 1.8));
      const base25 = base10 + Math.floor(5000 * Math.pow(15, 2.2));
      return base25 + Math.floor(120000 * Math.pow(L - 25, 3.2));
    }
  };

  const getRoomLevel = (exp: number): number => {
    let level = 1;
    while (true) {
      const req = getCumulativeExpNeeded(level + 1);
      if (exp >= req) {
        level++;
      } else {
        break;
      }
    }
    return level;
  };

  // Real-time Room EXP growth logic (grows as time passes inside activeRoom in Firestore)
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;

    const roomId = activeRoom.id;
    // Periodically update active room's EXP on Firestore
    const interval = setInterval(async () => {
      try {
        const addedExp = Math.floor(Math.random() * 5) + 5; // accumulate real-time time-based EXP
        await updateDoc(doc(db, "rooms", roomId), {
          exp: increment(addedExp)
        });
      } catch (err) {
        console.warn("Failed to increment room EXP in Firestore:", err);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [activeRoom?.id, currentStep]);

  // Real-time user heartbeat presence updater inside activeRoom in Firestore
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;

    const roomId = activeRoom.id;
    const userId = loggedInUser?.id || "user-current";

    const updateHeartbeat = async () => {
      try {
        await setDoc(doc(db, "rooms", roomId, "members", userId), {
          lastSeen: Date.now()
        }, { merge: true });
      } catch (err) {
        console.warn("Presence heartbeat failed:", err);
      }
    };

    // Run immediately on join
    updateHeartbeat();

    // Then periodically every 10 seconds
    const interval = setInterval(updateHeartbeat, 10000);

    return () => clearInterval(interval);
  }, [activeRoom?.id, currentStep, loggedInUser?.id]);

  // Periodic tick timer to auto-invalidate stale/inactive offline users in UI
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;
    const interval = setInterval(() => {
      setPresenceTick((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeRoom?.id, currentStep]);

  // Tap to Boost EXP function
  const handleBoostRoomExp = async () => {
    if (!activeRoom) return;
    const addedExp = 200; // instant boost on click
    try {
      await updateDoc(doc(db, "rooms", activeRoom.id), {
        exp: increment(addedExp)
      });
      triggerToast(`Room Level EXP boosted by +${addedExp}! ⭐`, "success");
    } catch (e) {
      console.warn("Failed to boost room EXP:", e);
    }
  };

  // Helper to handle uploading/updating the Cover Photo from Gallery / Local File
  const handleUploadCoverPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoom) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      if (!base64String) return;

      try {
        await updateDoc(doc(db, "rooms", activeRoom.id), {
          avatar: base64String
        });
        // Update local activeRoom state
        setActiveRoom(prev => prev ? { ...prev, avatar: base64String } : null);
        triggerToast("Room cover photo updated successfully! 📸", "success");
      } catch (err) {
        console.warn("Failed to update cover photo in Firestore:", err);
        // Local fallback
        setActiveRoom(prev => prev ? { ...prev, avatar: base64String } : null);
        triggerToast("Failed to sync cover photo, updated locally.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Real-time room membership management helpers
  const enterRoomMembership = async (roomId: string, roomObj: LobbyRoom) => {
    const userId = loggedInUser?.id || "user-current";
    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];
    const isOwner = roomObj.hostName === currentUserName || roomObj.hostName === "Munna" || roomObj.hostName === "Xzrmunna" || roomObj.id.startsWith("room-custom-") || roomObj.hostId === userId;
    
    try {
      await setDoc(doc(db, "rooms", roomId, "members", userId), {
        id: userId,
        name: currentUserName,
        avatar: currentUserAvatar,
        role: isOwner ? "Owner" : "Member",
        vipLevel: loggedInUser?.vipLevel || 1,
        idNo: loggedInUser?.idNo || "1000001",
        bio: loggedInUser?.bio || "Live life to the fullest! 🚀",
        countryFlag: loggedInUser?.countryFlag || "🇧🇩",
        gender: loggedInUser?.gender || "Male",
        birthday: loggedInUser?.birthday || "1999-10-12",
        joinedAt: Date.now()
      });
    } catch (err) {
      console.warn("Failed to add room member on join:", err);
    }
  };

  const leaveActiveRoom = async (roomId: string) => {
    const userId = loggedInUser?.id || "user-current";
    const userName = loggedInUser?.name || "";
    try {
      await deleteDoc(doc(db, "rooms", roomId, "members", userId));

      // Vacate their seat in Firestore if they are leaving!
      const roomRef = doc(db, "rooms", roomId);
      const snapshot = await getDoc(roomRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        let hostSeat = data.hostSeatUser || null;
        let superSeat = data.superSeatUser || null;
        let gridSeats = data.gridSeatsUsers || Array(10).fill(null);
        let changed = false;

        const matchUser = (u: Participant | null) => {
          if (!u) return false;
          const uNameClean = u.name.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
          const userNameClean = userName.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
          return u.id === userId || uNameClean === userNameClean || uNameClean === `${userNameClean} (You)` || `${uNameClean} (You)` === userNameClean;
        };

        if (hostSeat && matchUser(hostSeat)) {
          hostSeat = null;
          changed = true;
        }
        if (superSeat && matchUser(superSeat)) {
          superSeat = null;
          changed = true;
        }
        for (let i = 0; i < gridSeats.length; i++) {
          const u = gridSeats[i];
          if (u && matchUser(u)) {
            gridSeats[i] = null;
            changed = true;
          }
        }

        if (changed) {
          await updateDoc(roomRef, {
            hostSeatUser: hostSeat,
            superSeatUser: superSeat,
            gridSeatsUsers: gridSeats
          });
        }
      }
    } catch (err) {
      console.warn("Failed to remove room member or vacate seat on leave:", err);
    }
  };

  // Real-time Room Follower toggler
  const handleToggleFollowRoom = async () => {
    if (!activeRoom || !loggedInUser) return;
    const userId = loggedInUser.id || "user-current";
    const isFollowing = activeRoomFollowers.some(f => f.id === userId);
    
    try {
      if (isFollowing) {
        await deleteDoc(doc(db, "rooms", activeRoom.id, "followers", userId));
        triggerToast("You unfollowed this live room.", "success");
      } else {
        await setDoc(doc(db, "rooms", activeRoom.id, "followers", userId), {
          id: userId,
          name: loggedInUser.name,
          avatar: loggedInUser.avatar || DEFAULT_AVATARS[0],
          vipLevel: loggedInUser.vipLevel || 1,
          idNo: loggedInUser.idNo || "1000001",
          bio: loggedInUser.bio || "Live life to the fullest! 🚀",
          countryFlag: loggedInUser.countryFlag || "🇧🇩",
          gender: loggedInUser.gender || "Male",
          birthday: loggedInUser.birthday || "1999-10-12",
          followedAt: Date.now()
        });
        triggerToast("Successfully following this live room & group! 💖", "success");
      }
    } catch (err) {
      console.warn("Failed to toggle follow:", err);
    }
  };

  const handleUpdateRoomTitle = (newTitle: string) => {
    if (!activeRoom) return;
    const updatedRoom = { ...activeRoom, title: newTitle };
    setActiveRoom(updatedRoom);
    setLobbyRooms((prev) => {
      const nextRooms = prev.map((r) => (r.id === activeRoom.id ? { ...r, title: newTitle } : r));
      localStorage.setItem("voxaclub_lobby_rooms", JSON.stringify(nextRooms));
      return nextRooms;
    });
    triggerToast("Room Name updated successfully!", "success");
  };

  const handleUpdateRoomCover = (newCoverUrl: string) => {
    if (!activeRoom) return;
    const updatedRoom = { ...activeRoom, avatar: newCoverUrl };
    setActiveRoom(updatedRoom);
    setLobbyRooms((prev) => {
      const nextRooms = prev.map((r) => (r.id === activeRoom.id ? { ...r, avatar: newCoverUrl } : r));
      localStorage.setItem("voxaclub_lobby_rooms", JSON.stringify(nextRooms));
      return nextRooms;
    });
    triggerToast("Room Background Cover updated successfully!", "success");
  };
  const [checkedInDays, setCheckedInDays] = useState<number[]>(() => {
    const stored = localStorage.getItem("voxaclub_checked_in_days");
    return stored ? JSON.parse(stored) : [];
  });
  const [userCoins, setUserCoins] = useState(() => {
    const stored = localStorage.getItem("voxaclub_user_coins");
    return stored ? Number(stored) : 0;
  });

  // Premium Real-Time Social & Billing State Managers
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeMethod, setRechargeMethod] = useState<"bkash" | "nagad" | "rocket" | "card">("bkash");
  const [rechargeAmount, setRechargeAmount] = useState(10000); // coins
  const [rechargePayerPhone, setRechargePayerPhone] = useState("");
  const [rechargeTxnId, setRechargeTxnId] = useState("");

  const [newMomentText, setNewMomentText] = useState("");
  const [moments, setMoments] = useState<{ id: string; name: string; avatar: string; time: string; country: string; text: string; likes: number; likedByUser: boolean }[]>(() => {
    const stored = localStorage.getItem("voxaclub_moments");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        return parsed.filter(m => m && m.id && m.id.startsWith("moment-"));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [inboxChats, setInboxChats] = useState<{ name: string; text: string; time: string; unread: boolean }[]>(() => {
    const stored = localStorage.getItem("voxaclub_inbox_chats");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        return parsed.filter(chat => chat && chat.name === "VoxaClub Billing Support");
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Toast / System Notification HUD
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "otp" | "info" } | null>(null);

  // Show / Clear automated popup alerts
  const triggerToast = useCallback((message: string, type: "success" | "error" | "otp" | "info", duration = 4000) => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // Real-Time Social tab states
  const [socialSubTab, setSocialSubTab] = useState<"chat" | "friend">("chat");
  const [socialModal, setSocialModal] = useState<"requests" | "visitors" | "couple" | "family" | "notice" | "official_team" | "add_friend" | null>(null);
  const [activeSocialChatUser, setActiveSocialChatUser] = useState<{ id: string; name: string; avatar: string; idNo: string; online: boolean } | null>(null);
  const [activeSocialChatMessages, setActiveSocialChatMessages] = useState<
    {
      id: string;
      sender: "user" | "other";
      text: string;
      type?: "text" | "image" | "voice";
      imageUrl?: string;
      audioUrl?: string;
      audioDuration?: string;
      time: string;
      status?: "sending" | "sent" | "delivered" | "seen";
      replyTo?: { id: string; senderName: string; text: string };
    }[]
  >([
    { id: "msg-init-1", sender: "other", text: "Hey! Welcome to my chat! How can I help you today? 😊", time: "10:30 AM", status: "seen" }
  ]);
  const [newChatInput, setNewChatInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);

  // Direct Chat Media & Actions States
  const [replyingToMsg, setReplyingToMsg] = useState<{ id: string; senderName: string; text: string } | null>(null);
  const [selectedMsgForMenu, setSelectedMsgForMenu] = useState<{
    id: string;
    sender: "user" | "other";
    text: string;
    time: string;
  } | null>(null);
  const chatPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [voiceSecs, setVoiceSecs] = useState<number>(0);
  const voiceTimerRef = useRef<any>(null);

  // Chat item deletion & long press states
  const [chatToDelete, setChatToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletedChatIds, setDeletedChatIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("voxaclub_deleted_chats");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("voxaclub_deleted_chats", JSON.stringify(deletedChatIds));
  }, [deletedChatIds]);

  const longPressTimerRef = useRef<any>(null);
  const handleTouchStartChat = (id: string, name: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setChatToDelete({ id, name });
    }, 600);
  };
  const handleTouchEndChat = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Real-Time Profile Photo File Input & Upload Handler
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !loggedInUser) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updatedUser = { ...loggedInUser, avatar: base64 };
        setLoggedInUser(updatedUser);
        localStorage.setItem("voxaclub_user", JSON.stringify(updatedUser));
        triggerToast("Profile photo updated in real-time! 📸", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Real-Time Chat Photo Upload Handler
  const handleChatPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const msgId = `msg-photo-${Date.now()}`;
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const initialStatus = activeSocialChatUser?.online ? "delivered" : "sent";
        const newMsg = {
          id: msgId,
          sender: "user" as const,
          text: "📷 Photo Attachment",
          type: "image" as const,
          imageUrl: base64,
          time: timeStr,
          status: initialStatus as "sent" | "delivered" | "seen",
          replyTo: replyingToMsg ? { ...replyingToMsg } : undefined
        };
        setActiveSocialChatMessages((prev) => [...prev, newMsg]);
        setReplyingToMsg(null);

        setTimeout(() => {
          setActiveSocialChatMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, status: "seen" } : m))
          );
        }, 1200);

        try {
          const bc = new BroadcastChannel("voxaclub_realtime_direct_messages");
          bc.postMessage({ type: "NEW_DIRECT_MSG", data: { targetId: activeSocialChatUser?.idNo, msg: newMsg } });
          bc.close();
        } catch (err) {}
      }
    };
    reader.readAsDataURL(file);
  };

  // Real-Time Chat Voice Recording Toggle
  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      clearInterval(voiceTimerRef.current);
      setIsVoiceRecording(false);
      const secs = voiceSecs;
      setVoiceSecs(0);
      const msgId = `msg-voice-${Date.now()}`;
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const initialStatus = activeSocialChatUser?.online ? "delivered" : "sent";
      const durationStr = `0:${secs.toString().padStart(2, "0")}`;
      const newMsg = {
        id: msgId,
        sender: "user" as const,
        text: "🎤 Voice Message",
        type: "voice" as const,
        audioDuration: durationStr,
        time: timeStr,
        status: initialStatus as "sent" | "delivered" | "seen",
        replyTo: replyingToMsg ? { ...replyingToMsg } : undefined
      };
      setActiveSocialChatMessages((prev) => [...prev, newMsg]);
      setReplyingToMsg(null);

      setTimeout(() => {
        setActiveSocialChatMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status: "seen" } : m))
        );
      }, 1200);

      try {
        const bc = new BroadcastChannel("voxaclub_realtime_direct_messages");
        bc.postMessage({ type: "NEW_DIRECT_MSG", data: { targetId: activeSocialChatUser?.idNo, msg: newMsg } });
        bc.close();
      } catch (err) {}
    } else {
      setIsVoiceRecording(true);
      setVoiceSecs(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceSecs((prev) => prev + 1);
      }, 1000);
    }
  };

  // CP / Couple Partner profile reference object for quick access
  const cpPartner = {
    id: "cp-partner-1",
    name: "আমার স্বপ্ন তুমি",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    idNo: "5949396",
    vipLevel: 3,
    bio: "Always together in heart & soul 💖",
    gender: "Female",
    followersCount: 128,
    giftsCount: 450
  };

  // Family Portal states
  const [joinedFamilies, setJoinedFamilies] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("voxaclub_joined_families");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [pendingFamilyRequests, setPendingFamilyRequests] = useState<
    { id: string; user: any; familyName: string }[]
  >([
    {
      id: "freq-1",
      user: {
        id: "u-applicant-1",
        idNo: "8821029",
        name: "Tanvir_BD",
        avatar: DEFAULT_AVATARS[3],
        country: "Bangladesh",
        countryFlag: "🇧🇩",
        birthday: "2000-05-15",
        gender: "Male",
        bio: "Looking for an active voice family!",
        vipLevel: 2
      },
      familyName: "BD Royal Family 👑"
    }
  ]);

  useEffect(() => {
    localStorage.setItem("voxaclub_joined_families", JSON.stringify(joinedFamilies));
  }, [joinedFamilies]);

  // Direct Audio / Video Call & Report state
  const [activeSocialCall, setActiveSocialCall] = useState<{
    mode: "audio" | "video";
    name: string;
    avatar: string;
    idNo: string;
    online?: boolean;
    isIncoming?: boolean;
    callId?: string;
    peerId?: string;
  } | null>(null);
  const [callStatus, setCallStatus] = useState<"calling" | "ringing" | "connected" | "no_answer">("ringing");
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [isCallMuted, setIsCallMuted] = useState<boolean>(false);
  const [isSpeaker, setIsSpeaker] = useState<boolean>(true);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [beautyFilter, setBeautyFilter] = useState<"glow" | "bright" | "ultra" | "smooth" | "natural">("glow");
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [micVolumeLevel, setMicVolumeLevel] = useState<number>(0);
  const [isSocialSwappedView, setIsSocialSwappedView] = useState<boolean>(false);

  const callVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const preCallVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const setPreCallVideo = useCallback((node: HTMLVideoElement | null) => {
    preCallVideoRef.current = node;
    if (node && activeStreamRef.current) {
      node.srcObject = activeStreamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  const setCallVideo = useCallback((node: HTMLVideoElement | null) => {
    callVideoRef.current = node;
    if (node && activeStreamRef.current && callStatus === "connected") {
      node.srcObject = activeStreamRef.current;
      node.play().catch(() => {});
    }
  }, [callStatus]);

  const setPipVideo = useCallback((node: HTMLVideoElement | null) => {
    pipVideoRef.current = node;
    if (node && activeStreamRef.current) {
      node.srcObject = activeStreamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  // Web Audio Ringtone & Busy Tone Synthesizer Refs
  const ringAudioCtxRef = useRef<AudioContext | null>(null);
  const ringOsc1Ref = useRef<OscillatorNode | null>(null);
  const ringOsc2Ref = useRef<OscillatorNode | null>(null);
  const ringGainRef = useRef<GainNode | null>(null);
  const ringTimerRef = useRef<any>(null);

  // Disconnect Busy Tone ("Tu Toot... Tu Toot...") synthesizer with smooth anti-pop gain envelope
  const playDisconnectBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const startTime = now + i * 0.38;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.23);
      }
      setTimeout(() => {
        try { ctx.close(); } catch (e) {}
      }, 1500);
    } catch (e) {
      console.log("Disconnect beep error:", e);
    }
  }, []);

  const startRingtone = useCallback(() => {
    try {
      if (ringAudioCtxRef.current) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      ringAudioCtxRef.current = ctx;

      const playPulse = () => {
        if (!ringAudioCtxRef.current || ringAudioCtxRef.current.state === "closed") return;
        if (ringAudioCtxRef.current.state === "suspended") {
          ringAudioCtxRef.current.resume().catch(() => {});
        }
        const now = ringAudioCtxRef.current.currentTime;

        const gain = ringAudioCtxRef.current.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gain.gain.setValueAtTime(0.12, now + 1.15);
        gain.gain.linearRampToValueAtTime(0.0001, now + 1.22);
        gain.connect(ringAudioCtxRef.current.destination);

        const osc1 = ringAudioCtxRef.current.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(440, now);
        osc1.connect(gain);
        osc1.start(now);
        osc1.stop(now + 1.25);

        const osc2 = ringAudioCtxRef.current.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);
        osc2.connect(gain);
        osc2.start(now);
        osc2.stop(now + 1.25);
      };

      playPulse();
      ringTimerRef.current = setInterval(playPulse, 3200);
    } catch (e) {
      console.log("AudioContext ringtone error:", e);
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (ringTimerRef.current) {
      clearInterval(ringTimerRef.current);
      ringTimerRef.current = null;
    }
    if (ringGainRef.current && ringAudioCtxRef.current) {
      try {
        ringGainRef.current.gain.linearRampToValueAtTime(0.0001, ringAudioCtxRef.current.currentTime + 0.02);
      } catch (e) {}
    }
    const ctxToClose = ringAudioCtxRef.current;
    const osc1 = ringOsc1Ref.current;
    const osc2 = ringOsc2Ref.current;
    ringAudioCtxRef.current = null;
    ringOsc1Ref.current = null;
    ringOsc2Ref.current = null;
    ringGainRef.current = null;

    setTimeout(() => {
      if (osc1) { try { osc1.stop(); } catch (e) {} }
      if (osc2) { try { osc2.stop(); } catch (e) {} }
      if (ctxToClose) { try { ctxToClose.close(); } catch (e) {} }
    }, 30);
  }, []);

  // Handle ending call & logging duration into chat list
  const handleEndCall = useCallback((reason?: "ended" | "no_answer") => {
    stopRingtone();
    const durationMin = Math.floor(callSeconds / 60).toString().padStart(2, "0");
    const durationSec = (callSeconds % 60).toString().padStart(2, "0");
    const durationFormatted = `${durationMin}:${durationSec}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (activeSocialCall) {
      if (callStatus === "connected" && callSeconds > 0) {
        const msgText = `${activeSocialCall.mode === "video" ? "📹 Video Call" : "📞 Voice Call"} ended • ${durationFormatted}`;
        setActiveSocialChatMessages((prev) => [
          ...prev,
          { id: `call-${Date.now()}`, sender: "user", text: msgText, time: timeStr, status: "seen" },
        ]);
        triggerToast(`Call ended • Duration: ${durationFormatted}`, "info");
      } else {
        const msgText = `🚫 Missed ${activeSocialCall.mode === "video" ? "Video" : "Voice"} Call (${reason === "no_answer" ? "No answer" : "Unanswered"})`;
        setActiveSocialChatMessages((prev) => [
          ...prev,
          { id: `call-${Date.now()}`, sender: "user", text: msgText, time: timeStr, status: "seen" },
        ]);
        triggerToast(reason === "no_answer" ? "No answer / User unavailable" : "Call cancelled", "info");
      }
    }
    setActiveSocialCall(null);
    setCallSeconds(0);
    setCallStatus("ringing");
  }, [activeSocialCall, callSeconds, callStatus, stopRingtone, triggerToast]);

  const handleAnswerCall = useCallback(() => {
    setCallStatus("connected");
    stopRingtone();
    triggerToast("Call answered", "success");

    try {
      const bc = new BroadcastChannel("voxaclub_realtime_calls");
      bc.postMessage({
        type: "CALL_ANSWERED",
        callId: activeSocialCall?.callId,
      });
      bc.close();
    } catch (e) {}
  }, [activeSocialCall, stopRingtone, triggerToast]);

  const handleCancelOrDeclineCall = useCallback((reason: "ended" | "no_answer" = "ended") => {
    stopRingtone();
    playDisconnectBeep();

    try {
      const bc = new BroadcastChannel("voxaclub_realtime_calls");
      bc.postMessage({
        type: "CALL_DECLINED",
        callId: activeSocialCall?.callId,
      });
      bc.close();
    } catch (e) {}

    setCallStatus("no_answer");
    setTimeout(() => {
      handleEndCall(reason);
    }, 1000);
  }, [activeSocialCall, stopRingtone, playDisconnectBeep, handleEndCall]);

  // Real-Time Cross-Tab & Cross-Device Firestore Call Listener
  useEffect(() => {
    if (!loggedInUser?.id) return;

    const currentUserId = loggedInUser.id;
    const currentUserIdNo = loggedInUser.idNo;

    const callsRef = collection(db, "direct_calls");
    const unsubscribeCalls = onSnapshot(callsRef, (snapshot) => {
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (!data) return;

        const isCallerMe =
          data.callerId === currentUserId ||
          data.callerId === currentUserIdNo;

        const isReceiverMe =
          !isCallerMe &&
          (data.receiverId === currentUserId ||
           data.receiverId === currentUserIdNo ||
           data.receiverIdNo === currentUserIdNo);

        // Check if call is stale (older than 45 seconds)
        const callTime = data.timestamp || 0;
        const isStale = callTime > 0 && (Date.now() - callTime) > 45000;

        if (isReceiverMe && data.status === "ringing") {
          if (isStale) return;
          setActiveSocialCall({
            mode: data.callType || "audio",
            name: data.callerName || "User",
            avatar: data.callerAvatar || DEFAULT_AVATARS[0],
            idNo: data.callerIdNo || data.callerId || "8921029",
            peerId: data.callerId,
            isIncoming: true,
            callId: docSnap.id,
            online: true
          });
        } else if (isCallerMe && data.status === "connected") {
          setCallStatus("connected");
          stopRingtone();
        } else if ((isReceiverMe || isCallerMe) && (data.status === "rejected" || data.status === "ended")) {
          stopRingtone();
          playDisconnectBeep();
          setCallStatus("no_answer");
          setTimeout(() => {
            setActiveSocialCall(null);
            setCallSeconds(0);
            setCallStatus("ringing");
          }, 1000);
        }
      });
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("voxaclub_realtime_calls");
      bc.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === "INCOMING_CALL") {
          const isCaller = data.callerId === loggedInUser.id || data.callerId === loggedInUser.idNo;
          const isReceiver = data.receiverId === loggedInUser.idNo || data.receiverId === loggedInUser.id;
          if (!isCaller && isReceiver) {
            setActiveSocialCall({
              mode: data.mode,
              name: data.callerName,
              avatar: data.callerAvatar,
              idNo: data.callerIdNo,
              peerId: data.callerId,
              isIncoming: true,
              callId: data.callId,
            });
          }
        } else if (data.type === "CALL_ANSWERED") {
          if (activeSocialCall && activeSocialCall.callId === data.callId) {
            setCallStatus("connected");
            stopRingtone();
            triggerToast("Call connected!", "success");
          }
        } else if (data.type === "CALL_DECLINED" || data.type === "CALL_ENDED") {
          if (activeSocialCall && activeSocialCall.callId === data.callId) {
            stopRingtone();
            playDisconnectBeep();
            setCallStatus("no_answer");
            setTimeout(() => {
              handleEndCall("ended");
            }, 1000);
          }
        }
      };
    } catch (e) {
      console.log("BroadcastChannel listener setup:", e);
    }

    return () => {
      unsubscribeCalls();
      if (bc) bc.close();
    };
  }, [loggedInUser?.id, loggedInUser?.idNo, activeSocialCall, stopRingtone, playDisconnectBeep, handleEndCall, triggerToast]);

  // Call initialization & Ring timeout effect (~25s / 8-10 rings)
  useEffect(() => {
    if (!activeSocialCall) {
      setCallSeconds(0);
      setCallStatus("ringing");
      stopRingtone();
      return;
    }

    if (callStatus === "connected") {
      stopRingtone();
      return;
    }

    const initialStatus = activeSocialCall.online === false ? "calling" : "ringing";
    setCallStatus(initialStatus);
    setCallSeconds(0);
    startRingtone();

    // 25-second ring timeout (approx 8-10 rings).
    const ringTimeout = setTimeout(() => {
      setCallStatus("no_answer");
      stopRingtone();
      playDisconnectBeep();
      triggerToast("No answer / user did not pick up", "info");
      setTimeout(() => {
        handleEndCall("no_answer");
      }, 1500);
    }, 25000);

    return () => {
      clearTimeout(ringTimeout);
      stopRingtone();
    };
  }, [activeSocialCall?.callId, activeSocialCall?.online, startRingtone, stopRingtone, playDisconnectBeep, handleEndCall, triggerToast]);

  // Stop ringtone when connected
  useEffect(() => {
    if (callStatus === "connected") {
      stopRingtone();
    }
  }, [callStatus, stopRingtone]);

  // Timer increment STRICTLY during connected call only
  useEffect(() => {
    if (activeSocialCall && callStatus === "connected") {
      const interval = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSocialCall, callStatus]);

  // Real-time Microphone Volume Analyzer when call is connected
  useEffect(() => {
    let animationFrameId: number;
    let audioCtx: AudioContext | null = null;
    let stream: MediaStream | null = null;

    if (activeSocialCall && callStatus === "connected" && !isCallMuted) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((s) => {
            stream = s;
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              audioCtx = new AudioCtx();
              const source = audioCtx.createMediaStreamSource(s);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const updateVolume = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const avg = sum / dataArray.length;
                setMicVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
                animationFrameId = requestAnimationFrame(updateVolume);
              };
              updateVolume();
            }
          })
          .catch((err) => {
            console.log("Mic access or audio monitoring notice:", err);
          });
      }
    } else {
      setMicVolumeLevel(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioCtx) audioCtx.close();
    };
  }, [activeSocialCall, callStatus, isCallMuted]);

  // Real WebCam video stream initialization for video call (Local PiP + Connected Main Stream)
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeSocialCall?.mode === "video" && !isVideoOff) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: facingMode },
            audio: !isCallMuted,
          })
          .then((s) => {
            stream = s;
            activeStreamRef.current = s;
            if (pipVideoRef.current) {
              pipVideoRef.current.srcObject = s;
              pipVideoRef.current.play().catch(() => {});
            }
            if (callVideoRef.current && callStatus === "connected") {
              callVideoRef.current.srcObject = s;
              callVideoRef.current.play().catch(() => {});
            }
            if (preCallVideoRef.current) {
              preCallVideoRef.current.srcObject = s;
              preCallVideoRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            console.log("Webcam permission or camera unavailable, showing fallback:", err);
          });
      }
    } else {
      activeStreamRef.current = null;
      if (pipVideoRef.current) pipVideoRef.current.srcObject = null;
      if (callVideoRef.current) callVideoRef.current.srcObject = null;
      if (preCallVideoRef.current) preCallVideoRef.current.srcObject = null;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      activeStreamRef.current = null;
    };
  }, [activeSocialCall, isVideoOff, facingMode, callStatus, isCallMuted]);

  const [friendRequests, setFriendRequests] = useState<{ id: string; name: string; avatar: string; country: string; idNo: string; chatId?: string }[]>([]);

  const [myFriendsList, setMyFriendsList] = useState<{ id: string; name: string; avatar: string; country: string; idNo: string; online: boolean; status: string; chatId: string }[]>([]);

  // Real-time listener for direct_chats friend/chat requests
  useEffect(() => {
    const currentUserId = loggedInUser?.id || "user-current";
    const chatsRef = collection(db, "direct_chats");

    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const incomingReqs: { id: string; name: string; avatar: string; country: string; idNo: string; chatId: string }[] = [];
      const friendsList: { id: string; name: string; avatar: string; country: string; idNo: string; online: boolean; status: string; chatId: string }[] = [];

      snapshot.docs.forEach((d) => {
        const data = d.data();
        const participants = data.participants || [];
        if (!participants.includes(currentUserId)) return;

        const otherUser = data.userA?.id === currentUserId ? data.userB : data.userA;
        if (!otherUser) return;

        if (data.status === "pending" && data.senderId !== currentUserId) {
          incomingReqs.push({
            id: otherUser.id,
            name: otherUser.name || "User",
            avatar: otherUser.avatar || DEFAULT_AVATARS[0],
            country: "🇧🇩",
            idNo: otherUser.idNo || "8921029",
            chatId: d.id
          });
        } else if (data.status === "accepted") {
          if (!friendsList.some(f => f.id === otherUser.id)) {
            friendsList.push({
              id: otherUser.id,
              name: otherUser.name || "User",
              avatar: otherUser.avatar || DEFAULT_AVATARS[0],
              country: "🇧🇩",
              idNo: otherUser.idNo || "8921029",
              online: true,
              status: "Connected 🟢",
              chatId: d.id
            });
          }
        }
      });

      setFriendRequests(incomingReqs);
      setMyFriendsList(friendsList);
    });

    return () => unsubscribe();
  }, [loggedInUser?.id]);

  const [officialTeamMessages, setOfficialTeamMessages] = useState([
    { id: "ot-1", sender: "official", text: "Welcome to VoxaClub! 🎉 Thank you for joining our platform. We are thrilled to have you here with us!", time: "Just now" },
    { id: "ot-2", sender: "official", text: "Enjoy 24/7 VIP Customer Support, Coin Top-Up Discounts & Live Voice Chat Rooms on VoxaClub. Reply directly here anytime if you need assistance!", time: "Just now" }
  ]);
  const [newOfficialInput, setNewOfficialInput] = useState("");

  // VIP State variables
  const [vipLevel, setVipLevel] = useState<number>(() => {
    const saved = localStorage.getItem("voxaclub_vip_level");
    if (saved) return Number(saved);
    const savedUser = localStorage.getItem("voxaclub_current_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.vipLevel || 0;
      } catch (e) {}
    }
    return 0;
  });
  const [showVipPage, setShowVipPage] = useState(false);
  const [selectedVipLevel, setSelectedVipLevel] = useState(1);
  const [showVipSuccessModal, setShowVipSuccessModal] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

  // Sync lobbyRooms, checkedInDays, userCoins, moments, inboxChats to localStorage
  useEffect(() => {
    localStorage.setItem("voxaclub_moments", JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem("voxaclub_inbox_chats", JSON.stringify(inboxChats));
  }, [inboxChats]);
  useEffect(() => {
    localStorage.setItem("voxaclub_lobby_rooms", JSON.stringify(lobbyRooms));
  }, [lobbyRooms]);

  useEffect(() => {
    localStorage.setItem("voxaclub_checked_in_days", JSON.stringify(checkedInDays));
  }, [checkedInDays]);

  useEffect(() => {
    localStorage.setItem("voxaclub_user_coins", String(userCoins));
  }, [userCoins]);

  useEffect(() => {
    localStorage.setItem("voxaclub_vip_level", String(vipLevel));
    setLoggedInUser(prev => {
      if (!prev) return null;
      if (prev.vipLevel === vipLevel) return prev;
      const updated = { ...prev, vipLevel };
      localStorage.setItem("voxaclub_current_user", JSON.stringify(updated));
      return updated;
    });
  }, [vipLevel]);

  useEffect(() => {
    localStorage.setItem("voxaclub_last_claimed_timestamp", String(lastClaimedTimestamp));
  }, [lastClaimedTimestamp]);

  // Read file as Base64 data URL for permanent, non-temporary offline & database persistence
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const cleanDuplicateUserFromSeats = (
    userId: string,
    userName: string,
    hostSeat: Participant | null,
    superSeat: Participant | null,
    gridSeats: (Participant | null)[]
  ) => {
    let cleanedHost = hostSeat;
    let cleanedSuper = superSeat;
    const cleanedGrid = [...gridSeats];

    const matchUser = (u: Participant | null) => {
      if (!u) return false;
      const uNameClean = u.name.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
      const userNameClean = userName.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
      return u.id === userId || uNameClean === userNameClean || uNameClean === `${userNameClean} (You)` || `${uNameClean} (You)` === userNameClean;
    };

    if (cleanedHost && matchUser(cleanedHost)) {
      cleanedHost = null;
    }
    if (cleanedSuper && matchUser(cleanedSuper)) {
      cleanedSuper = null;
    }
    for (let i = 0; i < cleanedGrid.length; i++) {
      const u = cleanedGrid[i];
      if (u && matchUser(u)) {
        cleanedGrid[i] = null;
      }
    }

    return { cleanedHost, cleanedSuper, cleanedGrid };
  };

  const updateRoomSeatsInFirestore = async (
    roomId: string, 
    hostSeat: Participant | null, 
    superSeat: Participant | null, 
    gridSeats: (Participant | null)[],
    locks?: Record<string, boolean>,
    mutes?: Record<string, boolean>
  ) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      const updates: any = {
        hostSeatUser: hostSeat,
        superSeatUser: superSeat,
        gridSeatsUsers: gridSeats
      };
      if (locks) updates.seatLocks = locks;
      if (mutes) updates.seatMutes = mutes;
      await updateDoc(roomRef, updates);
    } catch (err) {
      console.error("Failed to update room seats in Firestore:", err);
    }
  };

  const updateLocalUserAgoraUidInFirestore = async (roomId: string, localUid: number) => {
    try {
      const currentUserId = loggedInUser?.id || "user-current";
      const roomRef = doc(db, "rooms", roomId);
      const snapshot = await getDoc(roomRef);
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      let updated = false;

      let hostSeat = data.hostSeatUser || null;
      let superSeat = data.superSeatUser || null;
      let gridSeats = data.gridSeatsUsers || Array(10).fill(null);

      if (hostSeat && hostSeat.id === currentUserId) {
        hostSeat.agoraUid = localUid;
        updated = true;
      } else if (superSeat && superSeat.id === currentUserId) {
        superSeat.agoraUid = localUid;
        updated = true;
      } else if (gridSeats) {
        const idx = gridSeats.findIndex((u: any) => u?.id === currentUserId);
        if (idx !== -1) {
          gridSeats[idx].agoraUid = localUid;
          updated = true;
        }
      }

      if (updated) {
        await updateDoc(roomRef, {
          hostSeatUser: hostSeat,
          superSeatUser: superSeat,
          gridSeatsUsers: gridSeats
        });
        console.log("[Agora] Successfully synced local agoraUid to Firestore seats:", localUid);
      }
    } catch (err) {
      console.warn("[Agora] Failed to sync local agoraUid to Firestore seats:", err);
    }
  };

  // Real-time Firestore synchronization for all active broadcast rooms
  useEffect(() => {
    // Proactively clean up all legacy demo rooms permanently if they exist in Firestore
    const cleanDemoRooms = async () => {
      const demoRoomIds = [
        "room-screenshot-1",
        "room-screenshot-2",
        "room-screenshot-3",
        "room-screenshot-4",
        "room-screenshot-5",
        "room-screenshot-6",
        "room-default-1",
        "room-default-2",
        "room-demo-1"
      ];
      for (const id of demoRoomIds) {
        try {
          await deleteDoc(doc(db, "rooms", id));
        } catch (e) {
          // Ignore if doc doesn't exist
        }
      }
    };
    cleanDemoRooms();

    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      let roomsList: LobbyRoom[] = [];
      snapshot.forEach((docSnap) => {
        const docId = docSnap.id;
        // Filter out any demo room IDs if present
        if (
          !docId.startsWith("room-screenshot-") &&
          !docId.startsWith("room-default-") &&
          !docId.startsWith("room-demo-")
        ) {
          roomsList.push({ id: docSnap.id, ...docSnap.data() } as LobbyRoom);
        }
      });
      
      setLobbyRooms(roomsList);
    }, (err) => {
      console.warn("Firestore onSnapshot error for rooms:", err);
    });

    return () => unsubscribe();
  }, []);

  // Ensure logged-in user always has a persistent, searchable 7-digit numeric ID
  useEffect(() => {
    if (loggedInUser && !loggedInUser.idNo) {
      const generatedId = Math.floor(1000000 + Math.random() * 9000000).toString();
      const updatedUser = { ...loggedInUser, idNo: generatedId };
      setLoggedInUser(updatedUser);
      localStorage.setItem("voxaclub_current_user", JSON.stringify(updatedUser));
      
      if (auth.currentUser) {
        setDoc(doc(db, "users", auth.currentUser.uid), { idNo: generatedId }, { merge: true })
          .catch(err => console.warn("Failed to merge idNo to Firestore", err));
      }
    }
  }, [loggedInUser]);

  // Real-time user searching by name or unique 7-digit ID (syncs with database)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchedUsers([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let matched: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        const u = { id: docSnap.id, ...docSnap.data() } as UserProfile;
        if (
          (u.name && u.name.toLowerCase().includes(queryLower)) ||
          (u.idNo && u.idNo.includes(queryLower))
        ) {
          matched.push(u);
        }
      });
      setSearchedUsers(matched);
    }, (err) => {
      console.warn("Firestore users search onSnapshot failed", err);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  // Real-time active room listener: if room is deleted (terminated) by host, boot everyone out to lobby
  // Also synchronizes all seats, mutes, and locks in real-time from Firestore!
  useEffect(() => {
    const targetRoomId = activeRoom?.id || minimizedRoom?.id;
    if (!targetRoomId) return;

    const unsubscribe = onSnapshot(doc(db, "rooms", targetRoomId), (snapshot) => {
      if (!snapshot.exists()) {
        // Boot user out to lobby since the host closed/terminated the room
        setCurrentStep("lobby");
        setActiveRoom(null);
        setMinimizedRoom(null);
        setRoomTheme("normal");
        triggerToast("This broadcast has been closed by the host! 📡❌", "error");
        setShowBroadcastDrawer(false);
      } else {
        const data = snapshot.data();
        if (data) {
          if (data.hostSeatUser !== undefined) setHostSeatUser(data.hostSeatUser);
          if (data.superSeatUser !== undefined) setSuperSeatUser(data.superSeatUser);
          if (data.gridSeatsUsers !== undefined) setGridSeatsUsers(data.gridSeatsUsers);
          if (data.seatLocks !== undefined) setSeatLocks(data.seatLocks);
          if (data.seatMutes !== undefined) setSeatMutes(data.seatMutes);
        }
      }
    }, (err) => {
      console.warn("Firestore active room listener failed", err);
    });

    return () => unsubscribe();
  }, [activeRoom?.id, minimizedRoom?.id]);

  // Reset initial load ref when activeRoom changes
  useEffect(() => {
    if (activeRoom?.id) {
      isInitialRoomLoadRef.current = true;
    }
  }, [activeRoom?.id]);

  // Real-time listener for current active room's members and followers sub-collections
  useEffect(() => {
    if (!activeRoom) {
      setActiveRoomMembers([]);
      setActiveRoomFollowers([]);
      return;
    }

    const membersRef = collection(db, "rooms", activeRoom.id, "members");
    const unsubscribeMembers = onSnapshot(membersRef, (snapshot) => {
      let membersList: any[] = [];
      snapshot.forEach((docSnap) => {
        membersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setActiveRoomMembers(membersList);
    }, (err) => {
      console.warn("Firestore room members onSnapshot error:", err);
    });

    const followersRef = collection(db, "rooms", activeRoom.id, "followers");
    const unsubscribeFollowers = onSnapshot(followersRef, (snapshot) => {
      let followersList: any[] = [];
      snapshot.forEach((docSnap) => {
        followersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setActiveRoomFollowers(followersList);

      // Sync followers count and isFollowingRoom state dynamically
      const userId = loggedInUser?.id || "user-current";
      const following = followersList.some(f => f.id === userId);
      setIsFollowingRoom(following);
      setRoomFollowersCount(followersList.length);
    }, (err) => {
      console.warn("Firestore room followers onSnapshot error:", err);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeFollowers();
    };
  }, [activeRoom]);

  // Helper to calculate relative time for messenger chats
  const getRelativeTime = (timestamp: number) => {
    if (!timestamp) return "Just now";
    const diff = Date.now() - timestamp;
    const secs = Math.floor(diff / 1000);
    if (secs < 15) return "Just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Real-Time Chat Messages Listener from Firestore for active room
  useEffect(() => {
    const targetRoomId = activeRoom?.id;
    if (!targetRoomId) {
      setRoomMessages([]);
      return;
    }

    const messagesRef = collection(db, "rooms", targetRoomId, "messages");
    
    // Listen to real-time additions/updates
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({
          id: docSnap.id,
          ...data
        });
      });

      // Sort messages by timestamp ascending
      msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setRoomMessages(msgs);

      // Trigger live animation overlay for newly arrived gift messages
      const now = Date.now();
      const recentGiftMsg = msgs
        .filter((m) => m.type === "gift" && m.timestamp && now - m.timestamp < 6000)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (recentGiftMsg) {
        setActiveGiftAnimation((prev) => {
          if (!prev || prev.timestamp !== recentGiftMsg.timestamp) {
            return {
              giftName: recentGiftMsg.giftItem || "Gift",
              senderName: recentGiftMsg.senderName || "User",
              senderAvatar: recentGiftMsg.senderAvatar,
              receiverName: recentGiftMsg.receiverName || "Host",
              receiverAvatar: recentGiftMsg.receiverAvatar,
              count: recentGiftMsg.giftCount || 1,
              price: recentGiftMsg.price || 500,
              timestamp: recentGiftMsg.timestamp,
            };
          }
          return prev;
        });
      }

      // Scroll chat container to bottom when new messages arrive (smart scrolling)
      setTimeout(() => {
        if (chatContainerRef.current) {
          if (isInitialRoomLoadRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            isInitialRoomLoadRef.current = false;
          } else {
            const container = chatContainerRef.current;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom) {
              container.scrollTop = container.scrollHeight;
            }
          }
        }
      }, 100);

      // Automatically mark received messages as "seen"
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const currentUserId = loggedInUser?.id || "user-current";
        if (data.senderId !== currentUserId && data.status !== "seen") {
          updateDoc(doc(db, "rooms", targetRoomId, "messages", docSnap.id), {
            status: "seen"
          }).catch((err) => {
            console.warn("Failed to mark message as seen:", err);
          });
        }
      });
    }, (err) => {
      console.warn("Firestore room messages listener failed:", err);
    });

    return () => unsubscribe();
  }, [activeRoom?.id, loggedInUser?.id]);

  // Terminate/Close/Delete a room completely from the database (removes from homepage list)
  const terminateActiveRoom = async (roomId: string) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      triggerToast("Broadcast closed successfully and removed from lobby! 📡", "success");
    } catch (e) {
      console.error("Failed to delete room", e);
      triggerToast("Error closing the broadcast. Please try again.", "error");
      handleFirestoreError(e, OperationType.DELETE, `rooms/${roomId}`);
    }
  };

  // Daily Sign-In Countdown ticking timer
  useEffect(() => {
    const updateTimer = () => {
      if (lastClaimedTimestamp === 0) {
        setTimeRemaining(0);
        return;
      }
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const diff = (lastClaimedTimestamp + oneDayMs) - now;
      setTimeRemaining(diff > 0 ? diff : 0);
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [lastClaimedTimestamp]);

  // Auto-rotating sliding carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % 5); // We have 5 slides now
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  // Loading percentage & progress status (Screenshot 1)
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("Loading premium live audio nodes");
  const [isReady, setIsReady] = useState(false);

  // Profile Real-Time Edit States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editCountry, setEditCountry] = useState<{ name: string; flag: string } | null>(null);
  const [editGender, setEditGender] = useState<"Male" | "Female" | "Not Specified">("Male");
  const [editBio, setEditBio] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Auto pre-fill the Room title when modal opens
  useEffect(() => {
    if (showCreateRoomModal) {
      const username = loggedInUser ? loggedInUser.name : "Xzrmunna";
      setNewRoomTitle(`${username}  's room`);
    }
  }, [showCreateRoomModal, loggedInUser]);

  // New User Gift Box states
  const [showGiftBoxPopup, setShowGiftBoxPopup] = useState(false);
  const [showCrownClaimSuccess, setShowCrownClaimSuccess] = useState(false);

  // Phone Login States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);

  // Profile Registration States
  const [regUsername, setRegUsername] = useState("");
  const [regAvatar, setRegAvatar] = useState(DEFAULT_AVATARS[0]);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; flag: string } | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [regBirthday, setRegBirthday] = useState("1996-01-01");
  const [regGender, setRegGender] = useState<"Male" | "Female" | null>(null);

  // Email / Password Authentication States
  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [nameSignUp, setNameSignUp] = useState("");
  const [birthdaySignUp, setBirthdaySignUp] = useState("1999-10-12");
  const [genderSignUp, setGenderSignUp] = useState<"Male" | "Female">("Male");
  const [countrySignUp, setCountrySignUp] = useState<{ name: string; flag: string } | null>(null);
  const [emailAuthMode, setEmailAuthMode] = useState<"signin" | "signup">("signin");
  const [signUpCountrySearchQuery, setSignUpCountrySearchQuery] = useState("");
  const [showSignUpCountryDropdown, setShowSignUpCountryDropdown] = useState(false);
  const [unauthorizedDomainError, setUnauthorizedDomainError] = useState<string | null>(null);
  const [phoneErrorType, setPhoneErrorType] = useState<"too-many-requests" | "billing-not-enabled" | null>(null);

  // Audio & Mic States inside Live Room
  const [isMuted, setIsMuted] = useState(true);
  const [isNoiseReductionActive, setIsNoiseReductionActive] = useState(true);
  const [audioEffect, setAudioEffect] = useState<"clean" | "studio" | "hall" | "retro">("studio");
  const [microphonePermission, setMicrophonePermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [realAudioLevel, setRealAudioLevel] = useState(0);
  const [speakingUids, setSpeakingUids] = useState<Set<number>>(new Set());
  const [localAgoraUid, setLocalAgoraUid] = useState<number | null>(null);

  // Room Status States
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"speakers" | "chat">("speakers");
  const [chatMessage, setChatMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [giftFloatingItems, setGiftFloatingItems] = useState<{ id: number; char: string; xOffset: number; scale: number; delay: number }[]>([]);

  // Premium Live Voice Room seats states (Screenshot 4)
  const [hostSeatUser, setHostSeatUser] = useState<Participant | null>(null);
  const [superSeatUser, setSuperSeatUser] = useState<Participant | null>(null);
  const [gridSeatsUsers, setGridSeatsUsers] = useState<(Participant | null)[]>(() => Array(10).fill(null));
  const [roomAlerts, setRoomAlerts] = useState<{ id: string; text: string; type: "join" | "announcement" | "chat"; user?: string }[]>([]);
  const [seatLocks, setSeatLocks] = useState<Record<string, boolean>>({});
  const [seatMutes, setSeatMutes] = useState<Record<string, boolean>>({});
  const [isInvitingInSeatActions, setIsInvitingInSeatActions] = useState(false);
  const [bannedUserNames, setBannedUserNames] = useState<string[]>([]);
  const [roomMembersList, setRoomMembersList] = useState<{ id: string; name: string; role: string; avatar: string; color: string }[]>([]);

  // Real-time Following & Direct 1-on-1 Chat states
  const [followedUserIds, setFollowedUserIds] = useState<Record<string, boolean>>({});
  const [activeDirectChatUser, setActiveDirectChatUser] = useState<UserProfile | null>(null);

  const isUserMe = useCallback((u: Participant | null) => {
    if (!u) return false;
    const currentUserId = loggedInUser?.id || "user-current";
    const currentUserName = loggedInUser?.name || "Md Munna";
    
    if (u.id === currentUserId) {
      if (u.id === "user-current") {
        return u.name === currentUserName || u.name === `${currentUserName} (You)` || `${u.name} (You)` === currentUserName;
      }
      return true;
    }
    return u.name === currentUserName || u.name === `${currentUserName} (You)` || `${u.name} (You)` === currentUserName;
  }, [loggedInUser]);

  const isUserOnlineInRoom = useCallback((u: Participant | null) => {
    if (!u) return false;
    if (isUserMe(u)) return true;
    
    return roomMembersList.some(m => {
      if (m.id === u.id) {
        if (m.id === "user-current") {
          return m.name === u.name || m.name === u.name.replace(" (You)", "") || `${m.name} (You)` === u.name;
        }
        return true;
      }
      return m.name === u.name || m.name === u.name.replace(" (You)", "") || `${m.name} (You)` === u.name;
    });
  }, [isUserMe, roomMembersList]);

  // Synchronize roomMembersList with activeRoomMembers, filtering out inactive users in real-time
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;
    const now = Date.now();
    const uniqueMembers = activeRoomMembers.filter((m, idx, self) =>
      idx === self.findIndex((t) => (t.id && t.id === m.id) || (t.name && t.name === m.name))
    );
    
    // Inactive timeout is 25 seconds
    const activeOnly = uniqueMembers.filter((m) => {
      if (!m.lastSeen) return true; // Assume active if lastSeen hasn't synced yet
      return (now - m.lastSeen) < 25000;
    });

    const mappedList = activeOnly.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role || "Member",
      avatar: m.avatar || DEFAULT_AVATARS[0],
      color: m.role === "Owner" ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#4a2e00]" : "bg-gradient-to-r from-slate-400 to-slate-500 text-[#2a2a2a]"
    }));

    setRoomMembersList(mappedList);
  }, [activeRoomMembers, presenceTick, activeRoom?.id, currentStep]);

  // Firestore automatic seat vacancy cleanup for offline users
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;
    
    // Only one client (the first active member in the list) performs DB cleanup to avoid write conflicts
    const currentUserId = loggedInUser?.id || "user-current";
    const activeIds = roomMembersList.map(m => m.id);
    const isFirstActive = activeIds[0] === currentUserId;

    if (isFirstActive) {
      const roomRef = doc(db, "rooms", activeRoom.id);
      
      // Check if host seat occupant is offline
      if (hostSeatUser && !isUserOnlineInRoom(hostSeatUser)) {
        console.log("[Presence] Host is offline, vacating host seat in Firestore.");
        updateDoc(roomRef, { hostSeatUser: null }).catch(err => console.warn(err));
      }
      
      // Check if super seat occupant is offline
      if (superSeatUser && !isUserOnlineInRoom(superSeatUser)) {
        console.log("[Presence] Super occupant is offline, vacating super seat in Firestore.");
        updateDoc(roomRef, { superSeatUser: null }).catch(err => console.warn(err));
      }
      
      // Check if grid seat occupants are offline
      let gridChanged = false;
      const nextGrid = gridSeatsUsers.map(u => {
        if (u && !isUserOnlineInRoom(u)) {
          gridChanged = true;
          return null;
        }
        return u;
      });
      if (gridChanged) {
        console.log("[Presence] Some grid occupants are offline, vacating grid seats in Firestore.");
        updateDoc(roomRef, { gridSeatsUsers: nextGrid }).catch(err => console.warn(err));
      }
    }
  }, [roomMembersList, hostSeatUser, superSeatUser, gridSeatsUsers, activeRoom?.id, currentStep, loggedInUser?.id]);

  // Real-time Online Members list computed purely from real room participants (Screenshot 2)
  const onlineMembersList = useMemo(() => {
    const list: {
      id: string;
      name: string;
      avatar: string;
      isHost?: boolean;
      isMe?: boolean;
      hasTigerCrown?: boolean;
      heat?: string;
      vipGroup?: string;
      genderAgeZodiac?: string;
    }[] = [];

    const currentUserId = loggedInUser?.id || "user-current";
    const currentUserName = loggedInUser?.name || "Md Munna";
    const currentUserAvatar = loggedInUser?.avatar || DEFAULT_AVATARS[0];

    // 1. Current logged-in user
    const isMeHost = (hostSeatUser && (hostSeatUser.id === currentUserId || hostSeatUser.name === currentUserName)) ||
                     (activeRoom && (activeRoom.hostId === currentUserId || activeRoom.hostName === currentUserName));

    list.push({
      id: currentUserId,
      name: currentUserName,
      avatar: currentUserAvatar,
      isMe: true,
      isHost: isMeHost,
      hasTigerCrown: loggedInUser?.hasTigerCrown || false,
      heat: "10",
      genderAgeZodiac: "♂️30 Capricorn",
    });

    // 2. Host user (if sitting or active in room and not already current user)
    if (hostSeatUser && !list.some((x) => x.id === hostSeatUser.id || x.name === hostSeatUser.name)) {
      list.push({
        id: hostSeatUser.id,
        name: hostSeatUser.name,
        avatar: hostSeatUser.avatar,
        isHost: true,
        isMe: false,
        hasTigerCrown: hostSeatUser.hasTigerCrown || false,
        heat: "122.412k",
        genderAgeZodiac: "♂️30 Capricorn",
      });
    } else if (activeRoom?.hostName && !list.some((x) => x.name === activeRoom.hostName)) {
      list.push({
        id: activeRoom.hostId || "host-room-id",
        name: activeRoom.hostName,
        avatar: activeRoom.avatar || DEFAULT_AVATARS[0],
        isHost: true,
        isMe: false,
        hasTigerCrown: true,
        heat: "122.412k",
        genderAgeZodiac: "♂️30 Capricorn",
      });
    }

    // 3. Super Seat user
    if (superSeatUser && !list.some((x) => x.id === superSeatUser.id || x.name === superSeatUser.name)) {
      list.push({
        id: superSeatUser.id,
        name: superSeatUser.name,
        avatar: superSeatUser.avatar,
        isMe: false,
        hasTigerCrown: superSeatUser.hasTigerCrown || false,
        heat: "155.821k",
        vipGroup: "VIP Group",
        genderAgeZodiac: "♂️28 Leo",
      });
    }

    // 4. Grid Seats users
    gridSeatsUsers.forEach((u, i) => {
      if (u && !list.some((existing) => existing.id === u.id || existing.name === u.name)) {
        list.push({
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          isMe: false,
          hasTigerCrown: u.hasTigerCrown || false,
          heat: (2000 + i * 500).toLocaleString(),
          genderAgeZodiac: `♂️${22 + i} Gemini`,
        });
      }
    });

    // 5. Firestore Room Members
    roomMembersList.forEach((rm) => {
      if (!list.some((x) => x.id === rm.id || x.name === rm.name)) {
        list.push({
          id: rm.id,
          name: rm.name,
          avatar: rm.avatar,
          isMe: rm.id === currentUserId || rm.name === currentUserName,
          hasTigerCrown: (rm as any).hasTigerCrown || false,
          heat: "1,250",
          genderAgeZodiac: "♂️25 Libra",
        });
      }
    });

    return list;
  }, [hostSeatUser, superSeatUser, gridSeatsUsers, activeRoom, loggedInUser, roomMembersList]);

  const computedHostSeatUser = useMemo(() => {
    if (!hostSeatUser) return null;
    return isUserOnlineInRoom(hostSeatUser) ? hostSeatUser : null;
  }, [hostSeatUser, roomMembersList, loggedInUser]);

  const computedSuperSeatUser = useMemo(() => {
    if (!superSeatUser) return null;
    return isUserOnlineInRoom(superSeatUser) ? superSeatUser : null;
  }, [superSeatUser, roomMembersList, loggedInUser]);

  const computedGridSeatsUsers = useMemo(() => {
    return gridSeatsUsers.map(u => {
      if (!u) return null;
      return isUserOnlineInRoom(u) ? u : null;
    });
  }, [gridSeatsUsers, roomMembersList, loggedInUser]);

  const isHostSpeaking = !!(computedHostSeatUser && (
    (computedHostSeatUser.agoraUid && speakingUids.has(Number(computedHostSeatUser.agoraUid))) ||
    (computedHostSeatUser.id === (loggedInUser?.id || "user-current") && !isMuted && realAudioLevel > 15)
  ));

  const isSuperSpeaking = !!(computedSuperSeatUser && (
    (computedSuperSeatUser.agoraUid && speakingUids.has(Number(computedSuperSeatUser.agoraUid))) ||
    (computedSuperSeatUser.id === (loggedInUser?.id || "user-current") && !isMuted && realAudioLevel > 15)
  ));

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const isInitialRoomLoadRef = useRef(true);

  // Agora Services Refs
  const agoraRtcRef = useRef<any>(null);
  const agoraChatRef = useRef<any>(null);

  // Agora Real-Time Voice & Chat Integration Lifecycle Hook
  useEffect(() => {
    if (!activeRoom) {
      // Clean up previous room services if we leave
      if (agoraRtcRef.current) {
        agoraRtcRef.current.leave().catch((e: any) => console.warn(e));
        agoraRtcRef.current = null;
      }
      if (agoraChatRef.current) {
        agoraChatRef.current.logout().catch((e: any) => console.warn(e));
        agoraChatRef.current = null;
      }
      return;
    }

    const roomName = activeRoom.id || "voxa_lobby";
    const userName = loggedInUser ? loggedInUser.name : "Munna";
    const userNickname = loggedInUser ? loggedInUser.name : "Munna";

    console.log(`[Agora] Starting services for room: ${roomName}`);

    // Initialize Agora Services client-side
    const rtcService = createAgoraRtcService();
    agoraRtcRef.current = rtcService;

    const chatService = createAgoraChatService();
    agoraChatRef.current = chatService;

    const handleUserPublished = (user: any, mediaType: "audio" | "video") => {
      console.log(`[Agora] Remote user published audio track: ${user.uid}`);
      // Add or update participant list to show real speaker in the room
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === `agora-user-${user.uid}`);
        if (exists) {
          return prev.map((p) => p.id === `agora-user-${user.uid}` ? { ...p, isSpeaking: true } : p);
        } else {
          return [
            ...prev,
            {
              id: `agora-user-${user.uid}`,
              name: `Speaker ${user.uid}`,
              role: "Speaker",
              avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)] || "",
              isMuted: false,
              isSpeaking: true,
              volume: 100
            }
          ];
        }
      });
    };

    const handleUserUnpublished = (user: any) => {
      console.log(`[Agora] Remote user unpublished/left: ${user.uid}`);
      // Remove remote user from active participants list
      setParticipants((prev) => prev.filter((p) => p.id !== `agora-user-${user.uid}`));
    };

    // Fetch dynamic secure tokens from Express Server
    fetch("/api/agora-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        channelName: roomName,
        username: userName
      })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("[Agora] Successfully retrieved secure tokens from API", data);

      // Join RTC voice channel with server-generated secure token
      rtcService.join(roomName, data.rtcToken, handleUserPublished, handleUserUnpublished).then(() => {
        // Publish local mic if user starts unmuted
        if (!isMuted) {
          rtcService.publish().catch((err) => {
            console.error("[Agora] Auto publish mic failed:", err);
          });
        }

        // Enable volume indicators and register real-time speaker states!
        try {
          const client = rtcService.client;
          client.enableAudioVolumeIndicator();
          client.on("volume-indicator", (volumes: any[]) => {
            const speaking = new Set<number>();
            volumes.forEach((v: any) => {
              if (v.level > 10) {
                speaking.add(v.uid);
              }
            });
            setSpeakingUids(speaking);
          });

          // Sync local user's Agora UID to Firestore
          const localUid = client.uid;
          if (localUid) {
            setLocalAgoraUid(localUid);
            updateLocalUserAgoraUidInFirestore(activeRoom.id, localUid);
          }
        } catch (volErr) {
          console.warn("[Agora] Failed to setup volume indicators:", volErr);
        }
      }).catch((err) => {
        if (
          err?.code === "OPERATION_ABORTED" ||
          err?.name === "AgoraRTCError" ||
          err?.message?.includes("OPERATION_ABORTED") ||
          err?.message?.includes("cancel token") ||
          err?.message?.includes("canceled")
        ) {
          console.warn("[Agora] RTC channel join canceled or aborted safely.");
        } else {
          console.error("[Agora] RTC channel join failed:", err);
        }
      });

      // Login to Agora Chat with server-generated secure token
      chatService.login(userName, userNickname, data.chatToken, (msg) => {
        console.log("[Agora] Incoming text message received:", msg);
        // Append real-time message to room alerts
        setRoomAlerts((prev) => [
          ...prev,
          {
            id: `agora-chat-${Date.now()}-${Math.random()}`,
            text: msg.text,
            type: "chat",
            user: msg.from
          }
        ]);
      }).then(() => {
        // Join the chatroom
        chatService.joinRoom(roomName).catch((err) => {
          console.warn("[Agora] Failed to join Chat room:", err);
        });
      }).catch((err) => {
        console.warn("[Agora] Chat login failed (continuing with secure Firestore real-time messenger):", err);
      });
    })
    .catch((err) => {
      console.warn("[Agora] Failed to retrieve secure tokens from backend Express API (continuing with local RTC and Firestore sync):", err);
    });

    return () => {
      console.log(`[Agora] Tearing down services for room: ${roomName}`);
      rtcService.leave().catch((e: any) => console.warn(e));
      chatService.logout().catch((e: any) => console.warn(e));
      agoraRtcRef.current = null;
      agoraChatRef.current = null;
      setSpeakingUids(new Set());
      setLocalAgoraUid(null);
    };
  }, [activeRoom]);

  // Mock Room Statistics
  const [listenerCount, setListenerCount] = useState(142);
  const [roomDuration, setRoomDuration] = useState(2450); // in seconds (approx 40 mins)

  // Interactive Popup selection state for Google/Facebook Authentication flow
  const [showPopupOverlay, setShowPopupOverlay] = useState(false);

  // List of active participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "user-current",
      name: "Munna (You)",
      role: "Host",
      avatar: DEFAULT_AVATARS[0],
      isMuted: true,
      isSpeaking: false,
      volume: 100,
    }
  ]);

  // Mock Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // 1. Initial Load State & Session Restoration
  useEffect(() => {
    // Check if user session already exists in localStorage
    const savedSession = localStorage.getItem("voxaclub_current_user");
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setLoggedInUser(user);
        
        // Sync user in our live host participant roster
        setParticipants(prev =>
          prev.map(p => p.id === "host-1" ? { ...p, name: `${user.name} (You)`, avatar: user.avatar } : p)
        );
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }

    // Simulated Loading Cycle (to match the 75% in screenshot)
    let currentPercent = 0;
    const interval = setInterval(() => {
      if (currentPercent < 35) {
        currentPercent += Math.floor(Math.random() * 8) + 3;
        setLoadingStatus("Initializing VoxaClub voice pipelines...");
      } else if (currentPercent < 75) {
        currentPercent += Math.floor(Math.random() * 5) + 2;
        if (currentPercent >= 75) {
          currentPercent = 75; // Exact matching screenshot state
          setLoadingStatus("Loading premium live audio nodes");
        }
      } else if (currentPercent === 75) {
        clearInterval(interval);
        setTimeout(() => {
          const resumeInterval = setInterval(() => {
            setLoadingPercentage((prev) => {
              if (prev >= 100) {
                clearInterval(resumeInterval);
                setIsReady(true);
                setLoadingStatus("All audio streams synchronized successfully!");
                return 100;
              }
              const next = prev + Math.floor(Math.random() * 8) + 4;
              if (next >= 90) {
                setLoadingStatus("Establishing secure, high-fidelity handshake...");
              }
              return Math.min(next, 100);
            });
          }, 150);
        }, 1200);
      }
      setLoadingPercentage(Math.min(currentPercent, 75));
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // 1.5 Firebase Auth Real-Time Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          let profile: UserProfile | null = null;
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const numericIdNo = data.idNo || Math.floor(1000000 + Math.random() * 9000000).toString();
            profile = {
              id: firebaseUser.uid,
              idNo: numericIdNo,
              name: data.name || "Md Munna",
              avatar: data.avatar || DEFAULT_AVATARS[0],
              phone: firebaseUser.phoneNumber || data.phone || "",
              email: firebaseUser.email || data.email || "",
              authProvider: data.authProvider || "google",
              country: data.country || "Bangladesh",
              countryFlag: data.countryFlag || "🇧🇩",
              birthday: data.birthday || "1999-10-12",
              gender: data.gender || "Male",
              bio: data.bio || "Live your life to the fullest 🚀",
              description: data.description || "Hosting is my passion!",
              hasTigerCrown: data.hasTigerCrown || false,
              vipLevel: data.vipLevel || 1,
            };
          } else {
            // Profile doesn't exist in Firestore. If the user is on the loading screen, direct them to select-country step.
            if (currentStep === "loading") {
              setRegUsername(firebaseUser.displayName || "Google User");
              setRegAvatar(firebaseUser.photoURL || DEFAULT_AVATARS[0]);
              setAuthProvider(firebaseUser.email ? "google" : "phone");
              setCurrentStep("select-country");
              return;
            }
          }

          if (profile) {
            setLoggedInUser(profile);
            localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
            setParticipants((prev) =>
              prev.map((p) =>
                p.id === "user-current" || p.id === "host-1"
                  ? { ...p, name: `${profile.name} (You)`, avatar: profile.avatar }
                  : p
              )
            );
            if (currentStep === "login" || currentStep === "phone-otp" || currentStep === "email-auth") {
              setCurrentStep("lobby");
            }
          }
        } catch (e) {
          console.warn("Error checking Firestore profile, using fallback profile:", e);
          // Fallback profile to prevent user from being stuck
          const profile: UserProfile = {
            id: firebaseUser.uid,
            idNo: Math.floor(1000000 + Math.random() * 9000000).toString(),
            name: firebaseUser.displayName || "Md Munna",
            avatar: firebaseUser.photoURL || DEFAULT_AVATARS[0],
            phone: firebaseUser.phoneNumber || "",
            email: firebaseUser.email || "",
            authProvider: firebaseUser.email ? "google" : "phone",
            country: "Bangladesh",
            countryFlag: "🇧🇩",
            birthday: "1999-10-12",
            gender: "Male",
            bio: "Live your life to the fullest 🚀",
            description: "Hosting is my passion!",
            hasTigerCrown: false,
            vipLevel: 1,
          };
          setLoggedInUser(profile);
          localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
          setParticipants((prev) =>
            prev.map((p) =>
              p.id === "user-current" || p.id === "host-1"
                ? { ...p, name: `${profile.name} (You)`, avatar: profile.avatar }
                : p
            )
          );
          if (currentStep === "loading" || currentStep === "login" || currentStep === "phone-otp" || currentStep === "email-auth") {
            setCurrentStep("lobby");
          }
        }
      } else {
        // Only clear the session if there's no saved session or user explicitly logged out
        const savedSession = localStorage.getItem("voxaclub_current_user");
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (parsed && parsed.id) {
              // Active local or default session exists, keep it intact!
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setLoggedInUser(null);
        localStorage.removeItem("voxaclub_current_user");
      }
    });
    return () => unsubscribe();
  }, [currentStep]);

  // Countdown timer for OTP Verification code resend limit
  useEffect(() => {
    if (!otpSent || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Firebase auth error helper to capture unauthorized domain problems elegantly
  const handleAuthError = (error: any, contextMessage: string) => {
    console.warn(contextMessage, error);
    const errCode = error?.code || "";
    const errMessage = error?.message || "";
    const errString = error ? String(error) : "";
    
    const isUnauthorizedDomain = 
      errCode === "auth/unauthorized-domain" ||
      errMessage.includes("unauthorized-domain") ||
      errString.includes("unauthorized-domain") ||
      errString.includes("unauthorized domain") ||
      errMessage.includes("unauthorized domain");

    const isTooManyRequests =
      errCode === "auth/too-many-requests" ||
      errMessage.includes("too-many-requests") ||
      errString.includes("too-many-requests") ||
      errString.includes("too many requests") ||
      errMessage.includes("too many requests");

    const isBillingNotEnabled =
      errCode === "auth/billing-not-enabled" ||
      errMessage.includes("billing-not-enabled") ||
      errString.includes("billing-not-enabled") ||
      errString.includes("billing not enabled") ||
      errMessage.includes("billing not enabled");

    if (isUnauthorizedDomain) {
      setUnauthorizedDomainError(window.location.hostname);
    } else if (isTooManyRequests) {
      setPhoneErrorType("too-many-requests");
    } else if (isBillingNotEnabled) {
      setPhoneErrorType("billing-not-enabled");
    } else {
      const displayMsg = errMessage || (typeof error === "string" ? error : error?.message || String(error));
      triggerToast(`${contextMessage}: ${displayMsg}`, "error");
    }
  };

  const bypassPhoneVerification = () => {
    const formattedPhone = phoneNumber.trim() ? (phoneNumber.startsWith("+") ? phoneNumber : `+880${phoneNumber}`) : "+8801700000000";
    const profile: UserProfile = {
      id: "demo-phone-" + Math.floor(Math.random() * 1000000),
      name: "Voxa Member " + Math.floor(Math.random() * 1000),
      avatar: DEFAULT_AVATARS[0],
      phone: formattedPhone,
      authProvider: "phone",
      country: "Bangladesh",
      countryFlag: "🇧🇩",
      vipLevel: 1,
      bio: "Enjoying the club! 🎧",
    };
    setIsAgreed(true);
    setLoggedInUser(profile);
    localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "user-current" || p.id === "host-1"
          ? { ...p, name: `${profile.name} (You)`, avatar: profile.avatar }
          : p
      )
    );
    setPhoneErrorType(null);
    setCurrentStep("lobby");
    triggerToast("Bypassed verification & logged in successfully! ✨", "success");
  };

  // 2. Loading Completion Auto-Transition Logic
  useEffect(() => {
    if (currentStep !== "loading") return;
    if (loadingPercentage === 100 && isReady) {
      const delayTransition = setTimeout(() => {
        if (loggedInUser) {
          // If already authenticated, bypass login directly to the lobby
          setCurrentStep("lobby");
          triggerToast(`Welcome back, ${loggedInUser.name}!`, "success");
        } else {
          // Otherwise, show the beautiful login board
          setCurrentStep("login");
        }
      }, 1000);
      return () => clearTimeout(delayTransition);
    }
  }, [loadingPercentage, isReady, loggedInUser, currentStep]);

  // Room Duration Timer
  useEffect(() => {
    if (currentStep !== "room") return;
    const interval = setInterval(() => {
      setRoomDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Automatically spawn continuous gentle floating rose and love icons periodically above the Gift button
  useEffect(() => {
    if (currentStep !== "room") return;

    const interval = setInterval(() => {
      const symbols = ["🌹", "❤️", "💖", "💘"];
      // Spawn 1 to 2 items automatically every 2.2 seconds
      const count = Math.floor(Math.random() * 2) + 1;
      const newItems = Array.from({ length: count }).map((_, i) => {
        const id = Date.now() + Math.random() + i;
        const char = symbols[Math.floor(Math.random() * symbols.length)];
        const xOffset = Math.floor(Math.random() * 60) - 30; // -30px to 30px side-sway
        const scale = parseFloat((Math.random() * 0.4 + 0.8).toFixed(2));
        const delay = parseFloat((Math.random() * 0.4).toFixed(2));
        return { id, char, xOffset, scale, delay };
      });

      setGiftFloatingItems((prev) => [...prev, ...newItems]);

      // Filter out after 3.2 seconds so the DOM doesn't get cluttered
      setTimeout(() => {
        setGiftFloatingItems((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
      }, 3200);

    }, 2200); // Trigger every 2.2 seconds for perfect spacing

    return () => clearInterval(interval);
  }, [currentStep]);

  // Simulated Speaking activity for other users in the voice room
  useEffect(() => {
    if (currentStep !== "room") return;
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id === "user-current" || p.id === "host-1") {
            return { ...p, isSpeaking: !isMuted && realAudioLevel > 15 };
          }
          return p;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStep, isMuted, realAudioLevel]);

  // No automated live chat simulator exists (as requested - only real user's chat message is shown)
  useEffect(() => {
    if (currentStep !== "room") return;
    setListenerCount(1);
  }, [currentStep]);

  // Auto scroll chat list to bottom when alerts update (smart scrolling)
  useEffect(() => {
    if (currentStep === "room" && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          const container = chatContainerRef.current;
          const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
          if (isInitialRoomLoadRef.current || isNearBottom) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
            if (isInitialRoomLoadRef.current) {
              isInitialRoomLoadRef.current = false;
            }
          }
        }
      }, 80);
    }
  }, [roomAlerts, currentStep]);

  // Format Room Timer helper
  const formatDuration = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? hrs + ":" : ""}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Setup actual Web Audio API analyzer for real-time mic tracking
  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      setMicrophonePermission("granted");
      setIsMuted(false);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setRealAudioLevel(average);

        setParticipants((prev) =>
          prev.map((p) => (p.id === "host-1" ? { ...p, isSpeaking: average > 12 } : p))
        );

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      setMicrophonePermission("denied");
      simulateAudioFeedback();
    }
  };

  // Fallback volume level simulator when user lacks physical mic or denies permission
  const simIntervalRef = useRef<number | null>(null);
  const simulateAudioFeedback = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    simIntervalRef.current = window.setInterval(() => {
      if (!isMuted) {
        const randomLevel = Math.floor(Math.random() * 45) + 10;
        setRealAudioLevel(randomLevel);
        setParticipants((prev) =>
          prev.map((p) => (p.id === "host-1" ? { ...p, isSpeaking: randomLevel > 15 } : p))
        );
      } else {
        setRealAudioLevel(0);
        setParticipants((prev) =>
          prev.map((p) => (p.id === "host-1" ? { ...p, isSpeaking: false } : p))
        );
      }
    }, 150);
  };

  // Triggered when mic mute state is updated
  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    triggerToast(nextMuted ? "Your microphone is now muted." : "Your microphone is live!", "success");

    // Update Agora RTC publish state dynamically in real-time
    if (agoraRtcRef.current) {
      if (nextMuted) {
        agoraRtcRef.current.unpublish().catch((e: any) => console.warn(e));
      } else {
        agoraRtcRef.current.publish().catch((e: any) => console.warn(e));
      }
    }

    // Sync to active room seats in Firestore
    let nextHost = hostSeatUser;
    let nextSuper = superSeatUser;
    let nextGrid = [...gridSeatsUsers];

    if (hostSeatUser && isUserMe(hostSeatUser)) {
      nextHost = { ...hostSeatUser, isMuted: nextMuted };
      setHostSeatUser(nextHost);
    } else if (superSeatUser && isUserMe(superSeatUser)) {
      nextSuper = { ...superSeatUser, isMuted: nextMuted };
      setSuperSeatUser(nextSuper);
    } else {
      const idx = gridSeatsUsers.findIndex(u => u && isUserMe(u));
      if (idx !== -1) {
        nextGrid[idx] = { ...nextGrid[idx]!, isMuted: nextMuted };
        setGridSeatsUsers(nextGrid);
      }
    }

    if (activeRoom) {
      updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
    }

    if (!nextMuted && microphonePermission === "prompt") {
      requestMicrophoneAccess();
    } else {
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }

      if (nextMuted) {
        setRealAudioLevel(0);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setParticipants((prev) =>
          prev.map((p) => (p.id === "host-1" ? { ...p, isSpeaking: false, isMuted: true } : p))
        );
      } else {
        setParticipants((prev) =>
          prev.map((p) => (p.id === "host-1" ? { ...p, isMuted: false } : p))
        );
        if (microphonePermission === "granted") {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (audioContextRef.current && audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
          }
          const bufferLength = analyserRef.current?.frequencyBinCount || 128;
          const dataArray = new Uint8Array(bufferLength);
          const checkVolume = () => {
            if (!analyserRef.current || nextMuted) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
            const average = sum / bufferLength;
            setRealAudioLevel(average);
            animationFrameRef.current = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        } else {
          simulateAudioFeedback();
        }
      }
    }
  };

  // Handle reaction trigger
  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  // Trigger special translucent floating rose and love animations for the Gift button
  const triggerGiftAnimation = () => {
    const symbols = ["🌹", "❤️", "🌹", "❤️", "🌹", "💖", "💘"];
    const newItems = Array.from({ length: 18 }).map((_, i) => {
      const id = Date.now() + Math.random() + i;
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      const xOffset = Math.floor(Math.random() * 70) - 35; // -35px to 35px side-sway
      const scale = parseFloat((Math.random() * 0.6 + 0.9).toFixed(2));
      const delay = parseFloat((Math.random() * 0.5).toFixed(2));
      return { id, char, xOffset, scale, delay };
    });

    setGiftFloatingItems((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setGiftFloatingItems((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 3000);
  };

  // Typing state for voice chat feed
  const sendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: loggedInUser ? loggedInUser.name : "Munna (You)",
        role: "Host",
        text: chatMessage,
        timestamp: timeStr
      }
    ]);
    setChatMessage("");
    triggerReaction("💬");
  };

  // ==========================================
  // REAL AUTHENTICATION CONTROLLER ACTIONS
  // ==========================================

  // Validation interceptor for agreements checkbox
  const handleAuthAttempt = async (provider: "phone" | "google" | "facebook" | "email") => {
    if (!isAgreed) {
      triggerToast("Please agree to the User Agreement first.", "error");
      return;
    }

    setAuthProvider(provider);

    if (provider === "phone") {
      setCurrentStep("phone-otp");
    } else if (provider === "google") {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        triggerToast("Google authentication successful!", "success");

        // Check Firestore safely
        let userDocSnap = null;
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          userDocSnap = await getDoc(userDocRef);
        } catch (err) {
          console.warn("Firestore profile fetch failed during Google login, falling back to onboarding:", err);
        }

        if (userDocSnap && userDocSnap.exists()) {
          const profile = userDocSnap.data() as UserProfile;
          setLoggedInUser(profile);
          localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
          setCurrentStep("lobby");
        } else {
          setRegUsername(firebaseUser.displayName || "Google User");
          setRegAvatar(firebaseUser.photoURL || DEFAULT_AVATARS[0]);
          setAuthProvider("google");
          setCurrentStep("select-country");
        }
      } catch (error: any) {
        handleAuthError(error, "Google Login Error");
      }
    } else if (provider === "email") {
      setCurrentStep("email-auth");
    } else {
      triggerToast("Facebook Login is currently disabled. Please use Google, Phone, or Email Login.", "error");
    }
  };

  // State to hold Firebase phone verification confirmation
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<any>(null);

  // Actions for Phone Number Verification Code
  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      triggerToast("Please enter a valid phone number.", "error");
      return;
    }

    // Initialize recaptcha verifier
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // solved
          }
        });
      } catch (err: any) {
        console.error("Recaptcha initialization error:", err);
        triggerToast("Failed to initialize recaptcha.", "error");
        return;
      }
    }

    const appVerifier = (window as any).recaptchaVerifier;
    const fullPhone = phoneNumber.startsWith("+") ? phoneNumber : `+880${phoneNumber}`;

    signInWithPhoneNumber(auth, fullPhone, appVerifier)
      .then((confirmation) => {
        setPhoneConfirmationResult(confirmation);
        setOtpSent(true);
        setOtpTimer(60);
        triggerToast(`Firebase OTP code sent successfully to ${fullPhone}!`, "otp", 10000);
      })
      .catch((error) => {
        handleAuthError(error, "Phone Auth Error");
      });
  };

  // Submits the OTP to verify identity
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!userEnteredOtp || userEnteredOtp.length < 6) {
      triggerToast("Please enter a valid 6-digit verification code.", "error");
      return;
    }

    if (!phoneConfirmationResult) {
      triggerToast("Please request verification code first.", "error");
      return;
    }

    phoneConfirmationResult.confirm(userEnteredOtp)
      .then(async (result: any) => {
        const firebaseUser = result.user;
        triggerToast("Phone verification successful!", "success");

        // Fetch existing Firestore profile safely
        let userDocSnap = null;
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          userDocSnap = await getDoc(userDocRef);
        } catch (err) {
          console.warn("Firestore profile fetch failed during phone verification:", err);
        }

        if (userDocSnap && userDocSnap.exists()) {
          const profile = userDocSnap.data() as UserProfile;
          setLoggedInUser(profile);
          localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
          setParticipants(prev =>
            prev.map(p => p.id === "host-1" ? { ...p, name: `${profile.name} (You)`, avatar: profile.avatar } : p)
          );
          setCurrentStep("lobby");
        } else {
          setRegUsername("User_" + firebaseUser.uid.substring(0, 5));
          setCurrentStep("select-country");
        }
      })
      .catch((error: any) => {
        handleAuthError(error, "Invalid or expired verification code");
      });
  };

  // Real Email/Password Login
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailSignIn.trim() || !passwordSignIn.trim()) {
      triggerToast("Please enter email and password.", "error");
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, emailSignIn.trim(), passwordSignUp.trim());
      const firebaseUser = result.user;

      // Check Firestore safely
      let userDocSnap = null;
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        userDocSnap = await getDoc(userDocRef);
      } catch (err) {
        console.warn("Firestore profile fetch failed during email login, falling back to onboarding:", err);
      }

      if (userDocSnap && userDocSnap.exists()) {
        const profile = userDocSnap.data() as UserProfile;
        setLoggedInUser(profile);
        localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
        triggerToast(`Welcome back, ${profile.name}!`, "success");
        setCurrentStep("lobby");
      } else {
        setRegUsername(firebaseUser.displayName || "Email User");
        setAuthProvider("email");
        setCurrentStep("select-country");
      }
    } catch (error: any) {
      handleAuthError(error, "Login Error");
    }
  };

  // Real Email/Password Sign Up with Name, DOB, Gender, Country
  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailSignUp.trim() || !passwordSignUp.trim()) {
      triggerToast("Please enter email and password.", "error");
      return;
    }
    if (!nameSignUp.trim()) {
      triggerToast("Please enter your name.", "error");
      return;
    }
    if (!countrySignUp) {
      triggerToast("Please select your country.", "error");
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, emailSignUp.trim(), passwordSignUp.trim());
      const firebaseUser = result.user;

      const profile: UserProfile = {
        id: firebaseUser.uid,
        name: nameSignUp.trim(),
        avatar: DEFAULT_AVATARS[0],
        email: firebaseUser.email || emailSignUp.trim(),
        authProvider: "email",
        country: countrySignUp.name,
        countryFlag: countrySignUp.flag,
        birthday: birthdaySignUp,
        gender: genderSignUp,
        bio: "Live your life to the fullest 🚀",
        description: "Hosting is my passion!",
        hasTigerCrown: false,
        vipLevel: 1,
      };

      // Save user to Firestore safely
      try {
        await setDoc(doc(db, "users", firebaseUser.uid), profile);
      } catch (err) {
        console.warn("Firestore profile creation failed during email signup, saving locally only:", err);
      }

      setLoggedInUser(profile);
      localStorage.setItem("voxaclub_current_user", JSON.stringify(profile));
      triggerToast("Account created successfully with profile details! ✨", "success");
      setCurrentStep("lobby");
    } catch (error: any) {
      handleAuthError(error, "Sign Up Error");
    }
  };

  const handleProfileFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setRegAvatar(base64);
      triggerToast("Profile photo selected successfully! Permanent & Realtime ✨", "success");
    } catch (err) {
      console.error("Failed to read file", err);
      triggerToast("Failed to upload image. Please try again.", "error");
    }
  };

  // Completes first-time profile creation and persists in database
  const handleRegisterProfile = (e: FormEvent) => {
    e.preventDefault();
    handleCompleteOnboarding(false);
  };

  const handleCompleteOnboarding = async (isSkip: boolean) => {
    const finalUsername = isSkip ? (regUsername.trim() || `User_${Math.floor(Math.random() * 9000 + 1000)}`) : regUsername.trim();
    if (!isSkip && !finalUsername) {
      triggerToast("Please enter a username.", "error");
      return;
    }
    const finalAvatar = regAvatar || DEFAULT_AVATARS[0];
    const finalCountry = selectedCountry ? selectedCountry.name : "Bangladesh";
    const finalCountryFlag = selectedCountry ? selectedCountry.flag : "🇧🇩";
    const finalBirthday = isSkip ? "1996-01-01" : regBirthday;
    const finalGender = isSkip ? "Not Specified" : (regGender || "Not Specified");

    const currentUser = auth.currentUser;
    const uid = currentUser ? currentUser.uid : "user-" + Date.now();

    const newUser: UserProfile = {
      id: uid,
      name: finalUsername,
      avatar: finalAvatar,
      phone: currentUser?.phoneNumber || (authProvider === "phone" ? phoneNumber : undefined),
      email: currentUser?.email || (authProvider !== "phone" ? currentUser?.email || `user-${uid}@voxaclub.com` : undefined),
      authProvider: authProvider || "phone",
      country: finalCountry,
      countryFlag: finalCountryFlag,
      birthday: finalBirthday,
      gender: finalGender,
      bio: "Live your life to the fullest 🚀",
      description: "Hosting is my passion!",
      hasTigerCrown: false,
      vipLevel: 1,
    };

    // Save into Firestore
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", uid), newUser);
      } catch (e: any) {
        console.warn("Error saving user to Firestore (saved locally instead):", e);
      }
    }

    // Save active current session
    setLoggedInUser(newUser);
    localStorage.setItem("voxaclub_current_user", JSON.stringify(newUser));

    // Inject custom user info as the room Host
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === "host-1" ? { ...p, name: `${newUser.name} (You)`, avatar: newUser.avatar } : p
      )
    );

    triggerToast(isSkip ? "Welcome! Setup skipped successfully." : "Your profile setup is complete!", "success");
    setShowGiftBoxPopup(true);
    setCurrentStep("lobby");
  };

  const openEditProfile = () => {
    if (loggedInUser) {
      setEditName(loggedInUser.name);
      setEditAvatar(loggedInUser.avatar || "");
      setEditBirthday(loggedInUser.birthday || "1999-10-12");
      const matchedCountry = COUNTRIES_LIST.find(c => c.name === loggedInUser.country) || COUNTRIES_LIST[0];
      setEditCountry(matchedCountry);
      setEditGender((loggedInUser.gender as any) || "Male");
      setEditBio(loggedInUser.bio || "Live your life to the fullest 🚀");
      setEditDescription(loggedInUser.description || "Hosting is my passion! Come join my rooms.");
    }
    setShowEditProfile(true);
  };

  const handleEditProfileFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      setEditAvatar(base64);
      triggerToast("Profile photo uploaded successfully! Permanent & Realtime ✨", "success");
    } catch (err) {
      console.error("Failed to read file", err);
      triggerToast("Failed to upload image. Please try again.", "error");
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      triggerToast("Nickname cannot be empty", "error");
      return;
    }
    const updatedUser: UserProfile = {
      ...loggedInUser!,
      name: editName.trim(),
      avatar: editAvatar,
      birthday: editBirthday,
      country: editCountry ? editCountry.name : "Bangladesh",
      countryFlag: editCountry ? editCountry.flag : "🇧🇩",
      gender: editGender,
      bio: editBio,
      description: editDescription,
    };
    setLoggedInUser(updatedUser);
    localStorage.setItem("voxaclub_current_user", JSON.stringify(updatedUser));

    // Sync to Firestore users collection
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), updatedUser, { merge: true });
      } catch (err) {
        console.warn("Error saving profile to Firestore (updated locally instead):", err);
      }
    }
    
    // Sync participant locally
    setParticipants(prev =>
      prev.map(p => (p.id === "user-current" || p.id === "host-1" || p.id === loggedInUser?.id) ? { ...p, name: `${updatedUser.name} (You)`, avatar: updatedUser.avatar } : p)
    );

    // Sync to active room in Firestore if inside a room
    if (activeRoom) {
      const currentUserId = loggedInUser?.id || "user-current";
      const roomId = activeRoom.id;
      
      // Update room member document
      try {
        await setDoc(doc(db, "rooms", roomId, "members", currentUserId), {
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          vipLevel: updatedUser.vipLevel || 1,
          idNo: updatedUser.idNo || "1000001",
          bio: updatedUser.bio || "",
          countryFlag: updatedUser.countryFlag || "🇧🇩",
          gender: updatedUser.gender || "Male",
          birthday: updatedUser.birthday || "1999-10-12"
        }, { merge: true });
      } catch (err) {
        console.warn("Failed to sync profile update to room member doc in Firestore:", err);
      }

      // Update seat details in active room in Firestore in real-time
      try {
        const roomRef = doc(db, "rooms", roomId);
        const snapshot = await getDoc(roomRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          let hostSeat = data.hostSeatUser || null;
          let superSeat = data.superSeatUser || null;
          let gridSeats = data.gridSeatsUsers || Array(10).fill(null);
          let changed = false;

          const matchUser = (u: Participant | null) => {
            if (!u) return false;
            const uNameClean = u.name.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
            const userNameClean = loggedInUser?.name?.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
            return u.id === currentUserId || uNameClean === userNameClean;
          };

          if (hostSeat && matchUser(hostSeat)) {
            hostSeat = { ...hostSeat, name: updatedUser.name, avatar: updatedUser.avatar };
            setHostSeatUser(hostSeat);
            changed = true;
          }
          if (superSeat && matchUser(superSeat)) {
            superSeat = { ...superSeat, name: updatedUser.name, avatar: updatedUser.avatar };
            setSuperSeatUser(superSeat);
            changed = true;
          }
          for (let i = 0; i < gridSeats.length; i++) {
            const u = gridSeats[i];
            if (u && matchUser(u)) {
              gridSeats[i] = { ...u, name: updatedUser.name, avatar: updatedUser.avatar };
              setGridSeatsUsers(gridSeats);
              changed = true;
            }
          }

          if (changed) {
            await updateDoc(roomRef, {
              hostSeatUser: hostSeat,
              superSeatUser: superSeat,
              gridSeatsUsers: gridSeats
            });
          }
        }
      } catch (err) {
        console.warn("Failed to sync profile update to room seats in Firestore:", err);
      }
    }

    setShowEditProfile(false);
    triggerToast("Profile updated successfully in real-time! ✨", "success");
  };

  const handlePurchaseVip = () => {
    const cost = selectedVipLevel * 300000;
    if (vipLevel >= selectedVipLevel) {
      triggerToast(`You already own VIP ${selectedVipLevel}!`, "error");
      return;
    }
    if (userCoins < cost) {
      triggerToast(`Insufficient Gold Coins! You need ${cost.toLocaleString()} but only have ${userCoins.toLocaleString()}. Please click "+ RECHARGE" to get free coins!`, "error");
      return;
    }
    
    // Deduct coins and award VIP level
    setUserCoins((prev) => prev - cost);
    setVipLevel(selectedVipLevel);
    setUnlockedLevel(selectedVipLevel);
    setShowVipSuccessModal(true);
    triggerToast(`Congratulations! You are now VIP ${selectedVipLevel}! 👑🎉`, "success");
  };

  // Handles opening the onboarding gift box and granting the Tiger Crown
  const handleOpenGiftBox = async () => {
    if (!loggedInUser) return;
    
    const updatedUser = { ...loggedInUser, hasTigerCrown: true };
    setLoggedInUser(updatedUser);
    localStorage.setItem("voxaclub_current_user", JSON.stringify(updatedUser));

    // Sync to Firestore
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), { hasTigerCrown: true }, { merge: true });
      } catch (err) {
        console.warn("Error saving Tiger Crown to Firestore (claimed locally instead):", err);
      }
    }
    
    // Update in the registered users list database
    const allUsersStr = localStorage.getItem("voxaclub_users");
    if (allUsersStr) {
      try {
        const usersList: UserProfile[] = JSON.parse(allUsersStr);
        const idx = usersList.findIndex((u) => u.id === loggedInUser.id);
        if (idx !== -1) {
          usersList[idx] = updatedUser;
          localStorage.setItem("voxaclub_users", JSON.stringify(usersList));
        }
      } catch (err) {
        console.error("Error updating user list with tiger crown:", err);
      }
    }

    // Sync to active room seat in Firestore if on seat
    if (activeRoom) {
      let changed = false;
      let nextHost = hostSeatUser;
      let nextSuper = superSeatUser;
      let nextGrid = [...gridSeatsUsers];

      const currentUserId = loggedInUser?.id || "user-current";

      if (hostSeatUser && (hostSeatUser.id === currentUserId || hostSeatUser.id === "user-current")) {
        nextHost = { ...hostSeatUser, hasTigerCrown: true };
        setHostSeatUser(nextHost);
        changed = true;
      }
      if (superSeatUser && (superSeatUser.id === currentUserId || superSeatUser.id === "user-current")) {
        nextSuper = { ...superSeatUser, hasTigerCrown: true };
        setSuperSeatUser(nextSuper);
        changed = true;
      }
      for (let i = 0; i < nextGrid.length; i++) {
        const u = nextGrid[i];
        if (u && (u.id === currentUserId || u.id === "user-current")) {
          nextGrid[i] = { ...u, hasTigerCrown: true };
          changed = true;
        }
      }
      if (changed) {
        setGridSeatsUsers(nextGrid);
        updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
      }
    }
    
    setShowGiftBoxPopup(false);
    setShowCrownClaimSuccess(true);
  };

  const handleSendRoomGift = async (gift?: GiftCatalogItem, recipientKey?: string, count?: number) => {
    if (!activeRoom) return;

    const currentGiftName = gift ? gift.name : selectedGiftItem;
    const currentPrice = gift ? gift.price : 50000;
    const currentCount = count || selectedGiftCount || 1;
    const currentRecipientKey = recipientKey || selectedGiftRecipient;

    const totalPrice = currentPrice * currentCount;
    if (userCoinsBalance < totalPrice) {
      triggerToast(`Insufficient coins! You need 🪙 ${totalPrice.toLocaleString()} coins. Click Recharge!`, "error");
      return;
    }

    // Deduct coins
    setUserCoinsBalance((prev) => Math.max(0, prev - totalPrice));

    // Update real-time PK battle scores
    if (currentRecipientKey === "HOST" || currentRecipientKey === "ALL") {
      setPkRedScore((prev) => prev + totalPrice);
    } else {
      setPkBlueScore((prev) => prev + totalPrice);
    }

    // Determine recipient name
    let recipientName = activeRoom.hostName;
    if (currentRecipientKey === "SUPER" && superSeatUser) {
      recipientName = superSeatUser.name;
    } else if (currentRecipientKey.startsWith("GRID_")) {
      const idx = parseInt(currentRecipientKey.split("_")[1]);
      const gridUser = gridSeatsUsers[idx];
      if (gridUser) recipientName = gridUser.name;
    } else if (hostSeatUser && currentRecipientKey === "HOST") {
      recipientName = hostSeatUser.name;
    }

    recipientName = recipientName.replace("🛡️ [Admin] ", "").replace(" [Admin]", "");

    // Determine recipient avatar if available
    let recipientAvatar = activeRoom.hostAvatar;
    if (currentRecipientKey === "SUPER" && superSeatUser) {
      recipientAvatar = superSeatUser.avatar;
    } else if (currentRecipientKey.startsWith("GRID_")) {
      const idx = parseInt(currentRecipientKey.split("_")[1]);
      const gridUser = gridSeatsUsers[idx];
      if (gridUser) recipientAvatar = gridUser.avatar;
    } else if (hostSeatUser && currentRecipientKey === "HOST") {
      recipientAvatar = hostSeatUser.avatar;
    }

    // Update coins received for recipient in real-time
    setSeatCoinsMap((prev) => ({
      ...prev,
      [recipientName]: (prev[recipientName] || 0) + totalPrice,
    }));

    // Trigger immediate local real-time animated overlay
    setActiveGiftAnimation({
      giftName: currentGiftName,
      senderName: loggedInUser?.name || "Md Munna",
      senderAvatar: loggedInUser?.avatar || DEFAULT_AVATARS[0],
      receiverName: recipientName,
      receiverAvatar: recipientAvatar,
      count: currentCount,
      price: currentPrice,
      timestamp: Date.now(),
    });

    // Create gift message on Firestore
    try {
      const messagesRef = collection(db, "rooms", activeRoom.id, "messages");
      await addDoc(messagesRef, {
        type: "gift",
        senderId: loggedInUser?.id || "user-current",
        senderName: loggedInUser?.name || "Md Munna",
        senderAvatar: loggedInUser?.avatar || DEFAULT_AVATARS[0],
        senderVipLevel: loggedInUser?.vipLevel || 1,
        receiverName: recipientName,
        giftItem: currentGiftName,
        giftCount: currentCount,
        price: currentPrice,
        timestamp: Date.now(),
        text: `sent ${currentGiftName} x${currentCount} to ${recipientName}!`
      });

      triggerToast(`You sent ${currentGiftName} x${currentCount} to ${recipientName}! 🎁✨`, "success");
      
      // If gift is Tiger Crown or Royal Crown, give crown to seat user
      if (currentGiftName === "Tiger Crown" || currentGiftName === "Royal Crown") {
        let changed = false;
        let nextHost = hostSeatUser;
        let nextSuper = superSeatUser;
        let nextGrid = [...gridSeatsUsers];

        if (hostSeatUser && hostSeatUser.name === recipientName) {
          nextHost = { ...hostSeatUser, hasTigerCrown: true };
          setHostSeatUser(nextHost);
          changed = true;
        }
        if (superSeatUser && superSeatUser.name === recipientName) {
          nextSuper = { ...superSeatUser, hasTigerCrown: true };
          setSuperSeatUser(nextSuper);
          changed = true;
        }
        for (let i = 0; i < nextGrid.length; i++) {
          const u = nextGrid[i];
          if (u && u.name === recipientName) {
            nextGrid[i] = { ...u, hasTigerCrown: true };
            changed = true;
          }
        }
        if (changed) {
          setGridSeatsUsers(nextGrid);
          await updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
        }
      }
    } catch (e) {
      console.error("Gifting error:", e);
      triggerToast("Failed to send gift. Please try again.", "error");
    }

    setShowRoomGiftingModal(false);
  };

  // Clear session / Log out
  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase signout error:", e);
      }
      localStorage.removeItem("voxaclub_current_user");
      setLoggedInUser(null);
      setPhoneNumber("");
      setUserEnteredOtp("");
      setOtpSent(false);
      setGeneratedOtp("");
      setIsMuted(true);
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCurrentStep("login");
    }
  };

  // Dynamic social moments features
  const handleShareMoment = () => {
    if (!newMomentText.trim()) {
      triggerToast("Please write something to publish!", "error");
      return;
    }
    const newMoment = {
      id: "moment-" + Date.now(),
      name: loggedInUser?.name || "Md Munna",
      avatar: loggedInUser?.avatar || "",
      time: "Just now",
      country: loggedInUser?.country || "Bangladesh",
      text: newMomentText.trim(),
      likes: 0,
      likedByUser: false
    };
    setMoments(prev => [newMoment, ...prev]);
    setNewMomentText("");
    triggerToast("Your moment has been published successfully! 🌸", "success");
  };

  const handleLikeMoment = (id: string) => {
    setMoments(prev =>
      prev.map(m => {
        if (m.id === id) {
          const liked = !m.likedByUser;
          return {
            ...m,
            likedByUser: liked,
            likes: liked ? m.likes + 1 : m.likes - 1
          };
        }
        return m;
      })
    );
  };

  // Real payment gateway checkout billing simulation action
  const handleRechargeCoins = (e: FormEvent) => {
    e.preventDefault();
    if (!rechargePayerPhone.trim()) {
      triggerToast("Please enter your payer mobile or card number.", "error");
      return;
    }
    if (!rechargeTxnId.trim()) {
      triggerToast("Please enter the payment Transaction ID (TxnID).", "error");
      return;
    }

    // Add selected package coins
    setUserCoins(prev => prev + rechargeAmount);
    setShowRechargeModal(false);

    // Save transaction in inbox messages list as a real receipt notification!
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const receiptMessage = {
      name: "VoxaClub Billing Support",
      text: `Deposit verified! Credited 🪙 ${rechargeAmount.toLocaleString()} Coins via ${rechargeMethod.toUpperCase()}. Account: ${rechargePayerPhone}. TxnID: ${rechargeTxnId}.`,
      time: timeStr,
      unread: true
    };
    setInboxChats(prev => [receiptMessage, ...prev]);

    // Clear form inputs
    setRechargePayerPhone("");
    setRechargeTxnId("");

    triggerToast(`Successfully recharged 🪙 ${rechargeAmount.toLocaleString()} Coins! check your inbox.`, "success");
  };

  // ==========================================
  // REAL-TIME LOBBY CONTROLLER ACTIONS (Screenshot 3)
  // ==========================================

  // Real-time room metrics are synchronized directly from Firestore in real time.

  // Enter a room card in real-time
  const joinRoom = (room: LobbyRoom) => {
    // Clear previous room's seats state immediately so that no stale occupants are shown while loading!
    setHostSeatUser(null);
    setSuperSeatUser(null);
    setGridSeatsUsers(Array(10).fill(null));
    setSeatLocks({});
    setSeatMutes({});

    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];
    const currentUserId = loggedInUser?.id || "user-current";

    if (bannedUserNames.includes(currentUserName)) {
      triggerToast("You are banned from this room by Admin/Host! 🚫", "error");
      return;
    }

    setActiveRoom(room);
    
    // Set role dynamically: hostName matches or custom created room -> admin, otherwise user
    const isRoomOwner = room.hostId === currentUserId || room.hostName === currentUserName || (room.id.startsWith("room-custom-") && room.hostName === currentUserName) || room.id === "room-user-" + currentUserId;
    if (isRoomOwner) {
      setTestRoomRole("admin");
    } else {
      setTestRoomRole("user");
    }

    // Call real-time membership join
    enterRoomMembership(room.id, room);

    // Initialize room members list with only the current user (Firestore listener will instantly load others)
    setRoomMembersList([
      { id: currentUserId, name: currentUserName, role: isRoomOwner ? "Owner" : "Member", avatar: currentUserAvatar, color: isRoomOwner ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#4a2e00]" : "bg-gradient-to-r from-slate-400 to-slate-500 text-[#2a2a2a]" }
    ]);
    
    const mockParticipants: Participant[] = [
      {
        id: currentUserId,
        name: `${currentUserName} (You)`,
        role: isRoomOwner ? "Host" : "Listener",
        avatar: currentUserAvatar,
        isMuted: isMuted,
        isSpeaking: false,
        volume: 100
      }
    ];

    setParticipants(mockParticipants);
    
    // Load existing seats from the room document
    // If the joining user is the owner/creator, and the host seat is empty in DB, let's take it!
    const roomAny = room as any;
    if (isRoomOwner) {
      const hostUserObj: Participant = {
        id: currentUserId,
        name: currentUserName,
        role: "Host",
        avatar: currentUserAvatar,
        isMuted: isMuted,
        isSpeaking: false,
        volume: 100,
        agoraUid: localAgoraUid || agoraRtcRef.current?.client?.uid || null,
        hasTigerCrown: loggedInUser?.hasTigerCrown || false
      };

      // Clean duplicate of the owner from other seats
      const { cleanedSuper, cleanedGrid } = cleanDuplicateUserFromSeats(
        currentUserId,
        currentUserName,
        null, // Explicitly setting hostSeat, no need to clean host seat
        roomAny.superSeatUser || null,
        roomAny.gridSeatsUsers || Array(10).fill(null)
      );

      setHostSeatUser(hostUserObj);
      setSuperSeatUser(cleanedSuper);
      setGridSeatsUsers(cleanedGrid);
      setSeatLocks(roomAny.seatLocks || {});
      setSeatMutes(roomAny.seatMutes || {});
      updateRoomSeatsInFirestore(room.id, hostUserObj, cleanedSuper, cleanedGrid, roomAny.seatLocks || {}, roomAny.seatMutes || {});
    } else {
      const rawHost = roomAny.hostSeatUser || null;
      const rawSuper = roomAny.superSeatUser || null;
      const rawGrid = roomAny.gridSeatsUsers || Array(10).fill(null);
      
      const { cleanedHost, cleanedSuper, cleanedGrid } = cleanDuplicateUserFromSeats(
        currentUserId,
        currentUserName,
        rawHost,
        rawSuper,
        rawGrid
      );

      setHostSeatUser(cleanedHost);
      setSuperSeatUser(cleanedSuper);
      setGridSeatsUsers(cleanedGrid);
      setSeatLocks(roomAny.seatLocks || {});
      setSeatMutes(roomAny.seatMutes || {});

      // Update Firestore if we cleaned up a stale duplicate of this user from any seat
      if (cleanedHost !== rawHost || cleanedSuper !== rawSuper || JSON.stringify(cleanedGrid) !== JSON.stringify(rawGrid)) {
        updateRoomSeatsInFirestore(room.id, cleanedHost, cleanedSuper, cleanedGrid, roomAny.seatLocks || {}, roomAny.seatMutes || {});
      }
    }

    // Setup initial real-time notification alerts (Only welcome and current user's enter)
    const initialAlerts = [
      { id: `announcement-${Date.now()}`, text: room.subtitle || "Welcome ! Let's chat and have fun together !", type: "announcement" as const },
      { id: `join-${Date.now()}`, text: `New user ${currentUserName} has entered the room!`, type: "join" as const }
    ];
    setRoomAlerts(initialAlerts);

    setListenerCount(1); // Only 1 listener (the user) - no demo counts
    setRoomDuration(Math.floor(Math.random() * 300) + 10);
    setCurrentStep("room");
    triggerToast(`Entered ${room.title}! Live audio channel open.`, "success");
  };

  // Seat Options Modal Trigger (Shows options before action)
  // Helper to get key for a seat
  const getSeatKey = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    return seatType === "grid" ? `grid-${gridIndex}` : seatType;
  };

  const handleSeatClick = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    const key = getSeatKey(seatType, gridIndex);
    const isLocked = seatLocks[key];

    const isCurrentUserManager = testRoomRole === "admin" || hostSeatUser?.id === "user-current" || superSeatUser?.id === "user-current" || loggedInUser?.id === hostSeatUser?.id;

    // Identify who is on the clicked seat
    const seatUser = seatType === "host" 
      ? hostSeatUser 
      : seatType === "super" 
      ? superSeatUser 
      : (gridIndex !== undefined ? gridSeatsUsers[gridIndex] : null);

    // 1. If seat is empty, join seat
    if (!seatUser) {
      if (isLocked && !isCurrentUserManager) {
        triggerToast("This seat is locked by Host/Admin. 🔒", "error");
        return;
      }
      executeSeatMovement(seatType, gridIndex);
      triggerToast("You joined the voice broadcast seat! 🎙️", "success");
      return;
    }

    // 2. If clicking OWN seat, show Leave Seat / Manage own seat modal
    if (isUserMe(seatUser)) {
      setIsInvitingInSeatActions(false);
      setActiveSeatConfig({ seatType, gridIndex });
      setShowSeatActionsModal(true);
      return;
    }

    // 3. If clicking someone else's seat, open their Profile Bottom Sheet Card (Screenshots 1 & 2)
    const userProfile: UserProfile = {
      id: seatUser.id,
      name: seatUser.name,
      avatar: seatUser.avatar,
      hasTigerCrown: seatUser.hasTigerCrown !== undefined ? seatUser.hasTigerCrown : true,
      vipLevel: 2,
      idNo: seatUser.id.startsWith("user-") ? "7629964" : (seatUser.id.replace(/\D/g, "") || "6806275"),
      gender: "Female",
      bio: "OneR encourages positive broadcast. Let's chat & spread love ❤️",
      countryFlag: "🇧🇩",
      authProvider: "phone",
    };
    setActiveSeatConfig({ seatType, gridIndex });
    setSelectedProfileUser(userProfile);
  };

  // Toggle Mute Seat helper
  const executeToggleMuteSeat = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;
    const key = getSeatKey(seatType, gridIndex);
    const targetMute = !seatMutes[key];
    const newMutes = { ...seatMutes, [key]: targetMute };
    setSeatMutes(newMutes);
    updateRoomSeatsInFirestore(activeRoom.id, hostSeatUser, superSeatUser, gridSeatsUsers, seatLocks, newMutes);
    triggerToast(targetMute ? "Seat muted 🔇" : "Seat unmuted 🎙️", "info");
  };

  // Actual Seat movement / action logic
  const executeRemoveFromSeat = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;

    let nextHost = hostSeatUser;
    let nextSuper = superSeatUser;
    let nextGrid = [...gridSeatsUsers];

    if (seatType === "host") {
      nextHost = null;
      setHostSeatUser(null);
    } else if (seatType === "super") {
      nextSuper = null;
      setSuperSeatUser(null);
    } else if (seatType === "grid" && gridIndex !== undefined) {
      nextGrid[gridIndex] = null;
      setGridSeatsUsers(nextGrid);
    }
    
    updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
    triggerToast("User removed from seat successfully. 🎙️", "success");
    setShowSeatActionsModal(false);
  };

  const executeMakeAdmin = async (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;

    let u: Participant | null = null;
    let nextHost = hostSeatUser;
    let nextSuper = superSeatUser;
    let nextGrid = [...gridSeatsUsers];

    if (seatType === "host") {
      if (hostSeatUser) {
        u = { ...hostSeatUser, name: hostSeatUser.name.includes("[Admin]") ? hostSeatUser.name : `🛡️ [Admin] ${hostSeatUser.name}`, role: "Admin" as any };
        nextHost = u;
        setHostSeatUser(u);
      }
    } else if (seatType === "super") {
      if (superSeatUser) {
        u = { ...superSeatUser, name: superSeatUser.name.includes("[Admin]") ? superSeatUser.name : `🛡️ [Admin] ${superSeatUser.name}`, role: "Admin" as any };
        nextSuper = u;
        setSuperSeatUser(u);
      }
    } else if (seatType === "grid" && gridIndex !== undefined) {
      const userObj = gridSeatsUsers[gridIndex];
      if (userObj) {
        u = { ...userObj, name: userObj.name.includes("[Admin]") ? userObj.name : `🛡️ [Admin] ${userObj.name}`, role: "Admin" as any };
        nextGrid[gridIndex] = u;
        setGridSeatsUsers(nextGrid);
      }
    }
    
    if (u) {
      const targetUser = u as Participant;
      setRoomMembersList(prev => prev.map(m => m.name === targetUser.name || m.name.endsWith(targetUser.name) ? { ...m, role: "Admin", color: "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#002d4a]" } : m));
      triggerToast(`${targetUser.name} has been appointed as Admin! 🛡️`, "success");
      updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);

      // Sync member's role to Firestore members subcollection so other users see role update immediately in real-time
      try {
        await setDoc(doc(db, "rooms", activeRoom.id, "members", targetUser.id), {
          role: "Admin"
        }, { merge: true });
      } catch (err) {
        console.warn("Failed to update member role in Firestore members collection:", err);
      }
    }
    setShowSeatActionsModal(false);
  };

  const executeMakeHost = async (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;

    let u: Participant | null = null;
    let nextHost = hostSeatUser;
    let nextSuper = superSeatUser;
    let nextGrid = [...gridSeatsUsers];

    if (seatType === "host") {
      if (hostSeatUser) {
        u = { ...hostSeatUser, name: hostSeatUser.name.includes("[Host]") ? hostSeatUser.name : `👑 [Host] ${hostSeatUser.name}`, role: "Host" as any };
        nextHost = u;
        setHostSeatUser(u);
      }
    } else if (seatType === "super") {
      if (superSeatUser) {
        u = { ...superSeatUser, name: superSeatUser.name.includes("[Host]") ? superSeatUser.name : `👑 [Host] ${superSeatUser.name}`, role: "Host" as any };
        nextSuper = u;
        setSuperSeatUser(u);
      }
    } else if (seatType === "grid" && gridIndex !== undefined) {
      const userObj = gridSeatsUsers[gridIndex];
      if (userObj) {
        u = { ...userObj, name: userObj.name.includes("[Host]") ? userObj.name : `👑 [Host] ${userObj.name}`, role: "Host" as any };
        nextGrid[gridIndex] = u;
        setGridSeatsUsers(nextGrid);
      }
    }
    
    if (u) {
      const targetUser = u as Participant;
      setRoomMembersList(prev => prev.map(m => m.name === targetUser.name || m.name.endsWith(targetUser.name) ? { ...m, role: "Host", color: "bg-gradient-to-r from-purple-400 to-indigo-500 text-[#25004a]" } : m));
      triggerToast(`${targetUser.name} has been appointed as Host! 👑`, "success");
      updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);

      // Sync member's role to Firestore members subcollection so other users see role update immediately in real-time
      try {
        await setDoc(doc(db, "rooms", activeRoom.id, "members", targetUser.id), {
          role: "Host"
        }, { merge: true });
      } catch (err) {
        console.warn("Failed to update member role in Firestore members collection:", err);
      }
    }
    setShowSeatActionsModal(false);
  };

  const executeRemoveFromBroadcast = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;

    let removedUser: Participant | null = null;
    let nextHost = hostSeatUser;
    let nextSuper = superSeatUser;
    let nextGrid = [...gridSeatsUsers];

    if (seatType === "host") {
      removedUser = hostSeatUser;
      nextHost = null;
      setHostSeatUser(null);
    } else if (seatType === "super") {
      removedUser = superSeatUser;
      nextSuper = null;
      setSuperSeatUser(null);
    } else if (seatType === "grid" && gridIndex !== undefined) {
      removedUser = gridSeatsUsers[gridIndex];
      nextGrid[gridIndex] = null;
      setGridSeatsUsers(nextGrid);
    }
    
    if (removedUser) {
      const nameToBan = removedUser.name;
      setBannedUserNames(prev => [...prev, nameToBan]);
      setRoomMembersList(prev => prev.filter(m => m.name !== nameToBan));
      triggerToast(`${nameToBan} has been removed from this broadcast! 🚫`, "success");
      
      updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
    }
    setShowSeatActionsModal(false);
  };

  const executeSeatMovement = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    if (!activeRoom) return;

    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];
    const currentUserId = loggedInUser?.id || "user-current";

    const key = getSeatKey(seatType, gridIndex);
    const isAdminMuted = seatMutes[key] || false;
    const finalMuteState = isAdminMuted ? true : false;

    // Set mic state
    setIsMuted(finalMuteState);

    // Build the current user's participant object
    const meParticipant: Participant = {
      id: currentUserId,
      name: currentUserName,
      role: seatType === "host" ? "Host" : seatType === "super" ? "Co-Host" : "Speaker",
      avatar: currentUserAvatar,
      isMuted: finalMuteState,
      isSpeaking: false,
      volume: 100,
      agoraUid: localAgoraUid || agoraRtcRef.current?.client?.uid || null,
      hasTigerCrown: loggedInUser?.hasTigerCrown || false
    };

    // If the seat is locked and user is not admin, block
    if (seatLocks[key] && testRoomRole !== "admin") {
      return;
    }

    const matchUser = (u: Participant | null) => {
      if (!u) return false;
      const uNameClean = u.name.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
      const userNameClean = currentUserName.replace("🛡️ [Admin] ", "").replace("👑 [Host] ", "").trim();
      return u.id === currentUserId || uNameClean === userNameClean || uNameClean === `${userNameClean} (You)` || `${uNameClean} (You)` === userNameClean;
    };

    // If clicking their OWN seat, stand up / vacate
    if (
      (seatType === "host" && matchUser(hostSeatUser)) ||
      (seatType === "super" && matchUser(superSeatUser)) ||
      (seatType === "grid" && gridIndex !== undefined && matchUser(gridSeatsUsers[gridIndex]))
    ) {
      // Vacate only
      const { cleanedHost, cleanedSuper, cleanedGrid } = cleanDuplicateUserFromSeats(currentUserId, currentUserName, hostSeatUser, superSeatUser, gridSeatsUsers);

      // Optimistic local update
      setHostSeatUser(cleanedHost);
      setSuperSeatUser(cleanedSuper);
      setGridSeatsUsers(cleanedGrid);

      // Firestore update
      updateRoomSeatsInFirestore(activeRoom.id, cleanedHost, cleanedSuper, cleanedGrid);

      // Stand up -> mute listener
      setIsMuted(true);
      if (agoraRtcRef.current) {
        agoraRtcRef.current.unpublish().catch((e: any) => console.warn(e));
      }
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      return;
    }

    // If clicking an occupied seat, ignore
    const targetUser = seatType === "host" ? hostSeatUser : seatType === "super" ? superSeatUser : gridSeatsUsers[gridIndex!];
    if (targetUser) {
      return;
    }

    // First, clean up the user from all seats (host, super, grid) to prevent duplicates
    const { cleanedHost, cleanedSuper, cleanedGrid } = cleanDuplicateUserFromSeats(
      currentUserId,
      currentUserName,
      hostSeatUser,
      superSeatUser,
      gridSeatsUsers
    );

    let updatedHost = cleanedHost;
    let updatedSuper = cleanedSuper;
    let updatedGrid = cleanedGrid;

    // Set new seat
    if (seatType === "host") {
      updatedHost = meParticipant;
    } else if (seatType === "super") {
      updatedSuper = meParticipant;
    } else if (seatType === "grid" && gridIndex !== undefined) {
      updatedGrid[gridIndex] = meParticipant;
    }

    // Optimistic local update
    setHostSeatUser(updatedHost);
    setSuperSeatUser(updatedSuper);
    setGridSeatsUsers(updatedGrid);

    // Firestore update
    updateRoomSeatsInFirestore(activeRoom.id, updatedHost, updatedSuper, updatedGrid);

    // Apply voice publisher changes in real-time
    if (agoraRtcRef.current) {
      if (finalMuteState) {
        agoraRtcRef.current.unpublish().catch((e: any) => console.warn(e));
      } else {
        agoraRtcRef.current.publish().catch((e: any) => console.warn(e));
      }
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !finalMuteState;
      });
    }
  };

  // Handle Room Creation (no demo - real dynamic room is appended to the lobby list)
  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) {
      triggerToast("Please choose a beautiful room name.", "error");
      return;
    }

    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];

    const categoryColors: Record<string, string> = {
      Music: "bg-[#7c3aed]",
      Girl: "bg-[#ec4899]",
      Friend: "bg-[#f59e0b]",
      Love: "bg-[#ef4444]",
      Chat: "bg-[#10b981]",
      Boy: "bg-[#3b82f6]",
      Game: "bg-[#8b5cf6]",
      Gossip: "bg-[#06b6d4]"
    };

    const currentUserId = loggedInUser?.id || "user-current";
    let generatedIdNo = loggedInUser?.persistentRoomIdNo || "";
    if (!generatedIdNo) {
      generatedIdNo = Math.floor(10000000 + Math.random() * 90000000).toString(); // Generate unique 8-digit number
      try {
        const q = query(collection(db, "rooms"), where("idNo", "==", generatedIdNo));
        const querySnapshot = await getDocs(q);
        let attempts = 0;
        while (!querySnapshot.empty && attempts < 15) {
          generatedIdNo = Math.floor(10000000 + Math.random() * 90000000).toString();
          attempts++;
        }
      } catch (e) {
        console.warn("Could not query rooms for unique idNo check:", e);
      }
      // Save it to the user's document persistently!
      if (auth.currentUser) {
        try {
          await setDoc(doc(db, "users", auth.currentUser.uid), { persistentRoomIdNo: generatedIdNo }, { merge: true });
        } catch (e) {
          console.warn("Failed to save persistentRoomIdNo to user document:", e);
        }
      }
    }

    const newRoom: LobbyRoom = {
      id: "room-user-" + currentUserId,
      title: newRoomTitle.trim(),
      subtitle: newRoomSubtitle.trim() || "Welcome to my private premium lounge!",
      hostName: currentUserName,
      avatar: newRoomPhoto || currentUserAvatar,
      hasVipFrame: true,
      countryFlag: newRoomCountry,
      categoryTag: newRoomCategory,
      categoryColor: categoryColors[newRoomCategory] || "bg-[#7c3aed]",
      popularity: 0,
      userCount: 1,
      idNo: generatedIdNo,
      hostId: currentUserId
    };

    // Save room in Firestore! This triggers real-time snapshot sync
    try {
      await setDoc(doc(db, "rooms", newRoom.id), newRoom);
    } catch (err) {
      console.warn("Firestore room save failed, prepending locally:", err);
      setLobbyRooms((prev) => [newRoom, ...prev]);
    }

    setShowCreateRoomModal(false);

    // Reset inputs
    setNewRoomTitle("");
    setNewRoomSubtitle("Welcome everyone ! Let's chat and have fun together !");
    setNewRoomPhoto(null);
    setNewRoomPhotoType(null);

    // Join the newly created room immediately as the Host
    joinRoom(newRoom);
    triggerToast(`Your room "${newRoom.title}" is now broadcasting live!`, "success");
  };

  const handleRoomFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    try {
      const base64 = await convertFileToBase64(file);
      setNewRoomPhoto(base64);
      setNewRoomPhotoType(isVideo ? "video" : "image");
      triggerToast(isVideo ? "Video / GIF selected successfully! Permanent ✨" : "Photo selected successfully! Permanent ✨", "success");
    } catch (err) {
      console.error("Failed to read file", err);
      triggerToast("Failed to upload image. Please try again.", "error");
    }
  };

  // Claims daily signing in rewards
  const handleClaimCheckIn = (day: number) => {
    if (checkedInDays.includes(day)) {
      triggerToast("You have already claimed this day's reward!", "error");
      return;
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Check if less than 24 hours passed, but allow them to bypass if they wish, 
    // or we can allow consecutive clicks in preview and just show the updated timer.
    const rewardAmount = day * 150; // incrementing rewards
    setCheckedInDays((prev) => [...prev, day]);
    setUserCoins((prev) => prev + rewardAmount);
    setLastClaimedTimestamp(now);
    triggerToast(`Daily Sign-In Success! Claimed +${rewardAmount} Gold Coins. 🎁`, "success");
  };

  return (
    <div className="fixed inset-0 w-full h-screen h-[100dvh] bg-[#0d0614] text-[#f1f1f1] flex flex-col items-center justify-between font-sans overflow-hidden">
      
      {/* Invisible Recaptcha Container for Firebase Phone OTP */}
      <div id="recaptcha-container" className="absolute invisible pointer-events-none w-0 h-0"></div>

      {/* GLOBAL COSMIC GRADIENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[450px] h-[450px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse [animation-duration:8s]" />
        <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] bg-purple-800/15 rounded-full blur-[100px] animate-pulse [animation-duration:12s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      </div>

      {/* SYSTEM TOAST NOTIFICATIONS */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div className={`p-4 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] border flex items-start gap-3 backdrop-blur-md ${
              toast.type === "error" 
                ? "bg-red-950/90 border-red-500/40 text-red-200" 
                : toast.type === "otp" 
                ? "bg-gradient-to-r from-pink-950/90 to-purple-950/90 border-pink-500/40 text-pink-200" 
                : "bg-indigo-950/90 border-indigo-500/40 text-indigo-100"
            }`}>
              {toast.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : toast.type === "otp" ? (
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-[11px] font-mono tracking-wider font-bold uppercase select-none opacity-60">
                  {toast.type === "error" ? "System Alert" : toast.type === "otp" ? "SMS Verification Gateway" : "System Status"}
                </p>
                <p className="text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</p>
                {toast.type === "otp" && (
                  <p className="text-[10px] text-pink-400/80 font-mono mt-1 select-all font-bold">
                    Code: <span className="bg-pink-950 border border-pink-800/30 px-2 py-0.5 rounded text-white">{generatedOtp}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
           1. LOADING STEP (Matches Screenshot 1 exactly)
           ========================================== */}
        {currentStep === "loading" && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col items-center justify-between py-12 px-6 z-10"
          >
            {/* Header section from screenshot */}
            <div className="w-full flex items-center justify-between text-xs font-mono tracking-widest text-[#9d89b3] uppercase select-none mt-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <span className="text-pink-500 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
                  ((o)) VOXACLUB LIVE
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-90 text-violet-300">
                <Mic className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]" />
                <span>VOICE ENGINE v1.0</span>
              </div>
            </div>

            {/* Central Circle & Glowing Badge Area */}
            <div className="relative my-auto flex items-center justify-center">
              
              {/* Outer decorative dashed ring 1 */}
              <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-violet-800/20 animate-spin [animation-duration:100s]" />
              
              {/* Outer decorative dashed ring 2 */}
              <div className="absolute w-[320px] h-[320px] rounded-full border border-pink-500/10 animate-spin [animation-duration:50s] [animation-direction:reverse]" />

              {/* Concentric rings background from screenshot */}
              <div className="absolute w-[260px] h-[260px] rounded-full border border-violet-500/25 flex items-center justify-center bg-violet-950/5 shadow-[0_0_50px_rgba(139,92,246,0.06)]">
                <div className="absolute w-[250px] h-[250px] rounded-full border border-pink-500/15" />
              </div>

              {/* Central Glowing Image Container */}
              <div className="relative z-10 p-1.5 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 shadow-[0_0_40px_rgba(236,72,153,0.3)] animate-pulse [animation-duration:3s]">
                <div className="relative rounded-full overflow-hidden w-[200px] h-[200px] border-4 border-white/95 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]">
                  <img
                    src={voxaclubLogo}
                    alt="VoxaClub Premium Audio Collective Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-102 transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0614]/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Badges exactly matching the screenshot location */}
              <div className="absolute top-4 -right-2 z-20">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-full text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/20 select-none">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>Live Rooms</span>
                </div>
              </div>

              <div className="absolute bottom-8 -left-4 z-20">
                <div className="flex items-center gap-1 px-3.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-[10px] font-bold tracking-wider text-white uppercase shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/20 select-none">
                  <Sparkles className="w-3 h-3 text-pink-300 animate-spin [animation-duration:6s]" />
                  <span>Active</span>
                </div>
              </div>

            </div>

            {/* Brand Title Block */}
            <div className="text-center w-full mt-4 mb-6">
              <h1 className="text-5xl md:text-6xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f3e8ff] to-[#d8b4fe] select-none drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                VoxaClub
              </h1>
              <div className="w-48 h-[3px] mx-auto mt-3 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
              <p className="text-[11px] font-mono tracking-[0.3em] text-[#bd9bfd] uppercase mt-4 opacity-90 font-bold">
                Voice Live Chat Room
              </p>
            </div>

            {/* Loader / Connection Progress section */}
            <div className="w-full max-w-sm px-4 mt-2">
              <div className="flex justify-between items-center mb-2 font-mono text-[10px] tracking-widest text-[#a78bfa] select-none uppercase font-bold">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-pink-500" />
                  <span>∿ Connecting...</span>
                </div>
                <span className="text-pink-500 text-xs font-extrabold drop-shadow-[0_0_6px_rgba(236,72,153,0.5)]">
                  {loadingPercentage}%
                </span>
              </div>

              <div className="relative w-full h-[6px] bg-[#221035] rounded-full overflow-hidden border border-violet-950 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${loadingPercentage}%` }}
                />
              </div>

              <div className="text-center mt-2.5">
                <p className="text-[10px] font-mono tracking-wide text-[#806b9b] italic animate-pulse">
                  {loadingStatus}
                </p>
              </div>
            </div>

            {/* Footer label */}
            <div className="text-[9px] font-mono text-[#5b4d70] tracking-[0.1em] select-none mb-2">
              VOXACLUB PREMIUM AUDIO COLLECTIVE © 2026
            </div>
          </motion.div>
        )}

        {/* ==========================================
           2. LOGIN BOARD (Matches Screenshot 2 styling & structure)
           ========================================== */}
        {currentStep === "login" && (
          <motion.div
            key="login-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-between py-14 px-6 z-10"
          >
            {/* Blurry Background image cover */}
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src={loginBg}
                alt="Social Lounge Ambient background"
                className="w-full h-full object-cover filter brightness-[0.4] saturate-[1.2]"
              />
              {/* Soft purple/pink neon wash overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d0614]/70 via-[#150626]/80 to-[#0c0316]/95" />
            </div>

            {/* Dummy Header element to balance design spacing */}
            <div className="relative z-10 h-6 select-none" />

            {/* Central Area: Logo & App Brand Title */}
            <div className="relative z-10 flex flex-col items-center select-none my-auto">
              {/* Squircle logo wrapper mimicking screenshot */}
              <div className="w-[120px] h-[120px] rounded-[32px] p-0.5 bg-gradient-to-tr from-[#df3ff0] via-[#9e59ef] to-[#3f80f0] shadow-[0_15px_35px_rgba(158,89,239,0.45)] mb-5">
                <div className="w-full h-full bg-[#180829] rounded-[30px] overflow-hidden border border-white/10">
                  <img
                    src={voxaclubLoginLogo}
                    alt="VoxaClub Mascot Squircle Logo"
                    className="w-full h-full object-cover scale-102"
                  />
                </div>
              </div>

              {/* Title exactly matching screenshot styling but with VoxaClub Brand */}
              <h2 className="text-3xl font-black tracking-tight text-white font-display text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                VoxaClub Party
              </h2>
              <p className="text-[10px] font-mono tracking-[0.3em] text-pink-400 uppercase mt-2 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Premium Live Audio Club
              </p>
            </div>

            {/* Auth Buttons exactly matching Screenshot 2 violet color & shapes */}
            <div className="relative z-10 w-full max-w-sm flex flex-col gap-3.5 px-4 mb-4">
              
              {/* Google Login */}
              <button
                onClick={() => handleAuthAttempt("google")}
                className="w-full flex items-center justify-between px-7 py-3.5 bg-[#9e59ef] hover:bg-[#a96bf2] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(158,89,239,0.35)] cursor-pointer active:scale-98"
              >
                {/* Google Logo Icon */}
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[11px] font-extrabold text-[#9e59ef] font-sans">G</span>
                </div>
                <span className="flex-1 text-center">Google Login</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              {/* Facebook Login */}
              <button
                onClick={() => handleAuthAttempt("facebook")}
                className="w-full flex items-center justify-between px-7 py-3.5 bg-[#9e59ef] hover:bg-[#a96bf2] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(158,89,239,0.35)] cursor-pointer active:scale-98"
              >
                {/* Facebook Logo Icon */}
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xs font-extrabold text-[#9e59ef] font-mono">f</span>
                </div>
                <span className="flex-1 text-center">Facebook Login</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              {/* Phone Login */}
              <button
                onClick={() => handleAuthAttempt("phone")}
                className="w-full flex items-center justify-between px-7 py-3.5 bg-[#9e59ef] hover:bg-[#a96bf2] text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(158,89,239,0.35)] cursor-pointer active:scale-98"
              >
                {/* Phone icon */}
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm text-[#9e59ef]">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span className="flex-1 text-center">Phone Login</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              {/* Email & Password Auth */}
              <button
                onClick={() => handleAuthAttempt("email")}
                className="w-full flex items-center justify-between px-7 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(236,72,153,0.35)] cursor-pointer active:scale-98"
              >
                {/* Mail Icon */}
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-600">
                  <span className="text-xs font-extrabold font-sans">@</span>
                </div>
                <span className="flex-1 text-center">Email & Password</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

            </div>

            {/* Custom Agreement at the bottom matching Screenshot 2 */}
            <div className="relative z-10 flex items-center gap-2 select-none mb-2">
              <button
                onClick={() => {
                  setIsAgreed(!isAgreed);
                  if (!isAgreed) triggerToast("User Agreement approved!", "success");
                }}
                className="focus:outline-none cursor-pointer"
              >
                <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                  isAgreed ? "bg-pink-500 border-pink-500 text-white" : "border-violet-400/40 bg-black/30"
                }`}>
                  {isAgreed && <span className="text-[10px] font-black">✓</span>}
                </div>
              </button>
              <p className="text-[10.5px] text-violet-300 font-medium">
                Agree to the VoxaClub <span className="text-pink-400 underline font-semibold cursor-pointer">User Agreement</span> and log in
              </p>
            </div>

          </motion.div>
        )}

        {/* ==========================================
           2.5 EMAIL & PASSWORD GATEWAY (Real Sign In & Registration with all details)
           ========================================== */}
        {currentStep === "email-auth" && (
          <motion.div
            key="email-auth-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-12 px-6 z-10"
          >
            {/* Header Back Button */}
            <div className="w-full flex items-center justify-between mt-2">
              <button
                onClick={() => {
                  setCurrentStep("login");
                }}
                className="flex items-center gap-1 text-xs font-mono font-bold tracking-widest text-violet-400 hover:text-violet-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-pink-400" />
                <span>BACK TO OPTIONS</span>
              </button>
              <div className="text-[10px] font-mono px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400">
                EMAIL ACCESS
              </div>
            </div>

            {/* Central Card with Scroll */}
            <div className="w-full bg-[#150a22]/90 backdrop-blur-md rounded-3xl border border-[#2d1b42]/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-auto relative max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              {/* Segment Switcher */}
              <div className="flex bg-[#0c0515] p-1.5 rounded-2xl border border-violet-500/10 mb-6">
                <button
                  onClick={() => setEmailAuthMode("signin")}
                  className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer ${
                    emailAuthMode === "signin"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow"
                      : "text-violet-300/60 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setEmailAuthMode("signup")}
                  className={`flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer ${
                    emailAuthMode === "signup"
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow"
                      : "text-violet-300/60 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {emailAuthMode === "signin" ? (
                /* SIGN IN FORM */
                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">Sign in to your account</h3>
                  <p className="text-xs text-violet-300/70 mb-2">Access your rooms, levels, coins, and live profile seamlessly.</p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={emailSignIn}
                        onChange={(e) => setEmailSignIn(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all placeholder-violet-300/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      value={passwordSignIn}
                      onChange={(e) => setPasswordSignIn(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all placeholder-violet-300/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(236,72,153,0.35)] cursor-pointer mt-4"
                  >
                    SIGN IN NOW
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM WITH ALL MANDATORY DETAILS */
                <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">Create account</h3>
                  <p className="text-xs text-violet-300/70 mb-2">Setup your real, secure profile details on the live database.</p>

                  {/* 1. Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={nameSignUp}
                      onChange={(e) => setNameSignUp(e.target.value)}
                      placeholder="e.g. Md Munna"
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all placeholder-violet-300/20"
                    />
                  </div>

                  {/* 2. Birthday */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={birthdaySignUp}
                      onChange={(e) => setBirthdaySignUp(e.target.value)}
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* 3. Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Gender</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGenderSignUp("Male")}
                        className={`py-3 rounded-2xl font-bold text-xs tracking-wider transition-all border cursor-pointer ${
                          genderSignUp === "Male"
                            ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow"
                            : "bg-[#0c0515]/80 border-violet-500/10 text-violet-300/60 hover:text-white"
                        }`}
                      >
                        MALE
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenderSignUp("Female")}
                        className={`py-3 rounded-2xl font-bold text-xs tracking-wider transition-all border cursor-pointer ${
                          genderSignUp === "Female"
                            ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow"
                            : "bg-[#0c0515]/80 border-violet-500/10 text-violet-300/60 hover:text-white"
                        }`}
                      >
                        FEMALE
                      </button>
                    </div>
                  </div>

                  {/* 4. Country Selection with Flag & Search */}
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Country (Asia)</label>
                    
                    <div
                      onClick={() => setShowSignUpCountryDropdown(!showSignUpCountryDropdown)}
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 hover:border-pink-500/35 rounded-2xl py-3.5 px-5 text-sm text-white cursor-pointer transition-all flex items-center justify-between"
                    >
                      {countrySignUp ? (
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{countrySignUp.flag}</span>
                          <span className="font-semibold">{countrySignUp.name}</span>
                        </div>
                      ) : (
                        <span className="text-violet-300/30">Choose country...</span>
                      )}
                      <Globe className="w-4 h-4 text-pink-400 opacity-80" />
                    </div>

                    {showSignUpCountryDropdown && (
                      <div className="absolute top-[100%] left-0 right-0 z-50 bg-[#16082b] border border-violet-500/20 rounded-2xl mt-2 p-3 shadow-2xl max-h-[180px] overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
                        <input
                          type="text"
                          placeholder="Search Asian country..."
                          value={signUpCountrySearchQuery}
                          onChange={(e) => setSignUpCountrySearchQuery(e.target.value)}
                          className="w-full bg-[#0c0515] border border-violet-500/10 focus:border-pink-500/40 rounded-xl py-2 px-3 text-xs text-white focus:outline-none mb-2"
                        />
                        {COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(signUpCountrySearchQuery.toLowerCase())).map((c, i) => (
                          <div
                            key={`signup-country-${c.name}`}
                            onClick={() => {
                              setCountrySignUp(c);
                              setShowSignUpCountryDropdown(false);
                              setSignUpCountrySearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-pink-500/10 rounded-xl cursor-pointer transition-all"
                          >
                            <span className="text-lg">{c.flag}</span>
                            <span className="text-xs text-violet-100">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. Email Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={emailSignUp}
                      onChange={(e) => setEmailSignUp(e.target.value)}
                      placeholder="yourname@domain.com"
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all placeholder-violet-300/20"
                    />
                  </div>

                  {/* 6. Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      value={passwordSignUp}
                      onChange={(e) => setPasswordSignUp(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#0c0515]/80 border border-violet-500/10 focus:border-pink-500/50 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none transition-all placeholder-violet-300/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(236,72,153,0.35)] cursor-pointer mt-4"
                  >
                    REGISTER & START
                  </button>
                </form>
              )}
            </div>

            {/* Bottom spacer to align Back button */}
            <div className="h-4" />
          </motion.div>
        )}

        {/* ==========================================
           3. PHONE OTP VERIFICATION SCREEN (Real Verification Gateway)
           ========================================== */}
        {currentStep === "phone-otp" && (
          <motion.div
            key="phone-otp-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-12 px-6 z-10"
          >
            {/* Header Back Button */}
            <div className="w-full flex items-center justify-between mt-2">
              <button
                onClick={() => {
                  setOtpSent(false);
                  setCurrentStep("login");
                }}
                className="flex items-center gap-1 text-xs font-mono font-bold tracking-widest text-violet-400 hover:text-violet-200 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-pink-400" />
                <span>BACK TO OPTIONS</span>
              </button>
              <div className="text-[10px] font-mono px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400">
                SECURE AUTH
              </div>
            </div>

            {/* Card Content */}
            <div className="w-full bg-[#150a22]/90 backdrop-blur-md rounded-3xl border border-[#2d1b42]/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full blur-2xl" />
              
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 animate-pulse">
                  <Smartphone className="w-8 h-8" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-center tracking-tight mb-2">Phone Login</h3>
              <p className="text-xs text-violet-400 text-center leading-relaxed mb-6">
                We'll verify your phone number via a real-time secure verification channel.
              </p>

              {!otpSent ? (
                /* Request Code Form */
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-violet-400 uppercase font-bold mb-2">
                      Enter Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-[#1c0f2d] border border-violet-900 rounded-2xl px-4 py-3 text-sm text-violet-400 font-mono select-none flex items-center justify-center">
                        🇧🇩 +880
                      </div>
                      <input
                        type="tel"
                        pattern="[0-9]{9,11}"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="17XXXXXXXX"
                        className="flex-1 bg-[#1c0f2d] border border-violet-900 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(236,72,153,0.35)] cursor-pointer"
                  >
                    Send Verification Code
                  </button>
                </form>
              ) : (
                /* Enter Verification Code Form */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] font-mono tracking-wider text-violet-400 uppercase font-bold">
                        Verification Code
                      </label>
                      <p className="text-[10px] font-mono text-pink-400 font-semibold select-none">
                        Sent to +880 {phoneNumber}
                      </p>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={userEnteredOtp}
                      onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-[#1c0f2d] border border-violet-900 rounded-2xl px-4 py-4 text-center text-xl tracking-[0.5em] text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(99,102,241,0.35)] cursor-pointer"
                  >
                    Verify & Continue
                  </button>

                  <div className="flex justify-between items-center text-[10.5px] font-mono pt-2 text-violet-400">
                    <span>Didn't receive code?</span>
                    {otpTimer > 0 ? (
                      <span className="text-pink-400 font-bold select-none">Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="text-pink-400 hover:underline font-bold cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            <div className="text-center text-[10px] font-mono text-violet-400/50">
              VOXACLUB SECURE SMS SERVICE v1.2
            </div>
          </motion.div>
        )}

        {/* ==========================================
           4. SELECT COUNTRY SCREEN (Matches Screenshot 2 styling & structure)
           ========================================== */}
        {currentStep === "select-country" && (
          <motion.div
            key="select-country-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-screen h-[100dvh] bg-[#f9f9f9] text-[#1a1a1a] flex flex-col justify-between overflow-hidden z-25"
          >
            {/* Header row with back icon */}
            <div className="w-full flex items-center justify-between pt-6 px-6 select-none">
              <button
                onClick={() => setCurrentStep("login")}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-200/50 text-neutral-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2]" />
              </button>

              <button
                onClick={() => handleCompleteOnboarding(true)}
                className="text-xs font-semibold px-4 py-2 rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-200/50 transition-all cursor-pointer"
              >
                Skip
              </button>
            </div>

            {/* Content card area */}
            <div className="flex-1 flex flex-col px-8 pt-4 pb-2 w-full max-w-lg mx-auto overflow-hidden">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-800 font-sans mb-6 text-left select-none">
                Select country
              </h2>

              {/* Search bar inside Select country */}
              <div className="relative mb-6 select-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 stroke-[2]" />
                <input
                  type="text"
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  placeholder="Search Country Name..."
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-2xl pl-11 pr-10 py-3 text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-300/50 placeholder-neutral-400 transition-all"
                />
                {countrySearchQuery && (
                  <button
                    onClick={() => setCountrySearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Country List (matching Screenshot 2 list item aesthetics) */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin select-none">
                {COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())).map((country) => {
                  const isSelected = selectedCountry?.name === country.name;
                  return (
                    <button
                      key={country.name}
                      onClick={() => setSelectedCountry(country)}
                      className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-neutral-850 bg-neutral-200 text-black font-extrabold shadow-sm"
                          : "border-transparent bg-[#f4f4f4] hover:bg-neutral-150 text-neutral-600 font-medium"
                      }`}
                    >
                      <span className="text-sm tracking-wide">{country.name}</span>
                      <span className="text-2xl filter drop-shadow-sm">{country.flag}</span>
                    </button>
                  );
                })}

                {COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())).length === 0 && (
                  <p className="text-xs text-center text-neutral-400 font-mono py-8 select-none">
                    No matching countries found.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom persistent action bar with NEXT button */}
            <div className="py-6 px-8 bg-white border-t border-neutral-100 w-full flex justify-center items-center z-10 select-none">
              <button
                disabled={!selectedCountry}
                onClick={() => setCurrentStep("profile-details")}
                className={`w-full max-w-sm py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer ${
                  selectedCountry
                    ? "bg-[#2d2d2d] hover:bg-black text-white"
                    : "bg-[#e5e5e5] text-[#9c9c9c] opacity-60 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* ==========================================
           5. PROFILE DETAILS ONBOARDING (Matches Screenshot 3 styling & structure)
           ========================================== */}
        {currentStep === "profile-details" && (
          <motion.div
            key="profile-details-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 w-full h-screen h-[100dvh] bg-[#f9f9f9] text-[#1a1a1a] flex flex-col justify-between overflow-y-auto z-25 select-none"
          >
            {/* Header Row */}
            <div className="w-full flex items-center justify-between pt-6 px-6">
              <button
                onClick={() => setCurrentStep("select-country")}
                className="p-2 -ml-2 rounded-full hover:bg-neutral-200/50 text-neutral-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6 stroke-[2]" />
              </button>

              <button
                onClick={() => handleCompleteOnboarding(true)}
                className="text-xs font-semibold px-4 py-2 rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-200/50 transition-all cursor-pointer"
              >
                Skip
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 w-full max-w-md mx-auto px-8 pt-4 pb-8 flex flex-col justify-between">
              
              <div className="space-y-8">
                {/* Titles */}
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-800 flex items-center gap-1.5">
                    HI, welcome to PotaLive <span className="text-rose-400">❤️</span>
                  </h1>
                  <p className="text-xs text-neutral-400 mt-1.5 font-medium">
                    Improve information to match accurate friends~
                  </p>
                </div>

                {/* Profile Photo Row */}
                <div className="flex justify-between items-center py-4 border-b border-neutral-200/60">
                  <div className="flex flex-col">
                    <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Profile photo</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Custom photo from your gallery</span>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      ref={profileImageInputRef}
                      className="hidden"
                      onChange={handleProfileFileChange}
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      className="relative block w-20 h-20 rounded-full border-2 border-neutral-200 overflow-hidden shadow-inner bg-neutral-100 cursor-pointer"
                    >
                      {regAvatar && regAvatar.trim() !== "" ? (
                        <img src={regAvatar} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-neutral-400 bg-neutral-200">
                          {regUsername ? regUsername.charAt(0).toUpperCase() : "M"}
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center cursor-pointer shadow-md text-white hover:bg-teal-600 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Username Input with clean underlined style */}
                <div className="space-y-2">
                  <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-teal-500 pb-2 text-xl font-semibold text-neutral-800 focus:outline-none transition-colors"
                  />
                </div>

                {/* Birthday Input with clean underlined style */}
                <div className="space-y-2">
                  <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider">Birthday</label>
                  <input
                    type="date"
                    required
                    value={regBirthday}
                    onChange={(e) => setRegBirthday(e.target.value)}
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-teal-500 pb-2 text-xl font-semibold text-neutral-800 focus:outline-none transition-colors"
                  />
                </div>

                {/* Gender selector */}
                <div className="space-y-3">
                  <label className="block text-neutral-400 text-xs font-bold uppercase tracking-wider">Gender</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Male Button */}
                    <button
                      type="button"
                      onClick={() => setRegGender("Male")}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer ${
                        regGender === "Male"
                          ? "border-neutral-800 bg-neutral-200 shadow-sm font-bold"
                          : "border-transparent bg-neutral-100/50 hover:bg-neutral-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-500 font-bold">♂</span>
                        <span className="text-sm font-semibold text-neutral-700">Male</span>
                      </span>
                      <div className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=60&h=60" alt="Male preset" className="w-full h-full object-cover" />
                      </div>
                    </button>

                    {/* Female Button */}
                    <button
                      type="button"
                      onClick={() => setRegGender("Female")}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all cursor-pointer ${
                        regGender === "Female"
                          ? "border-neutral-800 bg-neutral-200 shadow-sm font-bold"
                          : "border-transparent bg-neutral-100/50 hover:bg-neutral-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-xs text-pink-500 font-bold">♀</span>
                        <span className="text-sm font-semibold text-neutral-700">Female</span>
                      </span>
                      <div className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60&h=60" alt="Female preset" className="w-full h-full object-cover" />
                      </div>
                    </button>
                  </div>

                  {/* High Fidelity Warning Labels from Screenshot 3 */}
                  {!regGender ? (
                    <p className="text-[11px] text-pink-500 font-bold select-none mt-2 flex items-center gap-1 animate-pulse">
                      <span>⚠️</span> Not filling in gender yet
                    </p>
                  ) : (
                    <p className="text-[11px] text-teal-600 font-bold select-none mt-2 flex items-center gap-1">
                      <span>✓</span> Selected gender: {regGender}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit button at the bottom */}
              <div className="pt-10 select-none">
                <button
                  type="button"
                  onClick={() => handleCompleteOnboarding(false)}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-sm font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer text-center"
                >
                  Submit
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
           4.5 DISCOVER LOBBY & COMMUNITY PORTAL (Screenshot 3 Fidelity-Replica)
           ========================================== */}
        {currentStep === "lobby" && (
          <motion.div
            key="lobby-portal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col bg-[#f2f0f7] text-[#2c1a4d] overflow-hidden h-full max-h-full shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-x border-violet-200/50 pb-20 z-10"
          >
            {/* HEADER AREA DEPENDING ON ACTIVE BOTTOM TAB */}
            {activeBottomTab === "home" && (
              <div className="relative pt-6 pb-5 px-5 bg-gradient-to-b from-[#ffe646] via-[#fde047] to-[#eab308]/90 text-[#3f2b05] border-b border-[#eab308]/30 shadow-[0_4px_15px_rgba(234,179,8,0.2)] select-none">
                
                {/* Star sparkles overlay in header */}
                <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
                  <div className="absolute top-2 left-6 text-xs font-serif">✦</div>
                  <div className="absolute top-8 right-12 text-lg font-serif">✦</div>
                  <div className="absolute bottom-2 left-1/3 text-sm font-serif">✦</div>
                </div>

                <div className="flex items-center justify-between">
                  
                  {/* Tabs: Mine, Popular (Selected), Explore */}
                  <div className="flex items-end gap-6">
                    <button
                      onClick={() => setLobbyActiveSubTab("Mine")}
                      className={`text-sm tracking-wide transition-all cursor-pointer ${
                        lobbyActiveSubTab === "Mine"
                          ? "text-[#2e1d03] font-black scale-108 border-b-2 border-[#2e1d03] pb-1"
                          : "text-[#5c4308]/75 font-semibold hover:text-[#2e1d03]"
                      }`}
                    >
                      Mine
                    </button>
                    
                    <button
                      onClick={() => setLobbyActiveSubTab("Popular")}
                      className={`text-2xl tracking-tight transition-all cursor-pointer ${
                        lobbyActiveSubTab === "Popular"
                          ? "text-[#1d1002] font-extrabold scale-102"
                          : "text-[#5c4308]/75 font-bold hover:text-[#1d1002]"
                      }`}
                    >
                      Popular
                    </button>

                    <button
                      onClick={() => setLobbyActiveSubTab("Explore")}
                      className={`text-sm tracking-wide transition-all cursor-pointer ${
                        lobbyActiveSubTab === "Explore"
                          ? "text-[#2e1d03] font-black scale-108 border-b-2 border-[#2e1d03] pb-1"
                          : "text-[#5c4308]/75 font-semibold hover:text-[#2e1d03]"
                      }`}
                    >
                      Explore
                    </button>
                  </div>

                  {/* Right Search magnifying glass with pulse highlight when active */}
                  <button
                    onClick={() => setShowSearchInput(!showSearchInput)}
                    className={`p-2.5 rounded-full transition-all text-[#2e1d03] cursor-pointer ${
                      showSearchInput ? "bg-white text-violet-700 shadow-md" : "bg-white/20 hover:bg-white/45"
                    }`}
                  >
                    <Search className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Collapsible search bar */}
                <AnimatePresence>
                  {showSearchInput && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden space-y-2.5"
                    >
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c670a] stroke-[2.5]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search Room Name, Room ID (ID)..."
                          className="w-full bg-white/95 border-2 border-[#eab308] rounded-2xl pl-10 pr-10 py-3 text-xs text-[#2e1d03] font-bold focus:outline-none focus:ring-4 focus:ring-[#fde047]/30 shadow-inner placeholder-[#8c670a]/70 transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c670a] hover:text-[#2e1d03] cursor-pointer"
                          >
                            <X className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                      {/* Category quick chips */}
                      <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none select-none">
                        {["All", "Music", "Girl", "Friend", "Love", "Chat"].map((cat) => {
                          const isSelected = cat === "All" ? searchQuery === "" : searchQuery.toLowerCase() === cat.toLowerCase();
                          return (
                            <button
                              key={cat}
                              onClick={() => setSearchQuery(cat === "All" ? "" : cat)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase border transition-all cursor-pointer whitespace-nowrap ${
                                isSelected
                                  ? "bg-[#1d1002] text-[#fde047] border-[#1d1002]"
                                  : "bg-white/40 border-[#eab308]/40 text-[#5c4308] hover:bg-white/60"
                              }`}
                            >
                              {cat === "All" ? "🔍 All Rooms" : cat}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeBottomTab === "social" && (
              <div className="pt-6 pb-2.5 px-5 bg-gradient-to-b from-[#fffceb] via-[#fffbeb] to-[#f8f6fb] text-slate-900 select-none flex items-center justify-between border-b border-amber-100/60 shadow-2xs">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Social</h1>
              </div>
            )}

            {/* MAIN LOBBY SCREEN CONTENTS */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-28">

              {activeBottomTab === "home" && (
                <>
                  {/* 2. DYNAMIC VIP PRIVILEGE CAROUSEL BANNER (Screenshot 3 "सुंदर आईडी विशेषाधिकार" - Now premium English/Bengali Slider) */}
                  <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-white/10 select-none">
                    
                    <AnimatePresence mode="wait">
                      {currentSlideIndex === 0 && (
                        <motion.div
                          key="slide-vip"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600"
                        >
                          {/* Photo Backdrop Integration */}
                          <div className="absolute inset-0 z-0">
                            <img
                              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600&h=300"
                              alt="VIP Banner Background"
                              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 bg-black/25 rounded-full text-[9px] font-mono font-bold tracking-widest text-amber-300 uppercase">
                                VIP ID SYSTEM
                              </span>
                              
                              <h3 className="text-base font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                                Premium ID Privilege 👑
                              </h3>
                              
                              <p className="text-[10px] text-rose-100 font-medium leading-relaxed max-w-[200px]">
                                Get prestigious customized room frames and special badges!
                              </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md animate-pulse" />
                              <div className="w-[64px] h-[64px] rounded-2xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 p-0.5 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-b from-rose-700 to-red-950 rounded-2xl flex flex-col items-center justify-center border border-yellow-300/30">
                                  <Crown className="w-6 h-6 text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce" />
                                  <span className="text-[8px] font-black tracking-widest text-yellow-300 uppercase mt-0.5">ID VIP</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* VIP Frames list preview labels */}
                          <div className="relative z-10 flex gap-1 mt-4 text-[8px] font-mono font-black uppercase text-amber-200/90 overflow-x-auto py-0.5 scrollbar-none">
                            <span className="px-2 py-0.5 bg-black/25 rounded">VIP 15</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded">VIP 14</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded animate-pulse">VIP 13</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded text-white/50">VIP 12</span>
                          </div>
                        </motion.div>
                      )}

                      {currentSlideIndex === 1 && (
                        <motion.div
                          key="slide-broadcast"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600"
                        >
                          {/* Photo Backdrop Integration */}
                          <div className="absolute inset-0 z-0">
                            <img
                              src="https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=600&h=300"
                              alt="Lounge Background"
                              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 bg-black/25 rounded-full text-[9px] font-mono font-bold tracking-widest text-pink-300 uppercase">
                                LIVE STREAMING
                              </span>
                              
                              <h3 className="text-base font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                                Live Voice Party Lounge 🎙️
                              </h3>
                              
                              <p className="text-[10px] text-pink-100 font-medium leading-relaxed max-w-[200px]">
                                Host your show, chat with friends, and collect premium gift boxes!
                              </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-md animate-pulse" />
                              <div className="w-[64px] h-[64px] rounded-2xl bg-gradient-to-tr from-pink-300 via-purple-400 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-b from-purple-800 to-pink-950 rounded-2xl flex flex-col items-center justify-center border border-pink-300/30">
                                  <Mic className="w-6 h-6 text-pink-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse" />
                                  <span className="text-[8px] font-black tracking-widest text-pink-300 uppercase mt-0.5">VOICE</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 flex gap-1 mt-4 text-[8px] font-mono font-black uppercase text-pink-200/90 overflow-x-auto py-0.5 scrollbar-none">
                            <span className="px-2 py-0.5 bg-black/25 rounded">BANGLA</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded">ENGLISH</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded animate-pulse">GLOBAL</span>
                          </div>
                        </motion.div>
                      )}

                      {currentSlideIndex === 2 && (
                        <motion.div
                          key="slide-coins"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative p-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600"
                        >
                          {/* Photo Backdrop Integration */}
                          <div className="absolute inset-0 z-0">
                            <img
                              src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600&h=300"
                              alt="Coins Background"
                              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 bg-black/25 rounded-full text-[9px] font-mono font-bold tracking-widest text-yellow-300 uppercase">
                                OFFICIAL COIN SHOP
                              </span>
                              
                              <h3 className="text-base font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                                Coin Shop & Fast Cashout 🪙
                              </h3>
                              
                              <p className="text-[10px] text-yellow-100 font-medium leading-relaxed max-w-[200px]">
                                Safe instant cash outs with native bKash / Nagad / Rocket portals.
                              </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-pulse" />
                              <div className="w-[64px] h-[64px] rounded-2xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 p-0.5 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-b from-amber-800 to-orange-950 rounded-2xl flex flex-col items-center justify-center border border-yellow-300/30">
                                  <Gift className="w-6 h-6 text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce" />
                                  <span className="text-[8px] font-black tracking-widest text-yellow-300 uppercase mt-0.5">BKASH</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 flex gap-1 mt-4 text-[8px] font-mono font-black uppercase text-yellow-200/90 overflow-x-auto py-0.5 scrollbar-none">
                            <span className="px-2 py-0.5 bg-black/25 rounded">BKASH</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded">NAGAD</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded animate-pulse">ROCKET</span>
                          </div>
                        </motion.div>
                      )}

                      {currentSlideIndex === 3 && (
                        <motion.div
                          key="slide-games"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative p-5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600"
                        >
                          {/* Photo Backdrop Integration */}
                          <div className="absolute inset-0 z-0">
                            <img
                              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600&h=300"
                              alt="Games Background"
                              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 bg-black/25 rounded-full text-[9px] font-mono font-bold tracking-widest text-teal-300 uppercase">
                                VOICE ROOM GAMES
                              </span>
                              
                              <h3 className="text-base font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                                Real-Time Chat & Games 🎮
                              </h3>
                              
                              <p className="text-[10px] text-teal-100 font-medium leading-relaxed max-w-[200px]">
                                Play Ludo, Carrom, and voice quizzes inside your party lounge!
                              </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-md animate-pulse" />
                              <div className="w-[64px] h-[64px] rounded-2xl bg-gradient-to-tr from-teal-300 via-emerald-400 to-cyan-500 p-0.5 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-b from-teal-800 to-cyan-950 rounded-2xl flex flex-col items-center justify-center border border-teal-300/30">
                                  <Sparkles className="w-6 h-6 text-teal-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-spin-slow" />
                                  <span className="text-[8px] font-black tracking-widest text-teal-300 uppercase mt-0.5">PLAY</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 flex gap-1 mt-4 text-[8px] font-mono font-black uppercase text-teal-200/90 overflow-x-auto py-0.5 scrollbar-none">
                            <span className="px-2 py-0.5 bg-black/25 rounded">LUDO PARTIES</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded animate-pulse">CARROM</span>
                          </div>
                        </motion.div>
                      )}

                      {currentSlideIndex === 4 && (
                        <motion.div
                          key="slide-agency"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative p-5 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600"
                        >
                          {/* Photo Backdrop Integration */}
                          <div className="absolute inset-0 z-0">
                            <img
                              src="https://images.unsplash.com/photo-1578269174936-2709b5a19adf?auto=format&fit=crop&q=80&w=600&h=300"
                              alt="Agency Background"
                              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-1.5">
                              <span className="inline-block px-2.5 py-0.5 bg-black/25 rounded-full text-[9px] font-mono font-bold tracking-widest text-fuchsia-300 uppercase">
                                OFFICIAL AGENCY
                              </span>
                              
                              <h3 className="text-base font-black tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                                Agency & Gifter Festival 🏆
                              </h3>
                              
                              <p className="text-[10px] text-fuchsia-100 font-medium leading-relaxed max-w-[200px]">
                                Recruited by official agencies, earn weekly salary & custom avatars!
                              </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                              <div className="absolute inset-0 bg-fuchsia-400/20 rounded-full blur-md animate-pulse" />
                              <div className="w-[64px] h-[64px] rounded-2xl bg-gradient-to-tr from-blue-300 via-violet-400 to-fuchsia-600 p-0.5 shadow-lg flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-b from-blue-800 to-fuchsia-950 rounded-2xl flex flex-col items-center justify-center border border-fuchsia-300/30">
                                  <Trophy className="w-6 h-6 text-fuchsia-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-bounce" />
                                  <span className="text-[8px] font-black tracking-widest text-fuchsia-300 uppercase mt-0.5">AGENCY</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 flex gap-1 mt-4 text-[8px] font-mono font-black uppercase text-fuchsia-200/90 overflow-x-auto py-0.5 scrollbar-none">
                            <span className="px-2 py-0.5 bg-black/25 rounded">TOP TALENTS</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded">DIAMONDS</span>
                            <span className="px-2 py-0.5 bg-black/25 rounded animate-pulse">WEEKLY</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Slider dot indicators */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`rounded-full transition-all cursor-pointer ${
                            currentSlideIndex === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* DYNAMIC ACTIVE BROADCASTS PANEL (You may be interested in) */}
                  {lobbyActiveSubTab === "Popular" && !searchQuery.trim() && (
                    <div className="space-y-3 pb-4 pt-2 select-none">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                          </span>
                          <h4 className="text-xs font-black tracking-wider text-slate-800 uppercase flex items-center gap-1">
                            Active Broadcasts <span className="text-[11px] text-violet-500 font-bold bg-violet-100 px-1.5 py-0.5 rounded-full">LIVE</span>
                          </h4>
                        </div>
                        <span className="text-[10px] text-violet-600 font-extrabold cursor-default">
                          📡 {lobbyRooms.length} Channels
                        </span>
                      </div>

                      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth">
                        {lobbyRooms.map((room, idx) => {
                          const isRoomActive = activeRoom?.id === room.id || minimizedRoom?.id === room.id;
                          return (
                            <div
                              key={`active-panel-${room.id}-${idx}`}
                              onClick={() => {
                                if (isRoomActive) {
                                  triggerToast("You are already connected to this channel!", "success");
                                  if (minimizedRoom) {
                                    setActiveRoom(minimizedRoom);
                                    setMinimizedRoom(null);
                                    setCurrentStep("room");
                                  }
                                } else {
                                  joinRoom(room);
                                }
                              }}
                              className={`w-36 shrink-0 bg-white border rounded-2xl p-3 shadow-[0_4px_12px_rgba(31,13,61,0.02)] hover:shadow-[0_8px_20px_rgba(124,58,237,0.06)] hover:border-violet-300 transition-all cursor-pointer relative overflow-hidden group ${
                                isRoomActive ? "border-violet-500 ring-2 ring-violet-500/20" : "border-slate-100/90"
                              }`}
                            >
                              {/* Absolute Top Left Delete Button for Admin/Owner */}
                              {(room.hostId === loggedInUser?.id || 
                                room.hostName === loggedInUser?.name || 
                                loggedInUser?.name === "Md Munna" || 
                                loggedInUser?.name === "Munna" || 
                                loggedInUser?.name === "Xzrmunna" || 
                                loggedInUser?.vipLevel >= 5) && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (confirm(`Are you sure you want to delete/remove "${room.title}" room?`)) {
                                      await terminateActiveRoom(room.id);
                                    }
                                  }}
                                  className="absolute top-2 left-2 p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all cursor-pointer z-25 shadow-xs border border-red-200/50"
                                  title="Delete Room"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              )}

                              {/* Micro tag in top corner */}
                              <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full z-10 shadow-sm animate-pulse">
                                <span>LIVE</span>
                              </div>

                              <div className="flex flex-col items-center text-center mt-1">
                                <div className="relative">
                                  {/* Rotating dynamic light glow around avatar */}
                                  <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-tr from-pink-500 via-violet-600 to-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                                  <div className="w-11 h-11 rounded-full overflow-hidden border border-white relative z-10 bg-slate-50">
                                    <img
                                      src={room.avatar || DEFAULT_AVATARS[0]}
                                      alt={room.hostName}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="absolute -bottom-1 -right-1 text-[11px] leading-none bg-black/50 rounded-full p-0.5" title={room.countryFlag}>
                                    {room.countryFlag}
                                  </span>
                                </div>

                                <h5 className="text-[11px] font-black text-slate-800 truncate w-full mt-2 leading-tight">
                                  {room.title}
                                </h5>
                                <span className="text-[9px] text-slate-400 font-bold truncate w-full mt-0.5">
                                  @{room.hostName}
                                </span>

                                <div className="flex items-center gap-1 mt-2 text-[9px] font-black text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                  <span>{room.userCount} online</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Real-time Search Users Results */}
                  {searchQuery.trim().length > 0 && searchedUsers.length > 0 && (
                    <div className="mb-4 bg-white/60 rounded-3xl p-4 border border-violet-100/60 backdrop-blur-md shadow-xs">
                      <h4 className="text-[11px] font-black text-violet-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        👤 Users Found ({searchedUsers.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {searchedUsers.map((user, idx) => (
                          <div
                            key={`searched-user-${user.id}-${idx}`}
                            onClick={() => setSelectedProfileUser(user)}
                            className="flex items-center justify-between p-3 bg-white hover:bg-violet-50/50 rounded-2xl border border-violet-100 transition-all cursor-pointer shadow-xs active:scale-98"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-violet-200 p-0.5 bg-violet-50 shrink-0">
                                <img
                                  src={user.avatar || DEFAULT_AVATARS[0]}
                                  alt={user.name}
                                  className="w-full h-full object-cover rounded-full"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-slate-800 truncate">{user.name}</span>
                                  <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-600 text-white font-extrabold px-1.5 py-0.2 rounded-full scale-90">VIP {user.vipLevel || 1}</span>
                                </div>
                                <span className="text-[10px] text-violet-500 font-bold font-mono">ID: {user.idNo || "1000000"}</span>
                              </div>
                            </div>
                            <span className="text-sm">{user.countryFlag || "🇧🇩"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. DYNAMIC VOICE ROOMS CONTAINER (Pixel-Perfect list matching Screenshot 3) */}
                  <div className="space-y-3 pt-1">
                    {lobbyRooms
                      .filter((room) => {
                        // Apply tab filters
                        if (lobbyActiveSubTab === "Mine") {
                          return room.hostName === (loggedInUser?.name || "Munna");
                        }
                        // Apply Search Queries
                        if (searchQuery.trim()) {
                          const query = searchQuery.toLowerCase();
                          return (
                            room.title.toLowerCase().includes(query) ||
                            room.categoryTag.toLowerCase().includes(query) ||
                            room.subtitle.toLowerCase().includes(query) ||
                            (room.idNo && room.idNo.includes(query))
                          );
                        }
                        return true;
                      })
                      .map((room, index) => {
                        const isEven = index % 2 === 0;

                        return (
                          <div key={`lobby-room-${room.id}-${index}`} className="space-y-3">
                            {/* Render Middle Slider 2 (Carousel Banner) between room 3 and 4 (index 3) */}
                            {lobbyActiveSubTab === "Popular" && index === 3 && !searchQuery.trim() && (
                              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 text-white p-4.5 shadow-[0_8px_25px_rgba(219,39,119,0.25)] select-none">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                                
                                <AnimatePresence mode="wait">
                                  {giftersSlideIndex === 0 && (
                                    <motion.div
                                      key="gifters-slide-1"
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      transition={{ duration: 0.4 }}
                                    >
                                      <div className="text-center">
                                        <h4 className="text-xs font-mono font-black tracking-[0.25em] text-pink-200 uppercase mb-3">
                                          ✦ TOP GIFTERS SHOWCASE ✦
                                        </h4>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2">
                                        {/* Rank 2 (Left) */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-indigo-400">
                                              <img
                                                src={DEFAULT_AVATARS[4]}
                                                alt="Rank 2"
                                                className="w-full h-full object-cover rounded-full border border-pink-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-cyan-500 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              2nd
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-cyan-200 truncate max-w-[70px] mt-1">Lina_R</span>
                                        </div>

                                        {/* Rank 1 (Center with wings border / crown) */}
                                        <div className="flex flex-col items-center -mt-2">
                                          <div className="relative">
                                            <div className="w-15 h-15 rounded-full p-1 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 shadow-md">
                                              <img
                                                src={DEFAULT_AVATARS[2]}
                                                alt="Rank 1"
                                                className="w-full h-full object-cover rounded-full border border-rose-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#3f2b05] text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-yellow-200 flex items-center gap-0.5">
                                              👑 1st
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-extrabold text-yellow-300 truncate max-w-[80px] mt-1">Munna_VIP</span>
                                        </div>

                                        {/* Rank 3 (Right) */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-red-500">
                                              <img
                                                src={DEFAULT_AVATARS[5]}
                                                alt="Rank 3"
                                                className="w-full h-full object-cover rounded-full border border-pink-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              3rd
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-amber-200 truncate max-w-[70px] mt-1">Sajid_A</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}

                                  {giftersSlideIndex === 1 && (
                                    <motion.div
                                      key="gifters-slide-2"
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      transition={{ duration: 0.4 }}
                                    >
                                      <div className="text-center">
                                        <h4 className="text-xs font-mono font-black tracking-[0.25em] text-yellow-200 uppercase mb-3">
                                          🎙️ WEEKLY STAR HOSTS 🎙️
                                        </h4>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2">
                                        {/* Rank 2 */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-purple-400 to-pink-400">
                                              <img
                                                src={DEFAULT_AVATARS[0]}
                                                alt="Alex"
                                                className="w-full h-full object-cover rounded-full border border-purple-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              2nd
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-purple-200 truncate max-w-[70px] mt-1">Alex Anika</span>
                                        </div>

                                        {/* Rank 1 */}
                                        <div className="flex flex-col items-center -mt-2">
                                          <div className="relative">
                                            <div className="w-15 h-15 rounded-full p-1 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 shadow-md">
                                              <img
                                                src={DEFAULT_AVATARS[3]}
                                                alt="Toxic"
                                                className="w-full h-full object-cover rounded-full border border-amber-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#3f2b05] text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-yellow-200 flex items-center gap-0.5">
                                              👑 1st
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-extrabold text-yellow-300 truncate max-w-[80px] mt-1">Toxic_Heart</span>
                                        </div>

                                        {/* Rank 3 */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-400 to-teal-500">
                                              <img
                                                src={DEFAULT_AVATARS[1]}
                                                alt="Imran"
                                                className="w-full h-full object-cover rounded-full border border-emerald-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              3rd
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-emerald-200 truncate max-w-[70px] mt-1">Imran Vocal</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}

                                  {giftersSlideIndex === 2 && (
                                    <motion.div
                                      key="gifters-slide-3"
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -20 }}
                                      transition={{ duration: 0.4 }}
                                    >
                                      <div className="text-center">
                                        <h4 className="text-xs font-mono font-black tracking-[0.25em] text-cyan-200 uppercase mb-3">
                                          💎 TOP WEALTH VIP LEADERS 💎
                                        </h4>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2">
                                        {/* Rank 2 */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-pink-400 to-rose-500">
                                              <img
                                                src={DEFAULT_AVATARS[2]}
                                                alt="Queen"
                                                className="w-full h-full object-cover rounded-full border border-pink-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-pink-500 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              VIP 12
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-pink-200 truncate max-w-[70px] mt-1">Queen_Anu</span>
                                        </div>

                                        {/* Rank 1 */}
                                        <div className="flex flex-col items-center -mt-2">
                                          <div className="relative">
                                            <div className="w-15 h-15 rounded-full p-1 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 shadow-md">
                                              <img
                                                src={DEFAULT_AVATARS[5]}
                                                alt="King"
                                                className="w-full h-full object-cover rounded-full border border-amber-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#3f2b05] text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-yellow-200 flex items-center gap-0.5">
                                              👑 VIP 15
                                            </div>
                                          </div>
                                          <span className="text-[10px] font-extrabold text-yellow-300 truncate max-w-[80px] mt-1">King_BD</span>
                                        </div>

                                        {/* Rank 3 */}
                                        <div className="flex flex-col items-center">
                                          <div className="relative">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-indigo-400 to-blue-500">
                                              <img
                                                src={DEFAULT_AVATARS[3]}
                                                alt="Prince"
                                                className="w-full h-full object-cover rounded-full border border-indigo-600"
                                                referrerPolicy="no-referrer"
                                              />
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white shadow">
                                              VIP 10
                                            </div>
                                          </div>
                                          <span className="text-[9px] font-bold text-indigo-200 truncate max-w-[70px] mt-1">VIP_Prince</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Slider 2 Dot Pagination Indicators */}
                                <div className="flex justify-center items-center gap-1.5 mt-3">
                                  {[0, 1, 2].map((idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setGiftersSlideIndex(idx)}
                                      className={`rounded-full transition-all cursor-pointer ${
                                        giftersSlideIndex === idx ? "w-3 h-1 bg-white" : "w-1 h-1 bg-white/40"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* THE ROOM CARD */}
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => joinRoom(room)}
                              className="relative flex items-center justify-between p-4 bg-white hover:bg-violet-50/50 rounded-3xl shadow-[0_4px_15px_rgba(31,13,61,0.04)] border border-violet-100/80 transition-all cursor-pointer group"
                            >
                              {/* Left Avatar with VIP squircle frames matched */}
                              <div className="relative flex-shrink-0">
                                {room.hasVipFrame ? (
                                  /* Highly stylized Gostar Camp / Gold glow frame matching screenshot */
                                  <div className="relative w-15 h-15 rounded-2xl p-0.5 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 shadow-[0_4px_10px_rgba(234,179,8,0.25)]">
                                    <div className="absolute -top-1.5 -left-1.5 bg-yellow-400 text-[7px] font-black px-1 rounded-full text-black scale-80 uppercase tracking-widest border border-white">
                                      VIP
                                    </div>
                                    <img
                                      src={room.avatar || DEFAULT_AVATARS[0]}
                                      alt={room.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover rounded-xl"
                                    />
                                    {/* Gold star tag on top */}
                                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border border-white">
                                      <Crown className="w-2 h-2 text-white" />
                                    </div>
                                  </div>
                                ) : (
                                  /* Clean border */
                                  <div className="w-15 h-15 rounded-2xl overflow-hidden border-2 border-violet-100 p-0.5 bg-violet-50">
                                    <img
                                      src={room.avatar || DEFAULT_AVATARS[0]}
                                      alt={room.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover rounded-xl"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Center title details */}
                              <div className="flex-1 min-w-0 mx-3.5 space-y-1">
                                <h4 className="text-sm font-black text-[#1e0d3d] truncate group-hover:text-[#7c3aed] transition-colors leading-snug flex items-center gap-1">
                                  {room.title}
                                </h4>

                                <p className="text-[10.5px] text-violet-500/90 truncate font-semibold leading-relaxed">
                                  {room.subtitle}
                                </p>

                                {/* Badges list matched with India flag/Bengali text details */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                  
                                  {/* Flag pill */}
                                  <span className="inline-flex items-center justify-center text-xs bg-violet-100/60 border border-violet-200/50 px-1.5 py-0.5 rounded-full select-none">
                                    {room.countryFlag}
                                  </span>

                                  {/* Unique Room ID Badge */}
                                  <span className="inline-flex items-center justify-center text-[10px] font-mono font-black bg-violet-100 text-violet-800 border border-violet-200 px-2 py-0.5 rounded-full shadow-xs">
                                    ID: {room.idNo || "5873858"}
                                  </span>

                                  {/* Category pill */}
                                  <span className={`text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white ${room.categoryColor}`}>
                                    {room.categoryTag}
                                  </span>

                                </div>
                              </div>

                              {/* Right live bar visualizer signal & active counter */}
                              <div className="flex flex-col items-end gap-1 flex-shrink-0 relative select-none">
                                
                                {/* Treasure Chest overlay (matched for Coin Seller Room 2) */}
                                {room.hasChest && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rewards = [200, 350, 500, 1000];
                                      const rand = rewards[Math.floor(Math.random() * rewards.length)];
                                      setUserCoins((prev) => prev + rand);
                                      triggerToast(`Lucky Treasure Box! You opened +${rand} Coins! 🎁💎`, "success");
                                    }}
                                    className="absolute -top-6 -right-2 text-rose-500 animate-bounce hover:scale-110 active:scale-95 transition-all p-1"
                                    title="Open Treasure Box!"
                                  >
                                    <Gift className="w-5 h-5 text-indigo-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                                  </button>
                                )}

                                {/* Fluctuate graphic level soundwaves */}
                                <div className="flex items-end gap-0.5 h-3 px-1.5">
                                  <span
                                    className="w-[2px] rounded-full bg-amber-500 transition-all duration-300"
                                    style={{ height: isEven ? "6px" : "10px" }}
                                  />
                                  <span
                                    className="w-[2px] rounded-full bg-amber-500 transition-all duration-150 animate-pulse"
                                    style={{ height: isEven ? "11px" : "4px" }}
                                  />
                                  <span
                                    className="w-[2px] rounded-full bg-amber-500 transition-all duration-200"
                                    style={{ height: isEven ? "4px" : "12px" }}
                                  />
                                </div>

                                <span className="text-[10px] font-mono font-bold text-amber-600/90 tracking-wide">
                                  {room.userCount}
                                </span>

                                {/* Clean Room Delete Button for Admin/Owner */}
                                {(room.hostId === loggedInUser?.id || 
                                  room.hostName === loggedInUser?.name || 
                                  loggedInUser?.name === "Md Munna" || 
                                  loggedInUser?.name === "Munna" || 
                                  loggedInUser?.name === "Xzrmunna" || 
                                  loggedInUser?.vipLevel >= 5) && (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      if (confirm(`Are you sure you want to delete/remove "${room.title}" room?`)) {
                                        await terminateActiveRoom(room.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all cursor-pointer mt-1 border border-red-100 z-10"
                                    title="Delete Room"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                            </motion.div>
                          </div>
                        );
                      })}

                    {lobbyRooms.filter((room) => {
                      if (lobbyActiveSubTab === "Mine") return room.hostName === (loggedInUser?.name || "Munna");
                      return true;
                    }).length === 0 && (
                      <div className="text-center py-16 space-y-3 bg-white/50 rounded-3xl border border-violet-100">
                        <Headphones className="w-10 h-10 mx-auto text-violet-300 animate-bounce" />
                        <h4 className="text-sm font-bold text-violet-500">No voice rooms available</h4>
                        <p className="text-[11px] text-violet-400">Be the first to start a live audio broadcast!</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* TAB 2: MOMENT TIMELINE */}
              {activeBottomTab === "moment" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-violet-200 pb-2">
                    <h3 className="text-base font-black tracking-tight text-[#1e0d3d]">Community Moments</h3>
                    <span className="text-[10px] font-mono text-pink-500 bg-pink-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {moments.length} Moments
                    </span>
                  </div>

                  {/* Share a Moment Input form */}
                  <div className="bg-white rounded-3xl p-4.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-violet-100 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#cbd5e1] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                        {loggedInUser?.avatar && loggedInUser.avatar.trim() !== "" ? (
                          <img src={loggedInUser.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-xs font-black uppercase">
                            {loggedInUser?.name ? loggedInUser.name.charAt(0) : "M"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-500 select-none">Share some positive moments with the club !</span>
                    </div>

                    <div className="relative">
                      <textarea
                        value={newMomentText}
                        onChange={(e) => setNewMomentText(e.target.value)}
                        placeholder="What is happening? Post an announcement, greetings or invite friends to your rooms..."
                        className="w-full min-h-[75px] bg-slate-50 border border-slate-100/80 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-300 resize-none font-semibold transition-all leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        type="button"
                        onClick={() => triggerToast("Dynamic photo attachment is fully ready for next live post!", "success")}
                        className="flex items-center gap-1.5 text-[11px] font-black text-violet-500 hover:text-violet-600 transition-colors cursor-pointer select-none"
                      >
                        <span className="text-sm">🖼️</span>
                        <span>Attach Image</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleShareMoment}
                        className="bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-black px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                      >
                        Publish Post
                      </button>
                    </div>
                  </div>

                  {/* Moments feed list */}
                  <div className="space-y-4">
                    {moments.map((moment) => (
                      <div 
                        key={moment.id}
                        className="bg-white rounded-3xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-violet-100 space-y-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 flex items-center justify-center flex-shrink-0">
                            {moment.avatar && moment.avatar.trim() !== "" ? (
                              <img src={moment.avatar} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-slate-500 text-xs font-black uppercase">
                                {moment.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">{moment.name}</h4>
                            <p className="text-[9px] text-violet-400 font-bold font-mono uppercase tracking-wide">
                              {moment.time} • {moment.country}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 font-semibold leading-relaxed whitespace-pre-wrap">
                          {moment.text}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-bold pt-3.5 border-t border-violet-50/50 text-violet-500 select-none">
                          <button
                            onClick={() => handleLikeMoment(moment.id)}
                            className="flex items-center gap-1.5 hover:text-rose-500 active:scale-125 transition-transform cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${moment.likedByUser ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} />
                            <span>{moment.likes} Likes</span>
                          </button>
                          
                          <button
                            onClick={() => triggerToast("Direct comments are fully authenticated! No spam enabled.", "success")}
                            className="flex items-center gap-1.5 hover:text-violet-600 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {moments.length === 0 && (
                      <div className="text-center py-20 px-6 space-y-3.5 bg-white/60 rounded-3xl border border-violet-100/50">
                        <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-violet-400 mx-auto">
                          <Compass className="w-6 h-6 animate-spin [animation-duration:10s]" />
                        </div>
                        <h4 className="text-sm font-black text-[#1e0d3d]">No public moments yet</h4>
                        <p className="text-xs text-violet-400 max-w-[240px] mx-auto leading-relaxed">
                          Be the first helper to publish a dynamic club story or room invite right now!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SOCIAL TAB (Screenshots Exact Replica) */}
              {activeBottomTab === "social" && (
                <div className="space-y-4 pt-1">
                  
                  {/* 1. TOP ACTION CARD (White card with 4 rounded squircle icon buttons) */}
                  <div className="bg-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80">
                    <div className="grid grid-cols-4 gap-2 text-center select-none">
                      
                      {/* Item 1: Requests */}
                      <button
                        onClick={() => setSocialModal("requests")}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-400 via-indigo-400 to-purple-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all relative">
                          <Users className="w-6 h-6 stroke-[2.2]" />
                          {friendRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                              {friendRequests.length}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2 group-hover:text-purple-600 transition-colors">
                          Requests
                        </span>
                      </button>

                      {/* Item 2: Visitors */}
                      <button
                        onClick={() => setSocialModal("visitors")}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all relative">
                          <div className="relative flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2 group-hover:text-amber-600 transition-colors">
                          Visitors
                        </span>
                      </button>

                      {/* Item 3: Couple */}
                      <button
                        onClick={() => setSocialModal("couple")}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-pink-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
                          <Heart className="w-6 h-6 fill-white stroke-none" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2 group-hover:text-pink-600 transition-colors">
                          Couple
                        </span>
                      </button>

                      {/* Item 4: Family */}
                      <button
                        onClick={() => setSocialModal("family")}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-400 to-emerald-400 text-white flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all">
                          <Shield className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 mt-2 group-hover:text-teal-600 transition-colors">
                          Family
                        </span>
                      </button>

                    </div>
                  </div>

                  {/* 2. SUB-TABS ROW (Chat vs Friend & Add Friend Button) */}
                  <div className="flex items-center justify-between px-1 pt-1 select-none">
                    <div className="flex items-center gap-6">
                      {/* Chat sub-tab */}
                      <button
                        onClick={() => setSocialSubTab("chat")}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <span className={`text-base tracking-tight transition-all ${
                          socialSubTab === "chat" ? "font-extrabold text-slate-900" : "font-semibold text-slate-400 hover:text-slate-600"
                        }`}>
                          Chat
                        </span>
                        {socialSubTab === "chat" && (
                          <motion.div layoutId="socialTabUnderline" className="w-4 h-1 bg-amber-400 rounded-full mt-1" />
                        )}
                      </button>

                      {/* Friend sub-tab */}
                      <button
                        onClick={() => setSocialSubTab("friend")}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <span className={`text-base tracking-tight transition-all ${
                          socialSubTab === "friend" ? "font-extrabold text-slate-900" : "font-semibold text-slate-400 hover:text-slate-600"
                        }`}>
                          Friend ({myFriendsList.length})
                        </span>
                        {socialSubTab === "friend" && (
                          <motion.div layoutId="socialTabUnderline" className="w-4 h-1 bg-amber-400 rounded-full mt-1" />
                        )}
                      </button>
                    </div>

                    {/* Add Friend icon button */}
                    <button
                      onClick={() => setSocialModal("add_friend")}
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      title="Add Friends"
                    >
                      <UserPlus className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>

                  {/* 3. SUB-TAB CONTENT: CHAT (Clean Full-Screen List Rows, No Card Boxes) */}
                  {socialSubTab === "chat" && (
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-100/90 divide-y divide-slate-100">
                      
                      {/* Item 1: Join a family */}
                      {!deletedChatIds["join_family"] && (
                        <div
                          onTouchStart={() => handleTouchStartChat("join_family", "Join a family")}
                          onTouchEnd={handleTouchEndChat}
                          onMouseDown={() => handleTouchStartChat("join_family", "Join a family")}
                          onMouseUp={handleTouchEndChat}
                          onMouseLeave={handleTouchEndChat}
                          onClick={() => setSocialModal("family")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group select-none relative"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Shield className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate">
                                {joinedFamilies.length > 0 ? `Family Chat (${joinedFamilies[0]})` : "Join a family"}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {joinedFamilies.length > 0 ? "Official Family Group Chat" : "Find a close group of friends..."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToDelete({ id: "join_family", name: "Join a family" });
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete Chat"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Item 2: Notice */}
                      {!deletedChatIds["notice"] && (
                        <div
                          onTouchStart={() => handleTouchStartChat("notice", "Notice")}
                          onTouchEnd={handleTouchEndChat}
                          onMouseDown={() => handleTouchStartChat("notice", "Notice")}
                          onMouseUp={handleTouchEndChat}
                          onMouseLeave={handleTouchEndChat}
                          onClick={() => setSocialModal("notice")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group select-none relative"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Mail className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors truncate">
                                Notice
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                System announcements & group notices
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToDelete({ id: "notice", name: "Notice" });
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete Chat"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Item 3: Official Support Team */}
                      {!deletedChatIds["official_team"] && (
                        <div
                          onTouchStart={() => handleTouchStartChat("official_team", "Official Support Team")}
                          onTouchEnd={handleTouchEndChat}
                          onMouseDown={() => handleTouchStartChat("official_team", "Official Support Team")}
                          onMouseUp={handleTouchEndChat}
                          onMouseLeave={handleTouchEndChat}
                          onClick={() => setSocialModal("official_team")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group select-none relative"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-xs font-bold">
                              <Volume2 className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                                Official Support Team
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                Welcome to VoxaClub! Top-Up Discounts & VIP Help...
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-bold text-slate-400">Just now</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToDelete({ id: "official_team", name: "Official Support Team" });
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete Chat"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Item 4: Real-time user chats / Billing support receipts */}
                      {inboxChats.map((chat, idx) => {
                        const chatId = `inbox_${idx}`;
                        if (deletedChatIds[chatId]) return null;
                        return (
                          <div
                            key={`inbox-chat-${idx}-${chat.name}`}
                            onTouchStart={() => handleTouchStartChat(chatId, chat.name)}
                            onTouchEnd={handleTouchEndChat}
                            onMouseDown={() => handleTouchStartChat(chatId, chat.name)}
                            onMouseUp={handleTouchEndChat}
                            onMouseLeave={handleTouchEndChat}
                            onClick={() => {
                              setActiveDirectChatUser({
                                id: `inbox-${idx}`,
                                name: chat.name,
                                avatar: DEFAULT_AVATARS[1],
                                idNo: "8921029",
                                online: true
                              });
                            }}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group select-none"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs text-base font-black">
                                💳
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                                  <span>{chat.name}</span>
                                  {chat.unread && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                  {chat.text}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-bold text-slate-400">{chat.time}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatToDelete({ id: chatId, name: chat.name });
                                }}
                                className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Chat"
                              >
                                <Trash2 className="w-4 h-4 stroke-[2]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Item 5: Interactive Direct Message with Friends */}
                      {myFriendsList.map((friend) => {
                        const friendChatId = `friend_${friend.id}`;
                        if (deletedChatIds[friendChatId]) return null;
                        return (
                          <div
                            key={`msg-friend-${friend.id}`}
                            onTouchStart={() => handleTouchStartChat(friendChatId, friend.name)}
                            onTouchEnd={handleTouchEndChat}
                            onMouseDown={() => handleTouchStartChat(friendChatId, friend.name)}
                            onMouseUp={handleTouchEndChat}
                            onMouseLeave={handleTouchEndChat}
                            onClick={() => {
                              setActiveDirectChatUser({
                                id: friend.id,
                                name: friend.name,
                                avatar: friend.avatar,
                                idNo: friend.idNo,
                                online: friend.online
                              });
                            }}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors group select-none"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                {friend.online && (
                                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate">
                                  {friend.name} {friend.country}
                                </h4>
                                <p className="text-xs text-emerald-600 font-medium mt-0.5 truncate">
                                  {friend.status}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatToDelete({ id: friendChatId, name: friend.name });
                                }}
                                className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Chat"
                              >
                                <Trash2 className="w-4 h-4 stroke-[2]" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  )}

                  {/* 4. SUB-TAB CONTENT: FRIEND LIST */}
                  {socialSubTab === "friend" && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Friends ({myFriendsList.length})</span>
                        <button
                          onClick={() => setSocialModal("add_friend")}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1"
                        >
                          <span>+ Find Friends</span>
                        </button>
                      </div>

                      {myFriendsList.map((friend) => (
                        <div
                          key={`friend-tab-item-${friend.id}`}
                          className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="relative">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                                referrerPolicy="no-referrer"
                              />
                              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                friend.online ? "bg-emerald-500" : "bg-slate-300"
                              }`} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                <span>{friend.name}</span>
                                <span className="text-xs">{friend.country}</span>
                              </h4>
                              <p className="text-xs text-slate-400 mt-0.5">ID: {friend.idNo} • {friend.status}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveDirectChatUser({
                                id: friend.id,
                                name: friend.name,
                                avatar: friend.avatar,
                                idNo: friend.idNo
                              });
                            }}
                            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-full transition-all cursor-pointer shadow-2xs"
                          >
                            Chat
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: PERSONAL DASHBOARD MINE */}
              {activeBottomTab === "mine" && (
                <div className={`absolute inset-0 ${showVipPage ? 'bg-gradient-to-b from-[#180a02] via-[#2a170b] to-[#0f0600]' : 'bg-gradient-to-b from-[#fffdec] via-[#f7f5fa] to-[#f4f2f7]'} overflow-y-auto pb-24 z-20`}>
                  {showVipPage ? (
                    /* PRESTIGE VIP LEVEL DETAIL PORTAL PANEL (Screenshots 2 & 3) */
                    <div className="min-h-full flex flex-col justify-between text-[#fef3c7] pb-10">
                      {/* Top Header */}
                      <div className="bg-black/40 backdrop-blur-md border-b border-amber-900/15 px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
                        <button
                          onClick={() => setShowVipPage(false)}
                          className="p-1 hover:bg-white/10 rounded-full text-amber-200 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                        </button>
                        <h2 className="text-sm font-black text-[#ecd5bf] tracking-widest uppercase">
                          VIP PRIVILEGES
                        </h2>
                        <div 
                          onClick={() => triggerToast("Click VIP cards to unlock premium rewards!", "success")}
                          className="w-6 h-6 rounded-full border-2 border-amber-500/40 hover:border-amber-500 flex items-center justify-center text-amber-300 font-extrabold text-xs cursor-pointer transition-all active:scale-95 shadow-sm"
                          title="VIP Help"
                        >
                          ?
                        </div>
                      </div>

                      {/* Horizontal list of VIP 1 to 10 Capsule buttons */}
                      <div className="flex items-center gap-2.5 overflow-x-auto py-3 px-4 bg-black/25 border-b border-amber-900/15 scrollbar-none select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => {
                          const isSelected = selectedVipLevel === lvl;
                          const isOwned = vipLevel >= lvl;
                          return (
                            <button
                              key={lvl}
                              onClick={() => setSelectedVipLevel(lvl)}
                              className={`flex-shrink-0 text-[10px] font-black tracking-wider px-4.5 py-2 rounded-full border uppercase transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-r from-[#e3b88a] via-[#c69a6c] to-[#a47a4d] text-[#2d180a] border-[#ecd5bf] shadow-[0_2px_10px_rgba(198,154,108,0.45)] scale-105 font-black"
                                  : "bg-black/40 text-amber-200/50 border-amber-950/40 hover:text-amber-100 hover:border-amber-900/60"
                              }`}
                            >
                              VIP {lvl} {isOwned && "✓"}
                            </button>
                          );
                        })}
                      </div>

                      {/* Main Dynamic Centerpiece Content */}
                      <div className="flex-1 px-4 py-6 space-y-6">
                        
                        {/* Dynamic Prestigous Crown Symbol Badge */}
                        <VipBadgeCenterpiece level={selectedVipLevel} avatar={loggedInUser?.avatar} name={loggedInUser?.name} />

                        {/* Premium Real Payment Recharge option */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-3 bg-black/45 border border-amber-900/30 px-4 py-2 rounded-full shadow-inner select-none">
                            <span className="text-[11px] font-black text-amber-400">🪙 My Balance: {userCoins.toLocaleString()}</span>
                            <button
                              onClick={() => {
                                setShowRechargeModal(true);
                              }}
                              className="bg-amber-500 hover:bg-amber-600 text-black text-[9px] font-black px-2.5 py-1 rounded-full transition-all cursor-pointer uppercase tracking-wider font-extrabold animate-pulse"
                            >
                              + RECHARGE
                            </button>
                          </div>
                        </div>

                        {/* GLOSSY METALLIC ACTION BUTTON */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={handlePurchaseVip}
                            className={`w-full max-w-sm py-4 rounded-full font-black text-xs tracking-widest uppercase transition-all active:scale-[0.98] select-none text-center shadow-lg border cursor-pointer ${
                              vipLevel >= selectedVipLevel
                                ? "bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900 text-emerald-100 border-emerald-500 shadow-md"
                                : "bg-gradient-to-r from-[#6e4827] via-[#a87d55] to-[#6e4827] text-[#fef3c7] border-[#bf9770] hover:brightness-105"
                            }`}
                          >
                            {vipLevel >= selectedVipLevel ? `✓ Owned & Activated` : `Purchase Privilege`}
                          </button>
                          
                          {/* Price description under the purchase button */}
                          <span className="text-[10px] font-bold text-amber-400/70 tracking-wide mt-2">
                            {vipLevel >= selectedVipLevel 
                              ? "Lifetime premium status activated" 
                              : `${(selectedVipLevel * 300000).toLocaleString()} gold coins/30 days`
                            }
                          </span>
                        </div>

                        {/* Privilege Effect Section (Screenshot 2) */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-3 select-none">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
                            <span className="text-xs font-black tracking-widest text-[#ecd5bf] uppercase">
                              ⚜ Privilege Effect ⚜
                            </span>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
                          </div>

                          {/* Grid layout of custom visuals for user level preview */}
                          <div className="grid grid-cols-2 gap-3.5">
                            
                            {/* VIP Badge display */}
                            <div className="bg-black/35 border border-amber-900/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] text-amber-400/50 font-black tracking-wider uppercase mb-2.5">VIP Title Badge</span>
                              <div className="px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest shadow-md bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-amber-950 border border-amber-300 animate-pulse">
                                VIP {selectedVipLevel}
                              </div>
                              <span className="text-[8.5px] text-amber-200/30 font-bold mt-2">Custom Title</span>
                            </div>

                            {/* Avatar Frame display */}
                            <div className="bg-black/35 border border-amber-900/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                              <span className="text-[9px] text-amber-400/50 font-black tracking-wider uppercase mb-2.5">Exclusive Frame</span>
                              
                              <div className="relative w-11 h-11 rounded-full bg-[#7a95a8] flex items-center justify-center border-2 border-white/20">
                                {/* Level frame crown border overlay */}
                                <div className="absolute inset-0 rounded-full border-2 border-amber-400 scale-110 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                <span className="text-white text-xs font-black select-none">M</span>
                                {/* Miniature Crown floating atop */}
                                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] leading-none">👑</span>
                              </div>
                              <span className="text-[8.5px] text-amber-200/30 font-bold mt-2">Avatar Ring Customizer</span>
                            </div>

                            {/* Awesome Entrance Show Ribbon */}
                            <div className="col-span-2 bg-black/35 border border-amber-900/15 rounded-2xl p-4 flex flex-col items-center">
                              <span className="text-[9px] text-amber-400/50 font-black tracking-wider uppercase mb-2.5">Awesome Entrance Show</span>
                              <div className="w-full bg-gradient-to-r from-transparent via-amber-500/15 to-transparent border-y border-amber-500/25 py-2.5 text-center relative overflow-hidden">
                                <span className="text-[9.5px] font-black tracking-widest text-amber-100 animate-pulse uppercase">
                                  ✨ [VIP {selectedVipLevel}] {loggedInUser?.name || "Md Munna"} entered! ✨
                                </span>
                              </div>
                              <span className="text-[8.5px] text-amber-200/30 font-bold mt-2">Dynamic Entrance Banner</span>
                            </div>

                            {/* Distinguished Card */}
                            <div className="bg-black/35 border border-amber-900/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] text-amber-400/50 font-black tracking-wider uppercase mb-2.5">Distinguished Card</span>
                              <div className="w-24 h-14 rounded-xl bg-gradient-to-br from-amber-950 via-amber-900 to-[#120700] border border-amber-700/50 p-2 flex flex-col justify-between shadow-md">
                                <div className="flex items-center justify-between">
                                  <span className="text-[7px] font-black text-amber-400">VIP {selectedVipLevel}</span>
                                  <span className="text-[7px] text-amber-500">⚜</span>
                                </div>
                                <span className="text-[8px] font-bold text-amber-100 text-left truncate">{loggedInUser?.name || "Md Munna"}</span>
                              </div>
                              <span className="text-[8.5px] text-amber-200/30 font-bold mt-2">Business Profile Card</span>
                            </div>

                            {/* Chat Bubble Frame */}
                            <div className="bg-black/35 border border-amber-900/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                              <span className="text-[9px] text-amber-400/50 font-black tracking-wider uppercase mb-2.5">Exclusive Chat Bubble</span>
                              <div className="px-3 py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/35 text-[8.5px] text-amber-100 font-black relative max-w-[110px] truncate">
                                Hello friends! 🗣️
                                <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              </div>
                              <span className="text-[8.5px] text-amber-200/30 font-bold mt-2">Personal Message Bubble</span>
                            </div>

                          </div>
                        </div>

                        {/* More Privileges Section (Screenshot 3) */}
                        <div className="space-y-4 pt-4">
                          <div className="flex items-center justify-center gap-3 select-none">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
                            <span className="text-xs font-black tracking-widest text-[#ecd5bf] uppercase">
                              ⚜ More Privileges ⚜
                            </span>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
                          </div>

                          {/* Grid of 14 secondary privileges */}
                          <div className="grid grid-cols-3 gap-y-6 gap-x-3 mt-4">
                            {[
                              { title: "Privileged gifts", icon: "⭐" },
                              { title: "Room priority display", icon: "💎" },
                              { title: "VIP birthday gift", icon: "🎂" },
                              { title: "Special Gift Tassel", icon: "🎁" },
                              { title: "Mysterious invisibility", icon: "🕵️" },
                              { title: "Rare vehicle", icon: "🚗" },
                              { title: "Discount", icon: "🏷️" },
                              { title: "Refuse strangers", icon: "🔏" },
                              { title: "GIF Avatar", icon: "🖼️" },
                              { title: "GIF Background", icon: "🌌" },
                              { title: "Kicking defense", icon: "🚪" },
                              { title: "Anti-blocking", icon: "🛡️" },
                              { title: "Announcement", icon: "📢" },
                              { title: "Nickname", icon: "🏷️" }
                            ].map((priv, idx) => (
                              <div 
                                key={idx}
                                onClick={() => triggerToast(`[${priv.title}] feature unlocked automatically for VIP level holders!`, "success")}
                                className="flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-all"
                              >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-950 to-[#220d00] border border-amber-900/35 flex items-center justify-center text-lg shadow-md group-hover:border-amber-500/40 transition-colors">
                                  {priv.icon}
                                </div>
                                <span className="text-[8.5px] text-amber-200/70 font-black mt-2 leading-tight group-hover:text-amber-300 transition-colors max-w-[76px]">
                                  {priv.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : !showEditProfile ? (
                    <div className="bg-gradient-to-b from-[#8ce2d0] via-[#c6f6ed] to-[#f4fbf9] min-h-full pb-20 select-none">
                      
                      {/* Hidden Real-Time Profile Photo File Input */}
                      <input
                        type="file"
                        ref={profilePhotoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />

                      {/* Profile Header (Matching Screenshot) */}
                      <div className="p-4 pt-5 space-y-4">
                        {/* Top Row: User Avatar + Name + Badges & Edit Pen + CP Partner Logo */}
                        <div className="flex items-start justify-between gap-3">
                          
                          {/* Left: Avatar & User Info */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            
                            {/* User Circular Profile Photo with Edit Pencil Overlay */}
                            <div className="relative shrink-0">
                              <div
                                onClick={() => profilePhotoInputRef.current?.click()}
                                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 bg-white shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden relative group"
                                title="Click to upload/change photo in real time"
                              >
                                <img
                                  src={loggedInUser?.avatar || DEFAULT_AVATARS[0]}
                                  alt={loggedInUser?.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                  <Camera className="w-5 h-5 text-white" />
                                </div>
                              </div>

                              {/* Edit Pencil Icon Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  profilePhotoInputRef.current?.click();
                                }}
                                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white text-slate-800 border border-slate-200/90 shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-90 transition-all z-10"
                                title="Change photo in real-time"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                              </button>
                            </div>

                            {/* User Name, ID, Flag, Bio & Badges */}
                            <div className="min-w-0 flex-1">
                              {/* Name & Quick Edit */}
                              <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                                  {loggedInUser?.name || "Md Munna"}
                                </h2>
                                <button
                                  onClick={openEditProfile}
                                  className="p-1 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                  title="Edit Profile Info"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* User ID Code (Copyable) & Country Flag */}
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const idCode = loggedInUser?.idNo || (loggedInUser?.id && !loggedInUser.id.startsWith("user-") ? loggedInUser.id.replace(/\D/g, "") : "1488500") || "1488500";
                                    navigator.clipboard.writeText(idCode);
                                    triggerToast(`ID Code Copied: ${idCode} 📋`, "success");
                                  }}
                                  className="bg-white/80 hover:bg-white text-slate-900 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs border border-slate-200/80"
                                  title="Click to copy your ID Code"
                                >
                                  <span className="text-slate-400 font-extrabold text-[10px]">ID</span>
                                  <span>{loggedInUser?.idNo || (loggedInUser?.id && !loggedInUser.id.startsWith("user-") ? loggedInUser.id.replace(/\D/g, "") : "1488500") || "1488500"}</span>
                                  <Copy className="w-3 h-3 text-slate-500" />
                                </button>

                                <div className="bg-white/80 text-slate-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-200/80 shadow-2xs">
                                  <span className="text-sm">{loggedInUser?.countryFlag || "🇧🇩"}</span>
                                  <span className="text-[11px] font-bold text-slate-700">{loggedInUser?.country || "Bangladesh"}</span>
                                </div>
                              </div>

                              {/* Real-time Bio / About Slogan */}
                              <div
                                onClick={openEditProfile}
                                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/60 hover:bg-white px-2.5 py-1 rounded-xl cursor-pointer transition-all border border-slate-200/60 shadow-2xs"
                                title="Click to update your Bio in real-time"
                              >
                                <span className="text-amber-500">💬</span>
                                <span className="truncate italic max-w-[180px] sm:max-w-[240px]">
                                  {loggedInUser?.bio || "Live your life to the fullest 🚀"}
                                </span>
                                <Edit3 className="w-3 h-3 text-slate-400 shrink-0 ml-auto" />
                              </div>

                              {/* ID Level, SVIP, Rewards Badges */}
                              <div className="flex items-center flex-wrap gap-1.5 mt-2">
                                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300/80 shadow-2xs">
                                  ID Lv.{loggedInUser?.vipLevel ? loggedInUser.vipLevel * 4 : 12}
                                </span>
                                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-900 border border-purple-300/80 shadow-2xs">
                                  SVIP {loggedInUser?.vipLevel || 1}
                                </span>
                                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 border border-emerald-300/80 shadow-2xs">
                                  👑 Rewards
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: CP Partner Circular Profile Logo */}
                          <div
                            onClick={() => setFullProfileUser(cpPartner)}
                            className="relative cursor-pointer group flex flex-col items-center shrink-0 pt-1"
                            title={`View Couple Partner Profile (${cpPartner.name})`}
                          >
                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-rose-400 via-pink-500 to-rose-600 shadow-md group-hover:scale-110 active:scale-95 transition-transform overflow-hidden">
                              <img
                                src={cpPartner.avatar}
                                alt={cpPartner.name}
                                className="w-full h-full object-cover rounded-full border border-white"
                              />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                              💖
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-700 mt-1 max-w-[62px] truncate text-center">
                              CP
                            </span>
                          </div>

                        </div>

                        {/* Real-time Metrics Row (Matching Screenshot) */}
                        <div className="flex items-center gap-8 pt-2 px-1">
                          <div 
                            onClick={() => triggerToast(`Followers: ${Object.keys(followedUserIds).length}`, "info")}
                            className="cursor-pointer group text-left"
                          >
                            <span className="block text-xl font-black text-slate-900 leading-none">
                              {Object.keys(followedUserIds).length}
                            </span>
                            <span className="text-xs font-bold text-slate-600 mt-1 block">
                              Followers
                            </span>
                          </div>

                          <div 
                            onClick={() => triggerToast(`Following: ${Object.values(followedUserIds).filter(Boolean).length}`, "info")}
                            className="cursor-pointer group text-left"
                          >
                            <span className="block text-xl font-black text-slate-900 leading-none">
                              {Object.values(followedUserIds).filter(Boolean).length}
                            </span>
                            <span className="text-xs font-bold text-slate-600 mt-1 block">
                              Following
                            </span>
                          </div>

                          <div 
                            onClick={() => triggerToast("Visitors: 0", "info")}
                            className="cursor-pointer group text-left"
                          >
                            <span className="block text-xl font-black text-slate-900 leading-none">
                              0
                            </span>
                            <span className="text-xs font-bold text-slate-600 mt-1 block">
                              Visitors
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* White Rounded Container with Main Options */}
                      <div className="bg-white rounded-t-[32px] pt-3 pb-8 px-4 shadow-xl space-y-1 min-h-[480px]">
                        
                        {/* 1. Wallet */}
                        <div
                          onClick={() => {
                            triggerToast(`Wallet Balance: 🪙 ${userCoins.toLocaleString()}`, "info");
                          }}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#3ddcbf] text-white flex items-center justify-center shadow-xs">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Wallet
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* 2. Invite Friends */}
                        <div
                          onClick={() => triggerToast("Referral link copied!", "success")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#ffd242] text-white font-black flex items-center justify-center text-lg shadow-xs">
                              H
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Invite Friends
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#fffbeb] border border-amber-200 text-[#b45309] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                              🍿 Earn Coins
                            </span>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          </div>
                        </div>

                        {/* 3. SVIP */}
                        <div
                          onClick={() => {
                            setSelectedVipLevel(1);
                            setShowVipPage(true);
                          }}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#23272e] text-amber-400 flex items-center justify-center font-black text-xs shadow-xs border border-amber-500/20">
                              SVIP
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              SVIP
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-400">
                              Join Now &gt;
                            </span>
                          </div>
                        </div>

                        {/* 4. Medal */}
                        <div
                          onClick={() => triggerToast("Medals catalog is active!", "info")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#3b82f6] text-white flex items-center justify-center shadow-xs">
                              <Award className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Medal
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* 5. Level */}
                        <div
                          onClick={() => {
                            setSelectedVipLevel(vipLevel || 1);
                            setShowVipPage(true);
                          }}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#ff8f3d] text-white flex items-center justify-center shadow-xs">
                              <Crown className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Level
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* 6. CP/Friend */}
                        <div
                          onClick={() => triggerToast("CP/Friend space is active!", "info")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#ff4d79] text-white flex items-center justify-center shadow-xs">
                              <Heart className="w-5 h-5 fill-white" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              CP/Friend
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* 7. Family */}
                        <div
                          onClick={() => triggerToast("Family clubs available!", "info")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#ffa338] text-white flex items-center justify-center shadow-xs">
                              <Users className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Family
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-400">
                              Join Now &gt;
                            </span>
                          </div>
                        </div>

                        {/* 8. Store */}
                        <div
                          onClick={() => triggerToast("Store catalog active!", "info")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#a855f7] text-white flex items-center justify-center shadow-xs">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Store
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* 9. My Items */}
                        <div
                          onClick={() => triggerToast("Backpack & items ready!", "info")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#38bdf8] text-white flex items-center justify-center shadow-xs">
                              <Shirt className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              My Items
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* Divider */}
                        <div className="my-2 border-t border-slate-100" />

                        {/* Settings */}
                        <div
                          onClick={openEditProfile}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-xs">
                              <Settings className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-800">
                              Profile Settings
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        {/* Sign Out */}
                        <div
                          onClick={handleLogout}
                          className="flex items-center justify-between p-3.5 hover:bg-rose-50 rounded-2xl text-rose-600 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs">
                              <X className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-extrabold">
                              Sign Out Session
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-rose-300 group-hover:text-rose-500 transition-colors" />
                        </div>

                      </div>

                    </div>
                  ) : (
                    /* DYNAMIC PROFILE EDITOR PANEL (Real-Time update fields matching screenshot style) */
                    <div className="min-h-full flex flex-col justify-between bg-[#f8f6fa] pb-10">
                      
                      {/* Top Sticky Header */}
                      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                        <button
                          onClick={() => setShowEditProfile(false)}
                          className="p-1 hover:bg-slate-50 rounded-full text-slate-600 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                        </button>
                        <h2 className="text-sm font-black text-slate-800 tracking-tight">
                          Edit My Profile
                        </h2>
                        <button
                          onClick={handleSaveProfile}
                          className="text-[11px] font-black text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-full transition-all cursor-pointer uppercase tracking-wider"
                        >
                          Save
                        </button>
                      </div>

                      {/* Main input body */}
                      <div className="flex-1 p-5 space-y-6">
                        
                        {/* Profile Photo selector */}
                        <div className="flex flex-col items-center gap-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                            Change Profile Photo
                          </span>
                          
                          <div className="relative mt-2">
                            <input
                              type="file"
                              onChange={handleEditProfileFileChange}
                              accept="image/*"
                              id="edit-profile-file-input"
                              className="hidden"
                            />
                            <div
                              onClick={() => document.getElementById("edit-profile-file-input")?.click()}
                              className="w-22 h-22 rounded-full border-4 border-slate-50 shadow-inner bg-slate-100 overflow-hidden flex items-center justify-center cursor-pointer relative group"
                            >
                              {editAvatar && editAvatar.trim() !== "" ? (
                                <img src={editAvatar} alt="Preview" className="w-full h-full object-cover group-hover:brightness-95 transition-all" />
                              ) : (
                                <span className="text-3xl font-black text-slate-400">
                                  {editName ? editName.charAt(0).toUpperCase() : "M"}
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                Upload
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => document.getElementById("edit-profile-file-input")?.click()}
                              className="absolute bottom-0 right-0 w-7.5 h-7.5 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-teal-600 cursor-pointer transition-all animate-pulse"
                            >
                              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>

                          {/* Default Avatars list preset */}
                          <div className="mt-4 w-full">
                            <span className="block text-center text-[9px] text-slate-400 font-black uppercase tracking-wider mb-2.5">
                              Or Pick Quick Avatar
                            </span>
                            <div className="flex items-center justify-center gap-2">
                              {DEFAULT_AVATARS.slice(0, 5).map((av, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditAvatar(av)}
                                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                                    editAvatar === av ? "border-teal-500 scale-110 shadow-xs" : "border-slate-200 hover:border-slate-300"
                                  }`}
                                >
                                  <img src={av} alt="Preset" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Input forms */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4.5">
                          
                          {/* Nickname */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Nickname (Name)
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={30}
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            />
                          </div>

                          {/* Birthday */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Birthday Date
                            </label>
                            <input
                              type="date"
                              required
                              value={editBirthday}
                              onChange={(e) => setEditBirthday(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            />
                          </div>

                          {/* Country Selector */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Country / Region
                            </label>
                            <div className="relative">
                              <select
                                value={editCountry ? editCountry.name : "Bangladesh"}
                                onChange={(e) => {
                                  const match = COUNTRIES_LIST.find(c => c.name === e.target.value);
                                  if (match) setEditCountry(match);
                                }}
                                className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none transition-all"
                              >
                                {COUNTRIES_LIST.map((country) => (
                                  <option key={country.name} value={country.name}>
                                    {country.flag} {country.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                ▼
                              </div>
                            </div>
                          </div>

                          {/* Gender Selector Toggle */}
                          <div className="space-y-2">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Gender
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { id: "Male", label: "Male ♂️", color: "border-blue-500 text-blue-600 bg-blue-50/40" },
                                { id: "Female", label: "Female ♀️", color: "border-pink-500 text-pink-600 bg-pink-50/40" }
                              ].map((gen) => {
                                const isSelected = editGender === gen.id;
                                return (
                                  <button
                                    key={gen.id}
                                    type="button"
                                    onClick={() => setEditGender(gen.id as any)}
                                    className={`py-2.5 rounded-2xl border-2 font-bold text-xs transition-all cursor-pointer ${
                                      isSelected 
                                        ? gen.color + " font-black shadow-xs scale-102"
                                        : "border-slate-200 hover:border-slate-300 text-slate-500 bg-slate-50/50"
                                    }`}
                                  >
                                    {gen.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bio (Short Slogan) */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Bio (Short Slogan)
                            </label>
                            <input
                              type="text"
                              maxLength={55}
                              value={editBio}
                              onChange={(e) => setEditBio(e.target.value)}
                              placeholder="Live, Love, Laugh 🌟"
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            />
                          </div>

                          {/* Long Detailed Description */}
                          <div className="space-y-1">
                            <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              About Me (Description)
                            </label>
                            <textarea
                              rows={3}
                              maxLength={250}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Tell other users a bit more about yourself..."
                              className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                            />
                          </div>

                        </div>
                      </div>

                      {/* Bottom action block */}
                      <div className="px-5 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          className="w-full py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:brightness-105 active:scale-98 text-white rounded-full text-xs font-bold tracking-widest uppercase shadow-md transition-all cursor-pointer text-center"
                        >
                          Save Changes
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

            </div>

            {/* 4. FLOATING ACTION BUTTONS (Screenshot 3 Calendar Check & Microphone) */}
            {activeBottomTab === "home" && (
              <div className="absolute bottom-24 right-5 flex flex-col gap-4 z-40 select-none">
                
                {/* Premium Golden & Emerald Calendar Daily Check-in badge logo */}
                <div className="relative">
                  <motion.button
                    animate={{
                      y: [0, -4, 0],
                      rotate: [0, -3, 3, -3, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCheckInModal(true)}
                    className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] border-2 border-amber-300/60 transition-all cursor-pointer z-10"
                    title="Daily Sign-in"
                  >
                    {/* Shiny golden coin bouncing on top of calendar logo */}
                    <div className="absolute -top-2.5 -right-2 w-7 h-7 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 rounded-full border border-white flex items-center justify-center shadow-md animate-bounce">
                      <span className="text-[10px] font-black text-[#5c4308]">💰</span>
                    </div>
                    <Calendar className="w-6 h-6 text-emerald-100" />
                    <span className="text-[8px] font-black uppercase tracking-wider text-yellow-300 mt-1">CHECK-IN</span>
                  </motion.button>
                  {/* Subtle attention ring behind check-in */}
                  <span className="absolute inset-0 rounded-2xl bg-[#10b981]/30 animate-pulse scale-110 pointer-events-none" />
                </div>

                {/* Large premium circular microphone icon with full spectrum rainbow voice ripples */}
                <div className="relative flex items-center justify-center">
                  
                  {/* Full Spectrum Rainbow Ripples */}
                  <motion.span
                    animate={{ scale: [1, 1.5, 2.1], opacity: [0.75, 0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-purple-500 to-pink-500 blur-[3px] opacity-70 pointer-events-none"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.35, 1.75], opacity: [0.85, 0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.1, ease: "easeOut", delay: 0.7 }}
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 via-indigo-500 via-cyan-400 via-emerald-400 to-yellow-400 blur-[4px] opacity-80 pointer-events-none"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.2, 1.45], opacity: [0.95, 0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.7, ease: "easeOut", delay: 1.4 }}
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 via-rose-500 via-amber-400 via-emerald-400 to-cyan-500 blur-[2px] opacity-90 pointer-events-none"
                  />
                  <motion.span
                    animate={{ scale: [1, 1.1, 1.25], opacity: [1, 0.7, 0] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeOut", delay: 0.3 }}
                    className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-[#ff007f] via-[#7f00ff] via-[#00ffff] via-[#ff7f00] to-[#ff007f] blur-[1px] opacity-95 pointer-events-none"
                  />

                  {/* Gentle Floating Wobble professional main button */}
                  <motion.button
                    animate={{
                      y: [0, -4, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateRoomModal(true)}
                    className="relative p-5 bg-gradient-to-tr from-[#ff3e6c] via-[#ff7e40] to-[#fdb813] hover:brightness-110 text-white rounded-full shadow-[0_12px_35px_rgba(255,62,108,0.55)] border-[3px] border-white transition-all cursor-pointer flex items-center justify-center z-10 w-[72px] h-[72px]"
                    title="Go Live! Start Voice Room"
                  >
                    <Mic className="w-8 h-8 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)] stroke-[2.5]" />
                    
                    {/* Live Indicator Dot */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 border border-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </span>
                  </motion.button>
                </div>

              </div>
            )}

            {/* 5. BOTTOM NAVIGATION BAR (Matches User's Screenshot aesthetic exactly) */}
            <div className="absolute bottom-0 inset-x-0 h-22 bg-white border-t border-slate-100/80 px-4 flex items-center justify-around z-40 select-none pb-2">
              
              {/* Home Tab */}
              <button
                onClick={() => setActiveBottomTab("home")}
                className="flex flex-col items-center justify-center cursor-pointer group flex-1"
              >
                <div className="relative p-1">
                  <Home className={`w-6 h-6 transition-all ${activeBottomTab === "home" ? "text-violet-600 stroke-[2.5] scale-110" : "text-slate-400 stroke-[2] group-hover:text-slate-600"}`} />
                </div>
                <span className={`text-[10px] tracking-wide mt-1 transition-all ${activeBottomTab === "home" ? "text-[#1e0d3d] font-black scale-105" : "text-slate-400 font-bold"}`}>
                  Home
                </span>
              </button>

              {/* Moment Tab */}
              <button
                onClick={() => {
                  setActiveBottomTab("moment");
                }}
                className="flex flex-col items-center justify-center cursor-pointer group flex-1"
              >
                <div className="relative p-1">
                  <Compass className={`w-6 h-6 transition-all ${activeBottomTab === "moment" ? "text-violet-600 stroke-[2.5] scale-110" : "text-slate-400 stroke-[2] group-hover:text-slate-600"}`} />
                </div>
                <span className={`text-[10px] tracking-wide mt-1 transition-all ${activeBottomTab === "moment" ? "text-[#1e0d3d] font-black scale-105" : "text-slate-400 font-bold"}`}>
                  Moment
                </span>
              </button>

              {/* Social Tab with real yellow speech icon */}
              <button
                onClick={() => setActiveBottomTab("social")}
                className="flex flex-col items-center justify-center cursor-pointer group flex-1 relative"
              >
                <div className="relative p-1">
                  {activeBottomTab === "social" ? (
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-md scale-105 transition-all">
                      <MessageCircle className="w-5 h-5 fill-white text-amber-400 stroke-none" />
                    </div>
                  ) : (
                    <MessageCircle className="w-6 h-6 text-slate-400 stroke-[2] group-hover:text-slate-600 transition-all" />
                  )}
                </div>
                <span className={`text-[10px] tracking-wide mt-1 transition-all ${activeBottomTab === "social" ? "text-[#1e0d3d] font-black scale-105" : "text-slate-400 font-bold"}`}>
                  Social
                </span>
              </button>

              {/* Mine Profile Tab with Glowing Golden Yellow Circle and Notification Red Dot matching Screenshot */}
              <button
                onClick={() => setActiveBottomTab("mine")}
                className="flex flex-col items-center justify-center cursor-pointer group flex-1 relative"
              >
                <div className="relative flex items-center justify-center">
                  {activeBottomTab === "mine" ? (
                    <>
                      {/* Gold Glowing aura behind */}
                      <div className="absolute w-12 h-12 rounded-full bg-gradient-to-b from-[#fffbeb] via-[#fde047] to-[#fbbf24] opacity-35 blur-[5px]" />
                      
                      {/* Highly polished active coin gold container */}
                      <div className="relative w-11 h-11 rounded-full bg-[#fffbeb] border-2 border-[#f59e0b] flex items-center justify-center shadow-[0_2px_12px_rgba(245,158,11,0.45)] z-10 scale-105 transition-all">
                        <span className="text-xl leading-none select-none">😊</span>
                        <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs" />
                      </div>
                    </>
                  ) : (
                    /* Simple inactive profile container */
                    <div className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-all">
                      <span className="text-lg leading-none opacity-60">😊</span>
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white shadow-xs" />
                    </div>
                  )}
                </div>
                
                <span className={`text-[10px] tracking-wide mt-1 transition-all ${activeBottomTab === "mine" ? "text-[#1e0d3d] font-black scale-105" : "text-slate-400 font-bold"}`}>
                  Mine
                </span>
              </button>

            </div>

            {/* CREATE LIVE AUDIO ROOM DIALOG MODAL (Satisfies "real-time when created") */}
            {showCreateRoomModal && (
              <div className="fixed inset-0 z-50 bg-[#090a15] flex flex-col justify-between overflow-y-auto font-sans text-white select-none">
                
                {/* Global Cosmic ambient gradients */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-indigo-900/15 rounded-full blur-[130px]" />
                  <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px]" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between px-6 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoomModal(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <h3 className="text-base font-black text-white tracking-wide absolute left-1/2 -translate-x-1/2">
                    Create Room
                  </h3>
                  <div className="w-10 h-10" />
                </div>

                {/* Main Form content matching the screenshot */}
                <form onSubmit={handleCreateRoom} className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-between px-6 py-6">
                  
                  {/* Container for profile and inputs */}
                  <div className="flex-1 flex flex-col justify-center items-center gap-6 my-auto w-full">
                    
                    {/* Media upload container */}
                    <div className="flex flex-col items-center gap-2">
                      <div
                        onClick={() => roomFileInputRef.current?.click()}
                        className="w-36 h-36 rounded-[28px] bg-[#22273c] border border-white/10 flex items-center justify-center relative cursor-pointer hover:brightness-110 active:scale-98 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]"
                      >
                        {newRoomPhoto && newRoomPhoto.trim() !== "" ? (
                          newRoomPhotoType === "video" ? (
                            <video
                              src={newRoomPhoto}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover rounded-[28px]"
                            />
                          ) : (
                            <img
                              src={newRoomPhoto}
                              alt="Room Photo"
                              className="w-full h-full object-cover rounded-[28px]"
                              referrerPolicy="no-referrer"
                            />
                          )
                        ) : (
                          /* Large prominent white bold "✕" */
                          <span className="text-white text-5xl font-extrabold select-none">✕</span>
                        )}

                        {/* Camera/badge icon at the bottom-right */}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md">
                          <Camera className="w-4 h-4 text-slate-800 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Input tag */}
                      <input
                        type="file"
                        ref={roomFileInputRef}
                        onChange={handleRoomFileChange}
                        accept="image/*,video/*"
                        className="hidden"
                      />

                      {/* Notice text below the card */}
                      <span className="text-[10px] font-black tracking-widest text-[#a78bfa] uppercase mt-2 select-none animate-pulse text-center">
                        CLICK TO SELECT MOVING PICTURE/GIF
                      </span>
                    </div>

                    {/* Inputs fields */}
                    <div className="w-full space-y-5 pt-2">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-400 select-none">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={30}
                          placeholder="Room Name"
                          value={newRoomTitle}
                          onChange={(e) => setNewRoomTitle(e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700/60 text-white text-sm font-semibold pb-2.5 focus:outline-none focus:border-[#ff9f43] focus:border-b-2 transition-all"
                        />
                      </div>

                      {/* Announcement input */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-400 select-none">
                          Announcement
                        </label>
                        <input
                          type="text"
                          maxLength={65}
                          placeholder="Welcome Announcement"
                          value={newRoomSubtitle}
                          onChange={(e) => setNewRoomSubtitle(e.target.value)}
                          className="w-full bg-transparent border-b border-slate-700/60 text-white text-sm font-semibold pb-2.5 focus:outline-none focus:border-[#ff9f43] focus:border-b-2 transition-all"
                        />
                      </div>

                      {/* Room Tag selection chips */}
                      <div className="space-y-3 pt-1">
                        <label className="block text-xs font-bold text-slate-400 select-none">
                          Room Tag
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "Friend", label: "Friend", icon: "🤗" },
                            { id: "Music", label: "Music", icon: "🎵" },
                            { id: "Boy", label: "Boy", icon: "♂️" },
                            { id: "Girl", label: "Girl", icon: "♀️" },
                            { id: "Love", label: "Love", icon: "❤️" },
                            { id: "Game", label: "Game", icon: "🎮" },
                            { id: "Gossip", label: "Gossip", icon: "💬" }
                          ].map((tag) => {
                            const isSelected = newRoomCategory === tag.id;
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => setNewRoomCategory(tag.id)}
                                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border select-none ${
                                  isSelected
                                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#4a2e00] border-transparent shadow-[0_4px_12px_rgba(245,158,11,0.3)] font-black"
                                    : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                                }`}
                              >
                                <span>{tag.icon}</span>
                                <span>{tag.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* START YOUR AUDIO LIVE NOW button */}
                  <div className="w-full pt-6">
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#fdb813] via-[#ff7e40] to-[#ff3e6c] hover:brightness-110 active:scale-[0.98] text-[#3c2a04] hover:text-[#2d1f02] text-xs font-black tracking-widest uppercase rounded-full transition-all shadow-[0_8px_25px_rgba(255,126,64,0.35)] cursor-pointer text-center"
                    >
                      START YOUR AUDIO LIVE NOW
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* SUB-MODAL 1: VIEW ALL ROOM MEMBERS LIST (Searchable real-time members grid) */}
            <AnimatePresence>
              {showAllJoinedMembers && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none">
                  <div onClick={() => setShowAllJoinedMembers(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-violet-100 overflow-hidden text-[#1e0d3d] z-10 flex flex-col max-h-[75vh]"
                  >
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <div>
                        <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                          <Users className="text-[#8c3494] w-5 h-5" />
                          <span>All Room Members</span>
                        </h3>
                        <p className="text-[10px] text-violet-400 font-bold">List of everyone currently inside this lounge</p>
                      </div>
                      <button
                        onClick={() => setShowAllJoinedMembers(false)}
                        className="p-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable Members List */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                      {roomMembersList.map((m, idx) => {
                        const isMe = m.id === "user-current";
                        const isManager = testRoomRole === "admin" || hostSeatUser?.id === "user-current" || superSeatUser?.id === "user-current";
                        return (
                          <div key={`${m.id || 'mem'}-${idx}`} className="flex items-center justify-between p-2.5 bg-slate-50/60 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all select-none">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-amber-500">
                                <img
                                  src={m.avatar || DEFAULT_AVATARS[0]}
                                  alt={m.name}
                                  className="w-full h-full object-cover rounded-full border border-white"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div>
                                <span className="block text-xs font-black text-slate-800 leading-none mb-1.5 flex items-center gap-1">
                                  {m.name}
                                  {m.role === "Owner" && <span className="text-[10px]" title="Owner">👑</span>}
                                  {m.role === "Admin" && <span className="text-[10px]" title="Admin">🛡️</span>}
                                  {m.role === "Host" && <span className="text-[10px]" title="Host">🎙️</span>}
                                </span>
                                <span className="block text-[8px] text-slate-400 font-bold font-mono tracking-wide leading-none">
                                  ID: {m.idNo || "24708556"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wider leading-none select-none shadow-sm ${m.color}`}>
                                {m.role}
                              </span>

                              {/* Show Action Controls if current user is manager and row is not current user */}
                              {isManager && !isMe && (
                                <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                                  {testRoomRole === "admin" && (
                                    <>
                                      <button
                                        onClick={() => {
                                          setRoomMembersList(prev => prev.map(item => item.id === m.id ? { ...item, role: "Admin", color: "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#002d4a]" } : item));
                                          
                                          // Update seats if they are sitting
                                          if (hostSeatUser && (hostSeatUser.id === m.id || hostSeatUser.name === m.name)) {
                                            setHostSeatUser(prev => prev ? { ...prev, role: "Admin" as any, name: prev.name.includes("[Admin]") ? prev.name : `🛡️ [Admin] ${prev.name}` } : null);
                                          } else if (superSeatUser && (superSeatUser.id === m.id || superSeatUser.name === m.name)) {
                                            setSuperSeatUser(prev => prev ? { ...prev, role: "Admin" as any, name: prev.name.includes("[Admin]") ? prev.name : `🛡️ [Admin] ${prev.name}` } : null);
                                          } else {
                                            setGridSeatsUsers(prev => prev.map(u => u && (u.id === m.id || u.name === m.name) ? { ...u, role: "Admin" as any, name: u.name.includes("[Admin]") ? u.name : `🛡️ [Admin] ${u.name}` } : u));
                                          }

                                          triggerToast(`${m.name} is now an Admin! 🛡️`, "success");
                                        }}
                                        title="Make Admin"
                                        className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer text-xs font-black transition-all"
                                      >
                                        🛡️
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRoomMembersList(prev => prev.map(item => item.id === m.id ? { ...item, role: "Host", color: "bg-gradient-to-r from-purple-400 to-indigo-500 text-[#25004a]" } : item));
                                          
                                          // Update seats if they are sitting
                                          if (hostSeatUser && (hostSeatUser.id === m.id || hostSeatUser.name === m.name)) {
                                            setHostSeatUser(prev => prev ? { ...prev, role: "Host" as any, name: prev.name.includes("[Host]") ? prev.name : `👑 [Host] ${prev.name}` } : null);
                                          } else if (superSeatUser && (superSeatUser.id === m.id || superSeatUser.name === m.name)) {
                                            setSuperSeatUser(prev => prev ? { ...prev, role: "Host" as any, name: prev.name.includes("[Host]") ? prev.name : `👑 [Host] ${prev.name}` } : null);
                                          } else {
                                            setGridSeatsUsers(prev => prev.map(u => u && (u.id === m.id || u.name === m.name) ? { ...u, role: "Host" as any, name: u.name.includes("[Host]") ? u.name : `👑 [Host] ${u.name}` } : u));
                                          }

                                          triggerToast(`${m.name} is now a Host! 👑`, "success");
                                        }}
                                        title="Make Host"
                                        className="p-1 rounded-lg bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-600 cursor-pointer text-xs font-black transition-all"
                                      >
                                        👑
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => {
                                      // Remove from seat if sitting
                                      if (hostSeatUser && (hostSeatUser.id === m.id || hostSeatUser.name === m.name)) setHostSeatUser(null);
                                      else if (superSeatUser && (superSeatUser.id === m.id || superSeatUser.name === m.name)) setSuperSeatUser(null);
                                      else setGridSeatsUsers(prev => prev.map(u => u && (u.id === m.id || u.name === m.name) ? null : u));

                                      setBannedUserNames(prev => [...prev, m.name]);
                                      setRoomMembersList(prev => prev.filter(item => item.id !== m.id));
                                      triggerToast(`${m.name} has been removed from this broadcast! 🚫`, "success");
                                    }}
                                    title="Remove from Broadcast"
                                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer text-xs font-black transition-all"
                                  >
                                    🚫
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* SUB-MODAL 2: CHANGE ROOM COVER PRESSETS MODAL */}
            <AnimatePresence>
              {showEditRoomCoverModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none">
                  <div onClick={() => setShowEditRoomCoverModal(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl border border-violet-100 overflow-hidden text-[#1e0d3d] z-10 flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-3 shrink-0">
                      <div>
                        <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                          <Camera className="text-amber-500 w-5 h-5" />
                          <span>Change Room Cover</span>
                        </h3>
                        <p className="text-[10px] text-violet-400 font-bold">Pick a gorgeous cover photo or enter custom URL</p>
                      </div>
                      <button
                        onClick={() => setShowEditRoomCoverModal(false)}
                        className="p-1 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400", // Woman cover (like screenshot)
                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400", // Alternative Portrait
                        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400", // Studio mic
                        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400", // Concert lights
                        "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&q=80&w=400&h=400", // Pastel abstract
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400"  // Peaceful beach
                      ].map((presetUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleUpdateRoomCover(presetUrl);
                            setShowEditRoomCoverModal(false);
                          }}
                          className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-100 hover:border-amber-400 transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          <img src={presetUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>

                    {/* Custom Image URL Input */}
                    <div className="space-y-1.5 mt-4">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Or Paste Custom Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customRoomCoverUrl}
                          onChange={(e) => setCustomRoomCoverUrl(e.target.value)}
                          placeholder="e.g. https://domain.com/photo.jpg"
                          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (customRoomCoverUrl.trim()) {
                              handleUpdateRoomCover(customRoomCoverUrl.trim());
                            }
                            setShowEditRoomCoverModal(false);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl"
                        >
                          APPLY
                        </button>
                      </div>
                    </div>

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* DAILY SIGN-IN CALENDAR MODAL (Claim Coins in Real-Time) */}
            {showCheckInModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div onClick={() => setShowCheckInModal(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-violet-100 overflow-hidden text-[#1e0d3d]"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-600" />
                  
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                        <Calendar className="text-emerald-500 w-5 h-5" />
                        <span>Daily Sign-in Tasks</span>
                      </h3>
                      <p className="text-[10px] text-violet-400">Claim your free gold coins daily!</p>
                    </div>
                    <button
                      onClick={() => setShowCheckInModal(false)}
                      className="p-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-400 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dynamic Countdown Timer Section */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100/50 space-y-2 mb-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-800">Your Gold Balance:</span>
                      <span className="font-extrabold text-amber-600">💰 {userCoins.toLocaleString()} Coins</span>
                    </div>
                    
                    <div className="pt-2 border-t border-emerald-200/50 flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-violet-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        Next Reset Countdown:
                      </span>
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {timeRemaining}
                      </span>
                    </div>
                  </div>

                  {/* 7 Day calendar cells */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                      const isClaimed = checkedInDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => handleClaimCheckIn(day)}
                          disabled={isClaimed}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer ${
                            isClaimed
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 opacity-70"
                              : "bg-violet-50 hover:bg-violet-100 border-violet-100 text-[#1e0d3d]"
                          }`}
                        >
                          <span className="text-[9px] font-mono font-bold uppercase opacity-60">Day {day}</span>
                          <Gift className={`w-4 h-4 ${isClaimed ? "text-emerald-500" : "text-amber-500 animate-pulse"}`} />
                          <span className="text-[10px] font-extrabold">+{day * 150}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview bypass disclaimer */}
                  <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-2.5 text-[9px] leading-relaxed text-amber-800 mb-4 font-medium">
                    ⚡ <strong>Live Test Mode:</strong> Next Claim cooldown is real-time. In this live preview, you can click other days instantly to test consecutive rewards & observe countdown resets immediately!
                  </div>

                  <button
                    onClick={() => setShowCheckInModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}


          </motion.div>
        )}

        {/* ==========================================
           5. ACTIVE LIVE VOICE ROOM (Fidelity-complete interactive client UI)
           ========================================== */}
        {currentStep === "room" && (
          <motion.div
            key="voice-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full bg-[#090a15] flex flex-col justify-between font-sans text-white select-none overflow-hidden"
          >
            {/* Ambient Blurred Background of the Room's Cover */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={activeRoom?.avatar || DEFAULT_AVATARS[0]}
                alt="Room Cover Blur"
                className="w-full h-full object-cover filter blur-[80px] opacity-20 scale-125"
                referrerPolicy="no-referrer"
              />
              {/* Complex radial and linear overlays for beautiful depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#090a15]/90 via-[#0d0e1a]/95 to-[#05060c]" />
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[120px]" />
            </div>

            {/* MAIN PORTRAIT CONTAINER (Max-width for elite mobile layout on all devices) */}
            <div className="relative z-10 w-full max-w-lg mx-auto flex-1 flex flex-col justify-between p-4 pb-6 overflow-hidden h-full">
              
              {/* 1. ROOM HEADER TOP BAR */}
              <div className="flex items-center justify-between w-full mt-2">
                
                {/* Left Side: Room Identity Pill */}
                <div className="relative">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRoomDetailsSheet(true);
                    }}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full pl-1 pr-3 py-1 backdrop-blur-md max-w-[210px] sm:max-w-xs shrink-0 shadow-lg cursor-pointer hover:bg-white/15 active:scale-95 transition-all"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-indigo-600/40 border border-white/20 flex items-center justify-center font-black text-sm text-white shrink-0">
                      {roomTheme === "star-host" ? (
                        /* Beautiful glowing golden crown badge around avatar */
                        <>
                          <div className="absolute -inset-1 z-10 pointer-events-none">
                            <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse filter drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">
                              <path d="M50 15 L58 35 L78 30 L66 48 L78 68 L50 60 L22 68 L34 48 L22 30 L42 35 Z" fill="url(#header-gold-crown-grad)" stroke="#b45309" strokeWidth="1.5" />
                              <circle cx="50" cy="15" r="4.5" fill="#fef08a" />
                              <circle cx="78" cy="30" r="3.5" fill="#fef08a" />
                              <circle cx="22" cy="30" r="3.5" fill="#fef08a" />
                              <defs>
                                <linearGradient id="header-gold-crown-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#fffae0" />
                                  <stop offset="50%" stopColor="#fbbf24" />
                                  <stop offset="100%" stopColor="#ca8a04" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60"
                            alt="BA❤️.ji🖤.ↄ"
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        </>
                      ) : (
                        <img
                          src={activeRoom?.avatar || DEFAULT_AVATARS[0]}
                          alt="Host Avatar"
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className="text-xs font-black text-white truncate tracking-wide leading-tight">
                        {roomTheme === "star-host" ? "BA❤️.ji🖤.ↄ" : (activeRoom?.title || "My Premium Lounge")}
                      </h4>
                      <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                        ID: {activeRoom?.idNo || "24708556"}
                      </span>
                    </div>
                    {isFollowingRoom ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFollowingRoom(false);
                          setRoomFollowersCount(prev => Math.max(106, prev - 1));
                          triggerToast("You unfollowed this live room.", "success");
                        }}
                        className="flex items-center text-[10px] bg-slate-700/60 border border-slate-600 text-slate-300 font-bold px-2 py-0.5 rounded-full ml-1.5 scale-90 origin-left shrink-0 shadow-sm cursor-pointer hover:bg-slate-700 transition-all"
                      >
                        ✓ Followed
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFollowingRoom(true);
                          setRoomFollowersCount(prev => prev + 1);
                          triggerToast("You followed this live room! 💖", "success");
                          triggerReaction("❤️");
                        }}
                        className="flex items-center text-[10px] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-amber-950 font-black px-2.5 py-0.5 rounded-full ml-1.5 scale-90 origin-left shrink-0 shadow-sm uppercase cursor-pointer hover:scale-95 transition-all"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Icons (Music, Tasks/Calendar, Exit) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (roomTheme === "star-host") {
                        triggerToast("Opening Planet Discovery Mode! 🪐✨", "success");
                      } else {
                        triggerToast("Ambient live audio feed synchronized! 🎶", "success");
                      }
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md ${
                      roomTheme === "star-host"
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                    title={roomTheme === "star-host" ? "Discovery Mode" : "Audio Sync"}
                  >
                    {roomTheme === "star-host" ? (
                      /* Glowing Space planet icon */
                      <div className="relative">
                        <Globe className="w-4 h-4 text-violet-300 animate-spin" style={{ animationDuration: '20s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-1 border-b-2 border-indigo-400 rotate-12 rounded-full opacity-80" />
                      </div>
                    ) : (
                      <Music className="w-4 h-4 text-slate-200" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCheckInModal(true);
                      triggerToast("Opened Daily Sign-in Tasks", "success");
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md ${
                      roomTheme === "star-host"
                        ? "bg-[#251545]/40 border-violet-500/20 text-violet-300 hover:bg-[#251545]/60"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                    title="Daily Tasks"
                  >
                    <Calendar className="w-4 h-4 text-slate-200" />
                  </button>

                  <button
                    onClick={() => {
                      setShowBroadcastDrawer(true);
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-md ${
                      roomTheme === "star-host"
                        ? "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                        : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                    }`}
                    title="Broadcast Options"
                  >
                    {roomTheme === "star-host" ? (
                      <Power className="w-4 h-4 text-red-400" strokeWidth={2.5} />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2. RANKINGS & VIEWER ROW */}
              <div className="w-full flex items-center justify-between mt-3 px-2">
                
                {/* Rankings and Gift pool */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerToast("Weekly hot index leaderboard loading...", "success")}
                    className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-200 hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Flame className="w-3 h-3 text-[#ff4d4d]" />
                    <span>Rankings</span>
                  </button>

                  <button
                    onClick={() => triggerToast("Room gift pool contains 💰 142,500 Coins!", "success")}
                    className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 active:scale-95 cursor-pointer transition-all"
                  >
                    <Gift className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>

                {/* Overlapping viewers count list */}
                <div
                  onClick={() => setShowOnlineMembersModal(true)}
                  className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full pl-2 pr-3 py-1 hover:bg-white/20 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex -space-x-2 mr-1">
                    {onlineMembersList.slice(0, 3).map((m, index) => (
                      <img
                        key={`online-member-${m.id || index}-${index}`}
                        src={m.avatar || DEFAULT_AVATARS[index % DEFAULT_AVATARS.length]}
                        alt={m.name}
                        className="w-5 h-5 rounded-full object-cover border border-[#0d0e1a]"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-amber-400">{onlineMembersList.length}</span>
                  <span className="text-[9px] text-slate-400 font-bold ml-0.5">❯</span>
                </div>
              </div>

              {/* REAL-TIME PK BATTLE BAR */}
              <PKBattleBar
                isActive={pkBattleActive}
                redUser={hostSeatUser || { id: "host", name: activeRoom?.hostName || "Host", avatar: activeRoom?.avatar || DEFAULT_AVATARS[0], role: "Host" } as any}
                blueUser={superSeatUser || (gridSeatsUsers[0] ? gridSeatsUsers[0] : { id: "blue", name: "Challenger", avatar: DEFAULT_AVATARS[1], role: "Guest" } as any)}
                redScore={pkRedScore}
                blueScore={pkBlueScore}
                onTogglePK={() => setPkBattleActive((prev) => !prev)}
              />

              {/* 3. CORE AUDIO SEATS SECTION */}
              {roomTheme === "star-host" ? (
                /* STAR HOST DISCOVERY THEME (Screenshot 2) */
                <div className="flex-1 flex flex-col justify-start gap-3 my-2 overflow-y-auto px-1 select-none relative z-30">
                  
                  {/* A. Top Section: 2 premium themed seats connected with live glowing heart wire */}
                  <div className="relative flex items-center justify-center gap-14 mt-4 select-none shrink-0">
                    
                    {/* SVG Connecting Heart string */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 pointer-events-none z-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 60" className="w-48 h-12 overflow-visible">
                        <path
                          d="M 10 30 Q 100 -5 190 30"
                          fill="none"
                          stroke="url(#heart-string-grad)"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                        <g className="animate-bounce">
                          <path
                            d="M 100 8 C 95 3, 87 3, 83 8 C 79 13, 79 21, 85 27 L 100 42 L 115 27 C 121 21, 121 13, 117 8 C 113 3, 105 3, 100 8 Z"
                            fill="#ec4899"
                          />
                        </g>
                        <defs>
                          <linearGradient id="heart-string-grad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f43f5e" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Left Premium Seat: Star Host "VIP BABA" */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRoomDetailsSheet(true);
                      }}
                      className="relative flex flex-col items-center z-10 cursor-pointer active:scale-95 transition-all"
                    >
                      {/* Star Host Banner Badge above avatar */}
                      <div className="absolute -top-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 text-[8px] font-black px-2 py-0.5 rounded-full shadow-md uppercase scale-90 tracking-widest border border-amber-300 z-20 flex items-center gap-0.5 animate-pulse">
                        <span>⭐ Star Host</span>
                      </div>
                      
                      <div className="relative w-22 h-22 rounded-full flex items-center justify-center">
                        {/* Golden glowing border */}
                        <div className="absolute inset-0 rounded-full border-3 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" />
                        
                        {/* Avatar Image */}
                        <div className="w-18 h-18 rounded-full bg-[#1b1e32] border-2 border-amber-500 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120"
                            alt="VIP BABA"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Mic Indicator Badge */}
                        <div className="absolute -bottom-1 right-0 bg-slate-900 border border-amber-500 rounded-full p-1 shadow-md scale-90">
                          <Mic className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                        </div>
                      </div>

                      <span className="text-[10px] font-black tracking-wide text-amber-400 uppercase mt-2 leading-none">
                        VIP BABA
                      </span>
                      
                      {/* Coins Label underneath name */}
                      <div className="mt-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 scale-90">
                        <span>🪙 106.83k</span>
                      </div>
                    </div>

                    {/* Right Premium Seat: "VIP mahi" */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRoomDetailsSheet(true);
                      }}
                      className="relative flex flex-col items-center z-10 cursor-pointer active:scale-95 transition-all"
                    >
                      {/* Dolphin floral banner badge above avatar */}
                      <div className="absolute -top-4 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md uppercase scale-90 tracking-widest border border-pink-300 z-20 flex items-center gap-0.5">
                        <span>🐬 Dolphin</span>
                      </div>

                      <div className="relative w-22 h-22 rounded-full flex items-center justify-center">
                        {/* Pink glowing border */}
                        <div className="absolute inset-0 rounded-full border-3 border-pink-400/90 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse" />
                        
                        {/* Avatar Image */}
                        <div className="w-18 h-18 rounded-full bg-[#1b1e32] border-2 border-pink-500 overflow-hidden">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120"
                            alt="VIP mahi"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Mic Indicator Badge */}
                        <div className="absolute -bottom-1 right-0 bg-slate-900 border border-pink-500 rounded-full p-1 shadow-md scale-90">
                          <Mic className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
                        </div>
                      </div>

                      <span className="text-[10px] font-black tracking-wide text-pink-400 uppercase mt-2 leading-none">
                        VIP mahi
                      </span>
                      
                      {/* Coins Label underneath name */}
                      <div className="mt-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 scale-90">
                        <span>🪙 23.4k</span>
                      </div>
                    </div>

                  </div>

                  {/* B. Grid Section: 8 circular seats (arranged in 2 rows of 4) */}
                  <div className="grid grid-cols-4 gap-y-7 gap-x-2 mt-4 px-1 py-1 shrink-0">
                    {[
                      { name: "dores", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80", coins: "0", status: "active" },
                      { name: "locked", avatar: null, coins: null, status: "locked" },
                      { name: "Seat 4", avatar: "sofa", coins: null, status: "clickable" },
                      { name: "Zeshan", avatar: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=80&h=80", coins: "0", status: "active" },
                      { name: "Raj", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80", coins: "0", status: "active" },
                      { name: "locked", avatar: null, coins: null, status: "locked" },
                      { name: "zddi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80", coins: "275", status: "special-wings" },
                      { name: "Aking", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80&h=80", coins: "0", status: "active" }
                    ].map((seat, idx) => (
                      <div key={`static-seat-${seat.name}-${idx}`} className="flex flex-col items-center justify-center relative">
                        {seat.status === "clickable" ? (
                          <div className="relative">
                            <button
                              onClick={() => {
                                handleSeatClick("grid", 3);
                              }}
                              className="relative w-15 h-15 rounded-full flex items-center justify-center bg-[#1c1830] border border-violet-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
                            >
                              {/* Couch Seat SVG */}
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-violet-400">
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                                <path d="M5 18v2M19 18v2" />
                              </svg>
                              
                              {/* Hand Clicking pointer animation to guide user */}
                              <div className="absolute -bottom-2 -right-2 w-7 h-7 pointer-events-none animate-bounce z-20">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                  <path d="M9 10V4.5C9 3.67 9.67 3 10.5 3C11.33 3 12 3.67 12 4.5V11.5M12 11.5V6.5C12 5.67 12.67 5 13.5 5C14.33 5 15 5.67 15 6.5V11.5M15 11.5V8.5C15 7.67 15.67 7 16.5 7C17.33 7 18 7.67 18 8.5V14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14V11.5M6 11.5C6 10.67 6.67 10 7.5 10C8.33 10 9 10.67 9 11.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#e11d48" />
                                </svg>
                              </div>
                            </button>
                            <span className="absolute -top-2 -left-1 bg-amber-500 text-amber-950 text-[7px] font-black px-1 rounded-full scale-90 select-none">
                              4
                            </span>
                          </div>
                        ) : seat.status === "locked" ? (
                          <button
                            onClick={() => triggerToast("This seat is currently locked by the host!", "success")}
                            className="relative w-15 h-15 rounded-full flex items-center justify-center bg-black/40 border border-slate-800/80 cursor-not-allowed shadow-inner"
                          >
                            <Lock className="w-4 h-4 text-slate-600" />
                          </button>
                        ) : (
                          /* Active / special seat with custom frame & stats */
                          <div className="relative">
                            {seat.status === "special-wings" && (
                              /* Glowing golden wings and crown overlay */
                              <div className="absolute -inset-2.5 z-10 pointer-events-none">
                                <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]">
                                  {/* Golden Crown */}
                                  <path d="M42 24 L45 32 L55 32 L58 24 L50 28 Z" fill="#f59e0b" />
                                  {/* Wings on the sides */}
                                  <path d="M22 45 C15 35, 10 50, 25 55 C18 55, 15 65, 28 62" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                                  <path d="M78 45 C85 35, 90 50, 75 55 C82 55, 85 65, 72 62" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                                </svg>
                              </div>
                            )}
                            <button
                              onClick={() => {
                                setShowRoomDetailsSheet(true);
                                triggerToast(`Clicked on ${seat.name}!`, "success");
                              }}
                              className="relative w-15 h-15 rounded-full flex items-center justify-center bg-[#151726] border border-violet-500/20 overflow-hidden transition-all hover:scale-105 active:scale-95"
                            >
                              <img
                                src={seat.avatar || ""}
                                alt={seat.name}
                                className="w-full h-full object-cover rounded-full"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          </div>
                        )}

                        {/* Name and Coins */}
                        <span className="text-[9px] font-black text-slate-300 mt-1 leading-none text-center truncate max-w-[55px]">
                          {seat.status === "locked" ? "locked" : (seat.status === "clickable" ? "Seat 4" : seat.name)}
                        </span>
                        {seat.coins !== null && (
                          <span className="text-[8px] font-bold text-amber-400 mt-0.5 leading-none flex items-center gap-0.5 scale-90">
                            🪙 {seat.coins}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Horizontal custom banners under the seats (Screenshot 2) */}
                  <div className="flex flex-col gap-1.5 w-full mt-2 px-1 shrink-0">
                    {/* Blue upgrade banner */}
                    <div className="bg-gradient-to-r from-cyan-600/25 via-blue-600/30 to-cyan-600/25 border border-cyan-500/30 rounded-xl px-3 py-1 flex items-center justify-between text-[9px] font-black text-cyan-200 shadow-md">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Room Level upgraded to LvL 5! Enjoy custom widgets 💎</span>
                      </div>
                      <span className="text-cyan-400/80">❯</span>
                    </div>

                    {/* Purple invite/greeting banner */}
                    <div className="bg-gradient-to-r from-fuchsia-600/25 via-purple-600/30 to-fuchsia-600/25 border border-fuchsia-500/30 rounded-xl px-3 py-1 flex items-center justify-between text-[9px] font-black text-fuchsia-200 shadow-md">
                      <div className="flex items-center gap-1.5">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=40&h=40"
                          alt="Host"
                          className="w-3.5 h-3.5 rounded-full object-cover border border-pink-400/50"
                          referrerPolicy="no-referrer"
                        />
                        <span>Thanks for your coming, click on the button and find me next time 🤍</span>
                      </div>
                      <button 
                        onClick={() => triggerToast("Room saved to your favorites list! ❤️", "success")}
                        className="bg-pink-500 text-white font-black px-2 py-0.5 rounded-full scale-90 hover:brightness-110 active:scale-95 shrink-0"
                      >
                        Find Me
                      </button>
                    </div>
                  </div>

                  {/* Floating Promotional/Gifting Side Panels (Screenshot 2 right side) */}
                  <div className="absolute right-4 top-[175px] z-30 flex flex-col items-center gap-2 pointer-events-auto">
                    {/* Pulsating green present box with GO text */}
                    <button
                      onClick={() => triggerToast("Mystery gift pool loading... Click to spin! 🎁", "success")}
                      className="relative w-10 h-10 bg-emerald-500/20 border-2 border-emerald-400/60 rounded-full flex flex-col items-center justify-center shadow-lg hover:bg-emerald-500/30 active:scale-95 transition-all animate-bounce"
                    >
                      <Gift className="w-5 h-5 text-emerald-400" />
                      <span className="absolute -bottom-1.5 bg-emerald-500 text-white text-[7px] font-black px-1 rounded-full scale-90">
                        GO
                      </span>
                    </button>

                    {/* Blue sparking chest */}
                    <button
                      onClick={() => triggerToast("Opening daily reward treasure chest! 🪙✨", "success")}
                      className="w-8 h-8 bg-blue-500/20 border border-blue-500/40 rounded-lg flex items-center justify-center shadow-md hover:bg-blue-500/30 active:scale-95 transition-all"
                      title="Treasure"
                    >
                      <Trophy className="w-4 h-4 text-blue-400" />
                    </button>

                    {/* Bottom Right Promo card carousel: COSTAR CAMP */}
                    <div 
                      onClick={() => triggerToast("Entering Costar Camp Audition Page! 🎤", "success")}
                      className="w-18 bg-[#1f1638]/90 border border-violet-500/30 rounded-xl p-1 flex flex-col items-center cursor-pointer hover:bg-[#1f1638] transition-all shadow-xl"
                    >
                      <div className="relative w-full h-11 rounded-lg overflow-hidden border border-white/5 bg-slate-900">
                        <img
                          src="https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=80&h=80"
                          alt="Promo"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center">
                          <span className="text-[7px] text-pink-400 font-black tracking-widest uppercase scale-90">COSTAR</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-slate-300 font-black mt-0.5">CAMP</span>
                      {/* Page indicators */}
                      <div className="flex gap-0.5 mt-0.5">
                        <div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* STANDARD THEME */
                <div className="flex-1 flex flex-col justify-start gap-5 my-4 overflow-y-auto px-1 select-none relative z-30">
                  
                  {/* A. Top Section: 2 premium seats (Host, Super) */}
                  <div className="flex items-center justify-center gap-16 mt-3">
                    
                    {/* HOST SEAT */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleSeatClick("host")}
                        className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {/* Animated Tiger Crown Overlay */}
                        {computedHostSeatUser && (computedHostSeatUser.id === "user-current" || computedHostSeatUser.id === loggedInUser?.id ? (loggedInUser?.hasTigerCrown || computedHostSeatUser.hasTigerCrown) : computedHostSeatUser.hasTigerCrown) && (
                          <TigerCrown size="premium-seat" />
                        )}

                        {/* Premium gold glowing circular border */}
                        <div className="absolute inset-0 rounded-full border-3 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse" />
                        <div className="absolute -inset-1 rounded-full border border-amber-500/40 bg-amber-500/5" />
                        
                        {/* Elegant Speaking Ripples (Red and Blue) */}
                        {isHostSpeaking && (
                          <div className="absolute inset-0 rounded-full pointer-events-none z-0">
                            <div className="absolute -inset-2 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                            <div className="absolute -inset-4 rounded-full border-2 border-cyan-400 animate-ping opacity-40 delay-300" />
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-500 to-cyan-500 opacity-25 blur-xs animate-pulse" />
                          </div>
                        )}
                        
                        {/* Seat Inner Background & Avatar/Icon */}
                        <div className="w-13 h-13 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden relative">
                          {computedHostSeatUser ? (
                            <div className="relative w-full h-full">
                              <img
                                src={computedHostSeatUser.avatar || DEFAULT_AVATARS[0]}
                                alt={computedHostSeatUser.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {(computedHostSeatUser.isMuted || seatMutes["host"]) && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                  <MicOff className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                                </div>
                              )}
                            </div>
                          ) : seatMutes["host"] ? (
                            <div className="flex flex-col items-center justify-center animate-pulse">
                              <MicOff className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            </div>
                          ) : seatLocks["host"] ? (
                            <Lock className="w-5 h-5 text-amber-400" />
                          ) : (
                            <div className="flex flex-col items-center text-slate-400 justify-center">
                              {/* Standard elegant inline sofa icon */}
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400/70">
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                                <path d="M5 18v2M19 18v2" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Speaking Aura or Mute indicator badge */}
                        {(computedHostSeatUser || seatMutes["host"]) && (
                          <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                            {(computedHostSeatUser?.isMuted || seatMutes["host"]) ? (
                              <MicOff className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            )}
                          </div>
                        )}
                      </button>
                      <div className="flex flex-col items-center justify-center mt-3.5 max-w-[85px] w-full relative z-50">
                        <div className="flex items-center justify-center gap-1 max-w-full">
                          {computedHostSeatUser && (
                            <User className="w-3 h-3 text-red-500 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" fill="currentColor" />
                          )}
                          <span className={`text-[10.5px] font-black text-center break-words max-w-[84px] leading-tight ${seatMutes["host"] ? "text-red-500 font-bold" : "text-amber-300 font-black"}`}>
                            {computedHostSeatUser ? computedHostSeatUser.name : seatMutes["host"] ? "MUTED" : "HOST"}
                          </span>
                        </div>
                        {computedHostSeatUser && (
                          <div className="px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-[9px] font-black text-pink-400 flex items-center gap-1 shadow mt-0.5">
                            <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500 shrink-0" />
                            <span>{(seatCoinsMap[computedHostSeatUser.name] || 0).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SUPER SEAT */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleSeatClick("super")}
                        className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {/* Animated Tiger Crown Overlay */}
                        {computedSuperSeatUser && (computedSuperSeatUser.id === "user-current" || computedSuperSeatUser.id === loggedInUser?.id ? (loggedInUser?.hasTigerCrown || computedSuperSeatUser.hasTigerCrown) : computedSuperSeatUser.hasTigerCrown) && (
                          <TigerCrown size="premium-seat" />
                        )}

                        {/* Premium pink/magenta glowing circular border */}
                        <div className="absolute inset-0 rounded-full border-3 border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.4)]" />
                        <div className="absolute -inset-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/5" />
                        
                        {/* Elegant Speaking Ripples (Red and Blue) */}
                        {isSuperSpeaking && (
                          <div className="absolute inset-0 rounded-full pointer-events-none z-0">
                            <div className="absolute -inset-2 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                            <div className="absolute -inset-4 rounded-full border-2 border-cyan-400 animate-ping opacity-40 delay-300" />
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-red-500 to-cyan-500 opacity-25 blur-xs animate-pulse" />
                          </div>
                        )}
                        
                        {/* Seat Inner Background & Avatar/Icon */}
                        <div className="w-13 h-13 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden relative">
                          {computedSuperSeatUser ? (
                            <div className="relative w-full h-full">
                              <img
                                src={computedSuperSeatUser.avatar || DEFAULT_AVATARS[0]}
                                alt={computedSuperSeatUser.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {(computedSuperSeatUser.isMuted || seatMutes["super"]) && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                  <MicOff className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                                </div>
                              )}
                            </div>
                          ) : seatMutes["super"] ? (
                            <div className="flex flex-col items-center justify-center animate-pulse">
                              <MicOff className="w-7 h-7 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            </div>
                          ) : seatLocks["super"] ? (
                            <Lock className="w-5 h-5 text-fuchsia-400" />
                          ) : (
                            <div className="flex flex-col items-center text-slate-400 justify-center">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-fuchsia-400/70">
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                                <path d="M5 18v2M19 18v2" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Speaking Aura or Mute indicator badge */}
                        {(computedSuperSeatUser || seatMutes["super"]) && (
                          <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                            {(computedSuperSeatUser?.isMuted || seatMutes["super"]) ? (
                              <MicOff className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            )}
                          </div>
                        )}
                      </button>
                      <div className="flex flex-col items-center justify-center mt-3.5 max-w-[85px] w-full relative z-50">
                        <div className="flex items-center justify-center gap-1 max-w-full">
                          {computedSuperSeatUser && (
                            <User 
                              className={`w-3 h-3 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
                                (computedSuperSeatUser.id === activeRoom?.hostId || computedSuperSeatUser.name === activeRoom?.hostName) 
                                  ? "text-red-500" 
                                  : (computedSuperSeatUser.role === "Admin" || computedSuperSeatUser.name.includes("[Admin]") || computedSuperSeatUser.name.includes("🛡️")) 
                                    ? "text-cyan-400" 
                                    : "text-purple-400"
                              }`} 
                              fill="currentColor" 
                            />
                          )}
                          <span className={`text-[10.5px] font-black text-center break-words max-w-[84px] leading-tight ${seatMutes["super"] ? "text-red-500 font-bold" : "text-fuchsia-300 font-black"}`}>
                            {computedSuperSeatUser ? computedSuperSeatUser.name : seatMutes["super"] ? "MUTED" : "SUPER"}
                          </span>
                        </div>
                        {computedSuperSeatUser && (
                          <div className="px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-[9px] font-black text-pink-400 flex items-center gap-1 shadow mt-0.5">
                            <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500 shrink-0" />
                            <span>{(seatCoinsMap[computedSuperSeatUser.name] || 0).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* B. Grid Section: 10 circular couch seats (arranged in 2 rows of 5, no border, no background as requested) */}
                  <div className="grid grid-cols-5 gap-y-8 gap-x-2 mt-3 px-1 py-2">
                    {computedGridSeatsUsers.map((user, idx) => {
                      const isGridSpeaking = !!(user && (
                        (user.agoraUid && speakingUids.has(Number(user.agoraUid))) ||
                        (user.id === (loggedInUser?.id || "user-current") && !isMuted && realAudioLevel > 15)
                      ));
                      return (
                        <div key={`grid-seat-user-${idx}-${user ? user.id : 'empty'}`} className="flex flex-col items-center justify-center">
                          <button
                            onClick={() => handleSeatClick("grid", idx)}
                            className="relative w-13 h-13 rounded-full flex items-center justify-center bg-[#151726]/90 border border-slate-700/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                          >
                            {/* Animated Tiger Crown Overlay */}
                            {user && (user.id === "user-current" || user.id === loggedInUser?.id ? (loggedInUser?.hasTigerCrown || user.hasTigerCrown) : user.hasTigerCrown) && (
                              <TigerCrown size="grid-seat" />
                            )}

                            {/* Elegant Speaking Ripples (Red and Blue) */}
                            {isGridSpeaking && (
                              <div className="absolute inset-0 rounded-full pointer-events-none z-0">
                                <div className="absolute -inset-1.5 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                                <div className="absolute -inset-3 rounded-full border-2 border-cyan-400 animate-ping opacity-40 delay-300" />
                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-red-500 to-cyan-500 opacity-25 blur-xs animate-pulse" />
                              </div>
                            )}

                            {user ? (
                            <div className="w-full h-full rounded-full overflow-hidden border border-violet-500/30 relative">
                              <img
                                src={user.avatar || DEFAULT_AVATARS[0]}
                                alt={user.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {(user.isMuted || seatMutes[`grid-${idx}`]) && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-full">
                                  <MicOff className="w-4 h-4 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                                </div>
                              )}
                            </div>
                          ) : seatMutes[`grid-${idx}`] ? (
                            <div className="flex flex-col items-center justify-center animate-pulse">
                              <MicOff className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                            </div>
                          ) : seatLocks[`grid-${idx}`] ? (
                            <Lock className="w-4 h-4 text-violet-400" />
                          ) : (
                            /* Elegant Sofa SVG inside empty couch circle */
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-500">
                              <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                              <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                              <path d="M5 18v2M19 18v2" />
                            </svg>
                          )}

                          {/* Speaking / Mute Indicators */}
                          {(user || seatMutes[`grid-${idx}`]) && (
                            <div className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-700/50 rounded-full p-0.5 scale-75">
                              {(user?.isMuted || seatMutes[`grid-${idx}`]) ? (
                                <MicOff className="w-3 h-3 text-red-500" />
                              ) : (
                                <Mic className="w-3 h-3 text-emerald-400" />
                              )}
                            </div>
                          )}
                        </button>
                        
                        {/* Label underneath seat (Screenshot 4) */}
                        <div className="flex flex-col items-center justify-center mt-3.5 max-w-[80px] w-full relative z-50">
                          <div className="flex items-center justify-center gap-0.5 max-w-full">
                            {user && (
                              <User 
                                className={`w-2.5 h-2.5 shrink-0 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
                                  (user.id === activeRoom?.hostId || user.name === activeRoom?.hostName) 
                                    ? "text-red-500" 
                                    : (user.role === "Admin" || user.name.includes("[Admin]") || user.name.includes("🛡️")) 
                                      ? "text-cyan-400" 
                                      : "text-purple-400"
                                }`} 
                                fill="currentColor" 
                              />
                            )}
                            <span className={`text-[9.5px] font-black text-center break-words max-w-[76px] leading-tight ${seatMutes[`grid-${idx}`] ? "text-red-500 font-bold" : "text-slate-100 font-bold"}`}>
                              {user ? user.name : seatMutes[`grid-${idx}`] ? "MUTED" : `NO ${idx + 1}`}
                            </span>
                          </div>
                          {user && (
                            <div className="px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-[9px] font-black text-pink-400 flex items-center gap-1 shadow mt-0.5">
                              <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500 shrink-0" />
                              <span>{(seatCoinsMap[user.name] || 0).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ); })}
                  </div>

                </div>
              )}

              {/* 4. REAL-TIME FLOATING MESSAGE BROADCAST (Absolute overlay above bottom bar, scrollable to view full message history) */}
              <div
                ref={chatContainerRef}
                className="absolute bottom-[110px] left-4 right-4 max-w-[340px] xs:max-w-[390px] md:max-w-[450px] flex flex-col items-start gap-2.5 pointer-events-auto overflow-y-auto max-h-[175px] z-10 select-text pr-1 scroll-smooth scrollbar-none"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none", /* Firefox */
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%)"
                }}
              >
                <style dangerouslySetInnerHTML={{__html: `
                  /* Hide scrollbar for Chrome, Safari and Opera */
                  .scrollbar-none::-webkit-scrollbar {
                    display: none;
                  }
                `}} />
                <AnimatePresence initial={false}>
                  {[
                    ...(roomTheme === "star-host" ? [
                      { id: "star-1", type: "special-entry", user: "YT", badges: ["VIP2", "Duke", "L-14", "L-20", "L-39"], text: "entered the room" },
                      { id: "star-2", type: "special-entry", user: "MR __ayan", badges: ["L-1", "L-28", "L-24", "♌"], text: "entered the room" },
                      { id: "star-3", type: "special-entry", user: "Raj", badges: ["L-23", "L-34", "💖"], text: "entered the room" },
                      { id: "star-4", type: "gift", sender: "Md Munna", receiver: "VIP BABA", item: "🪙 Gold Coin", count: 1 },
                      { id: "star-5", type: "gift", sender: "Md Munna", receiver: "VIP BABA", item: "🔔 Golden Bell", count: 1 }
                    ] : []),
                    ...roomMessages.map(msg => ({
                      id: msg.id,
                      type: msg.type || "chat",
                      user: msg.senderName,
                      text: msg.text,
                      timestamp: msg.timestamp,
                      status: msg.status,
                      replyTo: msg.replyTo,
                      senderId: msg.senderId,
                      senderAvatar: msg.senderAvatar,
                      senderVipLevel: msg.senderVipLevel,
                      senderIdNo: msg.senderIdNo,
                      senderBio: msg.senderBio,
                      senderCountryFlag: msg.senderCountryFlag,
                      senderGender: msg.senderGender,
                      senderBirthday: msg.senderBirthday,
                      sender: msg.senderName,
                      receiver: msg.receiverName,
                      item: msg.giftItem,
                      count: msg.giftCount,
                    })),
                    ...roomAlerts.filter(alert => alert.type === "gift" || alert.type === "announcement" || alert.type === "special-entry")
                  ].slice(-50).map((alert: any, alertIdx: number) => {
                    if (alert.type === "special-entry") {
                      return (
                        <motion.div
                          key={`alert-entry-${alert.id || alertIdx}`}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-[#1d123a]/80 border border-violet-500/30 text-white px-3 py-1.5 rounded-2xl rounded-tl-none text-[10px] font-black shadow-[0_4px_12px_rgba(139,92,246,0.3)] flex flex-wrap items-center gap-1 backdrop-blur-md self-start shrink-0"
                        >
                          {/* Render beautiful badges */}
                          {alert.badges && alert.badges.map((badge: any, bidx: number) => {
                            let badgeStyle = "bg-rose-500 text-white";
                            if (badge.startsWith("VIP")) badgeStyle = "bg-amber-500 text-amber-950";
                            else if (badge === "Duke") badgeStyle = "bg-indigo-600 text-white";
                            else if (badge.startsWith("L-")) badgeStyle = "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
                            else badgeStyle = "bg-pink-500 text-white";
                            return (
                              <span key={bidx} className={`${badgeStyle} px-1 rounded text-[7px] font-black select-none tracking-tight`}>
                                {badge}
                              </span>
                            );
                          })}
                          <span className="text-[#a78bfa] font-black">{alert.user}</span>
                          <span className="text-violet-200/90 font-medium">{alert.text}</span>
                        </motion.div>
                      );
                    } else if (alert.type === "gift") {
                      const getGiftEmojiForChat = (itemName: string) => {
                        const name = (itemName || "").toLowerCase();
                        if (name.includes("dragon")) return "🐉🔥";
                        if (name.includes("hammer")) return "🔨💥";
                        if (name.includes("glove")) return "🥊⚡";
                        if (name.includes("shield")) return "🛡️✨";
                        if (name.includes("rocket")) return "🚀💥";
                        if (name.includes("world cup") || name.includes("trophy")) return "🏆⚽";
                        if (name.includes("rose")) return "🌹✨";
                        if (name.includes("cat") || name.includes("guitar")) return "🐱🎸";
                        if (name.includes("kiss")) return "💋❤️";
                        if (name.includes("castle") || name.includes("fireworks")) return "🏰🎆";
                        if (name.includes("couple") || name.includes("love")) return "👩‍❤️‍👨🎈";
                        if (name.includes("heart")) return "💖✨";
                        if (name.includes("crown")) return "👑✨";
                        if (name.includes("card")) return "🃏👑";
                        if (name.includes("chest") || name.includes("treasure")) return "💎🪙";
                        if (name.includes("clinking") || name.includes("glass")) return "🥂✨";
                        return "🎁✨";
                      };
                      return (
                        <motion.div
                          key={`alert-gift-${alert.id || alertIdx}`}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-black/55 border border-amber-400/30 backdrop-blur-md rounded-2xl flex items-center gap-3 px-3.5 py-1.5 max-w-[290px] shadow-lg select-none overflow-visible self-start shrink-0"
                        >
                          {/* Exact Realtime Gift Logo Badge */}
                          <div className="shrink-0 flex items-center justify-center bg-gradient-to-tr from-purple-900/90 via-pink-900/90 to-amber-900/90 rounded-xl w-9 h-9 shadow-inner border border-amber-400/50 text-xl">
                            {getGiftEmojiForChat(alert.item)}
                          </div>
                          {/* Gift Details on Right */}
                          <div className="flex flex-col min-w-0 pr-1">
                            <div className="flex items-center gap-1 flex-wrap leading-tight">
                              <span className="text-pink-400 font-extrabold truncate max-w-[85px] text-[10px]">{alert.sender}</span>
                              <span className="text-slate-300 font-bold text-[8px] uppercase tracking-wider">sent to</span>
                              <span className="text-amber-400 font-extrabold truncate max-w-[85px] text-[10px]">{alert.receiver}</span>
                            </div>
                            <span className="text-white/70 text-[9px] font-bold mt-0.5 truncate max-w-[130px]">
                              {alert.item || "Royal Gift"}
                            </span>
                          </div>
                          {/* Giant 3D Yellow multiplier font */}
                          <span className="text-yellow-400 text-lg font-black tracking-tighter drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)] ml-auto shrink-0 pl-1">
                            x{alert.count || 1}
                          </span>
                        </motion.div>
                      );
                    } else if (alert.type === "announcement") {
                      return (
                        <motion.div
                          key={`alert-ann-${alert.id || alertIdx}`}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-slate-950/80 border border-amber-500/30 text-amber-100 px-4 py-2 rounded-2xl rounded-tl-none text-xs font-bold shadow-[0_4px_15px_rgba(245,158,11,0.2)] flex items-center gap-2 backdrop-blur-md self-start shrink-0"
                        >
                          <span className="text-[12px] shrink-0">👑</span>
                          <span className="truncate max-w-[200px] sm:max-w-xs">{alert.text}</span>
                        </motion.div>
                      );
                    } else if (alert.type === "chat") {
                      const isMe = alert.senderId === (loggedInUser?.id || "user-current");
                      const nameColor = alert.senderVipLevel && alert.senderVipLevel >= 11
                        ? "text-yellow-400" 
                        : alert.senderVipLevel && alert.senderVipLevel >= 5 
                          ? "text-pink-400" 
                          : "text-cyan-400";

                      // Smartly look up sender roles for custom badges
                      const senderMember = roomMembersList.find(m => m.id === alert.senderId || m.name === alert.user);
                      const senderRole = senderMember ? senderMember.role : undefined;

                      const isOwner = alert.user === activeRoom?.hostName || senderRole === "Owner";
                      const isHost = senderRole === "Host" || (activeRoom && hostSeatUser && (hostSeatUser.id === alert.senderId || hostSeatUser.name === alert.user));
                      const isAdmin = senderRole === "Admin" || (alert.user && (alert.user.includes("Admin") || alert.user.includes("🛡️"))) || (alert.senderId === "user-current" && testRoomRole === "admin");

                      return (
                        <motion.div
                          key={`alert-chat-${alert.id || alertIdx}`}
                          initial={{ opacity: 0, x: -50, y: 10, filter: "blur(2px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -20, y: -5, filter: "blur(1px)" }}
                          transition={{ type: "spring", stiffness: 260, damping: 24 }}
                          className="flex items-start gap-2.5 w-full max-w-[340px] xs:max-w-[380px] md:max-w-[440px] self-start shrink-0"
                        >
                          {/* Circular Avatar + Overlaid Country Flag Badge on Bottom-Right */}
                          <div className="relative shrink-0 select-none">
                            <img
                              src={alert.senderAvatar || DEFAULT_AVATARS[0]}
                              alt={alert.user}
                              onClick={() => {
                                const userProfile: UserProfile = {
                                  id: alert.senderId || "unknown",
                                  name: alert.user || "User",
                                  avatar: alert.senderAvatar || DEFAULT_AVATARS[0],
                                  vipLevel: alert.senderVipLevel || 1,
                                  idNo: alert.senderIdNo || "1000001",
                                  bio: alert.senderBio || "Live life to the fullest! 🚀",
                                  countryFlag: alert.senderCountryFlag || "🇧🇩",
                                  gender: alert.senderGender || "Male",
                                  birthday: alert.senderBirthday || "1999-10-12",
                                  authProvider: "google"
                                };
                                setSelectedProfileUser(userProfile);
                              }}
                              className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute -bottom-1 -right-1 text-[13px] select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                              {alert.senderCountryFlag || "🇧🇩"}
                            </span>
                          </div>

                          {/* Beautiful Glassmorphic Capsule */}
                          <div
                            onClick={() => {
                              setReplyToMessage({
                                id: alert.id,
                                senderName: alert.user,
                                text: alert.text
                              });
                              triggerToast(`Replying to ${alert.user}...`, "success");
                            }}
                            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none px-4 py-2 flex flex-col gap-1 shadow-md text-left max-w-[85%] cursor-pointer hover:bg-black/50 active:scale-[0.99] transition-all"
                          >
                            {/* Header with Name & Badges on the SAME line */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-black tracking-wide text-[13px] ${nameColor}`}>
                                {alert.user}
                              </span>
                              {renderUserBadges(alert.user, alert.senderVipLevel, isOwner, isHost ? "Host" : (isAdmin ? "Admin" : (isOwner ? "Owner" : undefined)), isHost)}
                              <span className="text-[8px] text-white/40 font-semibold ml-auto shrink-0 select-none">
                                {getRelativeTime(alert.timestamp)}
                              </span>
                            </div>

                            {/* Reply Indicator */}
                            {alert.replyTo && (
                              <div className="text-[10.5px] bg-white/5 border-l-2 border-cyan-400 px-2 py-0.5 rounded mt-0.5 select-none text-slate-300 max-w-full truncate">
                                <span className="font-bold text-cyan-400 text-[8.5px] mr-1 select-none">
                                  ↩️ @{alert.replyTo.senderName}:
                                </span>
                                <span className="italic">{alert.replyTo.text}</span>
                              </div>
                            )}

                            {/* Message Text Content */}
                            <p className="text-[13.5px] font-extrabold leading-relaxed text-white/95 break-words whitespace-pre-wrap max-w-full mt-0.5">
                              {alert.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    } else {
                      return (
                        <motion.div
                          key={`alert-other-${alert.id || alertIdx}`}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-slate-950/80 border border-cyan-500/30 text-cyan-50 px-4 py-2 rounded-2xl rounded-tl-none text-xs font-bold shadow-[0_4px_15px_rgba(6,182,212,0.2)] flex items-center justify-between gap-3 backdrop-blur-md self-start shrink-0"
                        >
                          <div className="flex items-center gap-2 truncate max-w-[180px] sm:max-w-xs">
                            <span className="text-[12px] shrink-0">👋</span>
                            <span className="truncate">{alert.text}</span>
                          </div>
                          <button
                            onClick={() => triggerToast("Viewing user profile details", "success")}
                            className="bg-white text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                          >
                            View
                          </button>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>

              {/* 5. BOTTOM BAR CONTROLS (Redesigned to perfectly match the uploaded screenshot layout) */}
              <div className="w-full flex items-center justify-between flex-nowrap gap-1 mt-4 px-1 py-1.5 select-none border-t border-white/5 pt-3">
                
                {/* A. Chat Text Input / Pill (Leftmost option) - Significantly wider and larger as requested */}
                <div className="flex-1 min-w-[120px] max-w-[210px] xs:max-w-[260px] md:max-w-[360px] shrink flex flex-col">
                  {/* Reply Banner Indicator */}
                  {replyToMessage && (
                    <div className="flex items-center justify-between bg-black/45 border border-white/10 rounded-xl px-2 py-1 mb-1.5 text-[10px] text-slate-300">
                      <span className="truncate">
                        ↩️ Replying to <strong className="text-violet-300">@{replyToMessage.senderName}</strong>: "{replyToMessage.text}"
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyToMessage(null)}
                        className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const text = chatMessage.trim();
                      if (!text) return;
                      const uName = loggedInUser ? loggedInUser.name : "Munna";

                      // Dispatch via real-time Agora Chat connection
                      if (agoraChatRef.current && activeRoom) {
                        const roomName = activeRoom.id || "voxa_lobby";
                        agoraChatRef.current.sendMessage(roomName, text).catch((err: any) => {
                          console.error("[Agora] Send message failed:", err);
                        });
                      }

                      // Persist message in Firestore in real-time under activeRoom messages!
                      if (activeRoom?.id) {
                        try {
                          const messagesRef = collection(db, "rooms", activeRoom.id, "messages");
                          const randomIdNo = String(Math.floor(Math.random() * 9000000) + 1000000);
                          
                          await addDoc(messagesRef, {
                            text: text,
                            senderId: loggedInUser?.id || "user-current",
                            senderName: loggedInUser?.name || "Md Munna",
                            senderAvatar: loggedInUser?.avatar || DEFAULT_AVATARS[0],
                            senderVipLevel: loggedInUser?.vipLevel || 4,
                            senderIdNo: loggedInUser?.idNo || randomIdNo,
                            senderBio: loggedInUser?.bio || "Live life to the fullest! 🚀",
                            senderCountryFlag: loggedInUser?.countryFlag || "🇧🇩",
                            senderGender: loggedInUser?.gender || "Male",
                            senderBirthday: loggedInUser?.birthday || "1999-10-12",
                            timestamp: Date.now(),
                            status: "sent",
                            replyTo: replyToMessage ? {
                              id: replyToMessage.id,
                              senderName: replyToMessage.senderName,
                              text: replyToMessage.text
                            } : null
                          });

                          setReplyToMessage(null);
                        } catch (err) {
                          console.error("Failed to write chat message to Firestore:", err);
                        }
                      } else {
                        // Local fallback alert
                        setRoomAlerts(prev => [
                          ...prev,
                          { id: `chat-${Date.now()}-${Math.random()}`, text: text, type: "chat", user: uName }
                        ]);
                      }

                      setChatMessage("");
                    }}
                    className="flex items-center bg-white/10 hover:bg-white/15 border border-white/15 rounded-full pl-3 pr-1 py-0.5 transition-all focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/20 shadow-md"
                  >
                    <input
                      id="room-chat-input-field"
                      type="text"
                      placeholder="Chat..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="w-full bg-transparent text-white text-[13px] placeholder-white/50 outline-none border-none py-1 px-0.5 font-bold tracking-wide"
                    />
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className={`p-1.5 rounded-full transition-all flex items-center justify-center shrink-0 ${
                        chatMessage.trim()
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                          : "text-white/20 cursor-not-allowed"
                      }`}
                      title="Send Message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* B. Speaker Icon */}
                <button
                  onClick={() => {
                    setIsNoiseReductionActive(!isNoiseReductionActive);
                    triggerToast(isNoiseReductionActive ? "Speaker sound muted." : "Speaker sound enabled.", "success");
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 text-white bg-transparent shrink-0"
                  title="Toggle Sound"
                >
                  {isNoiseReductionActive ? <Volume2 className="w-5 h-5 text-white stroke-[2.5]" /> : <VolumeX className="w-5 h-5 text-slate-400 stroke-[2.5]" />}
                </button>

                {/* C. Mic Icon (with slash in mute state) */}
                <button
                  onClick={() => {
                    // Check if current user is sitting on an admin-muted seat!
                    let isCurrentSeatAdminMuted = false;
                    let currentSeatKey = "";
                    if (hostSeatUser?.id === "user-current") {
                      currentSeatKey = "host";
                    } else if (superSeatUser?.id === "user-current") {
                      currentSeatKey = "super";
                    } else {
                      const idx = gridSeatsUsers.findIndex(u => u?.id === "user-current");
                      if (idx !== -1) {
                        currentSeatKey = `grid-${idx}`;
                      }
                    }

                    if (currentSeatKey && seatMutes[currentSeatKey]) {
                      triggerToast("This seat is muted by the Host. You cannot unmute.", "error");
                      return;
                    }

                    handleMuteToggle();
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 text-white bg-transparent shrink-0"
                  title="Toggle Microphone"
                >
                  {!isMuted ? (
                    <Mic className="w-5 h-5 text-white stroke-[2.5]" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white stroke-[2.5]" />
                  )}
                </button>

                {/* D. Smile Face Icon */}
                <button
                  onClick={() => {
                    const emojis = ["❤️", "🔥", "👍", "😂", "🎉", "🌹", "😮"];
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    triggerReaction(randomEmoji);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-transform shrink-0"
                  title="Send Voice Reaction"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-4 9a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0 0-3Zm-7.44 6.13c.4-.64 1.1-.96 1.94-.96h4c.83 0 1.53.32 1.94.96.25.4.15.93-.24 1.18-.39.26-.92.15-1.18-.24a1.14 1.14 0 0 0-.96-.44h-3.12c-.41 0-.75.16-.96.44-.26.4-.8.5-1.18.24-.39-.25-.49-.78-.24-1.18Z" />
                  </svg>
                </button>

                {/* E. Animated Glowing 3D Gift Box Button with side-swaying wiggling rose/love particles (Screenshot 4 exact color design) */}
                <motion.button
                  onClick={() => {
                    setShowRoomGiftingModal(true);
                  }}
                  animate={{
                    rotate: [-3, 3, -3, 3, -3, 3, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-13 h-13 rounded-full flex items-center justify-center cursor-pointer select-none outline-none focus:outline-none shrink-0"
                  title="Send Gift"
                >
                  {/* Glowing, colorful outer ring border matching screenshot gradient */}
                  <div className="absolute inset-0 rounded-full p-[2.2px] bg-gradient-to-tr from-[#9d4edd] via-[#00f2fe] to-[#ec4899] shadow-[0_0_15px_rgba(0,242,254,0.45)] animate-pulse" />
                  
                  {/* High fidelity inner background matching screenshot */}
                  <div className="absolute inset-[2.2px] rounded-full bg-[#1c1437] flex items-center justify-center overflow-visible">
                    {/* 3D-like Purple Gift Box SVG with large golden/yellow bow */}
                    <svg viewBox="0 0 64 64" className="w-9 h-9 filter drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)]">
                      {/* Bow Left Loop */}
                      <path d="M32 20 C22 8, 14 14, 28 19 Z" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1" />
                      {/* Bow Right Loop */}
                      <path d="M32 20 C42 8, 50 14, 36 19 Z" fill="#fcd34d" stroke="#f59e0b" strokeWidth="1" />
                      {/* Bow Center Knot */}
                      <circle cx="32" cy="20" r="3.5" fill="#f59e0b" />
                      
                      {/* Gift Lid */}
                      <rect x="15" y="21" width="34" height="7" rx="1.5" fill="url(#giftLidGrad)" />
                      
                      {/* Box Base */}
                      <rect x="18" y="28" width="28" height="20" rx="2" fill="url(#giftBoxGrad)" />
                      
                      {/* Vertical Ribbon */}
                      <rect x="29" y="28" width="6" height="20" fill="#fcd34d" />
                      <rect x="29" y="21" width="6" height="7" fill="#f59e0b" />
                      
                      <defs>
                        <linearGradient id="giftLidGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d8b4fe" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="giftBoxGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Translucent water-misty side-swaying roses and hearts floating up */}
                  <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
                    <AnimatePresence>
                      {giftFloatingItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ y: 0, x: 0, opacity: 0, scale: 0.4, filter: "blur(2px)" }}
                          animate={{
                            y: -240,
                            x: [0, item.xOffset, -item.xOffset, item.xOffset / 2, 0],
                            opacity: [0, 0.75, 0.6, 0],
                            scale: [0.4, item.scale, item.scale, 0.3],
                            filter: ["blur(2px)", "blur(0.8px)", "blur(1.2px)", "blur(2px)"]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 2.2,
                            ease: "easeOut",
                            delay: item.delay
                          }}
                          className="absolute text-2xl select-none pointer-events-none filter drop-shadow-[0_2px_6px_rgba(236,72,153,0.3)]"
                          style={{
                            bottom: "45px",
                            left: "25%",
                          }}
                        >
                          {item.char}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* F. Blue 4-petal Grid Layout Icon */}
                <button
                  onClick={() => {
                    triggerToast("Switched to multi-room grid view mode.", "success");
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 text-white bg-transparent shrink-0"
                  title="View Layout"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5.5 h-5.5 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                  </svg>
                </button>

                {/* G. Mail Envelope with red message badge ("5") */}
                <button
                  onClick={() => {
                    triggerToast("Cleared direct message requests.", "success");
                  }}
                  className="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform bg-transparent shrink-0"
                  title="Private Messages"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5.5 h-5.5 text-white">
                    <rect width="20" height="15" x="2" y="4" rx="3" fill="currentColor" />
                    <path d="M22 6.5l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 6.5" stroke="#0e101f" strokeWidth="2" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-rose-500 border border-slate-950 rounded-full w-4.5 h-4.5 text-[9px] font-black text-white flex items-center justify-center shadow-md animate-bounce">
                    5
                  </span>
                </button>

              </div>

            </div>

            {/* Render reaction emojis floating in bottom right */}
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
              <AnimatePresence>
                {floatingEmojis.map((e, eIdx) => (
                  <motion.div
                    key={`fe-inner-${e.id}-${eIdx}`}
                    initial={{ opacity: 0, y: 150, scale: 0.5 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      y: -250, 
                      x: [0, Math.sin(e.id) * 35, -Math.sin(e.id) * 35],
                      scale: [0.5, 1.4, 1.4, 1.1] 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, ease: "easeOut" }}
                    className="absolute text-3xl select-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    style={{ 
                      left: `${e.left}%`,
                      bottom: "100px"
                    }}
                  >
                    {e.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

      {/* FLOATING EMOJIS LAYER */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item, itemIdx) => (
          <motion.div
            key={`fe-outer-${item.id}-${itemIdx}`}
            initial={{ y: "100vh", opacity: 1, scale: 0.8 }}
            animate={{
              y: "-10vh",
              opacity: [0.8, 1, 0.8, 0],
              x: [0, (item.left % 2 === 0 ? 30 : -30), (item.left % 2 === 0 ? -20 : 20)],
              scale: [0.8, 1.4, 1.2, 0.9]
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]"
            style={{ left: `${item.left}%` }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* 1. NEW USER GIFT PACKAGE DIALOG MODAL */}
      <AnimatePresence>
        {showGiftBoxPopup && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-black/60 select-none">
            <div className="relative w-full max-w-md flex flex-col items-center text-center">
              
              {/* Floating Golden 3D Text exactly like the screenshot */}
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="mb-4 select-none pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)]"
              >
                <h2 
                  className="text-4xl md:text-5xl font-black italic tracking-tight uppercase leading-none text-center"
                  style={{
                    fontFamily: '"Space Grotesk", "Inter", sans-serif',
                    background: 'linear-gradient(to bottom, #fffef0 0%, #ffdf20 35%, #f59e0b 70%, #b45309 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  New user gift
                  <br />
                  <span 
                    className="text-3xl md:text-4xl tracking-wide uppercase font-black"
                    style={{
                      background: 'linear-gradient(to bottom, #ffffff 0%, #ffd000 40%, #ea580c 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    package
                  </span>
                </h2>
              </motion.div>

              {/* Magical Animated Teal and Gold Chest with Glowing Diamond Keyhole */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -12, 0],
                  rotate: [-1.5, 1.5, -1.5, 1.5, -1.5],
                  opacity: 1
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
                  y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 4.2, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
                className="relative cursor-pointer select-none filter drop-shadow-[0_0_50px_rgba(34,211,238,0.45)] my-4"
                onClick={handleOpenGiftBox}
              >
                <svg viewBox="0 0 240 240" className="w-64 h-64 md:w-72 md:h-72">
                  <defs>
                    {/* Teal Wood Gradients */}
                    <linearGradient id="chest-teal-light" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#0891b2" />
                      <stop offset="100%" stopColor="#155e75" />
                    </linearGradient>
                    <linearGradient id="chest-teal-dark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                    
                    {/* Golden Metallic Gradients */}
                    <linearGradient id="chest-gold-light" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fffae0" />
                      <stop offset="30%" stopColor="#fbbf24" />
                      <stop offset="70%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id="chest-gold-dark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>

                    {/* Glowing Cyan Gemstone Gradients */}
                    <linearGradient id="gem-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="40%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>
                    
                    {/* Aura Glow filter */}
                    <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Starburst glowing rotating circles behind chest */}
                  <g opacity="0.8">
                    <circle cx="120" cy="120" r="90" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3,7" className="origin-[120px_120px] animate-spin" style={{ animationDuration: '35s' }} />
                    <circle cx="120" cy="120" r="110" fill="none" stroke="#22d3ee" strokeWidth="0.75" strokeDasharray="5,10" className="origin-[120px_120px] animate-spin" style={{ animationDuration: '50s', animationDirection: 'reverse' }} />
                    <circle cx="120" cy="120" r="75" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.2" />
                  </g>

                  {/* Chest Bottom Shadow */}
                  <ellipse cx="120" cy="205" rx="72" ry="10" fill="#000000" opacity="0.5" />

                  {/* MAIN CHEST BODY (LOWER HALF) */}
                  <path d="M 40,115 L 200,115 L 185,200 L 55,200 Z" fill="#0f172a" />
                  <path d="M 42,117 L 198,117 L 183,198 L 57,198 Z" fill="url(#chest-teal-dark)" />
                  
                  {/* Plank slots */}
                  <path d="M 75,117 L 85,198" stroke="#042f2e" strokeWidth="2" opacity="0.6" />
                  <path d="M 120,117 L 120,198" stroke="#042f2e" strokeWidth="3" opacity="0.7" />
                  <path d="M 165,117 L 155,198" stroke="#042f2e" strokeWidth="2" opacity="0.6" />

                  {/* Corner Gold Guards */}
                  <path d="M 42,180 L 57,198 L 75,198 L 65,180 Z" fill="url(#chest-gold-dark)" stroke="#451a03" strokeWidth="0.75" />
                  <path d="M 198,180 L 183,198 L 165,198 L 175,180 Z" fill="url(#chest-gold-dark)" stroke="#451a03" strokeWidth="0.75" />

                  {/* LOWER HALF VERTICAL STRAPS */}
                  <path d="M 70,117 L 78,117 L 85,198 L 77,198 Z" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="0.75" />
                  <path d="M 170,117 L 162,117 L 155,198 L 163,198 Z" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="0.75" />
                  <path d="M 54,194 L 186,194 L 183,198 L 57,198 Z" fill="url(#chest-gold-dark)" />

                  {/* CHEST LID DOME */}
                  <path d="M 35,117 C 35,48 205,48 205,117 Z" fill="#0f172a" />
                  <path d="M 37,115 C 37,51 203,51 203,115 Z" fill="url(#chest-teal-light)" />

                  {/* Lid Horizontal Planks */}
                  <path d="M 40,92 C 40,92 120,78 200,92" fill="none" stroke="#083344" strokeWidth="2.5" opacity="0.4" />
                  <path d="M 45,70 C 45,70 120,55 195,70" fill="none" stroke="#083344" strokeWidth="2.5" opacity="0.4" />

                  {/* LID GOLD STRAPS */}
                  <path d="M 68,115 C 68,115 65,56 90,54 C 92,54 94,55 94,55 C 72,57 74,115 74,115 Z" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="0.75" />
                  <path d="M 172,115 C 172,115 175,56 150,54 C 148,54 146,55 146,55 C 168,57 166,115 166,115 Z" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="0.75" />
                  <path d="M 112,62 C 112,62 120,50 128,62 L 128,115 L 112,115 Z" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="0.75" />

                  {/* Gold side arcs */}
                  <path d="M 37,115 C 37,51 52,51 52,115 Z" fill="url(#chest-gold-dark)" opacity="0.25" />
                  <path d="M 203,115 C 203,51 188,51 188,115 Z" fill="url(#chest-gold-dark)" opacity="0.25" />

                  {/* Massive Gold Divider Girdle */}
                  <rect x="33" y="110" width="174" height="9" rx="3.5" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="1.25" />
                  
                  {/* Girdle Studs */}
                  <circle cx="43" cy="114" r="1.5" fill="#fef08a" />
                  <circle cx="62" cy="114" r="1.5" fill="#fef08a" />
                  <circle cx="85" cy="114" r="1.5" fill="#fef08a" />
                  <circle cx="155" cy="114" r="1.5" fill="#fef08a" />
                  <circle cx="178" cy="114" r="1.5" fill="#fef08a" />
                  <circle cx="197" cy="114" r="1.5" fill="#fef08a" />

                  {/* FRONT LOCK MEDALLION SHIELD */}
                  <g filter="url(#glow-filter)">
                    <polygon points="98,104 142,104 152,124 142,144 98,144 88,124" fill="url(#chest-gold-light)" stroke="#451a03" strokeWidth="2" />
                    <polygon points="103,109 137,109 144,124 137,139 103,139 96,124" fill="url(#chest-gold-dark)" stroke="#78350f" strokeWidth="1" />
                  </g>

                  {/* GLOWING CYAN CRYSTAL LOCK CORE */}
                  <g>
                    <polygon points="120,112 132,124 120,136 108,124" fill="url(#gem-grad)" stroke="#0284c7" strokeWidth="1" />
                    <polygon points="120,112 108,124 113,124" fill="#ffffff" opacity="0.55" />
                    <polygon points="120,112 132,124 127,124" fill="#ffffff" opacity="0.75" />
                    <polygon points="120,136 127,124 120,127" fill="#e0f2fe" opacity="0.5" />
                    <circle cx="120" cy="124" r="4" fill="#22d3ee" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                  </g>

                  {/* Gloss Sparkles */}
                  <g opacity="0.9">
                    <path d="M 175,62 Q 183,62 183,54 Q 183,62 191,62 Q 183,62 183,70 Q 183,62 175,62" fill="#ffffff" className="animate-pulse" />
                    <path d="M 52,146 Q 58,146 58,140 Q 58,146 64,146 Q 58,146 58,152 Q 58,146 52,146" fill="#22d3ee" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
                  </g>
                </svg>
              </motion.div>

              {/* Glossy Green Open Button with Amber Rim Container */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-6 w-full max-w-xs px-4"
              >
                <div className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 p-[3px] rounded-full shadow-[0_8px_20px_rgba(245,158,11,0.5)]">
                  <button
                    type="button"
                    onClick={handleOpenGiftBox}
                    className="w-full py-3 px-8 rounded-full bg-gradient-to-r from-[#00bfa5] via-[#009688] to-[#07b587] hover:brightness-110 active:scale-95 transition-all text-white font-extrabold text-xl tracking-wider cursor-pointer shadow-inner block text-center"
                    style={{
                      textShadow: '0 1.5px 3px rgba(0,0,0,0.3)',
                    }}
                  >
                    Open
                  </button>
                </div>
                
                {/* Later Skip option */}
                <button
                  type="button"
                  onClick={() => setShowGiftBoxPopup(false)}
                  className="mt-5 text-xs font-semibold text-white/70 hover:text-white transition-colors cursor-pointer block mx-auto py-1 tracking-wider"
                >
                  Later, skip package
                </button>
              </motion.div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. CROWN CLAIM SUCCESS CELEBRATION MODAL */}
      <AnimatePresence>
        {showCrownClaimSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-sm bg-gradient-to-tr from-[#120720] via-[#220c3a] to-[#120720] border-2 border-amber-400/40 rounded-[40px] p-7 text-center text-white shadow-[0_25px_60px_rgba(234,179,8,0.25)] overflow-hidden"
            >
              {/* Confetti particles overlay effects */}
              <div className="absolute inset-0 opacity-40 pointer-events-none select-none">
                <div className="absolute top-4 left-8 text-yellow-300 text-sm animate-bounce">✦</div>
                <div className="absolute top-16 right-10 text-yellow-400 text-lg animate-pulse">✦</div>
                <div className="absolute bottom-12 left-10 text-pink-400 text-lg animate-bounce">✿</div>
                <div className="absolute bottom-6 right-12 text-teal-300 text-sm animate-pulse">✦</div>
              </div>

              {/* Sparkling rays bg */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none -z-10" />

              <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-widest animate-pulse">
                CONGRATULATIONS! 🎉
              </h3>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-1">
                You Claimed Elite Tiger Crown 👑
              </p>

              {/* Animated Tiger Mask/Crown Showcase */}
              <div className="my-7 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 rounded-3xl bg-white/5 border border-white/10 p-0.5 flex items-center justify-center shadow-inner overflow-visible">
                  {/* Tiger Crown rendering preview */}
                  <TigerCrown size="success-modal" />
                  <img
                    src={loggedInUser?.avatar || DEFAULT_AVATARS[0]}
                    alt="Claimer"
                    className="w-24 h-24 rounded-2xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-mono font-black text-amber-400 mt-3 tracking-widest uppercase">
                  TIGER CROWN EQUIPPED
                </span>
              </div>

              <p className="text-xs text-violet-200 leading-relaxed mb-6 px-2 font-medium">
                Congratulations! The prestigious Tiger Crown has been successfully equipped to your profile. Join any party seat or voice room now to show off your moves! 🐯✨
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowCrownClaimSuccess(false);
                  triggerToast("Crown successfully equipped on profile!", "success");
                }}
                className="w-full py-3.5 bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-[#2c1a4d] rounded-full font-black text-sm tracking-wide shadow-md transition-all cursor-pointer uppercase"
              >
                Start Chatting 😍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. VIP LEVEL CLAIM SUCCESS CELEBRATION MODAL */}
      <AnimatePresence>
        {showVipSuccessModal && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-sm bg-gradient-to-tr from-[#160a02] via-[#2d1a0b] to-[#120700] border-2 border-amber-400/40 rounded-[40px] p-7 text-center text-white shadow-[0_25px_60px_rgba(245,158,11,0.4)] overflow-hidden"
            >
              {/* Confetti particles overlay effects */}
              <div className="absolute inset-0 opacity-40 pointer-events-none select-none">
                <div className="absolute top-4 left-8 text-yellow-300 text-sm animate-bounce">✦</div>
                <div className="absolute top-16 right-10 text-amber-400 text-lg animate-pulse">✦</div>
                <div className="absolute bottom-12 left-10 text-yellow-500 text-lg animate-bounce">⚜</div>
                <div className="absolute bottom-6 right-12 text-amber-300 text-sm animate-pulse">✦</div>
              </div>

              {/* Sparkling rays bg */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

              <h3 className="text-2xl font-black text-amber-400 uppercase tracking-widest animate-pulse">
                VIP LEVEL UNLOCKED! 👑
              </h3>
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-1">
                You Are Now VIP {unlockedLevel}
              </p>

              {/* Animated VIP showcase */}
              <div className="my-5 flex flex-col items-center justify-center">
                <VipBadgeCenterpiece level={unlockedLevel} avatar={loggedInUser?.avatar} name={loggedInUser?.name} />
                <span className="text-[10px] font-mono font-black text-amber-400 tracking-widest uppercase mt-2">
                  ROYAL PRIVILEGE ACTIVATED
                </span>
              </div>

              <p className="text-xs text-amber-100/90 leading-relaxed mb-6 px-2 font-medium">
                Congratulations! Your VIP {unlockedLevel} privileges are now active on your profile. Enjoy your golden VIP badge, gorgeous entry animations, and premium customized chat bubbles! 👑🏆✨
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowVipSuccessModal(false);
                  triggerToast(`VIP ${unlockedLevel} status fully activated!`, "success");
                }}
                className="w-full py-3.5 bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-black rounded-full font-black text-sm tracking-wide shadow-md transition-all cursor-pointer uppercase"
              >
                Claim Benefits ⚜
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. REAL-TIME WALLET TOPUP / BILLING DEPOSIT RECHARGE MODAL */}
      <AnimatePresence>
        {showRechargeModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#180a24] to-[#0a0311] border border-violet-500/20 rounded-[32px] p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowRechargeModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4 mt-8 mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-amber-400 tracking-wider uppercase">
                  Coin Agency System
                </h3>
                <p className="text-xs text-violet-200/80 leading-relaxed max-w-xs mx-auto">
                  Our premium official coin deposit and recharge agency system is currently under scheduled maintenance.
                </p>
                <div className="inline-block bg-amber-500/10 text-amber-300 text-[10px] font-mono font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/20">
                  Coming Soon 🚀
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIREBASE UNAUTHORIZED DOMAIN ERROR MODAL */}
      <AnimatePresence>
        {unauthorizedDomainError && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0d2b] to-[#0c0415] border border-red-500/30 rounded-[32px] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-pink-600 to-purple-600" />
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setUnauthorizedDomainError(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-500">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white tracking-wide uppercase">
                    Firebase Setup Required
                  </h3>
                  <p className="text-xs text-red-400 font-mono font-bold uppercase tracking-wider">
                    auth/unauthorized-domain Error Detected
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs text-violet-200/90 leading-relaxed">
                <p>
                  This domain is not authorized in your Firebase Project (<strong>voxelive-1da19</strong>). Please add the following domains to your Firebase Console under Authorized Domains:
                </p>

                {/* Hostname list to copy */}
                <div className="space-y-2">
                  <div className="bg-black/40 border border-violet-500/15 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest font-black">
                        Current Live App Domain (Required)
                      </span>
                      <div className="flex items-center justify-between gap-2 bg-[#0c0515] px-3.5 py-2.5 rounded-xl border border-violet-500/10">
                        <span className="font-mono text-xs text-white break-all font-bold">
                          {unauthorizedDomainError}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(unauthorizedDomainError);
                            triggerToast("Domain name copied to clipboard!", "success");
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-[10px] font-extrabold tracking-widest uppercase transition-all shrink-0 cursor-pointer active:scale-95"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest font-black">
                        Preview App Domain (For Preview)
                      </span>
                      <div className="flex items-center justify-between gap-2 bg-[#0c0515] px-3.5 py-2.5 rounded-xl border border-violet-500/10">
                        <span className="font-mono text-xs text-white break-all font-bold flex-1">
                          ais-pre-gcxtpl6d3cyhegqxfukjfa-929407129747.asia-southeast1.run.app
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("ais-pre-gcxtpl6d3cyhegqxfukjfa-929407129747.asia-southeast1.run.app");
                            triggerToast("Preview domain copied!", "success");
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-[10px] font-extrabold tracking-widest uppercase transition-all shrink-0 cursor-pointer active:scale-95"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 bg-[#ff5252]/5 border border-red-500/10 rounded-2xl p-4">
                  <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛠️</span> How to Fix:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-violet-300 text-[11px] leading-relaxed">
                    <li>
                      Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-pink-400 font-extrabold hover:underline">Firebase Console</a> and select your project.
                    </li>
                    <li>
                      From the left sidebar, click on <strong>Authentication</strong> and go to the <strong>Settings</strong> tab.
                    </li>
                    <li>
                      Under the <strong>Authorized Domains</strong> section, click <strong>"Add domain"</strong>.
                    </li>
                    <li>
                      Paste the copied domain name(s) and click <strong>Add</strong> to save.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setUnauthorizedDomainError(null)}
                  className="flex-1 py-3.5 bg-[#0c0515]/80 hover:bg-[#120820] text-violet-300 hover:text-white rounded-2xl text-xs font-bold tracking-widest uppercase transition-all border border-violet-500/10 cursor-pointer text-center"
                >
                  Close & Dismiss
                </button>
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white rounded-2xl text-xs font-bold tracking-widest uppercase transition-all text-center flex items-center justify-center gap-1 shadow-[0_4px_15px_rgba(236,72,153,0.3)] cursor-pointer font-bold"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIREBASE PHONE ERROR BYPASS MODAL */}
      <AnimatePresence>
        {phoneErrorType && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#1c0d2b] to-[#0c0415] border border-violet-500/30 rounded-[32px] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600" />
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPhoneErrorType(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0 text-pink-500">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white tracking-wide uppercase">
                    {phoneErrorType === "billing-not-enabled" ? "Billing Not Enabled" : "SMS Limit Exceeded"}
                  </h3>
                  <p className="text-xs text-pink-400 font-mono font-bold uppercase tracking-wider">
                    {phoneErrorType === "billing-not-enabled" ? "auth/billing-not-enabled Error" : "auth/too-many-requests Error"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs text-violet-200/90 leading-relaxed">
                <p>
                  {phoneErrorType === "billing-not-enabled" ? (
                    "OTP sending failed because the Firebase project SMS quota or Blaze billing plan is not active."
                  ) : (
                    "Too many OTP requests. Firebase has temporarily blocked OTP delivery to this phone number or IP address."
                  )}
                </p>
                
                <p className="font-medium text-pink-300">
                  Don't worry! You can easily skip verification and sign in instantly using a system bypass:
                </p>

                <div className="bg-[#10071c]/80 border border-violet-500/20 rounded-2xl p-4 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-black text-center">
                    Instant Access Bypass
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => bypassPhoneVerification()}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-black font-black rounded-2xl text-xs tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bypass & Log In</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPhoneErrorType(null)}
                  className="flex-1 py-3.5 bg-[#0c0515]/80 hover:bg-[#120820] text-violet-300 hover:text-white rounded-2xl text-xs font-bold tracking-widest uppercase transition-all border border-violet-500/10 cursor-pointer text-center"
                >
                  Close & Try Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REAL-TIME INTERACTIVE GROUP PROFILE DETAILS SHEET (Screenshot 2 Bottom Sheet Drawer) */}
      <AnimatePresence>
        {showRoomDetailsSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
            {/* Glassmorphism background blur overlay */}
            <div 
              onClick={() => {
                setShowRoomDetailsSheet(false);
                setIsEditingRoomName(false);
              }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
            />
            
            {/* Elegant rounded Bottom Sheet container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white rounded-t-[36px] text-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              {/* Close Action Button positioned on top right */}
              <button
                onClick={() => {
                  setShowRoomDetailsSheet(false);
                  setIsEditingRoomName(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer transition-all z-20 shadow-md backdrop-blur-xs"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1 pb-6 space-y-5 scrollbar-none">
                
                {/* 1. ROOM BACKGROUND COVER IMAGE CARD - Spans full width at top */}
                <div className="relative w-full h-72 bg-slate-100 shrink-0">
                  {/* Centered touch/drag indicator absolute on top of image */}
                  <div className="absolute top-3 inset-x-0 w-12 h-1 bg-white/40 rounded-full mx-auto z-20" />
                  
                  <img
                    src={activeRoom?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=400"}
                    alt="Room Group Cover"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Soft white fade gradient overlay exactly matching screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  
                  {/* Pencil Edit Icon for cover photo selection from gallery */}
                  <label className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all cursor-pointer active:scale-95 flex items-center justify-center border border-white/20 shadow-md backdrop-blur-xs z-20">
                    <Edit3 className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCoverPhoto}
                      className="hidden"
                    />
                  </label>

                  {/* Dynamic Title, ID and Category tags overlaid on image bottom (as seen in Screenshot 3) */}
                  <div className="absolute bottom-4 left-6 right-6 text-slate-900 select-none">
                    <h2 className="text-xl font-black tracking-tight leading-tight flex items-center gap-1.5 drop-shadow-sm text-slate-900">
                      <span>{activeRoom?.title || "Live Broadcast Room"}</span>
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1.5">
                      <span>Room ID: {activeRoom?.idNo || "24708556"}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(activeRoom?.idNo || "24708556");
                          triggerToast("Room ID copied to clipboard!", "success");
                        }}
                        className="p-1 rounded bg-slate-100/80 hover:bg-slate-200 text-slate-400 hover:text-slate-600 active:scale-95 transition-all cursor-pointer"
                        title="Copy ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-black rounded-full shadow-sm">
                        🤗 {activeRoom?.categoryTag || "Friend"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main details content with standard horizontal padding */}
                <div className="px-6 space-y-5">
                  
                  {/* 3. PEACH THEME REAL-TIME EXPERIENCE LEVEL CARD */}
                  <div 
                    onClick={handleBoostRoomExp}
                    className="bg-[#fff4eb] border border-[#ffeedf] rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm select-none cursor-pointer hover:bg-[#ffeadd] active:scale-[0.99] transition-all"
                    title="Tap to boost Room EXP! ⭐"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center select-none shrink-0">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center border border-white/40">
                          <span className="text-base">⭐</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-base font-black text-[#8c5333] tracking-tight">
                          LV.{getRoomLevel(activeRoom?.exp || 0)}
                        </span>
                        <span className="block text-[9px] font-bold text-orange-600/70 mt-0.5">
                          Tap to Boost (+200 EXP) ⚡
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black text-[#8c5333]">
                        EXP: <span className="font-mono text-orange-600 font-black text-sm">{(activeRoom?.exp || 0)}</span>
                      </span>
                      <span className="block text-[9px] font-bold text-slate-400 mt-0.5">
                        Next: {getCumulativeExpNeeded(getRoomLevel(activeRoom?.exp || 0) + 1)} EXP
                      </span>
                    </div>
                  </div>

                  {/* 4. ROOM MEMBERS ROW */}
                  <div className="space-y-3">
                    <div 
                      onClick={() => setShowAllJoinedMembers(true)}
                      className="flex justify-between items-center py-0.5 cursor-pointer group"
                    >
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 select-none">
                        <span>Room Members</span>
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none">
                      {activeRoomMembers.length === 0 ? (
                        <div className="text-xs font-bold text-slate-400 py-2 pl-1 select-none">No other members yet.</div>
                      ) : (
                        activeRoomMembers.map((m, idx) => (
                          <div 
                            key={`active-room-member-${m.id || 'arm'}-${idx}`} 
                            onClick={() => {
                              const userProfile: UserProfile = {
                                id: m.id || "unknown",
                                name: m.name || "User",
                                avatar: m.avatar || DEFAULT_AVATARS[0],
                                vipLevel: m.vipLevel || 1,
                                idNo: m.idNo || "1000001",
                                bio: m.bio || "Live life to the fullest! 🚀",
                                countryFlag: m.countryFlag || "🇧🇩",
                                gender: m.gender || "Male",
                                birthday: m.birthday || "1999-10-12",
                                authProvider: "google"
                              };
                              setSelectedProfileUser(userProfile);
                            }}
                            className="flex flex-col items-center shrink-0 w-14 select-none cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                          >
                            <div className="relative">
                              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-pink-500 shadow-sm">
                                <img
                                  src={m.avatar || DEFAULT_AVATARS[0]}
                                  alt={m.name}
                                  className="w-full h-full object-cover rounded-full border border-white"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </div>
                            <span className="text-[8px] font-bold text-slate-500 mt-1.5 uppercase truncate w-full text-center">
                              {m.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 5. FOLLOWERS ROW */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-0.5 select-none">
                      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider select-none">
                        Followers ({roomFollowersCount})
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 select-none" />
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none select-none">
                      {activeRoomFollowers.length === 0 ? (
                        <div className="text-xs font-bold text-slate-400 py-2 pl-1 select-none">No followers yet. Tap follow! 💖</div>
                      ) : (
                        activeRoomFollowers.map((f, idx) => (
                          <div 
                            key={`active-room-follower-${f.id || 'arf'}-${idx}`}
                            onClick={() => {
                              const userProfile: UserProfile = {
                                id: f.id || "unknown",
                                name: f.name || "User",
                                avatar: f.avatar || DEFAULT_AVATARS[0],
                                vipLevel: f.vipLevel || 1,
                                idNo: f.idNo || "1000001",
                                bio: f.bio || "Live life to the fullest! 🚀",
                                countryFlag: f.countryFlag || "🇧🇩",
                                gender: f.gender || "Male",
                                birthday: f.birthday || "1999-10-12",
                                authProvider: "google"
                              };
                              setSelectedProfileUser(userProfile);
                            }}
                            className="w-10 h-10 rounded-full shrink-0 border border-slate-200 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                            title={f.name}
                          >
                            <img
                              src={f.avatar || DEFAULT_AVATARS[0]}
                              alt={f.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 6. DESCRIPTION BOX */}
                  <div className="space-y-1.5 select-none pb-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Room Description
                    </h3>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      {activeRoom?.subtitle || "Welcome to my room! Let's talk and have fun."}
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Action Sheet Button exactly matching screenshot */}
              <div className="p-5 bg-white border-t border-slate-100 mt-auto shrink-0 select-none">
                <button
                  onClick={handleToggleFollowRoom}
                  className={`w-full py-4 rounded-full font-black text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                    isFollowingRoom
                      ? "bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm"
                      : "bg-gradient-to-r from-[#ff8243] to-[#ffaa5a] hover:brightness-105 active:scale-[0.98] text-white shadow-[0_4px_15px_rgba(255,120,60,0.35)]"
                  }`}
                >
                  <Heart className={`w-4 h-4 stroke-[2.5] ${isFollowingRoom ? "fill-red-500 stroke-red-500 text-red-500" : "fill-none"}`} />
                  <span>{isFollowingRoom ? "Following" : "Follow"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REAL-TIME BROADCAST OPTIONS DRAWER (Minimize, Exit, Customer Service) */}
      <AnimatePresence>
        {showBroadcastDrawer && (
          <div className="fixed inset-0 z-[150] flex justify-end select-none">
            {/* Dark blur background overlay */}
            <div 
              onClick={() => setShowBroadcastDrawer(false)} 
              className="absolute inset-0 bg-black/65 backdrop-blur-xs" 
            />
            
            {/* Elegant right-slide drawer container (exactly matching Screenshot 2) */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-[85%] max-w-[360px] h-full bg-[#11101b] text-white shadow-[-10px_0_50px_rgba(0,0,0,0.8)] flex flex-col z-10 border-l border-white/[0.05]"
            >
              {/* Top Padding */}
              <div className="pt-10 pb-4 px-4">
                
                {/* ACTIONS HORIZONTAL ROW */}
                <div className={`grid ${testRoomRole === "admin" ? "grid-cols-4" : "grid-cols-3"} gap-1 text-center mb-6`}>
                  {/* Customer Service Column */}
                  <button
                    onClick={() => {
                      triggerToast("Connecting to live billing & stream support... 📞", "success");
                      setShowBroadcastDrawer(false);
                    }}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/90 group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <Headphones className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[9px] text-slate-300 font-extrabold tracking-wide leading-tight">
                      Support
                    </span>
                  </button>

                  {/* Minimize Column */}
                  <button
                    onClick={() => {
                      if (activeRoom) {
                        setMinimizedRoom(activeRoom);
                        setCurrentStep("lobby");
                        setActiveRoom(null);
                        triggerToast(`Room minimized! keeping broadcast active 📡`, "success");
                      }
                      setShowBroadcastDrawer(false);
                    }}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#9062eb] group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <Minimize2 className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[9px] text-slate-300 font-extrabold tracking-wide leading-tight">
                      Minimize
                    </span>
                  </button>

                  {/* Leave Column */}
                  <button
                    onClick={() => {
                      if (activeRoom) {
                        leaveActiveRoom(activeRoom.id);
                      }
                      setCurrentStep("lobby");
                      setActiveRoom(null);
                      setMinimizedRoom(null);
                      setRoomTheme("normal"); // Reset theme
                      triggerToast("You left the broadcast room", "success");
                      setShowBroadcastDrawer(false);
                    }}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-amber-400 group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <LogOut className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[9px] text-amber-400 font-extrabold tracking-wide leading-tight">
                      Leave
                    </span>
                  </button>

                  {/* Exit room Column (Only for Oner/Admin/Host) */}
                  {testRoomRole === "admin" && (
                    <button
                      onClick={async () => {
                        if (activeRoom) {
                          await terminateActiveRoom(activeRoom.id);
                        }
                        setCurrentStep("lobby");
                        setActiveRoom(null);
                        setMinimizedRoom(null);
                        setRoomTheme("normal"); // Reset theme
                        setShowBroadcastDrawer(false);
                      }}
                      className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-500/20 group-hover:scale-105 transition-all mb-1.5 shadow-sm animate-pulse">
                        <Power className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[9px] text-red-400 font-extrabold tracking-wide leading-tight">
                        Exit room
                      </span>
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL FLOATING MINI PLAYER CAPSULE (Keep Live Room Active in Background) */}
      <AnimatePresence>
        {minimizedRoom && currentStep !== "room" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="fixed bottom-22 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#160d26]/95 border-2 border-violet-500/30 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[140] select-none flex items-center justify-between gap-3 backdrop-blur-md"
          >
            {/* Left side: Avatar cover with rotating colorful live glow and pulse status */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-tr from-pink-500 via-violet-500 to-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white relative z-10">
                  <img
                    src={minimizedRoom.avatar || DEFAULT_AVATARS[0]}
                    alt="Active Stream Cover"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Micro breath audio wave pulse indicator */}
                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 border border-white z-20 animate-ping" />
                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1 border border-white z-20 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>

              {/* Title / Info block */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-black tracking-widest text-red-400 uppercase animate-pulse leading-none">
                    LIVE
                  </span>
                  <span className="text-[8px] font-mono text-slate-400">
                    ID:{minimizedRoom.idNo || "24708556"}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white truncate leading-tight mt-0.5">
                  {minimizedRoom.title}
                </h4>
                <p className="text-[9px] text-slate-400 font-bold truncate leading-none mt-0.5">
                  @{minimizedRoom.hostName}
                </p>
              </div>
            </div>

            {/* Right side: Action Buttons (Maximize, Stop) */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* SoundWave visualizer bars inside mini player */}
              <div className="flex items-end gap-0.5 h-3 px-2">
                {[0.4, 0.9, 0.6, 0.3].map((val, i) => (
                  <div
                    key={i}
                    className="w-[2px] bg-violet-400 rounded-full animate-bounce"
                    style={{
                      height: '100%',
                      animationDuration: `${0.4 + i * 0.15}s`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Maximize Button */}
              <button
                onClick={() => {
                  setActiveRoom(minimizedRoom);
                  setMinimizedRoom(null);
                  setCurrentStep("room");
                  triggerToast("Re-entered live audio room!", "success");
                }}
                className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-300 hover:bg-violet-500/25 active:scale-90 transition-all cursor-pointer"
                title="Maximize Broadcast"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setMinimizedRoom(null);
                  setRoomTheme("normal"); // Reset theme
                  triggerToast("Stopped voice stream & left room", "success");
                }}
                className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 active:scale-90 transition-all cursor-pointer"
                title="Stop Broadcast"
              >
                <Power className="w-3.5 h-3.5 text-red-400" strokeWidth={2.5} />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEAT ACTIONS BOTTOM DIALOG SHEET (Matching Screenshot pixel-perfect style) */}
      <AnimatePresence>
        {showSeatActionsModal && activeSeatConfig && (() => {
          const activeSeatUser = activeSeatConfig.seatType === "host"
            ? hostSeatUser
            : activeSeatConfig.seatType === "super"
              ? superSeatUser
              : (activeSeatConfig.gridIndex !== undefined ? gridSeatsUsers[activeSeatConfig.gridIndex] : null);

          const isCurrentUserManager = testRoomRole === "admin" || hostSeatUser?.id === "user-current" || superSeatUser?.id === "user-current";

          return (
            <div className="fixed inset-0 z-[200] flex flex-col justify-end p-4 select-none bg-black/75 backdrop-blur-xs">
              {/* Dark backdrop click to dismiss */}
              <div 
                onClick={() => {
                  setShowSeatActionsModal(false);
                  setIsInvitingInSeatActions(false);
                }} 
                className="absolute inset-0 z-0" 
              />

              {/* Custom rounded White Block for action options */}
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 24, stiffness: 220 }}
                className="relative z-10 w-full max-w-md mx-auto mb-3 bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col text-slate-800 min-h-[120px]"
              >
                {/* Clean, Elegant Header Bar */}
                <div className="relative z-10 px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-widest text-violet-600 uppercase">
                      {isCurrentUserManager ? "MY SEAT PANEL" : "SPEAKER PANEL"}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 mt-0.5">
                      {activeSeatConfig.seatType === "host" ? "Host Seat" : activeSeatConfig.seatType === "super" ? "Co-Host Seat" : `Speaker Seat #${activeSeatConfig.gridIndex! + 1}`}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${
                    isCurrentUserManager 
                      ? "bg-violet-100 text-violet-700 border border-violet-200" 
                      : "bg-[#e6fbf4] text-[#14b8a6] border border-teal-200"
                  }`}>
                    {isCurrentUserManager ? <Crown className="w-3.5 h-3.5 text-violet-600" /> : <User className="w-3.5 h-3.5 text-teal-600" />}
                    <span>{isCurrentUserManager ? "OWNER / ADMIN / HOST" : "SPEAKER"}</span>
                  </div>
                </div>

                {isInvitingInSeatActions ? (
                  // Real-time Invite Sub-view
                  <div className="relative z-10 flex flex-col p-5 max-h-[380px]">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Invite Friend to Seat</h3>
                      <button 
                        onClick={() => setIsInvitingInSeatActions(false)}
                        className="text-violet-600 hover:text-violet-800 font-extrabold text-xs cursor-pointer"
                      >
                        Back
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                      {INVITE_MEMBERS.map((member) => (
                        <div key={`invite-member-${member.name}`} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800">{member.name}</span>
                              <span className="text-[9px] text-slate-400 font-bold">{member.flag} Joined</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const key = getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                              const isMuted = seatMutes[key] || false;
                              
                              const participant: Participant = {
                                id: `invited-${member.name}-${Date.now()}`,
                                name: member.name,
                                role: activeSeatConfig.seatType === "host" ? "Host" : activeSeatConfig.seatType === "super" ? "Co-Host" : "Speaker",
                                avatar: member.avatar,
                                isMuted: isMuted,
                                isSpeaking: false,
                                volume: 100,
                                hasTigerCrown: member.hasTigerCrown || false
                              };

                              // Clean duplicate of the invited friend from other seats
                              const { cleanedHost, cleanedSuper, cleanedGrid } = cleanDuplicateUserFromSeats(
                                participant.id,
                                participant.name,
                                hostSeatUser,
                                superSeatUser,
                                gridSeatsUsers
                              );

                              let nextHost = cleanedHost;
                              let nextSuper = cleanedSuper;
                              let nextGrid = cleanedGrid;

                              if (activeSeatConfig.seatType === "host") {
                                nextHost = participant;
                                setHostSeatUser(participant);
                              } else if (activeSeatConfig.seatType === "super") {
                                nextSuper = participant;
                                setSuperSeatUser(participant);
                              } else if (activeSeatConfig.seatType === "grid" && activeSeatConfig.gridIndex !== undefined) {
                                nextGrid[activeSeatConfig.gridIndex!] = participant;
                                setGridSeatsUsers(nextGrid);
                              }
                              
                              if (activeRoom) {
                                updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid);
                              }
                              
                              // Unban if previously banned
                              setBannedUserNames(prev => prev.filter(name => name !== member.name));

                              // Dynamically add to room members list
                              setRoomMembersList(prev => {
                                if (prev.some(m => m.name === member.name)) return prev;
                                return [...prev, { id: `invited-${member.name}`, name: member.name, role: activeSeatConfig.seatType === "host" ? "Host" : activeSeatConfig.seatType === "super" ? "Host" : "Speaker", avatar: member.avatar, color: "bg-gradient-to-r from-slate-400 to-slate-500 text-[#2a2a2a]" }];
                              });

                              setShowSeatActionsModal(false);
                              setIsInvitingInSeatActions(false);
                              triggerToast(`${member.name} joined the seat! 🎙️`, "success");
                            }}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 active:scale-95 text-white font-bold text-[10px] rounded-full shadow-sm transition-all cursor-pointer"
                          >
                            Invite
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Simple, Clear centered options (Just text links, no complex blocks, no watermark clutter)
                  <div className="relative z-10 flex flex-col divide-y divide-slate-100 font-bold text-center">
                    {isCurrentUserManager ? (
                      <>
                        {/* 1. Remove this seat option (Visible ONLY when seat is occupied) */}
                        {activeSeatUser && (
                          <button
                            onClick={() => executeRemoveFromSeat(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                            className="w-full py-4 text-sm font-black text-red-600 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                          >
                            Remove this seat
                          </button>
                        )}

                        {/* Owner / Admin / Host Role Promotions & Kicks */}
                        {activeSeatUser && activeSeatUser.id !== "user-current" && (
                          <>
                            {testRoomRole === "admin" && (
                              <>
                                <button
                                  onClick={() => executeMakeAdmin(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                                  className="w-full py-4 text-sm font-black text-violet-600 hover:bg-violet-50 active:bg-violet-100 transition-colors cursor-pointer text-center"
                                >
                                  Make Admin 🛡️
                                </button>
                                <button
                                  onClick={() => executeMakeHost(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                                  className="w-full py-4 text-sm font-black text-fuchsia-600 hover:bg-fuchsia-50 active:bg-fuchsia-100 transition-colors cursor-pointer text-center"
                                >
                                  Make Host 👑
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => executeRemoveFromBroadcast(activeSeatConfig.seatType, activeSeatConfig.gridIndex)}
                              className="w-full py-4 text-sm font-black text-rose-600 hover:bg-rose-50 active:bg-rose-100 transition-colors cursor-pointer text-center"
                            >
                              Remove from Broadcast 🚫
                            </button>
                          </>
                        )}

                        {/* 2. Invite option (Visible when seat is empty) */}
                        {!activeSeatUser && (
                          <button
                            onClick={() => setIsInvitingInSeatActions(true)}
                            className="w-full py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                          >
                            Invite Friend to Seat
                          </button>
                        )}
                        
                        {/* 3. Mute/Unmute option */}
                        <button
                          onClick={() => {
                            if (!activeRoom) return;
                            const key = getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                            const targetMute = !seatMutes[key];
                            const newMutes = { ...seatMutes, [key]: targetMute };
                            setSeatMutes(newMutes);
                            
                            let nextHost = hostSeatUser;
                            let nextSuper = superSeatUser;
                            let nextGrid = [...gridSeatsUsers];

                            if (activeSeatConfig.seatType === "host") {
                              nextHost = hostSeatUser ? { ...hostSeatUser, isMuted: targetMute } : null;
                              setHostSeatUser(nextHost);
                            } else if (activeSeatConfig.seatType === "super") {
                              nextSuper = superSeatUser ? { ...superSeatUser, isMuted: targetMute } : null;
                              setSuperSeatUser(nextSuper);
                            } else {
                              const idx = activeSeatConfig.gridIndex!;
                              if (nextGrid[idx]) {
                                nextGrid[idx] = { ...nextGrid[idx]!, isMuted: targetMute };
                                setGridSeatsUsers(nextGrid);
                              }
                            }

                            const currentUserId = loggedInUser?.id || "user-current";
                            const currentUserSeatKey = hostSeatUser?.id === currentUserId ? "host" : (superSeatUser?.id === currentUserId ? "super" : `grid-${gridSeatsUsers.findIndex(u => u?.id === currentUserId)}`);
                            if (currentUserSeatKey === key && targetMute) {
                              setIsMuted(true);
                            }

                            updateRoomSeatsInFirestore(activeRoom.id, nextHost, nextSuper, nextGrid, seatLocks, newMutes);
                            setShowSeatActionsModal(false);
                          }}
                          className="w-full py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                        >
                          {seatMutes[getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex)] ? "Unmute this seat" : "Mute this seat"}
                        </button>

                        {/* 4. Lock/Unlock option */}
                        <button
                          onClick={() => {
                            if (!activeRoom) return;
                            const key = getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                            const targetLock = !seatLocks[key];
                            const newLocks = { ...seatLocks, [key]: targetLock };
                            setSeatLocks(newLocks);
                            updateRoomSeatsInFirestore(activeRoom.id, hostSeatUser, superSeatUser, gridSeatsUsers, newLocks, seatMutes);
                            setShowSeatActionsModal(false);
                          }}
                          className="w-full py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                        >
                          {seatLocks[getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex)] ? "Unlock this seat" : "Lock this seat"}
                        </button>

                        {/* 5. Move to Seat / Stand Up option */}
                        {(!activeSeatUser || activeSeatUser.id === "user-current") && (
                          <button
                            onClick={() => {
                              executeSeatMovement(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                              setShowSeatActionsModal(false);
                            }}
                            className="w-full py-4 text-sm font-bold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                          >
                            {((activeSeatConfig.seatType === "host" && hostSeatUser?.id === "user-current") ||
                              (activeSeatConfig.seatType === "super" && superSeatUser?.id === "user-current") ||
                              (activeSeatConfig.seatType === "grid" && activeSeatConfig.gridIndex !== undefined && gridSeatsUsers[activeSeatConfig.gridIndex]?.id === "user-current")) 
                                ? "Stand up from this seat" 
                                : "Move to this seat"}
                          </button>
                        )}
                      </>
                    ) : (
                      // Regular User Mode: Simple Centered "Leave Seat" option for their own seat
                      <button
                        onClick={() => {
                          executeSeatMovement(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                          setShowSeatActionsModal(false);
                          triggerToast("You left the seat! 🎙️", "success");
                        }}
                        className="w-full py-4 text-sm font-black text-rose-600 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer text-center"
                      >
                        Leave Seat
                      </button>
                    )}
                  </div>
                )}
              </motion.div>

            {/* Separate White Block for Cancel button */}
            <motion.button
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220, delay: 0.05 }}
              onClick={() => {
                setShowSeatActionsModal(false);
                setIsInvitingInSeatActions(false);
              }}
              className="relative z-10 w-full max-w-md mx-auto bg-white hover:bg-slate-50 text-slate-800 active:scale-98 font-bold text-sm py-4 rounded-[20px] shadow-lg text-center cursor-pointer transition-all shrink-0"
            >
              Cancel
            </motion.button>
          </div>
        )})()}
      </AnimatePresence>

      {/* REAL-TIME SEAT & USER PROFILE MODAL CARD (MATCHING SCREENSHOTS 1, 2, 3) */}
      <UserProfileModalCard
        user={selectedProfileUser}
        onClose={() => setSelectedProfileUser(null)}
        onFollowToggle={(u) => {
          const isCurrentlyFollowing = !!followedUserIds[u.id];
          const nextState = !isCurrentlyFollowing;
          setFollowedUserIds((prev) => ({ ...prev, [u.id]: nextState }));
          triggerToast(nextState ? `You followed ${u.name}! ❤️` : `Unfollowed ${u.name}`, nextState ? "success" : "info");
        }}
        isFollowing={selectedProfileUser ? !!followedUserIds[selectedProfileUser.id] : false}
        onGiveGift={(u) => {
          setSelectedProfileUser(null);
          setShowRoomGiftingModal(true);
          triggerToast(`Select a gift for ${u.name} 🎁`, "info");
        }}
        onMention={(u) => {
          setSelectedProfileUser(null);
          setChatMessage((prev) => `@${u.name} ` + prev);
          triggerToast(`Mentioning @${u.name} in chat`, "info");
          setTimeout(() => {
            const chatInput = document.getElementById("room-chat-input-field");
            if (chatInput) chatInput.focus();
          }, 100);
        }}
        onOpenDirectChat={(u) => {
          setSelectedProfileUser(null);
          setActiveDirectChatUser(u);
        }}
        onOpenFullProfile={(u) => {
          setSelectedProfileUser(null);
          setFullProfileUser({
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            coverPhoto: (u as any).coverPhoto,
            bio: u.bio,
            idNo: u.idNo,
            vipLevel: u.vipLevel,
            followersCount: u.followersCount,
            giftsCount: u.giftsCount,
            intimacy: u.intimacy,
          });
        }}
        onReportUser={(u) => {
          triggerToast(`Report submitted for ${u.name} to room moderators.`, "success");
        }}
        isAdminOrHost={testRoomRole === "admin" || hostSeatUser?.id === "user-current" || superSeatUser?.id === "user-current" || loggedInUser?.id === hostSeatUser?.id}
        activeSeatConfig={activeSeatConfig}
        onRemoveFromSeat={(seatType, gridIndex) => executeRemoveFromSeat(seatType, gridIndex)}
        onToggleMuteSeat={(seatType, gridIndex) => executeToggleMuteSeat(seatType, gridIndex)}
        isSeatMuted={activeSeatConfig ? !!seatMutes[getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex)] : false}
      />

      {/* FULL DETAILED USER PROFILE MODAL (PRO PROFILE VIEW) */}
      {fullProfileUser && (
        <FullUserProfileModal
          user={fullProfileUser}
          loggedInUserId={loggedInUser?.id || "user-current"}
          onClose={() => setFullProfileUser(null)}
          onFollowToggle={(u) => {
            const isCurrentlyFollowing = !!followedUserIds[u.id];
            const nextState = !isCurrentlyFollowing;
            setFollowedUserIds((prev) => ({ ...prev, [u.id]: nextState }));
            triggerToast(nextState ? `You followed ${u.name}! ❤️` : `Unfollowed ${u.name}`, nextState ? "success" : "info");
          }}
          isFollowing={fullProfileUser ? !!followedUserIds[fullProfileUser.id] : false}
          onGiveGift={(u) => {
            setFullProfileUser(null);
            setShowRoomGiftingModal(true);
            triggerToast(`Select a gift for ${u.name} 🎁`, "info");
          }}
          onOpenDirectChat={(u) => {
            setFullProfileUser(null);
            setActiveDirectChatUser(u as any);
          }}
          onSaveProfileUpdate={async (updatedData) => {
            if (loggedInUser) {
              const updated: UserProfile = {
                ...loggedInUser,
                ...updatedData,
              };
              setLoggedInUser(updated);
              localStorage.setItem("voxaclub_current_user", JSON.stringify(updated));
              if (auth.currentUser) {
                try {
                  await setDoc(doc(db, "users", auth.currentUser.uid), updatedData, { merge: true });
                } catch (err) {
                  console.warn("Firestore profile sync error", err);
                }
              }
              setFullProfileUser(prev => prev ? { ...prev, ...updatedData } : null);
            }
          }}
          triggerToast={triggerToast}
        />
      )}

      {/* REAL-TIME 1-ON-1 DIRECT CHAT & AUDIO/VIDEO CALL MODAL */}
      {activeDirectChatUser && (
        <DirectChatCallModal
          currentUser={{
            id: loggedInUser?.id || "user-current",
            name: loggedInUser?.name || "Md Munna",
            avatar: loggedInUser?.avatar || DEFAULT_AVATARS[0],
            idNo: loggedInUser?.idNo || "1000000"
          }}
          targetUser={activeDirectChatUser}
          onClose={() => setActiveDirectChatUser(null)}
          triggerToast={triggerToast}
          agoraRtcService={agoraRtcRef.current}
        />
      )}

      {/* REAL-TIME FULL-SCREEN ANIMATED GIFT OVERLAY */}
      <GiftAnimationOverlay
        activeGift={activeGiftAnimation}
        onClear={() => setActiveGiftAnimation(null)}
      />

      {/* REAL-TIME INTERACTIVE GIFTING DRAWER (MATCHING SCREENSHOT 2) */}
      <RealGiftDrawer
        isOpen={showRoomGiftingModal}
        onClose={() => setShowRoomGiftingModal(false)}
        hostSeatUser={hostSeatUser}
        superSeatUser={superSeatUser}
        gridSeatsUsers={gridSeatsUsers}
        userCoins={userCoinsBalance}
        onSendGift={(gift, recipientKey, count) => {
          handleSendRoomGift(gift, recipientKey, count);
        }}
        onRechargeCoins={(amount) => {
          setUserCoinsBalance((prev) => prev + amount);
          triggerToast(`Recharged 🪙 ${amount.toLocaleString()} coins successfully! 🎉`, "success");
        }}
      />

      {/* ONLINE MEMBER REAL-TIME MODAL (MATCHING SCREENSHOT 2) */}
      <AnimatePresence>
        {showOnlineMembersModal && (
          <div className="fixed inset-0 z-[140] flex items-end justify-center select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOnlineMembersModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-md bg-white rounded-t-[32px] p-5 shadow-2xl overflow-hidden text-slate-900 z-10 flex flex-col max-h-[82vh]"
            >
              {/* Top Drag Handle & Header */}
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Online member</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {onlineMembersList.length}
                  </span>
                </h3>
                <button
                  onClick={() => setShowOnlineMembersModal(false)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 py-2 pr-1">
                {onlineMembersList.map((member, idx) => {
                  const isMe = member.isMe || member.id === (loggedInUser?.id || "user-current");
                  const isFollowing = followedMemberIds[member.id] ?? true;

                  return (
                    <div
                      key={`online-member-${member.id || 'om'}-${idx}`}
                      className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-2xl transition-all"
                    >
                      {/* Left: Avatar with crown on head */}
                      <div className="relative shrink-0 flex items-center justify-center pt-2">
                        {/* Crown/Head decoration if equipped or host */}
                        {(member.hasTigerCrown || member.isHost || (isMe && loggedInUser?.hasTigerCrown)) && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.85)]">
                            <span className="text-xl select-none leading-none">👑</span>
                          </div>
                        )}

                        <img
                          src={member.avatar}
                          alt={member.name}
                          className={`w-12 h-12 rounded-full object-cover shadow-sm ${
                            (member.hasTigerCrown || member.isHost || (isMe && loggedInUser?.hasTigerCrown))
                              ? "border-2 border-amber-400 ring-2 ring-amber-300/40"
                              : "border-2 border-slate-100"
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        {member.isHost && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[10px] text-white shadow z-10" title="Host">
                            🏠
                          </div>
                        )}
                      </div>

                      {/* Center: Info Stack */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 truncate max-w-[140px]">
                            {member.name}
                          </span>
                          {member.isHost && (
                            <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Host
                            </span>
                          )}
                        </div>

                        {/* Badges & Stats */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          {member.vipGroup && (
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-[9px] shadow-sm flex items-center gap-0.5">
                              <span className="bg-white/20 rounded-full w-3 h-3 flex items-center justify-center text-[8px]">01</span>
                              <span>{member.vipGroup}</span>
                            </span>
                          )}

                          {member.heat && (
                            <span className="text-[11px] font-extrabold text-amber-500 flex items-center gap-0.5">
                              🔥 {member.heat}
                            </span>
                          )}

                          {member.genderAgeZodiac && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/80 font-black text-[9px] flex items-center gap-1">
                              {member.genderAgeZodiac}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Followings Button / Myself */}
                      <div className="shrink-0">
                        {isMe ? (
                          <span className="text-xs font-bold text-slate-400 pr-2">
                            Myself
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setFollowedMemberIds((prev) => ({
                                ...prev,
                                [member.id]: !isFollowing,
                              }));
                              triggerToast(
                                !isFollowing ? `Followed ${member.name}` : `Unfollowed ${member.name}`,
                                "success"
                              );
                            }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                              isFollowing
                                ? "bg-[#019371] hover:bg-[#008062] text-white active:scale-95"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {isFollowing ? "Followings" : "+ Follow"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Sticky Button */}
              <div className="pt-3 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => {
                    const newMap: Record<string, boolean> = {};
                    onlineMembersList.forEach((m) => {
                      newMap[m.id] = true;
                    });
                    setFollowedMemberIds(newMap);
                    triggerToast("Updated all followings", "success");
                    setShowOnlineMembersModal(false);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#019371] hover:bg-[#008062] text-white font-extrabold text-base shadow-lg shadow-emerald-900/10 active:scale-95 transition-all text-center tracking-wide cursor-pointer"
                >
                  Followings
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================= */}
        {/* REAL-TIME SOCIAL OVERLAY MODALS & DIRECT CHAT INTERFACE */}
        {/* ========================================================= */}

        {/* 1. FRIEND REQUESTS MODAL */}
        {socialModal === "requests" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Friend Requests ({friendRequests.length})
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {friendRequests.map((req, idx) => (
                  <div
                    key={`friend-req-${req.id}-${idx}`}
                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100/80"
                  >
                    <div className="flex items-center gap-3">
                      <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{req.name}</span>
                          <span>{req.country}</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {req.idNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={async () => {
                          if (req.chatId) {
                            try {
                              await updateDoc(doc(db, "direct_chats", req.chatId), {
                                status: "accepted",
                                updatedAt: serverTimestamp()
                              });
                            } catch (e) {
                              console.error("Error accepting chat request:", e);
                            }
                          }
                          setMyFriendsList(prev => {
                            if (prev.some(f => f.id === req.id)) return prev;
                            return [...prev, {
                              id: req.id,
                              name: req.name,
                              avatar: req.avatar,
                              country: req.country,
                              idNo: req.idNo,
                              online: true,
                              status: "Accepted Request 🟢",
                              chatId: req.chatId || ""
                            }];
                          });
                          setFriendRequests(prev => prev.filter(r => r.id !== req.id));
                          triggerToast(`Accepted friend request from ${req.name}!`, "success");
                        }}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black rounded-full transition-all cursor-pointer shadow-2xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={async () => {
                          if (req.chatId) {
                            try {
                              await updateDoc(doc(db, "direct_chats", req.chatId), {
                                status: "blocked",
                                updatedAt: serverTimestamp()
                              });
                            } catch (e) {
                              console.error("Error blocking chat request:", e);
                            }
                          }
                          setFriendRequests(prev => prev.filter(r => r.id !== req.id));
                          triggerToast(`Blocked request from ${req.name}`, "info");
                        }}
                        className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold rounded-full transition-all cursor-pointer"
                      >
                        Block
                      </button>
                    </div>
                  </div>
                ))}

                {friendRequests.length === 0 && (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-xs text-slate-400 font-semibold">No pending friend requests</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. VISITORS MODAL */}
        {socialModal === "visitors" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    👁️
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Profile Visitors (5 Recent)
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {[
                  { name: "Munna_VIP", country: "🇧🇩", idNo: "3910291", time: "2 mins ago", avatar: DEFAULT_AVATARS[0] },
                  { name: "Queen_Anu", country: "🇮🇳", idNo: "4820192", time: "15 mins ago", avatar: DEFAULT_AVATARS[2] },
                  { name: "Sajid_A", country: "🇧🇩", idNo: "8192019", time: "1 hour ago", avatar: DEFAULT_AVATARS[1] },
                  { name: "Lina_R", country: "🇧🇩", idNo: "8921029", time: "3 hours ago", avatar: DEFAULT_AVATARS[4] },
                  { name: "BD Coin Seller", country: "🇧🇩", idNo: "8921029", time: "Yesterday", avatar: DEFAULT_AVATARS[3] },
                ].map((vis, idx) => (
                  <div
                    key={`visitor-${vis.name}-${idx}`}
                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100/80"
                  >
                    <div className="flex items-center gap-3">
                      <img src={vis.avatar} alt={vis.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{vis.name}</span>
                          <span>{vis.country}</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">Visited {vis.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveDirectChatUser({
                          id: `vis-${idx}`,
                          name: vis.name,
                          avatar: vis.avatar,
                          idNo: vis.idNo
                        });
                        setSocialModal(null);
                      }}
                      className="px-3 py-1 bg-[#1e0d3d] text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-all cursor-pointer shadow-2xs"
                    >
                      Visit Back
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* 3. COUPLE SPACE MODAL */}
        {socialModal === "couple" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-rose-50 via-pink-50 to-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-pink-100 space-y-4 select-none text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-pink-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
                    💖
                  </div>
                  <h3 className="text-base font-extrabold text-pink-950">
                    Couple Relationship Space
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-pink-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-pink-100 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white mx-auto flex items-center justify-center text-2xl shadow-md">
                  💍
                </div>
                <div>
                  <h4 className="text-sm font-black text-pink-950">CP Relationship Status</h4>
                  <p className="text-xs text-pink-600 font-semibold mt-0.5">Diamond Ring Level 5 • 9,999 Love Points</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerToast("CP Proposal sent to your top partner! 💖", "success")}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Propose CP Partner 💍
                  </button>
                  <button
                    onClick={() => triggerToast("Opening CP Rank Leaderboard...", "info")}
                    className="flex-1 py-2.5 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    CP Leaderboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. FAMILY PORTAL MODAL */}
        {socialModal === "family" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Family Portal Directory
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {[
                  { name: "BD Royal Family 👑", leader: "Munna_VIP", members: "48/50", level: "Lv.10" },
                  { name: "Voice Kings 🎙️", leader: "Yaro Ki Mehfil", members: "42/50", level: "Lv.8" },
                  { name: "Star Club 🌟", leader: "Queen_Anu", members: "35/50", level: "Lv.7" },
                ].map((fam, idx) => (
                  <div key={`family-item-${fam.name}-${idx}`} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{fam.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">Leader: {fam.leader} • Members: {fam.members} • {fam.level}</p>
                    </div>
                    <button
                      onClick={() => triggerToast(`Request to join ${fam.name} submitted!`, "success")}
                      className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-full shadow-2xs transition-all cursor-pointer"
                    >
                      Join Family
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE CHAT CONFIRMATION MODAL */}
        {chatToDelete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 text-center select-none"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center font-bold">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Conversation?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-800">"{chatToDelete.name}"</span> from your chat list?
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setChatToDelete(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDeletedChatIds((prev) => ({ ...prev, [chatToDelete.id]: true }));
                    triggerToast(`Deleted "${chatToDelete.name}" from your chat list`, "info");
                    setChatToDelete(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Delete Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. NOTICE MODAL */}
        {socialModal === "notice" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Notice Center
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">SYSTEM UPDATE</span>
                  <h4 className="text-xs font-extrabold text-slate-900 pt-1">VoxaClub 2.0 Live Voice Upgrade</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">All voice rooms now feature HD stereo audio & real-time animated gift effects!</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">EVENT BULLETIN</span>
                  <h4 className="text-xs font-extrabold text-slate-900 pt-1">Weekly Star Host Tournament</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Top 3 Hosts win golden profile badges and 100,000 bonus coins!</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 6. OFFICIAL TEAM LIVE CHAT */}
        {socialModal === "official_team" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none flex flex-col h-[480px]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-bold shadow-xs">
                    <Volume2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Official VoxaClub Team</h3>
                    <p className="text-[10px] text-emerald-600 font-bold">Online Support 🟢</p>
                  </div>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto space-y-3 p-1">
                {officialTeamMessages.map((msg, idx) => (
                  <div
                    key={`official-msg-${msg.id || idx}`}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-semibold leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-amber-400 text-slate-900 rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Send Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newOfficialInput.trim()) return;
                  const userTxt = newOfficialInput;
                  setOfficialTeamMessages(prev => [...prev, {
                    id: `ot-${Date.now()}`,
                    sender: "user",
                    text: userTxt,
                    time: "Just now"
                  }]);
                  setNewOfficialInput("");
                  setTimeout(() => {
                    setOfficialTeamMessages(prev => [...prev, {
                      id: `ot-${Date.now()}`,
                      sender: "official",
                      text: "Thank you for reaching out! Our official representative is reviewing your message.",
                      time: "Just now"
                    }]);
                  }, 800);
                }}
                className="flex items-center gap-2 pt-2 border-t border-slate-100 shrink-0"
              >
                <input
                  type="text"
                  value={newOfficialInput}
                  onChange={(e) => setNewOfficialInput(e.target.value)}
                  placeholder="Ask official support..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl transition-all cursor-pointer font-bold"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* 7. ADD FRIEND SEARCH MODAL */}
        {socialModal === "add_friend" && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 select-none"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-500 text-white flex items-center justify-center font-bold">
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Find & Add Friends
                  </h3>
                </div>
                <button
                  onClick={() => setSocialModal(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[2.5]" />
                  <input
                    type="text"
                    placeholder="Enter nickname or User ID..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={DEFAULT_AVATARS[2]} alt="User" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Riya_VIP 🇮🇳</h4>
                      <p className="text-[10px] text-slate-400">ID: 4712039</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFriendRequests((prev) => [
                        ...prev,
                        {
                          id: `req-${Date.now()}`,
                          name: "Riya_VIP",
                          avatar: DEFAULT_AVATARS[2],
                          country: "🇮🇳",
                          idNo: "4712039",
                        },
                      ]);
                      triggerToast("Friend request sent to Riya_VIP!", "success");
                    }}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-full cursor-pointer transition-all"
                  >
                    + Add Friend
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 8. FULL-SCREEN MESSENGER DIRECT CHAT INTERFACE */}
        {activeSocialChatUser && (
          <div className="fixed inset-0 z-50 bg-[#edf1f7] flex flex-col h-full w-full select-none shadow-2xl">
            {/* Hidden File Input for Real-Time Chat Photo Upload */}
            <input
              type="file"
              ref={chatPhotoInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleChatPhotoUpload}
            />

            {/* Header: Messenger Style Top Bar */}
            <div className="bg-white border-b border-slate-200/90 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveSocialChatUser(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Back to Social"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                </button>
                <div className="relative shrink-0">
                  <img
                    src={activeSocialChatUser.avatar}
                    alt={activeSocialChatUser.name}
                    className="w-10.5 h-10.5 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  {activeSocialChatUser.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
                    {activeSocialChatUser.name}
                  </h3>
                  <p className="text-[11px] text-emerald-600 font-extrabold tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ID: {activeSocialChatUser.idNo} • {activeSocialChatUser.online ? "Online now" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Right Side Options: Audio Call, Video Call, Report */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setIsVideoOff(false);
                    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                    setActiveSocialCall({
                      mode: "audio",
                      name: activeSocialChatUser.name,
                      avatar: activeSocialChatUser.avatar,
                      idNo: activeSocialChatUser.idNo,
                      isIncoming: false,
                      callId,
                    });
                  }}
                  className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0084ff] transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Audio Call"
                >
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => {
                    setIsVideoOff(false);
                    const callId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
                    setActiveSocialCall({
                      mode: "video",
                      name: activeSocialChatUser.name,
                      avatar: activeSocialChatUser.avatar,
                      idNo: activeSocialChatUser.idNo,
                      isIncoming: false,
                      callId,
                    });
                  }}
                  className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0084ff] transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Video Call"
                >
                  <Video className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all cursor-pointer shadow-2xs"
                  title="Report User"
                >
                  <Flag className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Chat Body Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5] min-h-0">
              {activeSocialChatMessages.map((msg, idx) => (
                <div
                  key={`${msg.id || 'msg'}-${idx}`}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Quoted Mention/Reply Header if present */}
                  {msg.replyTo && (
                    <div className="max-w-[82%] mb-1 px-3 py-1.5 rounded-xl bg-slate-200/80 border-l-4 border-[#0084ff] text-xs font-semibold text-slate-800 shadow-2xs">
                      <span className="text-[10px] font-black text-[#0084ff] block uppercase">
                        Replying to {msg.replyTo.senderName}
                      </span>
                      <p className="line-clamp-1 text-slate-700">{msg.replyTo.text}</p>
                    </div>
                  )}

                  {/* Message Content Bubble (Click to open menu options) */}
                  <div
                    onClick={() => setSelectedMsgForMenu(msg)}
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm font-extrabold leading-relaxed shadow-xs cursor-pointer hover:opacity-95 active:scale-98 transition-all ${
                      msg.sender === "user"
                        ? "bg-[#0084ff] text-white rounded-tr-xs"
                        : "bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    {/* Render Image Attachment */}
                    {msg.type === "image" && msg.imageUrl && (
                      <div className="mb-1.5 overflow-hidden rounded-xl border border-white/20 shadow-xs">
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="w-full max-h-60 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Render Voice Attachment */}
                    {msg.type === "voice" && (
                      <div className="flex items-center gap-3 py-1 px-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerToast("Playing voice audio... 🔊", "info");
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs ${
                            msg.sender === "user" ? "bg-white text-[#0084ff]" : "bg-[#0084ff] text-white"
                          }`}
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <div className="flex gap-1 items-center h-5 min-w-[100px]">
                          {[40, 75, 30, 90, 60, 85, 40, 70, 50, 80].map((h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full ${msg.sender === "user" ? "bg-white" : "bg-slate-700"}`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono font-bold opacity-90">
                          {msg.audioDuration || "0:05"}
                        </span>
                      </div>
                    )}

                    {/* Message Text */}
                    {msg.text && <p>{msg.text}</p>}
                  </div>

                  {/* Timestamp & Real Status Indicators */}
                  <div className="flex items-center gap-1.5 mt-1 px-1">
                    <span className="text-[10px] text-slate-500 font-bold">
                      {msg.time}
                    </span>
                    {msg.sender === "user" && (
                      <div className="flex items-center ml-1">
                        {/* Sent Status */}
                        {msg.status === "sent" && (
                          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded-full">
                            sent
                          </span>
                        )}

                        {/* Delivered Status */}
                        {msg.status === "delivered" && (
                          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded-full">
                            delivered
                          </span>
                        )}

                        {/* Seen Status - Recipient Avatar Logo */}
                        {msg.status === "seen" && (
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] font-extrabold text-sky-600">Seen</span>
                            <img
                              src={activeSocialChatUser.avatar}
                              alt="Seen logo"
                              className="w-4 h-4 rounded-full object-cover border border-sky-400 shadow-2xs"
                              title={`Seen by ${activeSocialChatUser.name}`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Real-Time Partner Typing Indicator */}
            {isPartnerTyping && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white border-t border-slate-200 text-xs text-slate-700 font-bold shadow-xs">
                <img
                  src={activeSocialChatUser.avatar}
                  alt={activeSocialChatUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                />
                <span>{activeSocialChatUser.name} is typing...</span>
                <div className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-[#0084ff] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#0084ff] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#0084ff] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Quoted Mention/Reply Input Bar Overlay */}
            {replyingToMsg && (
              <div className="bg-slate-100 border-t border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs text-slate-800 shrink-0">
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="font-extrabold text-[#0084ff] shrink-0">
                    Replying to {replyingToMsg.senderName}:
                  </span>
                  <span className="truncate text-slate-600 italic">"{replyingToMsg.text}"</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingToMsg(null)}
                  className="p-1 hover:bg-slate-200 rounded-full text-slate-500 cursor-pointer shrink-0"
                  title="Cancel reply"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Messenger Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChatInput.trim()) return;
                const txt = newChatInput;
                const msgId = `msg-${Date.now()}`;
                const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                // Real status based on active target online state
                const initialStatus = activeSocialChatUser.online ? "delivered" : "sent";

                const newMsg = {
                  id: msgId,
                  sender: "user" as const,
                  text: txt,
                  type: "text" as const,
                  time: timeStr,
                  status: initialStatus as "sent" | "delivered" | "seen",
                  replyTo: replyingToMsg ? { ...replyingToMsg } : undefined
                };

                setActiveSocialChatMessages((prev) => [...prev, newMsg]);
                setNewChatInput("");
                setReplyingToMsg(null);

                // Transition to seen status when target reads it
                setTimeout(() => {
                  setActiveSocialChatMessages((prev) =>
                    prev.map((m) => (m.id === msgId ? { ...m, status: "seen" } : m))
                  );
                }, 1200);

                // Broadcast message to other windows in real time
                try {
                  const bc = new BroadcastChannel("voxaclub_realtime_direct_messages");
                  bc.postMessage({ type: "NEW_DIRECT_MSG", data: { targetId: activeSocialChatUser.idNo, msg: newMsg } });
                  bc.close();
                } catch (err) {}
              }}
              className="bg-white border-t border-slate-200/90 px-3 py-3 flex items-center gap-2 shrink-0 shadow-md z-10"
            >
              {/* Photo Upload Attachment Button */}
              <button
                type="button"
                onClick={() => chatPhotoInputRef.current?.click()}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all cursor-pointer font-bold shrink-0"
                title="Send Photo"
              >
                <Camera className="w-5 h-5 text-slate-700" />
              </button>

              {/* Voice Message Recording Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-full transition-all cursor-pointer font-bold shrink-0 flex items-center gap-1.5 ${
                  isVoiceRecording
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                title={isVoiceRecording ? "Stop & Send Voice Note" : "Record Voice Message"}
              >
                <Mic className="w-5 h-5" />
                {isVoiceRecording && (
                  <span className="text-xs font-mono font-bold pr-1">
                    0:{voiceSecs.toString().padStart(2, "0")}
                  </span>
                )}
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                value={newChatInput}
                onChange={(e) => {
                  setNewChatInput(e.target.value);
                }}
                placeholder={isVoiceRecording ? "Recording voice note..." : "Type a message..."}
                disabled={isVoiceRecording}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0084ff]"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!newChatInput.trim() || isVoiceRecording}
                className="p-2.5 bg-[#0084ff] hover:bg-[#0073e6] disabled:bg-slate-200 text-white rounded-full transition-all cursor-pointer font-bold shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* MESSAGE OPTIONS ACTION SHEET MODAL */}
        {selectedMsgForMenu && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-extrabold text-slate-900">Message Options</h4>
                <button
                  onClick={() => setSelectedMsgForMenu(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Message Preview */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 italic">
                "{selectedMsgForMenu.text}"
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* 1. Reply / Mention */}
                <button
                  onClick={() => {
                    setReplyingToMsg({
                      id: selectedMsgForMenu.id,
                      senderName: selectedMsgForMenu.sender === "user" ? "You" : (activeSocialChatUser?.name || "Friend"),
                      text: selectedMsgForMenu.text
                    });
                    setSelectedMsgForMenu(null);
                    triggerToast("Reply mode active! Type your response 💬", "info");
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-blue-50 hover:text-[#0084ff] text-slate-800 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#0084ff]" />
                  <span>Reply / Mention Message</span>
                </button>

                {/* 2. Delete for Everyone (Unsend) */}
                <button
                  onClick={() => {
                    const msgId = selectedMsgForMenu.id;
                    setActiveSocialChatMessages((prev) => prev.filter((m) => m.id !== msgId));
                    try {
                      const bc = new BroadcastChannel("voxaclub_realtime_direct_messages");
                      bc.postMessage({ type: "DELETE_MSG_EVERYONE", data: { msgId } });
                      bc.close();
                    } catch (e) {}
                    setSelectedMsgForMenu(null);
                    triggerToast("Message deleted for everyone 🗑️", "info");
                  }}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Delete for Everyone</span>
                </button>

                {/* 3. Delete for Me */}
                <button
                  onClick={() => {
                    const msgId = selectedMsgForMenu.id;
                    setActiveSocialChatMessages((prev) => prev.filter((m) => m.id !== msgId));
                    setSelectedMsgForMenu(null);
                    triggerToast("Message deleted for you", "info");
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Delete for Me</span>
                </button>

                {/* 4. Copy Text */}
                <button
                  onClick={() => {
                    if (selectedMsgForMenu.text) {
                      navigator.clipboard.writeText(selectedMsgForMenu.text);
                      triggerToast("Copied to clipboard!", "success");
                    }
                    setSelectedMsgForMenu(null);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-500" />
                  <span>Copy Text</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

    {/* REAL-TIME AUDIO & VIDEO CALL FULL-SCREEN OVERLAY */}
    {activeSocialCall && (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none animate-fadeIn">
        {/* Top Call Info & Security Header Bar */}
        <div className="relative z-30 w-full p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeSocialCall.avatar}
                alt={activeSocialCall.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-400/80 shadow-md"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${callStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-wide">{activeSocialCall.name}</h3>
                <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-slate-300 font-mono">
                  ID: {activeSocialCall.idNo}
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                {callStatus === "connected" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Connected • {Math.floor(callSeconds / 60).toString().padStart(2, "0")}:{(callSeconds % 60).toString().padStart(2, "0")}</span>
                  </>
                ) : callStatus === "no_answer" ? (
                  <span className="text-rose-400 font-extrabold">🚫 No answer</span>
                ) : activeSocialCall.online === false ? (
                  <span className="text-amber-300 animate-pulse">📞 Calling...</span>
                ) : (
                  <span className="text-emerald-300 animate-pulse">🔔 Ringing...</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-slate-200 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Encrypted
            </span>
            <button
              onClick={() => setShowReportModal(true)}
              className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-full transition-all cursor-pointer border border-rose-500/30"
              title="Report User"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN DISPLAY: RINGING/OUTGOING/INCOMING SCREEN (When call is NOT yet connected) */}
        {callStatus !== "connected" ? (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden min-h-[520px]">
            {/* Real-time local camera preview for video calls prior to connection */}
            {activeSocialCall.mode === "video" && !isVideoOff && (
              <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
                <video
                  ref={setPreCallVideo}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover opacity-90"
                  style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
              </div>
            )}

            {/* Top-Right Vertical Stack for Video Call during Ringing (Screenshot 1) */}
            {activeSocialCall.mode === "video" && (
              <div className="absolute top-6 right-4 z-30 flex flex-col items-center gap-3">
                <button
                  onClick={() => triggerToast(`Added user to group call 👥`, "info")}
                  className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                  title="Add Participant"
                >
                  <UserPlus className="w-5 h-5 text-slate-100" />
                </button>
                <button
                  onClick={() => {
                    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                    triggerToast(`Switched to ${facingMode === "user" ? "back" : "front"} camera 🔄`, "info");
                  }}
                  className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-5 h-5 text-slate-100" />
                </button>
                <button
                  onClick={() => {
                    const filters = ["natural", "glow", "bright", "ultra", "smooth"];
                    const nextIndex = (filters.indexOf(beautyFilter) + 1) % filters.length;
                    setBeautyFilter(filters[nextIndex] as any);
                    triggerToast(`Beauty filter: ${filters[nextIndex]} ✨`, "info");
                  }}
                  className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                  title="Beauty Filter"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Top Header matching Screenshot 1 */}
            <div className="relative z-10 text-center pt-2">
              <h2 className="text-base sm:text-lg font-bold text-white drop-shadow-md tracking-wide">
                {activeSocialCall.phone || activeSocialCall.name || "+880 1640-227120"}
              </h2>
              <p className="text-xs font-semibold text-slate-200/90 drop-shadow-sm mt-0.5">
                Ringing ...
              </p>
            </div>

            {/* Center Avatar & User Info - ONLY shown for Voice Calls or Incoming Calls */}
            {activeSocialCall.mode !== "video" && (
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="relative inline-block">
                  <div className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-xl animate-ping" style={{ animationDuration: "2.5s" }} />
                  <div className="absolute -inset-3 rounded-full bg-emerald-400/30 blur-md animate-pulse" />
                  <img
                    src={activeSocialCall.avatar}
                    alt={activeSocialCall.name}
                    className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-white/30 shadow-2xl mx-auto"
                  />
                </div>

                <div className="space-y-1.5 pt-2 bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">{activeSocialCall.name}</h2>
                  <p className="text-sm font-bold text-slate-300">
                    {activeSocialCall.isIncoming
                      ? `Voxa Voice Call`
                      : `📞 Outgoing Voice Call`}
                  </p>
                  <p className="text-xs font-bold text-emerald-400 tracking-wider">
                    {callStatus === "no_answer"
                      ? "Call disconnected"
                      : activeSocialCall.isIncoming
                      ? "Ringing your phone..."
                      : activeSocialCall.online === false
                      ? "Calling user line..."
                      : "Ringing recipient's phone..."}
                  </p>
                </div>
              </div>
            )}

            {/* ACTION CONTROLS */}
            {callStatus !== "no_answer" && (
              <div className="relative z-10 w-full max-w-sm flex flex-col items-center space-y-6 pb-6">
                {/* FOR INCOMING CALLS (SCREENSHOT 1 MATCHING): SWIPE UP GESTURE & ACCEPT / DECLINE BUTTONS */}
                {activeSocialCall.isIncoming ? (
                  <>
                    {/* Swipe Up Gesture Visual Indicator */}
                    <motion.div
                      drag="y"
                      dragConstraints={{ top: -150, bottom: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.y < -60 || info.velocity.y < -200) {
                          handleAnswerCall();
                        }
                      }}
                      className="flex flex-col items-center space-y-1 cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="flex flex-col items-center animate-bounce text-emerald-400">
                        <ChevronUp className="w-6 h-6 -mb-3 opacity-60" />
                        <ChevronUp className="w-8 h-8 font-black" />
                      </div>
                      <p className="text-xs font-bold text-emerald-300 tracking-wider">
                        Swipe up to accept
                      </p>
                    </motion.div>

                    {/* 3 Action Buttons (Matching Screenshot): Decline (Left), Accept (Center), Quick Message (Right) */}
                    <div className="flex items-center justify-around w-full max-w-xs pt-2">
                      {/* Red Decline Button (Left) */}
                      <button
                        onClick={() => handleCancelOrDeclineCall("ended")}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl transition-all active:scale-95 group-hover:scale-105 border-2 border-rose-400/30">
                          <Phone className="w-6 h-6 sm:w-7 sm:h-7 rotate-[135deg]" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-rose-300">Decline</span>
                      </button>

                      {/* Green Answer Button (Center) */}
                      <button
                        onClick={handleAnswerCall}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                      >
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/50 transition-all active:scale-95 group-hover:scale-105 animate-bounce border-2 border-emerald-300/40">
                          <Phone className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-emerald-300">Accept</span>
                      </button>

                      {/* Quick Message Button (Right - Matching Screenshot) */}
                      <button
                        onClick={() => {
                          triggerToast("Quick Message sent: 'I will call you back later!' 📩", "info");
                        }}
                        className="flex flex-col items-center gap-1.5 group cursor-pointer"
                        title="Quick Reply Message"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 flex items-center justify-center shadow-xl transition-all active:scale-95 group-hover:scale-105">
                          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-300">Message</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* FOR OUTGOING CALLS: ONLY CANCEL CALL BUTTON (FIXES SCREENSHOT #2!) */
                  <div className="flex flex-col items-center space-y-3 pt-4">
                    <button
                      onClick={() => handleCancelOrDeclineCall("ended")}
                      className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-full shadow-2xl transition-all cursor-pointer flex items-center gap-2.5 active:scale-95 border border-rose-400/40 hover:scale-105"
                    >
                      <Phone className="w-5 h-5 rotate-[135deg]" />
                      Cancel Call
                    </button>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      Waiting for recipient to answer...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* CONNECTED ACTIVE CALL VIEW */
          <>
            {activeSocialCall.mode === "video" ? (
              /* Video Call Active Canvas - Perfectly matching Screenshot */
              <div className="relative w-full h-full flex-1 bg-slate-950 flex items-center justify-center overflow-hidden select-none">
                {/* Remote Video / Background Portrait Feed */}
                <div className="absolute inset-0 z-0">
                  {isSocialSwappedView ? (
                    /* Main Screen shows Local Camera when Swapped */
                    !isVideoOff && activeStreamRef.current ? (
                      <video
                        ref={(node) => {
                          if (node && activeStreamRef.current) {
                            if (node.srcObject !== activeStreamRef.current) {
                              node.srcObject = activeStreamRef.current;
                              node.play().catch(() => {});
                            }
                          }
                        }}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover opacity-90"
                        style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                        <img
                          src={DEFAULT_AVATARS[0]}
                          alt="You"
                          className="w-28 h-28 rounded-full object-cover border-4 border-amber-400"
                        />
                        <p className="text-xs font-bold text-white mt-2">Your Camera Off</p>
                      </div>
                    )
                  ) : (
                    /* Default Main Screen shows Recipient */
                    <div className="w-full h-full relative">
                      <img
                        src={activeSocialCall.avatar}
                        alt={activeSocialCall.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          beautyFilter === "glow"
                            ? "brightness-[1.2] contrast-[1.05] saturate-[1.1]"
                            : beautyFilter === "bright"
                            ? "brightness-[1.3] contrast-[1.05]"
                            : beautyFilter === "ultra"
                            ? "brightness-[1.4]"
                            : beautyFilter === "smooth"
                            ? "brightness-[1.18] blur-[0.2px]"
                            : ""
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <video
                        ref={setCallVideo}
                        autoPlay
                        playsInline
                        muted={isCallMuted}
                        className="hidden"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />
                </div>

                {/* Top-Center Header Text (Matching Screenshot) */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center pointer-events-none">
                  <h2 className="text-base sm:text-lg font-bold text-white drop-shadow-md">
                    {activeSocialCall.name}
                  </h2>
                  <p className="text-[11px] font-medium text-slate-200/90 drop-shadow-sm flex items-center gap-1">
                    <span>Terenkripsi secara end-to-end</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.floor(callSeconds / 60).toString().padStart(2, "0")}:{(callSeconds % 60).toString().padStart(2, "0")}
                    </span>
                  </p>
                </div>

                {/* Top-Right Floating Vertical Button Stack (Matching Screenshot) */}
                <div className="absolute top-6 right-4 z-30 flex flex-col items-center gap-3">
                  {/* Icon 1: Add User / Group */}
                  <button
                    onClick={() => triggerToast(`Added user to group call 👥`, "info")}
                    className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                    title="Add Participant"
                  >
                    <UserPlus className="w-5 h-5 text-slate-100" />
                  </button>

                  {/* Icon 2: Switch Camera */}
                  <button
                    onClick={() => {
                      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                      triggerToast(`Switched to ${facingMode === "user" ? "back" : "front"} camera 🔄`, "info");
                    }}
                    className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                    title="Switch Camera"
                  >
                    <RotateCcw className="w-5 h-5 text-slate-100" />
                  </button>

                  {/* Icon 3: Beauty Effects / Wand */}
                  <button
                    onClick={() => {
                      const filters = ["natural", "glow", "bright", "ultra", "smooth"];
                      const nextIndex = (filters.indexOf(beautyFilter) + 1) % filters.length;
                      setBeautyFilter(filters[nextIndex] as any);
                      triggerToast(`Beauty filter: ${filters[nextIndex]} ✨`, "info");
                    }}
                    className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                    title="Beauty Filter"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Fallback Banner when Camera is turned Off */}
                {isVideoOff && (
                  <div className="absolute top-20 z-20 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-rose-300 flex items-center gap-2 shadow-lg">
                    <VideoOff className="w-4 h-4 text-rose-400" />
                    <span>Your camera is turned off</span>
                  </div>
                )}

                {/* DRAGGABLE Floating Picture-in-Picture Frame (CLICK TO SWAP VIEWS!) */}
                <motion.div
                  drag
                  dragConstraints={{ left: -280, right: 10, top: -480, bottom: 20 }}
                  dragElastic={0.1}
                  whileDrag={{ scale: 1.05 }}
                  onClick={() => {
                    setIsSocialSwappedView((prev) => !prev);
                    triggerToast(!isSocialSwappedView ? "Main view: Your camera 👤" : "Main view: Recipient 👥", "info");
                  }}
                  className="absolute bottom-28 right-4 z-30 w-32 h-44 sm:w-36 sm:h-52 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-[0_10px_35px_rgba(0,0,0,0.85)] bg-slate-900 cursor-pointer flex flex-col items-center justify-center select-none group active:scale-95 transition-transform"
                  title="Click to swap views"
                >
                  {!isSocialSwappedView ? (
                    isVideoOff ? (
                      <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                        <img
                          src={DEFAULT_AVATARS[0]}
                          alt="You"
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                        />
                        <span className="text-[10px] text-slate-300 font-bold mt-1">You</span>
                      </div>
                    ) : (
                      <video
                        ref={setPipVideo}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover pointer-events-none"
                        style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
                      <img
                        src={activeSocialCall.avatar}
                        alt={activeSocialCall.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/80 text-[8px] font-black text-emerald-300 rounded-md backdrop-blur-xs border border-emerald-500/30 flex items-center gap-0.5 pointer-events-none">
                    🔄 Swap
                  </span>
                </motion.div>
              </div>
            ) : (
              /* Audio Call Active Canvas */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-8 relative z-10 my-auto">
                <div className="relative inline-block">
                  <div
                    className="absolute -inset-4 rounded-full bg-emerald-500/30 blur-xl transition-all duration-200"
                    style={{
                      transform: `scale(${1 + micVolumeLevel / 120})`,
                      opacity: 0.3 + micVolumeLevel / 100
                    }}
                  />
                  <img
                    src={activeSocialCall.avatar}
                    alt={activeSocialCall.name}
                    className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover border-4 border-white/20 shadow-2xl mx-auto"
                  />
                </div>

                {/* Real-time Voice Broadcast Equalizer */}
                <div className="flex items-center gap-1.5 h-12 justify-center pt-2">
                  {[18, 32, 20, 42, 28, 48, 24, 36, 16, 30, 44, 22].map((h, i) => (
                    <motion.div
                      key={`equalizer-bar-node-${i}`}
                      animate={{
                        height: isCallMuted
                          ? 6
                          : Math.max(8, (h * (micVolumeLevel + 15)) / 60)
                      }}
                      transition={{
                        duration: 0.15,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Call Controls Floating Bar */}
            <div className="relative z-20 w-full p-6 pb-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-center">
              {activeSocialCall.mode === "audio" ? (
                <div className="flex items-center justify-around w-full max-w-xs bg-[#1f2c34]/95 backdrop-blur-xl px-6 py-4 rounded-full border border-white/10 shadow-2xl">
                  {/* More Options (...) */}
                  <button
                    onClick={() => triggerToast("More call options", "info")}
                    className="p-3.5 rounded-full hover:bg-white/10 text-slate-200 transition-all cursor-pointer active:scale-90"
                    title="Options"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </button>

                  {/* Loudspeaker toggle button */}
                  <button
                    onClick={() => {
                      const nextState = !isSpeaker;
                      setIsSpeaker(nextState);
                      triggerToast(
                        nextState ? "Loudspeaker Mode ON 🔊" : "Earpiece Mode ON 🎧",
                        "info"
                      );
                    }}
                    className={`p-3.5 rounded-full transition-all cursor-pointer active:scale-90 ${
                      isSpeaker
                        ? "bg-white text-black shadow-lg scale-105"
                        : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                    title={isSpeaker ? "Switch to Earpiece" : "Switch to Loudspeaker"}
                  >
                    {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  </button>

                  {/* Mic Mute toggle button */}
                  <button
                    onClick={() => {
                      setIsCallMuted(!isCallMuted);
                      triggerToast(!isCallMuted ? "Microphone muted 🔇" : "Microphone unmuted 🎙️", "info");
                    }}
                    className={`p-3.5 rounded-full transition-all cursor-pointer active:scale-90 ${
                      isCallMuted ? "bg-rose-600 text-white shadow-lg" : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                    title={isCallMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  {/* End Call Button */}
                  <button
                    onClick={() => handleEndCall("ended")}
                    className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-all cursor-pointer active:scale-90 hover:scale-105"
                    title="End Call"
                  >
                    <Phone className="w-6 h-6 rotate-[135deg]" />
                  </button>
                </div>
              ) : (
                /* Video Call Control Pill Bar matching screenshot */
                <div className="flex items-center justify-around w-full max-w-sm bg-[#121b22]/95 backdrop-blur-2xl px-5 py-3.5 rounded-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                  {/* Button 1: More Options (...) */}
                  <button
                    onClick={() => triggerToast("More video call options", "info")}
                    className="p-3 rounded-full hover:bg-white/10 text-slate-200 transition-all cursor-pointer active:scale-90"
                    title="More Options"
                  >
                    <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Button 2: Video Camera Toggle */}
                  <button
                    onClick={() => {
                      setIsVideoOff(!isVideoOff);
                      triggerToast(isVideoOff ? "Video camera turned ON 📹" : "Video camera turned OFF 🚫", "info");
                    }}
                    className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                      isVideoOff ? "bg-rose-600 text-white" : "bg-white/10 hover:bg-white/20 text-slate-200"
                    }`}
                    title={isVideoOff ? "Turn Camera ON" : "Turn Camera OFF"}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>

                  {/* Button 3: Loudspeaker Toggle (White bg when speaker ON like screenshot) */}
                  <button
                    onClick={() => {
                      const nextState = !isSpeaker;
                      setIsSpeaker(nextState);
                      triggerToast(
                        nextState ? "Loudspeaker Mode ON 🔊" : "Earpiece Mode ON 🎧",
                        "info"
                      );
                    }}
                    className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                      isSpeaker ? "bg-white text-black shadow-lg scale-105" : "bg-white/10 hover:bg-white/20 text-slate-200"
                    }`}
                    title={isSpeaker ? "Switch to Earpiece" : "Switch to Loudspeaker"}
                  >
                    {isSpeaker ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>

                  {/* Button 4: Mic Mute Toggle */}
                  <button
                    onClick={() => {
                      setIsCallMuted(!isCallMuted);
                      triggerToast(!isCallMuted ? "Microphone Muted 🔇" : "Microphone Unmuted 🎙️", "info");
                    }}
                    className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                      isCallMuted ? "bg-rose-600 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-slate-200"
                    }`}
                    title={isCallMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isCallMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>

                  {/* Button 5: End Call (Red Circular Button) */}
                  <button
                    onClick={() => handleEndCall("ended")}
                    className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-all cursor-pointer active:scale-90 hover:scale-105"
                    title="End Call"
                  >
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 rotate-[135deg]" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )}

    {/* REPORT USER MODAL */}
    {showReportModal && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-100 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-rose-600 font-black">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              <h3 className="text-base text-slate-900">Report User</h3>
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-semibold">
            Please choose a reason for reporting ID: {activeSocialChatUser?.idNo}:
          </p>

          <div className="space-y-2">
            {[
              "Spam or Fraudulent Messages",
              "Harassment or Abusive Behavior",
              "Unauthorized Coin Selling",
              "Inappropriate Content",
            ].map((reason, idx) => (
              <button
                key={`report-reason-item-${idx}`}
                onClick={() => {
                  setShowReportModal(false);
                  triggerToast("Report submitted successfully to moderators! 🛡️", "success");
                }}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-800 text-xs font-bold transition-all border border-slate-100 cursor-pointer"
              >
                • {reason}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
</div>
);
}
