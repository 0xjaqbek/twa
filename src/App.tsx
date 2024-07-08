import "./App.css";
import styled from "styled-components";
import { useState, useEffect, FC } from "react";

import bryka from "./bryka.png";
import ulica from "./ulica.png";
import gear from "./gear.png";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";

const INITIAL_MOVE_DISTANCE = 1; // Initial distance to move road on each click
const RESET_POSITION = -600; // Height of road image (in pixels)

const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
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
  const [verticalBlurLevel, setVerticalBlurLevel] = useState(0); // State for vertical blur level
  const [showInstructions, setShowInstructions] = useState(true); // State to show/hide instructions
  const [gameStarted, setGameStarted] = useState(false); // State to track if game has started
  const [carAnimation, setCarAnimation] = useState(''); // State for car animation

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
              setStartTime(performance.now()); // Start counting time with performance.now()
            }, 1000); // Enable clicking after showing "1.png" for 1 second
          }, 1000); // Show "1.png" for 1 second
        }, 1000); // Show "2.png" for 1 second
      }, 1000); // Show "3.png" for 1 second
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    setShowInstructions(false); // Hide instructions
    setGameStarted(true); // Start the game countdown and components
  };

  const handleClick = () => {
    if (!clickEnabled) return; // Exit early if clicking is disabled

    setClickCount((prevCount) => prevCount + 1);
    setMoveDistance((prevDistance) => prevDistance + INITIAL_MOVE_DISTANCE); // Increment move distance on each click

    // Check if the click count is a multiple of 10
    if ((clickCount + 1) % 10 === 0) {
      setShowGear(true);
      setClickEnabled(false); // Disable clicking on the car when gear is shown

      // Increase vertical blur level gradually
      setVerticalBlurLevel((prevBlurLevel) => {
        const newBlurLevel = prevBlurLevel + 1;
        if (newBlurLevel <= 6) {
          return newBlurLevel;
        } else {
          return prevBlurLevel;
        }
      });
    }

    if ((clickCount + 1) === 69) {
      setEndTime(performance.now()); // Record end time with performance.now()
      setClickEnabled(false); // Disable clicking on the car
      setCarAnimation('car-move-up'); // Apply the animation class
    }
  };

  const handleGearClick = () => {
    setShowGear(false);
    setMoveDistance((prevDistance) => prevDistance * 0.1);
    setClickEnabled(true); // Enable clicking on the car after clicking the gear
  };

  useEffect(() => {
    const animateRoad = () => {
      setPosition1((prevPosition) => {
        if (prevPosition >= window.innerHeight) {
          return RESET_POSITION;
        }
        return prevPosition + moveDistance / 30;
      });
      setPosition2((prevPosition) => {
        if (prevPosition >= window.innerHeight) {
          return RESET_POSITION;
        }
        return prevPosition + moveDistance / 30;
      });
      requestAnimationFrame(animateRoad);
    };

    if (clickEnabled) {
      requestAnimationFrame(animateRoad);
    }
  }, [clickEnabled, moveDistance]);

  const calculateElapsedTime = () => {
    if (startTime && endTime) {
      const elapsed = (endTime - startTime) / 1000; // Convert to seconds
      return (
        <div style={{
          border: '2px solid white',
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 4,
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          Elapsed Time: {elapsed.toFixed(3)} seconds<br></br>
          <button onClick={() => window.location.reload()} style={{ margin: '20px', cursor: 'pointer' }}>
            Restart Race
          </button>
        </div>
      );
    }
    return '';
  };

  // CSS Animation for moving car up
  const moveUpAnimation = `
    @keyframes moveUp {
      0% {
        transform: translateX(-50%) translateY(0);
      }
      100% {
        transform: translateX(-50%) translateY(-100vh);
      }
    }
  `;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = moveUpAnimation;
    document.head.append(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', height: '100vh' }}>
      {/* Instructions Modal */}
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
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        </div>
      )}

      {/* Game Interface */}
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
            className={carAnimation} // Apply the animation class conditionally
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              cursor: clickEnabled ? 'pointer' : 'default', // Change cursor to pointer if clicking is enabled
              animation: carAnimation === 'car-move-up' ? 'moveUp 2s forwards' : 'none', // Apply inline animation style
            }}
            onClick={handleClick}
          >
            <img src={bryka} alt="bryka" style={{ width: '100px', height: 'auto' }} />
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
              <img src={gear} alt="gear" style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
        </>
      )}

      {/* Elapsed Time Display */}
      {calculateElapsedTime()}
    </div>
  );
};

const App: FC = () => {
  return (
    <StyledApp>
      <AppContainer>
        <IndexPage />
      </AppContainer>
    </StyledApp>
  );
};

export default App;
