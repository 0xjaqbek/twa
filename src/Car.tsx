// Car.tsx
import React from "react";
import bryka from "./bryka.png";
import brykaO from "./brykaO.png";

interface CarProps {
  clickEnabled: boolean;
  onClick: () => void;
  carAnimation: string;
  showBrykaO: boolean;
}

const Car: React.FC<CarProps> = ({ clickEnabled, onClick, carAnimation, showBrykaO }) => (
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
    onClick={onClick}
  >
    <img src={showBrykaO ? brykaO : bryka} alt="bryka" style={{ width: '150px', height: 'auto' }} />
  </div>
);

export default Car;
