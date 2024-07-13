// Instructions.tsx
import React from "react";
import { StyledButton } from "./StyledButton";

interface InstructionsProps {
  onStartGame: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onStartGame }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    fontSize: '0.8rem', // Reduce font size for the entire overlay
  }}>
    <div style={{
      backgroundColor: 'black',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '80%',
      textAlign: 'center',
      fontSize: '0.7rem', // Reduce font size for the instruction box
    }}>
      <h1 style={{ fontSize: '1.2rem' }}>TapRaceSprint</h1>
      <p style={{ fontSize: '0.8rem' }}>TEST</p> {/* Slightly larger paragraph */}
      <ol style={{ fontSize: '0.6rem' }}> {/* Smaller list */}
        <li>Click on the car image to move forward.</li><br></br>
        <li>Every 10 clicks will reveal the gear that disables clicking on the car.</li><br></br>
        <li>Click on the gear image to activate further car clicks.</li><br></br>
        <li>Your goal is to reach 69 clicks as fast as possible.</li><br></br>
      </ol>
      <p style={{ fontSize: '0.5rem' }}>When you're ready click</p><br></br> {/* Slightly larger paragraph */}
      <StyledButton onClick={onStartGame}>Start Game</StyledButton>
    </div>
  </div>
);

export default Instructions;
