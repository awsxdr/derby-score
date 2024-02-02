import { useParams } from 'react-router-dom';
import { Scoreboard } from '../Scoreboard/Scoreboard';
import { ClockContextProvider, GameContextProvider, ScoreboardContextProvider } from '../../contexts';

export const ScoreboardPage = () => {

    const { gameId } = useParams();

    if(!gameId) return (<></>);

    return (
        <GameContextProvider gameId={gameId}>
            <ClockContextProvider>
                <ScoreboardContextProvider>
                    <Scoreboard />
                </ScoreboardContextProvider>
            </ClockContextProvider>
        </GameContextProvider>
    );
};