export interface Room {
  id: string;
  name: string;
  status: 'lobby' | 'playing' | 'finished';
  createdAt: any;        // keep `any` for serverTimestamp()
  hostId: string;
  playerCount: number;
}

export interface Player {
  id: string;
  displayName: string;
  joinedAt: any;
  isHost: boolean;
  isReady: boolean;
  role: 'resistance' | 'spy' | null;
}