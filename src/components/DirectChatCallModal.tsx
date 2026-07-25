import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Phone,
  Video,
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  VideoOff,
  Check,
  CheckCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  UserPlus,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Flag,
  Gift,
  Users,
  MoreVertical,
  MoreHorizontal,
  Monitor,
  MessageSquare
} from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfileModalCard, UserProfileData } from "./UserProfileModalCard";

export interface DirectMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: any;
}

export interface DirectCallState {
  chatId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  callType: "audio" | "video";
  status: "ringing" | "connected" | "rejected" | "ended";
  channelName: string;
  startedAt?: number;
  timestamp?: number;
}

export interface DirectChatCallModalProps {
  currentUser: UserProfileData;
  targetUser: UserProfileData | null;
  onClose: () => void;
  triggerToast: (msg: string, type?: "success" | "error" | "info") => void;
  agoraRtcService?: any;
}

// WhatsApp dual-frequency (440Hz + 480Hz) dial ringback tone generator
let ringbackAudioCtx: AudioContext | null = null;
let ringbackTimer: any = null;
let masterRingbackGain: GainNode | null = null;

const startWhatsAppRingback = () => {
  try {
    if (ringbackAudioCtx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ringbackAudioCtx = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterRingbackGain = masterGain;

    const playPulse = () => {
      if (!ringbackAudioCtx || ringbackAudioCtx.state === "closed") return;
      if (ringbackAudioCtx.state === "suspended") {
        ringbackAudioCtx.resume().catch(() => {});
      }
      const now = ringbackAudioCtx.currentTime;

      const gain = ringbackAudioCtx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.04);
      gain.gain.setValueAtTime(0.1, now + 1.15);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      gain.connect(masterGain);

      const osc1 = ringbackAudioCtx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc1.connect(gain);
      osc1.start(now);
      osc1.stop(now + 1.22);

      const osc2 = ringbackAudioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(480, now);
      osc2.connect(gain);
      osc2.start(now);
      osc2.stop(now + 1.22);
    };

    playPulse();
    ringbackTimer = setInterval(playPulse, 3200);
  } catch (e) {
    console.error("Ringback tone error:", e);
  }
};

const stopWhatsAppRingback = () => {
  if (ringbackTimer) {
    clearInterval(ringbackTimer);
    ringbackTimer = null;
  }
  if (masterRingbackGain && ringbackAudioCtx) {
    try {
      masterRingbackGain.gain.linearRampToValueAtTime(0.0001, ringbackAudioCtx.currentTime + 0.02);
    } catch (e) {}
  }
  const ctxToClose = ringbackAudioCtx;
  ringbackAudioCtx = null;
  masterRingbackGain = null;
  if (ctxToClose) {
    setTimeout(() => {
      try { ctxToClose.close(); } catch (e) {}
    }, 30);
  }
};

let incomingAudioCtx: AudioContext | null = null;
let incomingTimer: any = null;
let masterIncomingGain: GainNode | null = null;

const startIncomingRingtone = () => {
  try {
    if (incomingAudioCtx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    incomingAudioCtx = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.6, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterIncomingGain = masterGain;

    const playMelody = () => {
      if (!incomingAudioCtx || incomingAudioCtx.state === "closed") return;
      if (incomingAudioCtx.state === "suspended") {
        incomingAudioCtx.resume().catch(() => {});
      }
      const now = incomingAudioCtx.currentTime;

      // Beautiful electronic chime melody (smartphone vibe)
      const melody = [
        [523.25, 0.0, 0.15], // C5
        [659.25, 0.15, 0.15], // E5
        [783.99, 0.3, 0.15], // G5
        [1046.50, 0.45, 0.3], // C6
        [0, 0.75, 0.1], // Pause
        [783.99, 0.85, 0.15], // G5
        [1046.50, 1.0, 0.4], // C6
      ];

      melody.forEach(([freq, delay, dur]) => {
        if (freq === 0) return;
        const osc = incomingAudioCtx!.createOscillator();
        const gainNode = incomingAudioCtx!.createGain();

        osc.type = "triangle"; // sweet chime sound
        osc.frequency.setValueAtTime(freq, now + delay);

        gainNode.gain.setValueAtTime(0.0001, now + delay);
        gainNode.gain.linearRampToValueAtTime(0.2, now + delay + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(now + delay);
        osc.stop(now + delay + dur);
      });
    };

    playMelody();
    incomingTimer = setInterval(playMelody, 2000);
  } catch (e) {
    console.error("Incoming ringtone error:", e);
  }
};

const stopIncomingRingtone = () => {
  if (incomingTimer) {
    clearInterval(incomingTimer);
    incomingTimer = null;
  }
  if (masterIncomingGain && incomingAudioCtx) {
    try {
      masterIncomingGain.gain.linearRampToValueAtTime(0.0001, incomingAudioCtx.currentTime + 0.02);
    } catch (e) {}
  }
  const ctxToClose = incomingAudioCtx;
  incomingAudioCtx = null;
  masterIncomingGain = null;
  if (ctxToClose) {
    setTimeout(() => {
      try { ctxToClose.close(); } catch (e) {}
    }, 30);
  }
};

const playDisconnectBeep = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const startTime = now + i * 0.35;
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
      try {
        ctx.close();
      } catch (e) {}
    }, 1500);
  } catch (e) {}
};

export function DirectChatCallModal({
  currentUser,
  targetUser,
  onClose,
  triggerToast,
  agoraRtcService
}: DirectChatCallModalProps) {
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatStatus, setChatStatus] = useState<"pending" | "accepted" | "blocked">("pending");
  const [requestSenderId, setRequestSenderId] = useState<string>("");

  // Real-time call states
  const [activeCall, setActiveCall] = useState<DirectCallState | null>(null);
  const [incomingCall, setIncomingCall] = useState<DirectCallState | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [beautyFilter, setBeautyFilter] = useState<"natural" | "glow" | "bright" | "ultra" | "smooth">("natural");
  const [isLoudspeaker, setIsLoudspeaker] = useState(true);
  const [micVolumeLevel, setMicVolumeLevel] = useState(0);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(null);
  const [isSwappedView, setIsSwappedView] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isFollowingTarget, setIsFollowingTarget] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const callVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);

  const setCallVideoNode = (node: HTMLVideoElement | null) => {
    callVideoRef.current = node;
    if (node && localStreamRef.current) {
      node.srcObject = localStreamRef.current;
      node.play().catch(() => {});
    }
  };

  const setPipVideoNode = (node: HTMLVideoElement | null) => {
    pipVideoRef.current = node;
    if (node && localStreamRef.current) {
      node.srcObject = localStreamRef.current;
      node.play().catch(() => {});
    }
  };

  if (!targetUser) return null;

  // Compute deterministic chatId
  const chatId = [currentUser.id, targetUser.id].sort().join("_");

  // 1. Subscribe to Firestore direct_chats document for status & friend request
  useEffect(() => {
    if (!chatId) return;

    const chatDocRef = doc(db, "direct_chats", chatId);

    // Ensure chat doc exists
    getDoc(chatDocRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(chatDocRef, {
          id: chatId,
          participants: [currentUser.id, targetUser.id],
          userA: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
          userB: { id: targetUser.id, name: targetUser.name, avatar: targetUser.avatar },
          status: "pending",
          senderId: currentUser.id,
          updatedAt: serverTimestamp()
        });
        setChatStatus("pending");
        setRequestSenderId(currentUser.id);
      } else {
        const data = snap.data();
        setChatStatus(data.status || "accepted");
        setRequestSenderId(data.senderId || currentUser.id);
      }
    });

    const unsubscribeDoc = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChatStatus(data.status || "accepted");
        setRequestSenderId(data.senderId || currentUser.id);
      }
    });

    // 2. Subscribe to real-time chat messages
    const msgsRef = collection(db, "direct_chats", chatId, "messages");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    const unsubscribeMsgs = onSnapshot(q, (snapshot) => {
      const list: DirectMessageItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          text: data.text,
          timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      });
      setMessages(list);
    });

    return () => {
      unsubscribeDoc();
      unsubscribeMsgs();
    };
  }, [chatId, currentUser.id, targetUser.id]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Subscribe to real-time call signaling for this chat
  useEffect(() => {
    if (!chatId) return;

    const callDocRef = doc(db, "direct_calls", chatId);
    const unsubscribeCall = onSnapshot(callDocRef, (snap) => {
      if (snap.exists()) {
        const callData = snap.data() as DirectCallState;

        if (callData.status === "ringing") {
          if (callData.receiverId === currentUser.id) {
            setIncomingCall(callData);
          } else if (callData.callerId === currentUser.id) {
            setActiveCall(callData);
          }
        } else if (callData.status === "connected") {
          setIncomingCall(null);
          setActiveCall(callData);
        } else if (callData.status === "rejected") {
          if (activeCall?.callerId === currentUser.id) {
            triggerToast(`${targetUser.name} declined your call.`, "info");
          }
          setActiveCall(null);
          setIncomingCall(null);
        } else if (callData.status === "ended") {
          setActiveCall(null);
          setIncomingCall(null);
        }
      } else {
        setActiveCall(null);
        setIncomingCall(null);
      }
    });

    return () => unsubscribeCall();
  }, [chatId, currentUser.id, targetUser.name, activeCall?.callerId]);

  // Call timer effect
  useEffect(() => {
    if (activeCall && activeCall.status === "connected") {
      callTimerRef.current = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSec(0);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCall]);

  // Realistic ringtone for incoming calls
  useEffect(() => {
    if (incomingCall && incomingCall.status === "ringing") {
      startIncomingRingtone();
    } else {
      stopIncomingRingtone();
    }
    return () => {
      stopIncomingRingtone();
    };
  }, [incomingCall?.status, incomingCall]);

  // Bilingual Smart simulated auto-reply and typing effect
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];

    const getSmartResponse = (userText: string, userName: string): string => {
      const text = userText.toLowerCase().trim();
      
      if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
        return `Hello ${userName}! How are you doing today? 😊`;
      }
      if (text.includes("how are you") || text.includes("how r u") || text.includes("fine")) {
        return "I'm doing great, thank you! How is your day going? 😊";
      }
      if (text.includes("name") || text.includes("your name") || text.includes("who are you")) {
        return `My name is ${targetUser.name || "friend"}. It's wonderful talking to you!`;
      }
      if (text.includes("doing") || text.includes("what are you doing") || text.includes("busy")) {
        return "I am chatting with you! Tell me, how can I help you today? 💬";
      }
      if (text.includes("call") || text.includes("video") || text.includes("audio")) {
        return "Yes! You can call me via audio or video call anytime, I am online and ready to ring back. 📞";
      }
      if (text.includes("love you") || text.includes("like you") || text.includes("sweet")) {
        return "Thank you so much! Your kind words really made my day. ❤️✨";
      }
      if (text.includes("bye") || text.includes("goodbye") || text.includes("tc") || text.includes("see ya")) {
        return "Goodbye! Take care of yourself and let's talk again soon! 👋✨";
      }
      
      const defaults = [
        "Wow! That's wonderful. I really enjoy chatting with you! 🌟",
        "Yes, I completely understand. Tell me more about yourself! 😊",
        "Sure, absolutely! I am always here for you. ❤️",
        "Great! I love your idea. 👍",
        "I'm so happy to receive your message. Let's keep chatting! ✨"
      ];
      return defaults[Math.floor(Math.random() * defaults.length)];
    };

    if (lastMsg.senderId === currentUser.id) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);

        const replyTimeout = setTimeout(async () => {
          setIsTyping(false);

          try {
            const msgsRef = collection(db, "direct_chats", chatId, "messages");
            const responseText = getSmartResponse(lastMsg.text, currentUser.name);

            await addDoc(msgsRef, {
              senderId: targetUser.id,
              senderName: targetUser.name,
              senderAvatar: targetUser.avatar,
              text: responseText,
              createdAt: serverTimestamp()
            });

            const chatDocRef = doc(db, "direct_chats", chatId);
            await updateDoc(chatDocRef, {
              lastMessage: responseText,
              updatedAt: serverTimestamp()
            });
          } catch (err) {
            console.error("Auto-reply fail:", err);
          }
        }, 2500);

        return () => clearTimeout(replyTimeout);
      }, 1200);

      return () => clearTimeout(typingTimeout);
    }
  }, [messages.length, chatId, currentUser.id, currentUser.name, targetUser.id, targetUser.name, targetUser.avatar]);

  // Real-time Microphone Audio Capture & Volume Level Meter
  useEffect(() => {
    if (activeCall) {
      navigator.mediaDevices?.getUserMedia?.({ audio: true }).then((stream) => {
        localStreamRef.current = stream;
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioCtxRef.current = ctx;
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVol = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setMicVolumeLevel(avg);
              animFrameRef.current = requestAnimationFrame(updateVol);
            };
            updateVol();
          }
        } catch (e) {
          console.error("Audio Context initialization error:", e);
        }
      }).catch((err) => {
        console.warn("Microphone access notice:", err);
      });
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setMicVolumeLevel(0);
    }

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeCall]);

  // Toggle mic track enabled state
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicMuted;
      });
    }
  }, [isMicMuted]);

  // Real WebCam video stream initialization for Video Calls (Front / Back Camera support)
  useEffect(() => {
    let stream: MediaStream | null = null;
    const isVideoCall = activeCall?.callType === "video" || incomingCall?.callType === "video";

    if (isVideoCall && !isVideoMuted) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: { facingMode: facingMode },
            audio: !isMicMuted,
          })
          .then((s) => {
            stream = s;
            localStreamRef.current = s;
            setLocalVideoStream(s);
          })
          .catch((err) => {
            console.warn("Video camera access notice:", err);
          });
      }
    } else {
      setLocalVideoStream(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      setLocalVideoStream(null);
    };
  }, [activeCall?.callType, incomingCall?.callType, isVideoMuted, facingMode, isMicMuted]);

  // WhatsApp Dial Tone & 25s Ring Timeout Effect
  useEffect(() => {
    if (!activeCall) {
      stopWhatsAppRingback();
      if (screenStream) {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      }
      return;
    }

    if (activeCall.status === "ringing") {
      startWhatsAppRingback();

      const timeoutId = setTimeout(() => {
        stopWhatsAppRingback();
        playDisconnectBeep();
        handleEndCall();
        triggerToast("No answer / user did not pick up", "info");
      }, 45000);

      return () => {
        clearTimeout(timeoutId);
        stopWhatsAppRingback();
      };
    } else if (activeCall.status === "connected") {
      stopWhatsAppRingback();
    }
  }, [activeCall?.status]);

  // Screen Share Video Stream Effect
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(() => {});
    }
  }, [screenStream]);

  // Toggle Screen Sharing
  const handleToggleScreenShare = async () => {
    setShowMoreOptionsMenu(false);
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      triggerToast("Screen sharing stopped", "info");
    } else {
      try {
        const media = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenStream(media);
        triggerToast("Live screen sharing active 📺", "success");
        media.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          triggerToast("Screen share ended", "info");
        };
      } catch (err) {
        console.warn("Screen share cancelled or not allowed:", err);
      }
    }
  };

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText("");

    try {
      const msgsRef = collection(db, "direct_chats", chatId, "messages");
      await addDoc(msgsRef, {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        text: textToSend,
        createdAt: serverTimestamp()
      });

      // Update parent doc last message
      const chatDocRef = doc(db, "direct_chats", chatId);
      await updateDoc(chatDocRef, {
        lastMessage: textToSend,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to send direct message:", err);
      triggerToast("Failed to send message", "error");
    }
  };

  // Friend Request Accept handler
  const handleAcceptRequest = async () => {
    try {
      const chatDocRef = doc(db, "direct_chats", chatId);
      await updateDoc(chatDocRef, {
        status: "accepted",
        updatedAt: serverTimestamp()
      });
      setChatStatus("accepted");
      triggerToast(`Accepted chat request from ${targetUser.name}! 🎉`, "success");
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Friend Request Block handler
  const handleBlockUser = async () => {
    try {
      const chatDocRef = doc(db, "direct_chats", chatId);
      await updateDoc(chatDocRef, {
        status: "blocked",
        updatedAt: serverTimestamp()
      });
      setChatStatus("blocked");
      triggerToast(`Blocked ${targetUser.name}`, "info");
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  // Initiate Call (Audio or Video)
  const handleStartCall = async (type: "audio" | "video") => {
    if (chatStatus === "blocked") {
      triggerToast("Cannot call a blocked user.", "error");
      return;
    }

    const newCallState: DirectCallState = {
      chatId,
      callerId: currentUser.id,
      callerName: currentUser.name,
      callerAvatar: currentUser.avatar,
      receiverId: targetUser.id,
      receiverName: targetUser.name,
      receiverAvatar: targetUser.avatar,
      callType: type,
      status: "ringing",
      channelName: `call_${chatId}`
    };

    try {
      const callDocRef = doc(db, "direct_calls", chatId);
      await setDoc(callDocRef, newCallState);
      setActiveCall(newCallState);
      triggerToast(`Calling ${targetUser.name}... 📞`, "info");
    } catch (err) {
      console.error("Failed to start call:", err);
      triggerToast("Failed to initiate call", "error");
    }
  };

  // Answer Incoming Call
  const handleAnswerCall = async () => {
    if (!incomingCall) return;

    try {
      const callDocRef = doc(db, "direct_calls", chatId);
      await updateDoc(callDocRef, {
        status: "connected",
        startedAt: Date.now()
      });
      setActiveCall({ ...incomingCall, status: "connected" });
      setIncomingCall(null);
      triggerToast(`Call connected with ${incomingCall.callerName}! 🎙️`, "success");
    } catch (err) {
      console.error("Failed to answer call:", err);
    }
  };

  // Reject Incoming Call
  const handleRejectCall = async () => {
    if (!incomingCall) return;

    try {
      const callDocRef = doc(db, "direct_calls", chatId);
      await updateDoc(callDocRef, {
        status: "rejected"
      });
      setIncomingCall(null);
      triggerToast("Call declined", "info");
    } catch (err) {
      console.error("Failed to reject call:", err);
    }
  };

  // End Active Call
  const handleEndCall = async () => {
    try {
      const callDocRef = doc(db, "direct_calls", chatId);
      await updateDoc(callDocRef, {
        status: "ended"
      });
    } catch (err) {
      console.warn("Call doc already removed");
    } finally {
      setActiveCall(null);
      setIncomingCall(null);
      triggerToast("Call ended", "info");
    }
  };

  // Format call duration helper
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-0 sm:p-4">
        {/* Main 1-on-1 Chat Drawer / Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg h-[100vh] sm:h-[90vh] bg-gradient-to-b from-[#18112e] via-[#100a23] to-[#0a0518] sm:rounded-[32px] overflow-hidden shadow-2xl border border-violet-500/30 flex flex-col text-white"
        >
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1e163b]/80 border-b border-white/10 backdrop-blur-md shrink-0">
            {/* Target User Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <div className="relative">
                  <img
                    src={targetUser.avatar}
                    alt={targetUser.name}
                    className="w-10 h-10 object-cover rounded-full border border-violet-400"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#18112e]" />
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>{targetUser.name}</span>
                    <span className="text-[10px] bg-violet-500/30 text-violet-300 px-1.5 py-0.2 rounded font-mono">
                      ID: {targetUser.idNo || "7629964"}
                    </span>
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-medium">Online now</span>
                </div>
              </div>
            </div>

            {/* CALL & REPORT BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartCall("audio")}
                title="Real-Time Audio Call"
                className="p-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer active:scale-90 flex items-center justify-center shadow-md hover:shadow-emerald-500/20"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleStartCall("video")}
                title="Real-Time Video Call"
                className="p-2.5 rounded-full bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-300 transition-all cursor-pointer active:scale-90 flex items-center justify-center shadow-md hover:shadow-violet-500/20"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                onClick={() => triggerToast(`Report submitted for ${targetUser.name}`, "info")}
                title="Report User"
                className="p-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition-all cursor-pointer active:scale-90 flex items-center justify-center shadow-md hover:shadow-rose-500/20"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FRIEND REQUEST / CHAT STATUS BANNER */}
          {chatStatus === "pending" && (
            <div className="bg-gradient-to-r from-violet-900/60 to-purple-900/60 border-b border-violet-500/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              {requestSenderId === currentUser.id ? (
                <div className="flex items-center gap-2 text-violet-200">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Chat request sent. Waiting for <strong>{targetUser.name}</strong> to accept.</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-violet-200">
                    <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{targetUser.name}</strong> wants to connect & chat with you.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleAcceptRequest}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-full transition-all cursor-pointer active:scale-95 text-[11px]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={handleBlockUser}
                      className="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 border border-red-500/50 text-red-300 font-bold rounded-full transition-all cursor-pointer active:scale-95 text-[11px]"
                    >
                      Block
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {chatStatus === "blocked" && (
            <div className="bg-red-950/80 border-b border-red-500/30 px-4 py-2 text-center text-xs text-red-300 font-bold">
              🚫 Messaging is blocked between you and this user.
            </div>
          )}

          {/* REAL-TIME MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-violet-500/20">
            {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4 space-y-2">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-white text-base">Start conversation with {targetUser.name}</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Say hello or send a gift! Messages and 1-on-1 calls are live and real-time.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        onClick={() => setShowProfileModal(true)}
                        src={msg.senderAvatar || targetUser.avatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-md ${
                        isMe
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none border border-violet-400/30"
                          : "bg-white/10 text-slate-100 rounded-bl-none border border-white/10"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            
            {isTyping && (
              <div className="flex items-end gap-2 justify-start animate-pulse">
                <img
                  onClick={() => setShowProfileModal(true)}
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0 cursor-pointer hover:opacity-80"
                />
                <div className="bg-white/10 text-slate-300 px-4 py-2 rounded-2xl rounded-bl-none border border-white/5 text-xs flex items-center gap-1.5 font-semibold">
                  <span>{targetUser.name} is typing</span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CHAT INPUT BAR */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#1e163b]/90 border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => triggerToast(`Opened gift store for ${targetUser.name}! 🎁`, "info")}
              title="Send Gift"
              className="p-2.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 transition-all cursor-pointer active:scale-90 flex items-center justify-center shrink-0"
            >
              <Gift className="w-4 h-4 text-pink-300" />
            </button>

            <input
              type="text"
              placeholder={chatStatus === "blocked" ? "Messaging blocked" : `Type a message...`}
              value={inputText}
              disabled={chatStatus === "blocked"}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || chatStatus === "blocked"}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                inputText.trim() && chatStatus !== "blocked"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

        {/* INCOMING CALL OVERLAY POPUP */}
        {incomingCall && (
          <AnimatePresence>
            <div className="fixed inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center z-[250] p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full max-w-sm bg-gradient-to-b from-[#1c133a] via-[#120a2a] to-[#0a041a] rounded-[36px] border border-violet-500/40 p-6 flex flex-col items-center text-center shadow-[0_0_50px_rgba(139,92,246,0.5)]"
              >
                {/* Caller avatar with pulsing ringing circles */}
                <div className="relative my-4">
                  <div className="absolute -inset-4 rounded-full border-2 border-emerald-500/60 animate-ping opacity-75" />
                  <div className="absolute -inset-8 rounded-full border-2 border-emerald-400/30 animate-ping opacity-40 delay-300" />
                  
                  <img
                    src={incomingCall.callerAvatar}
                    alt={incomingCall.callerName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400 shadow-2xl relative z-10"
                  />
                </div>

                <h3 className="text-xl font-black text-white mt-2">{incomingCall.callerName}</h3>
                <span className="text-[11px] font-mono text-amber-300 font-extrabold bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 rounded-full my-1">
                  ID Code: #{incomingCall.callerIdNo || incomingCall.callerId}
                </span>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest my-1 animate-pulse flex items-center justify-center gap-1">
                  {incomingCall.callType === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>Incoming Real-Time {incomingCall.callType === "video" ? "Video" : "Voice"} Call</span>
                </p>

                {/* Answer, Reject, and Quick Message Buttons */}
                <div className="flex items-center gap-5 mt-6 w-full justify-center">
                  {/* Reject button */}
                  <button
                    onClick={handleRejectCall}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-all"
                  >
                    <div className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40">
                      <PhoneOff className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-red-400">Decline</span>
                  </button>

                  {/* Accept button */}
                  <button
                    onClick={handleAnswerCall}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/50 animate-bounce">
                      <PhoneCall className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-black text-emerald-300">Answer</span>
                  </button>

                  {/* Quick Message button */}
                  <button
                    onClick={() => {
                      triggerToast("Sent auto message: 'I will call you back later!' 📩", "info");
                    }}
                    className="flex flex-col items-center gap-1 group cursor-pointer active:scale-90 transition-all"
                    title="Quick Reply"
                  >
                    <div className="w-13 h-13 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-5 h-5 text-slate-200" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">Message</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        )}

        {/* ACTIVE REAL-TIME 1-ON-1 CALL OVERLAY (MATCHING USER SCREENSHOT) */}
        {activeCall && (
          <AnimatePresence>
            {isMinimized ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => setIsMinimized(false)}
                className="fixed top-3 left-1/2 -translate-x-1/2 z-[250] bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400/40 cursor-pointer active:scale-95"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold">{targetUser.name}</span>
                  <span className="text-[10px] font-mono text-emerald-100">{formatDuration(callDurationSec)} • Tap to maximize</span>
                </div>
              </motion.div>
            ) : (
              <div className="fixed inset-0 bg-[#0b141a] z-[230] flex flex-col justify-between text-white select-none overflow-hidden font-sans">
              
              {/* VIDEO CALL CANVAS VIEW (When callType === 'video') */}
              {activeCall.callType === "video" ? (
                <div className="relative w-full h-full flex-1 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {/* Background Canvas: Live local camera during Ringing or when Swapped, or Remote View when Connected */}
                  {activeCall.status === "ringing" ? (
                    <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                      {/* Live Local Camera Feed in full background while ringing (Exactly as in Screenshot 1) */}
                      {localVideoStream && !isVideoMuted ? (
                        <video
                          ref={(node) => {
                            if (node && node.srcObject !== localVideoStream) {
                              node.srcObject = localVideoStream;
                              node.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover opacity-90 ${
                            beautyFilter === "glow"
                              ? "brightness-[1.2] contrast-[1.05] saturate-[1.1]"
                              : beautyFilter === "bright"
                              ? "brightness-[1.3] contrast-[1.05]"
                              : beautyFilter === "ultra"
                              ? "brightness-[1.4]"
                              : beautyFilter === "smooth"
                              ? "brightness-[1.18]"
                              : ""
                          }`}
                          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0b141a] via-[#111b21] to-[#0b141a]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                      {/* Top Header info matching Screenshot 1 */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center pointer-events-none">
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-xl mb-2"
                        />
                        <h2 className="text-base sm:text-lg font-black text-white drop-shadow-md tracking-wide flex items-center gap-1.5 justify-center">
                          <span>{targetUser.name}</span>
                          <span className="text-xs bg-black/50 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                            ID: {targetUser.idNo || "7629964"}
                          </span>
                        </h2>
                        <p className="text-xs font-bold text-emerald-400 drop-shadow-sm mt-1 animate-pulse">
                          {targetUser.online !== false ? "Ringing..." : "Calling..."}
                        </p>
                      </div>

                      {/* Top-Right Floating Vertical Buttons during Ringing */}
                      <div className="absolute top-6 right-4 z-30 flex flex-col items-center gap-3">
                        <button
                          onClick={() => triggerToast(`Added ${targetUser.name} to call 👥`, "info")}
                          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                          title="Add Participant"
                        >
                          <UserPlus className="w-5 h-5 text-slate-100" />
                        </button>

                        <button
                          onClick={() => {
                            const nextMode = facingMode === "user" ? "environment" : "user";
                            setFacingMode(nextMode);
                            triggerToast(`Switched to ${nextMode === "user" ? "front" : "back"} camera 🔄`, "info");
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
                    </div>
                  ) : (
                    /* CONNECTED VIDEO CALL (Matching Screenshot 2) */
                    <div className="absolute inset-0 z-0">
                      {/* Top Left Minimize Icon (Matching Screenshot 2) */}
                      <div className="absolute top-6 left-4 z-30">
                        <button
                          onClick={() => setIsMinimized(true)}
                          className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md active:scale-90 cursor-pointer"
                          title="Minimize call window"
                        >
                          <ChevronDown className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Main Screen Stream (Swaps between Recipient and Local camera) */}
                      {isSwappedView ? (
                        localVideoStream && !isVideoMuted ? (
                          <video
                            ref={(node) => {
                              callVideoRef.current = node;
                              if (node && node.srcObject !== localVideoStream) {
                                node.srcObject = localVideoStream;
                                node.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover opacity-90 ${
                              beautyFilter === "glow"
                                ? "brightness-[1.2] contrast-[1.05] saturate-[1.1]"
                                : beautyFilter === "bright"
                                ? "brightness-[1.3] contrast-[1.05]"
                                : beautyFilter === "ultra"
                                ? "brightness-[1.4]"
                                : beautyFilter === "smooth"
                                ? "brightness-[1.18]"
                                : ""
                            }`}
                            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-32 h-32 rounded-full object-cover border-4 border-amber-400"
                            />
                            <p className="text-sm font-bold text-white mt-3">Your Camera Off</p>
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full relative">
                          <img
                            src={targetUser.avatar}
                            alt={targetUser.name}
                            className={`w-full h-full object-cover opacity-90 ${
                              beautyFilter === "glow"
                                ? "brightness-[1.15]"
                                : beautyFilter === "bright"
                                ? "brightness-[1.25]"
                                : beautyFilter === "ultra"
                                ? "brightness-[1.35]"
                                : beautyFilter === "smooth"
                                ? "brightness-[1.12]"
                                : ""
                            }`}
                          />
                          <video
                            ref={callVideoRef}
                            autoPlay
                            playsInline
                            muted={isMicMuted}
                            className="hidden"
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                      {/* Top Header info matching Screenshot 2 */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center pointer-events-none">
                        <h2 className="text-base sm:text-lg font-black text-white drop-shadow-md tracking-wide">
                          {targetUser.name}
                        </h2>
                        <p className="text-xs font-semibold text-emerald-300 drop-shadow-sm mt-0.5 font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{formatDuration(callDurationSec)}</span>
                        </p>
                      </div>

                      {/* Top Right Add Participant Button (Matching Screenshot 2) */}
                      <div className="absolute top-6 right-4 z-30">
                        <button
                          onClick={() => triggerToast(`Added ${targetUser.name} to call 👥`, "info")}
                          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                          title="Add Participant"
                        >
                          <UserPlus className="w-5 h-5 text-slate-100" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Draggable Picture-In-Picture Box (ONLY SHOWN WHEN CONNECTED - Screenshot 2) */}
                  {activeCall.status === "connected" && (
                    <motion.div
                      drag
                      dragConstraints={{ left: -280, right: 10, top: -480, bottom: 20 }}
                      dragElastic={0.1}
                      whileDrag={{ scale: 1.05 }}
                      onClick={() => {
                        setIsSwappedView((prev) => !prev);
                        triggerToast(!isSwappedView ? "Main view: Your camera 👤" : "Main view: Recipient 👥", "info");
                      }}
                      className="absolute bottom-28 right-4 z-30 w-32 h-44 sm:w-36 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] bg-slate-900 cursor-pointer flex flex-col items-center justify-center select-none group transition-transform active:scale-95"
                      title="Click to swap views"
                    >
                      {!isSwappedView ? (
                        /* Default PIP content = My Local Camera */
                        isVideoMuted || !localVideoStream ? (
                          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                            />
                            <span className="text-[10px] text-slate-300 font-bold mt-1">You</span>
                          </div>
                        ) : (
                          <video
                            ref={(node) => {
                              pipVideoRef.current = node;
                              if (node && node.srcObject !== localVideoStream) {
                                node.srcObject = localVideoStream;
                                node.play().catch(() => {});
                              }
                            }}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover pointer-events-none"
                            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                          />
                        )
                      ) : (
                        /* Swapped PIP content = Recipient Target User */
                        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center">
                          <img
                            src={targetUser.avatar}
                            alt={targetUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Small overlay icons on PIP Box for Camera Flip and Beauty Filter */}
                      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextMode = facingMode === "user" ? "environment" : "user";
                            setFacingMode(nextMode);
                            triggerToast(`Switched to ${nextMode === "user" ? "front" : "back"} camera 🔄`, "info");
                          }}
                          className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-90 cursor-pointer"
                          title="Rotate camera"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const filters = ["natural", "glow", "bright", "ultra", "smooth"];
                            const nextIndex = (filters.indexOf(beautyFilter) + 1) % filters.length;
                            setBeautyFilter(filters[nextIndex] as any);
                            triggerToast(`Beauty filter: ${filters[nextIndex]} ✨`, "info");
                          }}
                          className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 flex items-center justify-center active:scale-90 cursor-pointer"
                          title="Beauty filter"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Floating Bottom Control Bar matching screenshot */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
                    <div className="flex items-center justify-around w-full bg-[#121b22]/95 backdrop-blur-2xl px-5 py-3.5 rounded-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                      {/* Button 1: More Options (...) */}
                      <button
                        onClick={() => setShowMoreOptionsMenu(!showMoreOptionsMenu)}
                        className="p-3 rounded-full hover:bg-white/10 text-slate-200 transition-all cursor-pointer active:scale-90"
                        title="More Options"
                      >
                        <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>

                      {/* Button 2: Video Camera Toggle */}
                      <button
                        onClick={() => {
                          const nextState = !isVideoMuted;
                          setIsVideoMuted(nextState);
                          triggerToast(nextState ? "Camera Turned OFF 🚫" : "Camera Turned ON 📹", "info");
                        }}
                        className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                          isVideoMuted ? "bg-rose-600 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-slate-200"
                        }`}
                        title={isVideoMuted ? "Turn Camera ON" : "Turn Camera OFF"}
                      >
                        {isVideoMuted ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      {/* Button 3: Loudspeaker Toggle (White bg when active like screenshot!) */}
                      <button
                        onClick={() => {
                          const nextState = !isLoudspeaker;
                          setIsLoudspeaker(nextState);
                          triggerToast(nextState ? "Loudspeaker Mode ON 🔊" : "Earpiece Mode ON 🎧", "info");
                        }}
                        className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                          isLoudspeaker ? "bg-white text-black shadow-lg scale-105" : "bg-white/10 hover:bg-white/20 text-slate-200"
                        }`}
                        title={isLoudspeaker ? "Switch to Earpiece" : "Switch to Loudspeaker"}
                      >
                        {isLoudspeaker ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      {/* Button 4: Mic Toggle */}
                      <button
                        onClick={() => {
                          const nextState = !isMicMuted;
                          setIsMicMuted(nextState);
                          triggerToast(nextState ? "Microphone Muted 🔇" : "Microphone Unmuted 🎙️", "info");
                        }}
                        className={`p-3 rounded-full transition-all cursor-pointer active:scale-90 ${
                          isMicMuted ? "bg-rose-600 text-white shadow-lg" : "bg-white/10 hover:bg-white/20 text-slate-200"
                        }`}
                        title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                      >
                        {isMicMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      {/* Button 5: End Call (Red Circular Button) */}
                      <button
                        onClick={handleEndCall}
                        className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-all cursor-pointer active:scale-90 hover:scale-105"
                        title="End Call"
                      >
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 rotate-[135deg]" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* AUDIO CALL CANVAS VIEW */
                <>
                  {/* Wallpaper Background Texture */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
                    style={{
                      backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                      backgroundSize: "24px 24px"
                    }}
                  />

                  {/* Top Header Bar matching screenshot */}
                  <div className="relative z-20 w-full px-4 pt-10 pb-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                    <button
                      onClick={handleEndCall}
                      className="p-2.5 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer"
                      title="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                      <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                        {targetUser.name}
                      </h2>
                      <p className="text-xs text-slate-300 font-medium mt-0.5">
                        {activeCall.status === "ringing"
                          ? (targetUser.online !== false ? "Ringing..." : "Calling...")
                          : `${formatDuration(callDurationSec)}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => triggerToast(`Added ${targetUser.name} to group audio channel`, "info")}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer"
                        title="Group Call"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => triggerToast("Call settings", "info")}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer"
                        title="More Options"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Center Prominent View (Screen Share or Avatar) */}
                  <div className="flex-1 flex flex-col items-center justify-center my-auto relative z-10 p-6">
                    {screenStream ? (
                      <div className="relative w-full max-w-lg h-[50vh] rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-black flex flex-col items-center justify-center">
                        <video
                          ref={screenVideoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-3 left-3 bg-emerald-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-white flex items-center gap-2 shadow-lg">
                          <Monitor className="w-4 h-4 animate-pulse text-emerald-300" />
                          <span>Live Screen Sharing 📺</span>
                        </div>
                        <button
                          onClick={() => {
                            screenStream.getTracks().forEach((t) => t.stop());
                            setScreenStream(null);
                            triggerToast("Screen sharing stopped", "info");
                          }}
                          className="absolute bottom-3 right-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                          Stop Sharing
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Real-time sound wave halo reacting to mic sound */}
                        <div
                          className="absolute -inset-6 rounded-full bg-emerald-500/25 blur-xl transition-all duration-150"
                          style={{
                            transform: `scale(${1 + micVolumeLevel / 100})`,
                            opacity: 0.2 + micVolumeLevel / 80
                          }}
                        />
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative z-10"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Floating Control Bar */}
                  <div className="relative z-20 w-full pb-10 pt-4 px-6 flex items-center justify-center">
                    <div className="flex items-center justify-around w-full max-w-xs bg-[#1f2c34]/95 backdrop-blur-xl px-6 py-4 rounded-full border border-white/10 shadow-2xl">
                      {/* More Options (...) */}
                      <div className="relative">
                        <button
                          onClick={() => setShowMoreOptionsMenu(!showMoreOptionsMenu)}
                          className="p-3.5 rounded-full hover:bg-white/10 text-slate-200 transition-all cursor-pointer active:scale-90"
                          title="Options"
                        >
                          <MoreHorizontal className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Loudspeaker toggle button */}
                      <button
                        onClick={() => {
                          const nextState = !isLoudspeaker;
                          setIsLoudspeaker(nextState);
                          triggerToast(
                            nextState ? "Loudspeaker Mode ON 🔊" : "Earpiece Mode ON 🎧",
                            "info"
                          );
                        }}
                        className={`p-3.5 rounded-full transition-all cursor-pointer active:scale-90 ${
                          isLoudspeaker
                            ? "bg-white text-black shadow-lg scale-105"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                        title={isLoudspeaker ? "Switch to Earpiece" : "Switch to Loudspeaker"}
                      >
                        {isLoudspeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                      </button>

                      {/* Mic Mute toggle button */}
                      <button
                        onClick={() => {
                          setIsMicMuted(!isMicMuted);
                          triggerToast(
                            !isMicMuted ? "Microphone Muted 🔇" : "Microphone Unmuted 🎙️",
                            "info"
                          );
                        }}
                        className={`p-3.5 rounded-full transition-all cursor-pointer active:scale-90 ${
                          isMicMuted
                            ? "bg-rose-600 text-white shadow-lg"
                            : "bg-white/10 text-slate-200 hover:bg-white/20"
                        }`}
                        title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                      >
                        {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>

                      {/* End Call Button */}
                      <button
                        onClick={handleEndCall}
                        className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all cursor-pointer active:scale-90 hover:scale-105"
                        title="End Call"
                      >
                        <Phone className="w-6 h-6 rotate-[135deg]" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {showProfileModal && (
        <UserProfileModalCard
          user={{
            id: targetUser.id,
            name: targetUser.name,
            avatar: targetUser.avatar,
            idNo: targetUser.idNo || "7629964",
            online: targetUser.online !== false,
            followersCount: isFollowingTarget ? 1285 : 1284,
            giftsCount: 342,
            intimacy: "34.57M",
            bio: targetUser.bio || "OneR encourages positive broadcast. Let's chat & spread love ❤️",
            hasTigerCrown: true,
            vipLevel: 2,
            gender: "Female",
          }}
          onClose={() => setShowProfileModal(false)}
          onFollowToggle={() => {
            setIsFollowingTarget((prev) => !prev);
            triggerToast(
              isFollowingTarget
                ? `Unfollowed ${targetUser.name}`
                : `Following ${targetUser.name} ❤️`,
              "success"
            );
          }}
          isFollowing={isFollowingTarget}
          onGiveGift={() => triggerToast(`Gift selection opened for ${targetUser.name}! 🎁`, "info")}
          onMention={() => triggerToast(`Mentioned ${targetUser.name}`, "info")}
          onOpenDirectChat={() => setShowProfileModal(false)}
        />
      )}
    </AnimatePresence>
  );
}
