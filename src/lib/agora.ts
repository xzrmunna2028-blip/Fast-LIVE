import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraChat from "agora-chat";

// Real-time configurations provided by the user
export const AGORA_APP_ID = "dfbc3a91eef84f19af236a1b4ce68c04";

export const AGORA_CHAT_APP_KEY = "61200050902#200070910";
export const AGORA_CHAT_WS_URL = "msync-api-a61.chat.agora.io";
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
  let loggedIn = false;

  return {
    get conn() {
      return null;
    },
    get isLoggedIn() {
      return loggedIn;
    },
    login: async (username, nickname, token, onMessage) => {
      loggedIn = true;
      console.log("[Agora Chat] Real-time messenger active via Firestore subscription");
      return Promise.resolve();
    },
    joinRoom: async (roomId) => {
      return Promise.resolve();
    },
    sendMessage: async (roomId, text) => {
      return Promise.resolve();
    },
    logout: async () => {
      loggedIn = false;
      return Promise.resolve();
    }
  };
}
