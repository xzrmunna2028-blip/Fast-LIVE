/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  ChevronRight,
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
  MinusSquare,
  LogOut,
  Maximize2,
  Minimize2
} from "lucide-react";

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
}

// Live Chat Message interface
interface ChatMessage {
  id: string;
  user: string;
  role: string;
  text: string;
  timestamp: string;
}

export function TigerCrown({ size = "grid-seat" }: { size?: "premium-seat" | "grid-seat" | "profile-banner" | "success-modal" }) {
  // Center frame dynamically with absolute center position based on target container size
  let dims = "w-[133px] h-[133px]";
  if (size === "premium-seat") {
    dims = "w-[144px] h-[144px]";
  } else if (size === "profile-banner") {
    dims = "w-[118px] h-[118px]";
  } else if (size === "success-modal") {
    dims = "w-[177px] h-[177px]";
  }

  return (
    <motion.div
      className={`absolute z-40 pointer-events-none select-none ${dims} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      animate={{
        scale: [1, 1.018, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_16px_rgba(6,182,212,0.5)]">
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

        {/* Embedded CSS style for smooth, rich high-performance "GIF-like" animations */}
        <style>
          {`
            @keyframes wingPulseLeft {
              0%, 100% {
                transform: translate(0px, 0px) scale(1) rotate(0deg);
                filter: drop-shadow(0 0 3px rgba(34,211,238,0.4));
              }
              50% {
                transform: translate(-3px, -1px) scale(1.05) rotate(-2deg);
                filter: drop-shadow(0 0 12px rgba(34,211,238,0.9));
              }
            }
            @keyframes wingPulseRight {
              0%, 100% {
                transform: translate(0px, 0px) scale(1) rotate(0deg);
                filter: drop-shadow(0 0 3px rgba(34,211,238,0.4));
              }
              50% {
                transform: translate(3px, -1px) scale(1.05) rotate(2deg);
                filter: drop-shadow(0 0 12px rgba(34,211,238,0.9));
              }
            }
            @keyframes diamondGlow {
              0%, 100% {
                filter: drop-shadow(0 0 1.5px #22d3ee) brightness(1);
              }
              50% {
                filter: drop-shadow(0 0 9px #38bdf8) brightness(1.4);
              }
            }
            @keyframes goldSparkle {
              0%, 100% { opacity: 0.3; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.1); }
            }
            .wing-l {
              animation: wingPulseLeft 2.2s ease-in-out infinite;
              transform-origin: 75px 100px;
            }
            .wing-r {
              animation: wingPulseRight 2.2s ease-in-out infinite;
              animation-delay: 1.1s;
              transform-origin: 125px 100px;
            }
            .gem-glow {
              animation: diamondGlow 2.5s ease-in-out infinite;
            }
            .sparkle-dot {
              animation: goldSparkle 1.8s ease-in-out infinite;
            }
          `}
        </style>

        {/* BACKGROUND GLOWING AURA RINGS */}
        <circle cx="100" cy="100" r="54" fill="none" stroke="#22d3ee" strokeWidth="2.5" opacity="0.15" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="4,8" opacity="0.25" className="animate-spin" style={{ animationDuration: '40s' }} />

        {/* LEFT FLAMING WINGS (GIF AURA) */}
        <g className="wing-l">
          {/* Flame wing layer 1 */}
          <path d="M 45,65 C 16,38 6,90 14,126 C 18,143 40,146 40,146 C 40,146 28,121 30,96 C 32,71 45,65 45,65 Z" fill="url(#blue-aura)" opacity="0.65" filter="url(#flame-neon-glow)" />
          {/* Flame wing layer 2 */}
          <path d="M 47,75 C 27,53 19,96 25,121 C 29,136 41,136 41,136 C 41,136 31,116 33,96 C 35,76 47,75 47,75 Z" fill="url(#cyan-glow)" opacity="0.85" />
          {/* Flame wing layer 3 */}
          <path d="M 49,85 C 36,70 30,101 34,116 C 37,126 43,126 43,126 C 43,126 35,111 37,96 C 39,81 49,85 49,85 Z" fill="#ffffff" opacity="0.9" />
        </g>

        {/* RIGHT FLAMING WINGS (GIF AURA) */}
        <g className="wing-r">
          {/* Flame wing layer 1 */}
          <path d="M 155,65 C 184,38 194,90 186,126 C 182,143 160,146 160,146 C 160,146 172,121 170,96 C 168,71 155,65 155,65 Z" fill="url(#blue-aura)" opacity="0.65" filter="url(#flame-neon-glow)" />
          {/* Flame wing layer 2 */}
          <path d="M 153,75 C 173,53 181,96 175,121 C 171,136 159,136 159,136 C 159,136 169,116 167,96 C 165,76 153,75 153,75 Z" fill="url(#cyan-glow)" opacity="0.85" />
          {/* Flame wing layer 3 */}
          <path d="M 151,85 C 164,70 170,101 166,116 C 163,126 157,126 157,126 C 157,126 165,111 163,96 C 161,81 151,85 151,85 Z" fill="#ffffff" opacity="0.9" />
        </g>

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
        <polygon points="65,54 71,60 65,66 59,60" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" style={{ animationDelay: '0.4s' }} />
        {/* Upper-Right gem */}
        <polygon points="135,54 141,60 135,66 129,60" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" style={{ animationDelay: '0.4s' }} />
        {/* Lower-Left gem */}
        <polygon points="65,140 71,146 65,152 59,146" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" style={{ animationDelay: '0.8s' }} />
        {/* Lower-Right gem */}
        <polygon points="135,140 141,146 135,152 129,146" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.5" className="gem-glow" style={{ animationDelay: '0.8s' }} />

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
          <path d="M 100,31 C 96.5,37 100,45 100,45 C 100,45 103.5,37 100,31 Z" fill="url(#cyan-glow)" stroke="#ffffff" strokeWidth="0.75" className="gem-glow" style={{ animationDelay: '0.5s' }} />
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
          <path d="M 35,145 Q 40,145 40,140 Q 40,145 45,145 Q 40,145 40,150 Q 40,145 35,145" fill="#22d3ee" className="sparkle-dot" style={{ animationDelay: '0.8s' }} />
        </g>
      </svg>
    </motion.div>
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
  phone?: string;
  email?: string;
  authProvider: "phone" | "google" | "facebook";
  country?: string;
  countryFlag?: string;
  birthday?: string;
  gender?: string;
  hasTigerCrown?: boolean;
  vipLevel?: number;
  bio?: string;
  description?: string;
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
}

const INITIAL_LOBBY_ROOMS: LobbyRoom[] = [
  {
    id: "room-default-1",
    title: "🖤BABA❤️.ji🖤.ᔕ.RUM🖤",
    subtitle: "Welcome to my private premium lounge! Feel at home.",
    hostName: "VIP BABA",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇧🇩",
    categoryTag: "Friend",
    categoryColor: "bg-[#f59e0b]",
    popularity: 48902,
    userCount: 124
  },
  {
    id: "room-default-2",
    title: "Sylhet Dynamic Adda 🇧🇩",
    subtitle: "Music, friendship & non-stop gossip 🎶🔥",
    hostName: "Nafis_Sy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇧🇩",
    categoryTag: "Music",
    categoryColor: "bg-[#7c3aed]",
    popularity: 32001,
    userCount: 78
  },
  {
    id: "room-default-3",
    title: "Golden Hearts Cafe 💕",
    subtitle: "Let's find the sweet matching soul today!",
    hostName: "Angel_Piu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇮🇳",
    categoryTag: "Love",
    categoryColor: "bg-[#ef4444]",
    popularity: 24500,
    userCount: 45
  },
  {
    id: "room-default-4",
    title: "Bangla Rock & Pop Feed 🎸",
    subtitle: "Sing along with your favorite hits!",
    hostName: "Imran_vocal",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇧🇩",
    categoryTag: "Music",
    categoryColor: "bg-[#7c3aed]",
    popularity: 18450,
    userCount: 32
  }
];

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200", // Woman 1
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200", // Man 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200", // Woman 2
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200", // Man 2
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200", // Woman 3
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200", // Man 3
];

const INVITE_MEMBERS = [
  { name: "GudiyaV™", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Názakat🍁", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "WRONG PASSWORD🔐", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "MÆRCO❤️", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Sùbhü🔥", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Official", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "pari 🥰", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", flag: "🇮🇳" },
  { name: "Angel_Piu", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇮🇳" },
  { name: "Imran_vocal", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇧🇩" },
  { name: "VIP BABA", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200", flag: "🇧🇩" }
];

const COUNTRIES_LIST = [
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "India", flag: "🇮🇳" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Yemen", flag: "🇾🇪" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Lebanon", flag: "🇱🇧" }
];

export default function App() {
  // Navigation & Step Management
  const [currentStep, setCurrentStep] = useState<"loading" | "login" | "phone-otp" | "register" | "select-country" | "profile-details" | "lobby" | "room">("loading");
  
  // Lobby state managers (Screenshot 3)
  const [lobbyRooms, setLobbyRooms] = useState<LobbyRoom[]>(() => {
    const stored = localStorage.getItem("voxaclub_lobby_rooms");
    let customRooms: LobbyRoom[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LobbyRoom[];
        customRooms = parsed.filter(room => room.id && room.id.startsWith("room-custom-"));
      } catch (e) {
        customRooms = [];
      }
    }
    return [...customRooms, ...INITIAL_LOBBY_ROOMS];
  });
  const [activeBottomTab, setActiveBottomTab] = useState<"home" | "moment" | "social" | "mine">("home");
  const [lobbyActiveSubTab, setLobbyActiveSubTab] = useState<"Popular" | "Mine" | "Explore">("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeRoom, setActiveRoom] = useState<LobbyRoom | null>(null);

  // Carousel Slider state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  // Daily Sign-In Check-In Calendar state
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Room Details & Cover Editing states
  const [minimizedRoom, setMinimizedRoom] = useState<LobbyRoom | null>(null);
  const [showBroadcastDrawer, setShowBroadcastDrawer] = useState(false);
  const [showRoomDetailsSheet, setShowRoomDetailsSheet] = useState(false);
  const [showAllJoinedMembers, setShowAllJoinedMembers] = useState(false);
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

  // Real-time Room EXP growth logic (grows as time passes inside activeRoom)
  useEffect(() => {
    if (!activeRoom || currentStep !== "room") return;
    const interval = setInterval(() => {
      setRoomExpMap((prev) => {
        const currentExp = prev[activeRoom.id] !== undefined ? prev[activeRoom.id] : 182037;
        const addedExp = Math.floor(Math.random() * 45) + 15; // real-time increment
        return {
          ...prev,
          [activeRoom.id]: currentExp + addedExp,
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [activeRoom, currentStep]);

  const getRoomExp = (roomId: string): number => {
    return roomExpMap[roomId] !== undefined ? roomExpMap[roomId] : 182037;
  };

  const getRoomLevel = (exp: number): number => {
    if (exp < 50000) return 1;
    if (exp < 250000) return 2;
    if (exp < 1000000) return 3;
    return 4;
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

  // Authentication & Agreement States (Screenshot 2)
  const [isAgreed, setIsAgreed] = useState(false);
  const [authProvider, setAuthProvider] = useState<"phone" | "google" | "facebook" | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(() => {
    const savedSession = localStorage.getItem("voxaclub_current_user");
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        console.error("Failed to parse saved session, returning default", e);
      }
    }
    const defaultUser: UserProfile = {
      id: "1488500",
      name: "Md Munna",
      avatar: "", // empty so it renders matching screenshot circle bg with letter 'M'
      authProvider: "phone",
      phone: "+8801712345678",
      country: "Bangladesh",
      countryFlag: "🇧🇩",
      birthday: "1999-10-12",
      gender: "Male",
      bio: "Live your life to the fullest 🚀",
      description: "Hi! I am Md Munna from Bangladesh. I love hosting live voice rooms and chatting with friends!"
    };
    localStorage.setItem("voxaclub_current_user", JSON.stringify(defaultUser));
    return defaultUser;
  });

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

  // Toast / System Notification HUD
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "otp" } | null>(null);

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

  // Audio & Mic States inside Live Room
  const [isMuted, setIsMuted] = useState(true);
  const [isNoiseReductionActive, setIsNoiseReductionActive] = useState(true);
  const [audioEffect, setAudioEffect] = useState<"clean" | "studio" | "hall" | "retro">("studio");
  const [microphonePermission, setMicrophonePermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [realAudioLevel, setRealAudioLevel] = useState(0);

  // Room Status States
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"speakers" | "chat">("speakers");
  const [chatMessage, setChatMessage] = useState("");
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

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

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

  // Countdown timer for OTP Verification code resend limit
  useEffect(() => {
    if (!otpSent || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Show / Clear automated popup alerts
  const triggerToast = (message: string, type: "success" | "error" | "otp", duration = 4000) => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);
    return () => clearTimeout(timer);
  };

  // 2. Loading Completion Auto-Transition Logic
  useEffect(() => {
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
  }, [loadingPercentage, isReady, loggedInUser]);

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

  // Auto scroll chat list to bottom when alerts update
  useEffect(() => {
    if (currentStep === "room" && chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
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
            if (!analyserRef.current || isMuted) return;
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
  const handleAuthAttempt = (provider: "phone" | "google" | "facebook") => {
    if (!isAgreed) {
      triggerToast("Please agree to the User Agreement first.", "error");
      return;
    }

    setAuthProvider(provider);

    if (provider === "phone") {
      setCurrentStep("phone-otp");
    } else {
      // Open the elegant mock authentication accounts chooser modal
      setShowPopupOverlay(true);
    }
  };

  // Actions for Phone Number Verification Code
  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      triggerToast("Please enter a valid phone number.", "error");
      return;
    }

    // Generate a secure 6-digit verification code mathematically
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(60);

    // Realistic visual toast delivery matching SMS gateways
    triggerToast(`OTP Sent to ${phoneNumber}! Use code: ${code}`, "otp", 10000);
  };

  // Submits the OTP to verify identity
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (userEnteredOtp !== generatedOtp) {
      triggerToast("Invalid verification code. Please try again.", "error");
      return;
    }

    triggerToast("Phone verification successful!", "success");

    // Fetch existing registered database records
    const allUsersStr = localStorage.getItem("voxaclub_users");
    const usersList: UserProfile[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    const existingUser = usersList.find((u) => u.phone === phoneNumber);

    if (existingUser) {
      // Account exists, log them directly in
      setLoggedInUser(existingUser);
      localStorage.setItem("voxaclub_current_user", JSON.stringify(existingUser));
      
      // Update participants list immediately
      setParticipants(prev =>
        prev.map(p => p.id === "host-1" ? { ...p, name: `${existingUser.name} (You)`, avatar: existingUser.avatar } : p)
      );
      
      setCurrentStep("lobby");
    } else {
      // First-time user, route to select-country onboarding
      setRegUsername("Munna");
      setCurrentStep("select-country");
    }
  };

  // Handles Google/Facebook simulated callback validation
  const handleSocialSelect = (name: string, email: string, avatar: string) => {
    setShowPopupOverlay(false);
    
    const allUsersStr = localStorage.getItem("voxaclub_users");
    const usersList: UserProfile[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    const existingUser = usersList.find((u) => u.email === email);

    if (existingUser) {
      setLoggedInUser(existingUser);
      localStorage.setItem("voxaclub_current_user", JSON.stringify(existingUser));
      
      setParticipants(prev =>
         prev.map(p => p.id === "host-1" ? { ...p, name: `${existingUser.name} (You)`, avatar: existingUser.avatar } : p)
      );
      
      triggerToast(`Authenticated successfully via Google!`, "success");
      setCurrentStep("lobby");
    } else {
      // New Social Account registration
      setRegUsername(name);
      setRegAvatar(avatar);
      setCurrentStep("select-country");
    }
  };

  const handleProfileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRegAvatar(url);
    triggerToast("Profile photo selected successfully!", "success");
  };

  // Completes first-time profile creation and persists in database
  const handleRegisterProfile = (e: FormEvent) => {
    e.preventDefault();
    handleCompleteOnboarding(false);
  };

  const handleCompleteOnboarding = (isSkip: boolean) => {
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

    const newUser: UserProfile = {
      id: "user-" + Date.now(),
      name: finalUsername,
      avatar: finalAvatar,
      phone: authProvider === "phone" ? phoneNumber : undefined,
      email: authProvider !== "phone" ? `user-${Date.now()}@voxaclub.com` : undefined,
      authProvider: authProvider || "phone",
      country: finalCountry,
      countryFlag: finalCountryFlag,
      birthday: finalBirthday,
      gender: finalGender,
    };

    // Save into all registered users database
    const allUsersStr = localStorage.getItem("voxaclub_users");
    const usersList: UserProfile[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    usersList.push(newUser);
    localStorage.setItem("voxaclub_users", JSON.stringify(usersList));

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

  const handleEditProfileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditAvatar(url);
    triggerToast("Temporary profile photo updated!", "success");
  };

  const handleSaveProfile = () => {
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
    
    // Sync participant
    setParticipants(prev =>
      prev.map(p => (p.id === "user-current" || p.id === "host-1") ? { ...p, name: `${updatedUser.name} (You)`, avatar: updatedUser.avatar } : p)
    );

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
  const handleOpenGiftBox = () => {
    if (!loggedInUser) return;
    
    const updatedUser = { ...loggedInUser, hasTigerCrown: true };
    setLoggedInUser(updatedUser);
    localStorage.setItem("voxaclub_current_user", JSON.stringify(updatedUser));
    
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
    
    setShowGiftBoxPopup(false);
    setShowCrownClaimSuccess(true);
  };

  // Clear session / Log out
  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out?")) {
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

  // Background fluctuation for room audience counts (real-time active counter)
  useEffect(() => {
    const timer = setInterval(() => {
      setLobbyRooms((prev) =>
        prev.map((room) => {
          // Slowly fluctuate user counts
          const deltaUsers = Math.random() > 0.6 ? 1 : Math.random() > 0.5 ? -1 : 0;
          const newUsers = Math.max(1, room.userCount + deltaUsers);
          // Fluctuates popularity slightly too
          const deltaPop = Math.floor(Math.random() * 8) - 2;
          return {
            ...room,
            userCount: newUsers,
            popularity: Math.max(100, room.popularity + deltaPop)
          };
        })
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Enter a room card in real-time
  const joinRoom = (room: LobbyRoom) => {
    setActiveRoom(room);
    
    // Set speakers list based on the room joined (Only the single logged-in account, no demo)
    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];
    
    const mockParticipants: Participant[] = [
      {
        id: "user-current",
        name: `${currentUserName} (You)`,
        role: "Host",
        avatar: currentUserAvatar,
        isMuted: isMuted,
        isSpeaking: false,
        volume: 100
      }
    ];

    setParticipants(mockParticipants);
    
    // Set up high-fidelity audio seats (Only the logged-in user, no other pre-populated seats!)
    const hostUserObj: Participant = {
      id: "user-current",
      name: currentUserName,
      role: "Host",
      avatar: currentUserAvatar,
      isMuted: isMuted,
      isSpeaking: false,
      volume: 100
    };

    setHostSeatUser(hostUserObj);
    setSuperSeatUser(null);
    setGridSeatsUsers(Array(10).fill(null));

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

    // If locked and not admin, block with helper toast
    if (isLocked && testRoomRole !== "admin") {
      triggerToast("This seat is locked by Host/Admin. 🔒", "error");
      return;
    }

    setIsInvitingInSeatActions(false); // Reset internal sub-view
    setActiveSeatConfig({ seatType, gridIndex });
    setShowSeatActionsModal(true);
  };

  // Actual Seat movement / action logic
  const executeSeatMovement = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0];

    const key = getSeatKey(seatType, gridIndex);
    const isAdminMuted = seatMutes[key] || false;

    // Build the current user's participant object
    const meParticipant: Participant = {
      id: "user-current",
      name: `${currentUserName} (You)`,
      role: seatType === "host" ? "Host" : seatType === "super" ? "Co-Host" : "Speaker",
      avatar: currentUserAvatar,
      isMuted: isAdminMuted ? true : isMuted,
      isSpeaking: isAdminMuted ? false : !isMuted,
      volume: 100
    };

    // If the seat is locked and user is not admin, block
    if (seatLocks[key] && testRoomRole !== "admin") {
      return;
    }

    // Find if the current user is already sitting somewhere and vacate that seat
    let isAlreadySeated = false;
    let oldSeatType: "host" | "super" | "grid" | null = null;
    let oldGridIndex: number | null = null;

    if (hostSeatUser?.id === "user-current") {
      isAlreadySeated = true;
      oldSeatType = "host";
    } else if (superSeatUser?.id === "user-current") {
      isAlreadySeated = true;
      oldSeatType = "super";
    } else {
      const idx = gridSeatsUsers.findIndex(u => u?.id === "user-current");
      if (idx !== -1) {
        isAlreadySeated = true;
        oldSeatType = "grid";
        oldGridIndex = idx;
      }
    }

    const vacateOldSeat = () => {
      if (oldSeatType === "host") {
        setHostSeatUser(null);
      } else if (oldSeatType === "super") {
        setSuperSeatUser(null);
      } else if (oldSeatType === "grid" && oldGridIndex !== null) {
        setGridSeatsUsers(prev => {
          const next = [...prev];
          next[oldGridIndex!] = null;
          return next;
        });
      }
    };

    // If clicking their OWN seat, stand up
    if (
      (seatType === "host" && hostSeatUser?.id === "user-current") ||
      (seatType === "super" && superSeatUser?.id === "user-current") ||
      (seatType === "grid" && gridIndex !== undefined && gridSeatsUsers[gridIndex]?.id === "user-current")
    ) {
      vacateOldSeat();
      return;
    }

    // If clicking an occupied seat, ignore
    const targetUser = seatType === "host" ? hostSeatUser : seatType === "super" ? superSeatUser : gridSeatsUsers[gridIndex!];
    if (targetUser) {
      return;
    }

    // Move or sit down
    if (isAlreadySeated) {
      vacateOldSeat();
    }

    if (seatType === "host") {
      setHostSeatUser(meParticipant);
    } else if (seatType === "super") {
      setSuperSeatUser(meParticipant);
    } else if (seatType === "grid" && gridIndex !== undefined) {
      setGridSeatsUsers(prev => {
        const next = [...prev];
        next[gridIndex] = meParticipant;
        return next;
      });
    }

    if (isAdminMuted) {
      setIsMuted(true);
    }
  };

  // Handle Room Creation (no demo - real dynamic room is appended to the lobby list)
  const handleCreateRoom = (e: FormEvent) => {
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

    const newRoom: LobbyRoom = {
      id: "room-custom-" + Date.now(),
      title: newRoomTitle.trim(),
      subtitle: newRoomSubtitle.trim() || "Welcome to my private premium lounge!",
      hostName: currentUserName,
      avatar: newRoomPhoto || currentUserAvatar,
      hasVipFrame: true,
      countryFlag: newRoomCountry,
      categoryTag: newRoomCategory,
      categoryColor: categoryColors[newRoomCategory] || "bg-[#7c3aed]",
      popularity: 100,
      userCount: 1
    };

    // Prepend to active lobby rooms list in real-time
    setLobbyRooms((prev) => [newRoom, ...prev]);
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

  const handleRoomFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const url = URL.createObjectURL(file);
    setNewRoomPhoto(url);
    setNewRoomPhotoType(isVideo ? "video" : "image");
    triggerToast(isVideo ? "Video / GIF selected successfully!" : "Photo selected successfully!", "success");
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
            {/* 1. SHINING YELLOW GOLD HEADER (Replicating Screenshot 3 Yellow wash) */}
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
                                প্রিমিয়াম আইডি বিশেষাধিকার 👑
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
                                লাইভ ভয়েস পার্টি লাউঞ্জ 🎙️
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
                                কয়েন শপ এবং রিয়েল ক্যাশআউট 🪙
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
                                রিয়েল-টাইম আড্ডা ও গেমস 🎮
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
                                এজেন্সি ও গিফটার মেলা 🏆
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
                        {lobbyRooms.map((room) => {
                          const isRoomActive = activeRoom?.id === room.id || minimizedRoom?.id === room.id;
                          return (
                            <div
                              key={`active-panel-${room.id}`}
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
                            room.subtitle.toLowerCase().includes(query)
                          );
                        }
                        return true;
                      })
                      .map((room, index) => {
                        const isEven = index % 2 === 0;

                        return (
                          <div key={room.id} className="space-y-3">
                            {/* Render "Top Gifters" pink banner exactly between room 3 and 4 (index 3) */}
                            {lobbyActiveSubTab === "Popular" && index === 3 && !searchQuery.trim() && (
                              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 text-white p-4.5 shadow-[0_8px_25px_rgba(219,39,119,0.25)] select-none">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                                
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

                                  {/* Category pill */}
                                  <span className={`text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-white ${room.categoryColor}`}>
                                    {room.categoryTag}
                                  </span>

                                  {/* Fire popularity pill */}
                                  <span className="inline-flex items-center gap-0.5 text-[9.5px] font-mono font-black text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">
                                    <Flame className="w-2.5 h-2.5 animate-pulse text-rose-600 fill-rose-500" />
                                    <span>{room.popularity.toLocaleString()}</span>
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

              {/* TAB 3: SOCIAL SYSTEM INBOX */}
              {activeBottomTab === "social" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-violet-200 pb-2">
                    <h3 className="text-base font-black tracking-tight text-[#1e0d3d]">Active Inbox</h3>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-extrabold tracking-wide uppercase">
                      {inboxChats.filter(c => c.unread).length} New Alerts
                    </span>
                  </div>

                  <div className="space-y-2">
                    {inboxChats.map((chat, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Mark as read in click handler
                          setInboxChats(prev =>
                            prev.map((c, i) => i === idx ? { ...c, unread: false } : c)
                          );
                          triggerToast(`Official deposit message from ${chat.name} opened!`, "success");
                        }}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-violet-50/50 rounded-3xl border border-violet-100 transition-all text-left cursor-pointer shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                            💳
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              <span>{chat.name}</span>
                              {chat.unread && <span className="block w-2 h-2 rounded-full bg-pink-500 animate-ping" />}
                            </h4>
                            <p className="text-[11px] text-violet-500 font-bold leading-relaxed mt-1 whitespace-pre-wrap">{chat.text}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-violet-400 flex-shrink-0">{chat.time}</span>
                      </button>
                    ))}

                    {inboxChats.length === 0 && (
                      <div className="text-center py-20 px-6 space-y-3.5 bg-white rounded-3xl border border-violet-100/50 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 mx-auto">
                          <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-black text-[#1e0d3d]">Inbox is completely clean</h4>
                        <p className="text-xs text-indigo-400 max-w-[240px] mx-auto leading-relaxed">
                          No direct messages found. When you top-up or recharge coins via payment partners, receipts will instantly appear here!
                        </p>
                      </div>
                    )}
                  </div>
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
                    <div className="space-y-3.5 pt-4 pb-6">
                      
                      {/* 1. Header Card (Matches Screenshot 3) */}
                      <div className="px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          {/* Circle Avatar with custom tiger crown option */}
                          <div className="w-18 h-18 rounded-full bg-[#7a95a8] flex items-center justify-center border-2 border-white shadow-sm relative overflow-visible flex-shrink-0">
                            {loggedInUser?.hasTigerCrown && <TigerCrown size="profile-banner" />}
                            {loggedInUser?.avatar && loggedInUser.avatar.trim() !== "" ? (
                              <img
                                src={loggedInUser.avatar}
                                alt={loggedInUser.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-white text-3xl font-black uppercase tracking-tight select-none">
                                {loggedInUser?.name ? loggedInUser.name.charAt(0) : "M"}
                              </span>
                            )}
                          </div>

                          {/* Name, ID info */}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                                {loggedInUser?.name || "Md Munna"}
                              </h3>
                              {vipLevel > 0 && (
                                <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase select-none shadow-xs">
                                  VIP {vipLevel}
                                </span>
                              )}
                              {/* Male / Female badge */}
                              {loggedInUser?.gender === "Female" ? (
                                <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[8px] font-black" title="Female">
                                  ♀
                                </span>
                              ) : (
                                <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black" title="Male">
                                  ♂
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] font-mono font-bold text-slate-400 select-all">
                                ID:{loggedInUser?.id || "1488500"}
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(loggedInUser?.id || "1488500");
                                  triggerToast("ID copied to clipboard!", "success");
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                title="Copy ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>

                              <span className="bg-[#fef9c3] border border-[#fef08a] text-[#854d0e] px-1.5 py-0.5 rounded text-[8px] font-black tracking-wide uppercase select-none">
                                Pretty ID ›
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Slide triggers */}
                        <button
                          onClick={openEditProfile}
                          className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                        >
                          <ChevronRight className="w-5.5 h-5.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Bio line banner */}
                      {loggedInUser?.bio && (
                        <div className="px-4 py-0.5">
                          <p className="text-[11px] text-slate-500 font-medium bg-white/45 border border-white/60 backdrop-blur-xs px-3 py-1.5 rounded-xl inline-block max-w-[95%] truncate">
                            ✨ {loggedInUser.bio}
                          </p>
                        </div>
                      )}

                      {/* 2. Stats row matching screenshot */}
                      <div className="mx-4 bg-white rounded-2xl py-3 px-1 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 grid grid-cols-4 text-center select-none">
                        <div>
                          <span className="block text-base font-extrabold text-slate-800 leading-none">0</span>
                          <span className="text-[10px] text-[#8e8a9c] font-semibold mt-1 block">Follow</span>
                        </div>
                        <div className="text-slate-200">|</div>
                        <div>
                          <span className="block text-base font-extrabold text-slate-800 leading-none">0</span>
                          <span className="text-[10px] text-[#8e8a9c] font-semibold mt-1 block">Fans</span>
                        </div>
                        <div className="text-slate-200">|</div>
                        <div>
                          <span className="block text-base font-extrabold text-slate-800 leading-none">0</span>
                          <span className="text-[10px] text-[#8e8a9c] font-semibold mt-1 block">Sent</span>
                        </div>
                        <div className="text-slate-200">|</div>
                        <div>
                          <span className="block text-base font-extrabold text-slate-800 leading-none">0</span>
                          <span className="text-[10px] text-[#8e8a9c] font-semibold mt-1 block">Received</span>
                        </div>
                      </div>

                      {/* 3. Wallet card matching screenshot */}
                      <div className="mx-4 bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800">Wallet</span>
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full select-none animate-pulse">
                              RECHARGE REWARDS
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span>🪙 {userCoins.toLocaleString()}</span>
                            <span className="text-slate-200">|</span>
                            <span>💎 0</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>

                        {/* Dual boxes VIP & Premium */}
                        <div className="grid grid-cols-2 gap-3 pt-0.5">
                          {/* VIP card */}
                          <div 
                            onClick={() => {
                              setSelectedVipLevel(vipLevel > 0 ? vipLevel : 1);
                              setShowVipPage(true);
                            }}
                            className="bg-gradient-to-br from-[#f5ebd8] to-[#eae0cd] rounded-xl p-3 flex items-center justify-between border border-[#e2d6bf] cursor-pointer transition-all active:scale-98 hover:brightness-98"
                          >
                            <div>
                              <span className="block text-xs font-black text-[#5c4314]">VIP</span>
                              <span className="block text-[9px] text-[#8c6d32] font-extrabold mt-0.5">My Level:{vipLevel}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-300 flex items-center justify-center shadow-sm select-none">
                              <span className="text-white font-serif font-black italic text-[11px]">V</span>
                            </div>
                          </div>

                          {/* Premium card */}
                          <div className="bg-gradient-to-br from-[#fdf2d5] to-[#fbe6af] rounded-xl p-3 flex items-center justify-between border border-[#edd89e]">
                            <div>
                              <span className="block text-xs font-black text-[#5c4a14]">Premium</span>
                              <span className="block text-[9px] text-[#8c7432] font-extrabold mt-0.5">Go to open &gt;&gt;</span>
                            </div>
                            <span className="text-lg filter drop-shadow-sm select-none leading-none">👑</span>
                          </div>
                        </div>
                      </div>

                      {/* 4. Grid of Options (8 items) */}
                      <div className="mx-4 bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 grid grid-cols-4 gap-y-4 gap-x-2 select-none">
                        {[
                          { title: "Wealth", icon: <Star className="w-5.5 h-5.5" />, bg: "bg-[#fff2e3] text-[#ff8e26]" },
                          { title: "Charm", icon: <Heart className="w-5.5 h-5.5" />, bg: "bg-[#ffebf7] text-[#ff68cf]" },
                          { title: "Lucky", icon: <Sparkles className="w-5.5 h-5.5" />, bg: "bg-[#e3fbf2] text-[#21cf8c]" },
                          { title: "Medal", icon: <Award className="w-5.5 h-5.5" />, bg: "bg-[#f1eaff] text-[#8b57ff]" },
                          { title: "Task", icon: <Calendar className="w-5.5 h-5.5" />, bg: "bg-[#fff5e2] text-[#ffaa15]", badge: true },
                          { title: "Mall", icon: <ShoppingBag className="w-5.5 h-5.5" />, bg: "bg-[#ffebee] text-[#ff4f72]" },
                          { title: "Backpack", icon: <Gift className="w-5.5 h-5.5" />, bg: "bg-[#fff9dd] text-[#ffc616]" },
                          { title: "Decorations", icon: <Shirt className="w-5.5 h-5.5" />, bg: "bg-[#e6f4ff] text-[#299dff]" },
                        ].map((item) => (
                          <div
                            key={item.title}
                            onClick={() => {
                              if (item.title === "Task") setShowCheckInModal(true);
                              else triggerToast(`${item.title} is fully integrated! Enjoy premium access.`, "success");
                            }}
                            className="flex flex-col items-center justify-center cursor-pointer group"
                          >
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.bg} relative transition-all active:scale-95 group-hover:brightness-98 shadow-xs`}>
                              {item.icon}
                              {item.badge && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-600 font-bold tracking-tight mt-1.5 group-hover:text-slate-800 transition-colors">
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 5. Benefits Block */}
                      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 divide-y divide-slate-50">
                        {/* Exciting Benefits Row */}
                        <div
                          onClick={() => triggerToast("Premium dynamic benefit catalog is loading!", "success")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                              <Gift className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-black text-slate-800">Exciting Benefits</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>

                        {/* OneR Affiliate Row with Yellow Commission Bubble */}
                        <div className="p-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                                <User className="w-4.5 h-4.5" />
                              </div>
                              <span className="text-xs font-black text-slate-800">OneR Affiliate</span>
                            </div>
                            <span className="bg-amber-50 border border-amber-200/50 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded flex items-center gap-1 leading-none select-none">
                              🪙 Recharge Commission
                            </span>
                          </div>

                          <div className="mt-2.5 pl-11">
                            <div
                              onClick={() => triggerToast("Your custom invite referral link is copied!", "success")}
                              className="bg-[#fef9c3] text-[#854d0e] text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-between shadow-xs border border-yellow-200/50 cursor-pointer hover:bg-yellow-100/80 transition-all active:scale-[0.99]"
                            >
                              <span>Invite friends, earn a big commission!</span>
                              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          </div>
                        </div>

                        {/* Join Us Row */}
                        <div
                          onClick={() => triggerToast("Agency partner signup is online! Redirecting...", "success")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                              <span className="text-sm select-none leading-none">🚩</span>
                            </div>
                            <span className="text-xs font-black text-slate-800">Join Us</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      {/* 6. Languages and Settings Block */}
                      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50 divide-y divide-slate-50">
                        {/* Language Selector */}
                        <div
                          onClick={() => triggerToast("English translation is active.", "success")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                              <Globe className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-black text-slate-800">Language</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                            <span>English</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Feedback Row */}
                        <div
                          onClick={() => triggerToast("Feedback portal is active! Contact support@potalive.com", "success")}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center">
                              <MessageCircle className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-black text-slate-800">Feedback</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>

                        {/* Settings / Profile Editor */}
                        <div
                          onClick={openEditProfile}
                          className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
                              <Settings className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-black text-slate-800">Profile Settings</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>

                        {/* Sign Out */}
                        <div
                          onClick={handleLogout}
                          className="flex items-center justify-between p-3.5 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                              <X className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-black">Sign Out Session</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-rose-300" />
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

              {/* Social Tab with real screenshot red badge "1" */}
              <button
                onClick={() => setActiveBottomTab("social")}
                className="flex flex-col items-center justify-center cursor-pointer group flex-1 relative"
              >
                <div className="relative p-1">
                  <MessageCircle className={`w-6 h-6 transition-all ${activeBottomTab === "social" ? "text-violet-600 stroke-[2.5] scale-110" : "text-slate-400 stroke-[2] group-hover:text-slate-600"}`} />
                  <span className="absolute -top-1 -right-2.5 bg-[#ff3b30] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white shadow-xs">
                    1
                  </span>
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
                      {[
                        { id: "user-current", name: loggedInUser ? loggedInUser.name : "Munna", role: "Owner", avatar: (loggedInUser && loggedInUser.avatar) ? loggedInUser.avatar : DEFAULT_AVATARS[0], color: "bg-gradient-to-r from-amber-400 to-orange-500 text-[#4a2e00]" },
                        { id: "admin-1", name: "Sajid_Aman", role: "Admin", avatar: DEFAULT_AVATARS[1], color: "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#002d4a]" },
                        { id: "admin-2", name: "Lina_R", role: "Admin", avatar: DEFAULT_AVATARS[2], color: "bg-gradient-to-r from-cyan-400 to-blue-500 text-[#002d4a]" },
                        { id: "host-seat", name: "Mahi_R", role: "Host", avatar: DEFAULT_AVATARS[4], color: "bg-gradient-to-r from-purple-400 to-indigo-500 text-[#25004a]" },
                        { id: "member-1", name: "Kamil_H", role: "Member", avatar: DEFAULT_AVATARS[3], color: "bg-gradient-to-r from-slate-400 to-slate-500 text-[#2a2a2a]" },
                        { id: "member-2", name: "Nila_Y", role: "Member", avatar: DEFAULT_AVATARS[5], color: "bg-gradient-to-r from-slate-400 to-slate-500 text-[#2a2a2a]" }
                      ].map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 bg-slate-50/60 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all select-none">
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
                              <span className="block text-xs font-black text-slate-800 leading-none mb-1.5">
                                {m.name}
                              </span>
                              <span className="block text-[8px] text-slate-400 font-bold font-mono tracking-wide leading-none">
                                ID: {m.id.startsWith("user") ? "24708556" : "custom-" + Math.floor(Math.random() * 89999 + 10000)}
                              </span>
                            </div>
                          </div>
                          
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wider leading-none select-none shadow-sm ${m.color}`}>
                            {m.role}
                          </span>
                        </div>
                      ))}
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
                        ID: {roomTheme === "star-host" ? "24708556" : (activeRoom?.id ? activeRoom.id.slice(0, 10).replace("room-", "") : "4032271")}
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
                  onClick={() => triggerToast(`There are ${listenerCount} active listeners in this room!`, "success")}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full pl-2 pr-3 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex -space-x-2 mr-1">
                    {[
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=60&h=60",
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=60&h=60"
                    ].map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Audience Avatar"
                        className="w-5 h-5 rounded-full object-cover border border-[#0d0e1a]"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-amber-400">{listenerCount}</span>
                  <span className="text-[9px] text-slate-400 font-bold ml-0.5">❯</span>
                </div>
              </div>

              {/* 3. CORE AUDIO SEATS SECTION */}
              {roomTheme === "star-host" ? (
                /* STAR HOST DISCOVERY THEME (Screenshot 2) */
                <div className="flex-1 flex flex-col justify-start gap-3 my-2 overflow-y-auto px-1 select-none">
                  
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
                      <div key={idx} className="flex flex-col items-center justify-center relative">
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
                <div className="flex-1 flex flex-col justify-start gap-5 my-4 overflow-y-auto px-1 select-none">
                  
                  {/* A. Top Section: 2 premium seats (Host, Super) */}
                  <div className="flex items-center justify-center gap-16 mt-3">
                    
                    {/* HOST SEAT */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleSeatClick("host")}
                        className="relative w-22 h-22 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {/* Animated Tiger Crown Overlay */}
                        {hostSeatUser && (hostSeatUser.id === "user-current" ? loggedInUser?.hasTigerCrown : hostSeatUser.hasTigerCrown) && (
                          <TigerCrown size="premium-seat" />
                        )}

                        {/* Premium gold glowing circular border */}
                        <div className="absolute inset-0 rounded-full border-3 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse" />
                        <div className="absolute -inset-1 rounded-full border border-amber-500/40 bg-amber-500/5" />
                        
                        {/* Seat Inner Background & Avatar/Icon */}
                        <div className="w-18 h-18 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                          {hostSeatUser ? (
                            <img
                              src={hostSeatUser.avatar || DEFAULT_AVATARS[0]}
                              alt={hostSeatUser.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : seatLocks["host"] ? (
                            <Lock className="w-6 h-6 text-amber-400" />
                          ) : (
                            <div className="flex flex-col items-center text-slate-400 justify-center">
                              {/* Standard elegant inline sofa icon */}
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-amber-400/70">
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                                <path d="M5 18v2M19 18v2" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Speaking Aura or Mute indicator badge */}
                        {(hostSeatUser || seatMutes["host"]) && (
                          <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                            {(hostSeatUser?.isMuted || seatMutes["host"]) ? (
                              <MicOff className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            )}
                          </div>
                        )}
                      </button>
                      <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase mt-2.5 leading-none">
                        {hostSeatUser ? hostSeatUser.name.split(" ")[0] : "HOST"}
                      </span>
                    </div>

                    {/* SUPER SEAT */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleSeatClick("super")}
                        className="relative w-22 h-22 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                      >
                        {/* Animated Tiger Crown Overlay */}
                        {superSeatUser && (superSeatUser.id === "user-current" ? loggedInUser?.hasTigerCrown : superSeatUser.hasTigerCrown) && (
                          <TigerCrown size="premium-seat" />
                        )}

                        {/* Premium pink/magenta glowing circular border */}
                        <div className="absolute inset-0 rounded-full border-3 border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.4)]" />
                        <div className="absolute -inset-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/5" />
                        
                        {/* Seat Inner Background & Avatar/Icon */}
                        <div className="w-18 h-18 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                          {superSeatUser ? (
                            <img
                              src={superSeatUser.avatar || DEFAULT_AVATARS[0]}
                              alt={superSeatUser.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : seatLocks["super"] ? (
                            <Lock className="w-6 h-6 text-fuchsia-400" />
                          ) : (
                            <div className="flex flex-col items-center text-slate-400 justify-center">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-fuchsia-400/70">
                                <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                                <path d="M5 18v2M19 18v2" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Speaking Aura or Mute indicator badge */}
                        {(superSeatUser || seatMutes["super"]) && (
                          <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                            {(superSeatUser?.isMuted || seatMutes["super"]) ? (
                              <MicOff className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                            )}
                          </div>
                        )}
                      </button>
                      <span className="text-[10px] font-black tracking-widest text-fuchsia-400 uppercase mt-2.5 leading-none">
                        {superSeatUser ? superSeatUser.name.split(" ")[0] : "SUPER"}
                      </span>
                    </div>

                  </div>

                  {/* B. Grid Section: 10 circular couch seats (arranged in 2 rows of 5, no border, no background as requested) */}
                  <div className="grid grid-cols-5 gap-y-11 gap-x-2 mt-8 px-1 py-2">
                    {gridSeatsUsers.map((user, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => handleSeatClick("grid", idx)}
                          className="relative w-18 h-18 rounded-full flex items-center justify-center bg-[#151726]/90 border border-slate-700/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                        >
                          {/* Animated Tiger Crown Overlay */}
                          {user && (user.id === "user-current" ? loggedInUser?.hasTigerCrown : user.hasTigerCrown) && (
                            <TigerCrown size="grid-seat" />
                          )}

                          {user ? (
                            <div className="w-full h-full rounded-full overflow-hidden border border-violet-500/30">
                              <img
                                src={user.avatar || DEFAULT_AVATARS[0]}
                                alt={user.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : seatLocks[`grid-${idx}`] ? (
                            <Lock className="w-5 h-5 text-violet-400" />
                          ) : (
                            /* Elegant Sofa SVG inside empty couch circle */
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-slate-500">
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
                        <span className="text-[9px] font-black text-slate-400 mt-1.5 text-center truncate max-w-[50px] leading-tight">
                          {user ? user.name.split(" ")[0] : `NO ${idx + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* 4. REAL-TIME FLOATING MESSAGE BROADCAST (Absolute overlay above bottom bar, scrollable to view full message history with smooth top fadeout) */}
              <div
                ref={chatContainerRef}
                className="absolute bottom-[80px] left-4 right-4 max-w-[290px] xs:max-w-[330px] md:max-w-[380px] flex flex-col items-start gap-1.5 pointer-events-auto overflow-y-auto max-h-[295px] z-20 select-text pr-1 scroll-smooth scrollbar-none"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none", /* Firefox */
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%)"
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
                    ...roomAlerts.filter(alert => alert.type === "chat" || alert.type === "gift" || alert.type === "announcement" || alert.type === "special-entry")
                  ].slice(-50).map((alert) => {
                    if (alert.type === "special-entry") {
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-[#1d123a]/80 border border-violet-500/30 text-white px-3 py-1.5 rounded-2xl rounded-tl-none text-[10px] font-black shadow-[0_4px_12px_rgba(139,92,246,0.3)] flex flex-wrap items-center gap-1 backdrop-blur-md self-start shrink-0"
                        >
                          {/* Render beautiful badges */}
                          {alert.badges && alert.badges.map((badge, bidx) => {
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
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-gradient-to-r from-amber-950/80 to-purple-950/85 border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-2xl rounded-tl-none text-[10px] font-black shadow-[0_4px_12px_rgba(245,158,11,0.25)] flex items-center gap-1.5 backdrop-blur-md self-start shrink-0"
                        >
                          <span className="text-pink-400 font-bold">{alert.sender}</span>
                          <span className="text-slate-300 font-medium">sent to</span>
                          <span className="text-amber-400 font-bold">{alert.receiver}</span>
                          <span className="bg-amber-500/10 border border-amber-500/30 px-1 py-0.5 rounded text-amber-300 flex items-center gap-0.5 font-bold">
                            {alert.item} <span className="text-pink-400">x{alert.count}</span>
                          </span>
                        </motion.div>
                      );
                    } else if (alert.type === "announcement") {
                      return (
                        <motion.div
                          key={alert.id}
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
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -80, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -30, y: -10, filter: "blur(2px)" }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="bg-slate-950/85 border border-purple-500/30 text-white px-4 py-2 rounded-2xl rounded-tl-none text-xs font-semibold shadow-[0_4px_15px_rgba(139,92,246,0.2)] flex items-center gap-2 backdrop-blur-md self-start shrink-0"
                        >
                          <span className="text-[#c084fc] font-black shrink-0">{alert.user}:</span>
                          <span className="text-white font-medium">{alert.text}</span>
                        </motion.div>
                      );
                    } else {
                      return (
                        <motion.div
                          key={alert.id}
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
                <div className="flex-1 min-w-[120px] max-w-[210px] xs:max-w-[260px] md:max-w-[360px] shrink">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!chatMessage.trim()) return;
                      const uName = loggedInUser ? loggedInUser.name : "Munna";
                      setRoomAlerts(prev => [
                        ...prev,
                        { id: `chat-${Date.now()}-${Math.random()}`, text: chatMessage.trim(), type: "chat", user: uName }
                      ]);
                      setChatMessage("");
                    }}
                    className="flex items-center bg-white/10 hover:bg-white/15 border border-white/15 rounded-full pl-3 pr-1 py-0.5 transition-all focus-within:border-purple-500/60 focus-within:ring-1 focus-within:ring-purple-500/20 shadow-md"
                  >
                    <input
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

                    const updatedMuted = !isMuted;
                    setIsMuted(updatedMuted);
                    triggerToast(updatedMuted ? "Your microphone is now muted." : "Your microphone is live!", "success");
                    
                    if (hostSeatUser?.id === "user-current") {
                      setHostSeatUser(prev => prev ? { ...prev, isMuted: updatedMuted } : null);
                    } else if (superSeatUser?.id === "user-current") {
                      setSuperSeatUser(prev => prev ? { ...prev, isMuted: updatedMuted } : null);
                    } else {
                      const idx = gridSeatsUsers.findIndex(u => u?.id === "user-current");
                      if (idx !== -1) {
                        setGridSeatsUsers(prev => {
                          const next = [...prev];
                          if (next[idx]) next[idx] = { ...next[idx]!, isMuted: updatedMuted };
                          return next;
                        });
                      }
                    }
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
                    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
                    const targetName = "Xzrmunna";
                    
                    triggerGiftAnimation();
                    
                    setRoomAlerts(prev => [
                      ...prev,
                      { id: `gift-${Date.now()}-${Math.random()}`, text: `${currentUserName} sent a Crown 👑 to ${targetName}!`, type: "announcement" }
                    ]);
                    triggerToast(`You sent a Royal Crown to ${targetName}! 👑💎`, "success");
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

                  {/* Translucent water-misty (জল ঝাপসা) side-swaying roses and hearts floating up */}
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
                {floatingEmojis.map((e) => (
                  <motion.div
                    key={e.id}
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

      {/* INTERACTIVE OAUTH POPUP ACCOUNT CHOOSER (Real Google/Facebook Login Simulator) */}
      <AnimatePresence>
        {showPopupOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopupOverlay(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Simulated Authenticator Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#180929] border border-violet-800/60 rounded-3xl p-6 shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1 text-pink-400 font-mono text-[9px] uppercase font-bold tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                  <span>Secure OAuth Channel</span>
                </div>
                <button
                  onClick={() => setShowPopupOverlay(false)}
                  className="p-1.5 rounded-lg bg-violet-950/40 border border-violet-800/30 hover:bg-violet-900/40 text-violet-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-lg font-black tracking-tight mb-2">
                Sign in with {authProvider === "google" ? "Google" : "Facebook"}
              </h4>
              <p className="text-xs text-violet-300 leading-relaxed mb-6">
                Choose an account from your device browser cache to securely connect to VoxaClub Party:
              </p>

              {authProvider === "google" ? (
                /* Google Accounts list */
                <div className="space-y-3">
                  <button
                    onClick={() => handleSocialSelect("Munna Hossain", "munna.vox@gmail.com", DEFAULT_AVATARS[1])}
                    className="w-full flex items-center gap-3 p-3 bg-[#231238] hover:bg-[#2e1948] rounded-2xl border border-violet-900 text-left transition-all cursor-pointer group"
                  >
                    <img
                      src={DEFAULT_AVATARS[1]}
                      alt="Munna"
                      className="w-9 h-9 rounded-full object-cover border border-violet-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors">Munna Hossain</p>
                      <p className="text-[10px] text-violet-400 truncate">munna.vox@gmail.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => handleSocialSelect("Sajid_Aman", "sajid.aman@gmail.com", DEFAULT_AVATARS[3])}
                    className="w-full flex items-center gap-3 p-3 bg-[#231238] hover:bg-[#2e1948] rounded-2xl border border-violet-900 text-left transition-all cursor-pointer group"
                  >
                    <img
                      src={DEFAULT_AVATARS[3]}
                      alt="Sajid"
                      className="w-9 h-9 rounded-full object-cover border border-violet-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors">Sajid Aman</p>
                      <p className="text-[10px] text-violet-400 truncate">sajid.aman@gmail.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => {
                      const customName = prompt("Enter custom Google Account Name:");
                      if (customName) {
                        handleSocialSelect(customName, `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`, DEFAULT_AVATARS[0]);
                      }
                    }}
                    className="w-full flex items-center justify-center p-3.5 bg-violet-950/20 hover:bg-violet-900/30 border border-dashed border-violet-800 rounded-2xl text-xs font-bold text-violet-400 transition-all cursor-pointer"
                  >
                    + Use another Google account
                  </button>
                </div>
              ) : (
                /* Facebook Accounts list */
                <div className="space-y-3">
                  <button
                    onClick={() => handleSocialSelect("Munna Hossain", "fb-munna-99@facebook.com", DEFAULT_AVATARS[1])}
                    className="w-full flex items-center gap-3 p-3 bg-[#231238] hover:bg-[#2e1948] rounded-2xl border border-violet-900 text-left transition-all cursor-pointer group"
                  >
                    <img
                      src={DEFAULT_AVATARS[1]}
                      alt="Munna"
                      className="w-9 h-9 rounded-full object-cover border border-violet-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors">Munna Hossain (FB)</p>
                      <p className="text-[10px] text-violet-400 truncate">Connected via Facebook</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-violet-500 shrink-0" />
                  </button>

                  <button
                    onClick={() => {
                      const customName = prompt("Enter your Facebook Name:");
                      if (customName) {
                        handleSocialSelect(customName, `fb-${customName.toLowerCase().replace(/\s+/g, '')}@facebook.com`, DEFAULT_AVATARS[4]);
                      }
                    }}
                    className="w-full flex items-center justify-center p-3.5 bg-violet-950/20 hover:bg-violet-900/30 border border-dashed border-violet-800 rounded-2xl text-xs font-bold text-violet-400 transition-all cursor-pointer"
                  >
                    + Log in to another Facebook account
                  </button>
                </div>
              )}

              <p className="text-[9px] text-center text-violet-400/40 font-mono mt-6 select-none">
                OAuth authentication services verified by Google Cloud Security Node
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING EMOJIS LAYER */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
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
                অভিনন্দন! আপনার প্রোফাইলে সফলভাবে বাঘের রাজমুকুটটি সেট করা হয়েছে। এখন ব্রডকাস্টের কোন সিটে বা রুমে জয়েন করলে আপনার মাথায় মুকুটটি আকর্ষণীয়ভাবে নড়াচড়া করবে! 🐯✨
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
                অভিনন্দন! আপনার প্রোফাইলে সফলভাবে VIP {unlockedLevel} সুবিধাগুলো চালু করা হয়েছে। এখন আপনার নামের পাশে সোনালী ভিআইপি লোগো, গর্জিয়াস এন্ট্রি অ্যানিমেশন এবং একচেটিয়া চ্যাট বাবল অ্যাক্টিভ হয়ে গিয়েছে! 👑🏆✨
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

              <div className="text-center space-y-1 mt-2">
                <h3 className="text-lg font-black text-amber-400 tracking-wider uppercase">
                  Premium Wallet Top-Up
                </h3>
                <p className="text-[11px] text-violet-300 font-bold uppercase tracking-widest">
                  Secure Billing Gateway
                </p>
              </div>

              {/* Package selector */}
              <div className="mt-5 space-y-2">
                <label className="text-[11px] font-black text-amber-400/80 uppercase tracking-widest block">
                  Step 1: Select Gold Coin Package
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { coins: 10000, price: 100, label: "Starter Pack" },
                    { coins: 50000, price: 500, label: "Popular Box" },
                    { coins: 100000, price: 1000, label: "Super Value" },
                    { coins: 500000, price: 5000, label: "Elite Bundle" },
                    { coins: 1000000, price: 10000, label: "Royal Fortune" },
                    { coins: 2500000, price: 25000, label: "Vip Special" }
                  ].map((pkg) => (
                    <button
                      key={pkg.coins}
                      type="button"
                      onClick={() => setRechargeAmount(pkg.coins)}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer active:scale-98 ${
                        rechargeAmount === pkg.coins
                          ? "bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <span className="block text-[9px] font-extrabold text-violet-400 uppercase tracking-wider">
                          {pkg.label}
                        </span>
                        <span className="block text-sm font-black text-white mt-0.5">
                          🪙 {pkg.coins.toLocaleString()}
                        </span>
                      </div>
                      <span className="block text-xs font-black text-amber-400 mt-2">
                        ৳{pkg.price} BDT
                      </span>
                      {rechargeAmount === pkg.coins && (
                        <span className="absolute top-2 right-2 text-amber-400 text-[10px]">●</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-5 space-y-2">
                <label className="text-[11px] font-black text-amber-400/80 uppercase tracking-widest block">
                  Step 2: Choose Payment Operator
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "bkash", name: "bKash", color: "bg-[#e2125e]" },
                    { id: "nagad", name: "Nagad", color: "bg-[#f25c22]" },
                    { id: "rocket", name: "Rocket", color: "bg-[#8c3494]" },
                    { id: "card", name: "Card", color: "bg-[#0f172a]" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setRechargeMethod(method.id as any)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase text-center transition-all cursor-pointer border ${
                        rechargeMethod === method.id
                          ? "border-white bg-white/15 shadow-sm scale-105"
                          : "border-white/5 bg-white/5 hover:bg-white/10 opacity-70"
                      }`}
                    >
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1 ${method.color}`} />
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions banner */}
              <div className="mt-4.5 bg-white/5 border border-white/10 rounded-2xl p-3 text-slate-300 text-[10px] space-y-1.5 leading-relaxed font-semibold">
                <div className="flex justify-between text-amber-300 font-extrabold">
                  <span>Merchant No (Cash Out):</span>
                  <span>+880 1755-974332</span>
                </div>
                <p>
                  ১. প্রথমে আপনার বিকাশ/নগদ অ্যাপ থেকে উপরে উল্লেখিত মার্চেন্ট নাম্বারে <span className="text-amber-400 font-extrabold">৳{(rechargeAmount / 100).toLocaleString()} BDT</span> ক্যাশ আউট করুন।
                </p>
                <p>
                  ২. ক্যাশ আউট সফল হলে আপনার বিকাশ/নগদ এর ট্রানজেকশন আইডি (TxnID) এবং আপনার মোবাইল নাম্বারটি নিচে ইনপুট করে ভেরিফাই করুন।
                </p>
              </div>

              {/* Form submit */}
              <form onSubmit={handleRechargeCoins} className="mt-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black text-violet-300 uppercase block mb-1 tracking-wider">
                      Your Payer Mobile Number (bKash/Nagad/Rocket)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +88017XXXXXXXX"
                      value={rechargePayerPhone}
                      onChange={(e) => setRechargePayerPhone(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-violet-300 uppercase block mb-1 tracking-wider">
                      Verified Transaction ID (Txn ID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BZK92K90A8L"
                      value={rechargeTxnId}
                      onChange={(e) => setRechargeTxnId(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-bold font-mono"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 p-[2px] rounded-2xl shadow-lg mt-5">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-800 hover:brightness-110 active:scale-[0.98] transition-all text-black font-black text-xs uppercase tracking-widest cursor-pointer text-center block"
                  >
                    Verify Payment & Credit Coins 🪙
                  </button>
                </div>
              </form>
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
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=400"
                    alt="Room Group Cover"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Soft white fade gradient overlay exactly matching screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                  
                  {/* Dynamic Title, ID and Category tags overlaid on image bottom (as seen in Screenshot 3) */}
                  <div className="absolute bottom-4 left-6 right-6 text-slate-900 select-none">
                    <h2 className="text-xl font-black tracking-tight leading-tight flex items-center gap-1.5 drop-shadow-sm text-slate-900">
                      <span>🖤BABA❤️.ji🖤.ᔕ.RUM🖤</span>
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1.5">
                      <span>Room ID: 24708556</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText("24708556");
                          triggerToast("Room ID copied to clipboard!", "success");
                        }}
                        className="p-1 rounded bg-slate-100/80 hover:bg-slate-200 text-slate-400 hover:text-slate-600 active:scale-95 transition-all cursor-pointer"
                        title="Copy ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-amber-500 text-amber-950 text-[10px] font-black rounded-full shadow-sm">
                        🤗 Friend
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main details content with standard horizontal padding */}
                <div className="px-6 space-y-5">
                  
                  {/* 3. PEACH THEME REAL-TIME EXPERIENCE LEVEL CARD */}
                  <div className="bg-[#fff4eb] border border-[#ffeedf] rounded-2xl px-5 py-4 flex justify-between items-center shadow-sm select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center select-none shrink-0">
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center border border-white/40">
                          <span className="text-base">⭐</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-base font-black text-[#8c5333] tracking-tight">
                          LV.2
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black text-[#8c5333]">
                        Today's EXP: <span className="font-mono text-orange-600 font-black text-sm">182037</span>
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
                      {[
                        { id: "m-owner", name: "Owner", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-amber-500 text-white" },
                        { id: "m-admin-1", name: "Admin", avatar: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" },
                        { id: "m-admin-2", name: "Admin", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" },
                        { id: "m-admin-3", name: "Admin", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" },
                        { id: "m-admin-4", name: "Admin", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" },
                        { id: "m-admin-5", name: "Admin", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" },
                        { id: "m-admin-6", name: "Admin", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120&h=120", badgeStyle: "bg-cyan-500 text-white" }
                      ].map((m) => (
                        <div key={m.id} className="flex flex-col items-center shrink-0 w-14 select-none">
                          <div className="relative">
                            <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-violet-500 to-pink-500 shadow-sm">
                              <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-full h-full object-cover rounded-full border-2 border-white"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md mt-2 uppercase tracking-wider leading-none select-none text-center ${m.badgeStyle}`}>
                            {m.name}
                          </span>
                        </div>
                      ))}
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
                      {[
                        ...(isFollowingRoom ? [{ type: "image", src: loggedInUser?.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120&h=120", text: "", color: "" }] : []),
                        { type: "initial", text: "S", color: "bg-fuchsia-500 text-white", src: "" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=120&h=120" },
                        { type: "image", text: "", color: "", src: "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&q=80&w=120&h=120" }
                      ].map((item, i) => (
                        <div key={i} className="shrink-0 select-none">
                          {item.type === "initial" ? (
                            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs select-none border border-white shadow-sm">
                              {item.text}
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                              <img
                                src={item.src}
                                alt="Follower"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. DESCRIPTION BOX */}
                  <div className="space-y-1.5 select-none pb-2">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Room Description
                    </h3>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      Come check out my room!
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Action Sheet Button exactly matching screenshot */}
              <div className="p-5 bg-white border-t border-slate-100 mt-auto shrink-0 select-none">
                <button
                  onClick={() => {
                    if (isFollowingRoom) {
                      setIsFollowingRoom(false);
                      setRoomFollowersCount(prev => Math.max(106, prev - 1));
                      triggerToast("You unfollowed this live room.", "success");
                    } else {
                      setIsFollowingRoom(true);
                      setRoomFollowersCount(prev => prev + 1);
                      triggerToast("Successfully following this live room & group! 💖", "success");
                    }
                    setShowRoomDetailsSheet(false);
                  }}
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
                
                {/* THREE ACTIONS HORIZONTAL ROW */}
                <div className="grid grid-cols-3 gap-1 text-center mb-6">
                  {/* Customer Service Column */}
                  <button
                    onClick={() => {
                      triggerToast("Connecting to live billing & stream support... 📞", "success");
                      setShowBroadcastDrawer(false);
                    }}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/90 group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <Headphones className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-extrabold tracking-wide leading-tight">
                      Customer Service
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
                    <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/90 group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <Minimize2 className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-extrabold tracking-wide leading-tight">
                      Minimize
                    </span>
                  </button>

                  {/* Exit room Column */}
                  <button
                    onClick={() => {
                      setCurrentStep("lobby");
                      setActiveRoom(null);
                      setMinimizedRoom(null);
                      setRoomTheme("normal"); // Reset theme
                      triggerToast("You stopped the broadcast & left room", "success");
                      setShowBroadcastDrawer(false);
                    }}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/90 group-hover:bg-white/[0.1] group-hover:scale-105 transition-all mb-1.5 shadow-sm">
                      <Power className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-extrabold tracking-wide leading-tight">
                      Exit room
                    </span>
                  </button>
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
                    ID:{minimizedRoom.id?.replace("room-custom-", "").slice(0, 8)}
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
        {showSeatActionsModal && activeSeatConfig && (
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
              className="relative z-10 w-full max-w-md mx-auto mb-3 bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col text-slate-800 min-h-[180px]"
            >
              {/* Semi-transparent watermark background text 'ONER' (from Screenshot 1) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <span className="text-[72px] font-black tracking-[18px] text-slate-100/70 uppercase font-sans">
                  ONER
                </span>
              </div>

              {isInvitingInSeatActions ? (
                // Real-time Invite Sub-view inside same drawer to avoid flashing
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
                      <div key={member.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all">
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
                              volume: 100
                            };

                            if (activeSeatConfig.seatType === "host") {
                              setHostSeatUser(participant);
                            } else if (activeSeatConfig.seatType === "super") {
                              setSuperSeatUser(participant);
                            } else if (activeSeatConfig.seatType === "grid" && activeSeatConfig.gridIndex !== undefined) {
                              setGridSeatsUsers(prev => {
                                const next = [...prev];
                                next[activeSeatConfig.gridIndex!] = participant;
                                return next;
                              });
                            }
                            
                            setShowSeatActionsModal(false);
                            setIsInvitingInSeatActions(false);
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
                // Actions Menu options (on top of watermark)
                <div className="relative z-10 flex flex-col text-center divide-y divide-slate-100 font-medium">
                  {testRoomRole === "admin" ? (
                    <>
                      <button
                        onClick={() => {
                          setIsInvitingInSeatActions(true);
                        }}
                        className="w-full py-4 text-sm font-bold text-slate-800 active:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Invite him/her to the seat
                      </button>
                      
                      <button
                        onClick={() => {
                          const key = getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                          const targetMute = !seatMutes[key];
                          setSeatMutes(prev => ({ ...prev, [key]: targetMute }));
                          
                          // Update active seat user's mute state
                          if (activeSeatConfig.seatType === "host") {
                            setHostSeatUser(prev => prev ? { ...prev, isMuted: targetMute } : null);
                          } else if (activeSeatConfig.seatType === "super") {
                            setSuperSeatUser(prev => prev ? { ...prev, isMuted: targetMute } : null);
                          } else {
                            setGridSeatsUsers(prev => {
                              const next = [...prev];
                              const idx = activeSeatConfig.gridIndex!;
                              if (next[idx]) next[idx] = { ...next[idx]!, isMuted: targetMute };
                              return next;
                            });
                          }

                          // If it is the current user being muted
                          const currentUserSeatKey = hostSeatUser?.id === "user-current" ? "host" : (superSeatUser?.id === "user-current" ? "super" : `grid-${gridSeatsUsers.findIndex(u => u?.id === "user-current")}`);
                          if (currentUserSeatKey === key && targetMute) {
                            setIsMuted(true);
                          }

                          setShowSeatActionsModal(false);
                        }}
                        className="w-full py-4 text-sm font-bold text-slate-800 active:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {seatMutes[getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex)] ? "Unmute this seat" : "Mute this seat"}
                      </button>

                      <button
                        onClick={() => {
                          const key = getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                          const targetLock = !seatLocks[key];
                          setSeatLocks(prev => ({ ...prev, [key]: targetLock }));
                          setShowSeatActionsModal(false);
                        }}
                        className="w-full py-4 text-sm font-bold text-slate-800 active:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {seatLocks[getSeatKey(activeSeatConfig.seatType, activeSeatConfig.gridIndex)] ? "Unlock this seat" : "Lock this seat"}
                      </button>

                      <button
                        onClick={() => {
                          executeSeatMovement(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                          setShowSeatActionsModal(false);
                        }}
                        className="w-full py-4 text-sm font-bold text-slate-800 active:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {((activeSeatConfig.seatType === "host" && hostSeatUser?.id === "user-current") ||
                          (activeSeatConfig.seatType === "super" && superSeatUser?.id === "user-current") ||
                          (activeSeatConfig.seatType === "grid" && activeSeatConfig.gridIndex !== undefined && gridSeatsUsers[activeSeatConfig.gridIndex]?.id === "user-current")) 
                            ? "Stand up from this seat" 
                            : "Move to this seat"}
                      </button>
                    </>
                  ) : (
                    // Regular User Mode: Just "Move to this seat"
                    <button
                      onClick={() => {
                        executeSeatMovement(activeSeatConfig.seatType, activeSeatConfig.gridIndex);
                        setShowSeatActionsModal(false);
                      }}
                      className="w-full py-4 text-sm font-bold text-slate-800 active:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {((activeSeatConfig.seatType === "host" && hostSeatUser?.id === "user-current") ||
                        (activeSeatConfig.seatType === "super" && superSeatUser?.id === "user-current") ||
                        (activeSeatConfig.seatType === "grid" && activeSeatConfig.gridIndex !== undefined && gridSeatsUsers[activeSeatConfig.gridIndex]?.id === "user-current")) 
                          ? "Stand up from this seat" 
                          : "Move to this seat"}
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
        )}
      </AnimatePresence>

    </div>
  );
}
