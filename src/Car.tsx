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

  useEffect(() => {
    if (powerLevel >= 8) {
      // High power level: Move car up more and slightly right
      setVerticalOffset(-5);
      setHorizontalOffset(2);
    } else if (powerLevel >= 8) {
      // Middle power level: Move car up moderately and slightly left
      setVerticalOffset(3);
      setHorizontalOffset(0);
    } else if (powerLevel >= 7) {
      // Middle power level: Move car up moderately and slightly left
      setVerticalOffset(5);
      setHorizontalOffset(-2);
    } else if (powerLevel >= 4) {
      // Middle power level: Move car up moderately and slightly left
      setVerticalOffset(3);
      setHorizontalOffset(2);
    } else if (powerLevel >= 2) {
      // Low power level: Move car up slightly and back to center
      setVerticalOffset(-3);
      setHorizontalOffset(0);
    } else if (powerLevel >= 1) {
      // Middle power level: Move car up moderately and slightly left
      setVerticalOffset(2);
      setHorizontalOffset(0);
    } else {
      // Reset offsets
      setVerticalOffset(-1);
      setHorizontalOffset(0);
    }
  }, [powerLevel]);

  useEffect(() => {
    if (showBrykaO) {
      // Adjust vertical offset when brykaO is shown
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
        transition: 'transform 0.1s ease-out',  // More frequent transition for transform property
        animation: carAnimation === 'car-move-up' ? 'moveUp 2s forwards' : 'none',
      }}
      onClick={onClick}
    >
      <img src={showBrykaO ? brykaO : bryka} alt="bryka" style={{ width: '150px', height: 'auto' }} />
    </div>
  );
};

export default Car;
