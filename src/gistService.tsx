import axios, { AxiosError } from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, runTransaction } from 'firebase/database';

// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDdGHaeIrFIy-Xw_WR_Hl7I7E9Z55tUW_w",
    authDomain: "tapracesprint.firebaseapp.com",
    projectId: "tapracesprint",
    storageBucket: "tapracesprint.appspot.com",
    messagingSenderId: "447540828275",
    appId: "1:447540828275:web:77340961502f57723df206",
    measurementId: "G-6SBRL43LZM",
    databaseURL: "https://tapracesprint-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase references
const leaderboardRef = ref(db, 'leaderboard');
const usersRef = ref(db, 'users');

// Function to check if error is AxiosError
const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export interface LeaderboardEntry {
  address: string;
  time: number;
  playerId: string;
  userName: string;
}

// Fetch leaderboard function
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const snapshot = await get(leaderboardRef);
  const data = snapshot.val();
  return data ? Object.values(data) : [];
};

// Update leaderboard function
export const updateLeaderboard = async (leaderboard: LeaderboardEntry[]): Promise<void> => {
  const updates: Record<string, LeaderboardEntry> = {};
  leaderboard.forEach((entry, index) => {
    updates[`entry_${index}`] = entry;
  });
  await set(leaderboardRef, updates);
};

// Function to create or update leaderboard entry with transaction
export const createOrUpdateLeaderboardEntry = async (
  address: string,
  time: number,
  playerId: string,
  userName: string,
  firstName: string
): Promise<void> => {
  const effectiveUserName = userName || firstName;
  const newEntry: LeaderboardEntry = {
    address,
    time,
    playerId,
    userName: effectiveUserName
  };

  await runTransaction(leaderboardRef, (currentData) => {
    if (currentData) {
      const currentLeaderboard: LeaderboardEntry[] = Object.values(currentData);

      const existingEntryIndex = currentLeaderboard.findIndex(entry => entry.playerId === playerId || entry.address === address);

      if (existingEntryIndex >= 0) {
        if (time < currentLeaderboard[existingEntryIndex].time) {
          currentLeaderboard[existingEntryIndex] = newEntry;
        }
      } else {
        currentLeaderboard.push(newEntry);
      }

      const updates: Record<string, LeaderboardEntry> = {};
      currentLeaderboard.forEach((entry, index) => {
        updates[`entry_${index}`] = entry;
      });
      return updates;
    } else {
      const updates: Record<string, LeaderboardEntry> = { entry_0: newEntry };
      return updates;
    }
  });
};
