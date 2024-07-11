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

  useEffect(() => {
    if (powerLevel === 9) {
      // Max power level: Move car slightly up
      setVerticalOffset(-5);
    } else if (powerLevel === 5) {
      // Middle power level: Move car slightly up
      setVerticalOffset(-5);
    } else if (powerLevel === 1) {
      // Second lowest power level: Move car slightly up
      setVerticalOffset(-5);
    } else {
      // Reset vertical offset
      setVerticalOffset(0);
    }
  }, [powerLevel]);

  return (
    <div
      className={carAnimation}
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: `translateX(-50%) translateY(${verticalOffset}px)`,
        zIndex: 1,
        cursor: clickEnabled ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-out',  // Smooth transition for transform property
        animation: carAnimation === 'car-move-up' ? 'moveUp 2s forwards' : 'none',
      }}
      onClick={onClick}
    >
      <img src={showBrykaO ? brykaO : bryka} alt="bryka" style={{ width: '150px', height: 'auto' }} />
    </div>
  );
};

export default Car;
