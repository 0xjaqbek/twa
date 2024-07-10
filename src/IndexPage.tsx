import React, { useState, useEffect, FC } from "react";
import styled from "styled-components";
import bryka from "./bryka.png";
import ulica from "./ulica.png";
import gear from "./gear.png";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";
import PowerIndicator from "./PowerIndicator";
import ProgressIndicator from "./ProgressIndicator";
import { calculateMoveDistance, animateRoad, RESET_POSITION } from "./speed";

const INITIAL_MOVE_DISTANCE = 0.01; // Initial distance to move road on each click

const StyledButton = styled.button`
  background-color: grey;
  font-family: 'Pixelify', sans-serif;
  color: var(--primary-text-color);
  border: 2px solid white;
  button-radius: 10px;
  padding: 20px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--button-hover-color);
  }
`;

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
      }}>
        Elapsed Time: {elapsedTime.toFixed(2)} seconds<br></br>
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
          zIndex: 999,
        }}>
          <div style={{
            backgroundColor: 'black',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '80%',
            textAlign: 'center',
          }}>
            <h2>Instructions</h2>
            <p>To play:</p>
            <ol>
              <li>Click on the car image to move forward.</li>
              <li>Every 10 clicks will reveal the gear, which disables clicking on the car temporarily.</li>
              <li>To resume clicking on the car after the gear is shown, click on the gear image.</li>
              <li>Your goal is to reach 69 clicks as fast as possible.</li>
            </ol>
            <p>When you're ready click</p>
            <StyledButton onClick={handleStartGame}>Start Game</StyledButton>
          </div>
        </div>
      )}

      {!showInstructions && (
        <>
          <svg width="0" height="0">
            <filter id="vertical-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${verticalBlurLevel}`} />
            </filter>
          </svg>
          {showingImage && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
              <img src={showingImage} alt="showing" style={{ width: '300px', height: 'auto' }} />
            </div>
          )}
          <div
            className={carAnimation}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              cursor: clickEnabled ? 'pointer' : 'default',
              animation: carAnimation === 'car-move-up' ? 'moveUp 2s forwards' : 'none',
            }}
            onClick={handleClick}
          >
            <img src={bryka} alt="bryka" style={{ width: '150px', height: 'auto' }} />
          </div>
          <div style={{ position: 'absolute', top: `${position1}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
            <img
              src={ulica}
              alt="ulica"
              style={{
                width: '300px',
                height: 'auto',
                filter: 'url(#vertical-blur)',
              }}
            />
          </div>
          <div style={{ position: 'absolute', top: `${position2}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 0 }}>
            <img
              src={ulica}
              alt="ulica"
              style={{
                width: '300px',
                height: 'auto',
                filter: 'url(#vertical-blur)',
              }}
            />
          </div>
          {showGear && (
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 2, cursor: 'pointer' }} onClick={handleGearClick}>
              <img src={gear} alt="gear" style={{ width: '150px', height: 'auto' }} />
            </div>
          )}
{gameStarted && endTime === 0 && (
  <>
    <PowerIndicator clickCount={clickCount} />
    <ProgressIndicator clickCount={clickCount} />
  </>
)}
        </>
      )}
      {calculateElapsedTime()}
    </div>
  );
};

export default IndexPage;
