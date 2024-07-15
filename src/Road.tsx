// Road.tsx
import React, { useState, useEffect } from "react";
import ulica from "./ulica.png";

interface RoadProps {
  position1: number;
  position2: number;
  verticalBlurLevel: number;
}

const Road: React.FC<RoadProps> = ({ position1, position2, verticalBlurLevel }) => {
  const [opacity, setOpacity] = useState(0); // State for controlling opacity

  useEffect(() => {
    // Set opacity to 1 after 3 seconds
    const timeout = setTimeout(() => {
      setOpacity(1);
    }, 500);

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount or re-render
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  return (
    <>
      <svg width="0" height="0">
        <filter id="vertical-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={`0 ${verticalBlurLevel}`} />
        </filter>
      </svg>
      <div style={{ position: 'absolute', top: `${position1}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 0, opacity: opacity, transition: 'opacity 1s' }}>
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
      <div style={{ position: 'absolute', top: `${position2}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 0, opacity: opacity, transition: 'opacity 1s' }}>
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
};

export default Road;
