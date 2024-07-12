// Gear.tsx
import React from "react";
import gear from "./gear.png";

interface GearProps {
  showGear: boolean;
  onClick: () => void;
}

const Gear: React.FC<GearProps> = ({ showGear, onClick }) => (
  showGear ? (
    <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 2, cursor: 'pointer' }} onClick={onClick}>
      <img src={gear} alt="gear" style={{ width: '125px', height: 'auto' }} />
    </div>
  ) : null
);

export default Gear;
