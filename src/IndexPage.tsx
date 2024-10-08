import React, { useState, useEffect, FC } from "react";
import styled, { keyframes } from 'styled-components';
import PowerIndicator from "./PowerIndicator";
import ProgressIndicator from "./ProgressIndicator";
import Timer from "./Timer";
import Instructions from "./Instructions";
import Car from "./Car";
import Road from "./Road";
import Gear from "./Gear";
import LeaderboardPage from "./LeaderboardPage"; // Import the LeaderboardPage component
import { calculateMoveDistance, animateRoad, RESET_POSITION } from "./speed";
import { StyledButton } from "./StyledButton";
import { LeaderboardPageProps } from './LeaderboardPageProps';
import { createOrUpdateLeaderboardEntry } from './gistService'; 
import OnChainPage from './onChainPage';
import { useNavigate } from 'react-router-dom';
import { useTonAddress } from "@tonconnect/ui-react";

const INITIAL_MOVE_DISTANCE = 0.01; // Initial distance to move road on each click

// Define the keyframes for the blinking animation
const blink = keyframes`
  0% { background-color: rgba(255, 255, 255, 0.0); }
  100% { background-color: rgba(255, 255, 255, 1); }
`;

const CountdownText = styled.div`
  font-size: 150px;
  font-family: 'PublicPixel'; // Replace with your actual font
  color: black;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  text-shadow: 22px 22px 10px white;
  background-color: rgba(255, 255, 255, 0.5); // Black background with 50% opacity
  padding: 1500px 1600px;
  animation: ${blink} 1s infinite; // Add the animation
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
  const [roadOpacity, setRoadOpacity] = useState(0); // Initially 0 for fade-in effect
  const [carOpacity, setCarOpacity] = useState(0); // Initially 0 for fade-in effect
  const [instructionsOpacity, setInstructionsOpacity] = useState(1); // New state for instructions opacity
  const [powerLevel, setPowerLevel] = useState(0); // State to track power level
  const [firstName, setFirstName] = useState<string>(''); // Add this line
  const [onTelegram, setOnTelegram] = useState(false); // State to track if Telegram is loaded
  const [userId, setUserId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // State to show leaderboard
  const [userName, setUserName] = useState<string>(''); // Add this line
  const [lastName, setLastName] = useState<string>(''); // Add this line
  const rawAddress = useTonAddress(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      tg.ready(); // Ensure that Telegram Web App is fully loaded
      tg.disableVerticalSwipes();
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
        setFirstName(userObj.first_name || null);
        setLastName(userObj.last_name || null);
        setUserName(userObj.username || null);
        const mainButton = tg.MainButton;
        mainButton.setText("Official Game Chat");
        mainButton.show();
        mainButton.onClick(() => {
          window.location.href = 'https://t.me/+ANrGz3PBoA5hYzhk'; // Replace with your specific link
      });
      } else {
        setOnTelegram(false);
        setUserId(null); // Set userId to null if user is undefined
        setFirstName('');
        setUserName('');
        setLastName('');
      }
    } else {
      setOnTelegram(false);
      setUserId(null); // Set userId to null if Telegram WebApp is not loaded
      setFirstName('');
      setUserName('');
      setLastName('');
    }
  }, []);

  useEffect(() => {
    if (onTelegram && userId) {
      console.log(`User ID: ${userId}`);
      console.log(`First Name: ${firstName}`);
      console.log(`User Name: ${userName}`);
      console.log(`Last Name: ${lastName}`);
      console.log(`Wallet Address: ${rawAddress}`);
      // You can fetch and print the user's name here if needed
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
    setInstructionsOpacity(0); // Reduce instructions opacity
    setTimeout(() => {
      setShowInstructions(false); // Hide instructions after transition
      setGameStarted(true);
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.MainButton.hide();
      }
      // Fade in the car first
      setTimeout(() => {
        setCarOpacity(1);  // Set car opacity to 1
      }, 1500); // Fade in the car after 50ms

      // Fade in road and other elements after an additional delay
      setTimeout(() => {
        setRoadOpacity(1); // Start fading in the road and other elements
      }, 500); // Fade in road after 100ms
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
      }, 1500);
  
      // Log userId and elapsedTime
      console.log(`User ID: ${userId}`);
      console.log(`User Name: ${userName}`);
      console.log(`User First Name: ${firstName}`);
      console.log(`Elapsed Time: ${((endTime - startTime) / 1000).toFixed(3)} seconds`);
      console.log(`Wallet Address: ${rawAddress}`);
      return () => clearTimeout(timeout);
    }
  }, [endTime, startTime, userId]);

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
        <StyledButton onClick={() => window.location.reload()} style={{ margin: '10px', cursor: 'pointer' }}>
          Back
        </StyledButton><br></br><br></br>
        Your Time:<br></br> 
        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{elapsedTime.toFixed(3)}</span> seconds<br></br>
        <br></br><br></br><br></br><br></br><br></br><br></br>
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
              powerLevel={powerLevel} // Pass powerLevel to Car component
              opacity={carOpacity} // Pass carOpacity to Car component
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

      {/* Conditionally render LeaderboardPage based on showLeaderboard state */}
      {showLeaderboard && (
        <LeaderboardPage
          elapsedTime={(endTime - startTime) / 1000}
          onClose={() => setShowLeaderboard(false)} // Close the leaderboard page
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
