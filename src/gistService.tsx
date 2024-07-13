import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GIST_ID = 'c21b8e37060a00aadcae5f277543ef0c';  // Example Gist ID
const GITHUB_TOKEN = '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';  // Example GitHub Token

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,  // Use "Bearer" instead of "token"
    'Content-Type': 'application/json',
  },
});

export const getLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard...');
    const response = await apiClient.get(`/gists/${GIST_ID}`);
    console.log('Response from GitHub API:', response);
    const leaderboard = JSON.parse(response.data.files['leaderboard.json'].content);
    console.log('Leaderboard:', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const updateLeaderboard = async (leaderboard: { address: string; time: number; }[]) => {
  try {
    console.log('Updating leaderboard...');
    const content = JSON.stringify(leaderboard, null, 2);
    console.log('New leaderboard content:', content);
    const response = await apiClient.patch(`/gists/${GIST_ID}`, {
      files: {
        'leaderboard.json': {
          content,
        },
      },
    });
    console.log('Response from GitHub API:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return null;
  }
};
