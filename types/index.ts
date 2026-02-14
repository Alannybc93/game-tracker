// types/index.ts
export interface Game {
  id: string;
  title: string;
  platform: 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo' | 'Mobile';
  status: 'playing' | 'completed' | 'backlog' | 'wishlist';
  rating: number;
  hours: number;
  notes?: string;
  coverUrl?: string;
  createdAt: Date;
}

export type Platform = Game['platform'];
export type Status = Game['status'];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoritePlatform?: Platform;
  totalHours: number;
  gamesCount: number;
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'daily_reminder' | 'game_suggestion' | 'achievement';
  read: boolean;
  createdAt: Date;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  dailyReminderTime: string;
  theme: 'dark' | 'light' | 'auto';
  defaultPlatform: Platform;
}

export interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type?: string;
  base64?: string;
}