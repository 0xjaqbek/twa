import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';

dotenv.config();

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

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const leaderboardRef = ref(db, 'leaderboard');
const usersRef = ref(db, 'users'); 

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const getLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard...');
    // Use onValue correctly with a callback
    onValue(leaderboardRef, (snapshot) => {
      const leaderboard = snapshot.val();
      console.log('Leaderboard:', leaderboard);
      // Do something with the leaderboard data here
    });
    // Return an empty array or a promise that resolves with the leaderboard data
    return []; 
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
    // Use update() to merge new entries into the existing leaderboard
    await update(leaderboardRef, leaderboard);
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

// Added this part
onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  console.log('Data:', data);
  // Do something with the users data here
});
