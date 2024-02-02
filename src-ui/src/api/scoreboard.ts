import { Color, ScoreboardTeam, TimeoutType } from '../types';
import { Api } from './api';

export interface ScoreboardState {
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: string;
}

export interface IdleScoreboardState extends ScoreboardState {
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'Idle';
}

export interface PreGameScoreboardState extends ScoreboardState {
    gameStartTime: string;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'PreGame';
};

export interface JamScoreboardState extends ScoreboardState {
    secondsRemainingInJam: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'Jam';
};

export interface LineUpScoreboardState {
    secondsExpiredInLineUp: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'LineUp';
};

export interface TimeoutScoreboardState {
    type: TimeoutType;
    secondsExpiredInTimeout: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'Timeout';
};

export interface IntermissionScoreboardState {
    secondsRemainingInIntermission: number;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'Intermission';
};

export interface PostGameScoreboardState {
    scoreIsFinal: boolean;
    homeTeam: ScoreboardTeam;
    awayTeam: ScoreboardTeam;
    gameStatus: 'PostGame';
};

export class Scoreboards
{
    async getScoreboard(gameId: string): Promise<ScoreboardState> {
        const result = (await Api.get<ScoreboardState>(`games/${gameId}/Scoreboard`)).data;

        return {
            ...result,
            homeTeam: {
                ...result.homeTeam,
                color: Scoreboards.recreateColor(result.homeTeam.color),
            },
            awayTeam: {
                ...result.awayTeam,
                color: Scoreboards.recreateColor(result.awayTeam.color),
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