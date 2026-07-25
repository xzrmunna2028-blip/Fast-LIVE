export interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  volume: number;
  agoraUid?: number;
}
