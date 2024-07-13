import React from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "./components/styled/styled";
import { useTonAddress } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";

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
`;

const LeaderboardContent = styled.div`
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
`;

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose }) => {
  const userFriendlyAddress = useTonAddress(true); // true for user-friendly address
  const rawAddress = useTonAddress(false); // false for raw address

  const handleSaveScore = () => {
    if (rawAddress) {
      console.log(`Wallet Address: ${rawAddress}`);
      console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
    } else {
      alert("Please connect your wallet first.");
    }
  };

  return (
    <LeaderboardContainer>
        <br></br>
      <LeaderboardContent>
        <StyledButton onClick={onClose} style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          Close Leaderboard
        </StyledButton>
        <br></br>
        <p style={{ textAlign: 'center' }}>Your Time: {elapsedTime.toFixed(2)} seconds</p>
        <br></br>
        <FlexBoxRow>
          <TonConnectButton />
          <Button>

          </Button>
        </FlexBoxRow>
        <StyledButton onClick={handleSaveScore} style={{ position: 'absolute', top: '10px', right: '10px' }}>Save Score</StyledButton>
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
