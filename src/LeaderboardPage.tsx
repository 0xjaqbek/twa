// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { getLeaderboard, updateLeaderboard, LeaderboardEntry } from './gistService'; // Ensure LeaderboardEntry is imported
import { SaveScoreWindow } from './SaveScoreWindow';
import { LeaderboardList, LeaderboardItem } from './LeaderboardList';
import { LeaderboardContainer, LeaderboardContent, ActionsContainer, ElapsedTime, StyledButtonSecondary } from './styles'; // Styled components from styles.ts
import { formatAddress } from './FormatAddress';

interface LeaderboardPageProps {
  elapsedTime: number;
  onClose: () => void;
  userId: string | null;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose, userId }) => {
  const rawAddress = useTonAddress(true); // Assume useTonAddress returns a string or empty string ('') if not available
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSaveScoreWindow, setShowSaveScoreWindow] = useState(false);
  const [nick, setNick] = useState('');
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
    };
    fetchLeaderboard();
  }, []);

  const handleSaveScore = () => {
    setShowSaveScoreWindow(true);
  };

  const handleCloseSaveScoreWindow = () => {
    setShowSaveScoreWindow(false);
  };

  const handleNextPage = () => {
    setPageIndex(prevPageIndex => prevPageIndex + 1);
  };

  const handlePrevPage = () => {
    setPageIndex(prevPageIndex => Math.max(prevPageIndex - 1, 0));
  };

  const handleSaveScoreConfirm = async () => {
    try {
      if (!userId && !rawAddress) {
        alert("Please open in Telegram App or connect your wallet.");
        return;
      }
      if (!nick) {
        alert("Please enter a nickname.");
        return;
      }
  
      const newScore: LeaderboardEntry = {
        address: rawAddress || '',
        time: elapsedTime,
        playerId: userId || '',
        nick: nick,
      };
  
      const nicknameExists = leaderboard.some(entry => entry.nick === nick && entry.playerId !== userId);
      if (nicknameExists) {
        alert("This nickname is already taken by another user.");
        return;
      }
  
      const existingScore = leaderboard.find(score => score.address === rawAddress || score.playerId === userId);
      if (existingScore) {
        if (elapsedTime < existingScore.time) {
          const updatedLeaderboard = leaderboard.map(score =>
            (score.address === rawAddress || score.playerId === userId) ? newScore : score
          );
          setLeaderboard(updatedLeaderboard);
          await updateLeaderboard(updatedLeaderboard);
          console.log(`Wallet Address: ${rawAddress}`);
          console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
        } else {
          const timeDifference = (elapsedTime - existingScore.time).toFixed(2);
          alert(`You were slower by ${timeDifference} seconds than your best.`);
        }
      } else {
        const updatedLeaderboard = [...leaderboard, newScore];
        setLeaderboard(updatedLeaderboard);
        await updateLeaderboard(updatedLeaderboard);
        console.log(`Wallet Address: ${rawAddress}`);
        console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
      }
      setShowSaveScoreWindow(false);
    } catch (error) {
      console.error("Error saving score:", error);
      // Handle error saving score
    }
  };

  const getTopScores = (scores: LeaderboardEntry[]): LeaderboardEntry[] => {
    const highestScores = scores.reduce((acc, score) => {
      const key = score.address || score.playerId;
      if (!acc[key] || acc[key].time > score.time) {
        acc[key] = score;
      }
      return acc;
    }, {} as Record<string, LeaderboardEntry>);

    const sortedScores = Object.values(highestScores).sort((a, b) => a.time - b.time);
    return sortedScores;
  };

  const topScores: LeaderboardEntry[] = getTopScores(leaderboard);
  const paginatedScores: LeaderboardEntry[] = topScores.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        {elapsedTime > 0 && (
          <>
            <ElapsedTime>Your current time:<br />{elapsedTime.toFixed(2)} seconds</ElapsedTime>
            <ActionsContainer>
              <StyledButton onClick={handleSaveScore}>Save Score</StyledButton>
            </ActionsContainer>
          </>
        )}
        <h1>Top</h1>
        <ActionsContainer>
          {pageIndex > 0 && (
            <StyledButtonSecondary onClick={handlePrevPage}>Previous</StyledButtonSecondary>
          )}
        </ActionsContainer>
        <LeaderboardList>
          {paginatedScores.map((entry: LeaderboardEntry, index: number) => (
            <LeaderboardItem key={index}>
              {pageIndex * itemsPerPage + index + 1}. {entry.nick || formatAddress(entry.address)} - {entry.time.toFixed(2)} seconds
            </LeaderboardItem>
          ))}
        </LeaderboardList>
        <ActionsContainer>
          {(pageIndex + 1) * itemsPerPage < topScores.length && (
            <StyledButtonSecondary onClick={handleNextPage}>Next</StyledButtonSecondary>
          )}
        </ActionsContainer>
        <ActionsContainer>
          <StyledButton onClick={onClose}>Close</StyledButton>
        </ActionsContainer>
      </LeaderboardContent>
      {showSaveScoreWindow && (
        <SaveScoreWindow
          onClose={handleCloseSaveScoreWindow}
          onSave={handleSaveScoreConfirm}
          nick={nick}
          setNick={setNick}
        />
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
