/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Users,
  MessageSquare,
  X,
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
  Gift
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
}

// Live Chat Message interface
interface ChatMessage {
  id: string;
  user: string;
  role: string;
  text: string;
  timestamp: string;
}

// Local Database structure for mock registered users
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  authProvider: "phone" | "google" | "facebook";
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
    id: "room-1",
    title: "Alex 🅰 nika||❣",
    subtitle: "Come check out my room!",
    hostName: "Alex Anika",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇮🇳",
    categoryTag: "Music",
    categoryColor: "bg-[#7c3aed]", // Violet
    popularity: 3120,
    userCount: 2
  },
  {
    id: "room-2",
    title: "BD 🅰nd c🅾in seller 🌬️",
    subtitle: "এখানে নগদ টাকায় ডলার কেনা হয়. আ...",
    hostName: "Coin Master",
    avatar: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇧🇩",
    categoryTag: "Girl",
    categoryColor: "bg-[#ec4899]", // Pink
    popularity: 1072113,
    userCount: 12,
    hasChest: true
  },
  {
    id: "room-3",
    title: "YarO kI meHFiL",
    subtitle: "matlab ki duniya...",
    hostName: "YarO Host",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    countryFlag: "🇮🇳",
    categoryTag: "Friend",
    categoryColor: "bg-[#f59e0b]", // Amber
    popularity: 3880,
    userCount: 1
  },
  {
    id: "room-4",
    title: "Naina 👉 agency...",
    subtitle: "no 👉👈 agency 👉 rum niu...",
    hostName: "Naina",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    countryFlag: "🇮🇳",
    categoryTag: "Friend",
    categoryColor: "bg-[#f59e0b]",
    popularity: 2200,
    userCount: 1
  },
  {
    id: "room-5",
    title: "— TøXiC 🍂",
    subtitle: "🌸 WELCOME ♡ (•‿•)",
    hostName: "Toxic",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200",
    hasVipFrame: true,
    countryFlag: "🇮🇳",
    categoryTag: "Love",
    categoryColor: "bg-[#ef4444]", // Red
    popularity: 2200,
    userCount: 1
  },
  {
    id: "room-6",
    title: "★ 彡[BABA RAM RAH...",
    subtitle: "aaj ki most welcome ji jan se sab...",
    hostName: "Baba Ram",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    countryFlag: "🇮🇳",
    categoryTag: "Friend",
    categoryColor: "bg-[#f59e0b]",
    popularity: 2200,
    userCount: 1
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

export default function App() {
  // Navigation & Step Management
  const [currentStep, setCurrentStep] = useState<"loading" | "login" | "phone-otp" | "register" | "lobby" | "room">("loading");
  
  // Lobby state managers (Screenshot 3)
  const [lobbyRooms, setLobbyRooms] = useState<LobbyRoom[]>(() => {
    const stored = localStorage.getItem("voxaclub_lobby_rooms");
    return stored ? JSON.parse(stored) : INITIAL_LOBBY_ROOMS;
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

  // Daily Sign-In Check-In Calendar state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkedInDays, setCheckedInDays] = useState<number[]>(() => {
    const stored = localStorage.getItem("voxaclub_checked_in_days");
    return stored ? JSON.parse(stored) : [];
  });
  const [userCoins, setUserCoins] = useState(() => {
    const stored = localStorage.getItem("voxaclub_user_coins");
    return stored ? Number(stored) : 1500;
  });

  // Sync lobbyRooms, checkedInDays, userCoins to localStorage
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
  const [loggedInUser, setLoggedInUser] = useState<UserProfile | null>(null);

  // Auto pre-fill the Room title when modal opens
  useEffect(() => {
    if (showCreateRoomModal) {
      const username = loggedInUser ? loggedInUser.name : "Xzrmunna";
      setNewRoomTitle(`${username}  's room`);
    }
  }, [showCreateRoomModal, loggedInUser]);

  // Toast / System Notification HUD
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "otp" } | null>(null);

  // Phone Login States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);

  // Profile Registration States
  const [regUsername, setRegUsername] = useState("");
  const [regAvatar, setRegAvatar] = useState(DEFAULT_AVATARS[0]);

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

  // Premium Live Voice Room seats states (Screenshot 4)
  const [hostSeatUser, setHostSeatUser] = useState<Participant | null>(null);
  const [superSeatUser, setSuperSeatUser] = useState<Participant | null>(null);
  const [gridSeatsUsers, setGridSeatsUsers] = useState<(Participant | null)[]>(() => Array(10).fill(null));
  const [roomAlerts, setRoomAlerts] = useState<{ id: string; text: string; type: "join" | "announcement" | "chat"; user?: string }[]>([]);

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);

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
      // First-time user, route to registration profile editor
      setCurrentStep("register");
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
      setCurrentStep("register");
    }
  };

  // Completes first-time profile creation and persists in database
  const handleRegisterProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim()) {
      triggerToast("Please choose a beautiful name.", "error");
      return;
    }

    const newUser: UserProfile = {
      id: "user-" + Date.now(),
      name: regUsername.trim(),
      avatar: regAvatar,
      phone: authProvider === "phone" ? phoneNumber : undefined,
      email: authProvider !== "phone" ? `user-${Date.now()}@voxaclub.com` : undefined,
      authProvider: authProvider || "phone"
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

    triggerToast("Your premium voice profile was created!", "success");
    setCurrentStep("lobby");
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
    const currentUserAvatar = loggedInUser ? loggedInUser.avatar : DEFAULT_AVATARS[0];
    
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

  // Seat interaction helper (Screenshot 4)
  const handleSeatClick = (seatType: "host" | "super" | "grid", gridIndex?: number) => {
    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = loggedInUser ? loggedInUser.avatar : DEFAULT_AVATARS[0];

    // Build the current user's participant object
    const meParticipant: Participant = {
      id: "user-current",
      name: `${currentUserName} (You)`,
      role: seatType === "host" ? "Host" : seatType === "super" ? "Co-Host" : "Speaker",
      avatar: currentUserAvatar,
      isMuted: isMuted,
      isSpeaking: !isMuted,
      volume: 100
    };

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
      triggerToast("You stood up and became a listener.", "success");
      setRoomAlerts(prev => [
        ...prev,
        { id: `leave-${Date.now()}`, text: `${currentUserName} stood up from seat.`, type: "join" }
      ]);
      return;
    }

    // If clicking an occupied seat, notify
    const targetUser = seatType === "host" ? hostSeatUser : seatType === "super" ? superSeatUser : gridSeatsUsers[gridIndex!];
    if (targetUser) {
      triggerToast(`👤 ${targetUser.name} is seated here!`, "success");
      return;
    }

    // Move or sit down
    if (isAlreadySeated) {
      vacateOldSeat();
    }

    if (seatType === "host") {
      setHostSeatUser(meParticipant);
      triggerToast("You took the HOST seat! 👑", "success");
    } else if (seatType === "super") {
      setSuperSeatUser(meParticipant);
      triggerToast("You took the SUPER seat! 🌟", "success");
    } else if (seatType === "grid" && gridIndex !== undefined) {
      setGridSeatsUsers(prev => {
        const next = [...prev];
        next[gridIndex] = meParticipant;
        return next;
      });
      triggerToast(`You took seat NO ${gridIndex + 1}! 🎙️`, "success");
    }

    setRoomAlerts(prev => [
      ...prev,
      { id: `sit-${Date.now()}`, text: `${currentUserName} sat on seat.`, type: "join" }
    ]);
  };

  // Handle Room Creation (no demo - real dynamic room is appended to the lobby list)
  const handleCreateRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle.trim()) {
      triggerToast("Please choose a beautiful room name.", "error");
      return;
    }

    const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
    const currentUserAvatar = loggedInUser ? loggedInUser.avatar : DEFAULT_AVATARS[0];

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
    <div className="relative min-h-screen bg-[#0d0614] text-[#f1f1f1] flex flex-col items-center justify-between font-sans overflow-hidden">
      
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
                    src="/src/assets/images/voxaclub_logo_1784157398686.jpg"
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
                src="/src/assets/images/login_bg_1784157824235.jpg"
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
                    src="/src/assets/images/voxaclub_login_logo_1784157809686.jpg"
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
           4. CHOOSE USERNAME & AVATAR PROFILE SCREEN
           ========================================== */}
        {currentStep === "register" && (
          <motion.div
            key="register-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col justify-between py-12 px-6 z-10"
          >
            <div className="w-full text-center mt-2 select-none">
              <span className="text-[10px] font-mono tracking-[0.2em] px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 uppercase font-bold">
                Profile Registration
              </span>
            </div>

            <div className="w-full bg-[#150a22]/90 backdrop-blur-md rounded-3xl border border-[#2d1b42]/80 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-auto">
              <h3 className="text-2xl font-black text-center tracking-tight mb-2">Create Your Profile</h3>
              <p className="text-xs text-violet-400 text-center leading-relaxed mb-6">
                Choose an elegant display username and a premium avatar card to enter the lounge!
              </p>

              <form onSubmit={handleRegisterProfile} className="space-y-6">
                
                {/* Username input */}
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-violet-400 uppercase font-bold mb-2">
                    Display Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. Munna_X, RoxStar"
                      maxLength={18}
                      className="w-full bg-[#1c0f2d] border border-violet-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                </div>

                {/* Avatar Gallery */}
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-violet-400 uppercase font-bold mb-3">
                    Select Voice Avatar
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {DEFAULT_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRegAvatar(avatar)}
                        className={`relative rounded-2xl overflow-hidden p-0.5 border cursor-pointer transition-all ${
                          regAvatar === avatar
                            ? "border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-102"
                            : "border-violet-950/70 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={`Avatar option ${idx + 1}`}
                          className="w-full h-16 md:h-20 object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                        {regAvatar === avatar && (
                          <div className="absolute top-1 right-1 bg-pink-500 rounded-full p-0.5 border border-white">
                            <span className="block w-2 h-2 rounded-full bg-white scale-80" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_6px_20px_rgba(236,72,153,0.35)] cursor-pointer"
                >
                  Confirm & Join VoxaClub Live
                </button>

              </form>
            </div>

            <div className="text-center h-4 select-none" />
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
            className="relative w-full max-w-lg mx-auto flex-1 flex flex-col bg-[#f2f0f7] text-[#2c1a4d] overflow-hidden h-screen max-h-screen shadow-[0_25px_60px_rgba(0,0,0,0.4)] border-x border-violet-200/50 pb-20 z-10"
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
                                      src={room.avatar}
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
                                      src={room.avatar}
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
                    <span className="text-[10px] font-mono text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full font-bold">VIP SOCIAL</span>
                  </div>

                  {/* Sample post 1 */}
                  <div className="bg-white rounded-3xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-violet-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={DEFAULT_AVATARS[1]} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-xs font-black">Alex Anika</h4>
                        <p className="text-[9px] text-violet-400 font-mono">2 hours ago • India</p>
                      </div>
                    </div>
                    <p className="text-xs text-violet-900 leading-relaxed">
                      Just hosted a dynamic DJ set in Room #1! Shoutout to everyone who supported with coins and crowns today! Bangladesh friends were incredible! 🇧🇩❤️
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-violet-50 text-violet-500">
                      <button
                        onClick={() => triggerToast("You loved this moment!", "success")}
                        className="flex items-center gap-1 hover:text-rose-500 active:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span>142</span>
                      </button>
                      <button
                        onClick={() => triggerToast("Comments disabled on premium announcements.", "error")}
                        className="flex items-center gap-1 hover:text-pink-500 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>32 Comments</span>
                      </button>
                    </div>
                  </div>

                  {/* Sample post 2 */}
                  <div className="bg-white rounded-3xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-violet-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={DEFAULT_AVATARS[4]} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <h4 className="text-xs font-black">Naina Agency</h4>
                        <p className="text-[9px] text-violet-400 font-mono">5 hours ago • India</p>
                      </div>
                    </div>
                    <p className="text-xs text-violet-900 leading-relaxed">
                      Recruiting premium broadcasters for the voice agency loop! Earn passive rewards, cash out instantly. Join room or DM for secret agency code! 💎🎙️
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-violet-50 text-violet-500">
                      <button
                        onClick={() => triggerToast("You loved this moment!", "success")}
                        className="flex items-center gap-1 hover:text-rose-500 active:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className="w-4 h-4" />
                        <span>89</span>
                      </button>
                      <button
                        onClick={() => triggerToast("Comments are disabled", "error")}
                        className="flex items-center gap-1 hover:text-pink-500 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>12 Comments</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SOCIAL SYSTEM INBOX */}
              {activeBottomTab === "social" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-violet-200 pb-2">
                    <h3 className="text-base font-black tracking-tight text-[#1e0d3d]">Active Inbox</h3>
                    <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-extrabold animate-pulse">8 Alerts</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: "Alex Anika", text: "Hey! Loved your audio level quality. Let's do co-host!", time: "4:32 PM", unread: true },
                      { name: "BD Coin Support", text: "Deposit confirmation of 1,500 Gold Coins was successfully verified.", time: "1:15 PM", unread: false },
                      { name: "Naina", text: "Check inbox agency contract code.", time: "Yesterday", unread: false },
                      { name: "System Admin", text: "Welcome to VoxaClub Party! Enjoy safe community rules.", time: "2 days ago", unread: false }
                    ].map((chat, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerToast(`Private message chat from ${chat.name} opened!`, "success")}
                        className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-violet-50/50 rounded-2xl border border-violet-100 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img src={DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length]} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <h4 className="text-xs font-black flex items-center gap-1.5">
                              <span>{chat.name}</span>
                              {chat.unread && <span className="block w-2 h-2 rounded-full bg-pink-500 animate-ping" />}
                            </h4>
                            <p className="text-[11px] text-violet-400 truncate max-w-[200px] mt-0.5">{chat.text}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-violet-400">{chat.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PERSONAL DASHBOARD MINE */}
              {activeBottomTab === "mine" && (
                <div className="space-y-4">
                  
                  {/* Premium Profile Banner Card */}
                  <div className="bg-gradient-to-tr from-violet-900 to-indigo-950 text-white p-5 rounded-3xl border border-violet-800 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-yellow-300 to-amber-500 shadow-lg flex-shrink-0">
                        <img
                          src={loggedInUser ? loggedInUser.avatar : DEFAULT_AVATARS[0]}
                          alt="My avatar"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-black tracking-tight">{loggedInUser ? loggedInUser.name : "Munna Hossain"}</h3>
                        <p className="text-[10px] font-mono text-yellow-300 flex items-center gap-1 mt-0.5">
                          <Crown className="w-3.5 h-3.5" />
                          <span>VIP Tier level: 9 Elite</span>
                        </p>
                        <p className="text-[10px] text-violet-300 font-mono mt-0.5">
                          UID: {loggedInUser ? loggedInUser.id : "user-1784920"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-violet-800/40 text-center">
                      <div className="bg-black/20 p-2.5 rounded-2xl">
                        <span className="block text-[9px] font-mono text-violet-400 uppercase tracking-wider">My Coin Wallet</span>
                        <span className="text-sm font-black text-yellow-400 mt-1 block">💰 {userCoins.toLocaleString()}</span>
                      </div>
                      <div className="bg-black/20 p-2.5 rounded-2xl">
                        <span className="block text-[9px] font-mono text-violet-400 uppercase tracking-wider">Created Rooms</span>
                        <span className="text-sm font-black text-pink-400 mt-1 block">
                          🎙️ {lobbyRooms.filter((r) => r.hostName === (loggedInUser?.name || "Munna")).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account options */}
                  <div className="bg-white rounded-3xl border border-violet-100 overflow-hidden">
                    <button
                      onClick={() => setShowCheckInModal(true)}
                      className="w-full flex items-center justify-between p-4 hover:bg-violet-50/50 border-b border-violet-50 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-xl text-pink-500">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">Daily Reward Calendar</span>
                      </div>
                      <span className="text-[10px] font-mono text-pink-500 font-bold bg-pink-50 px-2 py-0.5 rounded-full">CLAIM REWARDS</span>
                    </button>

                    <button
                      onClick={() => triggerToast("Premium ID privileges activated! Enjoy VIP badges.", "success")}
                      className="w-full flex items-center justify-between p-4 hover:bg-violet-50/50 border-b border-violet-50 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">My VIP Privileges</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-violet-300" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 hover:bg-rose-50 text-rose-600 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 rounded-xl">
                          <X className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">Sign Out Session</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-300" />
                    </button>
                  </div>

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

            {/* 5. BOTTOM NAVIGATION BAR (Matches Screenshot 3) */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-violet-100/80 px-4 flex items-center justify-around z-40 select-none">
              
              {/* Home Tab */}
              <button
                onClick={() => setActiveBottomTab("home")}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer group"
              >
                {activeBottomTab === "home" ? (
                  /* Glowing gold gradient house bubble matching bottom icon */
                  <div className="p-2 bg-gradient-to-tr from-[#ffe646] to-[#eab308] rounded-2xl text-[#3f2b05] shadow-[0_4px_12px_rgba(234,179,8,0.3)]">
                    <Home className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <Home className="w-5 h-5 text-violet-400 group-hover:text-violet-600 transition-colors" />
                )}
                <span className={`text-[10px] font-black tracking-wide ${activeBottomTab === "home" ? "text-amber-600" : "text-violet-400"}`}>
                  Home
                </span>
              </button>

              {/* Moment Tab */}
              <button
                onClick={() => {
                  setActiveBottomTab("moment");
                  triggerToast("Exploring active community timelines...", "success");
                }}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer group"
              >
                {activeBottomTab === "moment" ? (
                  <div className="p-2 bg-gradient-to-tr from-pink-500 to-fuchsia-600 rounded-2xl text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)]">
                    <Compass className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <Compass className="w-5 h-5 text-violet-400 group-hover:text-violet-600 transition-colors" />
                )}
                <span className={`text-[10px] font-black tracking-wide ${activeBottomTab === "moment" ? "text-pink-600" : "text-violet-400"}`}>
                  Moment
                </span>
              </button>

              {/* Social Tab with badge "8" unread notifications */}
              <button
                onClick={() => setActiveBottomTab("social")}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer group relative"
              >
                {activeBottomTab === "social" ? (
                  <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
                    <MessageSquare className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="relative">
                    <MessageSquare className="w-5 h-5 text-violet-400 group-hover:text-violet-600 transition-colors" />
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full border border-white">
                      8
                    </span>
                  </div>
                )}
                <span className={`text-[10px] font-black tracking-wide ${activeBottomTab === "social" ? "text-indigo-600" : "text-violet-400"}`}>
                  Social
                </span>
              </button>

              {/* Mine Profile Tab with red dot notification badge */}
              <button
                onClick={() => setActiveBottomTab("mine")}
                className="flex flex-col items-center justify-center gap-1 cursor-pointer group relative"
              >
                {activeBottomTab === "mine" ? (
                  <div className="p-2 bg-gradient-to-tr from-violet-700 to-slate-900 rounded-2xl text-white shadow-[0_4px_12px_rgba(109,40,217,0.3)]">
                    <User className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="relative">
                    <User className="w-5 h-5 text-violet-400 group-hover:text-violet-600 transition-colors" />
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-white" />
                  </div>
                )}
                <span className={`text-[10px] font-black tracking-wide ${activeBottomTab === "mine" ? "text-violet-800" : "text-violet-400"}`}>
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
                        {newRoomPhoto ? (
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
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1 pr-3 py-1 backdrop-blur-md max-w-[210px] sm:max-w-xs shrink-0 shadow-lg">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/40 border border-white/20 overflow-hidden flex items-center justify-center font-black text-sm text-white shrink-0">
                    <img
                      src={activeRoom?.avatar || DEFAULT_AVATARS[0]}
                      alt="Host Avatar"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-black text-white truncate tracking-wide leading-tight">
                      {activeRoom?.title || "My Premium Lounge"}
                    </h4>
                    <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                      ID: {activeRoom?.id ? activeRoom.id.replace("room-", "") : "4032271"}
                    </span>
                  </div>
                  <div className="flex items-center text-[9px] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-amber-950 font-black px-1.5 py-0.5 rounded ml-1 scale-90 origin-left shrink-0 shadow-sm uppercase">
                    Normal <span className="text-[7px] ml-0.5">▼</span>
                  </div>
                </div>

                {/* Right Side: Action Icons (Music, Tasks/Calendar, Exit) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      triggerToast("Ambient live audio feed synchronized! 🎶", "success");
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-md"
                    title="Audio Sync"
                  >
                    <Music className="w-4 h-4 text-slate-200" />
                  </button>
                  <button
                    onClick={() => {
                      setShowCheckInModal(true);
                      triggerToast("Opened Daily Sign-in Tasks", "success");
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-md"
                    title="Daily Tasks"
                  >
                    <Calendar className="w-4 h-4 text-slate-200" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep("lobby");
                      setActiveRoom(null);
                      triggerToast("You left the live room", "success");
                    }}
                    className="w-9 h-9 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 cursor-pointer hover:bg-red-500/25 active:scale-95 transition-all shadow-md"
                    title="Exit Live"
                  >
                    <X className="w-4 h-4" />
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
              <div className="flex-1 flex flex-col justify-start gap-5 my-4 overflow-y-auto px-1 select-none">
                
                {/* A. Top Section: 2 premium seats (Host, Super) */}
                <div className="flex items-center justify-center gap-16 mt-3">
                  
                  {/* HOST SEAT */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleSeatClick("host")}
                      className="relative w-22 h-22 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      {/* Premium gold glowing circular border */}
                      <div className="absolute inset-0 rounded-full border-3 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse" />
                      <div className="absolute -inset-1 rounded-full border border-amber-500/40 bg-amber-500/5" />
                      
                      {/* Seat Inner Background & Avatar/Icon */}
                      <div className="w-18 h-18 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                        {hostSeatUser ? (
                          <img
                            src={hostSeatUser.avatar}
                            alt={hostSeatUser.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
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
                      {hostSeatUser && (
                        <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                          {hostSeatUser.isMuted ? (
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
                      {/* Premium pink/magenta glowing circular border */}
                      <div className="absolute inset-0 rounded-full border-3 border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.4)]" />
                      <div className="absolute -inset-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/5" />
                      
                      {/* Seat Inner Background & Avatar/Icon */}
                      <div className="w-18 h-18 rounded-full bg-[#1b1e32]/90 border border-slate-700/50 flex items-center justify-center overflow-hidden">
                        {superSeatUser ? (
                          <img
                            src={superSeatUser.avatar}
                            alt={superSeatUser.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
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
                      {superSeatUser && (
                        <div className="absolute -bottom-1 right-0 bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md scale-90">
                          {superSeatUser.isMuted ? (
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
                <div className="grid grid-cols-5 gap-y-6 gap-x-2 mt-8 px-1 py-2">
                  {gridSeatsUsers.map((user, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => handleSeatClick("grid", idx)}
                        className="relative w-18 h-18 rounded-full flex items-center justify-center bg-[#151726]/90 border border-slate-700/60 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      >
                        {user ? (
                          <div className="w-full h-full rounded-full overflow-hidden border border-violet-500/30">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          /* Elegant Sofa SVG inside empty couch circle */
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-slate-500">
                            <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                            <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
                            <path d="M5 18v2M19 18v2" />
                          </svg>
                        )}

                        {/* Speaking / Mute Indicators */}
                        {user && (
                          <div className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-700/50 rounded-full p-0.5 scale-75">
                            {user.isMuted ? (
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

              {/* 4. REAL-TIME FLOATING ENTRY TOASTS (Screenshot 4 - floating stack) */}
              <div className="w-full max-w-md mx-auto flex flex-col gap-1.5 px-2 my-1 pointer-events-auto select-none overflow-hidden max-h-[160px] justify-end">
                <AnimatePresence initial={false}>
                  {roomAlerts.slice(-3).map((alert) => {
                    if (alert.type === "announcement") {
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -30, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                          className="bg-purple-950/45 border border-purple-500/20 text-[#e9d5ff] px-3.5 py-1.5 rounded-full text-[11px] leading-normal font-black shadow-md flex items-center gap-1.5 self-start"
                        >
                          <span className="text-[12px] shrink-0">📢</span>
                          <span className="truncate max-w-[280px] sm:max-w-sm">{alert.text}</span>
                        </motion.div>
                      );
                    } else if (alert.type === "chat") {
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -30, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                          className="bg-indigo-950/50 border border-indigo-500/25 text-[#e0e7ff] px-4 py-1.5 rounded-2xl text-[11px] leading-normal font-black shadow-md flex items-center gap-1.5 self-start"
                        >
                          <span className="text-[#a5b4fc] font-extrabold shrink-0">{alert.user}:</span>
                          <span className="text-white font-medium">{alert.text}</span>
                        </motion.div>
                      );
                    } else {
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -30, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25 }}
                          className="bg-[#00f2fe]/10 border border-[#00f2fe]/25 text-[#e0f7fa] px-3.5 py-1.5 rounded-full flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(0,242,254,0.1)] text-[11px] font-black self-start"
                        >
                          <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-xs">
                            <span className="text-[11px] shrink-0">👋</span>
                            <span className="truncate">{alert.text}</span>
                          </div>
                          <button
                            onClick={() => triggerToast("Viewing user profile details", "success")}
                            className="bg-white text-slate-900 text-[9px] font-black px-2.5 py-0.5 rounded-full shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ml-1"
                          >
                            View
                          </button>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>
              </div>

              {/* 5. BOTTOM BAR CONTROLS (Screenshot 4 - exact spacing/layout) */}
              <div className="w-full flex items-center justify-between gap-2.5 mt-3 select-none">
                
                {/* Chat pill block */}
                <div className="flex-1">
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
                    className="flex items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-1 backdrop-blur-md focus-within:border-indigo-500/50 transition-all shadow-lg"
                  >
                    <input
                      type="text"
                      placeholder="Chat..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="w-full bg-transparent text-white text-xs placeholder-slate-400 outline-none border-none py-1.5 px-0.5 font-bold"
                    />
                    <button
                      type="submit"
                      className="p-1.5 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Right control buttons */}
                <div className="flex items-center gap-2">
                  
                  {/* Speaker volume toggle */}
                  <button
                    onClick={() => {
                      setIsNoiseReductionActive(!isNoiseReductionActive);
                      triggerToast(isNoiseReductionActive ? "Speaker sound muted." : "Speaker sound enabled.", "success");
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md border ${
                      isNoiseReductionActive
                        ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                    }`}
                    title="Toggle Sound"
                  >
                    {isNoiseReductionActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Microphone mute toggle */}
                  <button
                    onClick={() => {
                      const updatedMuted = !isMuted;
                      setIsMuted(updatedMuted);
                      triggerToast(updatedMuted ? "Your microphone is now muted." : "Your microphone is live!", "success");
                      
                      // Sync local state to Host seat if sitting there
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md border ${
                      !isMuted
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                    title="Toggle Microphone"
                  >
                    {!isMuted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  {/* Reaction / Emoji Face icon */}
                  <button
                    onClick={() => {
                      const emojis = ["❤️", "🔥", "👍", "😂", "🎉", "🌹", "😮"];
                      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                      triggerReaction(randomEmoji);
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-md text-sm font-black"
                    title="Send Voice Reaction"
                  >
                    😊
                  </button>

                  {/* Giant Gift box trigger button (Screenshot 4 gradient) */}
                  <button
                    onClick={() => {
                      const currentUserName = loggedInUser ? loggedInUser.name : "Munna";
                      // Find another seated user to target (e.g. Xzrmunna on Seat 2, or Alex, or Nusrat)
                      const targetName = "Xzrmunna";
                      
                      triggerReaction("🌹");
                      triggerReaction("🎁");
                      
                      setRoomAlerts(prev => [
                        ...prev,
                        { id: `gift-${Date.now()}-${Math.random()}`, text: `${currentUserName} sent a Crown 👑 to ${targetName}!`, type: "announcement" }
                      ]);
                      triggerToast(`You sent a Royal Crown to ${targetName}! 👑💎`, "success");
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-90 transition-all shadow-lg shadow-pink-600/20 shrink-0"
                    title="Send Gift"
                  >
                    <Gift className="w-5 h-5 text-white" />
                  </button>

                  {/* Grid / Layout button */}
                  <button
                    onClick={() => {
                      triggerToast("Switched to multi-room grid view mode.", "success");
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-md shrink-0"
                    title="View Layout"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-200">
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                  </button>

                  {/* Messages index toggle (with red notification count badging) */}
                  <button
                    onClick={() => {
                      triggerToast("Cleared direct message requests.", "success");
                    }}
                    className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/10 active:scale-95 transition-all shadow-md shrink-0"
                    title="Private Messages"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-200" />
                    <span className="absolute -top-1 -right-1 bg-red-500 border border-slate-900 rounded-full w-4 h-4 text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                      5
                    </span>
                  </button>

                </div>
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

    </div>
  );
}
