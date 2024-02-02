import styles from './Scoreboard.module.css';

import { useScoreboardContext } from "../../contexts/ScoreboardContext";
import { CountdownClock } from "../CountdownClock";
import { PassScoreDisplay, ScoreDisplay } from "../ScoreDisplay";
import { IScoreboardState, IJamScoreboardState, ILineUpScoreboardState, ITimeoutScoreboardState } from './StateTypes';
import { TimeoutsList } from '../TimeoutsList';
import Api, { TeamType } from '../../api';
import { TeamColorSidebar } from '../TeamColorSidebar';

interface IPoints {
    home: number;
    away: number;
    secondsInJam?: number;
    secondsInPeriod?: number;
    secondsInLineup?: number;
}

const getStartingPoints = (state: IScoreboardState): IPoints => {
    switch(state.gameStatus) {
        case 'Jam':
            const jamState = state as IJamScoreboardState;
            return { home: jamState.homeTeam.score, away: jamState.awayTeam.score, secondsInJam: jamState.secondsRemainingInJam, secondsInPeriod: jamState.secondsRemainingInPeriod };

        case 'LineUp':
            const lineUpState = state as ILineUpScoreboardState;
            return { home: lineUpState.homeTeam.score, away: lineUpState.awayTeam.score, secondsInPeriod: lineUpState.secondsRemainingInPeriod, secondsInLineup: lineUpState.secondsExpiredInLineUp };

        case 'Timeout':
            const timeoutState = state as ITimeoutScoreboardState;
            return { home: timeoutState.homeTeam.score, away: timeoutState.awayTeam.score };
    }

    return { home: state.homeTeam.score, away: state.awayTeam.score };
}

export const Scoreboard = () => {

    const { scoreboard, requestUpdate } = useScoreboardContext();
    const points = getStartingPoints(scoreboard);

    return (
        <div className={styles.scoreboardBackground}>
            <TeamColorSidebar color={scoreboard.homeTeam.color} side="left" />
            <div className={styles.scoreboardContainer}>
                <div className={styles.scoreboard}>
                    <div className={styles.logosContainer}>
                        <div className={styles.logoContainer}>
                            <img src={Api.Logos.getLogoUrl(scoreboard.homeTeam.logoId)} />
                        </div>
                        <div className={styles.logoContainer}>
                            <img src={Api.Logos.getLogoUrl(scoreboard.awayTeam.logoId)} />
                        </div>
                    </div>
                    <div className={styles.scoresContainer}>
                        <ScoreDisplay points={points.home} team={TeamType.Home} />
                        <PassScoreDisplay points={0} team={TeamType.Home} />
                        <PassScoreDisplay points={0} team={TeamType.Away} />
                        <ScoreDisplay points={points.away} team={TeamType.Away} />
                    </div>
                    <div className={styles.timeoutsContainer}>
                        <TimeoutsList timeoutCount={3} review="retained" team="home" isInReview />
                        <TimeoutsList timeoutCount={2} review="unused" team="away" />
                    </div>
                    <div className={styles.clocksContainer}>
                        <div className={styles.clockContainer}>
                            <span className={styles.clockLabel}>Jam:</span>
                            <span className={styles.jamClock}>{ points.secondsInJam ? <CountdownClock startTime={points.secondsInJam} onElapsed={requestUpdate} isRunning /> : 0 }</span>
                            <span className={styles.clockLabel}></span>
                        </div>
                        <div className={styles.clockContainer}>
                            <span className={styles.clockLabel}>Period:</span>
                            <span className={styles.periodClock}>{ points.secondsInPeriod ? <CountdownClock startTime={points.secondsInPeriod} isRunning /> : 0 }</span>
                            <span className={styles.clockLabel}></span>
                        </div>
                        {/* <div>
                            { 
                                scoreboardContext.scoreboard.gameStatus === 'Jam' ? <span>Jam: {points.secondsInJam ? <CountdownClock startTime={points.secondsInJam} onElapsed={scoreboardContext.requestUpdate} /> : 0 }</span>
                                : scoreboardContext.scoreboard.gameStatus === 'LineUp' ? <span>Lineup: <CountupClock startTime={points.secondsInLineup || 0} /></span>
                                : <span></span>
                            }
                        </div> */}
                    </div>
                </div>
            </div>
            <TeamColorSidebar color={scoreboard.awayTeam.color} side="right" />
        </div>
    );
}