import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton } from './StyledButton';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { getLeaderboard, updateLeaderboard, LeaderboardEntry } from './gistService';

interface LeaderboardPageProps {
  elapsedTime: number;
  onClose: () => void;
  userId: string | null;
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

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ elapsedTime, onClose, userId }) => {
  const rawAddress = useTonAddress(true); // false for raw address
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showSaveScoreWindow, setShowSaveScoreWindow] = useState(false);
  const [firstName, setFirstName] = useState<string>('');
  const [onTelegram, setOnTelegram] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userIdState, setUserId] = useState<string | null>(userId);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const scores = await getLeaderboard();
      setLeaderboard(scores);
    };
    fetchLeaderboard();
  }, []);

  const handleSaveScore = async () => {
    setShowSaveScoreWindow(true);
  };

  const handleSaveScoreConfirm = async () => {
    try {
      if (!userId) {
        alert("Please open in Telegram App.");
        return;
      }
  
      const newScore: LeaderboardEntry = {
        address: rawAddress || userName || firstName, // Use userName or firstName if address is empty
        time: elapsedTime,
        playerId: userId || '',
        userName: userName || firstName, // Use userName or firstName if userName is not available
      };
  
      const existingScore = leaderboard.find(score => score.address === rawAddress || score.playerId === userId);
      if (existingScore) {
        if (elapsedTime < existingScore.time) {
          const updatedLeaderboard = leaderboard.map(score =>
            (score.address === rawAddress || score.playerId === userId) ? newScore : score
          );
          setLeaderboard(updatedLeaderboard);
          await updateLeaderboard(updatedLeaderboard);
          console.log(`Wallet Address: ${rawAddress}`);
          console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
        } else {
          const timeDifference = (elapsedTime - existingScore.time).toFixed(2);
          alert(`You were slower by ${timeDifference} seconds than your best.`);
        }
      } else {
        const updatedLeaderboard = [...leaderboard, newScore];
        setLeaderboard(updatedLeaderboard);
        await updateLeaderboard(updatedLeaderboard);
        console.log(`Wallet Address: ${rawAddress}`);
        console.log(`Elapsed Time: ${elapsedTime.toFixed(2)} seconds`);
      }
      setShowSaveScoreWindow(false);
    } catch (error) {
      console.error("Error saving score:", error);
      // Handle error saving score
    }
  }; 

  const handleSaveScoreCancel = () => {
    setShowSaveScoreWindow(false);
  };

  const formatAddress = (address: string, userName: string, firstName: string) => {
    const displayName = address || userName || firstName;
    if (displayName.length <= 9) return displayName;
    return `${displayName.slice(0, 5)}...${displayName.slice(-4)}`;
  };

  const tg = (window as any).Telegram?.WebApp;

  if (tg) {
    tg.ready(); // Ensure that Telegram Web App is fully loaded
    const searchParams = new URLSearchParams(tg.initData);

    const user = searchParams.get('user');
    if (user) {
      const userObj = JSON.parse(user);
      setOnTelegram(true);
      setUserId(userObj.id);
      setFirstName(userObj.first_name || null);
      setLastName(userObj.last_name || null);
      setUserName(userObj.username || null);
    } else {
      setOnTelegram(false);
      setUserId(null); // Set userId to null if user is undefined
      setFirstName('');
      setUserName('');
      setLastName('');
    }
  } else {
    setOnTelegram(false);
    setUserId(null); // Set userId to null if Telegram WebApp is not loaded
    setFirstName('');
    setUserName('');
    setLastName('');
  }

  return (
    <LeaderboardContainer>
      <LeaderboardContent>
        <ElapsedTime>Your Time: {elapsedTime.toFixed(2)} seconds</ElapsedTime>
        <ActionsContainer>
          {rawAddress ? (
            <StyledButton onClick={handleSaveScore}>Save Your Score</StyledButton>
          ) : (
            <TonConnectButton />
          )}
          <StyledButtonSecondary onClick={onClose}>Close</StyledButtonSecondary>
        </ActionsContainer>
        <LeaderboardList>
          {leaderboard
            .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
            .map((entry, index) => (
              <LeaderboardItem key={index}>
                {formatAddress(entry.address, entry.userName, firstName)} - {entry.time.toFixed(2)} seconds
              </LeaderboardItem>
            ))}
        </LeaderboardList>
        <div>
          {pageIndex > 0 && (
            <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>
          )}
          {(pageIndex + 1) * itemsPerPage < leaderboard.length && (
            <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
          )}
        </div>
      </LeaderboardContent>
      {showSaveScoreWindow && (
        <SaveScoreWindowContainer>
          <SaveScoreWindowContent>
            <h2>Save Your Score</h2>
            <p>Are you sure you want to save your score?</p>
            <ActionsContainer>
              <StyledButton onClick={handleSaveScoreConfirm}>Confirm</StyledButton>
              <StyledButtonSecondary onClick={handleSaveScoreCancel}>Cancel</StyledButtonSecondary>
            </ActionsContainer>
          </SaveScoreWindowContent>
        </SaveScoreWindowContainer>
      )}
    </LeaderboardContainer>
  );
};

export default LeaderboardPage;
