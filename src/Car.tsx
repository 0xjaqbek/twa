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
  opacity: number; // Add opacity prop
}

const Car: React.FC<CarProps> = ({ clickEnabled, onClick, carAnimation, showBrykaO, powerLevel, opacity }) => {
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [horizontalOffset, setHorizontalOffset] = useState(0);

  useEffect(() => {
    // Effect to adjust offsets based on power level
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
    // Effect to adjust vertical offset when brykaO is shown
    if (showBrykaO) {
      setVerticalOffset(prevOffset => prevOffset - 11);
    }
  }, [showBrykaO]);

  return (
    <div
      className={carAnimation}
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: `translateX(calc(-50% + ${horizontalOffset}px)) translateY(${verticalOffset}px)`,
        zIndex: 1,
        cursor: clickEnabled ? 'pointer' : 'default',
        transition: 'transform 0.1s ease-out, opacity 1s', // Add opacity transition
        animation: carAnimation === 'car-move-up' ? 'moveUp 2s forwards' : 'none',
        opacity: opacity, // Apply opacity from prop
      }}
      onClick={onClick}
    >
      <img
        src={showBrykaO ? brykaO : bryka}
        alt="bryka"
        style={{
          width: '125px',
          height: 'auto',
          userSelect: 'none', // Prevent text selection on the image
        }}
      />
    </div>
  );
};

export default Car;
