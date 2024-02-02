import { createContext, useCallback, useContext, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import { useGameContext } from './GameContext';
  
export interface ClockContextProps {
    tick: number;
};

const DefaultClockContext = (): ClockContextProps => ({
    tick: 0,
});

const ClockContext = createContext<ClockContextProps>(DefaultClockContext());

export const useClockContext = () => useContext(ClockContext);

interface ClockContextProviderProps {
};

export const ClockContextProvider = ({ children }: PropsWithChildren<ClockContextProviderProps>) => {

    const { game } = useGameContext();
    const alignmentTime = useMemo(() => game ? new Date().getTime() - game.currentTick % 1000 : 0, [game]);
    const [tick, setTick] = useState(Math.floor((new Date().getTime() - alignmentTime) / 1000));

    const setTickIfDifferent = useCallback(() => {
        const currentTick = Math.floor((new Date().getTime() - alignmentTime) / 1000);

        if(currentTick !== tick) {
            console.log(`Tick: ${currentTick} (${tick})`);
            setTick(currentTick);
        }
    }, [tick, setTick, alignmentTime]);

    useEffect(() => {
        if(!game) return;

        const interval = setInterval(() => setTickIfDifferent(), 10);

        return () => clearInterval(interval);

    }, [game, setTickIfDifferent]);

    return (
        <ClockContext.Provider value={{ tick }}>
            {children}
        </ClockContext.Provider>
    );
}