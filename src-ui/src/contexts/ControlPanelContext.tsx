import { createContext, useContext, useCallback, useState, PropsWithChildren, useEffect } from "react";
import { useGameContext } from "./GameContext";
import Api, { ControlPanelState } from "../api";
import * as signalR from '@microsoft/signalr';
import { Color, TimeoutType } from "../types";
import { useClockContext } from "./ClockContext";

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

export interface ControlPanelContextProps {
    hasLoaded: boolean;
    controlPanel: ControlPanelState;
    requestUpdate: () => void;
};

const DefaultControlPanelContext = (): ControlPanelContextProps => ({
    hasLoaded: false,
    controlPanel: {
        homeTeam: BlankTeam,
        awayTeam: BlankTeam,
        jamClock: { isRunning: false, secondsRemainingInJam: 0},
        jamNumber: 0,
        lineupClock: { isRunning: false, secondsExpiredInLineup: 0},
        periodClock: { isRunning: false, secondsRemainingInPeriod: 0},
        periodNumber: 0,
        timeoutClock: { type: TimeoutType.Generic, isRunning: false, secondsExpiredInTimeout: 0},
    },
    requestUpdate: () => { },
});

const ControlPanelContext = createContext<ControlPanelContextProps>(DefaultControlPanelContext());

export const useControlPanelContext = () => useContext(ControlPanelContext);

interface ControlPanelContextProviderProps {
};

export const ControlPanelContextProvider = ({ children }: PropsWithChildren<ControlPanelContextProviderProps>) => { 

    const { game } = useGameContext();
    const { tick } = useClockContext();

    const [controlPanel, setControlPanel] = useState<ControlPanelState>(DefaultControlPanelContext().controlPanel);
    const [hasLoaded, setHasLoaded] = useState(false);

    const updateState = useCallback(() => {
        Api.ControlPanels.getControlPanel(game!.id)
        .then(controlPanel => {
            setControlPanel({ 
                ...controlPanel, 
                periodClock: {
                    ...controlPanel.periodClock, 
                    secondsRemainingInPeriod: controlPanel.periodClock.secondsRemainingInPeriod + tick 
                }
            });
        });
    }, [game, setControlPanel]);
    
    const setupControlPanel = useCallback(async () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7148/hubs/controlPanel')
            .build();
    
        hubConnection.on('stateUpdated', () => {
            console.log('stateUpdated');
            updateState();
        });
    
        hubConnection.onclose(() => {
          console.log('Connection to hub lost');
        });
    
        hubConnection.start()
          .then(() => console.log('Successfully connected to hub'))
          .catch(reason => console.log(`Error connecting to hub: ${reason}`));

        setHasLoaded(true);
    
    }, [setHasLoaded]);

    useEffect(() => {
        Api.ControlPanels.getControlPanel(game!.id)
            .then(setControlPanel)
            .then(setupControlPanel);
    }, [setupControlPanel]);

    return (
        <ControlPanelContext.Provider value={{ hasLoaded, controlPanel, requestUpdate: updateState }}>
            { children }
        </ControlPanelContext.Provider>
    ); 
}