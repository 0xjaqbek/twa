import { FC } from "react";
import styled from "styled-components";
import "./PublicPixel.ttf";
import IndexPage from "./IndexPage";


const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;
  font-family: 'PublicPixel', sans-serif;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  font-family: 'PublicPixel', sans-serif;
  max-width: 900px;
  margin: 0 auto;
`;

const App: FC = () => {
  return (
    <StyledApp>
      <AppContainer>
        <IndexPage />
      </AppContainer>
    </StyledApp>
  );
};

export default App;
