import { FC } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import styled from "styled-components";
import "./PublicPixel.ttf";
import IndexPage from "./IndexPage";


const StyledApp = styled.div`
  background: 
      linear-gradient(90deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000),
      linear-gradient(#000 25%, transparent 25%, transparent 75%, #000 75%, #000);
    background-size: 50px 50px;
  color: black;
  font-family: 'PublicPixel', sans-serif;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 1px 1px;
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
