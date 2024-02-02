import { createContext, useContext, useCallback, useState, PropsWithChildren, useEffect } from "react";
import { useGameContext } from "./GameContext";
import Api, { ScoreboardState } from "../api";
import * as signalR from '@microsoft/signalr';
import { Color } from "../types";

const BlankGuid = '00000000-0000-0000-0000-000000000000';

const BlankTeam = {
    name: '',
    logoId: BlankGuid,
    score: 0,
    timeoutsRemaining: 0,
    hasUsedOfficialReview: false,
    hasRetainedOfficialReview: false,
    isLead: false,
    jammerId: BlankGuid,
    color: new Color(0, 0, 0),
};

export interface ScoreboardContextProps {
    scoreboard: ScoreboardState;
    requestUpdate: () => void;
};

const DefaultScoreboardContext = (): ScoreboardContextProps => ({
    scoreboard: {
        gameStatus: 'Idle',
        homeTeam: BlankTeam,
        awayTeam: BlankTeam,
    },
    requestUpdate: () => { }
});

const ScoreboardContext = createContext<ScoreboardContextProps>(DefaultScoreboardContext());

export const useScoreboardContext = () => useContext(ScoreboardContext);

interface ScoreboardContextProviderProps {
};

export const ScoreboardContextProvider = ({ children }: PropsWithChildren<ScoreboardContextProviderProps>) => { 

    const gameContext = useGameContext();

    const [scoreboard, setScoreboard] = useState<ScoreboardState>(DefaultScoreboardContext().scoreboard);

    const setupScoreboard = useCallback(async () => {
        const scoreboard = await Api.Scoreboards.getScoreboard(gameContext.game!.id);

        setScoreboard(scoreboard);

        const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7148/hubs/scoreboard')
        .build();
    
        hubConnection.on('stateUpdated', () => {
            Api.Scoreboards.getScoreboard(gameContext.game!.id).then(setScoreboard);
        });
    
        hubConnection.onclose(() => {
          console.log('Connection to hub lost');
        });
    
        hubConnection.start()
          .then(() => console.log('Successfully connected to hub'))
          .catch(reason => console.log(`Error connecting to hub: ${reason}`));
    
      }, []);

    useEffect(() => {
        setupScoreboard();
    }, []);

    const updateState = useCallback(() => {
        Api.Scoreboards.getScoreboard(gameContext.game!.id).then(setScoreboard);
    }, [gameContext, setScoreboard]);
    
    return (
        <ScoreboardContext.Provider value={{ scoreboard, requestUpdate: updateState }}>
            { children }
        </ScoreboardContext.Provider>
    ); 
}