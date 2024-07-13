import React, { useState, useEffect, FC } from "react";
import styled from "styled-components";
import PowerIndicator from "./PowerIndicator";
import ProgressIndicator from "./ProgressIndicator";
import Timer from "./Timer";
import Instructions from "./Instructions";
import Car from "./Car";
import Road from "./Road";
import Gear from "./Gear";
import { calculateMoveDistance, animateRoad, RESET_POSITION } from "./speed";
import { StyledButton } from "./StyledButton";

const INITIAL_MOVE_DISTANCE = 0.01; // Initial distance to move road on each click

const CountdownText = styled.div`
  font-size: 150px;
  font-family: 'PublicPixel'; // Replace with your actual font
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  text-shadow: 22px 22px 44px white;
  background-color: rgba(0, 0, 0, 0.5); // Black background with 50% opacity
  padding: 40px;
`;

// Define the types for the Telegram user object
interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
}

// Extend the window object to include the onTelegramAuth function
declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

const IndexPage: FC = () => {
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(RESET_POSITION);
  const [clickCount, setClickCount] = useState(0);
  const [moveDistance, setMoveDistance] = useState(INITIAL_MOVE_DISTANCE);
  const [showGear, setShowGear] = useState(false);
  const [showingText, setShowingText] = useState('');
  const [clickEnabled, setClickEnabled] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [verticalBlurLevel, setVerticalBlurLevel] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [carAnimation, setCarAnimation] = useState('');
  const [showBrykaO, setShowBrykaO] = useState(false);
  const [roadOpacity, setRoadOpacity] = useState(0); // Initially 0 for fade-in effect
  const [instructionsOpacity, setInstructionsOpacity] = useState(1); // New state for instructions opacity
  const [powerLevel, setPowerLevel] = useState(0); // State to track power level

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        setShowingText('3');
        setTimeout(() => {
          setShowingText('2');
          setTimeout(() => {
            setShowingText('1');
            setTimeout(() => {
              setShowingText('');
              setClickEnabled(true);
              setStartTime(performance.now());
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    setInstructionsOpacity(0); // Reduce instructions opacity
    setTimeout(() => {
      setShowInstructions(false); // Hide instructions after transition
      setGameStarted(true);
      setRoadOpacity(1); // Start fading in the road and other elements
    }, 750); // Delay to match the opacity transition
  };

  const handleClick = () => {
    if (!clickEnabled) return;

    setClickCount(prevCount => prevCount + 1);
    const newMoveDistance = calculateMoveDistance(clickCount + 1);
    setMoveDistance(newMoveDistance);

    if ((clickCount + 1) % 10 === 0) {
      setShowGear(true);
      setClickEnabled(false);
      setVerticalBlurLevel(prevBlurLevel => {
        const newBlurLevel = prevBlurLevel + 1;
        return newBlurLevel <= 6 ? newBlurLevel : prevBlurLevel;
      });
    }

    if ((clickCount + 1) === 69) {
      setEndTime(performance.now());
      setClickEnabled(false);
      setCarAnimation('car-move-up');
    }

    // Increase power level
    setPowerLevel((prevPowerLevel) => (prevPowerLevel + 1) % 7);
  };

  const handleGearClick = () => {
    setShowGear(false);
    setClickEnabled(true);
    setClickCount(prevCount => prevCount + 1);
    setShowBrykaO(true); // Show brykaO
    setTimeout(() => {
      setShowBrykaO(false); // Hide brykaO after 0.3 seconds
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition1(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
      setPosition2(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
    }, 11); // Approximately 60 frames per second

    return () => clearInterval(interval);
  }, [moveDistance]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes moveUp {
      0% {
        transform: translateX(-50%) translateY(0);
      }
      100% {
        transform: translateX(-50%) translateY(-100vh);
      }
    }

    @keyframes slideDown {
      0% {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
      }
      10% {
        opacity: 0;
      }
      100% {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `;
    document.head.append(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (endTime !== 0) {
      const timeout = setTimeout(() => {
        setRoadOpacity(0);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [endTime]);

  const calculateElapsedTime = () => {
    if (endTime === 0 || startTime === 0) {
      return null;
    }

    const elapsedTime = (endTime - startTime) / 1000;
    return (
      <div style={{
        border: '2px solid white',
        backgroundColor: 'black',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: 4,
        position: 'absolute',
        top: '5%', // Move 50px lower
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        animation: 'slideDown 2s forwards',
        animationDelay: '1s',
        fontSize: '1rem', // Example of larger font size
      }}>
        <StyledButton onClick={() => window.location.reload()} style={{ margin: '15px', cursor: 'pointer' }}>
          Restart
        </StyledButton><br></br><br></br>
        Elapsed Time:<br></br> 
        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{elapsedTime.toFixed(2)}</span> seconds<br></br>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
        <div id="telegram-login-container"></div>
        <StyledButton onClick={() => alert('Show leaderboard!')} style={{ margin: '15px', cursor: 'pointer' }}>
          Leaderboard
        </StyledButton>
      </div>
    );
  };

  useEffect(() => {
    window.onTelegramAuth = function (user: TelegramUser) {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'TapRaceSprint');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    document.getElementById('telegram-login-container')?.appendChild(script);
  }, []);

  return (
    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', height: '100vh' }}>
      {showInstructions && (
        <div style={{ opacity: instructionsOpacity, transition: 'opacity 1s' }}>
          <Instructions onStartGame={handleStartGame} />
        </div>
      )}

      {!showInstructions && (
        <>
          <div style={{ opacity: roadOpacity, transition: 'opacity 1s' }}>
            <Road position1={position1} position2={position2} verticalBlurLevel={verticalBlurLevel} />
          </div>
          {showingText && (
            <CountdownText>{showingText}</CountdownText>
          )}
          <div style={{ opacity: roadOpacity, transition: 'opacity 1s' }}>
            <Car
              clickEnabled={clickEnabled}
              onClick={handleClick}
              carAnimation={carAnimation}
              showBrykaO={showBrykaO}
              powerLevel={powerLevel} // Pass powerLevel to Car component
            />
            <Gear showGear={showGear} onClick={handleGearClick} />
            {gameStarted && endTime === 0 && (
              <>
                <PowerIndicator clickCount={clickCount} />
                <ProgressIndicator clickCount={clickCount} />
                <Timer startTime={startTime} gameStarted={gameStarted} endTime={endTime} />
              </>
            )}
          </div>
        </>
      )}
      {calculateElapsedTime()}
    </div>
  );
};

export default IndexPage;
