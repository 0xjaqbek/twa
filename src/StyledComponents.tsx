import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: grey;
  font-family: 'PublicPixel', sans-serif;
  color: var(--primary-text-color);
  border: 2px solid white;
  button-radius: 10px;
  padding: 10px 20px;
  font-size: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--button-hover-color);
  }
`;

export const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;
  font-family: 'PublicPixel', sans-serif;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 10px 10px;
`;

export const AppContainer = styled.div`
  font-family: 'PublicPixel', sans-serif;
  max-width: 900px;
  margin: 0 auto;
`;

