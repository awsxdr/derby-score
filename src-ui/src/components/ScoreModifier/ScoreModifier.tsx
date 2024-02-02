import styles from './ScoreModifier.module.css';

import { Button } from "@blueprintjs/core";
import { TeamType } from '../../api';
import { useHotkeys } from 'react-hotkeys-hook';

interface IScoreModifierProps {
    team: TeamType;
    score: number;
    onScoreChange: (value: number) => void;
};

export const ScoreModifier = ({ team, score, onScoreChange }: IScoreModifierProps) => {

    const hotkeyOptions = {
        enableOnFormTags: true,
        preventDefault: true,
    };

    useHotkeys(team === TeamType.Home ? 'shift+a' : 'shift+@', () => onScoreChange(-4), hotkeyOptions, [onScoreChange]);
    useHotkeys(team === TeamType.Home ? 'a' : '\'', () => onScoreChange(-1), hotkeyOptions, [onScoreChange]);
    useHotkeys(team === TeamType.Home ? 's' : '#', () => onScoreChange(1), hotkeyOptions, [onScoreChange]);
    useHotkeys(team === TeamType.Home ? 'shift+s' : 'shift+~', () => onScoreChange(4), hotkeyOptions, [onScoreChange]);

    return (
        <div className={styles.scoreModifier}>
            <div className={styles.buttonsContainer}>
                <Button large onClick={() => onScoreChange(-4)}>-4</Button>
                <Button large onClick={() => onScoreChange(-1)}>-1</Button>
            </div>
            <div className={styles.scoreContainer}>
                <span>{score}</span>
            </div>
            <div className={styles.buttonsContainer}>
                <Button large onClick={() => onScoreChange(1)}>+1</Button>
                <Button large onClick={() => onScoreChange(4)}>+4</Button>
            </div>
        </div>
    );
};