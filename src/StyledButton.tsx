// StyledButton.tsx
import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: grey;
  font-family: 'PublicPixel', sans-serif;
  color: var(--primary-text-color);
  border: 2px solid white;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: var(--button-hover-color);
  }
`;

