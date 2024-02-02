import { Color, TimeoutType } from '../types';
import { Api } from './api';

export interface Event {
    eventType: string;
}

export class JamStarted implements Event {
    eventType = 'JamStarted';
}

export class JamCalled implements Event {
    eventType = 'JamStarted';
}

export enum TeamType {
    Home,
    Away,
};

export class ScoreIncremented implements Event {
    eventType = 'ScoreIncremented';
    teamType: TeamType;
    value: number;

    constructor(teamType: TeamType, value: number) {
        this.teamType = teamType;
        this.value = value;
    }
};

export class TeamColorSet implements Event {
    eventType = 'TeamColorSet';
    teamType: TeamType;
    color: Color;

    constructor(teamType: TeamType, color: Color) {
        this.teamType = teamType;
        this.color = color;
    }
};

export class TimeoutStarted implements Event {
    eventType = 'TimeoutStarted';
    timeoutType: TimeoutType;

    constructor(timeoutType: TimeoutType) {
        this.timeoutType = timeoutType;
    }
}

export class Events {
    async addEvent(gameId: string, event: Event) {
        await Api.post(`games/${gameId}/Events`, event);
    }
}