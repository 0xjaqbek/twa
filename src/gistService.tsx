import axios from 'axios';
require('dotenv').config();


const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const getLeaderboard = async () => {
  try {
    const response = await apiClient.get(`/gists/${GIST_ID}`);
    const leaderboard = JSON.parse(response.data.files['leaderboard.json'].content);
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const updateLeaderboard = async (leaderboard: { address: string; time: number }[]) => {
  try {
    const content = JSON.stringify(leaderboard, null, 2);
    const response = await apiClient.patch(`/gists/${GIST_ID}`, {
      files: {
        'leaderboard.json': {
          content,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return null;
  }
};
