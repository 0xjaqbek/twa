import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

dotenv.config();

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDdGHaeIrFIy-Xw_WR_Hl7I7E9Z55tUW_w",
  authDomain: "tapracesprint.firebaseapp.com",
  projectId: "tapracesprint",
  storageBucket: "tapracesprint.appspot.com",
  messagingSenderId: "447540828275",
  appId: "1:447540828275:web:77340961502f57723df206",
  measurementId: "G-6SBRL43LZM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const leaderboardRef = ref(db, 'leaderboard');

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const getLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard...');
    const snapshot = await onValue(leaderboardRef);
    const leaderboard = snapshot.val();
    console.log('Leaderboard:', leaderboard);
    return leaderboard || []; // Return an empty array if no data exists
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error fetching leaderboard:', error);
    }
    return [];
  }
};

export const updateLeaderboard = async (leaderboard: { address: string; time: number; }[]) => {
  try {
    console.log('Updating leaderboard...');
    await set(leaderboardRef, leaderboard);
    console.log('Leaderboard updated successfully.');
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
