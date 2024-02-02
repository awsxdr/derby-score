interface IScoreboardTeam {
    name: string;
    logoId: string;
    score: number;
    timeoutsRemaining: number;
    hasUsedOfficialReview: boolean;
    hasRetainedOfficialReview: boolean;
    isLead: boolean;
    jammerId: string;
}

enum TimeoutType {
    Generic,
    HomeTeam,
    AwayTeam,
    HomeTeamReview,
    AwayTeamReview,
    Official,
};

export interface IScoreboardState {
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: string;
}

export interface IIdleScoreboardState extends IScoreboardState {
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'Idle';
}

export interface IPreGameScoreboardState extends IScoreboardState {
    gameStartTime: string;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'PreGame';
};

export interface IJamScoreboardState extends IScoreboardState {
    secondsRemainingInJam: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'Jam';
};

export interface ILineUpScoreboardState {
    secondsExpiredInLineUp: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'LineUp';
};

export interface ITimeoutScoreboardState {
    type: TimeoutType;
    secondsExpiredInTimeout: number;
    secondsRemainingInPeriod: number;
    jamNumber: number;
    periodNumber: number;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'Timeout';
};

export interface IIntermissionScoreboardState {
    secondsRemainingInIntermission: number;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'Intermission';
};

export interface IPostGameScoreboardState {
    scoreIsFinal: boolean;
    homeTeam: IScoreboardTeam;
    awayTeam: IScoreboardTeam;
    gameStatus: 'PostGame';
};

export interface IIScoreboardTeam {
    name: string;
    logoId: string;
    score: number;
    timeoutsRemaining: number;
    hasUsedOfficialReview: boolean;
    hasRetainedOfficialReview: boolean;
    isLead: boolean;
    jammerId: string;
};