import { Color, ScoreboardTeam, TimeoutType } from '../types';
import { Api } from './api';

export interface ControlPanelState {
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    jamClock: JamClock;
    jamNumber: number;
    lineupClock: LineupClock;
    periodClock: PeriodClock;
    periodNumber: number;
    timeoutClock: TimeoutClock;
};

interface JamClock {
    isRunning: boolean;
    secondsRemainingInJam: number;
};

interface LineupClock {
    isRunning: boolean;
    secondsExpiredInLineup: number;
}

interface PeriodClock {
    isRunning: boolean;
    secondsRemainingInPeriod: number;
}

interface TimeoutClock {
    type: TimeoutType;
    isRunning: boolean;
    secondsExpiredInTimeout: number;
}

export class ControlPanels
{
    async getControlPanel(gameId: string): Promise<ControlPanelState> {
        const result = (await Api.get<ControlPanelState>(`games/${gameId}/ControlPanel`)).data;

        return {
            ...result,
            homeTeam: {
                ...result.homeTeam,
                color: ControlPanels.recreateColor(result.homeTeam.color),
            },
            awayTeam: {
                ...result.awayTeam,
                color: ControlPanels.recreateColor(result.awayTeam.color),
            },
        }
    }

    private static recreateColor(color: Color) {
        return new Color(
            color.hue,
            color.saturation,
            color.value
        );
    }
}