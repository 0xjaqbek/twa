import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { getLeaderboard, updateLeaderboard } from './gistService';

interface LeaderboardPageProps {
  elapsedTime: number;
  onClose: () => void;
}

const LeaderboardContainer = styled.div`
  font-size: 10px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeaderboardContent = styled.div`
  border: 1px solid #ddd;
  color: white;
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ElapsedTime = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5em;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
    background-color: black;
`;

const LeaderboardList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: black;
`;

const LeaderboardItem = styled.li`
  font-size: 13px;
  color: white;
  margin: 10px 0;
  padding: 10px;
  background-color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const StyledButtonSecondary = styled(StyledButton)`
  background-color: gray; /* Green */
  border: 2px solid;
  border-color: #CCCCCC;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: 10px;
  cursor: pointer;
`;

const SaveScoreWindowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveScoreWindowContent = styled.div`
  color: white;
  background-color: black;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose }) => {
  const rawAddress = useTonAddress(true); // false for raw address
  const [leaderboard, setLeaderboard] = useState<{ address: string; time: number }[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSaveScoreWindow, setShowSaveScoreWindow] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
    };
    fetchLeaderboard();
  }, []);

  const handleSaveScore = async () => {
    setShowSaveScoreWindow(true);
  };

  const handleSaveScoreConfirm = async () => {
    if (rawAddress) {
      const existingScore = leaderboard.find(score => score.address === rawAddress);
      if (existingScore) {
        if (elapsedTime < existingScore.time) {
          const updatedLeaderboard = leaderboard.map(score => 
            score.address === rawAddress ? { address: rawAddress, time: elapsedTime } : score
          );
          setLeaderboard(updatedLeaderboard);
          await updateLeaderboard(updatedLeaderboard);
          console.log(`Wallet Address: ${rawAddress}`);
          console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
        } else {
          const timeDifference = (elapsedTime - existingScore.time).toFixed(2);
          alert(`Eee, slower by ${timeDifference} seconds than before.`);
        }
      } else {
        const newScore = { address: rawAddress, time: elapsedTime };
        const updatedLeaderboard = [...leaderboard, newScore];
        setLeaderboard(updatedLeaderboard);
        await updateLeaderboard(updatedLeaderboard);
        console.log(`Wallet Address: ${rawAddress}`);
        console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
      }
      setShowSaveScoreWindow(false);
    } else {
      alert("Please connect your wallet first.");
    }
  };

  const getTopScores = (scores: { address: string; time: number }[]) => {
    // Filter to keep only the highest score per address
    const highestScores = scores.reduce((acc, score) => {
      if (!acc[score.address] || acc[score.address].time > score.time) {
        acc[score.address] = score;
      }
      return acc;
    }, {} as Record<string, { address: string; time: number }>);

    const sortedScores = Object.values(highestScores)
      .sort((a, b) => a.time - b.time); // Sort ascending by time

    return sortedScores;
  };

  const formatAddress = (address: string) => {
    if (address.length <= 9) return address;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  const handleNextPage = () => {
    setPageIndex(prevPageIndex => prevPageIndex + 1);
  };

  const handlePrevPage = () => {
    setPageIndex(prevPageIndex => Math.max(prevPageIndex - 1, 0));
  };

  const handleCloseSaveScoreWindow = () => {
    setShowSaveScoreWindow(false);
  };

  const topScores = getTopScores(leaderboard);
  const paginatedScores = topScores.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        {elapsedTime > 0 && (
          <>
            <ElapsedTime style={{ marginBottom: '20px' }}>Your current time:<br></br>{elapsedTime.toFixed(2)} seconds</ElapsedTime>
            <ActionsContainer>
              <StyledButton onClick={handleSaveScore} style={{ marginBottom: '10px' }}>Save Score</StyledButton>
            </ActionsContainer>
          </>
        )}
        <h1 style={{ color: 'white' }}>Top</h1>
        <ActionsContainer>
          {pageIndex > 0 && (
            <StyledButtonSecondary onClick={handlePrevPage}>Previous</StyledButtonSecondary>
          )}
        </ActionsContainer>
        <LeaderboardList>
          {paginatedScores.map((entry, index) => (
            <LeaderboardItem key={index}>
              {pageIndex * itemsPerPage + index + 1}. {formatAddress(entry.address)} - {entry.time.toFixed(2)} seconds
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
        <SaveScoreWindowContainer>
          <SaveScoreWindowContent>
            <p>Connect your wallet to set user Id and save your score:</p>
            <TonConnectButton /><br></br>
            <StyledButton onClick={handleSaveScoreConfirm} style={{ marginTop: '10px' }}>Save Score</StyledButton><br></br><br></br><br></br>
            <StyledButton onClick={handleCloseSaveScoreWindow} style={{ marginTop: '10px' }}>Close</StyledButton><br></br>
          </SaveScoreWindowContent>
        </SaveScoreWindowContainer>
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
