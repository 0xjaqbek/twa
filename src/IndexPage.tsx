import React, { useState, useEffect, FC } from "react";
import styled, { keyframes } from 'styled-components';
import PowerIndicator from "./PowerIndicator";
import ProgressIndicator from "./ProgressIndicator";
import Timer from "./Timer";
import Instructions from "./Instructions";
import Car from "./Car";
import Road from "./Road";
import Gear from "./Gear";
import LeaderboardPage from "./LeaderboardPage";
import { calculateMoveDistance, animateRoad, RESET_POSITION } from "./speed";
import { StyledButton } from "./StyledButton";
import { LeaderboardPageProps } from './LeaderboardPageProps';
import { createOrUpdateLeaderboardEntry } from './gistService';
import { useNavigate } from 'react-router-dom';

const INITIAL_MOVE_DISTANCE = 0.01;

const blink = keyframes`
  0% { background-color: rgba(255, 255, 255, 0.0); }
  100% { background-color: rgba(255, 255, 255, 1); }
`;

const CountdownText = styled.div`
  font-size: 150px;
  font-family: 'PublicPixel';
  color: black;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  text-shadow: 22px 22px 10px white;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 1500px 1600px;
  animation: ${blink} 1s infinite;
`;

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
  const [roadOpacity, setRoadOpacity] = useState(0);
  const [carOpacity, setCarOpacity] = useState(0);
  const [instructionsOpacity, setInstructionsOpacity] = useState(1);
  const [powerLevel, setPowerLevel] = useState(0);
  const [firstName, setFirstName] = useState<string>('');
  const [onTelegram, setOnTelegram] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();
      document.documentElement.addEventListener('touchmove', function(event) {
        event.preventDefault();
      }, { passive: false });

      const searchParams = new URLSearchParams(tg.initData);
      const user = searchParams.get('user');
      
      if (user) {
        const userObj = JSON.parse(user);
        setOnTelegram(true);
        setUserId(userObj.id);
        setFirstName(userObj.first_name || '');
        setLastName(userObj.last_name || '');
        setUserName(userObj.username || '');

        const mainButton = tg.MainButton;
        mainButton.setText("Race OnChain");
        mainButton.show();
        mainButton.onClick(() => {
          navigate('/onChain'); // Use navigate function to change route
        });
      } else {
        setOnTelegram(false);
        setUserId(null);
        setFirstName('');
        setUserName('');
        setLastName('');
      }
    } else {
      setOnTelegram(false);
      setUserId(null);
      setFirstName('');
      setUserName('');
      setLastName('');
    }
  }, [navigate]);

  useEffect(() => {
    if (onTelegram && userId) {
      console.log(`User ID: ${userId}`);
      console.log(`First Name: ${firstName}`);
      console.log(`User Name: ${userName}`);
      console.log(`Last Name: ${lastName}`);
    } else {
      console.log('Error: user data unavailable!');
    }
  }, [onTelegram, userId]);

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
      }, 100);
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    setInstructionsOpacity(0);
    setTimeout(() => {
      setShowInstructions(false);
      setGameStarted(true);
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.MainButton.hide();
      }

      setTimeout(() => {
        setCarOpacity(1);
      }, 1500);

      setTimeout(() => {
        setRoadOpacity(1);
      }, 500);
    }, 750);
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

    setPowerLevel(prevPowerLevel => (prevPowerLevel + 1) % 7);
  };

  const handleGearClick = () => {
    setShowGear(false);
    setClickEnabled(true);
    setClickCount(prevCount => prevCount + 1);
    setShowBrykaO(true);
    setTimeout(() => {
      setShowBrykaO(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition1(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
      setPosition2(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
    }, 11);

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
      }, 1500);
  
      console.log(`User ID: ${userId}`);
      console.log(`User Name: ${userName}`);
      console.log(`User First Name: ${firstName}`);
      console.log(`Elapsed Time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
      
      return () => clearTimeout(timeout);
    }
  }, [endTime, startTime, userId]);

  const calculateElapsedTime = () => {
    if (endTime === 0 || startTime === 0) {
      return null;
    }

    const elapsedTime = (endTime - startTime) / 1000;

    console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
    console.log(`User ID: ${userId}`);

    return (
      <div style={{
        border: '2px solid white',
        backgroundColor: 'black',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: 4,
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        animation: 'slideDown 2s forwards',
        animationDelay: '1s',
        fontSize: '1rem',
      }}>
        <StyledButton onClick={() => window.location.reload()} style={{ margin: '10px', cursor: 'pointer' }}>
          Back
        </StyledButton><br />
        Your Time:<br />
        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{elapsedTime.toFixed(2)}</span> seconds<br /><br />
        <StyledButton onClick={() => setShowLeaderboard(true)} style={{ margin: '10px', cursor: 'pointer' }}>
          Leaderboard
        </StyledButton>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', height: '100vh', userSelect: 'none' }}>
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
          <div style={{ opacity: carOpacity, transition: 'opacity 1s', userSelect: 'none' }}>
            <Car
              clickEnabled={clickEnabled}
              onClick={handleClick}
              carAnimation={carAnimation}
              showBrykaO={showBrykaO}
              powerLevel={powerLevel}
              opacity={carOpacity}
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

      {showLeaderboard && (
        <LeaderboardPage
          elapsedTime={(endTime - startTime) / 1000}
          onClose={() => setShowLeaderboard(false)}
          userId={userId}
          firstName={firstName}
          userName={userName}
          lastName={lastName}
        />
      )}
    </div>
  );
};

export default IndexPage;
