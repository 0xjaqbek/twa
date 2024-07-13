import React from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxRow } from "./components/styled/styled";
import { useTonAddress } from "@tonconnect/ui-react";
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

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose }) => {
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
      <LeaderboardContent>
        <ElapsedTime>Your Time: {elapsedTime.toFixed(2)} seconds</ElapsedTime>
        <FlexBoxRow>
          <TonConnectButton />
          <Button>
            {/* You can add any additional content or leave it empty if not needed */}
          </Button>
        </FlexBoxRow>
        <ActionsContainer>
          <StyledButton onClick={handleSaveScore} style={{ marginBottom: '10px' }}>Save Score</StyledButton>
          <StyledButton onClick={onClose}>Close</StyledButton>
        </ActionsContainer>
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
