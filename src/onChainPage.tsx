import React, { FC } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';

const OnChainPage: FC = () => {
  return (
    <Container>
      <Title>Race OnChain</Title>
      <Content>
        <p>This is the new OnChain page content.</p>
        <StyledButton onClick={() => window.history.back()}>Go Back</StyledButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-size: 1.5rem;
  text-align: center;
`;

export default OnChainPage;
