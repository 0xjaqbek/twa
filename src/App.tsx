import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import styled from "styled-components";
import "./PublicPixel.ttf";
import IndexPage from "./IndexPage";
import OnChainPage from "./onChainPage";



const StyledApp = styled.div`
  background: white;
  color: black;
  font-family: 'PublicPixel', sans-serif;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
`;

const AppContainer = styled.div`
  font-family: 'PublicPixel', sans-serif;
  max-width: 900px;
  margin: 0 auto;
`;

const App: FC = () => {
  return (
    <Router>
      <StyledApp>
        <AppContainer>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/onChainPage" element={<OnChainPage />} />
          </Routes>
        </AppContainer>
      </StyledApp>
    </Router>
  );
};

export default App;
