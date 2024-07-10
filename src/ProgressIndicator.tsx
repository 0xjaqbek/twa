import { FC } from "react";
import styled from "styled-components";

const ProgressWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-family: 'Pixelify', sans-serif;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  font-size: 28px;
`;

const LargeNumber = styled.span`
  font-size: 56px; // 2x larger
`;

interface ProgressIndicatorProps {
  clickCount: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ clickCount }) => {
  const calculateProgress = (clickCount: number): string => {
    if (clickCount <= 10) return "1/7";
    if (clickCount <= 20) return "2/7";
    if (clickCount <= 30) return "3/7";
    if (clickCount <= 40) return "4/7";
    if (clickCount <= 50) return "5/7";
    if (clickCount <= 60) return "6/7";
    return "7/7";
  };

  const progress = calculateProgress(clickCount);
  const [largeNumber, smallNumber] = progress.split("/");

  return (
    <ProgressWrapper>
      <LargeNumber>{largeNumber}</LargeNumber>/{smallNumber}
    </ProgressWrapper>
  );
};

export default ProgressIndicator;
