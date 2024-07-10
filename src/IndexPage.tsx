import React, { useState, useEffect, FC } from "react";
import styled from "styled-components";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
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

const IndexPage: FC = () => {
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(RESET_POSITION);
  const [clickCount, setClickCount] = useState(0);
  const [moveDistance, setMoveDistance] = useState(INITIAL_MOVE_DISTANCE);
  const [showGear, setShowGear] = useState(false);
  const [showingImage, setShowingImage] = useState('');
  const [clickEnabled, setClickEnabled] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [verticalBlurLevel, setVerticalBlurLevel] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [carAnimation, setCarAnimation] = useState('');
  const [showBrykaO, setShowBrykaO] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        setShowingImage(three);
        setTimeout(() => {
          setShowingImage(two);
          setTimeout(() => {
            setShowingImage(one);
            setTimeout(() => {
              setShowingImage('');
              setClickEnabled(true);
              setStartTime(performance.now());
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
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
  };

  const handleGearClick = () => {
    setShowGear(false);
    setClickEnabled(true);
    setClickCount(prevCount => prevCount + 1); // Increment click count after gear click
    setShowBrykaO(true); // Show brykaO
    setTimeout(() => {
      setShowBrykaO(false); // Hide brykaO after 0.3 seconds
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition1(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
      setPosition2(prevPosition => animateRoad(prevPosition, moveDistance, window.innerHeight));
    }, 16); // Approximately 60 frames per second

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
        padding: '10px',
        borderRadius: '5px',
        zIndex: 4,
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        animation: 'slideDown 2s forwards',
        animationDelay: '1s',
      }}>
        Elapsed Time:<br></br> {elapsedTime.toFixed(2)} seconds<br></br>
        <StyledButton onClick={() => {
          setPosition1(0);
          setPosition2(RESET_POSITION);
          setClickCount(0);
          setMoveDistance(INITIAL_MOVE_DISTANCE);
          setShowGear(false);
          setShowingImage('');
          setClickEnabled(false);
          setStartTime(0);
          setEndTime(0);
          setVerticalBlurLevel(0);
          setShowInstructions(true);
          setGameStarted(false);
          setCarAnimation('');
        }} style={{ margin: '20px', cursor: 'pointer' }}>
          Restart
        </StyledButton>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', height: '100vh' }}>
      {showInstructions && <Instructions onStartGame={handleStartGame} />}

      {!showInstructions && (
        <>
          <Road position1={position1} position2={position2} verticalBlurLevel={verticalBlurLevel} />
          {showingImage && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
              <img src={showingImage} alt="showing" style={{ width: '300px', height: 'auto' }} />
            </div>
          )}
          <Car
            clickEnabled={clickEnabled}
            onClick={handleClick}
            carAnimation={carAnimation}
            showBrykaO={showBrykaO}
          />
          <Gear showGear={showGear} onClick={handleGearClick} />
          {gameStarted && endTime === 0 && (
            <>
              <PowerIndicator clickCount={clickCount} />
              <ProgressIndicator clickCount={clickCount} />
              <Timer startTime={startTime} gameStarted={gameStarted} endTime={endTime} />
            </>
          )}
        </>
      )}
      {calculateElapsedTime()}
    </div>
  );
};

export default IndexPage;
