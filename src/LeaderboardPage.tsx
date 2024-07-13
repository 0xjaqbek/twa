import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "./components/styled/styled";
import { useTonAddress } from "@tonconnect/ui-react";
import "@twa-dev/sdk";
import { getLeaderboard, updateLeaderboard } from './gistService';

interface LeaderboardPageProps {
  elapsedTime: number;
  onClose: () => void;
}

const LeaderboardContainer = styled.div`
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

const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ElapsedTime = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2em;
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
`;

const LeaderboardItem = styled.li`
  margin: 10px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose }) => {
  const rawAddress = useTonAddress(false); // false for raw address
  const [leaderboard, setLeaderboard] = useState<{ address: string; time: number }[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
    };
    fetchLeaderboard();
  }, []);

  const handleSaveScore = async () => {
    if (rawAddress) {
      const newScore = { address: rawAddress, time: elapsedTime };
      const updatedLeaderboard = [...leaderboard, newScore];
      setLeaderboard(updatedLeaderboard);
      await updateLeaderboard(updatedLeaderboard);
      console.log(`Wallet Address: ${rawAddress}`);
      console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
    } else {
      alert("Please connect your wallet first.");
    }
  };

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        <Header>Leaderboard</Header>
        <ElapsedTime>Your Time: {elapsedTime.toFixed(2)} seconds</ElapsedTime>
        <FlexBoxRow>
          <TonConnectButton />
          <Button>
            {/* You can add any additional content or leave it empty if not needed */}
          </Button>
        </FlexBoxRow>
        <ActionsContainer>
          <StyledButton onClick={handleSaveScore} style={{ marginBottom: '10px' }}>Save Score</StyledButton>
          <StyledButton onClick={onClose}>Close Leaderboard</StyledButton>
        </ActionsContainer>
        <LeaderboardList>
          {leaderboard.map((entry, index) => (
            <LeaderboardItem key={index}>
              Address: {entry.address}, Time: {entry.time.toFixed(2)} seconds
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
