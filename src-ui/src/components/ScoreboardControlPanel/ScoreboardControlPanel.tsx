import styles from './ScoreboardControlPanel.module.css';

import { useCallback, useMemo, useState } from 'react';
import Api, { ScoreIncremented, TeamType } from "../../api";
import { useClockContext, useControlPanelContext, useGameContext } from "../../contexts";
import { ScoreModifier } from "../ScoreModifier";
import { Button, H2 } from '@blueprintjs/core';
import { TeamControlButtons } from '../TeamControlButtons';
import { ControlPanelClock } from '../ControlPanelClock';
import { ControlButtons } from '../ControlButtons';
import { JamCalled, JamStarted, TimeoutStarted } from '../../api/events';
import { TimeoutType } from '../../types';
import { CountdownClock } from '../CountdownClock';

export const ScoreboardControlPanel = () => {

    const { game } = useGameContext();
    const { hasLoaded: controlPanelHasLoaded, controlPanel, requestUpdate } = useControlPanelContext();

    const [ homeTeamLead, setHomeTeamLead ] = useState(false);
    const [ homeTeamLostLead, setHomeTeamLostLead ] = useState(false);
    const [ awayTeamLead, setAwayTeamLead ] = useState(false);
    const [ awayTeamLostLead, setAwayTeamLostLead ] = useState(false);

    const useHandleScoreChange = (team: TeamType) => useCallback((amount: number) => {
        Api.Events.addEvent(game!.id, new ScoreIncremented(team, amount));
    }, []);

    const handleHomeScoreChange = useHandleScoreChange(TeamType.Home);
    const handleAwayScoreChange = useHandleScoreChange(TeamType.Away);

    const handleHomeTeamLeadToggle = () => {
        if(homeTeamLead) {
            setHomeTeamLead(false);
        } else {
            setHomeTeamLead(true);
            setAwayTeamLead(false);
        }
    }

    const handleAwayTeamLeadToggle = () => {
        if(awayTeamLead) {
            setAwayTeamLead(false);
        } else {
            setAwayTeamLead(true);
            setHomeTeamLead(false);
        }
    }

    const handleHomeTeamLostLeadToggle = () =>
        setHomeTeamLostLead(lostLead => !lostLead);

    const handleAwayTeamLostLeadToggle = () =>
        setAwayTeamLostLead(lostLead => !lostLead);

    const handleJamStart = () => {
        Api.Events.addEvent(game!.id, new JamStarted());
    }

    const handleJamCalled = () => {
        Api.Events.addEvent(game!.id, new JamCalled());
    }

    const handleTimeout = () => {
        Api.Events.addEvent(game!.id, new TimeoutStarted(TimeoutType.Generic));
    }

    if(!controlPanelHasLoaded) {
        return (<></>);
    }

    return (
        <>
            <div className={styles.teamsContainer}>
                <div className={styles.teamContainer}>
                    <ScoreModifier team={TeamType.Home} score={controlPanel.homeTeam.score} onScoreChange={handleHomeScoreChange} />
                    <H2>{controlPanel.homeTeam.name}</H2>
                    <TeamControlButtons 
                        team={TeamType.Home}
                        isLead={homeTeamLead} 
                        hasLostLead={homeTeamLostLead} 
                        onLeadToggle={handleHomeTeamLeadToggle} 
                        onLostLeadToggle={handleHomeTeamLostLeadToggle} 
                    />
                </div>
                <div className={styles.teamContainer}>
                    <ScoreModifier team={TeamType.Away} score={controlPanel.awayTeam.score} onScoreChange={handleAwayScoreChange} />
                    <H2>{controlPanel.awayTeam.name}</H2>
                    <TeamControlButtons 
                        team={TeamType.Away}
                        isLead={awayTeamLead} 
                        hasLostLead={awayTeamLostLead} 
                        onLeadToggle={handleAwayTeamLeadToggle} 
                        onLostLeadToggle={handleAwayTeamLostLeadToggle} />
                </div>
            </div>
            <div className={styles.controlButtons}>
                <ControlButtons 
                    isJamRunning={controlPanel.jamClock.isRunning} 
                    onStartJam={handleJamStart} 
                    onCallJam={handleJamCalled} 
                    onStartTimeout={handleTimeout} 
                />
            </div>
            <div className={styles.padding}></div>
            <div className={styles.clocksContainer}>
                <ControlPanelClock 
                    title={`Period ${controlPanel.periodNumber}`}
                    direction='down' 
                    startTime={controlPanel.periodClock.secondsRemainingInPeriod} 
                    isRunning={controlPanel.periodClock.isRunning} />
                <ControlPanelClock 
                    title={`Jam ${controlPanel.jamNumber}`}
                    direction='down' 
                    startTime={controlPanel.jamClock.secondsRemainingInJam}
                    isRunning={controlPanel.jamClock.isRunning}
                    onClockExpired={requestUpdate} />
                <ControlPanelClock 
                    title='Lineup' 
                    direction='up' 
                    startTime={controlPanel.lineupClock.secondsExpiredInLineup} 
                    isRunning={controlPanel.lineupClock.isRunning} />
                <ControlPanelClock 
                    title='Timeout' 
                    direction='up' 
                    startTime={controlPanel.timeoutClock.secondsExpiredInTimeout} 
                    isRunning={controlPanel.timeoutClock.isRunning} />
            </div>
        </>
    );
}