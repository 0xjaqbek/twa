// Car.tsx
import React, { useState, useEffect } from "react";
import bryka from "./bryka.png";
import brykaO from "./brykaO.png";

interface CarProps {
  clickEnabled: boolean;
  onClick: () => void;
  carAnimation: string;
  showBrykaO: boolean;
  powerLevel: number;
}

const Car: React.FC<CarProps> = ({ clickEnabled, onClick, carAnimation, showBrykaO, powerLevel }) => {
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [opacity, setOpacity] = useState(0); // State for controlling opacity

  useEffect(() => {
    // Set opacity to 1 after component mounts
    setOpacity(1);
  }, []);

  useEffect(() => {
    if (powerLevel >= 8) {
      setVerticalOffset(-5);
      setHorizontalOffset(2);
    } else if (powerLevel >= 7) {
      setVerticalOffset(5);
      setHorizontalOffset(-2);
    } else if (powerLevel >= 4) {
      setVerticalOffset(3);
      setHorizontalOffset(2);
    } else if (powerLevel >= 2) {
      setVerticalOffset(-3);
      setHorizontalOffset(0);
    } else if (powerLevel >= 1) {
      setVerticalOffset(2);
      setHorizontalOffset(0);
    } else {
      setVerticalOffset(-1);
      setHorizontalOffset(0);
    }
  }, [powerLevel]);

  useEffect(() => {
    if (showBrykaO) {
      setVerticalOffset(prevOffset => prevOffset - 11);
    }
  }, [showBrykaO]);

  return (
    <div
      className={`car ${carAnimation}`}
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: `translateX(calc(-50% + ${horizontalOffset}px)) translateY(${verticalOffset}px)`,
        zIndex: 1,
        cursor: clickEnabled ? 'pointer' : 'default',
        opacity: opacity, // Set opacity based on state
        transition: 'opacity 0.1s ease-in-out', // Opacity transition over 1 second
      }}
      onClick={onClick}
    >
      <img src={showBrykaO ? brykaO : bryka} alt="bryka" style={{ width: '125px', height: 'auto' }} />
    </div>
  );
};

export default Car;
