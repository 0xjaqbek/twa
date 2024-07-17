// LeaderboardEntry.ts
export interface LeaderboardEntry {
  address: string;
  time: number;
  playerId: string;
  userName: string; // Make userName optional if it's not always present
}