// types/game.ts
export type GameStatus = 'playing' | 'completed' | 'backlog' | 'wishlist';

export interface Game {
  id: string;
  title: string;
  status: GameStatus;
  hoursPlayed: number;
  coverUrl?: string;
  platform?: string;
  genre?: string;
  rating?: number;
  notes?: string;
  createdAt?: string;
}