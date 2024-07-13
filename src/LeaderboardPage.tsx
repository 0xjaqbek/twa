import React from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
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
  const { network } = useTonConnect();

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        <StyledButton onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          Close Leaderboard
        </StyledButton>
        <h2 style={{ textAlign: 'center' }}>Leaderboard</h2>
        <p style={{ textAlign: 'center' }}>Elapsed Time: {elapsedTime.toFixed(2)} seconds</p>
        <FlexBoxRow>
          <TonConnectButton />
          <Button>
            {network
              ? network === CHAIN.MAINNET
                ? "mainnet"
                : "testnet"
              : "N/A"}
          </Button>
        </FlexBoxRow>
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
