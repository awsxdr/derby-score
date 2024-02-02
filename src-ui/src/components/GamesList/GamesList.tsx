import { HTMLTable, Spinner } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Api, { Game } from '../../api';

interface GameDetails {
    id: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number;
    awayScore: number;
    status: string;
    startTick: number;
}

export const GamesList = () => {

    const [games, setGames] = useState<GameDetails[]>();

    const formatStartTime = (ticks: number) => {
        const epoch = 62135596800000;
        const date = new Date(ticks - epoch);
 
        return date.toLocaleString(navigator.language);
    }

    useEffect(() => {
        Api.Games.getGames()
            .then(async games => {
                var scoreboards = await Promise.all(games.map(async game => {
                    try {
                        var scoreboard = await Api.Scoreboards.getScoreboard(game.id);

                        return {
                            id: game.id,
                            homeTeamName: scoreboard.homeTeam.name,
                            awayTeamName: scoreboard.awayTeam.name,
                            homeScore: scoreboard.homeTeam.score,
                            awayScore: scoreboard.awayTeam.score,
                            status: scoreboard.gameStatus,
                            startTick: game.startTick,
                        }
                    } catch {
                        return null;
                    }
                }));

                return scoreboards.filter(scoreboard => scoreboard !== null).map(s => s!);
            })
            .then(game => setGames(game));
    }, [setGames]);

    return (
        <>
            { games &&
                <HTMLTable striped>
                    <thead>
                        <tr>
                            <th>Creation time</th>
                            <th>Teams</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            games.sort((a, b) => b.startTick - a.startTick).map(game => (
                                <tr key={`game_${game.id}`}>
                                    <td>{formatStartTime(game.startTick)}</td>
                                    <td>{game.homeTeamName} vs {game.awayTeamName}</td>
                                    <td>{game.homeScore} - {game.awayScore}</td>
                                    <td>{game.status}</td>
                                    <td><Link to={`/games/${game.id}/controlPanel`}>Control panel</Link></td>
                                    <td><Link to={`/games/${game.id}/scoreboard`} target="_blank">Scoreboard</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </HTMLTable>
            }
            { !games &&
                <Spinner />
            }
        </>
    );
}