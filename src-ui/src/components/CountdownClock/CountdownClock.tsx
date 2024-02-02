import { useCallback, useEffect, useMemo, useState } from "react";
import { useClockContext } from "../../contexts/ClockContext";

interface ICountdownClockProps {
    startTime: number;
    isRunning: boolean;
    className?: string;
    onElapsed?: () => void;
};

export const CountdownClock = ({startTime, isRunning, className, onElapsed}: ICountdownClockProps) => {

    const { tick } = useClockContext();

    const [time, setTime] = useState(isRunning ? Math.max(0, Math.floor(startTime)) : startTime);

    useEffect(() => {
        if(isRunning) {
            setTime(time => {
                const newTime = time - 1;

                if(newTime <= 0) {
                    onElapsed && onElapsed();
                }

                return newTime;
            });
        }
    }, [setTime, tick]);

    return (
        <span className={className}>
            {(
                time <= 0 ? 0
                : time >= 60 ? `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}` 
                : Math.floor(time % 60)
            )}
        </span>
    );
}