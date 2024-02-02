import styles from './TimeoutsList.module.css';
import { Icon } from '@blueprintjs/core';

interface ITimeoutsListProps {
    className?: string;
    timeoutCount: number;
    review: 'unused' | 'retained' | 'lost';
    team: 'home' | 'away';
    isInTimeout?: boolean;
    isInReview?: boolean;
}

export const TimeoutsList = ({ className, timeoutCount, review, team, isInTimeout, isInReview }: ITimeoutsListProps) => {

    const reviewColor =
        review === 'unused' ? '#bbb'
        : review === 'retained' ? '#0b0'
        : 'transparent';

    return (
        <div className={`${styles.teamTimeouts} ${className && className}`}>
            <div className={`${styles.timeoutsInnerContainer} ${isInTimeout && styles.inTimeout}`}>
                {
                    Array.from(Array(timeoutCount)).map(() => 
                        <Icon icon="stopwatch" size={40} color="#bbb" />
                    )
                }
            </div>
            <div className={`${styles.reviewsContainer} ${isInReview && styles.inTimeout}`}>
                <Icon icon="eye-open" size={40} color={reviewColor} />
            </div>
        </div>
    );
}