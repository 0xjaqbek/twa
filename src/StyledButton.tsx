// StyledButton.tsx
import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: grey;
  font-family: 'Pixelify', sans-serif;
  color: var(--primary-text-color);
  border: 2px solid white;
  border-radius: 10px;
  padding: 20px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--button-hover-color);
  }
`;
