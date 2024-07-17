// styles.tsx
import styled from 'styled-components';
import { StyledButton } from './StyledButton';

export const LeaderboardContainer = styled.div`
  font-size: 10px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LeaderboardContent = styled.div`
  border: 1px solid #ddd;
  color: white;
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  width: 95%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const ElapsedTime = styled.p`
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.5em;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  background-color: black;
`;

export const StyledButtonSecondary = styled(StyledButton)`
  background-color: gray;
  border: 2px solid;
  border-color: #CCCCCC;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  margin-top: 10px;
  cursor: pointer;
`;
