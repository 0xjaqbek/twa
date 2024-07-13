// LeaderboardPage.tsx

import React from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';

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
  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        <StyledButton onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          Close Leaderboard
        </StyledButton>
        <h2 style={{ textAlign: 'center' }}>Leaderboard</h2>
        <p style={{ textAlign: 'center' }}>Elapsed Time: {elapsedTime.toFixed(2)} seconds</p>
        {/* Add your leaderboard content here */}
      </LeaderboardContent>
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
