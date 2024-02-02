import { TeamType } from '../../api';
import styles from './ScoreDisplay.module.css';

interface IScoreDisplayProps {
    points: number;
    team: TeamType;
}

export const ScoreDisplay = ({ points, team }: IScoreDisplayProps) => {
    return (
        <div className={`${styles.scoreDisplay} ${team === TeamType.Home ? styles.homeScore : styles.awayScore}`}>
            <span>{points}</span>
        </div>
    );
}

export const PassScoreDisplay = ({ points }: IScoreDisplayProps) => {
    return (
        <div className={styles.passScoreDisplay}>
            <span>{points}</span>
        </div>
    )
}