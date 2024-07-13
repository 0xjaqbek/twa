import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GIST_ID = 'c21b8e37060a00aadcae5f277543ef0c';
const GITHUB_TOKEN = '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';

if (!GITHUB_TOKEN) {
  throw new Error('GitHub token not found. Please set the GITHUB_TOKEN environment variable.');
}

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,  // Use "token" instead of "Bearer"
    'Content-Type': 'application/json',
  },
});

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

export const getLeaderboard = async () => {
  try {
    console.log('Fetching leaderboard...');
    const response = await apiClient.get(`/gists/${GIST_ID}`);
    console.log('Response from GitHub API:', response.data);
    const leaderboard = JSON.parse(response.data.files['leaderboard.json'].content);
    console.log('Leaderboard:', leaderboard);
    return leaderboard;
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
    const content = JSON.stringify(leaderboard, null, 2);
    console.log('New leaderboard content:', content);
    const response = await apiClient.patch(`/gists/${GIST_ID}`, {
      files: {
        'leaderboard.json': {
          content,
        },
      },
    });
    console.log('Response from GitHub API:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Error updating leaderboard:', error.response ? error.response.data : error.message);
    } else {
      console.error('Unexpected error updating leaderboard:', error);
    }
    return null;
  }
};
