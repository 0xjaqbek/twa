// LeaderboardList.tsx
import React from 'react';
import styled from 'styled-components';
import { LeaderboardEntry } from './gistService';

export const LeaderboardList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: black;
`;

export const LeaderboardItem = styled.li`
  font-size: 13px;
  color: white;
  margin: 5px 0;
  padding: 10px;
  background-color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
`;
