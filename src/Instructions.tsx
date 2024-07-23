import React, { useState, useEffect } from "react";
import { StyledButton } from "./StyledButton";
import LeaderboardPage from "./LeaderboardPage";
import bryka from './bryka.png';  // Adjust the path as needed
import gear from './gear.png';    // Adjust the path as needed
import logo from './Logo2.png';


interface InstructionsProps {
  onStartGame: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onStartGame }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [brykaPulseCount, setBrykaPulseCount] = useState(0);
  const [gearVisible, setGearVisible] = useState(false);

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

  useEffect(() => {
    let brykaInterval: NodeJS.Timeout;
    let gearTimeout: NodeJS.Timeout;

    const startBrykaInterval = () => {
      brykaInterval = setInterval(() => {
        setBrykaPulseCount((prev) => {
          if (prev === 8) {
            setGearVisible(true);
            clearInterval(brykaInterval);

            gearTimeout = setTimeout(() => {
              setGearVisible(false);
              setBrykaPulseCount(0);
              startBrykaInterval();
            }, 800);

            return prev;
          } else {
            return prev + 1;
          }
        });
      }, 300);
    };

    if (showInstructions) {
      startBrykaInterval();
    }

    return () => {
      clearInterval(brykaInterval);
      clearTimeout(gearTimeout);
    };
  }, [showInstructions]);

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
        <h1 style={{ textShadow: '5px 5px  rgba(255, 255, 255, 0.5)', fontSize: '1.2rem', padding: '15px' }}>TapRaceSprint</h1><br></br>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <StyledButton onClick={handleShowInstructions}>Instructions</StyledButton><br></br>
          <StyledButton onClick={handleShowLeaderboard}>Leaderboard</StyledButton><br></br>
          <StyledButton onClick={onStartGame}>Start Game</StyledButton><br></br>
          <a href="https://t.me/+ANrGz3PBoA5hYzhk" target="_blank" rel="noopener noreferrer">
            <img
              src={logo}
              alt="Chat Link (Link to Telegram)"
              style={{ width: '75px', height: '75px', marginRight: '20px' }}
            />
          </a>
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
              <div className="animated-images" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <div style={{ height: '100px', position: 'relative' }}>
                  {gearVisible && (
                    <img src={gear} className="gear-animation" alt="gear" style={{
                      height: '55px',
                      position: 'absolute',
                      top: 0,
                      left: -25,
                      right: 100,
                      bottom: 0,
                      margin: 'auto',
                      animation: 'appear-disappear 0.8s',
                    }} />
                  )}
                </div>
                <img src={bryka} className="bryka-animation" alt="bryka" style={{
                  height: '100px',
                  animation: gearVisible ? 'none' : 'clicking 0.3s infinite',
                }} />
              </div>
              <StyledButton onClick={handleCloseModal}>Close</StyledButton>
            </div>
          </div>
        )}
        {showLeaderboard && <LeaderboardPage elapsedTime={0} onClose={handleCloseModal} userId={null} firstName={""} userName={""} lastName={""} />}
      </div>

      <style>{`
        @keyframes clicking {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(0.95);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes appear-disappear {
          0%, 100% {
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
            transform: scale(1);
          }
          60% {
            transform: scale(1);
          }
          75% {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default Instructions;
