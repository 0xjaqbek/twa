import { FC, useState, useEffect } from "react";
import styled from "styled-components";

const TimerWrapper = styled.div`
  position: absolute;
  top: 5px;
  right: 2px;
  font-family: 'PublicPixel', sans-serif;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 10px;
  border-radius: 5px;
  z-index: 1000;
  font-size: 14px;
`;

interface TimerProps {
  startTime: number;
  gameStarted: boolean;
  endTime: number;
}

const Timer: FC<TimerProps> = ({ startTime, gameStarted, endTime }) => {
  const [elapsedTime, setElapsedTime] = useState("0.00");

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    const updateElapsedTime = () => {
      if (startTime === 0 || !gameStarted || endTime !== 0) {
        setElapsedTime("0.00");
        return;
      }

      const currentTime = performance.now();
      const elapsedMilliseconds = currentTime - startTime;
      const elapsedSeconds = elapsedMilliseconds / 1000;
      setElapsedTime(elapsedSeconds.toFixed(2));
    };

    if (gameStarted && startTime !== 0 && endTime === 0) {
      timerInterval = setInterval(updateElapsedTime, 10);
    }

    return () => clearInterval(timerInterval);
  }, [startTime, gameStarted, endTime]);

  if (!gameStarted || endTime !== 0) {
    return null; // Don't render the timer if game hasn't started or has ended
  }

  return (
    <TimerWrapper>
      {elapsedTime} sec
    </TimerWrapper>
  );
};

export default Timer;
