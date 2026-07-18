import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraChat from "agora-chat";

// Real-time configurations provided by the user
export const AGORA_APP_ID = "dfbc3a91eef84f19af236a1b4ce68c04";

export const AGORA_CHAT_APP_KEY = "61200050902#200070910";
export const AGORA_CHAT_WS_URL = "msync-api-61.chat.agora.io";
export const AGORA_CHAT_REST_URL = "a61.chat.agora.io";

export interface AgoraRtcService {
  client: any;
  localAudioTrack: any;
  join: (channelName: string, token: string, onUserPublished: (user: any, mediaType: "audio" | "video") => void, onUserUnpublished: (user: any) => void) => Promise<void>;
  leave: () => Promise<void>;
  publish: () => Promise<void>;
  unpublish: () => Promise<void>;
}

export interface AgoraChatService {
  conn: any; // AgoraChat.connection
  isLoggedIn: boolean;
  login: (username: string, nickname: string, token: string, onMessage: (msg: { from: string; text: string }) => void) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, text: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 1. Create Agora Voice Service (RTC)
export function createAgoraRtcService(): AgoraRtcService {
  // Use VP8 codec for high quality low-latency voice RTC
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  let localAudioTrack: any = null;

  return {
    client,
    get localAudioTrack() {
      return localAudioTrack;
    },
    join: async (channelName, token, onUserPublished, onUserUnpublished) => {
      try {
        // Register connection and subscription callbacks
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "audio") {
            user.audioTrack?.play();
            onUserPublished(user, mediaType);
          }
        });

        client.on("user-unpublished", (user) => {
          if (user.audioTrack) {
            user.audioTrack.stop();
          }
          onUserUnpublished(user);
        });

        client.on("user-left", (user) => {
          if (user.audioTrack) {
            user.audioTrack.stop();
          }
          onUserUnpublished(user);
        });

        // Join the channel with the secure dynamic token fetched from Express server
        await client.join(AGORA_APP_ID, channelName, token, null);
        console.log(`Agora RTC successfully joined channel: ${channelName} with token`);
      } catch (err) {
        console.error("Failed to join Agora RTC channel", err);
        throw err;
      }
    },
    leave: async () => {
      try {
        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
          localAudioTrack = null;
        }
        await client.leave();
        console.log("Agora RTC left channel successfully");
      } catch (err) {
        console.error("Error during Agora RTC leave", err);
      }
    },
    publish: async () => {
      try {
        if (!localAudioTrack) {
          localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        }
        await client.publish([localAudioTrack]);
        console.log("Agora RTC published local audio track");
      } catch (err) {
        console.error("Failed to publish local audio track to Agora RTC", err);
        throw err;
      }
    },
    unpublish: async () => {
      try {
        if (localAudioTrack) {
          await client.unpublish([localAudioTrack]);
          localAudioTrack.stop();
          localAudioTrack.close();
          localAudioTrack = null;
          console.log("Agora RTC unpublished local audio track");
        }
      } catch (err) {
        console.error("Failed to unpublish local audio track from Agora RTC", err);
      }
    }
  };
}

// 2. Create Agora Chat Service
export function createAgoraChatService(): AgoraChatService {
  let conn: any = null;
  let loggedIn = false;

  try {
    conn = new (AgoraChat as any).connection({
      appKey: AGORA_CHAT_APP_KEY,
      isHttpDNS: false,
      url: `wss://${AGORA_CHAT_WS_URL}`,
      apiUrl: `https://${AGORA_CHAT_REST_URL}`
    });
  } catch (err) {
    console.error("Failed to initialize Agora Chat connection", err);
  }

  return {
    get conn() {
      return conn;
    },
    get isLoggedIn() {
      return loggedIn;
    },
    login: async (username, nickname, token, onMessage) => {
      if (!conn) return;

      return new Promise<void>((resolve, reject) => {
        // Safe, clean lowercase alphabetic-numeric username format required by Agora Chat/EaseMob
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "user_" + Math.floor(Math.random() * 1000);

        // Setup Event Handlers
        conn.addEventHandler("voxa_handler", {
          onConnected: () => {
            loggedIn = true;
            console.log("Agora Chat logged in successfully via secure token");
            resolve();
          },
          onDisconnected: () => {
            loggedIn = false;
            console.log("Agora Chat disconnected");
          },
          onTextMessage: (msg: any) => {
            console.log("Agora Chat Text Message received:", msg);
            onMessage({
              from: msg.from || "Someone",
              text: msg.msg || ""
            });
          },
          onError: (err: any) => {
            console.error("Agora Chat Error event:", err);
            reject(err);
          }
        });

        // Open secure connection with user and token generated server-side
        conn.open({
          user: cleanUsername,
          agoraToken: token
        });
      });
    },
    joinRoom: async (roomId) => {
      if (!conn || !loggedIn) return;
      try {
        // Clean room ID to comply with EaseMob's format
        const cleanRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
        await conn.joinChatRoom({ roomId: cleanRoomId });
        console.log(`Agora Chat joined room: ${cleanRoomId}`);
      } catch (err) {
        console.warn(`Could not join specific Agora ChatRoom: ${roomId}, messages will be sent to fallback broadcast channel.`, err);
      }
    },
    sendMessage: async (roomId, text) => {
      if (!conn || !loggedIn) return;
      try {
        const cleanRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
        const option = {
          chatType: "chatRoom",
          type: "txt",
          to: cleanRoomId,
          msg: text
        };
        const msg = (AgoraChat as any).message.create(option);
        await conn.send(msg);
        console.log("Agora Chat message sent:", text);
      } catch (err) {
        console.warn("Agora Chat sending to room failed, broadcasting via direct message as fallback", err);
        try {
          // Fallback to sending as custom peer message or public message to avoid failure
          const option = {
            chatType: "singleChat",
            type: "txt",
            to: "admin",
            msg: text
          };
          const msg = (AgoraChat as any).message.create(option);
          await conn.send(msg);
        } catch (innerErr) {
          console.error("Agora Chat fallback send failed", innerErr);
        }
      }
    },
    logout: async () => {
      if (!conn) return;
      try {
        conn.close();
        loggedIn = false;
        console.log("Agora Chat closed connection");
      } catch (err) {
        console.error("Error closing Agora Chat", err);
      }
    }
  };
}
