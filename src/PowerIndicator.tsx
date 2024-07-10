import React, { FC } from "react";
import styled from "styled-components";
import powerGrey from "./power_grey.png";
import power1 from "./power1.png";
import power2 from "./power2.png";
import power3 from "./power3.png";
import power4 from "./power4.png";
import power5 from "./power5.png";
import power6 from "./power6.png";
import power7 from "./power7.png";
import power8 from "./power8.png";
import power9 from "./power9.png";

const powerImages = [
  power1, power2, power3, power4, power5,
  power6, power7, power8, power9
];

const PowerContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 10px;
  z-index: 4; /* Ensure it's above other elements */
`;

const PowerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  background: none; /* Transparent background */
`;

interface PowerIndicatorProps {
  clickCount: number;
}

const PowerIndicator: FC<PowerIndicatorProps> = ({ clickCount }) => {
  let powerIndex = -1;

  // Adjusted conditional logic to handle 10th click
  if (clickCount % 10 === 1) powerIndex = 0;
  else if (clickCount % 10 === 2) powerIndex = 1;
  else if (clickCount % 10 === 3) powerIndex = 2;
  else if (clickCount % 10 === 4) powerIndex = 3;
  else if (clickCount % 10 === 5) powerIndex = 4;
  else if (clickCount % 10 === 6) powerIndex = 5;
  else if (clickCount % 10 === 7) powerIndex = 6;
  else if (clickCount % 10 === 8) powerIndex = 7;
  else if (clickCount % 10 === 9) powerIndex = 8;
  else if (clickCount === 10) powerIndex = 8;
  else if (clickCount === 20) powerIndex = 8;
  else if (clickCount === 30) powerIndex = 8;
  else if (clickCount === 40) powerIndex = 8;
  else if (clickCount === 50) powerIndex = 8;
  else if (clickCount === 60) powerIndex = 8;

  return (
    <PowerContainer>
      <PowerImage src={powerGrey} alt="Power Grey" />
      {powerIndex !== -1 && <PowerImage src={powerImages[powerIndex]} alt={`Power ${powerIndex + 1}`} />}
    </PowerContainer>
  );
};

export default PowerIndicator;
