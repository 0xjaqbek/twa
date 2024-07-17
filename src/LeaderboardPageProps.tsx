// LeaderboardPageProps.tsx

export interface LeaderboardPageProps {
    elapsedTime: number;
    onClose: () => void;
    userId: string | null;
    showLeaderboard: boolean;
  }
  