import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { getLeaderboard, updateLeaderboard, LeaderboardEntry } from './gistService';
import { sendRecordTimeToRace } from './race/scripts/onChainRaceService';
import { getDataFromRace } from './race/scripts/getData';
import { TonClient, Address } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

interface LeaderboardPageProps {
  elapsedTime: number;
  onClose: () => void;
  userId: string | null;
  firstName: string;
  userName: string;
  lastName: string;
}

const LeaderboardContainer = styled.div`
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

const LeaderboardContent = styled.div`
  border: 1px solid #ddd;
  color: white;
  background-color: black;
  padding: 10px;
  border-radius: 10px;
  width: 95%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ElapsedTime = styled.p`
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.5em;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
  background-color: black;
`;

const LeaderboardList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  background-color: black;
`;

const LeaderboardItem = styled.li`
  font-size: 13px;
  color: white;
  margin: 5px 0;
  padding: 10px;
  background-color: black;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const StyledButtonSecondary = styled(StyledButton)`
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

const SaveScoreWindowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SaveScoreWindowContent = styled.div`
  color: white;
  background-color: black;
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose, userId, firstName, userName, lastName }) => {
  const rawAddress = useTonAddress(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSaveScoreWindow, setShowSaveScoreWindow] = useState(false);

  const itemsPerPage = 3;
  const [tonConnectUI, setTonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
    };
    fetchLeaderboard();
  }, []);

  const handleSaveScore = () => {
    setShowSaveScoreWindow(true);
  };

  const handleSaveScoreConfirm = async () => {
    try {
      if (!userId && !rawAddress) {
        alert("Please connect your wallet.");
        return;
      }

      const newScore: LeaderboardEntry = {
        address: rawAddress || '',
        time: elapsedTime,
        playerId: userId || rawAddress || '',
        userName: userName || '',
      };

      const existingScore = leaderboard.find(score => score.address === rawAddress || score.playerId === (userId || rawAddress));
      if (existingScore) {
        if (elapsedTime < existingScore.time) {
          const updatedLeaderboard = leaderboard.map(score =>
            (score.address === rawAddress || score.playerId === (userId || rawAddress)) ? newScore : score
          );
          setLeaderboard(updatedLeaderboard);
          await updateLeaderboard(updatedLeaderboard);
          console.log(`Wallet Address: ${rawAddress}`);
          console.log(`Elapsed Time: ${elapsedTime.toFixed(3)} seconds`);
          console.log(`User ID: ${userId}`);
          console.log(`User Name: ${userName}`);
          console.log(`User First Name: ${firstName}`);
        } else {
          const timeDifference = (elapsedTime - existingScore.time).toFixed(3);
          alert(`You were slower by ${timeDifference} seconds than your best.`);
        }
      } else {
        const updatedLeaderboard = [...leaderboard, newScore];
        setLeaderboard(updatedLeaderboard);
        await updateLeaderboard(updatedLeaderboard);
        console.log(`Wallet Address: ${rawAddress}`);
        console.log(`Elapsed Time: ${elapsedTime.toFixed(3)} seconds`);
        console.log(`User ID: ${userId}`);
        console.log(`User Name: ${userName}`);
        console.log(`User First Name: ${firstName}`);
      }
      setShowSaveScoreWindow(false);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const getTopScores = (scores: LeaderboardEntry[]) => {
    const highestScores = scores.reduce((acc, score) => {
      if (!acc[score.address || score.playerId] || acc[score.address || score.playerId].time > score.time) {
        acc[score.address || score.playerId] = score;
      }
      return acc;
    }, {} as Record<string, LeaderboardEntry>);

    const sortedScores = Object.values(highestScores).sort((a, b) => a.time - b.time);
    return sortedScores;
  };

  const formatAddress = (address: string, userName?: string) => {
    if (userName) {
      return userName;
    }

    if (address.length <= 9) return address;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  const handleNextPage = () => {
    setPageIndex(prevPageIndex => prevPageIndex + 1);
  };

  const handlePrevPage = () => {
    setPageIndex(prevPageIndex => Math.max(prevPageIndex - 1, 0));
  };

  const handleCloseSaveScoreWindow = () => {
    setShowSaveScoreWindow(false);
  };

  const topScores = getTopScores(leaderboard);
  const paginatedScores = topScores.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  const handleOnChainRaceClick = async () => {
    try {
      if (!rawAddress) {
        alert("Please connect your wallet.");
        return;
      }

      console.log("OnChain Race clicked");
      console.log(`Wallet Address: ${rawAddress}`);
      console.log(`User ID: ${userId}`);
      console.log(`User Name: ${userName}`);
      console.log(`Elapsed Time: ${elapsedTime.toFixed(3)} seconds`);

      await sendRecordTimeToRace(rawAddress, elapsedTime, tonConnectUI);

    } catch (error) {
      console.error("Error during OnChain Race:", error);
    }
  };

  const handleOnChainRaceDataClick = async () => {
    try {
      if (!rawAddress) {
        alert("Please connect your wallet.");
        return;
      }

      const endpoint = await getHttpEndpoint({ network: "testnet" });
      const client = new TonClient({ endpoint });

      const onChainRaceAddress = Address.parse("kQDW1VLFvS3FJW5rl2tyNfQ-mOfN5nPYGPAHh1vueJsRywwm");

      await getDataFromRace(client, onChainRaceAddress);

    } catch (error) {
      console.error("Error during OnChain Race Data retrieval:", error);
    }
  };

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        {elapsedTime > 0 && (
          <>
            <ElapsedTime style={{ marginBottom: '20px' }}>Your current time:<br></br>{elapsedTime.toFixed(3)} seconds</ElapsedTime>
            <ActionsContainer>
              <StyledButton onClick={handleSaveScore} style={{ marginBottom: '10px' }}>Save Score</StyledButton>
            </ActionsContainer>
          </>
        )}
        <h1 style={{ color: 'white' }}>Top</h1>
        <ActionsContainer>
          {pageIndex > 0 && (
            <StyledButtonSecondary onClick={handlePrevPage}>Previous</StyledButtonSecondary>
          )}
        </ActionsContainer>
        <LeaderboardList>
          {paginatedScores.map((entry, index) => (
            <LeaderboardItem key={index}>
              {pageIndex * itemsPerPage + index + 1}. {formatAddress(entry.address, entry.userName)} - {entry.time.toFixed(3)} seconds
            </LeaderboardItem>
          ))}
        </LeaderboardList>
        <ActionsContainer>
          {(pageIndex + 1) * itemsPerPage < topScores.length && (
            <StyledButtonSecondary onClick={handleNextPage}>Next</StyledButtonSecondary>
          )}
        </ActionsContainer>
        <ActionsContainer>
          <StyledButton onClick={onClose}>Close</StyledButton>
        </ActionsContainer>
      </LeaderboardContent>
      {showSaveScoreWindow && (
        <SaveScoreWindowContainer>
          <SaveScoreWindowContent>
            <p>Connect your wallet to play OnChain:</p>
            <TonConnectButton />
            <StyledButtonSecondary
              onClick={handleOnChainRaceClick}
              style={{ marginTop: '10px' }}
              disabled={!rawAddress}
            >
              Save Race OnChain
            </StyledButtonSecondary>
            <StyledButtonSecondary
              onClick={handleOnChainRaceDataClick}
              style={{ marginTop: '10px' }}
              disabled={!rawAddress}
            >
              OnChain Race Data
            </StyledButtonSecondary>
            <StyledButton onClick={handleSaveScoreConfirm} style={{ marginTop: '10px' }}>Save Score</StyledButton><br></br>
            <StyledButton onClick={handleCloseSaveScoreWindow} style={{ marginTop: '10px' }}>Close</StyledButton>
          </SaveScoreWindowContent>
        </SaveScoreWindowContainer>
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
