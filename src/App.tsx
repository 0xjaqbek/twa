import { FC } from "react";
import styled from "styled-components";
import "./Pixelify.ttf";
import IndexPage from "./IndexPage";


const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;
  font-family: 'Pixelify', sans-serif;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  font-family: 'Pixelify', sans-serif;
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
