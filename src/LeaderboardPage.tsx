import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "./components/styled/styled";
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
  color: black;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ElapsedTime = styled.p`
  font-size: 10px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1em;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const LeaderboardList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const LeaderboardItem = styled.li`
  font-size: 10px;
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const StyledButtonSecondary = styled(StyledButton)`
  background-color: #4CAF50; /* Green */
  border: none;
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
  color: black;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose }) => {
  const rawAddress = useTonAddress(false); // false for raw address
  const [leaderboard, setLeaderboard] = useState<{ address: string; time: number }[]>([]);
  const [topScores, setTopScores] = useState<{ address: string; time: number }[]>([]);
  const [showSaveScoreWindow, setShowSaveScoreWindow] = useState(false);
  const [visibleRange, setVisibleRange] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
      const topScores = getTopScores(scores, visibleRange); // Get top scores based on visibleRange
      setTopScores(topScores);
    };
    fetchLeaderboard();
  }, [visibleRange]);

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
          alert(`Sorry, you were slower by ${timeDifference} seconds.`);
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

  const getTopScores = (scores: { address: string; time: number }[], count: number) => {
    // Filter to keep only the highest score per address
    const highestScores = scores.reduce((acc, score) => {
      if (!acc[score.address] || acc[score.address].time > score.time) {
        acc[score.address] = score;
      }
      return acc;
    }, {} as Record<string, { address: string; time: number }>);
    
    const sortedScores = Object.values(highestScores)
      .sort((a, b) => a.time - b.time) // Sort ascending by time
      .slice(0, count); // Take top 'count' scores
    
    return sortedScores;
  };

  const formatAddress = (address: string) => {
    if (address.length <= 9) return address;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  const handleShowTopScores = async () => {
    try {
      // Fetch leaderboard data from the GitHub Gist
      const leaderboardData = await getLeaderboard();
      
      // Calculate top 10 scores from the fetched data (assuming getTopScores is defined elsewhere)
      const topScores = getTopScores(leaderboardData, 10); // Adjust getTopScores based on your implementation
      
      // Set the topScores state with the calculated top scores
      setTopScores(topScores);
    } catch (error) {
      console.error('Error fetching or processing leaderboard:', error);
      // Handle error appropriately
    }
  };

  const handleScrollDown = () => {
    setVisibleRange(prevRange => prevRange + 10);
  };

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        <ElapsedTime>Your Time: {elapsedTime.toFixed(2)} seconds</ElapsedTime>
        <FlexBoxRow>
          <Button>
            {/* Additional content if needed */}
          </Button>
        </FlexBoxRow>
        <ActionsContainer>
          <StyledButton onClick={handleSaveScore} style={{ marginBottom: '10px' }}>Save Score</StyledButton>
          <StyledButton onClick={onClose}>Close</StyledButton>
          <StyledButtonSecondary onClick={handleShowTopScores}>Top Scores</StyledButtonSecondary>
        </ActionsContainer>
        <LeaderboardList>
          {topScores.map((entry, index) => (
            <LeaderboardItem key={index}>
              Address: {formatAddress(entry.address)}, Time: {entry.time.toFixed(2)} seconds
            </LeaderboardItem>
          ))}
        </LeaderboardList>
        <StyledButtonSecondary onClick={handleScrollDown}>Load More</StyledButtonSecondary>
      </LeaderboardContent>
      {showSaveScoreWindow && (
        <SaveScoreWindowContainer>
          <SaveScoreWindowContent>
            <p>Connect your wallet to get user Id and save your score:</p>
            <TonConnectButton />
            <StyledButton onClick={handleSaveScoreConfirm} style={{ marginTop: '10px' }}>Save Score</StyledButton>
          </SaveScoreWindowContent>
        </SaveScoreWindowContainer>
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
