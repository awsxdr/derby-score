import { createContext, useContext, useCallback, useEffect, useState, PropsWithChildren } from 'react';
import Api, { Game } from '../api';
  
export interface GameContextProps {
    game?: Game;
};

const DefaultGameContext = (): GameContextProps => ({
    game: { 
        id: '00000000-0000-0000-0000-000000000000',
        isActive: false,
        startTick: 0,
        currentTick: 0,
    }
})

const GameContext = createContext<GameContextProps>(DefaultGameContext());

export const useGameContext = () => useContext(GameContext);

interface GameContextProviderProps {
    gameId: string;
};

export const GameContextProvider = ({ gameId, children }: PropsWithChildren<GameContextProviderProps>) => {

    const [game, setGame] = useState<Game>();

    useEffect(() => {

        Api.Games.getGame(gameId)
            .then(setGame);

    }, [gameId, setGame]);

    return (
        <GameContext.Provider value={{ game }}>
            {game && children}
        </GameContext.Provider>
    );
}