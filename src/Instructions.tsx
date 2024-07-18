import React, { useState } from "react";
import { StyledButton } from "./StyledButton";
import LeaderboardPage from "./LeaderboardPage";

interface InstructionsProps {
  onStartGame: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onStartGame }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleShowInstructions = () => {
    setShowInstructions(true);
    setShowLeaderboard(false);
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    setShowInstructions(false);
  };

  const handleCloseModal = () => {
    setShowInstructions(false);
    setShowLeaderboard(false);
  };

  return (
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
      fontSize: '0.8rem',
    }}>
      <div style={{
        backgroundColor: 'black',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        textAlign: 'center',
        fontSize: '0.7rem',
      }}>
        <h1 style={{textShadow: '5px 5px  rgba(255, 255, 255, 0.5)', fontSize: '1.2rem', padding: '15px' }}>TapRaceSprint</h1><br></br>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <StyledButton onClick={handleShowInstructions}>Instructions</StyledButton><br></br>
          <StyledButton onClick={handleShowLeaderboard}>Leaderboard</StyledButton><br></br>
          <StyledButton onClick={onStartGame}>Start Game</StyledButton><br></br>
        </div>
        {showInstructions && (
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
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'black',
              padding: '20px',
              borderRadius: '10px',
              maxWidth: '80%',
              textAlign: 'center',
              fontSize: '0.7rem',
            }}>
              <h2 style={{ fontSize: '1.0rem' }}>How to play:</h2>
              <ol style={{ fontSize: '0.6rem' }}>
                <li>Click on the car image to move forward.</li><br></br>
                <li>Every 10 clicks will reveal the gear that disables clicking on the car.</li><br></br>
                <li>Click on the gear image to activate further car clicks.</li><br></br>
                <li>Your goal is to reach 69 clicks as fast as possible!</li><br></br>
              </ol>
              <StyledButton onClick={handleCloseModal}>Close</StyledButton>
            </div>
          </div>
        )}
        {showLeaderboard && <LeaderboardPage elapsedTime={0} onClose={handleCloseModal} userId={null} firstName={""} userName={""} lastName={""} />}
      </div>
    </div>
  );
};

export default Instructions;
