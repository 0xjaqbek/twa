import React, { useState, useEffect, FC } from "react";
import styled from "styled-components";
import PowerIndicator from "./PowerIndicator";
import ProgressIndicator from "./ProgressIndicator";
import Timer from "./Timer";
import Instructions from "./Instructions";
import Car from "./Car";
import Road from "./Road";
import Gear from "./Gear";
import LeaderboardPage from "./LeaderboardPage"; // Correct import without importing specific props
import { calculateMoveDistance, animateRoad, RESET_POSITION } from "./speed";
import { StyledButton } from "./StyledButton";

interface TelegramUser {
  id: number;
  first_name: string;
  // Add other properties as needed
}

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
  text-shadow: 22px 22px 43px white;
  background-color: rgba(0, 0, 0, 0.5); // Black background with 50% opacity
  padding: 40px;
`;

const IndexPage: FC = () => {
  const [position1, setPosition1] = useState<number>(0);
  const [position2, setPosition2] = useState<number>(RESET_POSITION);
  const [clickCount, setClickCount] = useState<number>(0);
  const [moveDistance, setMoveDistance] = useState<number>(INITIAL_MOVE_DISTANCE);
  const [showGear, setShowGear] = useState<boolean>(false);
  const [showingText, setShowingText] = useState<string>('');
  const [clickEnabled, setClickEnabled] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [verticalBlurLevel, setVerticalBlurLevel] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [carAnimation, setCarAnimation] = useState<string>('');
  const [showBrykaO, setShowBrykaO] = useState<boolean>(false);
  const [roadOpacity, setRoadOpacity] = useState<number>(0); // Initially 0 for fade-in effect
  const [instructionsOpacity, setInstructionsOpacity] = useState<number>(1); // New state for instructions opacity
  const [powerLevel, setPowerLevel] = useState<number>(0); // State to track power level
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false); // State to show leaderboard
  const [onTelegram, setOnTelegram] = useState<boolean>(false); // State to track if the user is on Telegram
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null); // State to track Telegram user

  useEffect(() => {
    const initTelegramUser = async () => {
      try {
        // Check if Telegram WebApp is available
        const tg = (window as any)?.Telegram?.WebApp; // Use type assertion here
        if (tg && tg.initDataUnsafe.user) {
          setOnTelegram(true);
          setTelegramUser({
            id: tg.initDataUnsafe.user.id,
            first_name: tg.initDataUnsafe.user.first_name
            // Add other properties as needed
          });
        } else {
          setOnTelegram(false);
          setTelegramUser(null);
          alert("Please use the Telegram app");
        }
      } catch (error) {
        console.error('Error fetching Telegram user data:', error);
        alert("Error fetching Telegram user data. Please try again later.");
      }
    };

    initTelegramUser();
  }, []);

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
        <StyledButton onClick={() => window.location.reload()} style={{ margin: '20px' }}>Play Again</StyledButton>
        Your elapsed time: {elapsedTime.toFixed(2)} seconds
        <StyledButton onClick={() => setShowLeaderboard(true)} style={{ margin: '20px' }}>Show Leaderboard</StyledButton>
      </div>
    );
  };

  return (
    <div style={{ overflow: "hidden" }}>
      {telegramUser && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          Welcome, {telegramUser.first_name}!
        </div>
      )}

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

      <LeaderboardPage
        elapsedTime={(endTime - startTime) / 1000}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default IndexPage;
