import styles from './ControlPanelClock.module.css';
import { Card, H3 } from "@blueprintjs/core";
import { CountupClock } from '../CountupClock';
import { CountdownClock } from '../CountdownClock';

interface IControlPanelClockProps {
    title: string;
    direction: 'up' | 'down';
    startTime: number;
    isRunning: boolean;
    onClockExpired?: () => void;
}

export const ControlPanelClock = ({ title, direction, startTime, isRunning, onClockExpired }: IControlPanelClockProps) => {
    return (
        <Card className={styles.controlPanelClock}>
            <H3>{title}</H3>
            { direction === 'up' 
                ? <CountupClock startTime={startTime} isRunning={isRunning} className={styles.clock} /> 
                : <CountdownClock startTime={startTime} isRunning={isRunning} onElapsed={onClockExpired} className={styles.clock} />
            }
        </Card>
    );
}