// Road.tsx
import React from "react";
import ulica from "./ulica.png";

interface RoadProps {
  position1: number;
  position2: number;
  verticalBlurLevel: number;
}

const Road: React.FC<RoadProps> = ({ position1, position2, verticalBlurLevel }) => (
  <>
    <svg width="0" height="0">
      <filter id="vertical-blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${verticalBlurLevel}`} />
      </filter>
    </svg>
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
  </>
);

export default Road;