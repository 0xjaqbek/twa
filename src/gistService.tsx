// gistService.ts
import axios, { AxiosError } from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update } from 'firebase/database';

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

// Fetch leaderboard function
export const getLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard...');
    const snapshot = await get(leaderboardRef);
    const leaderboard = snapshot.val();
    console.log('Leaderboard:', leaderboard);
    return leaderboard || [];
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error fetching leaderboard:', error);
    }
    return [];
  }
};

// Update leaderboard function
export const updateLeaderboard = async (leaderboard: LeaderboardEntry[]) => {
  try {
    console.log('Updating leaderboard...');
    await set(leaderboardRef, leaderboard);
    console.log('Leaderboard updated successfully.');

    // Update user scores
    for (const entry of leaderboard) {
      if (!entry.address) {
        continue; // Skip if address is missing or null
      }
      const userRef = ref(db, `users/${entry.address}`);
      const userSnapshot = await get(userRef);
      const existingScores = userSnapshot.exists() ? userSnapshot.val().scores : [];
      const newScores = [...existingScores, { time: entry.time, timestamp: new Date().toISOString() }];
      await update(userRef, { scores: newScores, nick: entry.nick });
    }

    return true;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Error updating leaderboard:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error updating leaderboard:', error);
    }
    return false;
  }
};

// Export other necessary functions or interfaces as needed
export interface LeaderboardEntry {
  playerId: string;
  address: string;
  time: number;
  nick?: string;
}