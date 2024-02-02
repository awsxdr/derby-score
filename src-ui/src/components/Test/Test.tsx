import { useEffect, useCallback, useState } from 'react';
import Api, { Event, Team, ScoreIncremented, JamStarted, TeamType } from '../../api';
import { Scoreboard } from '../Scoreboard';
import { ClockContextProvider, GameContextProvider, ScoreboardContextProvider } from '../../contexts';
import { Button } from '@blueprintjs/core';

export const Test = () => {
    const [gameId, setGameId] = useState<string>('');

    const createTeamsIfNeeded = useCallback(async () => {
      const teams = await Api.Teams.getTeams();
  
      if(!teams.some(team => team.name === 'Test Team 1')) {
        await Api.Teams.createTeam('Test Team 1');
      }
  
      if(!teams.some(team => team.name === 'Test Team 2')) {
        await Api.Teams.createTeam('Test Team 2');
      }
    }, []);
  
    const createGameIfNeeded = useCallback(async (teams: Team[]) => {
      const games = await Api.Games.getGames();
  
      if(games.length === 0) {
        await Api.Games.createGame({
          homeTeam: teams.find(team => team.name === 'Test Team 1')!.id,
          awayTeam: teams.find(team => team.name === 'Test Team 2')!.id
        });
      }
    }, []);
  
    const getFirstGame = useCallback(async () => {
      const games = await Api.Games.getGames();
  
      console.log(`Games: ${JSON.stringify(games)}`);
      console.log(`First game: ${JSON.stringify(games[0])}`);
  
      return games[0];
    }, []);
    
    useEffect(() => {
      createTeamsIfNeeded()
      .then(Api.Teams.getTeams)
      .then(createGameIfNeeded)
      .then(getFirstGame)
      .then(game => setGameId(game.id));
    }, [setGameId]);

    const sendEvent = async (event: Event) =>
        await Api.Events.addEvent(gameId, event);

    const incrementHomeScore = async () =>
        await sendEvent(new ScoreIncremented(TeamType.Home, 1));

    const startJam = async () =>
        await sendEvent(new JamStarted());

    return (
        <>
            <div className='bp'>

            </div>
            { gameId &&
                <GameContextProvider gameId={gameId}>
                    <ClockContextProvider>
                        <ScoreboardContextProvider>
                            <Scoreboard />
                            <Button text="Start jam" onClick={startJam} />
                            <Button text="+1" onClick={incrementHomeScore} />
                        </ScoreboardContextProvider>
                    </ClockContextProvider>
                </GameContextProvider>
            }
        </>
    );
}