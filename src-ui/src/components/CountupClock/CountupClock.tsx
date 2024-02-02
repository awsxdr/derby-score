import { useCallback, useEffect, useState } from "react";
import { useClockContext } from "../../contexts/ClockContext";

interface ICountupClockProps {
    startTime: number;
    isRunning: boolean;
    className?: string;
};

export const CountupClock = ({ startTime, isRunning, className }: ICountupClockProps) => {

    const { tick } = useClockContext();

    const [time, setTime] = useState(isRunning ? Math.max(0, Math.floor(startTime)) : startTime);

    useEffect(() => {
        if(isRunning) {
            setTime(time => time + 1);
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