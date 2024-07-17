// SaveScoreWindow.tsx
import React from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";

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


interface SaveScoreWindowProps {
  onClose: () => void;
  onSave: () => void;
}

export const SaveScoreWindow: React.FC<SaveScoreWindowProps> = ({ onClose, onSave }) => {
  return (
    <SaveScoreWindowContainer>
      <SaveScoreWindowContent>
        <p>Connect your wallet to set user Id and save your score:</p>
        <TonConnectButton />
        <StyledButton onClick={onSave} style={{ marginTop: '10px' }}>Save Score</StyledButton>
        <StyledButton onClick={onClose} style={{ marginTop: '10px' }}>Close</StyledButton>
      </SaveScoreWindowContent>
    </SaveScoreWindowContainer>
  );
};
