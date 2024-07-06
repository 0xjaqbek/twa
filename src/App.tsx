import "./App.css";
import styled from "styled-components";
import { useState, useEffect, FC } from "react";

import bryka from "./bryka.png";
import ulica from "./ulica.png";
import gear from "./gear.png";
import one from "./1.png";
import two from "./2.png";
import three from "./3.png";

const INITIAL_MOVE_DISTANCE = 10; // Initial distance to move road on each click
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
  const [position2, setPosition2] = useState(-600);
  const [clickCount, setClickCount] = useState(0);
  const [moveDistance, setMoveDistance] = useState(INITIAL_MOVE_DISTANCE);
  const [showGear, setShowGear] = useState(false);
  const [showingImage, setShowingImage] = useState("");
  const [clickEnabled, setClickEnabled] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [verticalBlurLevel, setVerticalBlurLevel] = useState(0); // State for vertical blur level

  useEffect(() => {
    setTimeout(() => {
      setShowingImage(three);
      setTimeout(() => {
        setShowingImage(two);
        setTimeout(() => {
          setShowingImage(one);
          setTimeout(() => {
            setShowingImage("");
            setClickEnabled(true);
            setStartTime(performance.now()); // Start counting time with performance.now()
          }, 1000); // Enable clicking after showing "1.png" for 1 second
        }, 1000); // Show "1.png" for 1 second
      }, 1000); // Show "2.png" for 1 second
    }, 1000); // Show "3.png" for 1 second
  }, []);

  const handleClick = () => {
    if (!clickEnabled) return; // Exit early if clicking is disabled

    setClickCount((prevCount) => prevCount + 1);
    setPosition1((prevPosition) => prevPosition + moveDistance);
    setPosition2((prevPosition) => prevPosition + moveDistance);

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

    if (clickCount + 1 === 69) {
      setEndTime(performance.now()); // Record end time with performance.now()
      setClickEnabled(false); // Disable clicking on the car
    }
  };

  const handleGearClick = () => {
    setShowGear(false);
    setMoveDistance((prevDistance) => prevDistance * 1.25);
    setClickEnabled(true); // Enable clicking on the car after clicking the gear
  };

  useEffect(() => {
    if (position1 >= window.innerHeight) {
      setPosition1(RESET_POSITION);
    }
    if (position2 >= window.innerHeight) {
      setPosition2(RESET_POSITION);
    }
  }, [position1, position2]);

  const calculateElapsedTime = () => {
    if (startTime && endTime) {
      const elapsed = (endTime - startTime) / 1000; // Convert to seconds
      return (
        <div
          style={{
            border: "2px solid white",
            backgroundColor: "black",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Elapsed Time: {elapsed.toFixed(3)} seconds
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{ margin: "20px", cursor: "pointer" }}
          >
            Restart Race
          </button>
        </div>
      );
    }
    return "";
  };

  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <svg width="0" height="0">
        <filter id="vertical-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${verticalBlurLevel}`} />
        </filter>
      </svg>
      {showingImage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        >
          <img src={showingImage} alt="showing" style={{ width: "300px", height: "auto" }} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          cursor: clickEnabled ? "pointer" : "default", // Change cursor to pointer if clicking is enabled
        }}
        onClick={handleClick}
      >
        <img src={bryka} alt="bryka" style={{ width: "100px", height: "auto" }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: `${position1}px`,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      >
        <img
          src={ulica}
          alt="ulica"
          style={{
            width: "300px",
            height: "auto",
            filter: `url(#vertical-blur)`, // Apply vertical blur filter
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: `${position2}px`,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,
        }}
      >
        <img
          src={ulica}
          alt="ulica"
          style={{
            width: "300px",
            height: "auto",
            filter: `url(#vertical-blur)`, // Apply vertical blur filter
          }}
        />
      </div>
      {showGear && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            cursor: "pointer",
          }}
          onClick={handleGearClick}
        >
          <img src={gear} alt="gear" style={{ width: "150px", height: "auto" }} />
        </div>
      )}
      {clickCount === 69 && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
          }}
        >
          {calculateElapsedTime()}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <StyledApp>
      <AppContainer>
        <IndexPage />
      </AppContainer>
    </StyledApp>
  );
}

export default App;
